
import type { ReactNode } from 'react'
import { useDragDrop } from '../model/DragDropContext'

interface DraggableProps {
  taskId: number
  children: ReactNode
}

export const Draggable = ({ taskId, children }: DraggableProps) => {
  const { activeTaskId } = useDragDrop()
  const isDragging = activeTaskId === taskId

  return (
    <div
      className={`transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  )
}
