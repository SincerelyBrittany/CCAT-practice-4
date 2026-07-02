import { questions } from "./questions";

// Builds a shuffled 50-question test matching CCAT distribution:
// 18 math_logic, 18 verbal, 14 spatial
export function buildTest() {
  const pick = (category, count) => {
    const pool = questions.filter(q => q.category === category);
    return shuffle(pool).slice(0, Math.min(count, pool.length));
  };

  const selected = [
    ...pick("math_logic", 18),
    ...pick("verbal", 18),
    ...pick("spatial", 14),
  ];

  return shuffle(selected).map((q, i) => ({ ...q, index: i }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffles the options for a single question (so answer position varies)
export function shuffleOptions(question) {
  if (question.category === "spatial") return question; // spatial options are positional
  const opts = shuffle(question.options);
  return { ...question, options: opts };
}
