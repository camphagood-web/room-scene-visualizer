interface SelectionItem {
    category: string
    value: string | null
}

interface SelectionSummaryProps {
    selections: SelectionItem[]
    isComplete: boolean
    isGenerating: boolean
    onGenerate?: () => void
}

export function SelectionSummary({
    selections,
    isComplete,
    isGenerating,
    onGenerate,
}: SelectionSummaryProps) {
    const filledSelections = selections.filter((s) => s.value !== null)

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/50">
            {/* Selection chips */}
            <div className="flex min-h-[2rem] flex-1 flex-wrap items-center gap-2">
                {filledSelections.length === 0 ? (
                    <span className="text-sm italic text-stone-400 dark:text-stone-500">
                        Select parameters to begin...
                    </span>
                ) : (
                    filledSelections.map((selection, index) => (
                        <span
                            key={selection.category}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm shadow-sm dark:bg-stone-700"
                        >
                            <span className="text-stone-500 dark:text-stone-400">{selection.category}:</span>
                            <span className="font-medium text-stone-800 dark:text-stone-200">
                                {selection.value}
                            </span>
                            {index < filledSelections.length - 1 && (
                                <span className="ml-1 text-stone-300 dark:text-stone-600">→</span>
                            )}
                        </span>
                    ))
                )}
            </div>

            {/* Generate button */}
            <button
                onClick={onGenerate}
                disabled={!isComplete || isGenerating}
                className={`
          flex shrink-0 items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200
          ${isComplete && !isGenerating
                        ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600 hover:shadow-lg active:scale-[0.98] dark:bg-amber-600 dark:hover:bg-amber-500'
                        : 'cursor-not-allowed bg-stone-200 text-stone-400 dark:bg-stone-700 dark:text-stone-500'
                    }
        `}
            >
                {isGenerating ? (
                    <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                        Generate
                    </>
                )}
            </button>
        </div>
    )
}
