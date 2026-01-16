import { useState, useEffect, useRef } from "react";
import Peer, { DataConnection } from "peerjs";
import QRCode from "qrcode";
import { generateShortId } from "../services/utils";
import { FileMeta, PeerMessage } from "../services/types";

export interface ReceivedFile {
    id: string;
    fileId: string;
    meta: FileMeta;
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
    const [serverId, setServerId] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);

    const peerRef = useRef<Peer | null>(null);

    // 🔒 Binary-safe incoming file buffer (NOT React state)
    const incomingFilesRef = useRef(
        new Map<
            string,
            {
                meta: FileMeta;
                chunks: ArrayBuffer[];
                received: number;
            }
        >()
    );

    const handleData = (data: unknown, senderId: string) => {
        const msg = data as PeerMessage;

        // ---------- META ----------
        if (msg.type === "META") {
            const meta = msg.payload as FileMeta;

            incomingFilesRef.current.set(meta.id, {
                meta,
                chunks: [],
                received: 0,
            });

            setCustomers((prev) =>
                prev.map((c) =>
                    c.peerId === senderId
                        ? {
                              ...c,
                              files: [
                                  ...c.files,
                                  {
                                      id: crypto.randomUUID(),
                                      fileId: meta.id,
                                      meta,
                                      progress: 0,
                                      status: "pending",
                                  },
                              ],
                          }
                        : c
                )
            );
        }

        // ---------- CHUNK ----------
        if (msg.type === "CHUNK") {
            const { fileId, chunk } = msg.payload as {
                fileId: string;
                chunk: ArrayBuffer;
            };

            const entry = incomingFilesRef.current.get(fileId);
            if (!entry) return;

            entry.chunks.push(chunk);
            entry.received += chunk.byteLength;

            setCustomers((prev) =>
                prev.map((c) => ({
                    ...c,
                    files: c.files.map((f) =>
                        f.fileId === fileId
                            ? {
                                  ...f,
                                  status: "transferring",
                                  progress: Math.min(
                                      100,
                                      Math.round(
                                          (entry.received / entry.meta.size) *
                                              100
                                      )
                                  ),
                              }
                            : f
                    ),
                }))
            );
        }

        // ---------- END (GENERATE FILE) ----------
        if (msg.type === "END") {
            const { fileId } = msg.payload as { fileId: string };
            const entry = incomingFilesRef.current.get(fileId);
            if (!entry) return;

            const blob = new Blob(entry.chunks, {
                type: entry.meta.type,
            });

            const blobUrl = URL.createObjectURL(blob);

            incomingFilesRef.current.delete(fileId);

            setCustomers((prev) =>
                prev.map((c) => ({
                    ...c,
                    files: c.files.map((f) =>
                        f.fileId === fileId
                            ? {
                                  ...f,
                                  status: "complete",
                                  progress: 100,
                                  blobUrl,
                              }
                            : f
                    ),
                }))
            );
        }

        // ---------- DENY ----------
        if (msg.type === "DENY_DOWNLOAD") {
            const { fileId } = msg.payload as { fileId: string };

            setCustomers((prev) =>
                prev.map((c) => ({
                    ...c,
                    files: c.files.map((f) =>
                        f.fileId === fileId ? { ...f, status: "denied" } : f
                    ),
                }))
            );
        }
    };

    useEffect(() => {
        let adminId = localStorage.getItem("admin_id_admin_id");
        if (!adminId) {
            adminId = `ADMIN-${generateShortId()}`;
            localStorage.setItem("admin_id_admin_id", adminId);
        }

        const peer = new Peer(adminId, { debug: 1 });

        peer.on("open", (id) => {
            setServerId(id);
            QRCode.toDataURL(id, { margin: 2, scale: 10 })
                .then(setQrCodeUrl)
                .catch(console.error);
        });

        peer.on("connection", (conn) => {
            const label =
                (conn.metadata as { username?: string })?.username ??
                `Device ${conn.peer.slice(-4)}`;

            setCustomers((prev) => [
                ...prev,
                {
                    peerId: conn.peer,
                    label,
                    files: [],
                    lastActive: Date.now(),
                    conn,
                },
            ]);

            conn.on("data", (data) => handleData(data, conn.peer));
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

        setCustomers((prev) =>
            prev.map((c) =>
                c.peerId === customer.peerId
                    ? {
                          ...c,
                          files: c.files.map((f) =>
                              f.fileId === file.fileId
                                  ? { ...f, status: "requested" }
                                  : f
                          ),
                      }
                    : c
            )
        );
    };

    const closeConnection = (customer: Customer) => {
        customer.conn.close();
        setCustomers((prev) =>
            prev.filter((c) => c.peerId !== customer.peerId)
        );
    };

    return {
        serverId,
        qrCodeUrl,
        customers,
        requestDownload,
        closeConnection,
    };
};
