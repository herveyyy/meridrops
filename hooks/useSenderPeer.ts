import { useState, useEffect, useRef } from "react";
import Peer, { DataConnection } from "peerjs";
import { generateShortId } from "../services/utils";
import { FileMeta, PeerMessage } from "../services/types";
import { useRouter } from "next/navigation";

export interface QueuedFile {
    id: string;
    file: File;
    status: "queued" | "meta-sent" | "requested" | "transferring" | "sent";
    progress: number;
}

export interface ApprovalRequest {
    fileId: string;
    fileName: string;
    type?: "download";
}

export const CHUNK_SIZE = 64 * 1024; // 64 KB

export const useSenderPeer = (username: string) => {
    const [peerId, setPeerId] = useState("");
    const [adminId, setAdminId] = useState("");
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
    const router = useRouter();
    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    // ---------- INIT PEER ----------
    useEffect(() => {
        const peer = new Peer({ debug: 1 });

        peer.on("open", (id) => setPeerId(id));
        peer.on("error", (err) => {
            console.error(err);
            setConnectionStatus("idle");
            localStorage.clear();
        });

        peerRef.current = peer;
        return () => peer.destroy();
    }, []);

    // ---------- AUTO CONNECT ----------
    useEffect(() => {
        if (username && peerId && !autoConnectAttempted.current) {
            const lastAdminId = localStorage.getItem("last_admin_id");
            if (lastAdminId) {
                autoConnectAttempted.current = true;
                connectToAdmin(lastAdminId, true);
            }
        }
    }, [username, peerId]);

    // ---------- CONNECT ----------
    const connectToAdmin = (targetId: string, isAuto = false) => {
        if (!peerRef.current) return;

        const conn = peerRef.current.connect(targetId.trim().toUpperCase(), {
            reliable: true,
            metadata: { username },
        });

        setConnectionStatus(isAuto ? "auto-connecting" : "connecting");
        setAdminId(targetId);

        conn.on("open", () => {
            setConnectionStatus("connected");
            connRef.current = conn;
            localStorage.setItem("last_admin_id", targetId);

            filesRef.current.forEach((f) => sendMetadata(f, conn));
        });

        conn.on("data", (data) => {
            const msg = data as PeerMessage;

            if (msg.type === "REQUEST_DOWNLOAD") {
                const file = filesRef.current.find(
                    (f) => f.id === msg.payload.fileId,
                );
                if (!file) return;

                setApprovalQueue((prev) =>
                    prev.find((r) => r.fileId === file.id)
                        ? prev
                        : [
                              ...prev,
                              {
                                  fileId: file.id,
                                  fileName: file.file.name,
                                  type: "download",
                              },
                          ],
                );
            }
        });

        conn.on("close", () => {
            setConnectionStatus("idle");
            connRef.current = null;
        });
    };

    // ---------- FILE ADD ----------
    const addFiles = (fileList: FileList) => {
        const newFiles: QueuedFile[] = Array.from(fileList).map((file) => ({
            id: generateShortId(),
            file,
            status: "queued",
            progress: 0,
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        if (connRef.current) {
            newFiles.forEach((f) => sendMetadata(f, connRef.current!));
        }
    };

    // ---------- SEND META ----------
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
                f.id === fileObj.id ? { ...f, status: "meta-sent" } : f,
            ),
        );
    };

    // ---------- APPROVAL ----------
    const handleApprove = async () => {
        if (!connRef.current || approvalQueue.length === 0) return;
        const req = approvalQueue[0];
        const file = filesRef.current.find((f) => f.id === req.fileId);
        if (file) await startDataTransfer(file, connRef.current);
        setApprovalQueue((prev) => prev.slice(1));
    };

    const handleDeny = () => {
        if (!connRef.current || approvalQueue.length === 0) return;
        connRef.current.send({
            type: "DENY_DOWNLOAD",
            payload: { fileId: approvalQueue[0].fileId },
        });
        setApprovalQueue((prev) => prev.slice(1));
    };

    // ---------- SEND FILE ----------
    const startDataTransfer = async (
        fileObj: QueuedFile,
        conn: DataConnection,
    ) => {
        if (!conn.open) return;

        setFiles((prev) =>
            prev.map((f) =>
                f.id === fileObj.id
                    ? { ...f, status: "transferring", progress: 0 }
                    : f,
            ),
        );

        const getBufferedAmount = () => (conn as any)?._dc?.bufferedAmount ?? 0;

        let offset = 0;

        while (offset < fileObj.file.size) {
            while (getBufferedAmount() > 512 * 1024) {
                await new Promise((r) => setTimeout(r, 10));
            }

            const slice = fileObj.file.slice(offset, offset + CHUNK_SIZE);
            const buffer = await slice.arrayBuffer();

            conn.send({
                type: "CHUNK",
                payload: {
                    fileId: fileObj.id,
                    chunk: buffer,
                },
            });

            offset += CHUNK_SIZE;

            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileObj.id
                        ? {
                              ...f,
                              progress: Math.round(
                                  (offset / fileObj.file.size) * 100,
                              ),
                          }
                        : f,
                ),
            );
        }

        conn.send({
            type: "END",
            payload: { fileId: fileObj.id },
        });

        setFiles((prev) =>
            prev.map((f) =>
                f.id === fileObj.id
                    ? { ...f, status: "sent", progress: 100 }
                    : f,
            ),
        );
    };

    const disconnect = () => {
        connRef.current?.close();
        setConnectionStatus("idle");
        localStorage.clear();
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
    };
};
