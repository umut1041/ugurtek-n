import React, { useState } from "react";
import data from "../data/exercises/grammar-perfekt.json";

type Question = (typeof data.questions)[number];

const GrammarQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [showResult, setShowResult] = useState(false);

  const handleChange = (qId: string, index: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: index }));
  };

  const score = data.questions.reduce(
    (acc, q) =>
      answers[q.id] === q.correctIndex ? acc + 1 : acc,
    0
  );

  const total = data.questions.length;

  return (
    <div className="grammar-quiz">
      <h3>Perfekt – Mini Quiz</h3>
      <ol>
        {data.questions.map((q: Question) => (
          <li key={q.id} className="grammar-question">
            <p>{q.prompt}</p>
            <ul>
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.correctIndex === idx;
                const showFeedback = showResult && selected;
                return (
                  <li key={idx}>
                    <label>
                      <input
                        type="radio"
                        name={q.id}
                        value={idx}
                        checked={selected}
                        onChange={() => handleChange(q.id, idx)}
                      />
                      {opt}
                    </label>
                    {showFeedback && (
                      <span className={isCorrect ? "correct" : "incorrect"}>
                        {isCorrect ? " ✓ Doğru" : " ✗ Yanlış"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {showResult && (
              <p className="explanation">
                Açıklama: {q.explanation}
              </p>
            )}
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="primary-button"
        onClick={() => setShowResult(true)}
      >
        Cevapları Kontrol Et ({score}/{total})
      </button>
    </div>
  );
};

export default GrammarQuiz;

