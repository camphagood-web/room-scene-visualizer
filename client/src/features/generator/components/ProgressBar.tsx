import type { ProgressSegment } from '../types'

interface ProgressBarProps {
    segments: ProgressSegment[]
    currentRoomType: string
}

export function ProgressBar({ segments, currentRoomType }: ProgressBarProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950/30">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
                    <span className="text-sm font-medium text-cyan-800 dark:text-cyan-200">
                        Generating: {currentRoomType}
                    </span>
                </div>
                <span className="text-xs text-cyan-600 dark:text-cyan-400">
                    {segments.filter((s) => s.status === 'completed').length} of {segments.length} complete
                </span>
            </div>

            {/* Segmented progress bar */}
            <div className="flex h-3 gap-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
                {segments.map((segment) => (
                    <div
                        key={segment.roomTypeId}
                        className={`
              relative flex-1 transition-all duration-500
              ${segment.status === 'completed'
                                ? 'bg-cyan-500 dark:bg-cyan-400'
                                : segment.status === 'in-progress'
                                    ? 'animate-pulse bg-cyan-400 dark:bg-cyan-500'
                                    : 'bg-transparent'
                            }
            `}
                        title={segment.roomTypeName}
                    >
                        {segment.status === 'in-progress' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
                        )}
                    </div>
                ))}
            </div>

            {/* Segment labels */}
            <div className="mt-2 flex gap-1">
                {segments.map((segment) => (
                    <div key={segment.roomTypeId} className="flex-1 text-center">
                        <span
                            className={`
                text-xs
                ${segment.status === 'completed'
                                    ? 'font-medium text-cyan-700 dark:text-cyan-300'
                                    : segment.status === 'in-progress'
                                        ? 'font-medium text-cyan-600 dark:text-cyan-400'
                                        : 'text-stone-400 dark:text-stone-500'
                                }
              `}
                        >
                            {segment.roomTypeName}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
