import type { Dispatch, SetStateAction } from "react";

export const STORAGE_KEY = "goetheA2Progress";

export type ProgressData = {
  completedTasks: string[];
  completedWeeks: string[];
  totalTasks: number;
};

export function readProgress(): ProgressData {
  if (typeof window === "undefined") {
    return { completedTasks: [], completedWeeks: [], totalTasks: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { completedTasks: [], completedWeeks: [], totalTasks: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      completedTasks: parsed.completedTasks ?? [],
      completedWeeks: parsed.completedWeeks ?? [],
      totalTasks: parsed.totalTasks ?? 0,
    };
  } catch {
    return { completedTasks: [], completedWeeks: [], totalTasks: 0 };
  }
}

export function writeProgress(next: ProgressData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function toggleTask(taskId: string): ProgressData {
  const current = readProgress();
  const exists = current.completedTasks.includes(taskId);
  const completedTasks = exists
    ? current.completedTasks.filter((id) => id !== taskId)
    : [...current.completedTasks, taskId];

  const next: ProgressData = {
    ...current,
    completedTasks,
    totalTasks: Math.max(current.totalTasks, completedTasks.length),
  };

  writeProgress(next);
  return next;
}

export function markWeekCompleted(weekId: string) {
  const current = readProgress();
  if (current.completedWeeks.includes(weekId)) return;
  const next: ProgressData = {
    ...current,
    completedWeeks: [...current.completedWeeks, weekId],
  };
  writeProgress(next);
}

export function syncProgressToState(
  setState: Dispatch<SetStateAction<ProgressData>>
) {
  const value = readProgress();
  setState(value);
}

