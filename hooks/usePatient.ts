import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface PatientDetails {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: "male" | "female" | "other";
    address: string;
    phone: string;
    email: string;
    source: string;
    created_date: string;
    appointments?: Array<{
        id: string;
        status: string;
        created_date: string;
        service_count?: number;
        total_cost?: number;
    }>;
}

export function usePatient(patientId: string) {
    return useQuery({
        queryKey: ["patient", patientId],
        queryFn: async () => {
            const { data } = await api.get<PatientDetails>(`/patients/${patientId}`);
            return data;
        },
        enabled: !!patientId,
    });
}
