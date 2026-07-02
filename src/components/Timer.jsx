import { useEffect, useRef } from "react";

export default function Timer({ secondsLeft, onExpire }) {
  const prevRef = useRef(secondsLeft);

  useEffect(() => {
    if (secondsLeft <= 0 && prevRef.current > 0) {
      onExpire();
    }
    prevRef.current = secondsLeft;
  }, [secondsLeft, onExpire]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pct = secondsLeft / (15 * 60);
  const urgent = secondsLeft <= 60;
  const warning = secondsLeft <= 180;

  const color = urgent ? "#EF4444" : warning ? "#F59E0B" : "#10B981";

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 44 44" className="w-12 h-12 -rotate-90">
          <circle cx="22" cy="22" r="18" fill="none" stroke="#E5E7EB" strokeWidth="4" />
          <circle
            cx="22" cy="22" r="18" fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 18}`}
            strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
          />
        </svg>
      </div>
      <span className="text-xl font-mono font-bold" style={{ color }}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}
