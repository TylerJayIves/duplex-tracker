const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-moss text-paper",
  "bg-amber text-ink",
  "bg-ink-soft text-paper",
];

export function avatarColor(name: string): string {
  let total = 0;
  for (const char of name) {
    total += char.charCodeAt(0);
  }

  return AVATAR_COLORS[total % AVATAR_COLORS.length];
}
