"use client";

import { usePatientAnalytics } from "@/hooks/usePatientAnalytics";
import { SimplePieChart } from "@/components/analytics/simple-pie-chart";
import { SimpleBarChart } from "@/components/analytics/simple-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PatientAnalytics() {
    const { data, isLoading } = usePatientAnalytics();

    if (isLoading) {
        return <div className="animate-pulse h-64 bg-white/20 rounded-xl mb-8"></div>;
    }

    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-8">
            {/* Key Metrics */}
            <Card className="col-span-1 lg:col-span-6 border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-slate-800">{data.total_patients}</div>
                    <p className="text-xs text-slate-500 mt-1">Active records</p>
                </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-6 border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Average Age</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-slate-800">{data.average_age}</div>
                    <p className="text-xs text-slate-500 mt-1">Years old</p>
                </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card className="col-span-1 md:col-span-1 lg:col-span-4 border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Gender</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <SimplePieChart data={data.by_gender} />
                </CardContent>
            </Card>

            {/* Source Distribution */}
            <Card className="col-span-1 md:col-span-1 lg:col-span-4 border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Source</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <SimplePieChart data={data.by_source} />
                </CardContent>
            </Card>

            {/* Age Demographics */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-500">Age Demographics</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <SimpleBarChart data={data.by_decade} color="#8b5cf6" />
                </CardContent>
            </Card>
        </div>
    );
}
