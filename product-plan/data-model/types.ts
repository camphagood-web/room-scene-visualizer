export type ColorWheel = 'light' | 'medium' | 'dark'
export type AspectRatio = '1:1' | '4:3' | '16:9'
export type ImageQuality = 'standard' | 'high'

export interface ColorPalette {
  dominant: string[]
  grounding: string[]
  accent: string[]
}

export interface DesignStyle {
  id: string
  name: string
  mood: string
  undertone: string
  palette: {
    light: ColorPalette
    medium: ColorPalette
    dark: ColorPalette
  }
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

export interface GenerationRequest {
  id: string
  createdAt: string
  roomTypeIds: string[]
  designStyleId: string
  architectId: string
  designerId: string
  colorWheel: ColorWheel
  aspectRatio: AspectRatio
  imageQuality: ImageQuality
}

export interface GeneratedImage {
  id: string
  requestId: string
  roomTypeId: string
  url: string
  createdAt: string
}
