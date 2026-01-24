import { useState } from "react";
export const useCashiering = () => {
    const [toggleCashier, setToggleCashier] = useState<boolean>(false);
    const [viewType, setViewType] = useState<"grid" | "row">("grid");

    return {
        toggleCashier,
        setToggleCashier,
        setViewType,
        viewType,
    };
};
