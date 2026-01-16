export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                // Remove the Data-URI prefix to get raw base64
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

export const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Generate a random 6-character ID
export const generateShortId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
export const printPdf = (blobUrl: string) => {
    // Create a hidden iframe
    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden"; // keep hidden

    // Use <embed> inside the iframe to load PDF
    iframe.srcdoc = `
    <html>
      <body style="margin:0">
        <embed width="100%" height="100%" src="${blobUrl}" type="application/pdf">
      </body>
    </html>
  `;

    document.body.appendChild(iframe);

    iframe.onload = () => {
        // Trigger print on the main window
        window.focus();
        window.print();

        // Remove iframe after a short delay
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    };
};
