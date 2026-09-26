import { fmt } from "../data/format";

// Countdown ring when the test is timed; a simple stopwatch when it isn't.
export default function Timer({ secondsLeft, totalSeconds, elapsed }) {
  if (!totalSeconds) {
    return <div className="text-lg font-mono font-bold text-gray-500 tabular-nums">{fmt(elapsed)}</div>;
  }

  const pct = secondsLeft / totalSeconds;
  // Warn relative to the test length so a 3-minute sprint doesn't start out orange.
  const color = pct <= 0.1 ? "#EF4444" : pct <= 0.25 ? "#F59E0B" : "#10B981";
  const C = 2 * Math.PI * 18;

  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle
          cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)} strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-mono font-bold tabular-nums" style={{ color }}>{fmt(secondsLeft)}</span>
    </div>
  );
}
