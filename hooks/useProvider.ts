import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Provider } from "./useProviders";

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    created_date: string;
}

export interface ProviderDetails extends Provider {
    average_patients_per_day: number;
    services: Service[];
}

export function useProvider(id: string) {
    return useQuery({
        queryKey: ["provider", id],
        queryFn: async () => {
            const { data } = await api.get<ProviderDetails>(`/providers/${id}`);
            return data;
        },
        enabled: !!id
    });
}
