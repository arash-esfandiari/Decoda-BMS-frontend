"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { DataImportWidget } from "@/components/dashboard/data-import-widget";
import DashboardLoading from "./loading";

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useDashboard();
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", { weekday: 'long', month: 'long', day: 'numeric' }).format(today);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    if (isLoading) {
        return <DashboardLoading />;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error loading dashboard data.</div>;
    }

    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{getGreeting()}</h1>
                    <p className="text-slate-500 mt-1">Here is what's happening at Decoda Beauty Med Spa today, {formattedDate}.</p>
                </div>
            </div>

            {/* Today's Pulse - Top Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-card border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Appointments Today</div>
                        <div className="text-3xl font-bold text-slate-900">{stats?.appointments_today}</div>
                        <div className="text-xs text-slate-500 mt-1">Scheduled visits</div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-l-emerald-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Revenue Forecast</div>
                        <div className="text-3xl font-bold text-slate-900">
                            ${((stats?.revenue_forecast_today || 0) / 100).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Expected today</div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Pending Actions</div>
                        <div className="text-3xl font-bold text-slate-900">{stats?.pending_actions}</div>
                        <div className="text-xs text-slate-500 mt-1">Require confirmation</div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">New Patients</div>
                        <div className="text-3xl font-bold text-slate-900">{stats?.new_patients_today}</div>
                        <div className="text-xs text-slate-500 mt-1">Registered today</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Daily Timeline - Takes up 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Today's Schedule</CardTitle>
                            <CardDescription>Upcoming appointments tailored for you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {stats?.upcoming_appointments && stats.upcoming_appointments.length > 0 ? (
                                    stats.upcoming_appointments.map((apt: any) => (
                                        <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/20">
                                            {/* Time Column */}
                                            <div className="flex-shrink-0 w-20 text-center">
                                                <div className="text-lg font-bold text-slate-900">
                                                    {apt.start_time ? new Date(apt.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : "TBD"}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium uppercase min-w-[60px]">
                                                    {apt.status}
                                                </div>
                                            </div>

                                            {/* Line Separator (Mobile hidden) */}
                                            <div className="hidden sm:block h-10 w-px bg-slate-200"></div>

                                            {/* Details */}
                                            <div className="flex-grow">
                                                <div className="font-semibold text-slate-900 text-lg">
                                                    {apt.patient ? `${apt.patient.first_name} ${apt.patient.last_name}` : "Unknown Patient"}
                                                </div>
                                                <div className="text-sm text-slate-600 flex flex-wrap gap-2 items-center mt-1">
                                                    {apt.services && apt.services.length > 0 ? (
                                                        apt.services.map((s: any, idx: number) => (
                                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {s.service?.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400 italic">No services listed</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0 text-right">
                                                <div className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                                                    {(() => {
                                                        const provider = apt.services?.[0]?.provider;
                                                        if (provider) {
                                                            // Debugging: Check if ID exists
                                                            if (!provider.id) {
                                                                console.warn("Provider missing ID:", provider);
                                                                return <span>{provider.first_name} {provider.last_name}</span>;
                                                            }
                                                            return (
                                                                <Link href={`/providers/${provider.id}`} className="hover:underline z-50 relative">
                                                                    {provider.first_name} {provider.last_name}
                                                                </Link>
                                                            );
                                                        }
                                                        return "";
                                                    })()}
                                                </div>
                                                <div className="text-xs text-slate-500">Provider</div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex-shrink-0">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-500">
                                        No appointments scheduled for today. Enjoy the clear schedule!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side Widgets - 1/3 */}
                <div className="space-y-6">


                    <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-sm text-slate-500 uppercase tracking-wider">Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6 text-slate-500 text-sm">
                                No unread messages.
                            </div>
                        </CardContent>
                    </Card>

                    <DataImportWidget />
                </div>
            </div>
        </div>
    );
}
