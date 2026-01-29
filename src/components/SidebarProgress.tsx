import React, { useEffect, useState } from "react";
import type { ProgressData } from "./progressStorage";
import { readProgress } from "./progressStorage";

interface SidebarProgressProps {
  currentWeekId?: string;
  currentWeekTaskIds?: string[];
}

const SidebarProgress: React.FC<SidebarProgressProps> = ({
  currentWeekId,
  currentWeekTaskIds = [],
}) => {
  const [progress, setProgress] = useState<ProgressData>({
    completedTasks: [],
    completedWeeks: [],
    totalTasks: 0,
  });

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const globalPercent =
    progress.totalTasks > 0
      ? Math.round((progress.completedTasks.length / progress.totalTasks) * 100)
      : 0;

  const weekPercent =
    currentWeekId && currentWeekTaskIds.length > 0
      ? Math.round(
          (currentWeekTaskIds.filter((id) =>
            progress.completedTasks.includes(id)
          ).length /
            currentWeekTaskIds.length) *
            100
        )
      : null;

  return (
    <aside className="sidebar-progress">
      <h3>İlerleme Özeti</h3>
      <p>
        Toplam görev: <strong>{progress.totalTasks}</strong>
      </p>
      <p>
        Tamamlanan görev: <strong>{progress.completedTasks.length}</strong> (
        {globalPercent}%)
      </p>
      {progress.completedWeeks.length > 0 && (
        <p>
          Tamamlanan haftalar:{" "}
          <strong>{progress.completedWeeks.join(", ")}</strong>
        </p>
      )}
      {weekPercent !== null && (
        <p>
          Bu hafta tamamlanan görevler: <strong>{weekPercent}%</strong>
        </p>
      )}
    </aside>
  );
};

export default SidebarProgress;

