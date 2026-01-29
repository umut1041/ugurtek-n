import React, { useEffect, useState } from "react";
import { readProgress, toggleTask } from "./progressStorage";

interface TaskCheckboxProps {
  taskId: string;
  label: string;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ taskId, label }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = readProgress();
    setChecked(stored.completedTasks.includes(taskId));
  }, [taskId]);

  const toggle = () => {
    const next = toggleTask(taskId);
    setChecked(next.completedTasks.includes(taskId));
  };

  return (
    <label className="task-checkbox">
      <input type="checkbox" checked={checked} onChange={toggle} />
      <span>{label}</span>
    </label>
  );
};

export default TaskCheckbox;

