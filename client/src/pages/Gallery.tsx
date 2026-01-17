import { Gallery as GalleryFeature } from '../features/gallery/components/Gallery'
import { useGallery } from '../features/gallery/hooks/useGallery'

export default function Gallery() {
    const gallery = useGallery()

    if (gallery.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    return <GalleryFeature {...gallery} />
}
