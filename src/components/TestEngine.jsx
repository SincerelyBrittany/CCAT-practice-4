import { useState, useEffect, useCallback, useRef } from "react";
import { buildTest, shuffleOptions } from "../data/testBuilder";
import { CATEGORY_INFO } from "../data/questions";
import { saveSession } from "../data/storage";
import QuestionCard from "./QuestionCard";
import Timer from "./Timer";
import Results from "./Results";

const TOTAL_SECONDS = 15 * 60;

export default function TestEngine({ onHome }) {
  const [questions] = useState(() => buildTest().map(shuffleOptions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [phase, setPhase] = useState("test"); // "test" | "review" | "results"
  const [session, setSession] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const startTime = useRef(Date.now());

  // Timer tick
  useEffect(() => {
    if (phase !== "test") return;
    const id = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const finishTest = useCallback(() => {
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    const breakdown = {};
    Object.keys(CATEGORY_INFO).forEach(cat => {
      breakdown[cat] = { correct: 0, total: 0, byType: {} };
    });

    questions.forEach(q => {
      const cat = q.category;
      const selected = answers[q.id];
      const correct = selected === q.answer;
      breakdown[cat].total += 1;
      if (correct) breakdown[cat].correct += 1;

      if (!breakdown[cat].byType[q.type]) {
        breakdown[cat].byType[q.type] = { correct: 0, total: 0 };
      }
      breakdown[cat].byType[q.type].total += 1;
      if (correct) breakdown[cat].byType[q.type].correct += 1;
    });

    const score = Object.values(breakdown).reduce((s, d) => s + d.correct, 0);
    const result = { score, breakdown, timeTaken, answers };
    saveSession(result);
    setSession(result);
    setPhase("results");
  }, [questions, answers]);

  const handleExpire = useCallback(() => finishTest(), [finishTest]);

  const handleAnswer = (opt) => {
    setAnswers(prev => ({ ...prev, [questions[current].id]: opt }));
    setShowExplanation(false);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      finishTest();
    }
  };

  const handlePrev = () => {
    setShowExplanation(false);
    if (current > 0) setCurrent(c => c - 1);
  };

  if (phase === "results") {
    return <Results session={session} onRetry={() => window.location.reload()} onHome={onHome} />;
  }

  const q = questions[current];
  const selected = answers[q.id] ?? null;
  const answered = Object.keys(answers).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Question {current + 1} of {questions.length}</p>
          <div className="h-1.5 w-48 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div
              className="h-1.5 bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <Timer secondsLeft={secondsLeft} onExpire={handleExpire} />
      </div>

      {/* Answered counter */}
      <div className="text-xs text-gray-400 text-right">
        {answered} answered · {questions.length - answered} remaining
      </div>

      {/* Question */}
      <QuestionCard
        question={q}
        selected={selected}
        onSelect={handleAnswer}
        showResult={showExplanation}
      />

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        {selected && !showExplanation && (
          <button
            onClick={() => setShowExplanation(true)}
            className="flex-1 py-3 rounded-xl border border-blue-200 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors"
          >
            See Explanation
          </button>
        )}

        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          {current === questions.length - 1 ? "Finish Test" : "Next →"}
        </button>
      </div>

      {/* Skip without answering warning */}
      {!selected && (
        <p className="text-xs text-center text-amber-500">
          Select an answer or press Next to skip this question.
        </p>
      )}
    </div>
  );
}
