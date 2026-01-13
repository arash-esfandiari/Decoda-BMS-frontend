"use client";

import { useProvider } from "@/hooks/useProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ProviderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { data: provider, isLoading, error } = useProvider(id);

    if (isLoading) {
        return <div className="p-8 text-slate-500">Loading provider details...</div>;
    }

    if (error || !provider) {
        return <div className="p-8 text-red-500">Error loading provider details.</div>;
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header / Back Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-500" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {provider.first_name} {provider.last_name}
                    </h1>
                    <p className="text-slate-500">Provider Details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info Card */}
                <Card className="glass-card shadow-lg md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-700">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Email</div>
                            <div className="text-slate-900">{provider.email}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Phone</div>
                            <div className="text-slate-900">{provider.phone}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* KPI Card: Avg Patients Per Day */}
                <Card className="glass-card shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white md:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 rounded-full bg-white/20 blur-xl"></div>
                    <CardHeader>
                        <CardTitle className="text-white">Performance Metrics</CardTitle>
                        <CardDescription className="text-indigo-100">Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            <span className="text-5xl font-bold">{provider.average_patients_per_day}</span>
                            <span className="text-indigo-100 mt-1">Average Patients Seen Per Day</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Services List */}
            <Card className="glass-card shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-slate-800">Services Provided</CardTitle>
                    <CardDescription>List of services performed by this provider</CardDescription>
                </CardHeader>
                <CardContent>
                    {provider.services && provider.services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {provider.services.map((service) => (
                                <div key={service.id} className="p-4 rounded-xl border border-slate-200 bg-white/50 hover:bg-white transition-colors">
                                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-700">${(service.price / 100).toFixed(2)}</span>
                                        <span className="text-slate-400">{service.duration} mins</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 italic">No services recorded.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
