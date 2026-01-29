import React, { useEffect, useState } from "react";
import { readProgress, markWeekCompleted } from "./progressStorage";

interface WeekCompletionBannerProps {
  weekId: string;
  taskIds: string[];
}

const WeekCompletionBanner: React.FC<WeekCompletionBannerProps> = ({
  weekId,
  taskIds,
}) => {
  const [allDone, setAllDone] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  useEffect(() => {
    const progress = readProgress();
    const tasksDone = taskIds.every((id) =>
      progress.completedTasks.includes(id)
    );
    setAllDone(tasksDone);
    setAlreadyMarked(progress.completedWeeks.includes(weekId));
  }, [weekId, taskIds]);

  if (!allDone && !alreadyMarked) return null;

  const handleClick = () => {
    markWeekCompleted(weekId);
    setAlreadyMarked(true);
  };

  return (
    <div className="week-completion-banner">
      <p>
        🎉 Bu haftanın tüm görevlerini tamamladın. Harika iş çıkardın!
        {alreadyMarked && " (Hafta zaten tamamlandı olarak işaretli.)"}
      </p>
      {!alreadyMarked && (
        <button type="button" onClick={handleClick} className="primary-button">
          Bu haftayı tamamladım
        </button>
      )}
    </div>
  );
};

export default WeekCompletionBanner;

