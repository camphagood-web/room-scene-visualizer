import type { GeneratedImage } from '../types'

interface ImageCardProps {
    image: GeneratedImage
    aspectRatio: '1:1' | '4:3' | '16:9'
    isSelected: boolean
    onSelect?: () => void
    onView?: () => void
}

export function ImageCard({
    image,
    aspectRatio,
    isSelected,
    onSelect,
    onView,
}: ImageCardProps) {
    const aspectClasses = {
        '1:1': 'aspect-square',
        '4:3': 'aspect-[4/3]',
        '16:9': 'aspect-video',
    }

    return (
        <div className="group relative">
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

            {/* Image container */}
            <button
                onClick={onView}
                className={`block w-full overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 transition-all ring-offset-2 ring-offset-white dark:ring-offset-stone-950 ${isSelected
                        ? 'ring-2 ring-amber-500'
                        : 'hover:ring-2 hover:ring-stone-400 dark:hover:ring-stone-600'
                    }`}
            >
                <div className={`${aspectClasses[aspectRatio]} relative`}>
                    {/* Placeholder gradient simulating an interior design image */}
                    {/* Using actual image if available, else fallback */}
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

            {/* Room type label */}
            <p className="mt-2 text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
                {image.roomType.name}
            </p>
        </div>
    )
}
