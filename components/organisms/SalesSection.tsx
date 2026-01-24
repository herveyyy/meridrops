"use client";

import React from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Pie,
    PieChart,
    XAxis,
    YAxis,
} from "recharts";
import {
    TrendingUp,
    Package,
    DollarSign,
    ShoppingCart,
    ChevronRight,
} from "lucide-react";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// --- MOCK DATA ---
const weeklyRevenue = [
    { day: "Mon", revenue: 4500, orders: 12 },
    { day: "Tue", revenue: 5200, orders: 15 },
    { day: "Wed", revenue: 3800, orders: 8 },
    { day: "Thu", revenue: 6100, orders: 18 },
    { day: "Fri", revenue: 7500, orders: 22 },
    { day: "Sat", revenue: 4200, orders: 14 },
    { day: "Sun", revenue: 2100, orders: 5 },
];

const categoryData = [
    { category: "printing", value: 12500, fill: "var(--color-printing)" },
    { category: "merch", value: 8400, fill: "var(--color-merch)" },
    { category: "services", value: 4200, fill: "var(--color-services)" },
];

// --- CHART CONFIGS ---
const revenueConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const categoryConfig = {
    value: { label: "Sales" },
    printing: { label: "Printing", color: "hsl(var(--chart-1))" },
    merch: { label: "Merch", color: "hsl(var(--chart-2))" },
    services: { label: "Services", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const SalesSection = () => {
    const totalRevenue = categoryData.reduce(
        (acc, curr) => acc + curr.value,
        0,
    );

    return (
        <div className=" space-y-8 h-[calc(100vh-(--spacing(14)))] overflow-y-auto p-4">
            {" "}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Executive Summary
                    </h2>
                    <p className="text-zinc-500 font-medium">
                        Real-time sales performance & analytics
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                        Jan 18 - Jan 24, 2026
                    </span>
                </div>
            </div>
            {/* 1. KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Revenue"
                    value="₱33,400.00"
                    trend="+12.5%"
                    icon={<DollarSign className="text-emerald-400" />}
                />
                <StatCard
                    label="Total Orders"
                    value="94"
                    trend="+8.2%"
                    icon={<ShoppingCart className="text-blue-400" />}
                />
                <StatCard
                    label="Avg. Order Value"
                    value="₱355.31"
                    trend="-2.4%"
                    icon={<Package className="text-orange-400" />}
                />
                <StatCard
                    label="Growth Rate"
                    value="18.4%"
                    trend="+4.1%"
                    icon={<TrendingUp className="text-purple-400" />}
                />
            </div>
            {/* 2. Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Revenue Trend (Area Chart) */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                            Revenue Flow
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />{" "}
                                REVENUE
                            </span>
                        </div>
                    </div>

                    <ChartContainer
                        config={revenueConfig}
                        className="h-75 w-full"
                    >
                        <AreaChart
                            data={weeklyRevenue}
                            margin={{ left: 12, right: 12 }}
                        >
                            <defs>
                                <linearGradient
                                    id="fillRevenue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-revenue)"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-revenue)"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                strokeOpacity={0.1}
                            />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `₱${v / 1000}k`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--color-revenue)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#fillRevenue)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>

                {/* Category Breakdown (Donut Chart) */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
                        By Category
                    </h3>
                    <ChartContainer
                        config={categoryConfig}
                        className="mx-auto aspect-square max-h-62.5"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={categoryData}
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
                                                        className="fill-white text-xl font-bold"
                                                    >
                                                        ₱
                                                        {(
                                                            totalRevenue / 1000
                                                        ).toFixed(1)}
                                                        k
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className="fill-zinc-500 text-[10px] uppercase font-black"
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
                    <div className="space-y-2 mt-4">
                        {categoryData.map((item) => (
                            <div
                                key={item.category}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="text-zinc-500 capitalize">
                                    {item.category}
                                </span>
                                <span className="font-bold text-white">
                                    ₱{item.value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* 3. Bottom Table / Top Items */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                        Most Popular Items
                    </h3>
                    <button className="text-xs text-blue-400 font-bold flex items-center gap-1 hover:underline">
                        View Full Inventory <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <tr>
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4 text-center">
                                    Qty Sold
                                </th>
                                <th className="px-6 py-4">Revenue</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">
                                    Custom T-Shirt Print
                                </td>
                                <td className="px-6 py-4 text-center font-medium">
                                    42
                                </td>
                                <td className="px-6 py-4 text-blue-400 font-bold">
                                    ₱10,500.00
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded uppercase">
                                        Trending
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">
                                    Standard Document Print
                                </td>
                                <td className="px-6 py-4 text-center font-medium">
                                    850
                                </td>
                                <td className="px-6 py-4 text-blue-400 font-bold">
                                    ₱4,250.00
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-zinc-500/10 text-zinc-500 text-[10px] font-black rounded uppercase">
                                        Stable
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENT ---
const StatCard = ({
    label,
    value,
    trend,
    icon,
}: {
    label: string;
    value: string;
    trend: string;
    icon: React.ReactNode;
}) => (
    <div className="bg-zinc-900 border border-white/5 p-5 rounded-3xl flex flex-col justify-between group hover:border-blue-500/50 transition-all cursor-default">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span
                className={`text-[10px] font-black px-2 py-0.5 rounded ${trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
            >
                {trend}
            </span>
        </div>
        <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                {label}
            </p>
            <p className="text-2xl font-bold text-white tracking-tight">
                {value}
            </p>
        </div>
    </div>
);

export default SalesSection;
