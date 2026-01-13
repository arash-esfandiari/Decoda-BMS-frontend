import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Appointment {
    id: string;
    patient_id: string;
    status: "pending" | "confirmed" | "cancelled";
    created_date: string;
    start_time?: string;
    patient?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    service_count?: number;
    total_cost?: number;
    duration_minutes?: number;
}

export interface PaginatedAppointmentsResponse {
    data: Appointment[];
    total: number;
}

interface UseAppointmentsParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    dateFilter?: string;
}

export function useAppointments(params: UseAppointmentsParams = {}) {
    const { page = 1, limit = 100, search = "", sortBy = "start_time", sortOrder = "desc", dateFilter } = params;
    const skip = (page - 1) * limit;

    return useQuery({
        queryKey: ["appointments", page, limit, search, sortBy, sortOrder, dateFilter],
        queryFn: async () => {
            const searchParams = new URLSearchParams({
                skip: skip.toString(),
                limit: limit.toString(),
                sort_by: sortBy,
                sort_order: sortOrder,
            });

            if (search) {
                searchParams.append("search", search);
            }

            if (dateFilter) {
                searchParams.append("date_filter", dateFilter);
            }

            const { data } = await api.get<PaginatedAppointmentsResponse>(
                `/appointments/?${searchParams.toString()}`
            );
            return data;
        },
    });
}
