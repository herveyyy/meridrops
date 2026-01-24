import React from "react";

type Props = {};

const StaffSection = (props: Props) => {
    return (
        <div className=" space-y-8 h-[calc(100vh-(--spacing(14)))] overflow-y-auto p-4">
            <h2 className="text-3xl font-black uppercase mb-8">
                Manage Cashiers
            </h2>
            <div className="space-y-4">
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex justify-between">
                    <span>Admin User</span>
                    <span className="text-blue-500">Edit Permissions</span>
                </div>
            </div>
        </div>
    );
};

export default StaffSection;
