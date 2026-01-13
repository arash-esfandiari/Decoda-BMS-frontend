"use client";

import { useState, useEffect } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/formatDate";
import { AppointmentAnalytics } from "@/components/appointments/AppointmentAnalytics";

export default function AppointmentsPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("start_time");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [dateFilter, setDateFilter] = useState<string | undefined>(undefined);
    const pageSize = 100;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data: response, isLoading, error } = useAppointments({
        page,
        limit: pageSize,
        search: debouncedSearch,
        sortBy,
        sortOrder,
        dateFilter,
    });

    const appointments = response?.data || [];
    const totalAppointments = response?.total || 0;
    const totalPages = Math.ceil(totalAppointments / pageSize);

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return null;
        return (
            <span className="ml-1 inline-block">
                {sortOrder === "asc" ? "↑" : "↓"}
            </span>
        );
    };

    const HeaderCell = ({ field, children, className = "" }: { field: string, children: React.ReactNode, className?: string }) => (
        <TableHead
            className={`cursor-pointer select-none transition-colors hover:text-slate-700 ${className}`}
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center">
                {children}
                <SortIcon field={field} />
            </div>
        </TableHead>
    );

    const getStatusBadge = (status: string) => {
        const colors = {
            pending: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
            confirmed: "bg-green-50 text-green-700 ring-green-700/10",
            cancelled: "bg-red-50 text-red-700 ring-red-700/10",
        };
        return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 ring-gray-700/10";
    };

    // Pagination Logic
    const getPaginationRange = () => {
        if (totalPages <= 10) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const range: (number | string)[] = [];
        const showEllipsisStart = page > 4;
        const showEllipsisEnd = page < totalPages - 3;

        range.push(1);

        if (showEllipsisStart) {
            range.push("...");
        }

        let rangeStart = Math.max(2, page - 1);
        let rangeEnd = Math.min(totalPages - 1, page + 1);

        if (page < 4) {
            rangeEnd = 5;
            rangeStart = 2;
        }
        if (page > totalPages - 3) {
            rangeStart = totalPages - 4;
            rangeEnd = totalPages - 1;
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            if (i > 1 && i < totalPages) {
                range.push(i);
            }
        }

        if (showEllipsisEnd) {
            range.push("...");
        }

        range.push(totalPages);
        return range;
    };

    if (error) return <div className="p-8 text-red-500">Error loading appointments</div>;

    return (
        <div className="container mx-auto max-w-6xl py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointments</h1>
                    <p className="text-slate-500 mt-1">View and manage patient appointments: {totalAppointments} Total</p>
                </div>
                <div className="relative w-96">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by patient name or appointment ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-white/20 bg-white/40 pl-10 pr-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none ring-1 ring-white/40 transition-all placeholder:text-slate-400 focus:bg-white/60 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <AppointmentAnalytics onTodayClick={() => {
                setDateFilter(dateFilter === "today" ? undefined : "today");
                setPage(1);
            }} isFilteredToday={dateFilter === "today"} />

            <Card className="overflow-hidden border-white/20 shadow-lg relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="text-slate-500 font-medium">Loading...</div>
                    </div>
                )}
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-white/30 hover:bg-white/30">
                                <HeaderCell field="id" className="pl-6">Appointment ID</HeaderCell>
                                <HeaderCell field="patient_name">Patient</HeaderCell>
                                <TableHead>Services</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Duration</TableHead>
                                <HeaderCell field="status">Status</HeaderCell>
                                <HeaderCell field="start_time" className="pr-6">Start Time</HeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow
                                    key={appointment.id}
                                    className="cursor-pointer hover:bg-blue-50/60 transition-colors"
                                    onClick={() => router.push(`/appointment-details?id=${appointment.id}`)}
                                >
                                    <TableCell className="pl-6 font-medium text-slate-900">
                                        {appointment.id}
                                    </TableCell>
                                    <TableCell>
                                        {appointment.patient
                                            ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                            : "Unknown"}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {appointment.service_count || 0} {appointment.service_count === 1 ? 'service' : 'services'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        ${((appointment.total_cost || 0) / 100).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {appointment.duration_minutes
                                            ? appointment.duration_minutes >= 60
                                                ? `${Math.floor(appointment.duration_minutes / 60)}h ${appointment.duration_minutes % 60}m`
                                                : `${appointment.duration_minutes}m`
                                            : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        {appointment.start_time ? formatDateTime(appointment.start_time) : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {appointments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        No appointments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {
                totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 selec-none">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white/40 rounded-full shadow-sm ring-1 ring-white/60 transition-all hover:bg-white/60 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>

                        <div className="flex items-center gap-2">
                            {getPaginationRange().map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => typeof p === 'number' && setPage(p)}
                                    disabled={typeof p !== 'number'}
                                    className={`h-8 min-w-8 px-2 flex items-center justify-center rounded-full text-sm font-medium transition-all ${p === page
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : typeof p === 'number'
                                            ? "bg-white/40 text-slate-700 hover:bg-white/60 hover:text-blue-600"
                                            : "text-slate-400 cursor-default bg-transparent"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white/40 rounded-full shadow-sm ring-1 ring-white/60 transition-all hover:bg-white/60 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                )
            }
        </div>
    );
}
