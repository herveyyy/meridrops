import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface PaginationProps {
    total: number;
    offset: number;
    limit: number;
    onPageChange: (newOffset: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    total,
    offset,
    limit,
    onPageChange,
}) => {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    // Helper to change page
    const goToPage = (page: number) => {
        const newOffset = Math.max(0, (page - 1) * limit);
        if (newOffset < total) {
            onPageChange(newOffset);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl">
            {/* Results Info */}
            <div className="hidden sm:block">
                <p className="text-xs text-zinc-500">
                    Showing{" "}
                    <span className="text-white font-medium">{offset + 1}</span>{" "}
                    to{" "}
                    <span className="text-white font-medium">
                        {Math.min(offset + limit, total)}
                    </span>{" "}
                    of <span className="text-white font-medium">{total}</span>{" "}
                    results
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Prev */}
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 px-2 text-sm font-medium">
                    <span className="text-blue-400">{currentPage}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-400">{totalPages}</span>
                </div>

                {/* Next */}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
