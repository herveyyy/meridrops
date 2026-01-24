import { Item } from "@/components/organisms/Cashiering";
import { useState } from "react";

export const useProductModal = () => {
    const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);

    return { setSelectedProduct, selectedProduct };
};
