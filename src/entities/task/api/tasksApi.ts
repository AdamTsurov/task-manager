import axios from 'axios'
import type { CreateTaskDto, Task, UpdateTaskDto } from '../model/types'

const API_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: API_URL,
})

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    const res = await client.get<Task[]>('tasks')
    return res.data
  },

  createTask: async (dto: CreateTaskDto): Promise<Task> => {
    const res = await client.post<Task>('tasks', {
      ...dto,
      createdAt: new Date().toISOString(),
    })
    return res.data
  },

  updateTask: async (id: number, dto: UpdateTaskDto): Promise<Task> => {
    const res = await client.patch<Task>(`tasks/${id}`, dto)
    return res.data
  },

  deleteTask: async (id: number): Promise<void> => {
    await client.delete(`tasks/${id}`)
  },
}
