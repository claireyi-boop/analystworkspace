import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search interactions...',
  className = '',
}: SearchBarProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50/80 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-200 transition-colors ${className}`}
    >
      <Search size={16} className="text-gray-400 shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent border-0 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
        aria-label="Search customer interactions"
      />
    </div>
  )
}
