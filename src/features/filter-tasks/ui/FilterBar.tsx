import React from 'react'
import { RotateCcw, Plus } from 'lucide-react'
import { useTaskStore } from '../../../entities/task/model/useTaskStore'
import type { TaskPriority } from '../../../entities/task/model/types'
import SearchInput from '../../../shared/ui/SearchInput/SearchInput'
import { Select } from '../../../shared/ui/Select/Select'
import { Button } from '../../../shared/ui/Button/Button'

interface FilterBarProps {
  onOpenCreateModal: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({ onOpenCreateModal }) => {
  const { search, priorityFilter, setSearch, setPriorityFilter, resetFilters } = useTaskStore()
  const isFiltered = search !== '' || priorityFilter !== 'all'

  const priorityOptions = [
    { value: 'all', label: 'Все приоритеты' },
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
  ]

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

        <Select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | 'all')}
          options={priorityOptions}
          aria-label="Фильтр по приоритету"
          className="sm:w-48"
        />

        {isFiltered && (
          <Button
            onClick={resetFilters}
            icon={<RotateCcw size={15} />}
            className="border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            Сбросить
          </Button>
        )}
      </div>

      <Button
        onClick={onOpenCreateModal}
        icon={<Plus size={18} />}
        className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm px-4"
      >
        Создать задачу
      </Button>
    </div>
  )
}
