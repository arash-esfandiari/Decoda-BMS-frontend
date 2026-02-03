"use client";

export default function ChatError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="container mx-auto max-w-4xl py-16 text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Chat Error</h1>
            <p className="text-slate-500">{error.message || "Something went wrong."}</p>
            <button
                onClick={() => reset()}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
    );
}
