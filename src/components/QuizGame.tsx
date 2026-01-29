import React, { useState } from "react";

type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
};

interface QuizGameProps {
  questions: QuizQuestion[];
}

const QuizGame: React.FC<QuizGameProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);

    if (index === currentQuestion.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-game">
        <div className="quiz-result">
          <h2>🎯 Quiz Tamamlandı!</h2>
          <div className="result-score">
            <p className="score-number">{score} / {questions.length}</p>
            <p className="score-percentage">%{percentage}</p>
          </div>
          <p className="result-message">
            {percentage >= 80
              ? "Harika! Çok iyi bildin! 🎉"
              : percentage >= 60
              ? "İyi! Biraz daha çalışmalısın. 👍"
              : "Devam et! Daha fazla pratik yap. 💪"}
          </p>
          <button onClick={resetQuiz} className="reset-btn">
            Tekrar Oyna
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <div className="quiz-progress">
          Soru {currentIndex + 1} / {questions.length}
        </div>
        <div className="quiz-score">Puan: {score}</div>
      </div>

      <div className="quiz-question">
        <h3>{currentQuestion.question}</h3>
        <ul className="quiz-options">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQuestion.correct;
            const showFeedback = answered && isSelected;

            return (
              <li key={idx}>
                <button
                  className={`quiz-option ${
                    showFeedback
                      ? isCorrect
                        ? "correct"
                        : "incorrect"
                      : isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                >
                  {option}
                  {showFeedback && (
                    <span className="feedback-icon">
                      {isCorrect ? " ✓" : " ✗"}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {answered && (
        <div className="quiz-feedback">
          {selectedAnswer === currentQuestion.correct ? (
            <p className="feedback-correct">✓ Doğru! Harika!</p>
          ) : (
            <p className="feedback-incorrect">
              ✗ Yanlış. Doğru cevap: <strong>{currentQuestion.options[currentQuestion.correct]}</strong>
            </p>
          )}
          <button onClick={handleNext} className="next-btn">
            {isLastQuestion ? "Sonuçları Gör" : "Sonraki Soru →"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
