export default function Loading() {
    return (
        <div className="container mx-auto max-w-6xl py-8">
            <div className="mb-8 animate-pulse">
                <div className="h-9 w-48 bg-white/40 rounded-lg mb-2"></div>
                <div className="h-5 w-96 bg-white/30 rounded-lg"></div>
            </div>

            {/* Analytics skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-8">
                <div className="col-span-1 lg:col-span-6 h-32 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 animate-pulse"></div>
                <div className="col-span-1 lg:col-span-6 h-32 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 animate-pulse"></div>
                <div className="col-span-1 md:col-span-1 lg:col-span-4 h-80 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 animate-pulse"></div>
                <div className="col-span-1 md:col-span-1 lg:col-span-4 h-80 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 animate-pulse"></div>
                <div className="col-span-1 md:col-span-2 lg:col-span-4 h-80 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 animate-pulse"></div>
            </div>

            {/* Table skeleton */}
            <div className="bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-6 animate-pulse">
                <div className="space-y-3">
                    <div className="h-12 bg-white/40 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                    <div className="h-12 bg-white/30 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
