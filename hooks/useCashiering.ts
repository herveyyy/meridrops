import { CheckoutItem } from "@/services/types";
import { useState } from "react";
export const useCashiering = () => {
    const [toggleCashier, setToggleCashier] = useState<boolean>(false);
    const [viewType, setViewType] = useState<"grid" | "row">("grid");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const handleAddToCart = (item: CheckoutItem) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };
    const handleRemoveFromCart = (itemId?: string) => {
        console.log("first");
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId),
        );
    };
    return {
        toggleCashier,
        setToggleCashier,
        setViewType,
        viewType,
        cartItems,
        handleRemoveFromCart,
        handleAddToCart,
    };
};
