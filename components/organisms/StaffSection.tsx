"use client";

import React from "react";
import {
    UserPlus,
    Shield,
    MoreHorizontal,
    UserCheck,
    UserMinus,
    ShieldCheck,
} from "lucide-react";

const staffMembers = [
    {
        id: "st-01",
        name: "Admin User",
        role: "Owner",
        status: "Active",
        email: "admin@printshop.com",
    },
    {
        id: "st-02",
        name: "Natnat Mapano",
        role: "Cashier",
        status: "Active",
        email: "sarah.c@printshop.com",
    },
    {
        id: "st-03",
        name: "Marc Caingles",
        role: "Cashier",
        status: "Offline",
        email: "kyle.r@printshop.com",
    },
];

const StaffSection = () => {
    return (
        <div className=" space-y-8 h-[calc(100vh-(--spacing(14)))] overflow-y-auto p-4 animate-slide-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        Manage Staff
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">
                        Control access levels and cashier accounts
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                    <UserPlus className="w-5 h-5" />
                    Add Staff Member
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Total Staff"
                    value="08"
                    icon={<Shield className="text-blue-500" />}
                />
                <StatCard
                    label="On Duty"
                    value="03"
                    icon={<UserCheck className="text-green-500" />}
                />
                <StatCard
                    label="Permissions"
                    value="04 Roles"
                    icon={<ShieldCheck className="text-purple-500" />}
                />
            </div>

            {/* Staff List */}
            <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
                    Staff Directory
                </h3>
                <div className="grid gap-3">
                    {staffMembers.map((member) => (
                        <div
                            key={member.id}
                            className="group p-4 bg-zinc-900/50 border border-white/5 rounded-[2rem] hover:border-white/10 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar Placeholder */}
                                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-700 flex items-center justify-center font-bold text-zinc-400 group-hover:text-white transition-colors">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white leading-none mb-1">
                                        {member.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                            {member.role}
                                        </span>
                                        <span className="text-zinc-600 text-xs">
                                            •
                                        </span>
                                        <span
                                            className={`text-[10px] font-bold uppercase ${member.status === "Active" ? "text-green-500" : "text-zinc-600"}`}
                                        >
                                            {member.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="hidden md:flex items-center gap-2 text-xs font-bold text-blue-500 hover:bg-blue-500/10 px-4 py-2 rounded-xl transition-all">
                                    Edit Permissions
                                </button>
                                <button className="p-2 text-zinc-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Sub-component for Stats
const StatCard = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) => (
    <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                {label}
            </p>
            <p className="text-2xl font-black text-white tracking-tighter">
                {value}
            </p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
    </div>
);

export default StaffSection;
