"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProviders } from "@/hooks/useProviders";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ProviderAnalytics } from "@/components/providers/ProviderAnalytics";

export default function ProvidersPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("first_name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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

    const { data: response, isLoading, error } = useProviders({
        page,
        limit: pageSize,
        search: debouncedSearch,
        sortBy,
        sortOrder,
    });

    const providers = response?.data || [];
    const totalProviders = response?.total || 0;
    const totalPages = Math.ceil(totalProviders / pageSize);

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

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (page > 3) pages.push('...');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    if (error) return <div className="p-8 text-red-500">Error loading providers</div>;

    return (
        <div className="container mx-auto max-w-6xl py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Providers</h1>
                    <p className="text-slate-500 mt-1">Manage specialist and staff profiles: {totalProviders} Total</p>
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
                        placeholder="Search providers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-white/20 bg-white/40 pl-10 pr-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none ring-1 ring-white/40 transition-all placeholder:text-slate-400 focus:bg-white/60 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <ProviderAnalytics />

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
                                <HeaderCell field="first_name" className="pl-6">First Name</HeaderCell>
                                <HeaderCell field="last_name">Last Name</HeaderCell>
                                <HeaderCell field="email">Email</HeaderCell>
                                <HeaderCell field="phone">Phone</HeaderCell>
                                <HeaderCell field="created_date" className="pr-6">Joined Date</HeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {providers.map((provider) => (
                                <TableRow
                                    key={provider.id}
                                    className="hover:bg-blue-50/60 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/providers/${provider.id}`)}
                                >
                                    <TableCell className="pl-6 font-medium text-slate-900">
                                        {provider.first_name}
                                    </TableCell>
                                    <TableCell className="text-slate-900">
                                        {provider.last_name}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {provider.email}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {provider.phone}
                                    </TableCell>
                                    <TableCell className="pr-6 text-slate-500">
                                        {new Date(provider.created_date).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {providers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        No providers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                        Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalProviders)} of {totalProviders} providers
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 rounded-md bg-white/50 border border-slate-300 text-slate-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <div className="flex gap-1">
                            {renderPageNumbers().map((pageNum, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                                    disabled={pageNum === '...'}
                                    className={`px-3 py-1 rounded-md transition-colors ${pageNum === page
                                        ? 'bg-blue-500 text-white'
                                        : pageNum === '...'
                                            ? 'cursor-default'
                                            : 'bg-white/50 border border-slate-300 text-slate-700 hover:bg-white/80'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded-md bg-white/50 border border-slate-300 text-slate-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
