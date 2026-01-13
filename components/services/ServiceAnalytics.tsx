"use client";

import { useServiceAnalytics } from "@/hooks/useServiceAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ServiceAnalytics() {
    const { data: analytics, isLoading, error } = useServiceAnalytics();

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

    // Data for Pie Chart (Distribution)
    const distributionData = analytics.map(item => ({
        name: item.name,
        value: item.count
    }));

    // Data for Bar Chart (Revenue)
    const revenueData = analytics.map(item => ({
        name: item.name,
        revenue: item.revenue / 100 // Convert to dollars
    })).sort((a, b) => b.revenue - a.revenue);

    // Data for Profitability (Revenue per minute)
    const profitabilityData = analytics.map(item => ({
        name: item.name,
        rpm: item.revenue_per_minute / 100 // Convert to dollars
    })).sort((a, b) => b.rpm - a.rpm);

    return (
        <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Service Distribution Pie Chart */}
                <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Service Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <PieChart className="outline-none focus:outline-none" tabIndex={-1}>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    className="outline-none focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none focus:outline-none" tabIndex={-1} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any, name: any) => {
                                        if (value === undefined) return ['', name || ''];
                                        const total = distributionData.reduce((acc, item) => acc + item.value, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return [`${value} (${percentage}%)`, name || ''];
                                    }}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue per Service Bar Chart */}
                <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Revenue by Service</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" className="outline-none focus:outline-none">
                            <BarChart data={revenueData} layout="vertical" margin={{ left: 40, right: 40 }} className="outline-none focus:outline-none" tabIndex={-1}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={120}
                                    style={{ fontSize: '12px', fill: '#64748b' }}
                                />
                                <Tooltip
                                    formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, 'Revenue']}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} className="outline-none focus:outline-none" tabIndex={-1} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Profitability Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profitabilityData.slice(0, 3).map((item, idx) => (
                    <Card key={idx} className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Efficiency King</div>
                            <div className="text-sm font-medium text-slate-600 truncate">{item.name}</div>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-900">${item.rpm.toFixed(2)}</span>
                                <span className="text-xs text-slate-500">/ min</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
