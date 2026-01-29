import React, { useState, useEffect } from "react";

type WordSearchWord = { word: string; tr: string };

interface WordSearchGameProps {
  words: WordSearchWord[];
  grid: string[][];
}

const WordSearchGame: React.FC<WordSearchGameProps> = ({ words, grid }) => {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    if (isCellFound(row, col)) return;

    if (!isSelecting) {
      setSelectedCells([[row, col]]);
      setIsSelecting(true);
    } else {
      const lastCell = selectedCells[selectedCells.length - 1];
      const [lastRow, lastCol] = lastCell;
      
      const isAdjacent = 
        (Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1) &&
        !(row === lastRow && col === lastCol);

      if (isAdjacent) {
        const newSelection = [...selectedCells, [row, col]];
        setSelectedCells(newSelection);

        const word = newSelection
          .map(([r, c]) => grid[r][c])
          .join("")
          .toUpperCase();

        const reversedWord = word.split("").reverse().join("");

        const matchedWord = words.find(
          (w) => w.word === word || w.word === reversedWord
        );

        if (matchedWord && !foundWords.has(matchedWord.word)) {
          setFoundWords((prev) => new Set([...prev, matchedWord.word]));
          setIsSelecting(false);
          setSelectedCells([]);
        }
      } else {
        setSelectedCells([[row, col]]);
      }
    }
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting && selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1];
      const [lastRow, lastCol] = lastCell;

      if (
        (Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1) &&
        !(row === lastRow && col === lastCol)
      ) {
        const isHorizontal = row === lastRow;
        const isVertical = col === lastCol;
        const isDiagonal =
          Math.abs(row - lastRow) === 1 && Math.abs(col - lastCol) === 1;

        if (isHorizontal || isVertical || isDiagonal) {
          setSelectedCells((prev) => {
            if (prev.some(([r, c]) => r === row && c === col)) return prev;
            return [...prev, [row, col]];
          });
        }
      }
    }
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellFound = (row: number, col: number) => {
    const cellChar = grid[row][col];
    return words.some((w) => foundWords.has(w.word) && w.word.includes(cellChar));
  };

  const resetGame = () => {
    setFoundWords(new Set());
    setSelectedCells([]);
    setIsSelecting(false);
  };

  const allFound = foundWords.size === words.length;

  return (
    <div className="wordsearch-game">
      <div className="wordsearch-header">
        <div className="wordsearch-stats">
          Bulunan: <strong>{foundWords.size}</strong> / {words.length}
        </div>
        {allFound && (
          <div className="wordsearch-complete">
            <h3>🎉 Tüm kelimeleri buldun!</h3>
            <button onClick={resetGame} className="reset-btn">
              Yeniden Oyna
            </button>
          </div>
        )}
      </div>

      <div className="wordsearch-words">
        <h3>Aranacak Kelimeler:</h3>
        <ul>
          {words.map((w, idx) => (
            <li
              key={idx}
              className={foundWords.has(w.word) ? "found" : ""}
            >
              {foundWords.has(w.word) ? "✓ " : ""}
              <strong>{w.word}</strong> — {w.tr}
            </li>
          ))}
        </ul>
      </div>

      <div className="wordsearch-grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="wordsearch-row">
            {row.map((cell, colIdx) => (
              <button
                key={`${rowIdx}-${colIdx}`}
                className={`wordsearch-cell ${
                  isCellFound(rowIdx, colIdx) ? "found" : ""
                } ${isCellSelected(rowIdx, colIdx) ? "selected" : ""}`}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                onMouseEnter={() => handleCellMouseEnter(rowIdx, colIdx)}
                disabled={isCellFound(rowIdx, colIdx)}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="game-instructions">
        Kelimeleri bulmak için hücreleri tıklayarak seç. Yatay, dikey veya çapraz olabilir.
      </p>
    </div>
  );
};

export default WordSearchGame;
