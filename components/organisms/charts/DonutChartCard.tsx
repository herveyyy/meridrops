"use client";

import React from "react";
import { PieChart, Pie, Label } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart";

type DonutItem = {
    category: string;
    value: number;
    fill: string;
};

interface DonutChartCardProps {
    title: string;
    data: DonutItem[];
    config: ChartConfig;
    valueFormatter?: (value: number) => string;
}

export const DonutChartCard = ({
    title,
    data,
    config,
    valueFormatter = (v) => `₱${v.toLocaleString()}`,
}: DonutChartCardProps) => {
    const total = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.value, 0);
    }, [data]);

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
                {title}
            </h3>

            <ChartContainer
                config={config}
                className="mx-auto aspect-square w-full max-h-62.5"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="category"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-white text-2xl font-bold"
                                            >
                                                {/* Formats total to 'k' if large, or shows exact */}
                                                ₱
                                                {total >= 1000
                                                    ? `${(total / 1000).toFixed(1)}k`
                                                    : total}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-zinc-500 text-xs uppercase font-medium"
                                            >
                                                Total
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="space-y-3 mt-6">
                {data.map((item) => (
                    <div
                        key={item.category}
                        className="flex items-center justify-between text-xs"
                    >
                        <div className="flex items-center gap-2">
                            {/* Color indicator dot */}
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-zinc-400 capitalize">
                                {config[item.category]?.label || item.category}
                            </span>
                        </div>
                        <span className="font-mono font-bold text-white">
                            {valueFormatter(item.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
