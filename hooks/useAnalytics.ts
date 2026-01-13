import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface StatItem {
    label: string;
    value: number;
}

export interface AnalyticsSummary {
    total_revenue: number;
    total_patients: number;
    total_appointments: number;
    patients_by_source: StatItem[];
    top_services: StatItem[];
    appointments_by_status: StatItem[];
    demographics: {
        by_age: StatItem[];
        by_gender: StatItem[];
    };
    revenue_trend: { date: string; value: number }[];
    patterns: {
        busiest_days: StatItem[];
    };
    provider_performance: {
        revenue_by_provider: StatItem[];
        services_by_provider: StatItem[];
    };
    top_patients: TopPatient[];
    retention_opportunities: RetentionOpportunity[];
}

export interface TopPatient {
    id: string;
    name: string;
    total_spent: number;
    visit_count: number;
    last_visit: string;
}

export interface RetentionOpportunity {
    id: string;
    name: string;
    last_visit: string;
    days_since_last_visit: number;
    phone: string;
    email: string;
}

export function useAnalytics() {
    return useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            const { data } = await api.get<AnalyticsSummary>("/analytics/summary");
            return data;
        },
    });
}
