import { create } from 'zustand';
import { tasksApi } from '../../shared/api/tasksApi';
import type { CreateTaskDto, Task, TaskPriority, TaskStatus, UpdateTaskDto } from '../../shared/types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  search: string;
  priorityFilter: TaskPriority | 'all';

  fetchTasks: () => Promise<void>;
  createTask: (dto: CreateTaskDto) => Promise<void>;
  updateTask: (id: number, dto: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  changeStatus: (id: number, status: TaskStatus) => Promise<void>;

  setSearch: (search: string) => void;
  setPriorityFilter: (priority: TaskPriority | 'all') => void;
  resetFilters: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  search: '',
  priorityFilter: 'all',

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await tasksApi.getTasks();
      
      set({ tasks, loading: false });
    } catch {
      set({
        error: 'Ошибка при загрузке задач с сервера Mokky.dev. Проверьте API.',
        loading: false,
      });
    }
  },

  createTask: async (dto) => {
    try {
      const newTask = await tasksApi.createTask(dto);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch {
      throw new Error('Не удалось создать задачу');
    }
  },

  updateTask: async (id, dto) => {
    try {
      const updated = await tasksApi.updateTask(id, dto);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      throw new Error('Не удалось обновить задачу');
    }
  },

  deleteTask: async (id) => {
    try {
      await tasksApi.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch {
      alert('Не удалось удалить задачу на сервере.');
    }
  },

  changeStatus: async (id, status) => {
    try {
      const updated = await tasksApi.updateTask(id, { status });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      alert('Не удалось обновить статус задачи.');
    }
  },

  setSearch: (search) => set({ search }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  resetFilters: () => set({ search: '', priorityFilter: 'all' }),
}));