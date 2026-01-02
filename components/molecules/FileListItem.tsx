import React from "react";
import { CheckCircle2, File as FileIcon } from "lucide-react";
import { QueuedFile } from "@/hooks/useSenderPeer";
import { formatBytes } from "@/services/utils";

interface FileListItemProps {
    file: QueuedFile;
    index: number;
}

export const FileListItem: React.FC<FileListItemProps> = ({ file, index }) => {
    return (
        <div
            className="bg-surface rounded-xl p-4 flex items-center gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    file.status === "sent" ? "bg-success/20" : "bg-gray-800"
                }`}
            >
                {file.status === "sent" ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                    <FileIcon className="w-5 h-5 text-gray-400" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm truncate text-white">
                        {file.file.name}
                    </p>
                    <span className="text-xs text-gray-500">
                        {formatBytes(file.file.size)}
                    </span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${
                            file.status === "sent" ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${file.progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-500 capitalize">
                        {file.status === "meta-sent"
                            ? "Available to Admin"
                            : file.status.replace("-", " ")}
                    </span>
                    {file.status === "transferring" && (
                        <span className="text-[10px] text-primary">
                            {file.progress}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
