import JSZip from "jszip";
import { Customer } from "./useReceiverPeer";

export const useZipDownloader = () => {
    const downloadSelectedZip = async (
        customer: Customer,
        selectedFileIds: Set<string>,
        onComplete: () => void
    ) => {
        const zip = new JSZip();
        const folderName = `${customer.label.replace(
            /[^a-z0-9]/gi,
            "_"
        )}_Files`;
        const folder = zip.folder(folderName);

        if (!folder) {
            alert("Failed to create zip folder");
            return;
        }

        let filesAdded = 0;

        customer.files.forEach((file) => {
            if (selectedFileIds.has(file.id) && file.status === "complete") {
                const blob = new Blob(file.chunks, { type: file.meta.type });
                folder.file(file.meta.name, blob);
                filesAdded++;
            }
        });

        if (filesAdded === 0) {
            alert("No completed files selected");
            return;
        }

        try {
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${folderName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            onComplete();
        } catch (err) {
            console.error("Failed to generate zip", err);
            alert("Failed to generate zip file");
        }
    };

    return { downloadSelectedZip };
};
