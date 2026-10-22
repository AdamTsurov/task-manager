import { useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import type { Task, TaskPriority, TaskStatus } from '../../../entities/task/model/types'
import { useTasksQuery } from '../../../entities/task/api/taskQueries'
import { useTaskMutations } from '../../../entities/task/api/useTaskMutations'
import { FilterBar } from '../../../features/filter-tasks/ui/FilterBar'
import { TaskModal } from '../../../features/manage-task/ui/TaskModal'
import Header from '../../../widgets/header/Header/ui/Header'
import KanbanBoard from '../../../widgets/kanban-board/ui/KanbanBoard'
import Loader from '../../../shared/ui/Loader/Loader'

export default function BoardPage() {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const {
    data: tasks = [],
    isPending,
    error,
    refetch,
  } = useTasksQuery()

  const { createTask, updateTask, changeStatus } = useTaskMutations()

  const resetFilters = () => {
    setSearch('')
    setPriorityFilter('all')
  }

  const handleModalSubmit = async (taskData: {
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
    } else {
      await createTask(taskData)
    }

    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter

      return matchesSearch && matchesPriority
    })
  }, [tasks, search, priorityFilter])

  const todoTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === 'todo'),
    [filteredTasks],
  )

  const inProgressTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === 'in_progress'),
    [filteredTasks],
  )

  const doneTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === 'done'),
    [filteredTasks],
  )

  const hasActiveFilters = search.trim() !== '' || priorityFilter !== 'all'

  return (
    <>
      <Header />

      <FilterBar
        search={search}
        priorityFilter={priorityFilter}
        onSearchChange={setSearch}
        onPriorityChange={setPriorityFilter}
        onResetFilters={resetFilters}
        onOpenCreateModal={() => {
          setEditingTask(null)
          setIsModalOpen(true)
        }}
      />

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          <AlertCircle size={20} className="shrink-0" />

          <div className="flex-1 text-sm">
            {error.message || 'Не удалось загрузить задачи'}
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold transition hover:bg-red-200"
          >
            Повторить
          </button>
        </div>
      )}

      {isPending ? (
        <Loader />
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <p className="font-medium text-slate-500">
            {hasActiveFilters
              ? 'Задачи по заданным фильтрам не найдены'
              : 'Пока нет задач'}
          </p>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Сбросить фильтры
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null)
                setIsModalOpen(true)
              }}
              className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Создать первую задачу
            </button>
          )}
        </div>
      ) : (
        <KanbanBoard
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks}
          doneTasks={doneTasks}
          handleEditTask={handleEditTask}
          onTaskStatusChange={changeStatus}
        />
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleModalSubmit}
        taskToEdit={editingTask}
      />
    </>
  )
}