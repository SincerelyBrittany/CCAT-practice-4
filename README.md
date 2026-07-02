# CCAT Practice — Crossover Cognitive Aptitude Test Trainer

A local web app to practice for the [Crossover CCAT](https://www.crossover.com/resources/ccat-guide), with timed tests, SVG-rendered spatial questions, per-category scoring, and a personalized action plan after each session.

## Test format (mirrors the real CCAT)

| Category | Questions | Sub-types |
|---|---|---|
| Math & Logic | 18 | Number sequences, Word problems, Algebra, Logical deduction |
| Verbal Reasoning | 18 | Analogies, Antonyms, Sentence completion, Syllogisms |
| Spatial Reasoning | 14 | Matrices, Odd one out, Pattern series |
| **Total** | **50** | **15 minutes · ~18 sec/question** |

Pass threshold: **35+ correct** (top 15% of test-takers).

## Features

- **Timed test** — 15-minute countdown with a ring timer (turns yellow at 3 min, red at 1 min)
- **Question bank** — questions shuffled each session so tests never repeat identically
- **Spatial visuals** — SVG-rendered patterns (no image files needed)
- **Inline explanations** — see why each answer is correct without leaving the test
- **Results page** — score breakdown by category + sub-type accuracy bars
- **Score history chart** — tracks progress across multiple sessions (stored in `localStorage`)
- **Personalized action plan** — specific study tips per weak area generated after each test

## Project structure

```
src/
  App.jsx                   # Root: routes between Home and TestEngine
  index.css                 # Tailwind base import

  components/
    Home.jsx                # Landing screen, last session summary, history chart
    TestEngine.jsx          # Test state machine (questions, timer, finish logic)
    QuestionCard.jsx        # Renders a single question with options and explanation
    Timer.jsx               # Circular countdown SVG
    SpatialQuestion.jsx     # SVG renderer for all spatial question visuals
    Results.jsx             # Score breakdown, action plan, session history

  data/
    questions.js            # Full question bank + CATEGORY_INFO metadata
    testBuilder.js          # Builds a shuffled 50-question test each session
    storage.js              # localStorage helpers (save/load/clear sessions)
```

## Running locally

Requires **Node.js 18+**.

```bash
# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
# → Open http://localhost:5173 in your browser

# Production build (optional)
npm run build
```

## Adding questions

Open [`src/data/questions.js`](src/data/questions.js) and add an object to the `questions` array:

```js
{
  id: 100,                        // unique number
  category: "math_logic",         // math_logic | verbal | spatial
  type: "number_sequence",        // see sub-types table above
  question: "2, 4, 8, 16, ___",
  options: ["24", "32", "30", "18"],
  answer: "32",
  explanation: "Each number is multiplied by 2."
}
```

Spatial questions additionally need a `visual` field — see existing spatial entries in the file for examples.

## Tech stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [Lucide React](https://lucide.dev/) for icons
- No backend — all data lives in `localStorage`
