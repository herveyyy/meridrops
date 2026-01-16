import React from "react";
import { FileText, Download, Check, Lock, PrinterIcon } from "lucide-react";
import { Button } from "../atoms/Button";
import { ReceivedFile } from "@/hooks/useReceiverPeer";
import { formatBytes, printPdf } from "@/services/utils";

interface FileGridItemProps {
    file: ReceivedFile;
    isSelectionMode: boolean;
    isSelected: boolean;
    onSelect: () => void;
    onRequest: () => void;
    onDownload: () => void;
}

export const FileGridItem: React.FC<FileGridItemProps> = ({
    file,
    isSelectionMode,
    isSelected,
    onSelect,
    onRequest,
    onDownload,
}) => {
    const isPdf = file.meta.type === "application/pdf";
    return (
        <div
            onClick={() =>
                isSelectionMode && file.status === "complete" && onSelect()
            }
            className={`bg-surface border rounded-xl p-4 flex flex-col transition-all group relative cursor-pointer
            ${
                isSelectionMode && file.status === "complete"
                    ? "hover:bg-gray-800"
                    : ""
            }
            ${
                isSelected
                    ? "border-primary bg-primary/5"
                    : "border-white/5 hover:border-white/10"
            }
        `}
        >
            {/* Checkbox Overlay */}
            {isSelectionMode && file.status === "complete" && (
                <div className="absolute top-3 right-3 z-10">
                    {isSelected ? (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    ) : (
                        <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                    )}
                </div>
            )}

            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <span
                    className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wide ${
                        file.status === "complete"
                            ? "bg-success/10 text-success"
                            : file.status === "transferring"
                            ? "bg-primary/10 text-primary"
                            : file.status === "denied"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-gray-800 text-gray-400"
                    }`}
                >
                    {file.status}
                </span>
            </div>

            <h4
                className="font-medium text-white truncate mb-1 pr-6"
                title={file.meta.name}
            >
                {file.meta.name}
            </h4>
            <p className="text-xs text-gray-500 mb-4">
                {formatBytes(file.meta.size)}
            </p>

            {/* Card Actions */}
            {!isSelectionMode && (
                <div className="mt-auto relative z-20">
                    {file.status === "pending" && (
                        <div className="">
                            <Button
                                variant="secondary"
                                className="w-full text-xs py-2 h-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRequest();
                                }}
                                icon={<Lock className="w-3 h-3" />}
                            >
                                Request Download
                            </Button>
                        </div>
                    )}

                    {(file.status === "requested" ||
                        file.status === "transferring") && (
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-secondary h-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                            ></div>
                        </div>
                    )}

                    {file.status === "complete" && (
                        <div className="flex flex-col gap-2">
                            {/* NEW: Print Button specifically for PDFs */}
                            {isPdf && (
                                <Button
                                    variant="primary"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-xs py-2 h-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("first", file);
                                        if (file.blobUrl) {
                                            window
                                                .open(
                                                    file.blobUrl,
                                                    "PRINT",
                                                    "width=800,height=600"
                                                )
                                                ?.print();
                                        }
                                    }}
                                    icon={<PrinterIcon className="w-3 h-3" />}
                                >
                                    Print PDF
                                </Button>
                            )}

                            <Button
                                variant="primary"
                                className="w-full bg-success hover:bg-success/90 text-xs py-2 h-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload();
                                }}
                                icon={<Download className="w-3 h-3" />}
                            >
                                Save to Device
                            </Button>
                        </div>
                    )}

                    {file.status === "denied" && (
                        <div className="text-center text-xs text-red-500 py-2">
                            Request Denied
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
