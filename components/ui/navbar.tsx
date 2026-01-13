"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Patients", href: "/patients" },
    { name: "Appointments", href: "/appointments" },
    { name: "Services", href: "/services" },
    { name: "Providers", href: "/providers" },
    { name: "Analytics", href: "/analytics" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-6 z-50 mx-auto w-full max-w-6xl rounded-2xl border border-white/20 bg-white/20 px-6 py-4 shadow-lg backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 hover:bg-white/30">
            <div className="flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">Decoda Beauty Med Spa</span>
                </Link>

                {/* Center Links */}
                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-blue-600",
                                    isActive ? "text-blue-600" : "text-slate-600"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute inset-0 -z-10 rounded-full bg-white/40 shadow-sm ring-1 ring-white/30 backdrop-blur-md" />
                                )}
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}

                </div>

                {/* Right Buttons */}
                <div className="flex items-center gap-3">

                </div>
            </div>
        </nav>
    );
}
