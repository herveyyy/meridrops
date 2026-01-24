"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    name: string;
    price: number;
    stock: number;
    variants?: { size: string; price: number }[];
    type: "product" | "service";
    onConfirm: (qty: number, total: number, variantName?: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
    open,
    onClose,
    name,
    price,
    stock,
    variants = [],
    type,
    onConfirm,
}) => {
    const [qty, setQty] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<{
        size: string;
        price: number;
    } | null>(variants.length > 0 ? variants[0] : null);
    const [manualTotal, setManualTotal] = useState(price);
    const unitPrice = selectedVariant?.price ?? price;
    useEffect(() => {
        if (open) {
            setQty(1);
            // Default to the first variant's price if available, otherwise use base price
            const initialPrice =
                variants.length > 0 ? variants[0].price : price;
            setManualTotal(initialPrice);
            setSelectedVariant(variants.length > 0 ? variants[0] : null);
        }
    }, [open, price, variants]);

    // Update manualTotal whenever a variant is clicked
    const handleVariantClick = (v: { size: string; price: number }) => {
        setSelectedVariant(v);
        setManualTotal(v.price);
    };

    if (!open) return null;

    const isService = type === "service";
    const isPrinting = name.toLowerCase().includes("printing");

    // For printing services, we use Qty * VariantPrice. For other services, we use Manual Amount.
    const finalTotal = isPrinting
        ? qty * unitPrice
        : isService
          ? manualTotal
          : qty * unitPrice;

    return (
        <div className="fixed inset-0 z-200 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="w-full max-w-sm bg-zinc-900 rounded-2xl border border-white/10 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-zinc-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-bold mb-1">{name}</h2>
                <p className="text-sm text-zinc-400 mb-6">
                    {isService
                        ? "Service • Configurable"
                        : `₱${price.toFixed(2)} • Stock: ${stock}`}
                </p>

                {/* VARIANT SELECTOR UI */}
                {variants.length > 0 && (
                    <div className="space-y-2 mb-6">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                            Select Size / Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {variants.map((v) => (
                                <button
                                    key={v.size}
                                    onClick={() => handleVariantClick(v)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                        selectedVariant?.size === v.size
                                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                                            : "bg-black/40 border-white/5 text-zinc-400 hover:border-white/20"
                                    }`}
                                >
                                    {v.size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isService ? (
                    <div className="space-y-4 mb-6">
                        {/* If it's a printing service, show quantity for pages */}
                        {isPrinting && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                                    Number of Pages
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={qty}
                                    onChange={(e) =>
                                        setQty(
                                            Math.max(1, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                                {isPrinting
                                    ? "Price Per Page (₱)"
                                    : "Enter Total Amount (₱)"}
                            </label>
                            <input
                                type="number"
                                value={manualTotal}
                                onChange={(e) =>
                                    setManualTotal(Number(e.target.value))
                                }
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xl font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                ) : (
                    /* PRODUCT UI */
                    <div className="space-y-2 mb-6">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={stock}
                            value={qty}
                            onChange={(e) =>
                                setQty(
                                    Math.max(
                                        1,
                                        Math.min(stock, Number(e.target.value)),
                                    ),
                                )
                            }
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/5">
                    <span className="text-sm text-zinc-400">Total</span>
                    <span className="text-xl font-bold text-white">
                        ₱
                        {finalTotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                        })}
                    </span>
                </div>

                <button
                    onClick={() =>
                        onConfirm(
                            isService && !isPrinting ? 1 : qty,
                            finalTotal,
                            selectedVariant?.size,
                        )
                    }
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition active:scale-95 text-white shadow-lg shadow-blue-900/40"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
