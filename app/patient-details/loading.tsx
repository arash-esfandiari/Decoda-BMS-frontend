export default function Loading() {
    return (
        <div className="container mx-auto max-w-6xl py-8">
            <div className="mb-6 animate-pulse">
                <div className="h-6 w-40 bg-white/30 rounded-lg"></div>
            </div>

            <div className="mb-8 animate-pulse">
                <div className="h-9 w-64 bg-white/40 rounded-lg mb-2"></div>
                <div className="h-5 w-48 bg-white/30 rounded-lg"></div>
            </div>

            {/* Info card skeleton */}
            <div className="mb-6 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-white/30 rounded"></div>
                        <div className="h-6 w-48 bg-white/40 rounded"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-white/30 rounded"></div>
                        <div className="h-6 w-32 bg-white/40 rounded"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-white/30 rounded"></div>
                        <div className="h-6 w-36 bg-white/40 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Appointments table skeleton */}
            <div className="bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-6 animate-pulse">
                <div className="space-y-3">
                    <div className="h-12 bg-white/40 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
