import { useState, useEffect, useCallback } from 'react'
import type {
    GenerationSession,
    ActiveFilters,
    FilterOptions,
    LightboxState,
    DownloadModalState,
} from '../types'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { api, API_BASE_URL, resolveImageUrl } from '../../../services/api'

// Mock options for filters - typically these would come from the API too
const FILTER_OPTIONS: FilterOptions = {
    roomTypes: [], // Will populate from sessions or API
    designStyles: [], // Will populate from sessions or API
    dateRanges: [
        { id: 'today', name: 'Today' },
        { id: 'this-week', name: 'This Week' },
        { id: 'this-month', name: 'This Month' },
        { id: 'all-time', name: 'All Time' },
    ],
}

export function useGallery() {
    const [sessions, setSessions] = useState<GenerationSession[]>([])
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        roomTypes: [],
        designStyles: [],
        dateRange: 'all-time',
    })
    const [selectedImages, setSelectedImages] = useState<string[]>([])
    const [lightboxState, setLightboxState] = useState<LightboxState>({
        isOpen: false,
        currentImageId: null,
    })
    const [downloadModal, setDownloadModal] = useState<DownloadModalState>({
        isOpen: false,
        zipFileName: '',
        isDownloading: false,
        error: null,
    })
    const [filterOptions, setFilterOptions] = useState<FilterOptions>(FILTER_OPTIONS)
    const [isLoading, setIsLoading] = useState(true)
    const [regeneratingImageIds, setRegeneratingImageIds] = useState<string[]>([])

    const fetchSessions = useCallback(async (showLoading = false) => {
        if (showLoading) {
            setIsLoading(true)
        }

        try {
            const response = await fetch(`${API_BASE_URL}/gallery/sessions`)
            if (!response.ok) throw new Error('Failed to fetch sessions')
            const data = await response.json()
            const normalizedSessions = Array.isArray(data)
                ? data.map((session) => ({
                    ...session,
                    images: Array.isArray(session.images)
                        ? session.images.map((image) => ({
                            ...image,
                            url: resolveImageUrl(image.url),
                        }))
                        : [],
                }))
                : []
            setSessions(normalizedSessions)
        } catch (error) {
            console.error('Error fetching gallery sessions:', error)
        } finally {
            if (showLoading) {
                setIsLoading(false)
            }
        }
    }, [])

    // Fetch sessions
    useEffect(() => {
        fetchSessions(true)
    }, [fetchSessions])

    // Derive filter options from sessions (or could fetch from API)
    useEffect(() => {
        if (sessions.length === 0) return

        const roomTypesMap = new Map()
        const designStylesMap = new Map()

        sessions.forEach((session) => {
            designStylesMap.set(session.designStyle.id, session.designStyle)
            session.images.forEach((img) => {
                roomTypesMap.set(img.roomType.id, img.roomType)
            })
        })

        setFilterOptions((prev) => ({
            ...prev,
            roomTypes: Array.from(roomTypesMap.values()),
            designStyles: Array.from(designStylesMap.values()),
        }))
    }, [sessions])

    const handleFilterChange = (newFilters: ActiveFilters) => {
        setActiveFilters(newFilters)
    }

    const handleImageSelect = (imageId: string) => {
        setSelectedImages((prev) =>
            prev.includes(imageId)
                ? prev.filter((id) => id !== imageId)
                : [...prev, imageId]
        )
    }

    const handleSessionSelect = (sessionId: string, selected: boolean) => {
        const session = sessions.find((s) => s.id === sessionId)
        if (!session) return

        const sessionImageIds = session.images.map((img) => img.id)

        if (selected) {
            // Add all session images that aren't already selected
            setSelectedImages(prev => {
                const newIds = sessionImageIds.filter(id => !prev.includes(id))
                return [...prev, ...newIds]
            })
        } else {
            // Remove all session images
            setSelectedImages(prev => prev.filter(id => !sessionImageIds.includes(id)))
        }
    }

    const handleClearSelection = () => {
        setSelectedImages([])
    }

    const handleImageView = (imageId: string) => {
        setLightboxState({
            isOpen: true,
            currentImageId: imageId,
        })
    }

    const handleLightboxClose = () => {
        setLightboxState((prev) => ({ ...prev, isOpen: false }))
    }

    const handleLightboxPrev = () => {
        if (!lightboxState.currentImageId) return

        // Flatten all images
        const allImages = sessions.flatMap(s => s.images)
        const currentIndex = allImages.findIndex(img => img.id === lightboxState.currentImageId)

        if (currentIndex > 0) {
            setLightboxState(prev => ({
                ...prev,
                currentImageId: allImages[currentIndex - 1].id
            }))
        }
    }

    const handleLightboxNext = () => {
        if (!lightboxState.currentImageId) return

        const allImages = sessions.flatMap(s => s.images)
        const currentIndex = allImages.findIndex(img => img.id === lightboxState.currentImageId)

        if (currentIndex < allImages.length - 1) {
            setLightboxState(prev => ({
                ...prev,
                currentImageId: allImages[currentIndex + 1].id
            }))
        }
    }

    const handleDownloadSelected = () => {
        setDownloadModal({
            isOpen: true,
            zipFileName: '',
            isDownloading: false,
            error: null,
        })
    }

    const handleDownloadSession = (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId)
        if (session) {
            // Select all images in session implicitly for download
            // Or just download directly?
            // Flow says "Download an entire session", usually implies direct action or modal.
            // Let's use modal but pre-set context?
            // For simplicity, let's select the session images and open modal
            handleSessionSelect(sessionId, true)
            setDownloadModal({
                isOpen: true,
                zipFileName: `session-${sessionId.slice(0, 8)}`,
                isDownloading: false,
                error: null,
            })
        }
    }

    const handleDownloadCancel = () => {
        // Only allow cancel when not downloading
        if (!downloadModal.isDownloading) {
            setDownloadModal(prev => ({ ...prev, isOpen: false, error: null }))
        }
    }

    const dataUrlToBlob = (dataUrl: string): Blob => {
        const [meta, data] = dataUrl.split(',')
        const mimeMatch = meta?.match(/data:(.*?)(;base64)?$/)
        const mimeType = mimeMatch?.[1] || 'application/octet-stream'
        const isBase64 = meta?.includes(';base64')

        if (!isBase64) {
            return new Blob([decodeURIComponent(data || '')], { type: mimeType })
        }

        const byteString = atob(data || '')
        const bytes = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i += 1) {
            bytes[i] = byteString.charCodeAt(i)
        }
        return new Blob([bytes], { type: mimeType })
    }

    const getImageBlob = async (url: string): Promise<Blob> => {
        if (url.startsWith('data:')) {
            return dataUrlToBlob(url)
        }
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.blob()
    }

    const handleDownloadConfirm = async (fileName: string) => {
        // Set downloading state
        setDownloadModal(prev => ({ ...prev, isDownloading: true, error: null }))

        // Collect selected images
        const imagesToDownload: { url: string; name: string }[] = []

        sessions.forEach(session => {
            session.images.forEach(img => {
                if (selectedImages.includes(img.id)) {
                    // Ensure unique names
                    const name = `${session.designStyle.id}-${img.roomType.id}-${img.id.slice(0, 4)}.jpg`
                    imagesToDownload.push({ url: img.url, name })
                }
            })
        })

        // Guard against empty selection
        if (imagesToDownload.length === 0) {
            setDownloadModal(prev => ({ ...prev, isDownloading: false, error: 'No images selected.' }))
            return
        }

        console.log('Downloading images:', imagesToDownload.map(img => img.url))

        try {
            const zip = new JSZip()
            const folder = zip.folder(fileName)

            // Use Promise.allSettled to handle partial failures gracefully
            const results = await Promise.allSettled(
                imagesToDownload.map(async (img) => {
                    const blob = await getImageBlob(img.url)
                    folder?.file(img.name, blob)
                    return { name: img.name, success: true }
                })
            )

            // Check for failures
            const failures = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[]
            const successes = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<{ name: string; success: boolean }>[]

            if (failures.length === imagesToDownload.length) {
                // All failed - show the first error reason
                const firstError = failures[0]?.reason
                const errorMsg = firstError instanceof Error ? firstError.message : 'Unknown error'
                console.error('All downloads failed. First error:', firstError)
                throw new Error(`Download failed: ${errorMsg}`)
            }

            if (successes.length > 0) {
                // Generate and save zip with successful downloads
                const content = await zip.generateAsync({ type: 'blob' })
                saveAs(content, `${fileName}.zip`)

                // Close modal and clear selection
                setDownloadModal(prev => ({ ...prev, isOpen: false, isDownloading: false, error: null }))
                handleClearSelection()

                // Log partial failures if any
                if (failures.length > 0) {
                    console.warn(`${failures.length} image(s) failed to download`)
                }
            }
        } catch (error) {
            console.error("Download failed:", error)
            let errorMessage = 'Download failed. Please try again.'
            if (error instanceof Error) {
                // Check for common error types
                if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                    errorMessage = 'Network error: Could not connect to server. Please check your connection.'
                } else {
                    errorMessage = error.message
                }
            }
            setDownloadModal(prev => ({ ...prev, isDownloading: false, error: errorMessage }))
        }
    }

    const normalizeColorWheelId = (value: string) => value?.trim().toLowerCase()

    const normalizeImageQualityId = (value: string) => {
        const normalized = value?.trim().toLowerCase()
        if (normalized === '1k' || normalized === '2k' || normalized === '4k') {
            return normalized
        }
        return null
    }

    const handleRegenerate = async (sessionId: string, imageId: string) => {
        if (regeneratingImageIds.includes(imageId)) {
            return
        }

        const session = sessions.find((s) => s.id === sessionId)
        if (!session) return

        const image = session.images.find((img) => img.id === imageId)
        if (!image) return

        const colorWheelId = normalizeColorWheelId(session.colorWheel)
        const imageQualityId = normalizeImageQualityId(session.imageQuality)

        if (!colorWheelId || !imageQualityId) {
            console.warn('Regeneration skipped due to incompatible session data.', sessionId)
            return
        }

        setRegeneratingImageIds((prev) =>
            prev.includes(imageId) ? prev : [...prev, imageId]
        )

        try {
            await api.generateImages({
                room_type_ids: [image.roomType.id],
                design_style_id: session.designStyle.id,
                architect_id: session.architect.id,
                designer_id: session.designer.id,
                color_wheel_id: colorWheelId,
                aspect_ratio_id: session.aspectRatio,
                image_quality_id: imageQualityId,
            })
            await fetchSessions()
        } catch (error) {
            console.error('Regeneration failed', error)
        } finally {
            setRegeneratingImageIds((prev) => prev.filter((id) => id !== imageId))
        }
    }

    return {
        sessions,
        filterOptions,
        activeFilters,
        selectedImages,
        lightboxState,
        downloadModal,
        regeneratingImageIds,
        isLoading,
        onFilterChange: handleFilterChange,
        onImageSelect: handleImageSelect,
        onSessionSelect: handleSessionSelect,
        onClearSelection: handleClearSelection,
        onImageView: handleImageView,
        onLightboxPrev: handleLightboxPrev,
        onLightboxNext: handleLightboxNext,
        onLightboxClose: handleLightboxClose,
        onDownloadSelected: handleDownloadSelected,
        onDownloadSession: handleDownloadSession,
        onDownloadConfirm: handleDownloadConfirm,
        onDownloadCancel: handleDownloadCancel,
        onRegenerate: handleRegenerate,
    }
}
