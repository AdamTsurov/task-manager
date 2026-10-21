import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>

const SearchInput = (props: SearchInputProps) => {
  return (
    <div className="relative flex-1">
      <Search
        size={18}
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        {...props}
        type="text"
        placeholder={props.placeholder ?? 'Поиск по названию...'}
        className={`w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${props.className ?? ''}`}
      />
    </div>
  )
}

export default SearchInput