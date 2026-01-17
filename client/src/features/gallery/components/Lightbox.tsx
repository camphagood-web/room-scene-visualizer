import { useEffect } from 'react'
import type { GenerationSession, GeneratedImage } from '../types'

interface LightboxProps {
    isOpen: boolean
    currentImageId: string | null
    sessions: GenerationSession[]
    onPrev?: () => void
    onNext?: () => void
    onClose?: () => void
    onRegenerate?: (sessionId: string) => void
}

export function Lightbox({
    isOpen,
    currentImageId,
    sessions,
    onPrev,
    onNext,
    onClose,
    onRegenerate,
}: LightboxProps) {
    // Find current image and its session
    let currentImage: GeneratedImage | null = null
    let currentSession: GenerationSession | null = null
    let allImages: { image: GeneratedImage; session: GenerationSession }[] = []

    sessions.forEach((session) => {
        session.images.forEach((image) => {
            allImages.push({ image, session })
            if (image.id === currentImageId) {
                currentImage = image
                currentSession = session
            }
        })
    })

    const currentIndex = allImages.findIndex((item) => item.image.id === currentImageId)
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < allImages.length - 1

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose?.()
            } else if (e.key === 'ArrowLeft' && hasPrev) {
                onPrev?.()
            } else if (e.key === 'ArrowRight' && hasNext) {
                onNext?.()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext])

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen || !currentImage || !currentSession) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 text-white">
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold truncate">
                        {currentImage.roomType.name}
                    </h2>
                    <p className="text-sm text-white/60 truncate">
                        {currentSession.designStyle.name} · {currentSession.architect.name} ·{' '}
                        {currentSession.designer.name}
                    </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={() => onRegenerate?.(currentSession!.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Image container */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-16 py-4 relative min-h-0">
                {/* Previous button */}
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className={`absolute left-2 sm:left-4 p-2 sm:p-3 rounded-full transition-all ${hasPrev
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }`}
                    aria-label="Previous image"
                >
                    <svg
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* Image */}
                <div className="max-w-full max-h-full flex items-center justify-center">
                    <div
                        className={`bg-stone-800 rounded-lg overflow-hidden shadow-2xl ${currentSession.aspectRatio === '1:1'
                                ? 'aspect-square max-w-[min(80vw,80vh)]'
                                : currentSession.aspectRatio === '4:3'
                                    ? 'aspect-[4/3] max-w-[min(80vw,calc(80vh*4/3))]'
                                    : 'aspect-video max-w-[min(90vw,calc(80vh*16/9))]'
                            } w-full`}
                    >
                        {/* Using actual image if available, else fallback */}
                        <img
                            src={currentImage.url}
                            alt={currentImage.roomType.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Next button */}
                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`absolute right-2 sm:right-4 p-2 sm:p-3 rounded-full transition-all ${hasNext
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }`}
                    aria-label="Next image"
                >
                    <svg
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>

            {/* Footer with metadata */}
            <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/60">
                    <span>
                        {currentIndex + 1} of {allImages.length}
                    </span>
                    <span className="text-white/30">·</span>
                    <span>{currentSession.colorWheel} palette</span>
                    <span className="text-white/30">·</span>
                    <span>{currentSession.aspectRatio}</span>
                    <span className="text-white/30">·</span>
                    <span>{currentSession.imageQuality} quality</span>
                </div>
            </div>
        </div>
    )
}
