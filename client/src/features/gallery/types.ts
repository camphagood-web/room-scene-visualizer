// =============================================================================
// Data Types
// =============================================================================

export interface RoomType {
    id: string
    name: string
}

export interface DesignStyle {
    id: string
    name: string
}

export interface Architect {
    id: string
    name: string
}

export interface Designer {
    id: string
    name: string
}

export interface GeneratedImage {
    id: string
    roomType: RoomType
    url: string
    selected: boolean
}

export interface GenerationSession {
    id: string
    createdAt: string
    designStyle: DesignStyle
    architect: Architect
    designer: Designer
    colorWheel: 'Light' | 'Medium' | 'Dark'
    aspectRatio: '1:1' | '4:3' | '16:9'
    imageQuality: '1K' | '2K' | '4K' | 'standard' | 'high'
    images: GeneratedImage[]
}

export interface DateRangeOption {
    id: 'today' | 'this-week' | 'this-month' | 'all-time'
    name: string
}

export interface FilterOptions {
    roomTypes: RoomType[]
    designStyles: DesignStyle[]
    dateRanges: DateRangeOption[]
}

export interface ActiveFilters {
    roomTypes: string[]
    designStyles: string[]
    dateRange: 'today' | 'this-week' | 'this-month' | 'all-time'
}

export interface LightboxState {
    isOpen: boolean
    currentImageId: string | null
}

export interface DownloadModalState {
    isOpen: boolean
    zipFileName: string
    isDownloading: boolean
    error: string | null
}

// =============================================================================
// Component Props
// =============================================================================

export interface GalleryProps {
    /** The list of generation sessions to display */
    sessions: GenerationSession[]
    /** Filter options for the gallery */
    filterOptions: FilterOptions
    /** Currently active filters */
    activeFilters: ActiveFilters
    /** IDs of currently selected images */
    selectedImages: string[]
    /** Current lightbox state */
    lightboxState: LightboxState
    /** Current download modal state */
    downloadModal: DownloadModalState
    /** IDs of images currently regenerating */
    regeneratingImageIds: string[]

    /** Called when user changes filter settings */
    onFilterChange?: (filters: ActiveFilters) => void
    /** Called when user toggles image selection */
    onImageSelect?: (imageId: string) => void
    /** Called when user selects/deselects all images in a session */
    onSessionSelect?: (sessionId: string, selected: boolean) => void
    /** Called when user clears all selections */
    onClearSelection?: () => void
    /** Called when user opens an image in fullscreen */
    onImageView?: (imageId: string) => void
    /** Called when user navigates to previous image in lightbox */
    onLightboxPrev?: () => void
    /** Called when user navigates to next image in lightbox */
    onLightboxNext?: () => void
    /** Called when user closes the lightbox */
    onLightboxClose?: () => void
    /** Called when user initiates download of selected images */
    onDownloadSelected?: () => void
    /** Called when user initiates download of an entire session */
    onDownloadSession?: (sessionId: string) => void
    /** Called when user confirms download with a filename */
    onDownloadConfirm?: (fileName: string) => void
    /** Called when user cancels the download modal */
    onDownloadCancel?: () => void
    /** Called when user wants to regenerate with same parameters */
    onRegenerate?: (sessionId: string, imageId: string) => void
}
