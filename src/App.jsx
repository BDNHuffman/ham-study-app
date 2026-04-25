import React, { useMemo, useState } from "react";

const QUESTIONS = [
  {
    id: "T1A01",
    topic: "FCC Rules",
    question: "Which agency regulates amateur radio in the United States?",
    choices: ["FEMA", "FCC", "ARRL", "NOAA"],
    answer: "FCC",
    explanation: "The FCC makes and enforces amateur radio rules in the United States."
  },
  {
    id: "T2A01",
    topic: "Repeaters",
    question: "What is the main purpose of an amateur radio repeater?",
    choices: ["Encrypt traffic", "Extend communication range", "Charge batteries", "Measure SWR"],
    answer: "Extend communication range",
    explanation: "Repeaters receive your signal and retransmit it, usually from a high location."
  },
  {
    id: "T7C01",
    topic: "Antennas",
    question: "Why does antenna height matter so much on VHF and UHF?",
    choices: ["Signals are mostly line-of-sight", "It changes your call sign", "It lowers license class", "It removes static from AM"],
    answer: "Signals are mostly line-of-sight",
    explanation: "Higher antennas usually see farther over hills, trees, buildings, and terrain."
  },
  {
    id: "T0A01",
    topic: "Safety",
    question: "What is a major hazard when installing antennas?",
    choices: ["Overhead power lines", "Using a notebook", "Low microphone gain", "Too many memory channels"],
    answer: "Overhead power lines",
    explanation: "Antenna contact with power lines can be fatal. Keep antennas and masts far away from utilities."
  },
  {
    id: "T5A01",
    topic: "Electronics",
    question: "What is electrical current?",
    choices: ["The flow of electric charge", "Stored antenna energy", "A type of coax", "Radio wave height"],
    answer: "The flow of electric charge",
    explanation: "Current is the movement of electric charge through a circuit."
  }
];

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem("hamStudyStats")) || {};
  } catch {
    return {};
  }
}

function saveStats(stats) {
  localStorage.setItem("hamStudyStats", JSON.stringify(stats));
}

export default function App() {
  const [mode, setMode] = useState("flashcards");
  const [topic, setTopic] = useState("All");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState(loadStats);

  const topics = useMemo(() => ["All", ...new Set(QUESTIONS.map(q => q.topic))], []);
  const deck = useMemo(() => {
    return topic === "All" ? QUESTIONS : QUESTIONS.filter(q => q.topic === topic);
  }, [topic]);

  const card = deck[index % deck.length];

  const totals = useMemo(() => {
    const values = Object.values(stats);
    return {
      seen: values.length,
      correct: values.reduce((sum, s) => sum + (s.correct || 0), 0),
      missed: values.reduce((sum, s) => sum + (s.missed || 0), 0)
    };
  }, [stats]);

  function nextCard() {
    setIndex((index + 1) % deck.length);
    setShowAnswer(false);
    setSelected(null);
  }

  function record(id, wasCorrect) {
    const next = {
      ...stats,
      [id]: {
        correct: (stats[id]?.correct || 0) + (wasCorrect ? 1 : 0),
        missed: (stats[id]?.missed || 0) + (wasCorrect ? 0 : 1)
      }
    };
    setStats(next);
    saveStats(next);
  }

  function resetProgress() {
    localStorage.removeItem("hamStudyStats");
    setStats({});
  }

  function choose(choice) {
    if (selected) return;
    setSelected(choice);
    record(card.id, choice === card.answer);
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">Homestead Ham Radio</p>
          <h1>📻 Ham Study App</h1>
          <p className="subtitle">Technician license practice for rural, mobile, and preparedness-minded operators.</p>
        </div>
        <div className="stats">
          <div><strong>{totals.seen}</strong><span>Seen</span></div>
          <div><strong>{totals.correct}</strong><span>Correct</span></div>
          <div><strong>{totals.missed}</strong><span>Missed</span></div>
        </div>
      </section>

      <section className="toolbar">
        <button className={mode === "flashcards" ? "active" : ""} onClick={() => setMode("flashcards")}>Flashcards</button>
        <button className={mode === "quiz" ? "active" : ""} onClick={() => setMode("quiz")}>Quiz Mode</button>
        <select value={topic} onChange={(e) => { setTopic(e.target.value); setIndex(0); setSelected(null); setShowAnswer(false); }}>
          {topics.map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="ghost" onClick={resetProgress}>Reset Progress</button>
      </section>

      {mode === "flashcards" && (
        <section className="card study-card">
          <div className="card-top">
            <span>{card.topic}</span>
            <span>{card.id}</span>
          </div>
          <h2>{card.question}</h2>
          {showAnswer ? (
            <div className="answer-box">
              <h3>{card.answer}</h3>
              <p>{card.explanation}</p>
            </div>
          ) : (
            <p className="hint">Think it through, then reveal the answer.</p>
          )}
          <div className="actions">
            {!showAnswer ? (
              <button onClick={() => setShowAnswer(true)}>Reveal Answer</button>
            ) : (
              <>
                <button onClick={() => { record(card.id, false); nextCard(); }}>Missed It</button>
                <button onClick={() => { record(card.id, true); nextCard(); }}>Got It</button>
              </>
            )}
            <button className="ghost" onClick={nextCard}>Skip</button>
          </div>
        </section>
      )}

      {mode === "quiz" && (
        <section className="card study-card">
          <div className="card-top">
            <span>{card.topic}</span>
            <span>{card.id}</span>
          </div>
          <h2>{card.question}</h2>
          <div className="choices">
            {card.choices.map(choice => {
              const isCorrect = selected && choice === card.answer;
              const isWrong = selected === choice && choice !== card.answer;
              return (
                <button
                  key={choice}
                  className={isCorrect ? "correct" : isWrong ? "wrong" : ""}
                  onClick={() => choose(choice)}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          {selected && (
            <div className="answer-box">
              <h3>{selected === card.answer ? "Correct" : "Not quite"}</h3>
              <p>{card.explanation}</p>
              <button onClick={nextCard}>Next Question</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
