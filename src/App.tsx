import { useEffect, useMemo, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import type { Task, TaskPriority, TaskStatus } from './shared/types/task'
import { useTaskStore } from './app/store/useTaskStore'
import { FilterBar } from './components/FilterBar/FilterBar'
import { KanbanColumn } from './components/KanbanColumn/KanbanColumn'
import { TaskModal } from './components/TaskModal/TaskModal'

export default function App() {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Manager</h1>
        <p className="text-slate-500 text-sm mt-1">
          Kanban-доска (React + TypeScript + Zustand + Mokky.dev)
        </p>
      </header>

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
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <span className="text-sm font-medium">Загрузка задач...</span>
        </div>
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
    </div>
  )
}
