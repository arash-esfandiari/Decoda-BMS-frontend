"use client";

import { useProviderAnalytics } from "@/hooks/useProviderAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export function ProviderAnalytics() {
    const { data: analytics, isLoading, error } = useProviderAnalytics();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {[1, 2].map((i) => (
                    <Card key={i} className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg h-[400px] animate-pulse" />
                ))}
            </div>
        );
    }

    if (error || !analytics) return null;

    // Convert revenue to dollars for charts
    const chartData = analytics.map(item => ({
        ...item,
        total_revenue: item.total_revenue / 100, // Convert cents to dollars
        average_ticket_dollars: item.average_ticket / 100
    }));

    // Find top performers for highlight cards
    const topEarner = [...analytics].sort((a, b) => b.total_revenue - a.total_revenue)[0];
    const clientMagnet = [...analytics].sort((a, b) => b.unique_patients - a.unique_patients)[0];
    const efficiencyPro = [...analytics].sort((a, b) => b.average_ticket - a.average_ticket)[0];

    return (
        <div className="space-y-6 mb-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                    <CardContent className="pt-6">
                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Top Earner</div>
                        <div className="text-lg font-bold text-slate-900 truncate">{topEarner?.provider_name || 'N/A'}</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">
                            ${((topEarner?.total_revenue || 0) / 100).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Total Revenue Generated</div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                    <CardContent className="pt-6">
                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Client Magnet</div>
                        <div className="text-lg font-bold text-slate-900 truncate">{clientMagnet?.provider_name || 'N/A'}</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">
                            {clientMagnet?.unique_patients || 0}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Unique Patients Seen</div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                    <CardContent className="pt-6">
                        <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Efficiency Pro</div>
                        <div className="text-lg font-bold text-slate-900 truncate">{efficiencyPro?.provider_name || 'N/A'}</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">
                            ${((efficiencyPro?.average_ticket || 0) / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Avg. Revenue per Service</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Revenue by Provider</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 20, bottom: 20 }} className="outline-none focus:outline-none" tabIndex={-1}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="provider_name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={140}
                                    style={{ fontSize: '12px', fill: '#64748b' }}
                                />
                                <Tooltip
                                    formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, 'Revenue']}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total_revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} className="outline-none focus:outline-none" tabIndex={-1} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Service Volume Chart */}
                <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Services Performed</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart data={chartData} barCategoryGap="20%" margin={{ bottom: 30 }} className="outline-none focus:outline-none" tabIndex={-1}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="provider_name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b', dy: 10 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    interval={0}
                                />
                                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px', fill: '#64748b' }} />
                                <Tooltip
                                    formatter={(value: any) => [value, 'Services']}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total_services" fill="#8b5cf6" radius={[4, 4, 0, 0]} className="outline-none focus:outline-none" tabIndex={-1} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
