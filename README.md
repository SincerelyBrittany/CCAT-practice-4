# CCAT Practice

A local web app for practicing the Criteria Cognitive Aptitude Test (CCAT): timed tests, a 351-question bank, a mistake bank, and per-question-type feedback. No images. Every question, including spatial ones, is written out as text, so it's easy to add more.

## Running it

Requires **Node.js 18+**.

```bash
npm install     # first time only
npm run dev     # → http://localhost:5173
```

## What it does

- **Test length:** Real CCAT (50 questions / 15 min), Half (25 / 7½), Sprint (10 / 3), or any custom count and time. Set minutes to 0 for untimed.
- **Two modes:**
  - **Exam:** like the real test. No going back, category labels hidden, answers only at the end.
  - **Practice:** check each answer and read the explanation right away.
- **Pacing:** a live "ahead / behind pace" readout and a per-question timer, with the ~18-second target highlighted.
- **Keyboard:** `1–5` or `A–E` to pick, `Enter` to submit or continue.
- **Results:** score against the 35/50 target (scaled for shorter tests), accuracy by category and question type, your slowest questions, and a full answer review with explanations.
- **Mistake bank:** anything you miss or skip goes into the bank. A question leaves the bank after you get it right twice in a row.
- **Drills:** one click to practice 10 questions of your weakest type.
- **Fresh questions first:** new tests pull the questions you've seen least, so you cycle through the whole bank.

Progress is stored in your browser's `localStorage`.

## Question bank

| Category | Questions | Types |
|---|---|---|
| Math & Logic | 180 | number & letter series, percentages, word problems, rates & work, averages, ratios, decimals & fractions, probability & counting, algebra, tables & charts, logic puzzles |
| Verbal | 114 | analogies, antonyms, sentence completion, true/false/uncertain, attention to detail |
| Spatial | 57 | next in series, matrices, odd one out, rotation & reflection (drawn with text symbols like ■ □ ● ▲ ↑) |

A 50-question test picks roughly 18 math / 18 verbal / 14 spatial, then shuffles them together like the real test.

Sources are tagged on every question (`"source"`): your PDFs (`pdf-best-print`, `pdf-hard`, `pdf-math`), the CCAT-1/2/3 screenshot sets (`ccat-1`, `ccat-2`, `ccat-3`), or `original`. Several answer keys in the source material were wrong and have been corrected. The explanation notes when that happened.

## Adding your own questions

Questions live in plain JSON files:

```
src/data/questions/
  categories.json    # category names, question types, and the test mix
  math_logic.json
  verbal.json
  spatial.json
```

Add an object to the right file:

```json
{
  "id": "ml-181",
  "type": "percent",
  "source": "my-notes",
  "question": "18 is 30% of what number?",
  "options": ["45", "54", "60", "64", "72"],
  "answer": "60",
  "explanation": "18 ÷ 0.3 = 60."
}
```

- `id` must be unique (`ml-` math, `vb-` verbal, `sp-` spatial by convention).
- `type` must be one of the types listed for that category in `categories.json`.
- `answer` must match one of the `options` **exactly**.
- Optional `figure`: a block of text shown in a monospace box. Use it for tables, grids, or symbol patterns (use `\n` for new lines).
- For a grid answer choice, write rows separated by ` / `, e.g. `"■□□ / ■■□ / □□□"`. It will be drawn as a small grid.

Then check your work:

```bash
npm run validate
```

This catches duplicate IDs, answers that don't match an option, unknown types, and repeated questions. `npm run build` runs it automatically.

Numeric answer choices stay in ascending order, as on the real test. Other choices are shuffled each time.

## Project structure

```
src/
  App.jsx                  # home → test → results
  components/
    Home.jsx               # test setup, mistake bank, progress
    TestEngine.jsx         # exam/practice flow, timer, pacing, keyboard
    QuestionCard.jsx       # question, text figures, answer choices
    Results.jsx            # score, breakdowns, time analysis, review
    Timer.jsx
  data/
    questions/*.json       # the question bank
    bank.js                # loads the JSON
    testBuilder.js         # picks and mixes questions for a test
    storage.js             # history, per-question stats, mistake bank
    tips.js                # one strategy tip per question type
scripts/
  validate-questions.mjs
```

## Tech stack

React 19 + Vite 8, Tailwind CSS v4, Lucide icons. No backend.
