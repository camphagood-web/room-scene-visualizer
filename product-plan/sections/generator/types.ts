// =============================================================================
// Data Types
// =============================================================================

export interface DesignStyle {
  id: string
  name: string
  mood: string
  undertone: string
  designerNote: string
}

export interface Architect {
  id: string
  name: string
  styleIds: string[]
}

export interface Designer {
  id: string
  name: string
  styleIds: string[]
}

export interface RoomType {
  id: string
  name: string
}

export interface ColorWheelOption {
  id: 'light' | 'medium' | 'dark'
  name: string
}

export interface AspectRatio {
  id: '1:1' | '4:3' | '16:9'
  name: string
  description: string
}

export interface ImageQualityOption {
  id: 'standard' | 'high'
  name: string
  description: string
}

export interface ProgressSegment {
  roomTypeId: string
  roomTypeName: string
  status: 'pending' | 'in-progress' | 'completed'
}

export interface GenerationProgress {
  isGenerating: boolean
  totalRoomTypes: number
  completedRoomTypes: number
  currentRoomType: string
  segments: ProgressSegment[]
}

// =============================================================================
// Selection State
// =============================================================================

export interface GeneratorSelections {
  roomTypeIds: string[]
  designStyleId: string | null
  architectId: string | null
  designerId: string | null
  colorWheelId: 'light' | 'medium' | 'dark' | null
  aspectRatioId: '1:1' | '4:3' | '16:9' | null
  imageQualityId: 'standard' | 'high' | null
}

// =============================================================================
// Component Props
// =============================================================================

export interface GeneratorProps {
  /** All available design styles */
  designStyles: DesignStyle[]
  /** All available architects */
  architects: Architect[]
  /** All available designers */
  designers: Designer[]
  /** All available room types */
  roomTypes: RoomType[]
  /** Color wheel options (Light, Medium, Dark) */
  colorWheelOptions: ColorWheelOption[]
  /** Aspect ratio options */
  aspectRatios: AspectRatio[]
  /** Image quality options */
  imageQualityOptions: ImageQualityOption[]
  /** Current generation progress (null if not generating) */
  generationProgress: GenerationProgress | null

  /** Called when user selects/deselects a room type (multi-select) */
  onRoomTypeToggle?: (roomTypeId: string) => void
  /** Called when user selects a design style */
  onDesignStyleSelect?: (styleId: string) => void
  /** Called when user selects an architect */
  onArchitectSelect?: (architectId: string) => void
  /** Called when user selects a designer */
  onDesignerSelect?: (designerId: string) => void
  /** Called when user selects a color wheel option */
  onColorWheelSelect?: (colorId: 'light' | 'medium' | 'dark') => void
  /** Called when user selects an aspect ratio */
  onAspectRatioSelect?: (ratioId: '1:1' | '4:3' | '16:9') => void
  /** Called when user selects an image quality */
  onImageQualitySelect?: (qualityId: 'standard' | 'high') => void
  /** Called when user clicks the Generate button */
  onGenerate?: () => void
}
