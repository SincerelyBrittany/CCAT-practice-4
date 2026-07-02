import { CATEGORY_INFO } from "../data/questions";
import { loadSessions } from "../data/storage";
import { CheckCircle, XCircle, TrendingUp, BookOpen, Brain, Shapes } from "lucide-react";

const PASS_SCORE = 35;
const TOTAL = 50;

function buildActionPlan(breakdown) {
  const plan = [];

  Object.entries(breakdown).forEach(([cat, data]) => {
    const info = CATEGORY_INFO[cat];
    const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;

    if (pct < 50) {
      // Weak area — detailed plan
      plan.push({
        category: cat,
        label: info.label,
        color: info.color,
        bgColor: info.bgColor,
        severity: "high",
        pct,
        tips: getTips(cat, data.byType, "high"),
      });
    } else if (pct < 75) {
      plan.push({
        category: cat,
        label: info.label,
        color: info.color,
        bgColor: info.bgColor,
        severity: "medium",
        pct,
        tips: getTips(cat, data.byType, "medium"),
      });
    } else {
      plan.push({
        category: cat,
        label: info.label,
        color: info.color,
        bgColor: info.bgColor,
        severity: "good",
        pct,
        tips: [`Strong performance — keep practicing to stay sharp.`],
      });
    }
  });

  return plan.sort((a, b) => a.pct - b.pct);
}

function getTips(cat, byType, severity) {
  const tips = [];

  if (cat === "math_logic") {
    if ((byType.number_sequence?.correct ?? 0) < (byType.number_sequence?.total ?? 0) * 0.7)
      tips.push("Number Sequences: Practice identifying arithmetic (+/-), geometric (×/÷), and combined patterns. Look for differences between consecutive terms first.");
    if ((byType.word_problem?.correct ?? 0) < (byType.word_problem?.total ?? 0) * 0.7)
      tips.push("Word Problems: Underline key numbers and relationships. Convert words to equations before solving. Practice rate × time = distance, and percentage formulas.");
    if ((byType.algebra?.correct ?? 0) < (byType.algebra?.total ?? 0) * 0.7)
      tips.push("Algebra: Drill isolating variables (add/subtract/multiply/divide both sides). Substitute values to verify your answer.");
    if ((byType.logical_deduction?.correct ?? 0) < (byType.logical_deduction?.total ?? 0) * 0.7)
      tips.push("Logical Deduction: Study syllogism forms (All A→B, Some A→B, No A→B). Watch for invalid conclusions like 'affirming the consequent'.");
    if (tips.length === 0)
      tips.push(severity === "high"
        ? "Review all math fundamentals: fractions, percentages, ratios, basic algebra, and logical syllogisms."
        : "Focus on speed — you know the material but need to solve faster under the 18-second limit.");
  }

  if (cat === "verbal") {
    if ((byType.analogy?.correct ?? 0) < (byType.analogy?.total ?? 0) * 0.7)
      tips.push("Analogies: Always identify the relationship type first (tool→user, part→whole, characteristic, category). Then apply it to the answer choices.");
    if ((byType.antonym?.correct ?? 0) < (byType.antonym?.total ?? 0) * 0.7)
      tips.push("Antonyms: Build vocabulary with word-root practice. Focus on high-frequency GRE/SAT words and their opposites.");
    if ((byType.sentence_completion?.correct ?? 0) < (byType.sentence_completion?.total ?? 0) * 0.7)
      tips.push("Sentence Completion: Look for contrast words (despite, however, although) and support words (therefore, since). They signal whether the blank should agree or contrast with the rest.");
    if ((byType.syllogism?.correct ?? 0) < (byType.syllogism?.total ?? 0) * 0.7)
      tips.push("Syllogisms: Map each statement to its logical form. Remember: 'Some A are B' does NOT mean 'All A are B'. Avoid over-generalizing.");
    if (tips.length === 0)
      tips.push(severity === "high"
        ? "Read actively every day — news, essays, or books. Expand vocabulary using flashcards (Quizlet or Anki) with 10 new words per day."
        : "You're close to mastery. Focus on the question types where you made errors and practice elimination strategies.");
  }

  if (cat === "spatial") {
    if ((byType.matrix?.correct ?? 0) < (byType.matrix?.total ?? 0) * 0.7)
      tips.push("Matrices: Scan rows AND columns independently for the rule. Common rules: rotation, size change, shape substitution, overlay/combine.");
    if ((byType.odd_one_out?.correct ?? 0) < (byType.odd_one_out?.total ?? 0) * 0.7)
      tips.push("Odd One Out: Check multiple properties in order — color/fill, number of sides, size, orientation, symmetry. The rule is usually the simplest one that isolates one shape.");
    if ((byType.pattern_series?.correct ?? 0) < (byType.pattern_series?.total ?? 0) * 0.7)
      tips.push("Pattern Series: Identify one transformation at a time (rotation, reflection, addition/removal of elements). Practice with Raven's Progressive Matrices.");
    if (tips.length === 0)
      tips.push(severity === "high"
        ? "Spatial reasoning is trainable. Practice with free tools like Raven's Matrices and mental rotation exercises for 15 min/day."
        : "Good spatial sense. Increase speed by recognizing patterns faster — name the rule within 5 seconds of seeing the figure.");
  }

  return tips;
}

