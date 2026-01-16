"use client";
import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
    Plus,
    CheckCircle2,
    File as FileIcon,
    User,
    Printer,
    Shirt,
    Coffee,
    Image as ImageIcon,
    FrameIcon,
    HelpCircleIcon,
} from "lucide-react";
import { useSenderPeer } from "@/hooks/useSenderPeer";
import { formatBytes } from "@/services/utils";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Header } from "../molecules/Header";
import { StatusCard } from "./StatusCard";
import ApprovalModal from "../molecules/ApprovalModal";
const servicesEnabledList = {
    document:
        process.env.NEXT_PUBLIC_PRINT_SERVICE_DOCUMENT === "true"
            ? true
            : false,
    photo:
        process.env.NEXT_PUBLIC_PRINT_SERVICE_PHOTO === "true" ? true : false,
    idCard:
        process.env.NEXT_PUBLIC_PRINT_SERVICE_ID_CARD === "true" ? true : false,
    poster:
        process.env.NEXT_PUBLIC_PRINT_SERVICE_POSTER === "true" ? true : false,
};
const SenderView: React.FC = () => {
    // New state to manage the flow: 'identity' -> 'services' -> 'dashboard'
    const [viewStep, setViewStep] = useState<
        "identity" | "services" | "dashboard"
    >("identity");
    const [username, setUsername] = useState<string>("");
    const [inputName, setInputName] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const availableServices = [
        {
            id: "docs",
            name: "Documents",
            icon: <Printer size={32} />,
            enable: process.env.NEXT_PUBLIC_PRINT_SERVICE_DOCUMENT === "true",
        },
        {
            id: "shirt",
            name: "Shirt Print",
            icon: <Shirt size={32} />,
            enable: process.env.NEXT_PUBLIC_PRINT_SERVICE_SHIRT === "true",
        },
        {
            id: "mug",
            name: "Mug Print",
            icon: <Coffee size={32} />,
            enable: process.env.NEXT_PUBLIC_PRINT_SERVICE_MUG === "true",
        },
        {
            id: "tarp",
            name: "Tarp",
            icon: <FrameIcon size={32} />,
            enable: process.env.NEXT_PUBLIC_PRINT_SERVICE_POSTER === "true",
        },
        {
            id: "photo",
            name: "Photo Print",
            icon: <ImageIcon size={32} />,
            enable: process.env.NEXT_PUBLIC_PRINT_SERVICE_PHOTO === "true",
        },
        {
            id: "card",
            name: "ID Card",
            icon: <User size={32} />,
            enable: process.env.NEXT_PUBLIC_PRINT_SERVICE_ID_CARD === "true",
        },
    ];
    const enabledServices = availableServices.filter(
        (service) => service.enable === true
    );

    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            setUsername(savedUsername);
            setViewStep("services"); // Skip name if already saved
        }
    }, []);

    const {
        adminId,
        setAdminId,
        connectionStatus,
        setConnectionStatus,
        connectToAdmin,
        disconnect,
        files,
        addFiles,
        approvalQueue,
        handleApprove,
        handleDeny,
    } = useSenderPeer(username);

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = inputName.trim();
        if (name) {
            localStorage.setItem("username", name);
            setUsername(name);
            setViewStep("services");
        }
    };

    const toggleService = (name: string) => {
        setSelectedServices((prev) =>
            prev.includes(name)
                ? prev.filter((s) => s !== name)
                : [...prev, name]
        );
    };

    const handleBack = () => {
        if (viewStep === "dashboard") {
            setViewStep("services");
        } else {
            disconnect();
            setAdminId("");
            setUsername("");
            setInputName("");
            localStorage.clear();
            setViewStep("identity");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files);
    };

    // 1. Identity Step
    if (viewStep === "identity") {
        return (
            <div className="flex flex-col h-full bg-black text-white p-6">
                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full animate-pop">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">
                        What's your name?
                    </h2>
                    <p className="text-gray-400 text-center text-sm mb-8">
                        This helps the Admin identify your device.
                    </p>
                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <Input
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="Enter your name (e.g. John)"
                            className="text-center"
                            autoFocus
                        />
                        <Button
                            type="submit"
                            disabled={!inputName.trim()}
                            fullWidth
                        >
                            Continue
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    // 2. Services Selection Step (Mechanical Keyboard Style)
    if (viewStep === "services") {
        return (
            <div className="flex flex-col h-full bg-black text-white p-6">
                <Header
                    title="Print Services"
                    subtitle="Select what you need"
                    onBack={handleBack}
                />

                <div className="flex-1 flex flex-col justify-center  max-w-sm mx-auto w-full animate-slide-up">
                    <div className="grid grid-cols-2 gap-6">
                        {enabledServices.map((service) => {
                            const isSelected = selectedServices.includes(
                                service.name
                            );
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => toggleService(service.name)}
                                    className={`
                                        relative flex flex-col items-center justify-center aspect-video rounded-3xl transition-all duration-150
                                        ${
                                            isSelected
                                                ? "bg-zinc-900 border-t-2 border-primary/40 translate-y-1 shadow-[0_2px_0_0_#000,0_0_20px_rgba(59,130,246,0.3)]"
                                                : "bg-surface border-t-2 border-white/10 shadow-[0_8px_0_0_#000,0_12px_20px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_2px_0_0_#000]"
                                        }
                                    `}
                                >
                                    <div
                                        className={`mb-3 transition-all duration-300 ${
                                            isSelected
                                                ? "text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] scale-110"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {service.icon}
                                    </div>
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-widest ${
                                            isSelected
                                                ? "text-primary"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {service.name}
                                    </span>
                                    {/* Key Surface Detail */}
                                    <div className="absolute inset-x-5 top-2 h-[1.5px] bg-white/5 rounded-full" />
                                </button>
                            );
                        })}
                    </div>
                    <Button
                        onClick={() => setViewStep("dashboard")}
                        disabled={selectedServices.length === 0}
                        fullWidth
                        className="mt-12 h-14 bg-primary shadow-[0_4px_0_#1e40af] active:translate-y-1 active:shadow-none font-bold"
                    >
                        CONFIRM SELECTION
                    </Button>
                </div>
            </div>
        );
    }

    // 3. Main Dashboard
    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            <Header
                title="Send to Server"
                subtitle={`Services: ${selectedServices.join(", ")}`}
                onBack={handleBack}
            />
            {/* The rest of your existing Dashboard code (Scanner, StatusCard, File List) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* ID Reader Container */}
                <div
                    id="reader"
                    className="mx-auto w-full max-w-sm overflow-hidden rounded-[2.5rem] border-0! p-8 shadow-2xl backdrop-blur-xl [&_img]:hidden [&_#reader__status_span]:hidden"
                ></div>

                <StatusCard
                    status={connectionStatus}
                    adminId={adminId}
                    setAdminId={setAdminId}
                    onConnect={() => connectToAdmin(adminId)}
                    onScan={() => setConnectionStatus("scanning")}
                    onCancel={() => setConnectionStatus("idle")}
                    onDisconnect={disconnect}
                />

                {connectionStatus === "connected" && (
                    <div className="animate-slide-up space-y-6">
                        <div className="relative group">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                            />
                            <div className="bg-gray-ios-light/50 border-2 border-dashed border-gray-600 hover:border-primary hover:bg-gray-ios-light transition-all duration-300 rounded-2xl p-8 flex flex-col items-center justify-center group-active:scale-95">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="w-8 h-8 text-primary" />
                                </div>
                                <span className="font-medium text-lg text-white">
                                    Tap to Upload
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                    Photos, Documents, Archives
                                </span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-400 px-1">
                                    Transfers ({files.length})
                                </h3>
                                {files.map((f, i) => (
                                    <div
                                        key={f.id}
                                        className="bg-surface rounded-xl p-4 flex items-center gap-3 animate-slide-up"
                                        style={{
                                            animationDelay: `${i * 0.05}s`,
                                        }}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                f.status === "sent"
                                                    ? "bg-success/20"
                                                    : "bg-gray-800"
                                            }`}
                                        >
                                            {f.status === "sent" ? (
                                                <CheckCircle2 className="w-5 h-5 text-success" />
                                            ) : (
                                                <FileIcon className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-medium text-sm truncate text-white">
                                                    {f.file.name}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {formatBytes(f.file.size)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${
                                                        f.status === "sent"
                                                            ? "bg-success"
                                                            : "bg-primary"
                                                    }`}
                                                    style={{
                                                        width: `${f.progress}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {approvalQueue.length > 0 && (
                <ApprovalModal
                    approvalQueue={approvalQueue}
                    handleApprove={handleApprove}
                    handleDeny={handleDeny}
                    approvalType={approvalQueue[0].type || "download"}
                />
            )}
        </div>
    );
};

export default SenderView;
