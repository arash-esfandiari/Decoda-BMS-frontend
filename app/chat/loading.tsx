export default function ChatLoading() {
    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-6">
            <div className="h-8 w-64 rounded-full bg-white/40 animate-pulse" />
            <div className="h-4 w-96 rounded-full bg-white/30 animate-pulse" />
            <div className="h-40 rounded-2xl bg-white/40 animate-pulse" />
            <div className="h-52 rounded-2xl bg-white/40 animate-pulse" />
            <div className="h-52 rounded-2xl bg-white/40 animate-pulse" />
        </div>
    );
}
