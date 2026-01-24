"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    name: string;
    price: number;
    stock: number;
    type: "product" | "service"; // Added type
    onConfirm: (qty: number, total: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
    open,
    onClose,
    name,
    price,
    stock,
    type,
    onConfirm,
}) => {
    const [qty, setQty] = useState(1);
    const [manualTotal, setManualTotal] = useState(price);

    useEffect(() => {
        if (open) {
            setQty(1);
            setManualTotal(price);
        }
    }, [open, price]);

    if (!open) return null;

    const isService = type === "service";
    const finalTotal = isService ? manualTotal : qty * price;

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
                        ? "Service • Always Available"
                        : `₱${price.toFixed(2)} • Stock: ${stock}`}
                </p>

                {isService ? (
                    /* SERVICE UI: Manual Total Amount */
                    <div className="space-y-2 mb-6">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                            Enter Total Amount (₱)
                        </label>
                        <input
                            type="number"
                            value={manualTotal}
                            onChange={(e) =>
                                setManualTotal(Number(e.target.value))
                            }
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xl font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-[10px] text-zinc-500 italic">
                            Set the price based on job requirements.
                        </p>
                    </div>
                ) : (
                    /* PRODUCT UI: Quantity Selector */
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
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    onClick={() => onConfirm(isService ? 1 : qty, finalTotal)}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition active:scale-95"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
