"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = Record<string, unknown>;

type ChatResult = {
    answer: string;
    sql: string;
    rows: Row[];
};

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    result?: ChatResult;
};

const examples = [
    "Top 5 services by total revenue",
    "How many appointments are pending?",
    "Show patients acquired by source",
    "Average service price by provider",
];

const formatValue = (value: unknown) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const submitQuestion = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = {
            id: `u-${Date.now()}`,
            role: "user",
            content: trimmed,
        };

        setMessages((prev) => [...prev, userMessage]);
        setQuestion("");
        setError("");
        setIsLoading(true);

        try {
            const { data } = await api.post<ChatResult>("/chat/ask", {
                question: trimmed,
                limit: 200,
            });

            const assistantMessage: Message = {
                id: `a-${Date.now()}`,
                role: "assistant",
                content: data.answer || "Here’s the data I found.",
                result: data,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err: any) {
            setError(err?.response?.data?.detail || "Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        submitQuestion(question);
    };

    const handleCopySql = async (sql: string, id: string) => {
        try {
            await navigator.clipboard.writeText(sql);
            setCopiedId(id);
            setTimeout(() => {
                setCopiedId((current) => (current === id ? null : current));
            }, 1500);
        } catch {
            setError("Failed to copy SQL.");
        }
    };

    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ask the Data</h1>
                <p className="text-slate-500">
                    Ask questions in plain English. We’ll translate them to SQL and return results.
                </p>
            </div>

            <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Quick Prompts</CardTitle>
                    <CardDescription>Try a few examples to get started.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    {examples.map((example) => (
                        <button
                            key={example}
                            onClick={() => setQuestion(example)}
                            className="rounded-full border border-white/40 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-white"
                        >
                            {example}
                        </button>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Ask a Question</CardTitle>
                    <CardDescription>Results will appear below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <textarea
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            rows={3}
                            placeholder="e.g., Show total revenue by month"
                            className="w-full resize-none rounded-2xl border border-white/30 bg-white/60 p-4 text-sm text-slate-700 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500/30"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={!question.trim() || isLoading}
                                className={`rounded-full px-6 py-2 text-sm font-semibold text-white transition ${isLoading || !question.trim()
                                    ? "cursor-not-allowed bg-slate-300"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    }`}
                            >
                                {isLoading ? "Running..." : "Ask"}
                            </button>
                            {error && <span className="text-sm text-red-500">{error}</span>}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {messages.map((message) => (
                    <Card
                        key={message.id}
                        className={`border-white/20 bg-white/40 backdrop-blur-md shadow-lg ${message.role === "user" ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-emerald-500"
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="text-base text-slate-800">
                                {message.role === "user" ? "You" : "Assistant"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-slate-700">{message.content}</p>

                            {message.result?.sql && (
                                <div>
                                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <span>SQL</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopySql(message.result!.sql, message.id)}
                                            className="rounded-full border border-white/40 bg-white/60 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-white"
                                        >
                                            {copiedId === message.id ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                    <pre className="mt-2 rounded-xl bg-slate-900/90 p-4 text-xs text-slate-100 overflow-x-auto">
                                        {message.result.sql}
                                    </pre>
                                </div>
                            )}

                            {message.result?.rows && message.result.rows.length > 0 && (
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Results ({message.result.rows.length})
                                    </div>
                                    <div className="mt-3 rounded-xl border border-white/20 bg-white/50">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-white/40">
                                                    {Object.keys(message.result.rows[0]).map((key) => (
                                                        <TableHead key={key}>{key}</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {message.result.rows.map((row, idx) => (
                                                    <TableRow key={`${message.id}-${idx}`}>
                                                        {Object.keys(message.result!.rows[0]).map((key) => (
                                                            <TableCell key={key}>{formatValue(row[key])}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {message.result?.rows && message.result.rows.length === 0 && (
                                <div className="text-sm text-slate-500">No results returned.</div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
