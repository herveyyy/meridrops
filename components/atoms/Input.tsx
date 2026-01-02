import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = "",
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs text-gray-400 mb-1 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white placeholder:text-gray-600 ${className}`}
                {...props}
            />
            {error && <p className="text-danger text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
};
