import { useState } from "react";
import { QUESTIONS } from "./questions";

const EXAM_SIZE = 35;
const PASSING_SCORE = 26;

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
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
  const accuracy = percent(score.correct, score.seen);

  const examComplete = mode === "exam-results";
  const examCorrect = examAnswers.filter((a) => a.correct).length;
  const examMissed = examAnswers.filter((a) => !a.correct);
  const currentExamQuestion = examQuestions[examIndex];

  function goHome() {
    setMode("home");
    setRevealed(false);
    setSelected(null);
  }

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

  function startFlashcards() {
    setMode("flashcards");
    setRevealed(false);
    setSelected(null);
  }

  function startQuiz() {
    setMode("quiz");
    setRevealed(false);
    setSelected(null);
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

  return (
    <main className="app">
      <div className="pollen" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
      </div>

      <header className="topbar">
        <div className="brand">
          <div className="mark" aria-hidden="true"></div>
          <div>
            <strong>Ham Study</strong>
            <span>Huffman Hive learning tool</span>
          </div>
        </div>

        <nav className="nav-actions">
          <button className="nav-link" onClick={goHome}>Dashboard</button>
          <button className="nav-link" onClick={startFlashcards}>Flashcards</button>
          <button className="nav-link" onClick={startQuiz}>Quiz</button>
          <button className="nav-link nav-primary" onClick={startExam}>Practice Exam</button>
          <a className="nav-link" href="https://www.huffman-hive.com/">← Hive</a>
        </nav>
      </header>

      <section className="hero">
        <div className="badge">📻 Huffman Hive Project</div>
        <h1>Technician License Prep</h1>
        <p>
          Flashcards, quizzes, and 35-question practice exams for real-world radio
          confidence — built for homesteads, road trips, storms, repeaters, and
          everyday ham curiosity.
        </p>

        <div className="hero-actions">
          <button onClick={startFlashcards}>Start Flashcards</button>
          <button className="secondary" onClick={startQuiz}>Quiz Mode</button>
          <button className="secondary" onClick={startExam}>Practice Exam</button>
        </div>
      </section>

      {mode === "home" && (
        <>
          <section className="stat-grid">
            <div className="stat-card">
              <span>Pool Loaded</span>
              <strong>{QUESTIONS.length}</strong>
              <p>Technician questions</p>
            </div>

            <div className="stat-card">
              <span>Accuracy</span>
              <strong>{accuracy}%</strong>
              <p>{score.correct} correct out of {score.seen || 0}</p>
            </div>

            <div className="stat-card">
              <span>Missed</span>
              <strong>{score.missed}</strong>
              <p>Questions to revisit</p>
            </div>

            <div className="stat-card">
              <span>Exam Goal</span>
              <strong>{PASSING_SCORE}/{EXAM_SIZE}</strong>
              <p>Passing score</p>
            </div>
          </section>

          <section className="grid">
            <button className="card clickable" onClick={startFlashcards}>
              <span className="card-number">01</span>
              <h2>Flashcards</h2>
              <p>Reveal answers, mark what you know, and build steady recall.</p>
            </button>

            <button className="card clickable" onClick={startQuiz}>
              <span className="card-number">02</span>
              <h2>Practice Quiz</h2>
              <p>Answer questions one at a time with instant feedback.</p>
            </button>

            <button className="card clickable" onClick={startExam}>
              <span className="card-number">03</span>
              <h2>Practice Exam</h2>
              <p>Take a randomized 35-question simulated Technician exam.</p>
            </button>
          </section>

          <section className="info-section">
            <h2>What’s Inside</h2>

            <div className="info-grid">
              <div className="info-card">
                <h3>📚 Full Question Pool</h3>
                <p>
                  The loaded pool contains Technician questions for structured study
                  and randomized testing.
                </p>
              </div>

              <div className="info-card">
                <h3>📡 Radio Topics</h3>
                <p>
                  FCC rules, operating procedures, repeaters, propagation, antennas,
                  feed lines, electronics, grounding, and RF safety.
                </p>
              </div>

              <div className="info-card">
                <h3>🧠 Study Flow</h3>
                <p>
                  Start with flashcards, drill with quizzes, then validate readiness
                  with full practice exams.
                </p>
              </div>

              <div className="info-card">
                <h3>🏕 Real-Life Use</h3>
                <p>
                  Built for practical communication skills: homesteads, storms,
                  travel, hiking radios, and rural preparedness.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {mode === "flashcards" && (
        <section className="study-panel">
          <div className="panel-top">
            <button className="secondary" onClick={goHome}>← Home</button>
            <span>{card.section} • {card.id}</span>
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
                <button className="secondary" onClick={() => mark(false)}>Missed It</button>
                <button onClick={() => mark(true)}>Got It</button>
              </>
            )}
          </div>
        </section>
      )}

      {mode === "quiz" && (
        <section className="study-panel">
          <div className="panel-top">
            <button className="secondary" onClick={goHome}>← Home</button>
            <span>{card.section} • {card.id}</span>
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
            <button className="secondary" onClick={goHome}>← Quit Exam</button>
            <span>
              Question {examIndex + 1} of {examQuestions.length} •{" "}
              {currentExamQuestion.section}
            </span>
          </div>

          <div className="exam-progress">
            <span style={{ width: `${percent(examIndex, EXAM_SIZE)}%` }}></span>
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
            <button className="secondary" onClick={goHome}>← Home</button>
            <span>Practice Exam Complete</span>
          </div>

          <h2>{examCorrect >= PASSING_SCORE ? "You passed!" : "Not quite yet."}</h2>

          <div className="answer">
            <h3>Score: {examCorrect} / {EXAM_SIZE}</h3>
            <p>Passing score: {PASSING_SCORE} / {EXAM_SIZE}</p>
          </div>

          <div className="hero-actions">
            <button onClick={startExam}>Take Another Exam</button>
            <button className="secondary" onClick={goHome}>Back Home</button>
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
                  <p><strong>Your answer:</strong> {item.selected}</p>
                  <p><strong>Correct answer:</strong> {item.question.answer}</p>
                  {item.question.reference && (
                    <p><strong>Reference:</strong> {item.question.reference}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </section>
      )}

      <footer className="footer">
        <span>© Huffman Hive</span>
        <span>Made with 🐝 + 📻 + ☁️</span>
      </footer>
    </main>
  );
}
