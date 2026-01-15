"use client";
import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
    Plus,
    CheckCircle2,
    File as FileIcon,
    ShieldCheck,
    User,
} from "lucide-react";
import { useSenderPeer } from "@/hooks/useSenderPeer";
import { formatBytes } from "@/services/utils";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Header } from "../molecules/Header";
import { StatusCard } from "./StatusCard";
import ApprovalModal from "../molecules/ApprovalModal";

const SenderView: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [inputName, setInputName] = useState("");

    // Load username from localStorage on mount
    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            setUsername(savedUsername);
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
        handleBack,
    } = useSenderPeer(username);

    // Scanner Effect
    useEffect(() => {
        let scanner: any;
        if (connectionStatus === "scanning") {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );
            scanner.render(
                (decodedText: string) => {
                    connectToAdmin(decodedText);
                    scanner.clear();
                },
                (error: any) => {}
            );
        }
        return () => {
            if (scanner) scanner.clear().catch(console.error);
        };
    }, [connectionStatus]);

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = inputName.trim();
        if (name) {
            localStorage.setItem("username", name);
            setUsername(name);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files);
    };

    // 1. Identity Step
    if (!username) {
        return (
            <div className="flex flex-col h-full bg-black text-white p-6">
                <Header title="" onBack={handleBack} />
                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full animate-pop">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">
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

    // 2. Main Dashboard
    return (
        <div className="flex flex-col h-full  bg-black text-white relative">
            <Header
                title="Send to Server"
                subtitle={`Logged in as ${username}`}
                onBack={handleBack}
            />
            <div
                id="reader"
                className="mx-auto w-full max-w-sm overflow-hidden rounded-[2.5rem] border-0!  p-8 shadow-2xl backdrop-blur-xl
    /* 1. Dashboard Layout - Stacks everything vertically */
    [&_#reader__dashboard_section]:p-0! [&_#reader__dashboard_section]:text-center!
    [&_#reader__dashboard_section_csr]:flex [&_#reader__dashboard_section_csr]:flex-col [&_#reader__dashboard_section_csr]:gap-4
    
    /* 2. Primary Buttons (Permission, Start, Stop) */
    [&_reader__dashboard_section_csr]:flex! [&_reader__dashboard_section_csr]:flex-col! [&_reader__dashboard_section_csr]:gap-4!
    [&_button]:w-full [&_button]:rounded-2xl [&_button]:py-4 [&_button]:font-bold [&_button]:transition-all active:[&_button]:scale-95
    [&_#html5-qrcode-button-camera-permission]:bg-[#007AFF] [&_#html5-qrcode-button-camera-permission]:text-white
    [&_#html5-qrcode-button-camera-start]:bg-[#34C759] [&_#html5-qrcode-button-camera-start]:text-white
    [&_#html5-qrcode-button-camera-stop]:bg-[#FF3B30] [&_#html5-qrcode-button-camera-stop]:text-white
    
    /* 3. Camera Dropdown (iOS Settings style) */
    [&_select]:w-full [&_select]:bg-zinc-800 [&_select]:text-white [&_select]:rounded-xl [&_select]:p-3  
    [&_select]:border-0 [&_select]:ring-1 [&_select]:ring-white/10 [&_select]:appearance-none [&_select]:text-sm
    
    /* 4. Zoom Slider */
    [&_input[type='range']]:appearance-none [&_input[type='range']]:w-full [&_input[type='range']]:bg-zinc-700 
    [&_input[type='range']]:h-1 [&_input[type='range']]:rounded-full [&_input[type='range']]:accent-blue-500
    
    /* 5. File Upload Box (Replacing the ugly dashed box) */
    [&_div[style*='dashed']]:border-zinc-800! [&_div[style*='dashed']]:border-2! [&_div[style*='dashed']]:rounded-3xl! 
    [&_div[style*='dashed']]:bg-zinc-900/40! [&_div[style*='dashed']]:p-6!
    [&_#html5-qrcode-button-file-selection]:bg-zinc-700 [&_#html5-qrcode-button-file-selection]:rounded-lg
    
    /* 6. Text & Links */
    [&_span]:text-zinc-500 [&_span]:text-[10px] [&_span]:uppercase [&_span]:tracking-widest
    [&_#html5-qrcode-anchor-scan-type-change]:text-[#0A84FF] [&_#html5-qrcode-anchor-scan-type-change]:no-underline [&_#html5-qrcode-anchor-scan-type-change]:mt-6 [&_#html5-qrcode-anchor-scan-type-change]:block
    
    /* 7. Hide Branding */
    [&_img]:hidden [&_#reader__status_span]:hidden"
            ></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Connection Widget */}
                <StatusCard
                    status={connectionStatus}
                    adminId={adminId}
                    setAdminId={setAdminId}
                    onConnect={() => connectToAdmin(adminId)}
                    onScan={() => setConnectionStatus("scanning")}
                    onCancel={() => setConnectionStatus("idle")}
                    onDisconnect={disconnect}
                />

                {/* Upload Interface */}
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

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-sm font-semibold text-gray-400">
                                        Transfers ({files.length})
                                    </h3>
                                </div>
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
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[10px] text-gray-500 capitalize">
                                                    {f.status === "meta-sent"
                                                        ? "Available to Admin"
                                                        : f.status.replace(
                                                              "-",
                                                              " "
                                                          )}
                                                </span>
                                                {f.status ===
                                                    "transferring" && (
                                                    <span className="text-[10px] text-primary">
                                                        {f.progress}%
                                                    </span>
                                                )}
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
                    approvalType={
                        approvalQueue[0].type === "print" ? "print" : "download"
                    }
                />
            )}
        </div>
    );
};

export default SenderView;
