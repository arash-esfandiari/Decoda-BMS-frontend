import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export type ChatRow = Record<string, unknown>;

export interface ChatResult {
    answer: string;
    sql: string;
    rows: ChatRow[];
}

export interface ChatRequest {
    question: string;
    limit?: number;
}

export function useChat() {
    return useMutation({
        mutationFn: async (payload: ChatRequest) => {
            const { data } = await api.post<ChatResult>("/chat/ask", payload);
            return data;
        },
    });
}
