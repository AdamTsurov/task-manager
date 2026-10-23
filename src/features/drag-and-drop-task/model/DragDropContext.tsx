import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Task, TaskStatus } from '../../../entities/task/model/types'

interface DragDropContextValue {
  activeTaskId: number | null
  sourceStatus: TaskStatus | null
  overStatus: TaskStatus | null
  startDrag: (id: number, status: TaskStatus) => void
  cancelDrag: () => void
}

const DragDropContext = createContext<DragDropContextValue | null>(null)

interface DragDropProviderProps {
  children: ReactNode
  onDrop: (id: number, status: TaskStatus) => Promise<Task>
}

export const DragDropProvider = ({ children, onDrop }: DragDropProviderProps) => {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [sourceStatus, setSourceStatus] = useState<TaskStatus | null>(null)
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null)

  const cancelDrag = () => {
    setActiveTaskId(null)
    setSourceStatus(null)
    setOverStatus(null)
  }

  const startDrag = (taskId: number, status: TaskStatus) => {
    setActiveTaskId(taskId)
    setSourceStatus(status)
    setOverStatus(null)
  }

  useEffect(() => {
    if (activeTaskId === null) return

    const findDropZone = (x: number, y: number): TaskStatus | null => {
      const element = document.elementFromPoint(x, y)
      const zone = element?.closest<HTMLElement>('[data-drop-zone-status]')

      const status = zone?.dataset.dropZoneStatus

      if (status === 'todo' || status === 'in_progress' || status === 'done') {
        return status
      }

      return null
    }

    const handlePointerMove = (event: PointerEvent) => {
      setOverStatus(findDropZone(event.clientX, event.clientY))
    }

    const handlePointerUp = (event: PointerEvent) => {
      const targetStatus = findDropZone(event.clientX, event.clientY)
      const taskId = activeTaskId

      if (targetStatus && targetStatus !== sourceStatus) {
        void onDrop(taskId, targetStatus)
      }

      cancelDrag()
    }

    const handlePointerCancel = () => {
      cancelDrag()
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerCancel)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
    }
  }, [activeTaskId, sourceStatus, onDrop])

  return (
    <DragDropContext.Provider
      value={{
        activeTaskId,
        sourceStatus,
        overStatus,
        startDrag,
        cancelDrag,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}

export const useDragDrop = () => {
  const context = useContext(DragDropContext)

  if (!context) {
    throw new Error('useDragDrop must be used inside DragDropProvider')
  }

  return context
}
