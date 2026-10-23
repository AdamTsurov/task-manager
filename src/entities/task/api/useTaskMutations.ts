import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from './tasksApi'
import type { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from '../model/types'
import { taskKeys } from './taskQueries'

export const useTaskMutations = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (dto: CreateTaskDto) => tasksApi.createTask(dto),

    onSuccess: (createdTask) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (oldTasks) =>
        oldTasks ? [...oldTasks, createdTask] : oldTasks
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTaskDto }) => tasksApi.updateTask(id, dto),

    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (oldTasks) =>
        oldTasks?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),

    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (oldTasks) =>
        oldTasks?.filter((task) => task.id !== deletedId)
      )
    },
  })

  return {
    createTask: (dto: CreateTaskDto) => createMutation.mutateAsync(dto),

    updateTask: (id: number, dto: UpdateTaskDto) => updateMutation.mutateAsync({ id, dto }),

    deleteTask: (id: number) => deleteMutation.mutateAsync(id),

    changeStatus: (id: number, status: TaskStatus) =>
      updateMutation.mutateAsync({ id, dto: { status } }),

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
