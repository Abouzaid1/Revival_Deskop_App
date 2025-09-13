import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ⚡ Fix: prevent GPU cache errors & set custom userData path
app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
app.setPath("userData", join(__dirname, "userdata"));

let win;
function createWindow() {
    win = new BrowserWindow({
        titleBarStyle: "hidden",
        title: "Revival Electronic Invoices",
        icon: join(__dirname, "../public/favicon.ico"),
        width: 1500,
        show: false,
        height: 800,
        minWidth: 1500,

        minHeight: 800,
        frame: false,
        resizable: true,
        maximizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            devTools: false
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        const indexPath = join(app.getAppPath(), 'dist', 'index.html');
        console.log('Loading index.html from:', indexPath);
        win.loadFile(indexPath);
    }
    win.once("ready-to-show", () => {
        win.show();
    });
}
app.setAsDefaultProtocolClient("revival"); // revival://

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
ipcMain.on("window:minimize", () => {
    if (win) win.minimize();
});

ipcMain.on("window:maximize", () => {
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    }
});

ipcMain.on("window:close", () => {
    if (win) win.close();
});
ipcMain.handle("show-alert", async (_, message) => {
    const win = BrowserWindow.getFocusedWindow();
    await dialog.showMessageBox(win, {
        type: "info",
        buttons: ["حسنا"],
        title: "اشعار",
        message: message,
    });
});