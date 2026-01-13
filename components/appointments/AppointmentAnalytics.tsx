"use client";

import { useAppointmentAnalytics } from "@/hooks/useAppointmentAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/analytics/simple-bar-chart";

export function AppointmentAnalytics({ onTodayClick, isFilteredToday }: { onTodayClick?: () => void; isFilteredToday?: boolean }) {
    const { data: analytics, isLoading, error } = useAppointmentAnalytics();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg animate-pulse">
                        <CardContent className="pt-6">
                            <div className="h-4 bg-white/30 rounded w-24 mb-2"></div>
                            <div className="h-8 bg-white/40 rounded w-16"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error || !analytics) return null;

    const StatusCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${color}`}>
            <span className="text-xs font-medium">{label}</span>
            <span className="text-sm font-bold">{value}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Appointments */}
            <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardContent className="pt-6">
                    <div className="text-sm text-slate-500 mb-1">Total Appointments</div>
                    <div className="text-3xl font-bold text-slate-900 mb-3">{analytics.total_appointments}</div>
                    <div className="flex flex-wrap gap-2">
                        <StatusCard
                            label="Confirmed"
                            value={analytics.confirmed}
                            color="bg-green-50 text-green-700 ring-1 ring-green-700/10"
                        />
                        <StatusCard
                            label="Pending"
                            value={analytics.pending}
                            color="bg-yellow-50 text-yellow-700 ring-1 ring-yellow-700/10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Busiest Days */}
            <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardContent className="pt-6 h-[180px]">
                    <div className="text-sm text-slate-500 mb-2">Busiest Days</div>
                    <div className="h-[120px] w-full">
                        <SimpleBarChart
                            data={(analytics.busiest_days || []).map(day => {
                                const total = (analytics.busiest_days || []).reduce((acc, curr) => acc + curr.value, 0);
                                return {
                                    ...day,
                                    value: total ? Math.round((day.value / total) * 100) : 0
                                };
                            })}
                            color="#f43f5e"
                            hideYAxis
                            unit="%"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card
                className={`border-white/20 bg-white/30 backdrop-blur-md shadow-lg transition-all ${onTodayClick ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : ''
                    } ${isFilteredToday ? 'ring-2 ring-blue-500 bg-blue-50/40' : ''
                    }`}
                onClick={onTodayClick}
            >
                <CardContent className="pt-6">
                    <div className="text-sm text-slate-500 mb-1">
                        Today's Appointments
                        {isFilteredToday && <span className="ml-2 text-blue-600 font-semibold">(Filtered)</span>}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-3">{analytics.today_appointments}</div>
                    <div className="flex flex-wrap gap-2">
                        <StatusCard
                            label="Confirmed"
                            value={analytics.today_confirmed}
                            color="bg-green-50 text-green-700 ring-1 ring-green-700/10"
                        />
                        <StatusCard
                            label="Pending"
                            value={analytics.today_pending}
                            color="bg-yellow-50 text-yellow-700 ring-1 ring-yellow-700/10"
                        />
                        {analytics.today_cancelled > 0 && (
                            <StatusCard
                                label="Cancelled"
                                value={analytics.today_cancelled}
                                color="bg-red-50 text-red-700 ring-1 ring-red-700/10"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Average Duration */}
            <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardContent className="pt-6">
                    <div className="text-sm text-slate-500">Avg Duration</div>
                    <div className="text-3xl font-bold text-slate-900 mt-1">
                        {analytics.avg_duration_minutes >= 60
                            ? `${Math.floor(analytics.avg_duration_minutes / 60)}h ${Math.round(analytics.avg_duration_minutes % 60)}m`
                            : `${Math.round(analytics.avg_duration_minutes)}m`
                        }
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        Per appointment
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
