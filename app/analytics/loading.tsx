export default function AnalyticsLoading() {
    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-8 animate-pulse">
            {/* Header Section Skeleton */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="h-10 w-32 bg-slate-200 rounded-lg mb-2"></div>
                    <div className="h-4 w-64 bg-slate-200 rounded-md"></div>
                </div>
            </div>

            {/* KPI Cards Skeletons */}
            <div className="grid gap-6 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass-card h-32 p-6 flex flex-col justify-center">
                        <div className="h-3 w-32 bg-slate-200 rounded mb-4"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 Skeletons */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Top Services Skeleton */}
                <div className="col-span-4 border border-white/20 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-6 h-[400px]">
                    <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
                    <div className="h-[300px] w-full bg-slate-200 rounded"></div>
                </div>

                {/* Patient Acquisition Skeleton */}
                <div className="col-span-3 border border-white/20 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-6 h-[400px]">
                    <div className="h-6 w-40 bg-slate-200 rounded mb-6"></div>
                    <div className="h-[300px] w-full bg-slate-200 rounded-full"></div>
                </div>
            </div>

            {/* Charts Row 2 - Revenue Trend Skeleton */}
            <div className="border border-white/20 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-6 h-[400px]">
                <div className="h-6 w-48 bg-slate-200 rounded mb-6"></div>
                <div className="h-[300px] w-full bg-slate-200 rounded"></div>
            </div>

            {/* Charts Row 3 - Demographics & Patterns Skeletons */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-white/20 bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-6 h-[350px]">
                        <div className="h-6 w-40 bg-slate-200 rounded mb-6"></div>
                        <div className="h-[250px] w-full bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
