import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { buildTest } from "../data/testBuilder";
import { loadStats } from "../data/storage";
import { fmt } from "../data/format";
import QuestionCard from "./QuestionCard";
import Timer from "./Timer";

const KEY_TO_INDEX = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, a: 0, b: 1, c: 2, d: 3, e: 4 };

export default function TestEngine({ config, onFinish, onQuit }) {
  const [questions] = useState(() => buildTest(config, loadStats()));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [startedAt] = useState(() => Date.now());
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const timesRef = useRef({});
  const doneRef = useRef(false);

  const practice = config.mode === "practice";
  const totalSeconds = config.minutes ? Math.round(config.minutes * 60) : 0;
  const elapsed = (now - startedAt) / 1000;
  const secondsLeft = Math.max(0, totalSeconds - elapsed);
  const q = questions[index];
  const selected = q ? answers[q.id] ?? null : null;

  const stampTime = useCallback(() => {
    if (!q) return;
    const t = Date.now();
    timesRef.current[q.id] = (timesRef.current[q.id] ?? 0) + (t - questionStartedAt) / 1000;
    setQuestionStartedAt(t);
  }, [q, questionStartedAt]);

  const finish = useCallback((reachedCount, finalAnswers = answers) => {
    if (doneRef.current) return;
    doneRef.current = true;
    stampTime();
    const results = questions.map((qq, i) => {
      const sel = finalAnswers[qq.id] ?? null;
      return {
        id: qq.id,
        category: qq.category,
        type: qq.type,
        options: qq.options,
        selected: sel,
        correct: sel === qq.answer,
        seconds: Math.round((timesRef.current[qq.id] ?? 0) * 10) / 10,
        reached: i < reachedCount,
      };
    });
    onFinish({
      date: new Date().toISOString(),
      config,
      total: questions.length,
      score: results.filter((r) => r.correct).length,
      timeUsed: Math.round((Date.now() - startedAt) / 1000),
      results,
    });
  }, [answers, config, onFinish, questions, stampTime, startedAt]);

  // Clock tick.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // Time's up: everything after the current question counts as not reached.
  useEffect(() => {
    if (totalSeconds && secondsLeft <= 0) finish(index + 1);
  }, [secondsLeft, totalSeconds, finish, index]);

  const select = useCallback((opt) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [q.id]: opt }));
  }, [q, revealed]);

  const next = useCallback(() => {
    stampTime();
    if (index >= questions.length - 1) {
      finish(questions.length);
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  }, [finish, index, questions.length, stampTime]);

  // Primary button: exam = submit/skip, practice = check → next.
  const primary = useCallback(() => {
    if (practice && !revealed) setRevealed(true);
    else next();
  }, [next, practice, revealed]);

  const endEarly = () => {
    if (confirm("End the test now? Questions you haven't reached will count as not answered.")) {
      finish(selected != null || revealed ? index + 1 : index);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || !q) return;
      const k = e.key.toLowerCase();
      if (k in KEY_TO_INDEX && KEY_TO_INDEX[k] < q.options.length) {
        e.preventDefault();
        select(q.options[KEY_TO_INDEX[k]]);
      } else if (k === "enter") {
        // Stop Enter from also "clicking" whichever button has focus,
        // which would advance twice.
        e.preventDefault();
        if (e.repeat) return;
        document.activeElement?.blur?.();
        primary();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [q, select, primary]);

  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-gray-700">No questions match those settings.</p>
        <button onClick={onQuit} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold">Back</button>
      </div>
    );
  }

  // Pace: where you should be if you spent equal time on every question.
  const perQuestion = totalSeconds / questions.length;
  const aheadBy = totalSeconds ? index * perQuestion - elapsed : 0;
  const onThis = Math.max(0, (now - questionStartedAt) / 1000);
  const answered = Object.keys(answers).length;

  let primaryLabel;
  if (practice) primaryLabel = revealed ? (index === questions.length - 1 ? "See results" : "Next →") : selected ? "Check answer" : "Skip & show answer";
  else primaryLabel = index === questions.length - 1 ? "Finish test" : selected ? "Submit →" : "Skip →";

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Question {index + 1} / {questions.length}</span>
            <span className="text-gray-300">·</span>
            <span>{practice ? "Practice" : "Exam"} mode</span>
          </div>
          <div className="h-1.5 w-full max-w-xs bg-gray-200 rounded-full mt-1.5 overflow-hidden">
            <div className="h-1.5 bg-indigo-500 rounded-full transition-all" style={{ width: `${(index / questions.length) * 100}%` }} />
          </div>
        </div>
        <Timer secondsLeft={secondsLeft} totalSeconds={totalSeconds} elapsed={elapsed} />
        <button onClick={endEarly} title="End test" className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
          <X size={18} />
        </button>
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span className={totalSeconds && perQuestion && onThis > perQuestion ? "text-amber-600 font-semibold" : ""}>
          This question: {fmt(onThis)}{totalSeconds ? ` (target ${Math.round(perQuestion)}s)` : ""}
        </span>
        {totalSeconds ? (
          <span className={aheadBy > -3 ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
            {Math.abs(aheadBy) < 3 ? "On pace" : aheadBy > 0 ? `${Math.round(aheadBy)}s ahead of pace` : `${Math.round(-aheadBy)}s behind pace`}
          </span>
        ) : (
          <span>{answered} answered</span>
        )}
      </div>

      <QuestionCard question={q} selected={selected} onSelect={select} reveal={practice && revealed} showCategory={practice} />

      <button
        onClick={primary}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-colors ${
          selected || revealed ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
      >
        {primaryLabel}
      </button>

      <p className="text-xs text-center text-gray-400">
        Keys: <kbd className="font-mono">1–5</kbd> or <kbd className="font-mono">A–E</kbd> to choose · <kbd className="font-mono">Enter</kbd> to {practice ? "check / continue" : "submit"}
        {!practice && " · no going back, just like the real test"}
      </p>
    </div>
  );
}
