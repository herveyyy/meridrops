import React from "react";

type Props = {};

const InventorySection = (props: Props) => {
    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black uppercase mb-8">
                Inventory Tracking
            </h2>
            <div className="bg-zinc-900 rounded-4xl p-8 border border-white/5">
                <p className="text-zinc-500">Inventory table goes here...</p>
            </div>
        </div>
    );
};

export default InventorySection;
