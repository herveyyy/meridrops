export enum AppMode {
    HOME = "HOME",
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
}

export interface PeerMessage {
    type:
        | "META"
        | "CHUNK"
        | "END"
        | "REQUEST_DOWNLOAD"
        | "DENY_DOWNLOAD"
        | "PRINT_REQUEST";
    payload?: any;
}

export interface FileMeta {
    id: string;
    name: string;
    size: number;
    type: string;
}

export interface FileAnalysis {
    summary: string;
    safety: "Safe" | "Suspicious" | "Unknown";
    fileType: string;
}
