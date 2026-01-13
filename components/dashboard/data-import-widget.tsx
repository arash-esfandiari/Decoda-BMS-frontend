"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Upload, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

type DataType = "patients" | "providers" | "services" | "appointments" | "payments" | "appointment_services";

export function DataImportWidget() {
    const [file, setFile] = useState<File | null>(null);
    const [dataType, setDataType] = useState<DataType>("patients");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus("idle");
            setMessage("");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        setStatus("idle");
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post("/admin/import_data", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-admin-key": "super-secret-admin-key-change-me", // TODO: Move to env var or auth context
                    "type": dataType
                }
            });
            setStatus("success");
            setMessage(`Successfully imported ${dataType} data.`);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            console.error("Upload failed", error);
            setStatus("error");
            setMessage(error.response?.data?.detail || "Failed to upload data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-white/20 bg-white/40 backdrop-blur-md shadow-lg relative overflow-hidden">
            {/* Disabled Overlay */}
            <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                <div className="bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Functionality Disabled
                </div>
            </div>
            <CardHeader>
                <CardTitle className="text-lg text-slate-800">Add Data</CardTitle>
                <CardDescription>Import JSON data files into the system</CardDescription>
            </CardHeader>
            <CardContent className="opacity-50 pointer-events-none filter grayscale-[0.5]">
                <div className="space-y-4">
                    {/* Data Type Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Data Type
                        </label>
                        <select
                            value={dataType}
                            onChange={(e) => setDataType(e.target.value as DataType)}
                            className="w-full rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            <option value="patients">Patients</option>
                            <option value="providers">Providers</option>
                            <option value="services">Services</option>
                            <option value="appointments">Appointments</option>
                            <option value="appointment_services">Appointment Services</option>
                            <option value="payments">Payments</option>
                        </select>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            JSON File
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            disabled={isLoading}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>

                    {/* Status Message */}
                    {status === "success" && (
                        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-2 rounded-md">
                            <Check className="h-4 w-4" />
                            {message}
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {message}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || isLoading}
                        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all shadow-md ${!file || isLoading
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Import Data
                            </>
                        )}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
