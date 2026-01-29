import React, { useEffect, useState } from "react";
import type { ProgressData } from "./progressStorage";
import { readProgress } from "./progressStorage";

const GlobalProgressSummary: React.FC = () => {
  const [progress, setProgress] = useState<ProgressData>({
    completedTasks: [],
    completedWeeks: [],
    totalTasks: 0,
  });

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const percent =
    progress.totalTasks > 0
      ? Math.round((progress.completedTasks.length / progress.totalTasks) * 100)
      : 0;

  return (
    <div className="progress-summary">
      <div className="progress-bar-outer" aria-label="Genel ilerleme">
        <div
          className="progress-bar-inner"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p>
        Tamamlanan görevler:{" "}
        <strong>{progress.completedTasks.length}</strong> /{" "}
        <strong>{progress.totalTasks}</strong> ({percent}%)
      </p>
      {progress.completedWeeks.length > 0 && (
        <p>
          Tamamlanan haftalar:{" "}
          <strong>{progress.completedWeeks.length}</strong>
        </p>
      )}
      <p className="progress-note">
        İlerlemen bu cihazda saklanır. Çerezleri temizlersen sıfırlanır.
      </p>
    </div>
  );
};

export default GlobalProgressSummary;

