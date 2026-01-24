import React from "react";
import {
    FileText,
    FileStack,
    Printer,
    Palette,
    Scissors,
    Zap,
    Plus,
    MoreVertical,
} from "lucide-react";

// --- STRUCTURED SERVICE DATA ---
const defaultServices = [
    {
        title: "B&W Document Printing",
        category: "Standard Print",
        icon: <FileText className="text-zinc-400" />,
        description: "Pure black ink only on standard 70gsm/80gsm paper.",
        variants: [
            { size: "A4", price: "₱2.00" },
            { size: "Short (Letter)", price: "₱2.00" },
            { size: "Long (Folio)", price: "₱3.00" },
        ],
    },
    {
        title: "Full Color Printing",
        category: "Premium Print",
        icon: <FileStack className="text-primary" />,
        description: "Vibrant inkjet or laser color printing for documents.",
        variants: [
            { size: "A4", price: "₱5.00" },
            { size: "Short (Letter)", price: "₱5.00" },
            { size: "Long (Folio)", price: "₱7.00" },
        ],
    },
    {
        title: "Print Only (No Paper)",
        category: "Labor Only",
        icon: <Printer className="text-success" />,
        description:
            "Customer provides the paper. Charging for ink and labor only.",
        variants: [{ size: "Standard (Any)", price: "₱1.50" }],
    },
    {
        title: "Graphic Design / Layout",
        category: "Creative",
        icon: <Palette className="text-secondary" />,
        description:
            "Custom layouting for tarps, business cards, or invitations.",
        variants: [{ size: "Basic Layout", price: "₱150.00" }],
    },
    {
        title: "Precision Die-Cutting",
        category: "Processing",
        icon: <Scissors className="text-warning" />,
        description: "Machine-cut stickers and labels (Kiss-cut or Die-cut).",
        variants: [{ size: "Per Sheet (A4)", price: "₱50.00" }],
    },
    {
        title: "Rush / Priority Fee",
        category: "Premium",
        icon: <Zap className="text-danger" />,
        description: "Priority queueing for same-day or 1-hour processing.",
        variants: [{ size: "Rush Service", price: "+20%" }],
    },
];

const ServicesSection = () => {
    return (
        <div className=" space-y-8 h-[calc(100vh-(--spacing(14)))] overflow-y-auto p-4 animate-slide-up">
            {" "}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        Service Catalog
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">
                        Detailed pricing per size and type
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-neon">
                    <Plus className="w-5 h-5" />
                    Add Type
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {defaultServices.map((service, index) => (
                    <ServiceCard key={index} {...service} />
                ))}
            </div>
        </div>
    );
};

const ServiceCard = ({ title, icon, category, description, variants }: any) => {
    return (
        <div className="bg-surface border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between group hover:border-white/10 transition-all animate-pop cursor-pointer active:scale-[0.98]">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                        {React.cloneElement(icon, { size: 24 })}
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-full text-zinc-600">
                        <MoreVertical size={16} />
                    </button>
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">
                    {category}
                </span>

                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                    {description}
                </p>
            </div>

            {/* Sizes/Variants List */}
            <div className="space-y-2 pt-4 border-t border-white/5">
                {variants.map((v: any, i: number) => (
                    <div
                        key={i}
                        className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-xl transition-colors"
                    >
                        <span className="text-xs font-medium text-zinc-400">
                            {v.size}
                        </span>
                        <span className="text-sm font-black text-white">
                            {v.price}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesSection;
