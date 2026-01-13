import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface DashboardSummary {
    appointments_today: number;
    revenue_forecast_today: number;
    new_patients_today: number;
    pending_actions: number;
    upcoming_appointments: any[]; // Ideally type this properly
}

export function useDashboard() {
    return useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const { data } = await api.get<DashboardSummary>("/dashboard/summary");
            return data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });
}
