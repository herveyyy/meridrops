import React from "react";

type Props = {};

const SalesSection = (props: Props) => {
    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black uppercase mb-8">
                Sales Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase font-black">
                        Today's Total
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                        ₱4,500.00
                    </p>
                </div>
                {/* Add more stats here */}
            </div>
        </div>
    );
};

export default SalesSection;
