import { useState } from "react";
export const useCashiering = () => {
    const [toggleCashier, setToggleCashier] = useState<boolean>(false);

    return {
        toggleCashier,
        setToggleCashier,
    };
};
