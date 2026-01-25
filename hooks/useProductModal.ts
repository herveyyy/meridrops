import { Item } from "@/components/organisms/Cashiering";
import { useState } from "react";

export const useProductModal = () => {
    const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const handleAddProduct = (product: Item) => {
        // Logic to add product to inventory
        console.log("Product added to inventory", product);
    };
    return {
        setSelectedProduct,
        selectedProduct,
        openModal,
        setOpenModal,
        handleAddProduct,
    };
};
