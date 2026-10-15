import type { Task, Project, Quote, Contractor } from "@/lib/data/types";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  checklistTotals,
  sortAttentionItems,
  findOverBudgetItems,
  findOverdueTaskItems,
  type AttentionItem,
  findQuoteAttentionItems,
} from "./dashboard";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    projectId: "project-1",
    assignedToId: null,
    title: "Test task",
    isDone: false,
    order: 0,
    dueDate: null,
    ...overrides,
  };
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    areaId: "area-1",
    leadId: "user-1",
    title: "Test project",
    description: "",
    category: "General",
    status: "in_progress",
    priority: "medium",
    startDate: null,
    targetEndDate: null,
    color: null,
    ...overrides,
  };
}

type BudgetInput = {
  id: string;
  name: string;
  limitCents: number;
  committedCents: number;
};

function makeBudgetInput(overrides: Partial<BudgetInput> = {}): BudgetInput {
  return {
    id: "budget-1",
    name: "Test budget",
    limitCents: 0,
    committedCents: 0,
    ...overrides,
  };
}

function makeAttentionItem(
  overrides: Partial<AttentionItem> = {},
): AttentionItem {
  return {
    id: "item",
    tone: "amber",
    tag: "Test",
    title: "Test item",
    meta: "",
    urgency: 0,
    ...overrides,
  };
}

function makeQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    id: "quote-1",
    projectId: "project-1",
    contractorId: "contractor-1",
    amountCents: 50_000,
    scopeDescription: "",
    status: "received",
    receivedDate: null,
    validUntil: null,
    ...overrides,
  };
}

function makeContractor(overrides: Partial<Contractor> = {}): Contractor {
  return {
    id: "contractor-1",
    name: "",
    company: "test-company",
    phone: "",
    email: "",
    trade: "",
    notes: "",
    rating: 3,
    ...overrides,
  };
}

describe("checklistTotals", () => {
  it("counts done and total tasks across several lists", () => {
    const tasksLists = [
      [
        makeTask({ isDone: true }),
        makeTask({ isDone: false }),
        makeTask({ isDone: false }),
      ],
      [
        makeTask({ isDone: true }),
        makeTask({ isDone: false }),
        makeTask({ isDone: true }),
      ],
    ];

    const result = checklistTotals(tasksLists);

    expect(result).toEqual({ done: 3, total: 6 });
  });

  it("counts done and total when every task is done", () => {
    const tasksLists = [
      [
        makeTask({ isDone: true }),
        makeTask({ isDone: true }),
        makeTask({ isDone: true }),
      ],
    ];

    const result = checklistTotals(tasksLists);

    expect(result).toEqual({ done: 3, total: 3 });
  });

  it("counts done and total when no task is done", () => {
    const tasksLists = [
      [
        makeTask({ isDone: false }),
        makeTask({ isDone: false }),
        makeTask({ isDone: false }),
      ],
    ];

    const result = checklistTotals(tasksLists);

    expect(result).toEqual({ done: 0, total: 3 });
  });

  it("returns zero totals when there are no lists", () => {
    const tasksLists: Task[][] = [];

    const result = checklistTotals(tasksLists);

    expect(result).toEqual({ done: 0, total: 0 });
  });

  it("returns zero totals when every list is empty", () => {
    const tasksLists: Task[][] = [[], []];

    const result = checklistTotals(tasksLists);

    expect(result).toEqual({ done: 0, total: 0 });
  });
});

