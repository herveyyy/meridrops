import React, { useState, useEffect } from "react";
import { useCashiering } from "@/hooks/useCashiering";
import { useProductModal } from "@/hooks/useProductModal";

import {
    ChevronLeft,
    ShoppingCart,
    CreditCard,
    Search,
    X,
    LayoutGrid,
    List,
} from "lucide-react";
import ProductModal from "@/components/organisms/ProductModal";
type Props = {
    onBack: () => void;
    show: boolean;
};
export type ItemType = "product" | "service";

export interface Item {
    id: string;
    name: string;
    price: number;
    type: ItemType;
    stock?: number;
    category?: string;
    icon?: React.ReactNode;
}
const items: Item[] = [
    {
        id: "svc-001",
        name: "Phone Repair",
        price: 25,
        type: "service",
        stock: 42,
        category: "Repairs",
    },
    {
        id: "prd-001",
        name: "USB-C Cable",
        price: 5,
        type: "product",
        stock: 42,

        category: "Accessories",
    },
    {
        id: "prd-002",
        name: "Wireless Mouse",
        price: 18,
        type: "product",
        stock: 42,

        category: "Accessories",
    },
    {
        id: "svc-002",
        name: "PC Cleaning",
        price: 15,
        stock: 42,

        type: "service",
        category: "Maintenance",
    },
];

const Cashiering: React.FC<Props> = ({ onBack, show }) => {
    const { viewType, setViewType } = useCashiering();
    const [searchQuery, setSearchQuery] = useState("");
    const { selectedProduct, setSelectedProduct } = useProductModal();
    // Animation Classes
    const animationClasses = show
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-4 pointer-events-none";

    return (
        <div
            className={`fixed inset-0 z-100 flex bg-zinc-950 text-white overflow-hidden transition-all duration-300 ease-out transform ${animationClasses}`}
        >
            {/* 1. Main Screen: Items/Services (80% width) */}
            <div className="flex-1 flex flex-col border-r border-white/10">
                {/* Header with Search */}
                <header className="p-4 flex items-center justify-between border-b border-white/10 bg-black/20 gap-6">
                    <div className="flex items-center gap-4 min-w-fit">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold hidden sm:block">
                            Items & Services
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search services..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setViewType("grid");
                            }}
                            className={`p-2 rounded-lg transition ${
                                viewType === "grid"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/5 text-zinc-400 hover:text-white"
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setViewType("row")}
                            className={`p-2 rounded-lg transition ${
                                viewType === "row"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/5 text-zinc-400 hover:text-white"
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Items Grid */}
                <main className="p-6 overflow-y-auto">
                    <div
                        className={
                            viewType === "grid"
                                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                : "flex flex-col gap-2"
                        }
                    >
                        {items.map((item) =>
                            viewType === "grid" ? (
                                <button
                                    onClick={() => {
                                        if (item.type === "product") {
                                            setSelectedProduct(item);
                                        }
                                    }}
                                    key={item.id}
                                    className="aspect-square bg-zinc-900 rounded-2xl border border-white/5 p-4 flex flex-col justify-end hover:border-blue-500 transition-all cursor-pointer group"
                                >
                                    <div className="mb-auto">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-zinc-500 text-sm">
                                        ${item.price.toFixed(2)}
                                    </p>
                                </button>
                            ) : (
                                /* ROW ITEM */
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between bg-zinc-900 rounded-xl border border-white/5 px-4 py-3 hover:border-blue-500 transition cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <ShoppingCart className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (item.type === "product") {
                                                setSelectedProduct(item);
                                            }
                                        }}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg font-semibold"
                                    >
                                        Add
                                    </button>
                                </div>
                            ),
                        )}
                    </div>
                </main>
            </div>
            {selectedProduct && (
                <ProductModal
                    open={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    name={selectedProduct.name}
                    price={selectedProduct.price}
                    stock={selectedProduct.stock ?? 0}
                    onConfirm={(qty, total) => {
                        console.log("ADD TO CART:", {
                            id: selectedProduct.id,
                            qty,
                            total,
                        });

                        // later → add to cashier cart store
                        setSelectedProduct(null);
                    }}
                />
            )}

            {/* 2. Checkout Screen: (20% width) */}
            <div className="w-64 h-full bg-zinc-900/50 flex flex-col backdrop-blur-sm border-l border-white/5">
                <div className="p-4 border-b border-white/10 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                    <h2 className="font-semibold text-sm lg:text-base uppercase tracking-wider">
                        Checkout
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">
                        Current Order
                    </p>
                    <div className="text-center py-10">
                        <p className="text-xs text-zinc-600 italic">
                            Cart is empty
                        </p>
                    </div>
                </div>

                {/* Footer / Totals */}
                <div className="p-4 bg-black/40 border-t border-white/10 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-400">Subtotal</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span className="text-sm">Total</span>
                            <span className="text-blue-400 text-xl">$0.00</span>
                        </div>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]">
                        <CreditCard className="w-5 h-5" />
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cashiering;
