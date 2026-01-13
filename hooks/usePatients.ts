import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    address: string;
    phone: string;
    email: string;
    source: string;
    created_date: string;
}


export interface PatientResponse {
    data: Patient[];
    total: number;
}

export function usePatients(
    limit: number = 100,
    skip: number = 0,
    search: string = "",
    sortBy: string = "first_name",
    sortOrder: string = "asc"
) {
    return useQuery({
        queryKey: ["patients", limit, skip, search, sortBy, sortOrder],
        queryFn: async () => {
            const params = new URLSearchParams({
                limit: limit.toString(),
                skip: skip.toString(),
                sort_by: sortBy,
                sort_order: sortOrder,
            });

            if (search) {
                params.append("search", search);
            }

            const { data } = await api.get<PatientResponse>(`/patients?${params.toString()}`);
            return data;
        },
    });
}
