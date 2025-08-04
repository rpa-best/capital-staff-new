/**
 * Утилита для скачивания blob как файла
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);

    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
};