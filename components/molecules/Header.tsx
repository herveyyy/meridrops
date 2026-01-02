import React from "react";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
    title: string;
    subtitle?: string;
    onBack: () => void;
    rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    onBack,
    rightAction,
}) => {
    return (
        <div className="flex items-center justify-between px-4 pt-4 pb-4 sticky top-0 bg-black/80 backdrop-blur-md z-30 border-b border-white/10">
            <button
                onClick={onBack}
                className="flex items-center text-primary text-lg font-normal active:opacity-50 transition-opacity"
            >
                <ChevronLeft className="w-6 h-6 -mr-1" />
                <span>Back</span>
            </button>

            <div className="flex flex-col items-center">
                <span className="font-semibold text-lg leading-none text-white">
                    {title}
                </span>
                {subtitle && (
                    <span className="text-[10px] text-gray-500 font-medium mt-1">
                        {subtitle}
                    </span>
                )}
            </div>

            <div className="min-w-15 flex justify-end">{rightAction}</div>
        </div>
    );
};
