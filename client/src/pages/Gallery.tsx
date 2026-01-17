export default function Gallery() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-heading font-bold text-stone-800">Gallery</h1>
            <p className="text-stone-600">
                Your generated room scenes will appear here.
            </p>
            <div className="p-12 border-2 border-dashed border-stone-300 rounded-lg text-center text-stone-400">
                No images generated yet.
            </div>
        </div>
    );
}
