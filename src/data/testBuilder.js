import { CATEGORIES, QUESTIONS } from "./bank";
import { mistakeIds } from "./storage";

export const PRESETS = [
  { id: "real", label: "Real CCAT", count: 50, minutes: 15, note: "50 questions · 15 min" },
  { id: "half", label: "Half test", count: 25, minutes: 7.5, note: "25 questions · 7½ min" },
  { id: "sprint", label: "Sprint", count: 10, minutes: 3, note: "10 questions · 3 min" },
];

export const DEFAULT_CONFIG = {
  count: 50,
  minutes: 15,
  mode: "exam", // "exam" = like the real test, "practice" = see answers as you go
  categories: Object.keys(CATEGORIES),
  types: [], // optional "category:type" filters; empty = all types
  source: "fresh", // "fresh" = least-seen first, "mistakes" = only your mistake bank
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Questions you've seen least (and longest ago) come first, with ties shuffled.
function byFreshness(pool, stats) {
  return shuffle(pool).sort((a, b) => {
    const sa = stats[a.id], sb = stats[b.id];
    const seenA = sa?.seen ?? 0, seenB = sb?.seen ?? 0;
    if (seenA !== seenB) return seenA - seenB;
    return (sa?.lastSeen ?? "").localeCompare(sb?.lastSeen ?? "");
  });
}

export function eligiblePool(config, stats) {
  if (config.ids?.length) {
    const ids = new Set(config.ids);
    return QUESTIONS.filter((q) => ids.has(q.id));
  }
  let pool = QUESTIONS.filter((q) => config.categories.includes(q.category));
  if (config.types?.length) pool = pool.filter((q) => config.types.includes(`${q.category}:${q.type}`));
  if (config.source === "mistakes") {
    const ids = new Set(mistakeIds(stats));
    pool = pool.filter((q) => ids.has(q.id));
  }
  return pool;
}

export function buildTest(config, stats) {
  const pool = eligiblePool(config, stats);
  const count = Math.min(config.count, pool.length);

  // Split the count across categories using the real test's rough mix.
  const cats = [...new Set(pool.map((q) => q.category))];
  const shareTotal = cats.reduce((s, c) => s + CATEGORIES[c].share, 0);
  const want = Object.fromEntries(cats.map((c) => [c, Math.floor((count * CATEGORIES[c].share) / shareTotal)]));
  let leftover = count - Object.values(want).reduce((a, b) => a + b, 0);
  for (const c of cats) if (leftover-- > 0) want[c]++;

  const picked = [];
  const spare = [];
  for (const c of cats) {
    const ordered = byFreshness(pool.filter((q) => q.category === c), stats);
    picked.push(...ordered.slice(0, want[c]));
    spare.push(...ordered.slice(want[c]));
  }
  // A category ran short — top up from whatever is left.
  picked.push(...byFreshness(spare, stats).slice(0, count - picked.length));

  return shuffle(picked).map(prepareOptions);
}

// Numeric answers stay in ascending order (like the real test), and so do
// True/False/Uncertain and A–E choices. Everything else gets shuffled so the
// correct answer isn't always in the same spot.
function prepareOptions(q) {
  const fixed =
    q.options.every((o) => /^[−-]?\$?\d/.test(o)) ||
    q.options.join() === "True,False,Uncertain" ||
    q.options.every((o) => /^[A-E]$/.test(o));
  return fixed ? q : { ...q, options: shuffle(q.options) };
}
