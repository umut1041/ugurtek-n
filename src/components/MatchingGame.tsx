import React, { useState, useEffect, useMemo } from "react";

type WordPair = { de: string; tr: string };

interface MatchingGameProps {
  words: WordPair[];
}

const MatchingGame: React.FC<MatchingGameProps> = ({ words }) => {
  const [selectedDe, setSelectedDe] = useState<number | null>(null);
  const [selectedTr, setSelectedTr] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const shuffledWords = useMemo(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, []);

  const shuffledTr = useMemo(() => {
    return [...shuffledWords].sort(() => Math.random() - 0.5);
  }, [shuffledWords]);

  useEffect(() => {
    if (selectedDe !== null && selectedTr !== null) {
      setMoves((prev) => prev + 1);
      const deWord = shuffledWords[selectedDe];
      const trWord = shuffledTr[selectedTr];

      if (deWord.de === trWord.de && deWord.tr === trWord.tr) {
        setMatchedPairs((prev) => new Set([...prev, selectedDe, selectedTr]));
        setScore((prev) => prev + 1);
        setSelectedDe(null);
        setSelectedTr(null);

        if (matchedPairs.size + 2 === shuffledWords.length * 2) {
          setTimeout(() => setGameComplete(true), 500);
        }
      } else {
        setTimeout(() => {
          setSelectedDe(null);
          setSelectedTr(null);
        }, 1000);
      }
    }
  }, [selectedDe, selectedTr, shuffledWords, shuffledTr, matchedPairs.size]);

  const handleDeClick = (index: number) => {
    if (matchedPairs.has(index) || selectedDe === index) return;
    setSelectedDe(index);
  };

  const handleTrClick = (index: number) => {
    if (matchedPairs.has(index) || selectedTr === index) return;
    setSelectedTr(index);
  };

  const resetGame = () => {
    setSelectedDe(null);
    setSelectedTr(null);
    setMatchedPairs(new Set());
    setScore(0);
    setMoves(0);
    setGameComplete(false);
    window.location.reload();
  };

  return (
    <div className="matching-game">
      <div className="game-header">
        <div className="game-stats">
          <span>Puan: <strong>{score}</strong> / {shuffledWords.length}</span>
          <span>Hamle: <strong>{moves}</strong></span>
        </div>
        {gameComplete && (
          <div className="game-complete">
            <h3>🎉 Tebrikler! Tüm kelimeleri eşleştirdin!</h3>
            <p>Toplam hamle: {moves}</p>
            <button onClick={resetGame} className="reset-btn">Yeniden Oyna</button>
          </div>
        )}
      </div>

      <div className="matching-grid">
        <div className="matching-column">
          <h3>Almanca</h3>
          {shuffledWords.map((word, idx) => (
            <button
              key={idx}
              className={`matching-card ${
                matchedPairs.has(idx) ? "matched" : ""
              } ${selectedDe === idx ? "selected" : ""}`}
              onClick={() => handleDeClick(idx)}
              disabled={matchedPairs.has(idx) || gameComplete}
            >
              {matchedPairs.has(idx) ? "✓ " : ""}
              {word.de}
            </button>
          ))}
        </div>

        <div className="matching-column">
          <h3>Türkçe</h3>
          {shuffledTr.map((word, idx) => (
            <button
              key={idx}
              className={`matching-card ${
                matchedPairs.has(idx) ? "matched" : ""
              } ${selectedTr === idx ? "selected" : ""}`}
              onClick={() => handleTrClick(idx)}
              disabled={matchedPairs.has(idx) || gameComplete}
            >
              {matchedPairs.has(idx) ? "✓ " : ""}
              {word.tr}
            </button>
          ))}
        </div>
      </div>

      <p className="game-instructions">
        Almanca kelimeyi tıkla, sonra Türkçe karşılığını tıkla. Eşleşirse puan kazanırsın!
      </p>
    </div>
  );
};

export default MatchingGame;