describe("sortAttentionItems", () => {
  it("puts brick items before amber items", () => {
    const items = [
      makeAttentionItem({ id: "amber", tone: "amber" }),
      makeAttentionItem({ id: "brick", tone: "brick" }),
    ];

    const result = sortAttentionItems(items);

    expect(result.map((item) => item.id)).toEqual(["brick", "amber"]);
  });

  it("sorts items of the same tone by urgency, lowest first", () => {
    const items = [
      makeAttentionItem({ id: "a", tone: "brick", urgency: 2 }),
      makeAttentionItem({ id: "c", tone: "brick", urgency: -1 }),
      makeAttentionItem({ id: "b", tone: "brick", urgency: 1 }),
    ];

    const result = sortAttentionItems(items);

    expect(result.map((item) => item.id)).toEqual(["c", "b", "a"]);
  });

  it("puts overdue items (negative urgency) before upcoming ones", () => {
    const items = [
      makeAttentionItem({ id: "a", tone: "brick", urgency: 2 }),
      makeAttentionItem({ id: "b", tone: "brick", urgency: -3 }),
    ];

    const result = sortAttentionItems(items);

    expect(result.map((item) => item.id)).toEqual(["b", "a"]);
  });

  it("sorts based on tone before sorting by urgency", () => {
    const items = [
      makeAttentionItem({ id: "a", tone: "amber", urgency: -10 }),
      makeAttentionItem({ id: "b", tone: "brick", urgency: 15 }),
      makeAttentionItem({ id: "c", tone: "brick", urgency: 50 }),
    ];

    const result = sortAttentionItems(items);

    expect(result.map((item) => item.id)).toEqual(["b", "c", "a"]);
  });

  it("does not change the order of the original list", () => {
    const items = [
      makeAttentionItem({ id: "b", tone: "amber", urgency: 3 }),
      makeAttentionItem({ id: "c", tone: "amber", urgency: 2 }),
      makeAttentionItem({ id: "a", tone: "amber", urgency: 1 }),
    ];

    const result = sortAttentionItems(items);

    expect(result.map((item) => item.id)).toEqual(["a", "c", "b"]);

    expect(items.map((item) => item.id)).toEqual(["b", "c", "a"]);
  });
});

describe("findOverBudgetItems", () => {
  it("returns over budget when committed exceeds limit", () => {
    const items = [
      makeBudgetInput({
        id: "over",
        limitCents: 5000,
        committedCents: 6000,
      }),
    ];

    const result = findOverBudgetItems(items);

    expect(result.map((item) => item.id)).toEqual(["budget-over"]);
  });

  it("returns nothing when committed is less than limit", () => {
    const items = [
      makeBudgetInput({
        id: "under",
        limitCents: 5000,
        committedCents: 1000,
      }),
    ];

    const result = findOverBudgetItems(items);

    expect(result.map((item) => item.id)).toEqual([]);
  });

  it("flags any spending against a $0 limit as over budget", () => {
    const items = [
      makeBudgetInput({
        id: "zeroLimit-over",
        limitCents: 0,
        committedCents: 50,
      }),
    ];

    const result = findOverBudgetItems(items);

    expect(result.map((item) => item.id)).toEqual(["budget-zeroLimit-over"]);
  });

  it("returns only the over-budget items from a mixed list", () => {
    const items = [
      makeBudgetInput({
        id: "over",
        limitCents: 5000,
        committedCents: 7500,
      }),
      makeBudgetInput({
        id: "under",
        limitCents: 5000,
        committedCents: 1000,
      }),
    ];

    const result = findOverBudgetItems(items);

    expect(result.map((item) => item.id)).toEqual(["budget-over"]);
  });

  describe("the critical threshold", () => {
    it("excludes a budget that is exactly at its limit", () => {
      const items = [
        makeBudgetInput({
          id: "at-limit",
          limitCents: 5000,
          committedCents: 5000,
        }),
      ];

      const result = findOverBudgetItems(items);

      expect(result.map((item) => item.id)).toEqual([]);
    });

    it("excludes a budget in the attention zone (85-100% spent)", () => {
      const items = [
        makeBudgetInput({
          id: "attention",
          limitCents: 5000,
          committedCents: 4500,
        }),
      ];

      const result = findOverBudgetItems(items);

      expect(result).toEqual([]);
    });

    it("includes a budget that is one cent over its limit", () => {
      const items = [
        makeBudgetInput({
          id: "one-over",
          limitCents: 5000,
          committedCents: 5001,
        }),
      ];

      const result = findOverBudgetItems(items);

      expect(result.map((item) => item.id)).toEqual(["budget-one-over"]);
    });
  });

  it("returns nothing when limit and committed are both zero", () => {
    const items = [
      makeBudgetInput({
        id: "noneSet",
        limitCents: 0,
        committedCents: 0,
      }),
    ];

    const result = findOverBudgetItems(items);

    expect(result.map((item) => item.id)).toEqual([]);
  });

  it("builds a complete attention item for an over-budget input", () => {
    const items = [
      makeBudgetInput({
        id: "kitchen",
        name: "Kitchen",
        limitCents: 5000,
        committedCents: 6000,
      }),
    ];

    const result = findOverBudgetItems(items);

    expect(result).toEqual([
      {
        id: "budget-kitchen",
        tone: "brick",
        tag: "Over budget",
        title: "Kitchen is over budget",
        meta: "$60.00 committed against a $50.00 limit",
        urgency: -1000,
      },
    ]);
  });
});

