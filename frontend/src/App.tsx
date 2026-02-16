import { useState, useEffect, useCallback } from "react";
import './App.css';
import { generateFlashcards } from "./api";

// --- Components ---

const Flashcard = ({ 
  card, 
  isFlipped, 
  onFlip 
}: { 
  card: { question: string, answer: string }, 
  isFlipped: boolean, 
  onFlip: () => void 
}) => {
  return (
    <div 
      className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} 
      onClick={onFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="flashcard-label">Question</div>
          <p>{card.question}</p>
          <small>Press Space or Click to flip</small>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-label">Answer</div>
          <p>{card.answer}</p>
          <small>Press Space or Click to see question</small>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

function App() {
  const [text, setText] = useState("");
  const [cards, setCards] = useState<unknown[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  // Helper functions for navigation
  const nextCard = useCallback(() => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }, [currentCardIndex, cards.length]);

  const prevCard = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentCardIndex]);

  const toggleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cards.length === 0) return;
      
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page scroll
        toggleFlip();
      } else if (e.code === "ArrowRight") {
        nextCard();
      } else if (e.code === "ArrowLeft") {
        prevCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards.length, toggleFlip, nextCard, prevCard]);

  async function handleGenerate() {
    if (!text.trim()) return;
    try {
      setIsLoading(true);
      setError("");
      const data = await generateFlashcards(text);
      setCards(data.flashcards || []);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError("Failed to generate flashcards. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const currentCard = cards[currentCardIndex];
  const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  return (
    <div className="app-container">
      {/* Sidebar - Fixed to left */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-header">📚 FlashFlow</div>
          <nav className="sidebar-nav">
            <div className="nav-item active">📇 Decks</div>
            <div className="nav-item">📖 Library</div>
            <div className="nav-item">📊 Stats</div>
            <div className="nav-item">⚙️ Settings</div>
          </nav>
        </div>
        <div className="profile">
          <div className="profile-avatar">JD</div>
          <div className="profile-name">Jane Doe</div>
        </div>
      </aside>

      {/* Main Content - Centered remaining space */}
      <main className="main-content">
        <header className="header">
          <h1 className="header-title">{cards.length > 0 ? "Study Session" : "FlashFlow"}</h1>
          <p className="header-subtitle">
            {cards.length > 0 ? "Master your content" : "Create Flashcards with AI"}
          </p>
          
          {cards.length > 0 && (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-text">{currentCardIndex + 1} / {cards.length} Cards</div>
            </>
          )}
        </header>

        <section className="study-session">
          {!cards.length ? (
            <div className="generation-box">
              <div className="input-area">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste your study text, lecture notes, or paragraphs here..."
                  disabled={isLoading}
                />
                <button 
                  className="generate-btn" 
                  onClick={handleGenerate} 
                  disabled={isLoading || !text.trim()}
                >
                  {isLoading ? (
                    <><span className="spinner"></span> Generating...</>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
              {isLoading && <div className="loading-message">Analyzing text and creating cards...</div>}
            </div>
          ) : (
            <div className="flashcard-workspace">
              {currentCard && (
                <Flashcard 
                  card={currentCard} 
                  isFlipped={isFlipped} 
                  onFlip={toggleFlip} 
                />
              )}
              
              <div className="navigation">
                <button className="nav-btn" onClick={prevCard} disabled={currentCardIndex === 0}>
                  ←
                </button>
                <div className="progress-dots">
                  {cards.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`dot ${idx === currentCardIndex ? 'active' : ''}`}
                    ></div>
                  ))}
                </div>
                <button className="nav-btn" onClick={nextCard} disabled={currentCardIndex === cards.length - 1}>
                  →
                </button>
              </div>

              <div className="action-buttons">
                <button className="action-btn" onClick={() => setCards([])}>New Deck</button>
                <button className="action-btn primary">Save Deck</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;