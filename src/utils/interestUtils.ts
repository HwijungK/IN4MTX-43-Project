export function normalizeInterestLabel(label: string) {
  const slug = label
    .trim()
    .replace(/^#/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug ? `#${slug}` : "#";
}
