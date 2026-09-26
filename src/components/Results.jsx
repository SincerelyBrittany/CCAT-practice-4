import { useMemo, useState } from "react";
import { CheckCircle, XCircle, Clock, RotateCcw, Target, Home as HomeIcon, ChevronDown } from "lucide-react";
import { CATEGORIES, QUESTIONS_BY_ID, typeLabel } from "../data/bank";
import { fmt } from "../data/format";
import { TIPS } from "../data/tips";
import QuestionCard from "./QuestionCard";

// Crossover's commonly cited bar is 35/50; scale it for shorter tests.
const PASS_RATE = 0.7;

function Bar({ label, correct, total, color }) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color }}>{correct}/{total} · {pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-2.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function statusOf(r) {
  if (!r.reached) return "not reached";
  if (r.selected == null) return "skipped";
  return r.correct ? "correct" : "wrong";
}

const STATUS_STYLE = {
  correct: "bg-green-50 text-green-700",
  wrong: "bg-red-50 text-red-600",
  skipped: "bg-amber-50 text-amber-700",
  "not reached": "bg-gray-100 text-gray-500",
};

export default function Results({ session, onStart, onHome }) {
  const { score, total, results, timeUsed, config } = session;
  const [filter, setFilter] = useState("missed");
  const [open, setOpen] = useState(null);

  const passScore = Math.ceil(total * PASS_RATE);
  const passed = score >= passScore;
  const reached = results.filter((r) => r.reached);
  const avgSeconds = reached.length ? reached.reduce((s, r) => s + r.seconds, 0) / reached.length : 0;
  const missed = results.filter((r) => !r.correct);

  const byCategory = useMemo(() => {
    const out = {};
    for (const r of results) {
      out[r.category] ??= { correct: 0, total: 0 };
      out[r.category].total++;
      if (r.correct) out[r.category].correct++;
    }
    return out;
  }, [results]);

  const byType = useMemo(() => {
    const out = {};
    for (const r of results) {
      const k = `${r.category}:${r.type}`;
      out[k] ??= { category: r.category, type: r.type, correct: 0, total: 0, seconds: 0 };
      out[k].total++;
      out[k].seconds += r.seconds;
      if (r.correct) out[k].correct++;
    }
    return Object.values(out).sort((a, b) => a.correct / a.total - b.correct / b.total);
  }, [results]);

  const weakTypes = byType.filter((t) => t.correct / t.total < 0.7).slice(0, 3);
  const slowest = [...reached].sort((a, b) => b.seconds - a.seconds).slice(0, 5);

  const shown = results
    .map((r, i) => ({ ...r, n: i + 1 }))
    .filter((r) => (filter === "all" ? true : filter === "missed" ? !r.correct : r.correct));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <div className={`rounded-2xl p-6 text-center border ${passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <div className="flex justify-center mb-2">
          {passed ? <CheckCircle size={44} className="text-green-500" /> : <XCircle size={44} className="text-red-400" />}
        </div>
        <p className="text-4xl font-bold tabular-nums" style={{ color: passed ? "#10B981" : "#EF4444" }}>{score} / {total}</p>
        <p className="text-lg font-semibold text-gray-700">{Math.round((score / total) * 100)}% correct</p>
        <p className="text-sm text-gray-500 mt-1">
          {passed
            ? `At or above the ${passScore}/${total} target (35/50 scaled).`
            : `${passScore - score} more correct to reach the ${passScore}/${total} target (35/50 scaled).`}
        </p>
        <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock size={12} /> {fmt(timeUsed)} used</span>
          <span>{Math.round(avgSeconds)}s per question</span>
          {results.length - reached.length > 0 && <span>{results.length - reached.length} not reached</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button onClick={() => onStart({ ...config, ids: undefined })} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">
          <RotateCcw size={15} /> New test
        </button>
        <button
          disabled={!missed.length}
          onClick={() => onStart({ ...config, ids: missed.map((r) => r.id), count: missed.length, mode: "practice", minutes: 0 })}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold disabled:opacity-40"
        >
          <Target size={15} /> Redo {missed.length} missed
        </button>
        <button onClick={onHome} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold">
          <HomeIcon size={15} /> Home
        </button>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="font-bold text-gray-800">By category</h2>
        {Object.entries(byCategory).map(([cat, d]) => (
          <Bar key={cat} label={CATEGORIES[cat].label} correct={d.correct} total={d.total} color={CATEGORIES[cat].color} />
        ))}
        <h3 className="font-semibold text-gray-700 text-sm pt-2">By question type (weakest first)</h3>
        <div className="divide-y divide-gray-100 text-sm">
          {byType.map((t) => (
            <div key={`${t.category}:${t.type}`} className="flex items-center justify-between py-1.5">
              <span className="text-gray-700">{typeLabel(t.category, t.type)}</span>
              <span className="tabular-nums text-gray-500">
                <span className="font-semibold" style={{ color: t.correct === t.total ? "#10B981" : t.correct / t.total < 0.5 ? "#EF4444" : "#F59E0B" }}>
                  {t.correct}/{t.total}
                </span>
                <span className="ml-3 text-xs">{Math.round(t.seconds / t.total)}s avg</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {weakTypes.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="font-bold text-gray-800">What to work on</h2>
          {weakTypes.map((t) => (
            <div key={t.type} className="rounded-xl p-3" style={{ backgroundColor: CATEGORIES[t.category].bgColor }}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm" style={{ color: CATEGORIES[t.category].color }}>{typeLabel(t.category, t.type)}</p>
                <button
                  onClick={() => onStart({ ...config, ids: undefined, categories: [t.category], types: [`${t.category}:${t.type}`], count: 10, minutes: 0, mode: "practice", source: "fresh" })}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-gray-700"
                >
                  Drill 10 →
                </button>
              </div>
              <p className="text-sm text-gray-700 mt-1">{TIPS[t.type]}</p>
            </div>
          ))}
        </section>
      )}

      {slowest.length > 0 && config.minutes > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-2">Where your time went</h2>
          <p className="text-xs text-gray-500 mb-2">
            Target is about {Math.round((config.minutes * 60) / total)}s per question. On the real test, skipping a time-sink is often the right call.
          </p>
          <div className="divide-y divide-gray-100 text-sm">
            {slowest.map((r) => (
              <button key={r.id} onClick={() => { setFilter("all"); setOpen(r.id); }} className="w-full flex justify-between py-1.5 text-left hover:bg-gray-50">
                <span className="text-gray-700 truncate pr-3">
                  Q{results.indexOf(r) + 1} · {typeLabel(r.category, r.type)}
                </span>
                <span className="tabular-nums text-gray-500 shrink-0">
                  {Math.round(r.seconds)}s <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${STATUS_STYLE[statusOf(r)]}`}>{statusOf(r)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Review answers</h2>
          <div className="flex gap-1 text-xs">
            {[["missed", `Missed (${missed.length})`], ["correct", "Correct"], ["all", "All"]].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} className={`px-2.5 py-1 rounded-lg font-semibold ${filter === k ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {shown.length === 0 && <p className="text-sm text-gray-500">Nothing here.</p>}
        {shown.map((r) => {
          const q = QUESTIONS_BY_ID[r.id];
          if (!q) return null;
          const isOpen = open === r.id;
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <button onClick={() => setOpen(isOpen ? null : r.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                <span className="text-xs font-bold text-gray-400 w-8">Q{r.n}</span>
                <span className="flex-1 text-sm text-gray-700 truncate">{q.question.split("\n")[0]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[statusOf(r)]}`}>{statusOf(r)}</span>
                <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-2 pb-2">
                  <QuestionCard question={{ ...q, options: r.options ?? q.options }} selected={r.selected} onSelect={() => {}} reveal />
                  <p className="text-xs text-gray-400 px-3 pt-2">Time spent: {Math.round(r.seconds)}s · Source: {q.source}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
