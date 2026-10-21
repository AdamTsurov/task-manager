import type { Task } from '../../../entities/task/model/types'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  todoTasks: Task[]
  inProgressTasks: Task[]
  doneTasks: Task[]
  handleEditTask: (task: Task) => void
}

const KanbanBoard = (props: KanbanBoardProps) => {
  const { todoTasks, handleEditTask, inProgressTasks, doneTasks } = props
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumn title="To Do" status="todo" tasks={todoTasks} onEdit={handleEditTask} />
      <KanbanColumn
        title="In Progress"
        status="in_progress"
        tasks={inProgressTasks}
        onEdit={handleEditTask}
      />
      <KanbanColumn title="Done" status="done" tasks={doneTasks} onEdit={handleEditTask} />
    </div>
  )
}

export default KanbanBoard
