import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ProviderAnalyticsItem {
    provider_name: string;
    total_services: number;
    total_revenue: number;
    unique_patients: number;
    average_ticket: number;
}

export function useProviderAnalytics() {
    return useQuery({
        queryKey: ["provider-analytics"],
        queryFn: async () => {
            const { data } = await api.get<ProviderAnalyticsItem[]>("/providers/analytics");
            return data;
        },
    });
}
