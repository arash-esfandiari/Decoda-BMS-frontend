"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { usePatients } from "@/hooks/usePatients";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PatientAnalytics } from "@/components/patients/PatientAnalytics";
import { formatDate } from "@/lib/formatDate";

export default function PatientsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const pageSize = 100;
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState("first_name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: response, isLoading, error } = usePatients(
        pageSize,
        (page - 1) * pageSize,
        debouncedSearch,
        sortBy,
        sortOrder
    );

    const patients = response?.data || [];
    const totalPatients = response?.total || 0;
    const totalPages = Math.ceil(totalPatients / pageSize);

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

        // Calculate middle range
        const start = Math.max(2, page - 2);
        const end = Math.min(totalPages - 1, page + 2);

        // Adjust so we always show constant number of items if possible?
        // Simpler: Just show start to end.

        // Refined logic to ensure we don't have gaps of 1 e.g. 1 ... 3

        let rangeStart = Math.max(2, page - 1);
        let rangeEnd = Math.min(totalPages - 1, page + 1);

        if (page < 4) {
            rangeEnd = 5; // Show 1 2 3 4 5 ... 
            rangeStart = 2;
        }
        if (page > totalPages - 3) {
            rangeStart = totalPages - 4; // Show ... 96 97 98 99 100
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

    if (error) return <div className="p-8 text-red-500">Error loading patients</div>;

    return (
        <div className="container mx-auto max-w-6xl py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patients</h1>
                    <p className="text-slate-500 mt-1">Manage and view your practice's patient records: {totalPatients} Total</p>
                </div>
                <div className="relative w-72">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-white/20 bg-white/40 pl-10 pr-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none ring-1 ring-white/40 transition-all placeholder:text-slate-400 focus:bg-white/60 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <PatientAnalytics />

            <Card className="overflow-hidden border-white/20 shadow-lg relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="text-slate-500 font-medium">Updating...</div>
                    </div>
                )}
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-white/30 hover:bg-white/30">
                                <HeaderCell field="first_name" className="pl-6">Name</HeaderCell>
                                <HeaderCell field="email">Email</HeaderCell>
                                <HeaderCell field="phone">Phone</HeaderCell>
                                <HeaderCell field="source">Source</HeaderCell>
                                <HeaderCell field="gender">Gender</HeaderCell>
                                <HeaderCell field="date_of_birth" className="pr-6">DOB</HeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.map((patient) => (
                                <TableRow
                                    key={patient.id}
                                    className="group cursor-pointer hover:bg-blue-50/60 transition-colors"
                                    onClick={() => router.push(`/patient-details?id=${patient.id}`)}
                                >
                                    <TableCell className="pl-6 font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                                {patient.first_name[0]}{patient.last_name[0]}
                                            </div>
                                            {patient.first_name} {patient.last_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{patient.email}</TableCell>
                                    <TableCell>{patient.phone}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {patient.source?.replace('_', ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="capitalize">{patient.gender}</TableCell>
                                    <TableCell className="pr-6">{formatDate(patient.date_of_birth)}</TableCell>
                                </TableRow>
                            ))}
                            {patients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        No patients found.
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
        </div >
    );
}
