import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AppointmentAnalytics {
    total_appointments: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    today_appointments: number;
    today_confirmed: number;
    today_pending: number;
    today_cancelled: number;
    total_revenue: number;
    avg_duration_minutes: number;
    busiest_days: { label: string; value: number }[];
}

export function useAppointmentAnalytics() {
    return useQuery({
        queryKey: ["appointment-analytics"],
        queryFn: async () => {
            const { data } = await api.get<AppointmentAnalytics>("/appointments/analytics");
            return data;
        },
    });
}
