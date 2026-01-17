import type { GenerationSession } from '../types'
import { ImageCard } from './ImageCard'

interface SessionGroupProps {
  session: GenerationSession
  selectedImages: string[]
  onImageSelect?: (imageId: string) => void
  onImageView?: (imageId: string) => void
  onSessionSelect?: (sessionId: string, selected: boolean) => void
  onDownloadSession?: (sessionId: string) => void
  onRegenerate?: (sessionId: string) => void
}

export function SessionGroup({
  session,
  selectedImages,
  onImageSelect,
  onImageView,
  onSessionSelect,
  onDownloadSession,
  onRegenerate,
}: SessionGroupProps) {
  const allSelected = session.images.every((img) => selectedImages.includes(img.id))
  const someSelected = session.images.some((img) => selectedImages.includes(img.id))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })
    }
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      {/* Session header */}
      <div className="px-4 sm:px-5 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Session info */}
          <div className="flex items-start gap-3">
            {/* Select all checkbox */}
            <button
              onClick={() => onSessionSelect?.(session.id, !allSelected)}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                allSelected
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : someSelected
                    ? 'bg-amber-200 border-amber-400 text-amber-600'
                    : 'border-stone-300 dark:border-stone-600 hover:border-amber-400'
              }`}
              aria-label={allSelected ? 'Deselect all' : 'Select all'}
            >
              {(allSelected || someSelected) && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d={someSelected && !allSelected ? 'M20 12H4' : 'M5 13l4 4L19 7'}
                  />
                </svg>
              )}
            </button>

            <div className="min-w-0">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                {session.designStyle.name}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm text-stone-500 dark:text-stone-400">
                <span>{formatDate(session.createdAt)}</span>
                <span className="text-stone-300 dark:text-stone-600">·</span>
                <span>{session.architect.name}</span>
                <span className="text-stone-300 dark:text-stone-600">·</span>
                <span>{session.designer.name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
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
          </div>

          {/* Session actions */}
          <div className="flex items-center gap-2 ml-8 sm:ml-0">
            <button
              onClick={() => onRegenerate?.(session.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              title="Regenerate with same parameters"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Regenerate</span>
            </button>
            <button
              onClick={() => onDownloadSession?.(session.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
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
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image grid */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {session.images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              aspectRatio={session.aspectRatio}
              isSelected={selectedImages.includes(image.id)}
              onSelect={() => onImageSelect?.(image.id)}
              onView={() => onImageView?.(image.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
