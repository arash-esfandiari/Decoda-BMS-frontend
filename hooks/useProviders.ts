import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Provider {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_date: string;
}

export interface PaginatedProvidersResponse {
    data: Provider[];
    total: number;
}

interface UseProvidersParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}

export function useProviders(params: UseProvidersParams = {}) {
    const { page = 1, limit = 100, search = "", sortBy = "first_name", sortOrder = "asc" } = params;
    const skip = (page - 1) * limit;

    return useQuery({
        queryKey: ["providers", page, limit, search, sortBy, sortOrder],
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

            const { data } = await api.get<PaginatedProvidersResponse>(
                `/providers/?${searchParams.toString()}`
            );
            return data;
        },
    });
}
