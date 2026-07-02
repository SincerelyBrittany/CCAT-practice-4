import SpatialQuestion from "./SpatialQuestion";
import { CATEGORY_INFO } from "../data/questions";

export default function QuestionCard({ question, selected, onSelect, showResult }) {
  const cat = CATEGORY_INFO[question.category];
  const typeLabel = cat.subtypes[question.type] || question.type;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      {/* Category badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ color: cat.color, backgroundColor: cat.bgColor }}
        >
          {cat.label}
        </span>
        <span className="text-xs text-gray-400">{typeLabel}</span>
      </div>

      {/* Question text */}
      <p className="text-gray-800 text-base font-medium whitespace-pre-line leading-relaxed">
        {question.question}
      </p>

      {/* Spatial visual */}
      {question.visual && <SpatialQuestion visual={question.visual} />}

      {/* Options */}
      <div className="grid gap-2 mt-1">
        {question.options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = opt === question.answer;
          let style = "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";

          if (showResult) {
            if (isCorrect) style = "border-green-400 bg-green-50 text-green-800";
            else if (isSelected && !isCorrect) style = "border-red-400 bg-red-50 text-red-800";
            else style = "border-gray-200 bg-white text-gray-400";
          } else if (isSelected) {
            style = "border-indigo-500 bg-indigo-50 text-indigo-800";
          }

          return (
            <button
              key={opt}
              disabled={showResult}
              onClick={() => onSelect(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 cursor-pointer disabled:cursor-default ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800">
          <span className="font-semibold">Explanation: </span>{question.explanation}
        </div>
      )}
    </div>
  );
}
