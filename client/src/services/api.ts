import type {
    DesignStyle, Architect, Designer,
    RoomType, ColorWheelOption, AspectRatio, ImageQualityOption,
    FlooringType, FloorBoardWidth
} from '../features/generator/types';

const API_BASE_URL = 'http://localhost:8000/api';

export interface GlobalOptions {
    roomTypes: RoomType[];
    colorWheelOptions: ColorWheelOption[];
    aspectRatios: AspectRatio[];
    imageQualityOptions: ImageQualityOption[];
    flooringTypes: FlooringType[];
    floorBoardWidths: FloorBoardWidth[];
}

export interface GenerateRequest {
    room_type_ids: string[];
    design_style_id: string;
    architect_id: string;
    designer_id: string;
    color_wheel_id: string;
    aspect_ratio_id: string;
    image_quality_id: string;
    flooring_type_id?: string;
    floor_board_width_id?: string;
}

export interface GenerationResult {
    room_type_id: string;
    result: {
        success: boolean;
        data?: string; // Image URL
        error?: string;
    }
}

export interface GenerationResponse {
    success: boolean;
    results: GenerationResult[];
}

export const api = {
    getOptions: async (): Promise<GlobalOptions> => {
        const res = await fetch(`${API_BASE_URL}/options`);
        if (!res.ok) throw new Error('Failed to fetch options');
        return res.json();
    },

    getStyles: async (): Promise<DesignStyle[]> => {
        const res = await fetch(`${API_BASE_URL}/styles`);
        if (!res.ok) throw new Error('Failed to fetch styles');
        return res.json();
    },

    getArchitects: async (styleId?: string): Promise<Architect[]> => {
        const query = styleId ? `?styleId=${encodeURIComponent(styleId)}` : '';
        const res = await fetch(`${API_BASE_URL}/architects${query}`);
        if (!res.ok) throw new Error('Failed to fetch architects');
        return res.json();
    },

    getDesigners: async (styleId?: string): Promise<Designer[]> => {
        const query = styleId ? `?styleId=${encodeURIComponent(styleId)}` : '';
        const res = await fetch(`${API_BASE_URL}/designers${query}`);
        if (!res.ok) throw new Error('Failed to fetch designers');
        return res.json();
    },

    generateImages: async (request: GenerateRequest): Promise<GenerationResponse> => {
        const res = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Generation failed');
        }
        return res.json();
    }
};
