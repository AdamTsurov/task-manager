import type { Task, TaskStatus } from "../../../entities/task/model/types"
import { TaskCard } from "../../../entities/task/ui/TaskCard"
import { useDragDrop } from "../../../shared/ui/drag-and-drop/model/DragDropContext"
import { Draggable } from "../../../shared/ui/drag-and-drop/ui/Draggable"
import { DragHandle } from "../../../shared/ui/drag-and-drop/ui/DragHandle"


interface KanbanColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  onEdit: (task: Task) => void
}

const statusBadgeColors: Record<TaskStatus, string> = {
  todo: 'bg-slate-200 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-emerald-100 text-emerald-800',
}

export const KanbanColumn = ({
  title,
  status,
  tasks,
  onEdit,
}: KanbanColumnProps) => {
  const { activeTaskId, overStatus } = useDragDrop()

  const isDropTarget =
    activeTaskId !== null && overStatus === status

  return (
    <div
      data-drop-zone-status={status}
      className={`min-h-[500px] rounded-2xl border p-4 flex flex-col
        transition-colors
        ${
          isDropTarget
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-200/80 bg-slate-50/70'
        }`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 text-base">{title}</h2>

        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadgeColors[status]}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div
            className={`h-32 flex items-center justify-center border-2 border-dashed rounded-xl text-xs
              ${
                isDropTarget
                  ? 'border-indigo-300 text-indigo-500'
                  : 'border-slate-200 text-slate-400'
              }`}
          >
            {isDropTarget ? 'Отпустите задачу здесь' : 'Нет задач'}
          </div>
        ) : (
          tasks.map((task) => (
            <Draggable key={task.id} taskId={task.id}>
              <TaskCard
                task={task}
                onEdit={onEdit}
                dragHandle={
                  <DragHandle taskId={task.id} status={status} />
                }
              />
            </Draggable>
          ))
        )}
      </div>
    </div>
  )
}
