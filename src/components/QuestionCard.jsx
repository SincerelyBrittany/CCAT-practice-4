import { CATEGORIES, typeLabel } from "../data/bank";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const GRID_OPTION = /^[■□●○★☆]+( \/ [■□●○★☆]+)+$/;
const SYMBOLS_ONLY = /^[^\p{L}\p{N}\s]{1,8}$/u;

export function Figure({ text }) {
  // A single row of symbols doesn't need column alignment, so show it big.
  const symbolsOnly = !/[\p{L}\p{N}]/u.test(text);
  const symbolRow = symbolsOnly && !text.includes("\n");
  return (
    <pre className={`${symbolRow ? "figure-symbols" : symbolsOnly ? "figure figure-lg" : "figure"} overflow-x-auto rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-gray-800`}>
      {text}
    </pre>
  );
}

function OptionText({ text }) {
  if (GRID_OPTION.test(text)) {
    return (
      <span className="figure inline-block leading-tight">
        {text.split(" / ").map((row, i) => (
          <span key={i} className="block">{[...row].join(" ")}</span>
        ))}
      </span>
    );
  }
  // Lone symbols (arrows, shapes) are hard to read at body size.
  if (SYMBOLS_ONLY.test(text)) return <span className="figure-symbols">{text}</span>;
  return <span>{text}</span>;
}

export default function QuestionCard({ question, selected, onSelect, reveal, showCategory = true }) {
  const cat = CATEGORIES[question.category];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col gap-4">
      {showCategory && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ color: cat.color, backgroundColor: cat.bgColor }}>
            {cat.label}
          </span>
          <span className="text-xs text-gray-400">{typeLabel(question.category, question.type)}</span>
        </div>
      )}

      <p className="text-gray-800 text-base font-medium whitespace-pre-line leading-relaxed">{question.question}</p>

      {question.figure && <Figure text={question.figure} />}

      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === question.answer;
          let style = "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
          if (reveal) {
            if (isCorrect) style = "border-green-400 bg-green-50 text-green-800";
            else if (isSelected) style = "border-red-400 bg-red-50 text-red-800";
            else style = "border-gray-200 bg-white text-gray-400";
          } else if (isSelected) {
            style = "border-indigo-500 bg-indigo-50 text-indigo-800";
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={reveal}
              onClick={() => onSelect(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors duration-100 cursor-pointer disabled:cursor-default flex items-center gap-3 ${style}`}
            >
              <span className="shrink-0 w-6 h-6 rounded-md bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                {LETTERS[i]}
              </span>
              <OptionText text={opt} />
            </button>
          );
        })}
      </div>

      {reveal && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-900">
          <span className="font-semibold">
            {selected === question.answer ? "Correct. " : selected == null ? "Skipped. " : "Not quite. "}
          </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
