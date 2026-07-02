const KEY = "ccat_sessions";

export function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSession(session) {
  const sessions = loadSessions();
  sessions.push({ ...session, date: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function clearSessions() {
  localStorage.removeItem(KEY);
}
