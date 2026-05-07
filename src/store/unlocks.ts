import { investigations } from "../data/loader";

/** Returns true if the given investigation slug is unlocked given the set of completed slugs. */
export function isUnlocked(slug: string, completed: string[]): boolean {
  const inv = investigations.find((i) => i.slug === slug);
  if (!inv) return false;
  if (inv.number === 1) return true;
  const prev = investigations.find((i) => i.number === inv.number - 1);
  if (!prev) return false;
  return completed.includes(prev.slug);
}

/** Returns true if the given act is unlocked given the set of completed slugs. */
export function isActUnlocked(act: number, completed: string[]): boolean {
  if (act === 1) return true;
  const prevActLast = investigations
    .filter((i) => i.act === act - 1)
    .sort((a, b) => b.number - a.number)[0];
  if (!prevActLast) return false;
  return completed.includes(prevActLast.slug);
}

export function nextInvestigation(currentSlug: string): string | null {
  const cur = investigations.find((i) => i.slug === currentSlug);
  if (!cur) return null;
  const next = investigations.find((i) => i.number === cur.number + 1);
  return next?.slug ?? null;
}
