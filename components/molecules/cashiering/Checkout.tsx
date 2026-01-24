import React from "react";
import { useCashiering } from "@/hooks/useCashiering";
import { CheckoutItem } from "@/services/types";
import { CreditCard, ShoppingCart, Trash2 } from "lucide-react";

interface Props {
    checkoutItems: CheckoutItem[];
    handleRemoveFromCart: (itemId: string) => void;
}

const Checkout: React.FC<Props> = ({
    checkoutItems = [],
    handleRemoveFromCart,
}) => {
    const subtotal = checkoutItems.reduce(
        (acc, item) => acc + item.totalPrice,
        0,
    );
    const total = subtotal;

    // Helper for Peso formatting
    const formatPeso = (amount: number) =>
        `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    return (
        <div className="w-64 h-full bg-zinc-900/50 flex flex-col backdrop-blur-sm border-l border-white/5">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold text-sm lg:text-base uppercase tracking-wider">
                    Checkout
                </h2>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">
                    Current Order ({checkoutItems.length})
                </p>

                {checkoutItems.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xs text-zinc-600 italic">
                            Cart is empty
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {checkoutItems.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-all"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-xs font-medium text-white truncate pr-2">
                                        {item.name}
                                    </h3>
                                    <button
                                        onClick={() =>
                                            handleRemoveFromCart(item.id)
                                        }
                                        className="text-zinc-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] text-zinc-500">
                                        {item.quantity} x{" "}
                                        {formatPeso(item.price)}
                                    </p>
                                    <p className="text-xs font-bold text-blue-400">
                                        {formatPeso(item.totalPrice)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Totals */}
            <div className="p-4 bg-black/40 border-t border-white/10 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Subtotal</span>
                        <span className="text-white font-medium">
                            {formatPeso(subtotal)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold">Total</span>
                        <span className="text-blue-400 text-xl font-black tracking-tight">
                            {formatPeso(total)}
                        </span>
                    </div>
                </div>

                <button
                    disabled={checkoutItems.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                >
                    <CreditCard className="w-5 h-5" />
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Checkout;
