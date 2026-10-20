import { describe, expect, it } from "vitest";
import { avatarColor } from "./avatar-color";

describe("avatarColor", () => {
  it("always gives the same name the same colour", () => {
    expect(avatarColor("Tyler")).toBe(avatarColor("Tyler"));
  });

  it("gives Tyler and Elle different colours (live site)", () => {
    expect(avatarColor("Tyler")).not.toBe(avatarColor("Elle"));
  });

  it("gives Tyler and Jamie different colours (demo data)", () => {
    expect(avatarColor("Tyler")).not.toBe(avatarColor("Jamie"));
  });

  it("returns a colour for an empty name instead of crashing", () => {
    expect(avatarColor("")).toBeTruthy();
  });
});
