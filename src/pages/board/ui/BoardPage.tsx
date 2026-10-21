import { useEffect, useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import type { Task, TaskPriority, TaskStatus } from '../../../entities/task/model/types'
import { useTaskStore } from '../../../entities/task/model/useTaskStore'
import { FilterBar } from '../../../features/filter-tasks/ui/FilterBar'
import { TaskModal } from '../../../features/manage-task/ui/TaskModal'
import Header from '../../../widgets/header/Header/ui/Header'
import KanbanBoard from '../../../widgets/kanban-board/ui/KanbanBoard'
import Loader from '../../../shared/ui/Loader/Loader'

export default function BoardPage() {
  const {
    tasks,
    loading,
    error,
    search,
    priorityFilter,
    fetchTasks,
    createTask,
    updateTask,
    resetFilters,
  } = useTaskStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

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
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }, [tasks, search, priorityFilter])

  const todoTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'todo'), [filteredTasks])
  const inProgressTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === 'in_progress'),
    [filteredTasks]
  )
  const doneTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'done'), [filteredTasks])

  return (
    <>
      <Header />

      <FilterBar
        onOpenCreateModal={() => {
          setEditingTask(null)
          setIsModalOpen(true)
        }}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <div className="flex-1 text-sm">{error}</div>
          <button
            onClick={fetchTasks}
            className="text-xs bg-red-100 hover:bg-red-200 font-semibold px-3 py-1.5 rounded-lg transition"
          >
            Повторить
          </button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : filteredTasks.length === 0 && tasks.length > 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium">Задачи по заданным фильтрам не найдены</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-sm text-indigo-600 hover:underline font-semibold"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <KanbanBoard
          todoTasks={todoTasks}
          handleEditTask={handleEditTask}
          inProgressTasks={inProgressTasks}
          doneTasks={doneTasks}
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
