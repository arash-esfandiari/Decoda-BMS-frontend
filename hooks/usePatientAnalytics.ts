
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface StatItem {
    label: string;
    value: number;
}

export interface PatientAnalyticsResponse {
    total_patients: number;
    by_source: StatItem[];
    by_gender: StatItem[];
    average_age: number;
    by_decade: StatItem[];
}

export function usePatientAnalytics() {
    return useQuery({
        queryKey: ["patient-analytics"],
        queryFn: async () => {
            const { data } = await api.get<PatientAnalyticsResponse>("/patients/analytics");
            return data;
        },
    });
}
