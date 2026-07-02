import { Brain, Clock, Target, TrendingUp, Trash2 } from "lucide-react";
import { loadSessions, clearSessions } from "../data/storage";
import { CATEGORY_INFO } from "../data/questions";
import { useState } from "react";

export default function Home({ onStart }) {
  const [sessions, setSessions] = useState(() => loadSessions());

  const last = sessions[sessions.length - 1];

  const handleClear = () => {
    if (confirm("Clear all session history?")) {
      clearSessions();
      setSessions([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-2">
          <Brain size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">CCAT Practice</h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Crossover Cognitive Aptitude Test trainer — 50 questions, 15 minutes, personalized feedback.
        </p>
      </div>

      {/* Test info cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: "50 Questions", sub: "18 Math · 18 Verbal · 14 Spatial" },
          { icon: Clock, label: "15 Minutes", sub: "~18 sec per question" },
          { icon: TrendingUp, label: "Pass: 35+", sub: "Top 15% of test-takers" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <Icon size={20} className="mx-auto text-indigo-500 mb-2" />
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Last session */}
      {last && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Last Session</h2>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${last.score >= 35 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
              {last.score}/50
            </span>
          </div>
          <div className="space-y-2">
            {Object.entries(last.breakdown).map(([cat, data]) => {
              const info = CATEGORY_INFO[cat];
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-600">{info.label}</span>
                    <span style={{ color: info.color }}>{data.correct}/{data.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: info.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""} completed
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
      >
        Start Practice Test
      </button>

      {sessions.length > 0 && (
        <button
          onClick={handleClear}
          className="w-full py-2 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} /> Clear history
        </button>
      )}
    </div>
  );
}
