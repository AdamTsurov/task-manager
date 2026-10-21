export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
}

export type CreateTaskDto = Omit<Task, 'id' | 'createdAt'>
export type UpdateTaskDto = Partial<Omit<Task, 'id' | 'createdAt'>>