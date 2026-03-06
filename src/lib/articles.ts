import type { CollectionEntry } from "astro:content";

export type ContentArticle =
  | CollectionEntry<"guides">
  | CollectionEntry<"insights">;

export function getTagSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatArticleDate(date: Date) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function sortByPublishedDesc<T extends ContentArticle>(items: T[]) {
  return [...items].sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime(),
  );
}

export function getRelatedArticles<T extends ContentArticle>(
  items: T[],
  currentId: string,
  currentTags: string[],
  limit = 3,
) {
  const currentTagSet = new Set(currentTags.map((tag) => tag.toLowerCase()));

  return items
    .filter((item) => item.id !== currentId)
    .map((item) => {
      const sharedTags = item.data.tags.filter((tag) =>
        currentTagSet.has(tag.toLowerCase()),
      ).length;

      return {
        item,
        sharedTags,
      };
    })
    .filter((entry) => entry.sharedTags > 0)
    .sort((a, b) => {
      if (b.sharedTags !== a.sharedTags) {
        return b.sharedTags - a.sharedTags;
      }

      return b.item.data.published.getTime() - a.item.data.published.getTime();
    })
    .slice(0, limit)
    .map((entry) => entry.item);
}
