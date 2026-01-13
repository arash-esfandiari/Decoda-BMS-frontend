"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/analytics/simple-bar-chart";
import { SimplePieChart } from "@/components/analytics/simple-pie-chart";
import { SimpleLineChart } from "@/components/analytics/simple-line-chart";
import AnalyticsLoading from "./loading";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatDate";

const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(cents / 100);
};

export default function AnalyticsPage() {
    const router = useRouter();
    const { data: stats, isLoading, error } = useAnalytics();

    if (isLoading) return <AnalyticsLoading />;
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

            {/* Charts Row 4 - Patient Insights */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Top Patients (Revenue)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-white/30 border-b border-white/20">
                                    <tr>
                                        <th className="px-6 py-3">Patient</th>
                                        <th className="px-6 py-3 text-right">Visits</th>
                                        <th className="px-6 py-3 text-right">Total Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.top_patients.map((patient) => (
                                        <tr
                                            key={patient.id}
                                            className="border-b border-white/10 hover:bg-white/50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/patient-details?id=${patient.id}&from=analytics`)}
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">{patient.name}</td>
                                            <td className="px-6 py-4 text-right text-slate-600">{patient.visit_count}</td>
                                            <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(patient.total_spent * 100)}</td>
                                        </tr>
                                    ))}
                                    {stats.top_patients.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-500">No data available</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                            Retention Opportunities
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                                Due for Visit
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-white/30 border-b border-white/20">
                                    <tr>
                                        <th className="px-6 py-3">Patient</th>
                                        <th className="px-6 py-3">Last Visit</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.retention_opportunities.map((patient) => (
                                        <tr key={patient.id} className="border-b border-white/10 hover:bg-white/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                <div>{patient.name}</div>
                                                <div className="text-xs text-slate-500">{patient.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {formatDate(patient.last_visit)}
                                                <div className="text-xs text-amber-600 font-medium">{patient.days_since_last_visit} days ago</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a
                                                    href={`tel:${patient.phone}`}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-semibold hover:underline"
                                                >
                                                    Call Now
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    {stats.retention_opportunities.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-500">No retention opportunities found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