describe("findOverdueTaskItems", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-15T17:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns nothing when no task is overdue", () => {
    const bundles = [
      {
        project: makeProject(),
        tasks: [makeTask({ dueDate: "2026-10-20" })],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result).toEqual([]);
  });

  it("returns nothing when the task is due today", () => {
    const bundles = [
      {
        project: makeProject(),
        tasks: [makeTask({ dueDate: "2026-10-15" })],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result).toEqual([]);
  });

  it("returns nothing when an overdue task is already done", () => {
    const bundles = [
      {
        project: makeProject(),
        tasks: [makeTask({ dueDate: "2026-10-10", isDone: true })],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result).toEqual([]);
  });

  it("returns nothing when the task has no due date", () => {
    const bundles = [
      {
        project: makeProject(),
        tasks: [makeTask({ dueDate: null })],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result).toEqual([]);
  });

  it('says "days" in the title when more than one day overdue', () => {
    const bundles = [
      {
        project: makeProject(),
        tasks: [makeTask({ dueDate: "2026-10-12" })],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result.map((item) => item.title)).toEqual([
      '"Test task" is 3 days overdue',
    ]);
  });

  it('says "day" in the title when exactly one day overdue', () => {
    const bundles = [
      {
        project: makeProject(),
        tasks: [makeTask({ dueDate: "2026-10-14" })],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result.map((item) => item.title)).toEqual([
      '"Test task" is 1 day overdue',
    ]);
  });

  it("returns overdue tasks from every project, skipping ones not yet due", () => {
    const bundles = [
      {
        project: makeProject({ id: "kitchen" }),
        tasks: [
          makeTask({ id: "kitchen-one", dueDate: "2026-10-22" }),
          makeTask({ id: "kitchen-two", dueDate: "2026-10-12" }),
        ],
      },
      {
        project: makeProject({ id: "bathroom" }),
        tasks: [
          makeTask({ id: "task-one", dueDate: "2026-10-25" }),
          makeTask({ id: "task-two", dueDate: "2026-10-12" }),
        ],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result.map((item) => item.projectId)).toEqual([
      "kitchen",
      "bathroom",
    ]);
  });

  it("builds the expected object when task is overdue", () => {
    const bundles = [
      {
        project: makeProject(),
        tasks: [makeTask({ dueDate: "2026-10-14" })],
      },
    ];

    const result = findOverdueTaskItems(bundles);

    expect(result).toEqual([
      {
        id: "task-task-1",
        projectId: "project-1",
        tag: "Overdue",
        meta: "Test project · due Oct 14, 2026",
        title: '"Test task" is 1 day overdue',
        tone: "brick",
        urgency: -1,
      },
    ]);
  });
});

describe("findQuoteAttentionItems", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-15T17:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("flags an expired quote and one expiring within 14 days", () => {
    const bundles = [
      {
        project: makeProject(),
        quotes: [
          makeQuote({
            validUntil: "2026-10-14",
            id: "expired",
          }),
          makeQuote({
            validUntil: "2026-10-21",
            id: "expires soon",
          }),
        ],
      },
    ];

    const result = findQuoteAttentionItems(bundles, new Map());

    expect(result.map((item) => item.id)).toEqual([
      "quote-expired",
      "quote-expires soon",
    ]);
  });

  it("does not flag quotes with the status accepted or declined", () => {
    const bundles = [
      {
        project: makeProject(),
        quotes: [
          makeQuote({
            id: "accepted-status",
            status: "accepted",
          }),
          makeQuote({
            id: "declined-status",
            status: "declined",
          }),
          makeQuote({
            id: "requested-status",
            status: "requested",
          }),
          makeQuote({
            id: "received-status",
            status: "received",
          }),
        ],
      },
    ];

    const result = findQuoteAttentionItems(bundles, new Map());

    expect(result.map((item) => item.id)).toEqual([
      "quote-requested-status",
      "quote-received-status",
    ]);
  });

  it("a quote 14 days from expiry is ‘Expires soon’, one 15 days away is ‘Awaiting you’", () => {
    const bundles = [
      {
        project: makeProject(),
        quotes: [
          makeQuote({
            validUntil: "2026-10-29",
            id: "expires-soon",
          }),

          makeQuote({
            validUntil: "2026-10-30",
            id: "not-expiring",
          }),
        ],
      },
    ];

    const result = findQuoteAttentionItems(bundles, new Map());

    expect(result.map((item) => item.tag)).toEqual([
      "Expires soon",
      "Awaiting you",
    ]);
  });

  it("a quote 3 days from expiry has the tone of 'brick', one 4 days away is ‘amber’", () => {
    const bundles = [
      {
        project: makeProject(),
        quotes: [
          makeQuote({
            validUntil: "2026-10-18",
            id: "tone-brick",
          }),

          makeQuote({
            validUntil: "2026-10-19",
            id: "tone-amber",
          }),
        ],
      },
    ];

    const result = findQuoteAttentionItems(bundles, new Map());

    expect(result.map((item) => item.tone)).toEqual(["brick", "amber"]);
  });

  it("uses the contractor's company name in the title when the contractor is known", () => {
    const contractor = makeContractor({ company: "Ace Plumbing" });
    const contractorById = new Map([[contractor.id, contractor]]);

    const bundles = [
      {
        project: makeProject(),
        quotes: [makeQuote({ id: "expired", validUntil: "2026-10-14" })],
      },
    ];

    const result = findQuoteAttentionItems(bundles, contractorById);

    expect(result.map((item) => item.title)).toEqual([
      "Ace Plumbing's quote has expired",
    ]);
  });

  it("builds a complete 'Awaiting you' item for a quote with no expiry date", () => {
    const bundles = [
      {
        project: makeProject(),
        quotes: [makeQuote({ id: "awaiting", validUntil: null })],
      },
    ];

    const result = findQuoteAttentionItems(bundles, new Map());

    expect(result).toEqual([
      {
        id: "quote-awaiting",
        tone: "amber",
        tag: "Awaiting you",
        title: "A contractor's quote needs a decision",
        meta: "Test project · $500.00",
        projectId: "project-1",
        urgency: 1000,
      },
    ]);
  });

  it("builds a complete 'Expiring soon' item for a quote ending in 4 days", () => {
    const bundles = [
      {
        project: makeProject(),
        quotes: [makeQuote({ id: "expires-soon", validUntil: "2026-10-19" })],
      },
    ];

    const result = findQuoteAttentionItems(bundles, new Map());

    expect(result).toEqual([
      {
        id: "quote-expires-soon",
        tone: "amber",
        tag: "Expires soon",
        title: "A contractor's quote expires in 4 days",
        meta: "Test project · $500.00 · valid until Oct 19, 2026",
        projectId: "project-1",
        urgency: 4,
      },
    ]);
  });

  it("sets title to use singular language when only 1 days remains before expire", () => {
    const bundles = [
      {
        project: makeProject(),
        quotes: [makeQuote({ id: "expires-soon", validUntil: "2026-10-16" })],
      },
    ];

    const result = findQuoteAttentionItems(bundles, new Map());

    expect(result.map((item) => item.title)).toEqual([
      "A contractor's quote expires in 1 day",
    ]);
  });
});
