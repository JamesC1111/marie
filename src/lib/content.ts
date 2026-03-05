export function getEntrySlug(id: string) {
  return id.replace(/\.(md|mdx)$/, "");
}
