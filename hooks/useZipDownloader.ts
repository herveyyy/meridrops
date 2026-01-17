import JSZip from "jszip";
import { Customer } from "./useReceiverPeer";

export const useZipDownloader = () => {
    const downloadSelectedZip = async (
        customer: Customer,
        selectedFileIds: Set<string>,
        onComplete?: () => void,
    ) => {
        if (!customer || selectedFileIds.size === 0) return;

        const zip = new JSZip();
        const folderName = `${customer.label}_Files`.replace(
            /[^a-z0-9]/gi,
            "_",
        );
        const folder = zip.folder(folderName);
        if (!folder) return;

        let filesAdded = 0;

        for (const file of customer.files) {
            if (
                selectedFileIds.has(file.id) &&
                file.status === "complete" &&
                file.blobUrl
            ) {
                const response = await fetch(file.blobUrl);
                const blob = await response.blob();

                folder.file(file.meta.name, blob);
                filesAdded++;
            }
        }

        if (filesAdded === 0) {
            alert("No completed files selected");
            return;
        }

        try {
            const content = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 6 },
            });

            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${folderName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            onComplete?.();
        } catch (err) {
            console.error("Failed to generate zip", err);
            alert("Failed to generate zip file");
        }
    };

    return { downloadSelectedZip };
};
