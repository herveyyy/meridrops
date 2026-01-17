"use client";
import React, { useState } from "react";
import {
    BarChart3,
    Boxes,
    Calculator,
    Users,
    Settings,
    LayoutDashboard,
} from "lucide-react";
import ReceiverView from "@/components/organisms/ReceiverView";
import StaffSection from "@/components/organisms/StaffSection";
import InventorySection from "@/components/organisms/InventorySection";
import SalesSection from "@/components/organisms/SalesSection";

const AdminWrapper = () => {
    // We keep track of whether we are in "Terminal" mode or "Management" mode
    const [activeTab, setActiveTab] = useState<
        "cashier" | "sales" | "inventory" | "staff"
    >("cashier");

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden">
            <div className="h-14 border-b border-white/10 bg-[#050505] flex items-center justify-between px-4 z-100">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
                            <LayoutDashboard size={14} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest hidden md:block">
                            Admin Panel
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-1">
                        {[
                            {
                                id: "cashier",
                                label: "Terminal",
                                icon: <Calculator size={14} />,
                            },
                            {
                                id: "sales",
                                label: "Sales",
                                icon: <BarChart3 size={14} />,
                            },
                            {
                                id: "inventory",
                                label: "Stock",
                                icon: <Boxes size={14} />,
                            },
                            {
                                id: "staff",
                                label: "Staff",
                                icon: <Users size={14} />,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                                    activeTab === tab.id
                                        ? "bg-white/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        : "text-zinc-500 hover:text-zinc-200"
                                }`}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 2. DYNAMIC CONTENT AREA */}
            <div className="flex-1 relative">
                {/* CASHIER (always mounted) */}
                <div
                    className={`h-full w-full transition-opacity ${
                        activeTab === "cashier"
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none absolute inset-0"
                    }`}
                >
                    <ReceiverView />
                </div>

                {/* OTHER VIEWS */}
                {activeTab !== "cashier" && (
                    <div className="p-8 h-full overflow-y-auto bg-[#0a0a0a] animate-in slide-in-from-bottom-2 duration-300">
                        {activeTab === "sales" && <SalesSection />}
                        {activeTab === "inventory" && <InventorySection />}
                        {activeTab === "staff" && <StaffSection />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWrapper;
