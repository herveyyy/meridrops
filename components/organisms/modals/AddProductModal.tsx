"use client";

import React, { useState } from "react";
import { PackagePlus, X, ShoppingBag, Wrench, Hash } from "lucide-react"; // Added Hash icon
import { Button } from "@/components/atoms/Button";
import { Item } from "../Cashiering";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: Item) => void; // Updated to allow stock
}

const AddProductModal: React.FC<AddProductModalProps> = ({
    isOpen,
    onClose,
    onAdd,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "0", // New state field
        type: "product" as "product" | "service",
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            name: formData.name,
            price: parseFloat(formData.price) || 0,
            type: formData.type,
            id: crypto.randomUUID(), // Better than an empty string
            category: "product",
            ...(formData.type === "product" && {
                stock: parseInt(formData.stock) || 0,
            }),
        });
        setFormData({ name: "", price: "", stock: "0", type: "product" });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-zinc-950 w-full max-w-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Visual Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
                        <PackagePlus className="w-7 h-7 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        Add to Inventory
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">
                        List a new item on the local network.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type Selector */}
                    <div className="p-1 bg-white/5 rounded-2xl flex gap-1">
                        {(["product", "service"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() =>
                                    setFormData({ ...formData, type: t })
                                }
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                    formData.type === t
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                {t === "product" ? (
                                    <ShoppingBag size={14} />
                                ) : (
                                    <Wrench size={14} />
                                )}
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">
                            {formData.type} Name
                        </label>
                        <input
                            required
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            placeholder={
                                formData.type === "product"
                                    ? "e.g. Branded Hoodie"
                                    : "e.g. Logo Design"
                            }
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Price Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">
                                Price (₱)
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* Stocks Input - Only shows if type is product */}
                        <div
                            className={`space-y-2 transition-all duration-300 ${formData.type === "service" ? "opacity-30 pointer-events-none" : "opacity-100"}`}
                        >
                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">
                                {formData.type === "product"
                                    ? "Initial Stocks"
                                    : "N/A"}
                            </label>
                            <input
                                required={formData.type === "product"}
                                type="number"
                                disabled={formData.type === "service"}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                placeholder="0"
                                value={
                                    formData.type === "product"
                                        ? formData.stock
                                        : ""
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stock: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 py-4 bg-zinc-900 border-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/10"
                        >
                            Confirm Add
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
