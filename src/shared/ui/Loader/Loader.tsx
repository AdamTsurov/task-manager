import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <Loader2 className="animate-spin mb-2" size={32} />
      <span className="text-sm font-medium">Загрузка задач...</span>
    </div>
  )
}

export default Loader
