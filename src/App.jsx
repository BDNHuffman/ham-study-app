import { useState } from "react";
import { QUESTIONS } from "./questions";

export default function App() {
  const [mode, setMode] = useState("home");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ seen: 0, correct: 0, missed: 0 });

  const card = QUESTIONS[index % QUESTIONS.length];

  function next() {
    setIndex((index + 1) % QUESTIONS.length);
    setRevealed(false);
    setSelected(null);
  }

  function mark(correct) {
    setScore((s) => ({
      seen: s.seen + 1,
      correct: s.correct + (correct ? 1 : 0),
      missed: s.missed + (correct ? 0 : 1)
    }));
    next();
  }

  function choose(choice) {
    if (selected) return;

    setSelected(choice);
    setScore((s) => ({
      seen: s.seen + 1,
      correct: s.correct + (choice === card.answer ? 1 : 0),
      missed: s.missed + (choice === card.answer ? 0 : 1)
    }));
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="badge">📻 Huffman Hive Project</div>
        <h1>Ham Study App</h1>
        <p>
          Technician license prep for homestead communications, rural preparedness,
          hiking radios, repeaters, and general radio curiosity.
        </p>

        <div className="hero-actions">
          <button onClick={() => setMode("flashcards")}>Start Flashcards</button>
          <button className="secondary" onClick={() => setMode("quiz")}>
            Quiz Mode
          </button>
        </div>
      </section>

      {mode === "home" && (
        <>
          <section className="grid">
            <button className="card clickable" onClick={() => setMode("flashcards")}>
              <span>01</span>
              <h2>Flashcards</h2>
              <p>Study FCC rules, antennas, safety, repeaters, and electronics.</p>
            </button>

            <button className="card clickable" onClick={() => setMode("quiz")}>
              <span>02</span>
              <h2>Practice Quiz</h2>
              <p>Answer sample Technician questions and build confidence.</p>
            </button>

            <div className="card">
              <span>03</span>
              <h2>Progress</h2>
              <p>
                Seen: {score.seen} • Correct: {score.correct} • Missed:{" "}
                {score.missed}
              </p>
            </div>
          </section>

          <section className="info-section">
            <h2>What’s Inside the Technician Study App</h2>

            <div className="info-grid">
              <div className="info-card">
                <h3>📚 Full Technician Question Pool</h3>
                <p>
                  Practice from the official FCC Technician exam pool containing
                  roughly 400 published questions used for real testing.
                </p>
              </div>

              <div className="info-card">
                <h3>📡 Core Topics Covered</h3>
                <p>
                  FCC rules, operating procedures, repeaters, antennas, feed lines,
                  propagation, electronics, safety, batteries, grounding, and
                  emergency use.
                </p>
              </div>

              <div className="info-card">
                <h3>🧠 Flashcards + Quiz Mode</h3>
                <p>
                  Learn concepts with flashcards, then switch to random quizzes to
                  simulate real exam pressure and track weak spots.
                </p>
              </div>

              <div className="info-card">
                <h3>🏕 Built for Real Life</h3>
                <p>
                  Perfect for homesteads, rural communication, storms, travel,
                  off-grid readiness, and everyday radio curiosity.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {mode === "flashcards" && (
        <section className="study-panel">
          <div className="panel-top">
            <button className="secondary" onClick={() => setMode("home")}>
              ← Home
            </button>

            <span>
              {card.section} • {card.id}
            </span>
          </div>

          <h2>{card.question}</h2>

          {revealed && (
            <div className="answer">
              <h3>{card.answer}</h3>
              <p>{card.explanation}</p>
            </div>
          )}

          <div className="hero-actions">
            {!revealed ? (
              <button onClick={() => setRevealed(true)}>Reveal Answer</button>
            ) : (
              <>
                <button className="secondary" onClick={() => mark(false)}>
                  Missed It
                </button>
                <button onClick={() => mark(true)}>Got It</button>
              </>
            )}
          </div>
        </section>
      )}

      {mode === "quiz" && (
        <section className="study-panel">
          <div className="panel-top">
            <button className="secondary" onClick={() => setMode("home")}>
              ← Home
            </button>

            <span>
              {card.section} • {card.id}
            </span>
          </div>

          <h2>{card.question}</h2>

          <div className="choices">
            {card.choices.map((choice) => (
              <button
                key={choice}
                onClick={() => choose(choice)}
                className={
                  selected && choice === card.answer
                    ? "correct"
                    : selected === choice
                    ? "wrong"
                    : "secondary"
                }
              >
                {choice}
              </button>
            ))}
          </div>

          {selected && (
            <div className="answer">
              <h3>{selected === card.answer ? "Correct" : "Not quite"}</h3>
              <p>{card.explanation}</p>
              <button onClick={next}>Next Question</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
