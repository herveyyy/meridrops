"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    name: string;
    price: number;
    stock: number;
    onConfirm: (qty: number, total: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
    open,
    onClose,
    name,
    price,
    stock,
    onConfirm,
}) => {
    const [qty, setQty] = useState(1);

    useEffect(() => {
        if (open) setQty(1);
    }, [open]);

    if (!open) return null;

    const total = qty * price;

    return (
        <div className="fixed inset-0 z-200 bg-black/60 flex items-center justify-center">
            <div className="w-full max-w-sm bg-zinc-900 rounded-2xl border border-white/10 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-zinc-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-bold mb-2">{name}</h2>
                <p className="text-sm text-zinc-400 mb-4">
                    ${price.toFixed(2)} • Stock: {stock}
                </p>

                {/* Quantity */}
                <div className="space-y-2 mb-6">
                    <label className="text-xs uppercase tracking-wider text-zinc-500">
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

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-zinc-400">Total</span>
                    <span className="text-xl font-bold text-blue-400">
                        ${total.toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={() => onConfirm(qty, total)}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductModal;
