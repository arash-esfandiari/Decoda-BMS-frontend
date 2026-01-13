"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface SimpleBarChartProps {
    data: { label: string; value: number }[];
    color?: string;
    hideYAxis?: boolean;
    unit?: string;
}

export function SimpleBarChart({ data, color = "#2563eb", hideYAxis = false, unit = "" }: SimpleBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis
                    dataKey="label"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                {!hideYAxis && (
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}${unit}`}
                    />
                )}
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    formatter={(value: number | undefined) => [`${value}${unit}`, ""]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
