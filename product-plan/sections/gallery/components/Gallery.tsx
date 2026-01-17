import { useMemo } from 'react'
import type { GalleryProps, GenerationSession } from '../types'
import { GalleryFilters } from './GalleryFilters'
import { SessionGroup } from './SessionGroup'
import { Lightbox } from './Lightbox'
import { DownloadModal } from './DownloadModal'

export function Gallery({
  sessions,
  filterOptions,
  activeFilters,
  selectedImages,
  lightboxState,
  downloadModal,
  onFilterChange,
  onImageSelect,
  onSessionSelect,
  onClearSelection,
  onImageView,
  onLightboxPrev,
  onLightboxNext,
  onLightboxClose,
  onDownloadSelected,
  onDownloadSession,
  onDownloadConfirm,
  onDownloadCancel,
  onRegenerate,
}: GalleryProps) {
  // Filter sessions based on active filters
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Filter by date range
      if (activeFilters.dateRange !== 'all-time') {
        const sessionDate = new Date(session.createdAt)
        const now = new Date()
        const diffDays = Math.floor(
          (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (activeFilters.dateRange === 'today' && diffDays > 0) return false
        if (activeFilters.dateRange === 'this-week' && diffDays > 7) return false
        if (activeFilters.dateRange === 'this-month' && diffDays > 30) return false
      }

      // Filter by design style
      if (
        activeFilters.designStyles.length > 0 &&
        !activeFilters.designStyles.includes(session.designStyle.id)
      ) {
        return false
      }

      // Filter by room type (at least one image must match)
      if (activeFilters.roomTypes.length > 0) {
        const hasMatchingRoom = session.images.some((img) =>
          activeFilters.roomTypes.includes(img.roomType.id)
        )
        if (!hasMatchingRoom) return false
      }

      return true
    })
  }, [sessions, activeFilters])

  // Filter images within sessions based on room type filter
  const sessionsWithFilteredImages = useMemo((): GenerationSession[] => {
    if (activeFilters.roomTypes.length === 0) return filteredSessions

    return filteredSessions.map((session) => ({
      ...session,
      images: session.images.filter((img) =>
        activeFilters.roomTypes.includes(img.roomType.id)
      ),
    }))
  }, [filteredSessions, activeFilters.roomTypes])

  // Count total images
  const totalImages = sessionsWithFilteredImages.reduce(
    (count, session) => count + session.images.length,
    0
  )

  // Generate default filename for download
  const defaultFileName = useMemo(() => {
    const date = new Date().toISOString().split('T')[0]
    return `room-designs-${date}`
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with selection actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Gallery
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {totalImages} {totalImages === 1 ? 'image' : 'images'} across{' '}
            {sessionsWithFilteredImages.length}{' '}
            {sessionsWithFilteredImages.length === 1 ? 'session' : 'sessions'}
          </p>
        </div>

        {/* Selection actions */}
        {selectedImages.length > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {selectedImages.length} selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={onDownloadSelected}
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
              Download
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <GalleryFilters
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
      />

      {/* Sessions */}
      {sessionsWithFilteredImages.length > 0 ? (
        <div className="space-y-6">
          {sessionsWithFilteredImages.map((session) => (
            <SessionGroup
              key={session.id}
              session={session}
              selectedImages={selectedImages}
              onImageSelect={onImageSelect}
              onImageView={onImageView}
              onSessionSelect={onSessionSelect}
              onDownloadSession={onDownloadSession}
              onRegenerate={onRegenerate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-stone-400 dark:text-stone-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
            No images found
          </h3>
          <p className="text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {sessions.length === 0
              ? 'Generate some room designs to see them here.'
              : 'Try adjusting your filters to see more results.'}
          </p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxState.isOpen}
        currentImageId={lightboxState.currentImageId}
        sessions={sessions}
        onPrev={onLightboxPrev}
        onNext={onLightboxNext}
        onClose={onLightboxClose}
        onRegenerate={onRegenerate}
      />

      {/* Download Modal */}
      <DownloadModal
        isOpen={downloadModal.isOpen}
        defaultFileName={defaultFileName}
        selectedCount={selectedImages.length}
        onConfirm={onDownloadConfirm}
        onCancel={onDownloadCancel}
      />
    </div>
  )
}
