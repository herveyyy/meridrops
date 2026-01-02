import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    isLoading,
    icon,
    fullWidth,
    className = "",
    disabled,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-gray-800 text-gray-200 hover:bg-gray-700",
        danger: "bg-danger text-white hover:bg-danger/90",
        ghost: "bg-transparent text-gray-400 hover:text-white",
        outline:
            "bg-transparent border border-gray-600 text-gray-300 hover:border-white hover:text-white",
    };

    const sizeStyles = {
        sm: "py-2 px-3 text-xs",
        md: "py-3 px-4 text-sm",
        lg: "py-4 px-6 text-base",
    };

    const width = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizeStyles[size]} ${width} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2
                    className={`animate-spin ${
                        size === "sm" ? "w-4 h-4" : "w-5 h-5"
                    }`}
                />
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};
