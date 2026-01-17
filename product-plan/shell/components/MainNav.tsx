interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
}

export function MainNav({ items, onNavigate }: MainNavProps) {
  return (
    <nav className="ml-8 flex items-center gap-1">
      {items.map((item) => (
        <button
          key={item.href}
          onClick={() => onNavigate?.(item.href)}
          className={`
            relative px-4 py-2 text-sm font-medium transition-colors
            ${
              item.isActive
                ? 'text-amber-600 dark:text-amber-500'
                : 'text-stone-600 hover:text-cyan-600 dark:text-stone-400 dark:hover:text-cyan-400'
            }
          `}
        >
          {item.label}
          {/* Active indicator */}
          {item.isActive && (
            <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-amber-500 dark:bg-amber-400" />
          )}
        </button>
      ))}
    </nav>
  )
}
