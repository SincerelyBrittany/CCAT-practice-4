import { useState } from "react";
import Home from "./components/Home";
import TestEngine from "./components/TestEngine";
import Results from "./components/Results";
import { saveSession } from "./data/storage";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [config, setConfig] = useState(null);
  const [session, setSession] = useState(null);
  const [runId, setRunId] = useState(0);

  const start = (cfg) => {
    setConfig(cfg);
    setRunId((n) => n + 1);
    setScreen("test");
    window.scrollTo(0, 0);
  };

  const finish = (s) => {
    saveSession(s);
    setSession(s);
    setScreen("results");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {screen === "home" && <Home onStart={start} />}
      {screen === "test" && <TestEngine key={runId} config={config} onFinish={finish} onQuit={() => setScreen("home")} />}
      {screen === "results" && <Results session={session} onStart={start} onHome={() => setScreen("home")} />}
    </div>
  );
}
