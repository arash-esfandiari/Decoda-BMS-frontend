import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AppointmentService {
    id: number;
    appointment_id: string;
    service_id: string;
    provider_id: string;
    start: string;
    end: string;
    service?: {
        id: string;
        name: string;
        description: string;
        price: number;
        duration: number;
    };
    provider?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    payment_status?: string;
}

export interface AppointmentDetails {
    id: string;
    patient_id: string;
    status: "pending" | "confirmed" | "cancelled";
    created_date: string;
    patient?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
    };
    services?: AppointmentService[];
    service_count?: number;
    total_cost?: number;
    duration_minutes?: number;
}

export function useAppointment(appointmentId: string) {
    return useQuery({
        queryKey: ["appointment", appointmentId],
        queryFn: async () => {
            const { data } = await api.get<AppointmentDetails>(`/appointments/${appointmentId}`);
            return data;
        },
        enabled: !!appointmentId,
    });
}
