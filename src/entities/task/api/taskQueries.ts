import { useQuery } from '@tanstack/react-query'
import { tasksApi } from '../../../shared/api/tasksApi'

export const taskKeys = {
  all: ['tasks'] as const,
}

export const useTasksQuery = () =>
  useQuery({
    queryKey: taskKeys.all,
    queryFn: tasksApi.getTasks,
  })
