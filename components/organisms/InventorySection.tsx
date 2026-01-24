import React from "react";
import {
    Search,
    Plus,
    AlertTriangle,
    Package,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
} from "lucide-react";

const InventorySection = () => {
    return (
        <div className=" space-y-8 h-[calc(100vh-(--spacing(14)))] overflow-y-auto p-4 animate-slide-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        Inventory Tracking
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">
                        Manage stock levels and product categories
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-neon">
                    <Plus className="w-5 h-5" />
                    New Product
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface border border-white/5 p-4 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-zinc-500">
                            Total Items
                        </p>
                        <p className="text-xl font-bold">1,284</p>
                    </div>
                </div>
                <div className="bg-surface border border-white/5 p-4 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-warning/10 rounded-2xl">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-zinc-500">
                            Low Stock
                        </p>
                        <p className="text-xl font-bold">12 Items</p>
                    </div>
                </div>
                <div className="bg-surface border border-white/5 p-4 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-success/10 rounded-2xl">
                        <ArrowUpRight className="w-5 h-5 text-success" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-zinc-500">
                            Categories
                        </p>
                        <p className="text-xl font-bold">8 Groups</p>
                    </div>
                </div>
            </div>

            {/* Table Control Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface/50 p-3 rounded-3xl border border-white/5 backdrop-blur-md">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-2xl text-xs font-bold transition-all">
                        <Filter className="w-3 h-3" /> Filter
                    </button>
                </div>
            </div>

            {/* Main Inventory Table */}
            <div className="bg-surface rounded-[2rem] border border-white/5 overflow-hidden shadow-ios">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-white/5">
                            <th className="px-6 py-5">Product Details</th>
                            <th className="px-6 py-5">Category</th>
                            <th className="px-6 py-5">Stock Level</th>
                            <th className="px-6 py-5">Price</th>
                            <th className="px-6 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <InventoryRow
                            name="Premium Glossy Photo Paper"
                            sku="PRT-001"
                            category="Printing"
                            stock={45}
                            price="₱1,200.00"
                            status="In Stock"
                        />
                        <InventoryRow
                            name="Matte Vinyl Sticker (Roll)"
                            sku="STK-088"
                            category="Stickers"
                            stock={5}
                            price="₱2,450.00"
                            status="Low Stock"
                        />
                        <InventoryRow
                            name="Sublimation Ink - Cyan"
                            sku="INK-C99"
                            category="Inks"
                            stock={0}
                            price="₱450.00"
                            status="Out of Stock"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Sub-component for Rows ---
const InventoryRow = ({ name, sku, category, stock, price, status }: any) => {
    const statusColor =
        status === "In Stock"
            ? "text-success bg-success/10"
            : status === "Low Stock"
              ? "text-warning bg-warning/10"
              : "text-danger bg-danger/10";

    return (
        <tr className="group hover:bg-white/2 transition-colors">
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">
                        {sku}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-xs font-medium text-zinc-400">
                {category}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${statusColor}`}
                    >
                        {status}
                    </span>
                    <span className="text-xs text-zinc-500 font-bold">
                        {stock} units
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm font-bold text-primary">
                {price}
            </td>
            <td className="px-6 py-4 text-right">
                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
};

export default InventorySection;
