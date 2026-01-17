interface SelectionCardProps {
    label: string
    sublabel?: string
    isSelected: boolean
    onClick?: () => void
    disabled?: boolean
}

export function SelectionCard({
    label,
    sublabel,
    isSelected,
    onClick,
    disabled = false,
}: SelectionCardProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        group relative flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-all duration-200
        ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        ${isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-sm dark:border-amber-400 dark:bg-amber-950/30'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm dark:border-stone-700 dark:bg-stone-800/50 dark:hover:border-stone-600'
                }
      `}
        >
            {/* Selection indicator */}
            <span
                className={`
          absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200
          ${isSelected
                        ? 'border-amber-500 bg-amber-500 dark:border-amber-400 dark:bg-amber-400'
                        : 'border-stone-300 bg-transparent dark:border-stone-600'
                    }
        `}
            >
                {isSelected && (
                    <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </span>

            <span
                className={`
          pr-6 text-sm font-medium transition-colors
          ${isSelected ? 'text-amber-900 dark:text-amber-100' : 'text-stone-800 dark:text-stone-200'}
        `}
            >
                {label}
            </span>

            {sublabel && (
                <span
                    className={`
            mt-0.5 text-xs transition-colors
            ${isSelected ? 'text-amber-700 dark:text-amber-300' : 'text-stone-500 dark:text-stone-400'}
          `}
                >
                    {sublabel}
                </span>
            )}
        </button>
    )
}
