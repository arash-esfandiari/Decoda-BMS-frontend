"use client";

import { usePatient } from "@/hooks/usePatient";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";

export default function PatientDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('id') || '';
    const from = searchParams.get('from') || 'patients';
    const { data: patient, isLoading, error } = usePatient(patientId);

    if (isLoading) return <div className="p-8">Loading patient...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading patient</div>;
    if (!patient) return <div className="p-8">Patient not found</div>;

    const getStatusBadge = (status: string) => {
        const colors = {
            pending: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
            confirmed: "bg-green-50 text-green-700 ring-green-700/10",
            cancelled: "bg-red-50 text-red-700 ring-red-700/10",
        };
        return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 ring-gray-700/10";
    };

    const backButtonText = from === 'appointment' ? '← Back to Appointment Details' : '← Back to Patients';

    return (
        <div className="container mx-auto max-w-6xl py-8">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
                {backButtonText}
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {patient.first_name} {patient.last_name}
                </h1>
                <p className="text-slate-500 mt-1">Patient ID: {patient.id}</p>
            </div>

            {/* Patient Information Card */}
            <Card className="mb-6 border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="text-base font-medium text-slate-900">{patient.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="text-base font-medium text-slate-900">{patient.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Date of Birth</p>
                        <p className="text-base font-medium text-slate-900">
                            {formatDate(patient.date_of_birth)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Gender</p>
                        <p className="text-base font-medium text-slate-900 capitalize">{patient.gender}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Source</p>
                        <p className="text-base font-medium text-slate-900 capitalize">{patient.source.replace('_', ' ')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Patient Since</p>
                        <p className="text-base font-medium text-slate-900">
                            {formatDate(patient.created_date)}
                        </p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <p className="text-sm text-slate-500">Address</p>
                        <p className="text-base font-medium text-slate-900">{patient.address}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments Table */}
            <Card className="overflow-hidden border-white/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Appointment History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-white/30 hover:bg-white/30">
                                <TableHead className="pl-6">Appointment ID</TableHead>
                                <TableHead>Services</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="pr-6">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patient.appointments?.map((appointment) => (
                                <TableRow
                                    key={appointment.id}
                                    className="cursor-pointer hover:bg-blue-50/60 transition-colors"
                                    onClick={() => router.push(`/appointment-details?id=${appointment.id}&from=patient`)}
                                >
                                    <TableCell className="pl-6 font-medium text-slate-900">
                                        {appointment.id}
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
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        {formatDate(appointment.created_date)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!patient.appointments || patient.appointments.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        No appointments recorded for this patient.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
