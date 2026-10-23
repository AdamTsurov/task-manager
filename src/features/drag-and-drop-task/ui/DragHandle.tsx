import { GripVertical } from 'lucide-react'
import type { TaskStatus } from '../../../entities/task/model/types'
import { useDragDrop } from '../model/DragDropContext'

interface DragHandleProps {
  taskId: number
  status: TaskStatus
}

export const DragHandle = ({ taskId, status }: DragHandleProps) => {
  const { startDrag, activeTaskId } = useDragDrop()
  const isDragging = activeTaskId === taskId

  return (
    <button
      type="button"
      aria-label="Перетащить задачу в другую колонку"
      title="Перетащить задачу"
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return

        event.preventDefault()
        startDrag(taskId, status)
      }}
      className={`touch-none cursor-grab rounded p-1 transition
        hover:bg-slate-100 hover:text-indigo-600
        active:cursor-grabbing
        ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`}
    >
      <GripVertical size={18} />
    </button>
  )
}
