// Checks every question file for mistakes. Run with: npm run validate
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../src/data/questions");
const categories = JSON.parse(readFileSync(join(dir, "categories.json"), "utf8"));

const errors = [];
const seenIds = new Set();
const seenQuestions = new Map();
let total = 0;

for (const [category, info] of Object.entries(categories)) {
  const file = `${category}.json`;
  let list;
  try {
    list = JSON.parse(readFileSync(join(dir, file), "utf8"));
  } catch (e) {
    errors.push(`${file}: could not parse JSON — ${e.message}`);
    continue;
  }
  if (!Array.isArray(list)) {
    errors.push(`${file}: must be a JSON array`);
    continue;
  }

  const byType = {};
  const answerPos = [0, 0, 0, 0, 0, 0];

  list.forEach((q, i) => {
    const where = `${file} #${i + 1} (${q.id ?? "no id"})`;
    for (const field of ["id", "type", "question", "options", "answer", "explanation"]) {
      if (q[field] === undefined || q[field] === "") errors.push(`${where}: missing "${field}"`);
    }
    if (seenIds.has(q.id)) errors.push(`${where}: duplicate id "${q.id}"`);
    seenIds.add(q.id);

    if (q.type && !info.types[q.type]) {
      errors.push(`${where}: unknown type "${q.type}" (allowed: ${Object.keys(info.types).join(", ")})`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
      errors.push(`${where}: "options" must be a list of 2–6 choices`);
    } else {
      if (new Set(q.options).size !== q.options.length) errors.push(`${where}: options contain duplicates`);
      const idx = q.options.indexOf(q.answer);
      if (idx === -1) errors.push(`${where}: answer "${q.answer}" is not exactly one of the options`);
      else answerPos[idx]++;
    }
    if (q.figure !== undefined && typeof q.figure !== "string") errors.push(`${where}: "figure" must be text`);

    const key = `${q.question}\n${q.figure ?? ""}\n${(q.options ?? []).join("|")}`;
    if (seenQuestions.has(key)) errors.push(`${where}: same question as ${seenQuestions.get(key)}`);
    seenQuestions.set(key, q.id);

    byType[q.type] = (byType[q.type] ?? 0) + 1;
  });

  total += list.length;
  console.log(`${info.label}: ${list.length} questions`);
  for (const [type, count] of Object.entries(byType)) console.log(`  ${info.types[type] ?? type}: ${count}`);
  console.log(`  correct answer position A–E: ${answerPos.slice(0, 5).join(" / ")}`);
}

console.log(`\nTotal: ${total} questions`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("All questions look valid ✓");
