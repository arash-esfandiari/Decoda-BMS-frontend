"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/analytics/simple-bar-chart";
import { SimplePieChart } from "@/components/analytics/simple-pie-chart";
import { SimpleLineChart } from "@/components/analytics/simple-line-chart";

const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(cents / 100);
};

export default function AnalyticsPage() {
    const { data: stats, isLoading, error } = useAnalytics();

    if (isLoading) return <div className="p-8 text-slate-500">Loading business intelligence...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading analytics data.</div>;
    if (!stats) return null;

    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h1>
                    <p className="text-slate-500 mt-1">Business performance and growth metrics</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card border-l-4 border-l-blue-500 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{formatCurrency(stats.total_revenue)}</div>
                        <p className="text-xs text-slate-500 mt-1">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-l-purple-500 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.total_patients}</div>
                        <p className="text-xs text-slate-500 mt-1">Registered profiles</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-l-emerald-500 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.total_appointments}</div>
                        <p className="text-xs text-slate-500 mt-1">All time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Top Services - Bar Chart */}
                <Card className="col-span-4 border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Top Services</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2 pt-4 h-[350px]">
                        <SimpleBarChart data={stats.top_services} />
                    </CardContent>
                </Card>

                {/* Patients by Source - Pie Chart */}
                <Card className="col-span-3 border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Patient Acquisition</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 h-[350px]">
                        <SimplePieChart data={stats.patients_by_source} />
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 - Revenue Trend */}
            <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] pt-4">
                    <SimpleLineChart data={stats.revenue_trend} />
                </CardContent>
            </Card>

            {/* Charts Row 3 - Demographics & Patterns */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Patient Age Groups</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-4">
                        <SimpleBarChart data={stats.demographics.by_age} color="#8884d8" />
                    </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Gender Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-4">
                        <SimplePieChart data={stats.demographics.by_gender} />
                    </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Busiest Days</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-4">
                        <SimpleBarChart
                            data={stats.patterns.busiest_days.map(day => {
                                const total = stats.patterns.busiest_days.reduce((acc, curr) => acc + curr.value, 0);
                                return {
                                    ...day,
                                    value: total ? Math.round((day.value / total) * 100) : 0
                                };
                            })}
                            color="#f43f5e"
                            hideYAxis
                            unit="%"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
