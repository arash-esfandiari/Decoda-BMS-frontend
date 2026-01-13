import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface ServiceAnalyticsItem {
    name: string;
    count: number;
    revenue: number;
    duration: number;
    revenue_per_minute: number;
}

export function useServiceAnalytics() {
    return useQuery({
        queryKey: ["service-analytics"],
        queryFn: async () => {
            const { data } = await api.get<ServiceAnalyticsItem[]>("/services/analytics");
            return data;
        },
    });
}
