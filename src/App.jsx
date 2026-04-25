import { useMemo, useState } from "react";
import { QUESTIONS } from "./questions";

const EXAM_SIZE = 35;
const PASSING_SCORE = 26;

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [mode, setMode] = useState("home");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ seen: 0, correct: 0, missed: 0 });

  const [examQuestions, setExamQuestions] = useState([]);
  const [examIndex, setExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState([]);

  const card = QUESTIONS[index % QUESTIONS.length];

  const examComplete = mode === "exam-results";
  const examCorrect = examAnswers.filter((a) => a.correct).length;
  const examMissed = examAnswers.filter((a) => !a.correct);

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

  function startExam() {
    const newExam = shuffleArray(QUESTIONS).slice(0, EXAM_SIZE);
    setExamQuestions(newExam);
    setExamIndex(0);
    setExamAnswers([]);
    setMode("exam");
  }

  function answerExam(choice) {
    const current = examQuestions[examIndex];
    const correct = choice === current.answer;

    const updatedAnswers = [
      ...examAnswers,
      {
        question: current,
        selected: choice,
        correct
      }
    ];

    setExamAnswers(updatedAnswers);

    if (examIndex + 1 >= examQuestions.length) {
      setMode("exam-results");
    } else {
      setExamIndex(examIndex + 1);
    }
  }

  const currentExamQuestion = examQuestions[examIndex];

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
          <button className="secondary" onClick={startExam}>
            Practice Exam
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

            <button className="card clickable" onClick={startExam}>
              <span>03</span>
              <h2>Practice Exam</h2>
              <p>Take a 35-question simulated Technician exam. 26 correct passes.</p>
            </button>
          </section>

          <section className="info-section">
            <h2>Your Progress</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>Seen</h3>
                <p>{score.seen}</p>
              </div>
              <div className="info-card">
                <h3>Correct</h3>
                <p>{score.correct}</p>
              </div>
              <div className="info-card">
                <h3>Missed</h3>
                <p>{score.missed}</p>
              </div>
              <div className="info-card">
                <h3>Question Pool</h3>
                <p>{QUESTIONS.length} Technician questions loaded.</p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2>What’s Inside the Technician Study App</h2>

            <div className="info-grid">
              <div className="info-card">
                <h3>📚 Full Technician Question Pool</h3>
                <p>
                  Practice from the official Technician exam pool used for real
                  amateur radio testing.
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
                  Learn concepts with flashcards, then switch to quizzes to check
                  recall and track weak spots.
                </p>
              </div>

              <div className="info-card">
                <h3>📝 Practice Exam</h3>
                <p>
                  Simulate the real Technician test with 35 randomized questions and
                  a pass/fail result.
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
              {card.reference && <p>Reference: {card.reference}</p>}
              {card.explanation && <p>{card.explanation}</p>}
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
              <p>Correct answer: {card.answer}</p>
              {card.reference && <p>Reference: {card.reference}</p>}
              <button onClick={next}>Next Question</button>
            </div>
          )}
        </section>
      )}

      {mode === "exam" && currentExamQuestion && (
        <section className="study-panel">
          <div className="panel-top">
            <button className="secondary" onClick={() => setMode("home")}>
              ← Quit Exam
            </button>

            <span>
              Question {examIndex + 1} of {examQuestions.length} •{" "}
              {currentExamQuestion.section}
            </span>
          </div>

          <h2>{currentExamQuestion.question}</h2>

          <div className="choices">
            {currentExamQuestion.choices.map((choice) => (
              <button
                key={choice}
                className="secondary"
                onClick={() => answerExam(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        </section>
      )}

      {examComplete && (
        <section className="study-panel">
          <div className="panel-top">
            <button className="secondary" onClick={() => setMode("home")}>
              ← Home
            </button>

            <span>Practice Exam Complete</span>
          </div>

          <h2>
            {examCorrect >= PASSING_SCORE ? "You passed!" : "Not quite yet."}
          </h2>

          <div className="answer">
            <h3>
              Score: {examCorrect} / {EXAM_SIZE}
            </h3>
            <p>
              Passing score: {PASSING_SCORE} / {EXAM_SIZE}
            </p>
          </div>

          <div className="hero-actions">
            <button onClick={startExam}>Take Another Exam</button>
            <button className="secondary" onClick={() => setMode("home")}>
              Back Home
            </button>
          </div>

          {examMissed.length > 0 && (
            <section className="review-section">
              <h3>Review Missed Questions</h3>

              {examMissed.map((item, idx) => (
                <div className="review-card" key={item.question.id}>
                  <p className="review-label">
                    {idx + 1}. {item.question.section} • {item.question.id}
                  </p>
                  <h4>{item.question.question}</h4>
                  <p>
                    <strong>Your answer:</strong> {item.selected}
                  </p>
                  <p>
                    <strong>Correct answer:</strong> {item.question.answer}
                  </p>
                  {item.question.reference && (
                    <p>
                      <strong>Reference:</strong> {item.question.reference}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </section>
      )}
    </main>
  );
}
