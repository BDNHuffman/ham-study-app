export default function App() {
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
          <button>Start Flashcards</button>
          <button className="secondary">Quiz Mode</button>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <span>01</span>
          <h2>Flashcards</h2>
          <p>Study FCC rules, antennas, safety, repeaters, and electronics.</p>
        </div>

        <div className="card">
          <span>02</span>
          <h2>Practice Quiz</h2>
          <p>Answer sample Technician questions and build confidence.</p>
        </div>

        <div className="card">
          <span>03</span>
          <h2>Progress</h2>
          <p>Track what you’ve seen, what you missed, and what needs review.</p>
        </div>
      </section>
    </main>
  )
}
