import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import type { GlobalOptions } from '../../../services/api';
import type {
    DesignStyle, Architect, Designer,
    RoomType, ColorWheelOption, AspectRatio, ImageQualityOption,
    FlooringType, FloorBoardWidth,
    GenerationProgress
} from '../types';

export function useGenerator() {
    const navigate = useNavigate();

    // Data State
    const [designStyles, setDesignStyles] = useState<DesignStyle[]>([]);
    const [architects, setArchitects] = useState<Architect[]>([]);
    const [designers, setDesigners] = useState<Designer[]>([]);

    const [options, setOptions] = useState<GlobalOptions>({
        roomTypes: [],
        colorWheelOptions: [],
        aspectRatios: [],
        imageQualityOptions: [],
        flooringTypes: [],
        floorBoardWidths: []
    });

    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Generation State
    const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);

    // Initial Load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [opts, styles, allArchitects, allDesigners] = await Promise.all([
                    api.getOptions(),
                    api.getStyles(),
                    api.getArchitects(),
                    api.getDesigners()
                ]);

                setOptions(opts);
                setDesignStyles(styles);
                setArchitects(allArchitects);
                setDesigners(allDesigners);
            } catch (err) {
                console.error(err);
                setError("Failed to load configuration data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Generation Handler
    const generate = useCallback(async (
        roomTypeIds: string[],
        designStyleId: string,
        architectId: string,
        designerId: string,
        colorWheelId: string,
        aspectRatioId: string,
        imageQualityId: string,
        flooringTypeId?: string,
        floorBoardWidthId?: string
    ) => {
        try {
            // Initialize Progress
            const segments = roomTypeIds.map(id => ({
                roomTypeId: id,
                roomTypeName: options.roomTypes.find(r => r.id === id)?.name || id,
                status: 'pending' as const
            }));

            // Mark first as in-progress (optimistic)
            if (segments.length > 0) {
                segments[0].status = 'in-progress';
            }

            setGenerationProgress({
                isGenerating: true,
                totalRoomTypes: roomTypeIds.length,
                completedRoomTypes: 0,
                currentRoomType: segments[0]?.roomTypeName || '',
                segments: segments
            });

            // Orchestrate Generation (Sequentially to show progress)
            // Even though backend can do batch, we do 1 by 1 for the UI effect

            for (let i = 0; i < roomTypeIds.length; i++) {
                const roomId = roomTypeIds[i];
                const roomName = segments[i].roomTypeName;

                // Update Progress: Current running
                setGenerationProgress(prev => {
                    if (!prev) return null;
                    const newSegments = [...prev.segments];
                    newSegments[i].status = 'in-progress';
                    return {
                        ...prev,
                        currentRoomType: roomName,
                        segments: newSegments
                    };
                });

                // Call API for this single room
                // We use the batch endpoint but with 1 item
                const response = await api.generateImages({
                    room_type_ids: [roomId],
                    design_style_id: designStyleId,
                    architect_id: architectId,
                    designer_id: designerId,
                    color_wheel_id: colorWheelId,
                    aspect_ratio_id: aspectRatioId,
                    image_quality_id: imageQualityId,
                    flooring_type_id: flooringTypeId,
                    floor_board_width_id: floorBoardWidthId
                });

                if (response.success) {
                    // Update Progress: Completed this one
                    setGenerationProgress(prev => {
                        if (!prev) return null;
                        const newSegments = [...prev.segments];
                        newSegments[i].status = 'completed';

                        // Check if next exists, mark pending (or let loop handle)

                        return {
                            ...prev,
                            completedRoomTypes: prev.completedRoomTypes + 1,
                            segments: newSegments
                        };
                    });
                } else {
                    // Handle error for this room?
                    // For now continue?
                    console.error(`Failed to generate ${roomName}`);
                }
            }

            // All Done
            setGenerationProgress(null);
            navigate('/gallery');

        } catch (err) {
            console.error("Generation error:", err);
            setError("Generation failed. Please try again.");
            setGenerationProgress(null);
        }
    }, [options.roomTypes, navigate]);

    return {
        designStyles,
        architects,
        designers,
        roomTypes: options.roomTypes,
        colorWheelOptions: options.colorWheelOptions,
        aspectRatios: options.aspectRatios,
        imageQualityOptions: options.imageQualityOptions,
        flooringTypes: options.flooringTypes,
        floorBoardWidths: options.floorBoardWidths,
        isLoading,
        error,
        generationProgress,
        generate
    };
}
