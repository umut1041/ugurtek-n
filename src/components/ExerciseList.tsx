import React, { useState } from "react";
import lesenData from "../data/exercises/lesen-basic.json";

type Exercise = (typeof lesenData.exercises)[number];

const ExerciseList: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(
    lesenData.exercises[0]?.id ?? null
  );

  const selected: Exercise | undefined = lesenData.exercises.find(
    (e) => e.id === selectedId
  );

  return (
    <div className="exercise-list">
      <div className="exercise-selector">
        <label>
          Görevi seç:
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {lesenData.exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.id}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selected && (
        <div className="exercise-card">
          <pre className="exercise-text">{selected.text}</pre>
          <ol className="exercise-questions">
            {selected.questions.map((q) => (
              <li key={q.id}>
                <p>{q.prompt}</p>
                <ul>
                  {q.options.map((opt, idx) => (
                    <li key={idx}>
                      <span>{String.fromCharCode(97 + idx)}) </span>
                      {opt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;

