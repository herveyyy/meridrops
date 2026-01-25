import { MoreHorizontal } from "lucide-react";

interface InventoryRowProps {
    name: string;
    sku: string;
    category: string;
    stock: number;
    price: string;
    status: "In Stock" | "Low Stock" | "Out of Stock";
}
const InventoryRow: React.FC<InventoryRowProps> = ({
    name,
    sku,
    category,
    stock,
    price,
    status,
}) => {
    const statusColor =
        status === "In Stock"
            ? "text-success bg-success/10"
            : status === "Low Stock"
              ? "text-warning bg-warning/10"
              : "text-danger bg-danger/10";

    return (
        <tr className="group hover:bg-white/2 transition-colors">
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">
                        {sku}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-xs font-medium text-zinc-400">
                {category}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${statusColor}`}
                    >
                        {status}
                    </span>
                    <span className="text-xs text-zinc-500 font-bold">
                        {stock} units
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm font-bold text-primary">
                {price}
            </td>
            <td className="px-6 py-4 text-right">
                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
};
export default InventoryRow;
