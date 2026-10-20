import React from 'react';
import { Search, RotateCcw, Plus } from 'lucide-react';
import { useTaskStore } from '../../app/store/useTaskStore';
import type { TaskPriority } from '../../shared/types/task';

interface FilterBarProps {
  onOpenCreateModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onOpenCreateModal }) => {
  const { search, priorityFilter, setSearch, setPriorityFilter, resetFilters } = useTaskStore();
  const isFiltered = search !== '' || priorityFilter !== 'all';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="all">Все приоритеты</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            <RotateCcw size={15} />
            <span>Сбросить</span>
          </button>
        )}
      </div>

      <button
        onClick={onOpenCreateModal}
        className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm"
      >
        <Plus size={18} />
        <span>Создать задачу</span>
      </button>
    </div>
  );
};