function CategoryBar({ label, correct, total, color, bgColor }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-semibold" style={{ color }}>{correct}/{total} ({pct}%)</span>
      </div>
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function HistoryChart({ sessions }) {
  if (sessions.length < 2) return null;
  const last8 = sessions.slice(-8);
  const max = 50;
  const W = 300;
  const H = 80;
  const pad = 20;
  const pts = last8.map((s, i) => {
    const x = pad + (i / (last8.length - 1)) * (W - pad * 2);
    const y = H - pad - ((s.score / max) * (H - pad * 2));
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
        <TrendingUp size={14} /> Score History
      </p>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Pass line */}
        <line x1={pad} y1={H - pad - ((PASS_SCORE / max) * (H - pad * 2))} x2={W - pad} y2={H - pad - ((PASS_SCORE / max) * (H - pad * 2))} stroke="#10B981" strokeDasharray="4" strokeWidth="1" />
        <text x={W - pad + 2} y={H - pad - ((PASS_SCORE / max) * (H - pad * 2)) + 4} fontSize="9" fill="#10B981">Pass</text>
        <polyline points={pts} fill="none" stroke="#6366F1" strokeWidth="2" />
        {last8.map((s, i) => {
          const x = pad + (i / (last8.length - 1)) * (W - pad * 2);
          const y = H - pad - ((s.score / max) * (H - pad * 2));
          return <circle key={i} cx={x} cy={y} r={3} fill="#6366F1" />;
        })}
      </svg>
    </div>
  );
}

export default function Results({ session, onRetry, onHome }) {
  const { score, breakdown, timeTaken } = session;
  const passed = score >= PASS_SCORE;
  const pct = Math.round((score / TOTAL) * 100);
  const plan = buildActionPlan(breakdown);
  const sessions = loadSessions();

  const catIcons = { math_logic: Brain, verbal: BookOpen, spatial: Shapes };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Score header */}
      <div className={`rounded-2xl p-6 text-center ${passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
        <div className="flex justify-center mb-2">
          {passed
            ? <CheckCircle size={48} className="text-green-500" />
            : <XCircle size={48} className="text-red-400" />}
        </div>
        <p className="text-4xl font-bold mb-1" style={{ color: passed ? "#10B981" : "#EF4444" }}>
          {score} / {TOTAL}
        </p>
        <p className="text-lg font-semibold text-gray-700">{pct}% correct</p>
        <p className="text-sm text-gray-500 mt-1">
          {passed ? "You met the Crossover passing threshold (35+)!" : `You need ${PASS_SCORE - score} more correct answers to pass.`}
        </p>
        {timeTaken && (
          <p className="text-xs text-gray-400 mt-1">
            Time used: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
          </p>
        )}
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-lg">Score Breakdown</h2>
        {Object.entries(breakdown).map(([cat, data]) => (
          <CategoryBar
            key={cat}
            label={CATEGORY_INFO[cat].label}
            correct={data.correct}
            total={data.total}
            color={CATEGORY_INFO[cat].color}
            bgColor={CATEGORY_INFO[cat].bgColor}
          />
        ))}
        <HistoryChart sessions={sessions} />
      </div>

      {/* Action plan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-lg">Personalized Action Plan</h2>
        {plan.map((item) => {
          const Icon = catIcons[item.category];
          const severityLabel = item.severity === "high" ? "Needs Work" : item.severity === "medium" ? "Improve" : "Strong";
          const severityColor = item.severity === "high" ? "#EF4444" : item.severity === "medium" ? "#F59E0B" : "#10B981";
          return (
            <div key={item.category} className="rounded-xl border p-4" style={{ borderColor: item.color + "44", backgroundColor: item.bgColor }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} style={{ color: item.color }} />
                <span className="font-semibold text-gray-800">{item.label}</span>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: severityColor, backgroundColor: severityColor + "18" }}>
                  {severityLabel} — {Math.round(item.pct)}%
                </span>
              </div>
              <ul className="space-y-1">
                {item.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="mt-0.5 shrink-0" style={{ color: item.color }}>▸</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRetry} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
          Practice Again
        </button>
        <button onClick={onHome} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
          Home
        </button>
      </div>
    </div>
  );
}
