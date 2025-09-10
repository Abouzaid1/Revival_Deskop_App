export { };

declare global {
    interface Window {
        electronAPI: {
            showAlert: (msg: string) => void;
            minimize: () => void;
            maximize: () => void;
            close: () => void;
        };
    }
}