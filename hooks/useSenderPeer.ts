import { useState, useEffect, useRef } from "react";
import { Peer, DataConnection } from "peerjs";
import { generateShortId } from "../services/utils";
import { FileMeta, PeerMessage } from "../services/types";

export interface QueuedFile {
    id: string;
    file: File;
    status: "queued" | "meta-sent" | "requested" | "transferring" | "sent";
    progress: number;
}

export interface ApprovalRequest {
    fileId: string;
    fileName: string;
}

export const useSenderPeer = (username: string) => {
    const [peerId, setPeerId] = useState<string>("");
    const [adminId, setAdminId] = useState<string>("");
    const [connectionStatus, setConnectionStatus] = useState<
        "idle" | "scanning" | "connecting" | "connected" | "auto-connecting"
    >("idle");
    const [files, setFiles] = useState<QueuedFile[]>([]);
    const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([]);

    const filesRef = useRef<QueuedFile[]>([]);
    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const autoConnectAttempted = useRef(false);

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    // Initialize Peer
    useEffect(() => {
        const peer = new Peer({ debug: 1 });

        peer.on("open", (id) => setPeerId(id));
        peer.on("error", (err) => {
            console.error("Peer Error:", err);
            setConnectionStatus((prev) => {
                if (prev === "auto-connecting") return "idle";
                return prev === "connected" ? "connected" : "idle";
            });
            const errorType = (err as any).type;
            if (
                errorType === "peer-unavailable" &&
                connectionStatus !== "auto-connecting"
            ) {
                alert("Server not found. Please check the ID.");
            }
        });

        peerRef.current = peer;
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            peer.destroy();
        };
    }, []);

    // Auto Connect Logic
    useEffect(() => {
        if (
            username &&
            peerId &&
            !autoConnectAttempted.current &&
            connectionStatus === "idle"
        ) {
            const lastAdminId = localStorage.getItem("admin_id_last_admin_id");
            if (lastAdminId) {
                autoConnectAttempted.current = true;
                setConnectionStatus("auto-connecting");
                connectToAdmin(lastAdminId, true);
            }
        }
    }, [username, peerId]);

    const connectToAdmin = (targetId: string, isAuto: boolean = false) => {
        if (!peerRef.current) return;
        const sanitizedId = targetId.trim().toUpperCase();

        if (!sanitizedId) {
            if (!isAuto) alert("Invalid ID");
            return;
        }

        if (!isAuto) setConnectionStatus("connecting");
        setAdminId(sanitizedId);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
            () => {
                setConnectionStatus((prev) => {
                    if (prev === "connecting" || prev === "auto-connecting") {
                        if (!isAuto) alert("Connection timed out.");
                        return "idle";
                    }
                    return prev;
                });
                if (connRef.current) connRef.current.close();
            },
            isAuto ? 5000 : 60000
        );

        const conn = peerRef.current.connect(sanitizedId, {
            reliable: true,
            metadata: { username },
        });

        conn.on("open", () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setConnectionStatus("connected");
            connRef.current = conn;
            localStorage.setItem("admin_id_last_admin_id", sanitizedId);

            // Resend metadata for existing files
            if (filesRef.current.length > 0) {
                filesRef.current.forEach((f) => sendMetadata(f, conn));
            }
        });

        conn.on("data", (data: any) => {
            const msg = data as PeerMessage;
            if (msg.type === "REQUEST_DOWNLOAD") {
                const fileId = msg.payload.fileId;
                const file = filesRef.current.find((f) => f.id === fileId);
                if (file) {
                    setApprovalQueue((prev) => {
                        if (prev.find((req) => req.fileId === file.id))
                            return prev;
                        return [
                            ...prev,
                            { fileId: file.id, fileName: file.file.name },
                        ];
                    });
                }
            }
        });

        conn.on("close", () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setConnectionStatus("idle");
            alert("Disconnected from Admin Server");
        });
    };

    const addFiles = (fileList: FileList) => {
        const newFiles: QueuedFile[] = Array.from(fileList).map((file) => ({
            id: generateShortId(),
            file,
            status: "queued",
            progress: 0,
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        if (connRef.current && connectionStatus === "connected") {
            newFiles.forEach((f) => sendMetadata(f, connRef.current!));
        }
    };

    const sendMetadata = (fileObj: QueuedFile, conn: DataConnection) => {
        const meta: FileMeta = {
            id: fileObj.id,
            name: fileObj.file.name,
            size: fileObj.file.size,
            type: fileObj.file.type,
        };
        conn.send({ type: "META", payload: meta });
        setFiles((prev) =>
            prev.map((f) =>
                f.id === fileObj.id
                    ? { ...f, status: "meta-sent", progress: 0 }
                    : f
            )
        );
    };

    const handleApprove = () => {
        if (approvalQueue.length === 0 || !connRef.current) return;
        const req = approvalQueue[0];
        const fileObj = files.find((f) => f.id === req.fileId);
        if (fileObj) startDataTransfer(fileObj, connRef.current);
        setApprovalQueue((prev) => prev.slice(1));
    };

    const handleDeny = () => {
        if (approvalQueue.length === 0 || !connRef.current) return;
        const req = approvalQueue[0];
        connRef.current.send({
            type: "DENY_DOWNLOAD",
            payload: { fileId: req.fileId },
        });
        setApprovalQueue((prev) => prev.slice(1));
    };

    const startDataTransfer = (fileObj: QueuedFile, conn: DataConnection) => {
        const { file, id } = fileObj;
        setFiles((prev) =>
            prev.map((f) =>
                f.id === id ? { ...f, status: "transferring", progress: 0 } : f
            )
        );

        const chunkSize = 16 * 1024;
        const reader = new FileReader();
        let offset = 0;

        reader.onload = (e) => {
            if (e.target?.result) {
                conn.send({ type: "CHUNK", payload: e.target.result });
                offset += chunkSize;
                const progress = Math.min(
                    100,
                    Math.round((offset / file.size) * 100)
                );

                setFiles((prev) =>
                    prev.map((f) => (f.id === id ? { ...f, progress } : f))
                );

                if (offset < file.size) {
                    readSlice(offset);
                } else {
                    conn.send({ type: "END" });
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === id
                                ? { ...f, status: "sent", progress: 100 }
                                : f
                        )
                    );
                }
            }
        };

        const readSlice = (o: number) => {
            const slice = file.slice(o, o + chunkSize);
            reader.readAsArrayBuffer(slice);
        };

        readSlice(0);
    };

    const disconnect = () => {
        if (connRef.current) connRef.current.close();
        setConnectionStatus("idle");
    };
    const handleBack = () => {
        if (connRef.current) connRef.current.close();
        localStorage.clear();
        window.location.reload();
    };
    return {
        peerId,
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
    };
};
