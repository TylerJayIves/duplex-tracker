import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  describe("allowed through unchanged", () => {
    it.each(["/", "/projects/5", "/projects?tab=quotes", "/projects/5#notes"])(
      "allows %s",
      (path) => {
        expect(safeNext(path)).toBe(path);
      },
    );
  });

  describe("falls back to /", () => {
    it.each([
      null,
      "",
      "http://evil.com",
      "https://evil.com",
      "evil.com",
      "//evil.com",
      "/\\evil.com",
      "/\\\\evil.com",
      "/\t/evil.com",
      "/\n/evil.com",
    ])("does not allow %j", (path) => {
      expect(safeNext(path)).toBe("/");
    });
  });
});
