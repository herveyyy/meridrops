"use client";
import React, { useState, useEffect } from "react";
import {
    ChevronLeft,
    FolderOpen,
    Copy,
    QrCode,
    Search,
    Smartphone,
    Folder,
    DownloadCloud,
    CheckSquare,
} from "lucide-react";
import { useReceiverPeer } from "../../hooks/useReceiverPeer";
import { useZipDownloader } from "../../hooks/useZipDownloader";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { FileGridItem } from "../molecules/FileGridItem";
import Image from "next/image";

const ReceiverView: React.FC = () => {
    const { serverId, qrCodeUrl, customers, requestDownload } =
        useReceiverPeer();
    const { downloadSelectedZip } = useZipDownloader();

    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [showQr, setShowQr] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);

    // Selection State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
        new Set()
    );

    // Handle responsive layout
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener("resize", checkDesktop);
        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    // Reset selection when changing customers
    useEffect(() => {
        setIsSelectionMode(false);
        setSelectedFileIds(new Set());
    }, [selectedCustomerId]);

    const toggleSelection = (fileId: string) => {
        const newSet = new Set(selectedFileIds);
        if (newSet.has(fileId)) newSet.delete(fileId);
        else newSet.add(fileId);
        setSelectedFileIds(newSet);
    };

    const handleBatchDownload = async () => {
        if (!selectedCustomer) return;
        await downloadSelectedZip(selectedCustomer, selectedFileIds, () => {
            setIsSelectionMode(false);
            setSelectedFileIds(new Set());
        });
    };

    const requestAll = () => {
        if (!selectedCustomer) return;
        const pendingFiles = selectedCustomer.files.filter(
            (f) => f.status === "pending"
        );
        pendingFiles.forEach((file) => requestDownload(selectedCustomer, file));
    };

    const downloadFileToDisk = (file: any) => {
        if (!file.blobUrl) return;
        const a = document.createElement("a");
        a.href = file.blobUrl;
        a.download = file.meta.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredCustomers = customers.filter(
        (c) =>
            c.peerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCustomer = customers.find(
        (c) => c.peerId === selectedCustomerId
    );

    const isMobile = !isDesktop;

    return (
        <div className="flex flex-col h-full bg-black text-white relative lg:flex-row overflow-hidden">
            {/* Sidebar (Customers) */}
            <div
                className={`flex flex-col  lg:w-80 w-full border-r border-white/10 bg-surface/50 h-full absolute lg:relative z-10 transition-transform ${
                    selectedCustomerId && isMobile
                        ? "-translate-x-full"
                        : "translate-x-0"
                }`}
            >
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Admin Panel</h2>
                        <div className="flex items-center space-x-2 bg-black/40 px-2 py-1 rounded text-xs">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                            <span>Online</span>
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-lg p-3 mb-4 flex items-center justify-between">
                        <div className="overflow-hidden">
                            <p className="text-[10px] text-gray-400 uppercase">
                                Server ID
                            </p>
                            <p className="text-sm font-mono truncate text-secondary">
                                {serverId}
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(serverId)
                            }
                        >
                            <Copy className="w-4 h-4 text-gray-500 hover:text-white" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 py-2.5 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            {searchTerm ? "No matches" : "No customers"}
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setShowQr(true)}
                                    className="text-secondary text-xs flex items-center"
                                >
                                    <QrCode className="w-3 h-3 mr-1" /> Show QR
                                </button>
                            </div>
                        </div>
                    ) : (
                        filteredCustomers.map((c) => (
                            <button
                                key={c.peerId}
                                onClick={() => setSelectedCustomerId(c.peerId)}
                                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                                    selectedCustomerId === c.peerId
                                        ? "bg-secondary/20 border border-secondary/50"
                                        : "hover:bg-white/5 border border-transparent"
                                }`}
                            >
                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                    <Smartphone
                                        className={`w-5 h-5 ${
                                            selectedCustomerId === c.peerId
                                                ? "text-secondary"
                                                : "text-gray-400"
                                        }`}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4
                                        className={`font-medium text-sm truncate ${
                                            selectedCustomerId === c.peerId
                                                ? "text-white"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        {c.label}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">
                                        {c.files.length} files
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content (Files) */}
            <div
                className={`flex-1 bg-black flex flex-col h-full absolute lg:relative w-full z-20 transition-transform ${
                    selectedCustomerId || !isMobile
                        ? "translate-x-0"
                        : "translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header */}
                <div className="flex items-center p-4 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-30 justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSelectedCustomerId(null)}
                            className="lg:hidden mr-3"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <span className="font-semibold text-lg">
                            {selectedCustomer?.label || "Files"}
                        </span>
                    </div>
                    {selectedCustomer && (
                        <button
                            onClick={() => setIsSelectionMode(!isSelectionMode)}
                            className="text-primary text-sm font-medium"
                        >
                            {isSelectionMode ? "Cancel" : "Select"}
                        </button>
                    )}
                </div>

                {selectedCustomer ? (
                    <div className="p-6 flex-1 overflow-y-auto relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20">
                                    <Folder className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        {selectedCustomer.label}
                                    </h1>
                                    <p className="text-gray-500 text-sm">
                                        ID: {selectedCustomer.peerId}
                                    </p>
                                </div>
                            </div>

                            {/* Actions Toolbar */}
                            <div className="hidden lg:flex items-center gap-2">
                                {!isSelectionMode ? (
                                    <>
                                        {selectedCustomer.files.some(
                                            (f) => f.status === "pending"
                                        ) && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={requestAll}
                                                icon={
                                                    <DownloadCloud className="w-4 h-4" />
                                                }
                                            >
                                                Request All
                                            </Button>
                                        )}
                                        {selectedCustomer.files.some(
                                            (f) => f.status === "complete"
                                        ) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setIsSelectionMode(true)
                                                }
                                                icon={
                                                    <CheckSquare className="w-4 h-4" />
                                                }
                                            >
                                                Select
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400 mr-2">
                                            {selectedFileIds.size} selected
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setIsSelectionMode(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        {selectedFileIds.size > 0 && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={handleBatchDownload}
                                                icon={
                                                    <Folder className="w-4 h-4" />
                                                }
                                            >
                                                Download Zip
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Files Grid */}
                        {selectedCustomer.files.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl">
                                <FolderOpen className="w-12 h-12 text-gray-700 mb-3" />
                                <p className="text-gray-500">
                                    No files shared yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
                                {selectedCustomer.files.map((file) => (
                                    <FileGridItem
                                        key={file.id}
                                        file={file}
                                        isSelectionMode={isSelectionMode}
                                        isSelected={selectedFileIds.has(
                                            file.id
                                        )}
                                        onSelect={() =>
                                            toggleSelection(file.id)
                                        }
                                        onRequest={() =>
                                            requestDownload(
                                                selectedCustomer,
                                                file
                                            )
                                        }
                                        onDownload={() =>
                                            downloadFileToDisk(file)
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* Mobile Batch Action */}
                        {isSelectionMode && selectedFileIds.size > 0 && (
                            <div className="fixed lg:hidden bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    className="py-4 shadow-xl"
                                    onClick={handleBatchDownload}
                                    icon={<Folder className="w-5 h-5" />}
                                >
                                    Download {selectedFileIds.size} Files as Zip
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-8">
                        {showQr && (
                            <div className="bg-white p-4 rounded-2xl mb-8 animate-pop">
                                <Image
                                    src={qrCodeUrl || "/placeholder-qrcode.png"}
                                    width={256}
                                    height={256}
                                    alt="Connect QR"
                                    className="w-64 h-64 object-contain"
                                />
                            </div>
                        )}
                        <h2 className="text-3xl font-bold mb-2">
                            Ready to Receive
                        </h2>
                        <p className="text-gray-400 max-w-md">
                            Ask customers to scan the QR code to connect.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiverView;
