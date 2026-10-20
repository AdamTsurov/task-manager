import React from 'react';
import type { Task, TaskStatus } from '../../shared/types/task';
import { TaskCard } from '../TaskCard/TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const statusBadgeColors: Record<TaskStatus, string> = {
  todo: 'bg-slate-200 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-emerald-100 text-emerald-800',
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onEdit,
}) => {
  return (
    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 text-base">{title}</h2>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadgeColors[status]}`}>
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
            Нет задач
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
};