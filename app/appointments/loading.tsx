export default function Loading() {
    return (
        <div className="container mx-auto max-w-6xl py-8">
            <div className="mb-8 animate-pulse">
                <div className="h-9 w-48 bg-white/40 rounded-lg mb-2"></div>
                <div className="h-5 w-96 bg-white/30 rounded-lg"></div>
            </div>

            {/* Table skeleton */}
            <div className="bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-6 animate-pulse">
                <div className="space-y-3">
                    <div className="h-12 bg-white/40 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
