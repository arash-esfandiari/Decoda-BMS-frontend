import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    created_date: string;
}

export interface PaginatedServicesResponse {
    data: Service[];
    total: number;
}

interface UseServicesParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}

export function useServices(params: UseServicesParams = {}) {
    const { page = 1, limit = 100, search = "", sortBy = "name", sortOrder = "asc" } = params;
    const skip = (page - 1) * limit;

    return useQuery({
        queryKey: ["services", page, limit, search, sortBy, sortOrder],
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

            const { data } = await api.get<PaginatedServicesResponse>(
                `/services/?${searchParams.toString()}`
            );
            return data;
        },
    });
}
