import { useState, useMemo } from 'react'
import type { GeneratorProps } from '../types'
import { SelectionCard } from './SelectionCard'
import { ParameterSection } from './ParameterSection'
import { SelectionSummary } from './SelectionSummary'
import { ProgressBar } from './ProgressBar'

export function Generator({
    designStyles,
    architects,
    designers,
    roomTypes,
    colorWheelOptions,
    aspectRatios,
    imageQualityOptions,
    generationProgress,
    onRoomTypeToggle,
    onDesignStyleSelect,
    onArchitectSelect,
    onDesignerSelect,
    onColorWheelSelect,
    onAspectRatioSelect,
    onImageQualitySelect,
    onGenerate,
}: GeneratorProps) {
    // Local selection state for the preview
    const [selectedRoomTypeIds, setSelectedRoomTypeIds] = useState<string[]>([])
    const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)
    const [selectedArchitectId, setSelectedArchitectId] = useState<string | null>(null)
    const [selectedDesignerId, setSelectedDesignerId] = useState<string | null>(null)
    const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
    const [selectedAspectRatioId, setSelectedAspectRatioId] = useState<string | null>(null)
    const [selectedQualityId, setSelectedQualityId] = useState<string | null>(null)

    // Filter architects and designers based on selected style
    const filteredArchitects = useMemo(() => {
        if (!selectedStyleId) return []
        return architects.filter((a) => a.styleIds.includes(selectedStyleId))
    }, [architects, selectedStyleId])

    const filteredDesigners = useMemo(() => {
        if (!selectedStyleId) return []
        return designers.filter((d) => d.styleIds.includes(selectedStyleId))
    }, [designers, selectedStyleId])

    // Check if all required selections are made
    const isComplete =
        selectedRoomTypeIds.length > 0 &&
        selectedStyleId !== null &&
        selectedArchitectId !== null &&
        selectedDesignerId !== null &&
        selectedColorId !== null &&
        selectedAspectRatioId !== null &&
        selectedQualityId !== null

    // Build selection summary
    const selectionSummary = [
        {
            category: 'Rooms',
            value:
                selectedRoomTypeIds.length > 0
                    ? selectedRoomTypeIds
                        .map((id) => roomTypes.find((r) => r.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')
                    : null,
        },
        {
            category: 'Style',
            value: designStyles.find((s) => s.id === selectedStyleId)?.name ?? null,
        },
        {
            category: 'Architect',
            value: architects.find((a) => a.id === selectedArchitectId)?.name ?? null,
        },
        {
            category: 'Designer',
            value: designers.find((d) => d.id === selectedDesignerId)?.name ?? null,
        },
        {
            category: 'Color',
            value: colorWheelOptions.find((c) => c.id === selectedColorId)?.name ?? null,
        },
        {
            category: 'Ratio',
            value: aspectRatios.find((a) => a.id === selectedAspectRatioId)?.name ?? null,
        },
        {
            category: 'Quality',
            value: imageQualityOptions.find((q) => q.id === selectedQualityId)?.name ?? null,
        },
    ]

    // Handlers that update local state and call props
    const handleRoomTypeToggle = (roomTypeId: string) => {
        setSelectedRoomTypeIds((prev) =>
            prev.includes(roomTypeId) ? prev.filter((id) => id !== roomTypeId) : [...prev, roomTypeId]
        )
        onRoomTypeToggle?.(roomTypeId)
    }

    const handleStyleSelect = (styleId: string) => {
        setSelectedStyleId(styleId)
        // Clear architect and designer when style changes
        setSelectedArchitectId(null)
        setSelectedDesignerId(null)
        onDesignStyleSelect?.(styleId)
    }

    const handleArchitectSelect = (architectId: string) => {
        setSelectedArchitectId(architectId)
        onArchitectSelect?.(architectId)
    }

    const handleDesignerSelect = (designerId: string) => {
        setSelectedDesignerId(designerId)
        onDesignerSelect?.(designerId)
    }

    const handleColorSelect = (colorId: 'light' | 'medium' | 'dark') => {
        setSelectedColorId(colorId)
        onColorWheelSelect?.(colorId)
    }

    const handleAspectRatioSelect = (ratioId: '1:1' | '4:3' | '16:9') => {
        setSelectedAspectRatioId(ratioId)
        onAspectRatioSelect?.(ratioId)
    }

    const handleQualitySelect = (qualityId: '1k' | '2k' | '4k') => {
        setSelectedQualityId(qualityId)
        onImageQualitySelect?.(qualityId)
    }

    const isGenerating = generationProgress?.isGenerating ?? false

    return (
        <div className="space-y-6">
            {/* Progress bar (shown when generating) */}
            {generationProgress?.isGenerating && (
                <ProgressBar
                    segments={generationProgress.segments}
                    currentRoomType={generationProgress.currentRoomType}
                />
            )}

            {/* Selection summary with Generate button */}
            <SelectionSummary
                selections={selectionSummary}
                isComplete={isComplete}
                isGenerating={isGenerating}
                onGenerate={onGenerate}
            />

            {/* Parameter sections */}
            <div className="space-y-8">
                {/* Room Types - Multi-select */}
                <ParameterSection
                    title="Room Type"
                    description="Select one or more rooms to generate"
                >
                    {roomTypes.map((room) => (
                        <SelectionCard
                            key={room.id}
                            label={room.name}
                            isSelected={selectedRoomTypeIds.includes(room.id)}
                            onClick={() => handleRoomTypeToggle(room.id)}
                            disabled={isGenerating}
                        />
                    ))}
                </ParameterSection>

                {/* Design Styles - Single-select */}
                <ParameterSection
                    title="Design Style"
                    description="Choose a style to filter architects and designers"
                >
                    {designStyles.map((style) => (
                        <SelectionCard
                            key={style.id}
                            label={style.name}
                            sublabel={style.mood}
                            isSelected={selectedStyleId === style.id}
                            onClick={() => handleStyleSelect(style.id)}
                            disabled={isGenerating}
                        />
                    ))}
                </ParameterSection>

                {/* Architects - Filtered, Single-select */}
                <ParameterSection
                    title="Architect"
                    description={
                        selectedStyleId
                            ? `Architects for ${designStyles.find((s) => s.id === selectedStyleId)?.name}`
                            : 'Select a design style first'
                    }
                    disabled={!selectedStyleId}
                >
                    {filteredArchitects.length > 0 ? (
                        filteredArchitects.map((architect) => (
                            <SelectionCard
                                key={architect.id}
                                label={architect.name}
                                isSelected={selectedArchitectId === architect.id}
                                onClick={() => handleArchitectSelect(architect.id)}
                                disabled={isGenerating || !selectedStyleId}
                            />
                        ))
                    ) : (
                        <p className="text-sm italic text-stone-400 dark:text-stone-500">
                            {selectedStyleId ? 'No architects available for this style' : 'Select a style above'}
                        </p>
                    )}
                </ParameterSection>

                {/* Designers - Filtered, Single-select */}
                <ParameterSection
                    title="Designer"
                    description={
                        selectedStyleId
                            ? `Designers for ${designStyles.find((s) => s.id === selectedStyleId)?.name}`
                            : 'Select a design style first'
                    }
                    disabled={!selectedStyleId}
                >
                    {filteredDesigners.length > 0 ? (
                        filteredDesigners.map((designer) => (
                            <SelectionCard
                                key={designer.id}
                                label={designer.name}
                                isSelected={selectedDesignerId === designer.id}
                                onClick={() => handleDesignerSelect(designer.id)}
                                disabled={isGenerating || !selectedStyleId}
                            />
                        ))
                    ) : (
                        <p className="text-sm italic text-stone-400 dark:text-stone-500">
                            {selectedStyleId ? 'No designers available for this style' : 'Select a style above'}
                        </p>
                    )}
                </ParameterSection>

                {/* Color Wheel - Single-select */}
                <ParameterSection title="Color Wheel" description="Choose the color intensity">
                    {colorWheelOptions.map((color) => (
                        <SelectionCard
                            key={color.id}
                            label={color.name}
                            isSelected={selectedColorId === color.id}
                            onClick={() => handleColorSelect(color.id as 'light' | 'medium' | 'dark')}
                            disabled={isGenerating}
                        />
                    ))}
                </ParameterSection>

                {/* Aspect Ratio - Single-select */}
                <ParameterSection title="Aspect Ratio" description="Choose the image dimensions">
                    {aspectRatios.map((ratio) => (
                        <SelectionCard
                            key={ratio.id}
                            label={ratio.name}
                            sublabel={ratio.description}
                            isSelected={selectedAspectRatioId === ratio.id}
                            onClick={() => handleAspectRatioSelect(ratio.id as '1:1' | '4:3' | '16:9')}
                            disabled={isGenerating}
                        />
                    ))}
                </ParameterSection>

                {/* Image Quality - Single-select */}
                <ParameterSection title="Image Quality" description="Higher quality takes longer">
                    {imageQualityOptions.map((quality) => (
                        <SelectionCard
                            key={quality.id}
                            label={quality.name}
                            sublabel={quality.description}
                            isSelected={selectedQualityId === quality.id}
                            onClick={() => handleQualitySelect(quality.id as '1k' | '2k' | '4k')}
                            disabled={isGenerating}
                        />
                    ))}
                </ParameterSection>
            </div>
        </div>
    )
}
