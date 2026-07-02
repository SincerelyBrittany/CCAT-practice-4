import { useState } from "react";
import Home from "./components/Home";
import TestEngine from "./components/TestEngine";

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {screen === "home" && <Home onStart={() => setScreen("test")} />}
      {screen === "test" && <TestEngine onHome={() => setScreen("home")} />}
    </div>
  );
}
