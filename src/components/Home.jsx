import { useMemo, useState } from "react";
import { Brain, Play, Trash2, Target, TrendingUp } from "lucide-react";
import { CATEGORIES, QUESTIONS, QUESTIONS_BY_ID, typeLabel } from "../data/bank";
import { loadSessions, loadStats, loadSettings, saveSettings, mistakeIds, clearAll } from "../data/storage";
import { DEFAULT_CONFIG, PRESETS, eligiblePool } from "../data/testBuilder";
import { fmt } from "../data/format";

function Toggle({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-gray-100 p-1 text-sm">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${value === v ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function HistoryChart({ sessions }) {
  const last = sessions.slice(-12);
  if (last.length < 2) return null;
  const W = 320, H = 90, pad = 14;
  const x = (i) => pad + (i / (last.length - 1)) * (W - pad * 2);
  const y = (pct) => H - pad - pct * (H - pad * 2);
  const pts = last.map((s, i) => `${x(i)},${y(s.score / s.total)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24">
      <line x1={pad} x2={W - pad} y1={y(0.7)} y2={y(0.7)} stroke="#10B981" strokeDasharray="4" />
      <text x={W - pad} y={y(0.7) - 4} fontSize="9" fill="#10B981" textAnchor="end">70% target</text>
      <polyline points={pts} fill="none" stroke="#6366F1" strokeWidth="2" />
      {last.map((s, i) => (
        <circle key={i} cx={x(i)} cy={y(s.score / s.total)} r="3" fill="#6366F1">
          <title>{`${s.score}/${s.total} · ${new Date(s.date).toLocaleDateString()}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function Home({ onStart }) {
  const [sessions, setSessions] = useState(() => loadSessions());
  const [stats, setStats] = useState(() => loadStats());
  const [config, setConfig] = useState(() => ({ ...DEFAULT_CONFIG, ...loadSettings(), ids: undefined, types: [] }));

  const update = (patch) => {
    const next = { ...config, ...patch };
    setConfig(next);
    saveSettings({ count: next.count, minutes: next.minutes, mode: next.mode, categories: next.categories });
  };

  const mistakes = useMemo(() => mistakeIds(stats), [stats]);
  const poolSize = eligiblePool(config, stats).length;
  const presetId = PRESETS.find((p) => p.count === config.count && p.minutes === config.minutes)?.id ?? "custom";
  const seenCount = Object.keys(stats).filter((id) => QUESTIONS_BY_ID[id]).length;

  // Accuracy per question type across everything you've answered.
  const typeStats = useMemo(() => {
    const out = {};
    for (const [id, s] of Object.entries(stats)) {
      const q = QUESTIONS_BY_ID[id];
      if (!q) continue;
      const k = `${q.category}:${q.type}`;
      out[k] ??= { category: q.category, type: q.type, correct: 0, seen: 0 };
      out[k].correct += s.correct;
      out[k].seen += s.seen;
    }
    return Object.values(out).filter((t) => t.seen >= 3).sort((a, b) => a.correct / a.seen - b.correct / b.seen);
  }, [stats]);

  const toggleCategory = (cat) => {
    const has = config.categories.includes(cat);
    if (has && config.categories.length === 1) return;
    update({ categories: has ? config.categories.filter((c) => c !== cat) : [...config.categories, cat] });
  };

  const start = (overrides = {}) => onStart({ ...config, ...overrides });

  const handleClear = () => {
    if (confirm("Clear all history and your mistake bank? This can't be undone.")) {
      clearAll();
      setSessions([]);
      setStats({});
    }
  };

  const count = Math.min(config.count, poolSize);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
          <Brain size={26} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CCAT Practice</h1>
          <p className="text-sm text-gray-500">{QUESTIONS.length} questions · math, verbal, and spatial</p>
        </div>
      </header>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Length</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => update({ count: p.count, minutes: p.minutes })}
                className={`rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${presetId === p.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}
              >
                <p className="text-sm font-semibold text-gray-800">{p.label}</p>
                <p className="text-xs text-gray-500">{p.note}</p>
              </button>
            ))}
            <div className={`rounded-xl border-2 px-3 py-2 ${presetId === "custom" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>
              <p className="text-sm font-semibold text-gray-800">Custom</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                <input
                  type="number" min="1" max="200" value={config.count}
                  onChange={(e) => update({ count: Math.max(1, Math.min(200, Number(e.target.value) || 1)) })}
                  className="w-12 rounded-md border border-gray-300 px-1.5 py-0.5 text-sm" aria-label="Number of questions"
                />
                <span>q</span>
                <input
                  type="number" min="0" max="120" step="0.5" value={config.minutes}
                  onChange={(e) => update({ minutes: Math.max(0, Math.min(120, Number(e.target.value) || 0)) })}
                  className="w-12 rounded-md border border-gray-300 px-1.5 py-0.5 text-sm" aria-label="Minutes"
                />
                <span>min</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Set minutes to 0 for no time limit.</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Mode</p>
            <Toggle options={[["exam", "Exam"], ["practice", "Practice"]]} value={config.mode} onChange={(mode) => update({ mode })} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Questions from</p>
            <Toggle
              options={[["fresh", "Whole bank"], ["mistakes", `Mistakes (${mistakes.length})`]]}
              value={config.source}
              onChange={(source) => update({ source })}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 -mt-2">
          {config.mode === "exam"
            ? "Exam: like the real CCAT. No going back, no answers until the end."
            : "Practice: see the answer and explanation after each question."}
          {config.source === "fresh" && " Questions you've seen least come first."}
        </p>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Categories</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([cat, info]) => {
              const on = config.categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors"
                  style={on ? { color: info.color, backgroundColor: info.bgColor, borderColor: info.color } : { color: "#9CA3AF", borderColor: "#E5E7EB" }}
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => start()}
          disabled={!poolSize}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-lg font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] transition"
        >
          <Play size={20} /> Start · {count} questions · {config.minutes ? fmt(config.minutes * 60) : "untimed"}
        </button>
        {config.count > poolSize && poolSize > 0 && (
          <p className="text-xs text-amber-600 text-center -mt-3">Only {poolSize} questions match these settings, so the test will be shorter.</p>
        )}
        {!poolSize && <p className="text-xs text-gray-500 text-center -mt-3">No questions match. Your mistake bank is empty for these categories.</p>}
      </section>

      {mistakes.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-800 flex items-center gap-2"><Target size={16} className="text-red-500" /> Mistake bank: {mistakes.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Questions leave the bank after you get them right twice in a row.</p>
          </div>
          <button
            onClick={() => start({ source: "mistakes", categories: Object.keys(CATEGORIES), count: Math.min(20, mistakes.length), minutes: 0, mode: "practice" })}
            className="shrink-0 px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100"
          >
            Practice {Math.min(20, mistakes.length)}
          </button>
        </section>
      )}

      {sessions.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2"><TrendingUp size={16} /> Progress</h2>
            <span className="text-xs text-gray-400">{sessions.length} tests · {seenCount}/{QUESTIONS.length} questions seen</span>
          </div>
          <HistoryChart sessions={sessions} />
          <div className="divide-y divide-gray-100 text-sm">
            {sessions.slice(-5).reverse().map((s) => (
              <div key={s.date} className="flex justify-between py-1.5 text-gray-600">
                <span>{new Date(s.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                <span className="tabular-nums">
                  <span className="font-semibold text-gray-800">{s.score}/{s.total}</span>
                  <span className="text-xs text-gray-400 ml-2">{s.config.mode} · {s.config.minutes ? fmt(s.config.minutes * 60) : "untimed"}</span>
                </span>
              </div>
            ))}
          </div>

          {typeStats.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 pt-2">Weakest question types</h3>
              <div className="divide-y divide-gray-100 text-sm">
                {typeStats.slice(0, 5).map((t) => (
                  <div key={`${t.category}:${t.type}`} className="flex items-center justify-between py-1.5">
                    <span className="text-gray-700">{typeLabel(t.category, t.type)}</span>
                    <span className="flex items-center gap-3">
                      <span className="tabular-nums text-gray-500">{Math.round((t.correct / t.seen) * 100)}%</span>
                      <button
                        onClick={() => start({ categories: [t.category], types: [`${t.category}:${t.type}`], count: 10, minutes: 0, mode: "practice", source: "fresh" })}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        Drill
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <button onClick={handleClear} className="w-full pt-2 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-red-500">
            <Trash2 size={12} /> Clear history & mistake bank
          </button>
        </section>
      )}
    </div>
  );
}
