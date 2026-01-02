import { useState, useEffect, useRef } from "react";
import Peer, { DataConnection } from "peerjs";
import QRCode from "qrcode";
import { generateShortId } from "../services/utils";
import { FileMeta, PeerMessage } from "../services/types";

export interface ReceivedFile {
    id: string;
    fileId: string;
    meta: FileMeta;
    chunks: ArrayBuffer[];
    totalBytesReceived: number;
    progress: number;
    status: "pending" | "requested" | "transferring" | "complete" | "denied";
    blobUrl?: string;
}

export interface Customer {
    peerId: string;
    label: string;
    files: ReceivedFile[];
    lastActive: number;
    conn: DataConnection;
}

export const useReceiverPeer = () => {
    const [serverId, setServerId] = useState<string>("");
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [customers, setCustomers] = useState<Customer[]>([]);

    const peerRef = useRef<Peer | null>(null);

    const handleData = (data: unknown, senderId: string) => {
        const msg = data as PeerMessage;
        setCustomers((prev) => {
            const customerIndex = prev.findIndex((c) => c.peerId === senderId);
            if (customerIndex === -1) return prev;

            const updatedCustomers = [...prev];
            const customer = { ...updatedCustomers[customerIndex] };

            if (msg.type === "META") {
                const meta = msg.payload as FileMeta;
                if (!customer.files.find((f) => f.fileId === meta.id)) {
                    customer.files = [
                        ...customer.files,
                        {
                            id: Math.random().toString(36),
                            fileId: meta.id,
                            meta,
                            chunks: [],
                            totalBytesReceived: 0,
                            progress: 0,
                            status: "pending",
                        },
                    ];
                }
            } else if (msg.type === "CHUNK") {
                const chunk = msg.payload as ArrayBuffer;
                const fileIndex = customer.files.findIndex(
                    (f) =>
                        f.status === "transferring" || f.status === "requested"
                );
                if (fileIndex !== -1) {
                    const file = { ...customer.files[fileIndex] };
                    file.status = "transferring";
                    file.chunks.push(chunk);
                    file.totalBytesReceived += chunk.byteLength;
                    file.progress = Math.min(
                        100,
                        Math.round(
                            (file.totalBytesReceived / file.meta.size) * 100
                        )
                    );
                    customer.files[fileIndex] = file;
                }
            } else if (msg.type === "END") {
                const fileIndex = customer.files.findIndex(
                    (f) => f.status === "transferring"
                );
                if (fileIndex !== -1) {
                    const file = { ...customer.files[fileIndex] };
                    file.status = "complete";
                    file.progress = 100;
                    const blob = new Blob(file.chunks, {
                        type: file.meta.type,
                    });
                    file.blobUrl = URL.createObjectURL(blob);
                    customer.files[fileIndex] = file;
                }
            } else if (msg.type === "DENY_DOWNLOAD") {
                const fileId = msg.payload.fileId;
                const fileIndex = customer.files.findIndex(
                    (f) => f.fileId === fileId
                );
                if (fileIndex !== -1) {
                    const file = { ...customer.files[fileIndex] };
                    file.status = "denied";
                    customer.files[fileIndex] = file;
                }
            }
            updatedCustomers[customerIndex] = customer;
            return updatedCustomers;
        });
    };

    useEffect(() => {
        let customId = localStorage.getItem("aether_admin_id");
        if (!customId) {
            customId = `ADMIN-${generateShortId()}`;
            localStorage.setItem("aether_admin_id", customId);
        }

        const peer = new Peer(customId, { debug: 1 });

        peer.on("open", (id) => {
            setServerId(id);
            QRCode.toDataURL(id, {
                margin: 2,
                scale: 10,
                color: { dark: "#000000", light: "#ffffff" },
            })
                .then((url) => setQrCodeUrl(url))
                .catch((err) => console.error(err));
        });

        peer.on("connection", (conn) => {
            const metadata = conn.metadata as { username?: string } | undefined;
            const clientLabel =
                metadata?.username ||
                `Device ${conn.peer.split("-").pop() || "Unknown"}`;

            const newCustomer: Customer = {
                peerId: conn.peer,
                label: clientLabel,
                files: [],
                lastActive: Date.now(),
                conn: conn,
            };

            setCustomers((prev) => {
                const existingIdx = prev.findIndex(
                    (c) => c.peerId === conn.peer
                );
                if (existingIdx !== -1) {
                    const updated = [...prev];
                    updated[existingIdx] = {
                        ...updated[existingIdx],
                        conn: conn,
                        label: clientLabel,
                        lastActive: Date.now(),
                    };
                    return updated;
                }
                return [...prev, newCustomer];
            });

            conn.on("data", (data: unknown) => handleData(data, conn.peer));
            conn.on("close", () =>
                setCustomers((prev) =>
                    prev.filter((c) => c.peerId !== conn.peer)
                )
            );
        });

        peerRef.current = peer;
        return () => peer.destroy();
    }, []);

    const requestDownload = (customer: Customer, file: ReceivedFile) => {
        if (file.status !== "pending" && file.status !== "denied") return;
        customer.conn.send({
            type: "REQUEST_DOWNLOAD",
            payload: { fileId: file.fileId },
        });
        setCustomers((prev) => {
            const cIdx = prev.findIndex((c) => c.peerId === customer.peerId);
            if (cIdx === -1) return prev;
            const newC = { ...prev[cIdx] };
            newC.files = newC.files.map((f) =>
                f.id === file.id ? { ...f, status: "requested" } : f
            );
            return prev.map((c, i) => (i === cIdx ? newC : c));
        });
    };
    const closeConnection = (customer: Customer) => {
        customer.conn.close();
        setCustomers((prev) =>
            prev.filter((c) => c.peerId !== customer.peerId)
        );
    };

    return { serverId, qrCodeUrl, customers, requestDownload, closeConnection };
};
