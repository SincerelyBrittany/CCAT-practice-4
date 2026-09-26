// Everything is saved in this browser's localStorage.
const SESSIONS_KEY = "ccat_v2_sessions";
const STATS_KEY = "ccat_v2_question_stats";
const SETTINGS_KEY = "ccat_v2_settings";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — the app still works, it just won't remember.
  }
}

export const loadSessions = () => read(SESSIONS_KEY, []);
export const loadStats = () => read(STATS_KEY, {});
export const loadSettings = () => read(SETTINGS_KEY, null);
export const saveSettings = (settings) => write(SETTINGS_KEY, settings);

// stats[id] = { seen, correct, wrong, streak, lastSeen, lastResult }
// A skipped question counts as wrong.
export function saveSession(session) {
  const sessions = loadSessions();
  sessions.push(session);
  write(SESSIONS_KEY, sessions.slice(-200));

  const stats = loadStats();
  for (const r of session.results) {
    if (!r.reached) continue; // ran out of time before seeing it
    const s = stats[r.id] ?? { seen: 0, correct: 0, wrong: 0, streak: 0 };
    s.seen += 1;
    if (r.correct) {
      s.correct += 1;
      s.streak = Math.max(1, s.streak + 1);
    } else {
      s.wrong += 1;
      s.streak = 0;
    }
    s.lastSeen = session.date;
    s.lastResult = r.correct ? "correct" : r.selected == null ? "skipped" : "wrong";
    stats[r.id] = s;
  }
  write(STATS_KEY, stats);
}

// A question stays in the mistake bank until you get it right twice in a row.
export const MASTERY_STREAK = 2;

export function mistakeIds(stats = loadStats()) {
  return Object.entries(stats)
    .filter(([, s]) => s.wrong > 0 && s.streak < MASTERY_STREAK)
    .map(([id]) => id);
}

export function clearAll() {
  for (const key of [SESSIONS_KEY, STATS_KEY]) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
