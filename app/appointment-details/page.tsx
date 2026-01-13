"use client";

import { useAppointment } from "@/hooks/useAppointment";
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
import { formatDate, formatDateTime } from "@/lib/formatDate";

export default function AppointmentDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('id') || '';
    const from = searchParams.get('from') || 'appointments';
    const { data: appointment, isLoading, error } = useAppointment(appointmentId);

    if (isLoading) return <div className="p-8">Loading appointment...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading appointment</div>;
    if (!appointment) return <div className="p-8">Appointment not found</div>;

    const getStatusBadge = (status: string) => {
        const colors = {
            pending: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
            confirmed: "bg-green-50 text-green-700 ring-green-700/10",
            cancelled: "bg-red-50 text-red-700 ring-red-700/10",
        };
        return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 ring-gray-700/10";
    };

    const getPaymentBadge = (status: string) => {
        const colors = {
            paid: "bg-green-50 text-green-700 ring-green-700/10",
            pending: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
            failed: "bg-red-50 text-red-700 ring-red-700/10",
            unpaid: "bg-gray-50 text-gray-700 ring-gray-700/10",
        };
        return colors[status as keyof typeof colors] || "bg-gray-50 text-gray-700 ring-gray-700/10";
    };

    const backButtonText = from === 'patient' ? '← Back to Patient Details' : '← Back to Appointments';

    return (
        <div className="container mx-auto max-w-6xl py-8">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
                {backButtonText}
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointment Details</h1>
                <p className="text-slate-500 mt-1">ID: {appointment.id}</p>
            </div>

            {/* Metrics Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                    <CardContent className="pt-6">
                        <div className="text-sm text-slate-500">Total Services</div>
                        <div className="text-3xl font-bold text-slate-900 mt-1">{appointment.service_count || 0}</div>
                    </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                    <CardContent className="pt-6">
                        <div className="text-sm text-slate-500">Total Cost</div>
                        <div className="text-3xl font-bold text-slate-900 mt-1">
                            ${((appointment.total_cost || 0) / 100).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                    <CardContent className="pt-6">
                        <div className="text-sm text-slate-500">Duration</div>
                        <div className="text-3xl font-bold text-slate-900 mt-1">
                            {appointment.duration_minutes
                                ? appointment.duration_minutes >= 60
                                    ? `${Math.floor(appointment.duration_minutes / 60)}h ${appointment.duration_minutes % 60}m`
                                    : `${appointment.duration_minutes}m`
                                : 'N/A'
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Appointment Information Card */}
            <Card className="mb-6 border-white/20 bg-white/30 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Appointment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Patient</p>
                        {appointment.patient ? (
                            <div>
                                <p
                                    className="text-base font-medium text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/patient-details?id=${appointment.patient_id}&from=appointment`)}
                                >
                                    {appointment.patient.first_name} {appointment.patient.last_name}
                                </p>
                                {appointment.patient.email && (
                                    <p className="text-sm text-slate-600">{appointment.patient.email}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-base font-medium text-slate-900">Unknown</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(appointment.status)}`}>
                            {appointment.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Created Date</p>
                        <p className="text-base font-medium text-slate-900">
                            {formatDate(appointment.created_date)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Services Table */}
            <Card className="overflow-hidden border-white/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Services Provided</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-white/30 hover:bg-white/30">
                                <TableHead className="pl-6">Service</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="pr-6">Payment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointment.services?.map((appointmentService) => (
                                <TableRow key={appointmentService.id}>
                                    <TableCell className="pl-6">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {appointmentService.service?.name || "Unknown Service"}
                                            </p>
                                            {appointmentService.service?.description && (
                                                <p className="text-sm text-slate-500">
                                                    {appointmentService.service.description}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {appointmentService.provider
                                            ? `${appointmentService.provider.first_name} ${appointmentService.provider.last_name}`
                                            : "Unknown"}
                                    </TableCell>
                                    <TableCell>
                                        {formatDateTime(appointmentService.start)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDateTime(appointmentService.end)}
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        ${((appointmentService.service?.price || 0) / 100).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPaymentBadge(appointmentService.payment_status || 'unpaid')}`}>
                                            {(appointmentService.payment_status || 'unpaid').charAt(0).toUpperCase() + (appointmentService.payment_status || 'unpaid').slice(1)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!appointment.services || appointment.services.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        No services recorded for this appointment.
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
