import type { GeneratedImage, GenerationSession } from '../types'

interface ImageCardProps {
    image: GeneratedImage
    session: GenerationSession
    dateLabel: string
    isSelected: boolean
    isRegenerating?: boolean
    onSelect?: () => void
    onView?: () => void
    onDownloadSession?: () => void
    onRegenerate?: () => void
}

export function ImageCard({
    image,
    session,
    dateLabel,
    isSelected,
    isRegenerating = false,
    onSelect,
    onView,
    onDownloadSession,
    onRegenerate,
}: ImageCardProps) {
    const aspectClasses = {
        '1:1': 'aspect-square',
        '4:3': 'aspect-[4/3]',
        '16:9': 'aspect-video',
    }

    return (
        <div className="group relative flex h-full flex-col rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 shadow-sm">
            <div className="relative">
                {/* Selection checkbox */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect?.()
                    }}
                    className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-white/80 dark:bg-stone-900/80 border-stone-300 dark:border-stone-600 text-transparent hover:border-amber-400 group-hover:opacity-100 opacity-0 sm:opacity-0'
                        }`}
                    aria-label={isSelected ? 'Deselect image' : 'Select image'}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </button>

                {(onRegenerate || onDownloadSession) && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onRegenerate && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRegenerate()
                                }}
                                disabled={isRegenerating}
                                className={`w-8 h-8 rounded-md bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 transition-colors flex items-center justify-center ${isRegenerating
                                        ? 'cursor-not-allowed opacity-70'
                                        : 'hover:text-amber-600 dark:hover:text-amber-400'
                                    }`}
                                aria-label="Regenerate session"
                                title={isRegenerating ? 'Regenerating...' : 'Regenerate session'}
                                aria-busy={isRegenerating}
                            >
                                <svg
                                    className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </button>
                        )}
                        {onDownloadSession && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDownloadSession()
                                }}
                                className="w-8 h-8 rounded-md bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-center"
                                aria-label="Download session"
                                title="Download session"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Image container */}
                <button
                    onClick={onView}
                    className={`block w-full overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 transition-all ring-offset-2 ring-offset-white dark:ring-offset-stone-950 ${isSelected
                            ? 'ring-2 ring-amber-500'
                            : 'hover:ring-2 hover:ring-stone-400 dark:hover:ring-stone-600'
                        }`}
                >
                    <div className={`${aspectClasses[session.aspectRatio]} relative`}>
                        <img
                            src={image.url}
                            alt={image.roomType.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
                                View
                            </span>
                        </div>
                    </div>
                </button>
            </div>

            <div className="mt-3 flex-1">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {image.roomType.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                    {session.designStyle.name}
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 truncate">
                    {dateLabel} | {session.architect.name} | {session.designer.name}
                </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {session.colorWheel}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {session.aspectRatio}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {session.imageQuality}
                </span>
            </div>
        </div>
    )
}
