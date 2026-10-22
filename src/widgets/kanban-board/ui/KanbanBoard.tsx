import type { Task, TaskStatus } from "../../../entities/task/model/types"
import { DragDropProvider } from "../../../shared/ui/drag-and-drop/model/DragDropContext"
import { KanbanColumn } from "./KanbanColumn"


interface KanbanBoardProps {
  todoTasks: Task[]
  inProgressTasks: Task[]
  doneTasks: Task[]
  handleEditTask: (task: Task) => void
  onTaskStatusChange: (
    id: number,
    status: TaskStatus,
  ) => Promise<Task>
}

const KanbanBoard = ({
  todoTasks,
  inProgressTasks,
  doneTasks,
  handleEditTask,
  onTaskStatusChange,
}: KanbanBoardProps) => {
  return (
    <DragDropProvider onDrop={onTaskStatusChange}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={todoTasks}
          onEdit={handleEditTask}
        />

        <KanbanColumn
          title="In Progress"
          status="in_progress"
          tasks={inProgressTasks}
          onEdit={handleEditTask}
        />

        <KanbanColumn
          title="Done"
          status="done"
          tasks={doneTasks}
          onEdit={handleEditTask}
        />
      </div>
    </DragDropProvider>
  )
}

export default KanbanBoard
