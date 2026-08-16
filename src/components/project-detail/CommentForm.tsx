"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addCommentAction } from "@/lib/actions/comments";
import type { Comment } from "@/lib/data/types";

export function CommentForm({
  projectId,
  authorId,
  onOptimisticAdd,
}: {
  projectId: string;
  authorId: string;
  onOptimisticAdd: (comment: Comment) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;

    startTransition(async () => {
      onOptimisticAdd({
        id: `optimistic-${Date.now()}`,
        projectId,
        authorId,
        text,
        createdAt: new Date().toISOString(),
      });
      formRef.current?.reset();
      await addCommentAction(projectId, authorId, text);
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2">
      <textarea
        name="text"
        rows={2}
        placeholder="Leave a note for each other..."
        required
        className="flex-1 resize-none border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button type="submit" disabled={isPending} className="self-end">
        Post
      </Button>
    </form>
  );
}
