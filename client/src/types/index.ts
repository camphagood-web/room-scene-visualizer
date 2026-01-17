export type ColorWheel = 'light' | 'medium' | 'dark';
export type AspectRatio = '1:1' | '4:3' | '16:9';
export type ImageQuality = 'standard' | 'high';

export interface StylesResponse {
  styles: string[]
}

export interface DesignStyle {
  name: string
  architects: string[]
  designers: string[]
  regions: string
  elements: string
  palettes?: any[] 
}

export interface GenerationRequest {
  room_type: string
  design_style: string
  architect: string
  designer: string
  color_wheel: ColorWheel
  aspect_ratio: AspectRatio
  model_id?: string
}

export interface GenerationResponse {
  success: boolean
  data?: string
  error?: string
  prompt_used?: string
  model_used?: string
}
