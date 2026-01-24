import React, { useState } from "react";
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
    Printer,
    Check, // Added icon for printing context
} from "lucide-react";
import ProductModal from "@/components/organisms/ProductModal";
import Pagination from "./Pagination";
import Checkout from "../molecules/cashiering/Checkout";
import { CheckoutItem } from "@/services/types";

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
        id: "print-001",
        name: "Documents",
        price: 1.0,
        type: "service",
        stock: 9999,
        category: "Printing",
    },
    {
        id: "print-009",
        name: "Colored Documents",
        price: 5.0,
        type: "service",
        stock: 9999,
        category: "Printing",
    },
    {
        id: "print-002",
        name: "Shirt Print",
        price: 250.0, // ₱250.00
        type: "product",
        stock: 50,
        category: "Merch",
    },
    {
        id: "print-003",
        name: "Mug Print",
        price: 150.0, // ₱150.00
        type: "product",
        stock: 30,
        category: "Merch",
    },
    {
        id: "print-004",
        name: "Tarp",
        price: 25.0, // ₱25.00 per sq ft
        type: "service",
        stock: 100,
        category: "Large Format",
    },
    {
        id: "print-005",
        name: "Photo Print",
        price: 10.0, // ₱10.00
        type: "service",
        stock: 9999,
        category: "Printing",
    },
    {
        id: "print-006",
        name: "ID Card",
        price: 100.0, // ₱100.00
        type: "product",
        stock: 200,
        category: "Cards",
    },
];

const Cashiering: React.FC<Props> = ({ onBack, show }) => {
    const {
        viewType,
        setViewType,
        cartItems,
        handleAddToCart,
        handleRemoveFromCart,
    } = useCashiering();
    const [searchQuery, setSearchQuery] = useState("");
    const { selectedProduct, setSelectedProduct } = useProductModal();
    const [selectedCartItem, setSelectedCartItem] = useState<CheckoutItem>({
        id: "",
        name: "",
        quantity: 0,
        price: 0,
        totalPrice: 0,
        type: "product",
    });
    const [offset, setOffset] = useState(0);
    const limit = 3;

    const animationClasses = show
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-4 pointer-events-none";

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const totalItems = filteredItems.length;
    const paginatedItems = filteredItems.slice(offset, offset + limit);
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
                            Printing Services
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

                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewType("grid")}
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
                        {paginatedItems.map((item) =>
                            viewType === "grid" ? (
                                <button
                                    onClick={() => setSelectedProduct(item)}
                                    key={item.id}
                                    className="aspect-square bg-zinc-900 rounded-2xl border border-white/5 p-4 flex flex-col justify-end hover:border-blue-500 transition-all cursor-pointer group"
                                >
                                    <div className="mb-auto w-full flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            {/* Using generic Printer icon, or could use dynamic icons based on category */}
                                            <Printer className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold bg-white/5 px-2 py-1 rounded">
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="font-medium text-left">
                                        {item.name}
                                    </p>
                                    <p className="text-zinc-500 text-sm text-left">
                                        ₱{item.price.toFixed(2)}
                                    </p>
                                </button>
                            ) : (
                                /* ROW ITEM */
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedProduct(item)} // Make entire row clickable
                                    className="flex items-center justify-between bg-zinc-900 rounded-xl border border-white/5 px-4 py-3 hover:border-blue-500 transition cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <Printer className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                ₱{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <button className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg font-semibold">
                                        Add
                                    </button>
                                </div>
                            ),
                        )}
                    </div>
                </main>{" "}
                <div className="p-4 border-t border-white/5">
                    <Pagination
                        total={totalItems}
                        offset={offset}
                        limit={limit}
                        onPageChange={(newOffset) => setOffset(newOffset)}
                    />
                </div>
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    open={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    name={selectedProduct.name}
                    price={selectedProduct.price}
                    stock={selectedProduct.stock ?? 0}
                    onConfirm={(qty, total) => {
                        const item: CheckoutItem = {
                            id: selectedProduct.id,
                            name: selectedProduct.name,
                            quantity: qty,
                            price: selectedProduct.price,
                            totalPrice: total,
                            type: selectedProduct.type,
                        };
                        handleAddToCart(item);
                        // later → add to cashier cart store
                        setSelectedProduct(null);
                    }}
                    type={"product"}
                />
            )}

            <Checkout
                checkoutItems={cartItems}
                handleRemoveFromCart={handleRemoveFromCart}
            />
        </div>
    );
};

export default Cashiering;
