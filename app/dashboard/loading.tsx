export default function DashboardLoading() {
    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-8 animate-pulse">
            {/* Header Section Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="h-10 w-48 bg-slate-200 rounded-lg mb-2"></div>
                    <div className="h-4 w-96 bg-slate-200 rounded-md"></div>
                </div>
                <div className="flex gap-3">
                    <div className="h-9 w-32 bg-slate-200 rounded-full"></div>
                </div>
            </div>

            {/* Today's Pulse - Top Row Stats Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card h-32 p-6 flex flex-col justify-center">
                        <div className="h-3 w-24 bg-slate-200 rounded mb-4"></div>
                        <div className="h-8 w-16 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Daily Timeline Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border border-white/20 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-6 h-[500px]">
                        <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 w-64 bg-slate-200 rounded mb-8"></div>
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/20 border border-white/10">
                                    <div className="w-20 flex flex-col items-center gap-2">
                                        <div className="h-6 w-12 bg-slate-200 rounded"></div>
                                        <div className="h-3 w-8 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <div className="h-6 w-48 bg-slate-200 rounded"></div>
                                        <div className="h-4 w-32 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side Widgets Skeleton */}
                <div className="space-y-6">
                    <div className="border border-white/20 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl h-48 p-6">
                        <div className="h-4 w-24 bg-slate-200 rounded mb-6"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                    </div>
                    <div className="border border-white/20 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl h-48 p-6">
                        <div className="h-4 w-24 bg-slate-200 rounded mb-6"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
