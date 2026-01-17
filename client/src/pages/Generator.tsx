import { useGenerator } from '../features/generator/hooks/useGenerator';
import { Generator as GeneratorComponent } from '../features/generator/components/Generator';
import { useRef } from 'react';

export default function Generator() {
    const {
        designStyles,
        architects,
        designers,
        roomTypes,
        colorWheelOptions,
        aspectRatios,
        imageQualityOptions,
        isLoading,
        error,
        generationProgress,
        generate
    } = useGenerator();

    // Refs to hold selection values since the Component handles local state
    // Actually, the Component handles local state for "Preview".
    // But when clicking Generate, it needs to pass the values up.
    // The Component "onGenerate" prop doesn't pass args?
    // Let's check Generator.tsx.
    // It says "onGenerate?: () => void".
    // It captures state inside Generator function component.
    // So the Generator component *should* probably expose its state or
    // we should lift the state up to the Page level so the `generate` function can access it.
    // Given the architecture, I should probably Lift State Up to here, 
    // OR pass the state back in the onGenerate callback.
    // The provided component didn't seem to pass args in onGenerate.
    // Let's look at `Generator.tsx` again (Step 62).
    // `const [selectedRoomTypeIds, ...] = useState...`
    // `const handle... = ... => { ... onRoomTypeToggle?.(...) }`
    // `const isComplete = ...`
    // It seems the intention was for the Parent to hold the state, OR for the Component to be uncontrolled?
    // If Uncontrolled, `onGenerate` has no data.
    // But it has `onRoomTypeToggle` etc.
    // So the Parent (this Page) MUST hold the state.
    // The provided component has local state `const [selectedRoomTypeIds...] = useState`.
    // AND it takes props `onRoomTypeToggle`, `onDesignStyleSelect`.
    // It seems it duplicates state? 
    // "Local selection state for the preview" comment suggests it.
    // If I use the component as is, I need to track the state in the Page as well 
    // by listening to the callbacks.

    // Implementation:
    // 1. Create state in Page.
    // 2. Pass handlers to Component that update Page state.
    // 3. User clicks Generate in Component -> calls onGenerate (no args) -> Page uses its state to call `generate`.

    // Page State
    // We already have `generate` function from hook.
    // We need to store selections here.
    const selections = useRef({
        roomTypeIds: [] as string[],
        designStyleId: '',
        architectId: '',
        designerId: '',
        colorWheelId: '',
        aspectRatioId: '',
        imageQualityId: ''
    });

    const handleGenerate = () => {
        const s = selections.current;
        if (!s.designStyleId || s.roomTypeIds.length === 0) return;

        generate(
            s.roomTypeIds,
            s.designStyleId,
            s.architectId,
            s.designerId,
            s.colorWheelId,
            s.aspectRatioId,
            s.imageQualityId
        );
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading options...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <GeneratorComponent
            designStyles={designStyles}
            architects={architects}
            designers={designers}
            roomTypes={roomTypes}
            colorWheelOptions={colorWheelOptions}
            aspectRatios={aspectRatios}
            imageQualityOptions={imageQualityOptions}
            generationProgress={generationProgress}

            // Wire up callbacks to store state
            onRoomTypeToggle={(id) => {
                const prev = selections.current.roomTypeIds;
                selections.current.roomTypeIds = prev.includes(id)
                    ? prev.filter(r => r !== id)
                    : [...prev, id];
            }}
            onDesignStyleSelect={(id) => selections.current.designStyleId = id}
            onArchitectSelect={(id) => selections.current.architectId = id}
            onDesignerSelect={(id) => selections.current.designerId = id}
            onColorWheelSelect={(id) => selections.current.colorWheelId = id}
            onAspectRatioSelect={(id) => selections.current.aspectRatioId = id}
            onImageQualitySelect={(id) => selections.current.imageQualityId = id}

            onGenerate={handleGenerate}
        />
    );
}
