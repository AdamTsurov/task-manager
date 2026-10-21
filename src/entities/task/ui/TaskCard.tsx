import React, { useState } from 'react'
import { Pencil, Trash2, Calendar } from 'lucide-react'
import type { Task, TaskPriority, TaskStatus } from '../model/types'
import { useTaskStore } from '../model/useTaskStore'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

const priorityStyles: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Низкий' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Средний' },
  high: { bg: 'bg-red-100', text: 'text-red-800', label: 'Высокий' },
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const { deleteTask, changeStatus } = useTaskStore()
  const priorityInfo = priorityStyles[task.priority]

  const formattedDate = new Date(task.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-2 mb-2">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityInfo.bg} ${priorityInfo.text}`}
        >
          {priorityInfo.label}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-indigo-600 transition"
            title="Редактировать"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1 text-slate-400 hover:text-red-600 transition"
            title="Удалить"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-slate-800 mb-1 leading-snug break-words">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-slate-600 mb-3 whitespace-pre-wrap break-words">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-1">
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>

        <select
          value={task.status}
          onChange={(e) => changeStatus(task.id, e.target.value as TaskStatus)}
          className="text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 font-medium cursor-pointer"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {showConfirm && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          <p className="font-medium mb-1.5">Удалить эту задачу?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-700"
            >
              Отмена
            </button>
            <button
              onClick={() => {
                deleteTask(task.id)
                setShowConfirm(false)
              }}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
            >
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
