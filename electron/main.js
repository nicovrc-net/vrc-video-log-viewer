import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexHtml = app.isPackaged
    ? `file://${path.join(__dirname, "../dist/index.html")}`
    : "http://localhost:5173/";

  mainWindow.loadURL(indexHtml);

  if (!app.isPackaged) mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ----------------------------
// IPC / window.api 実装
// ----------------------------

ipcMain.handle("load-config", async () => {
  const configPath = path.join(process.cwd(), "config.yml");
  if (!fs.existsSync(configPath)) return { error: "config.yml not found" };
  const content = fs.readFileSync(configPath, "utf8");
  return yaml.load(content);
});

import chokidar from "chokidar";
let watchers = {};

ipcMain.handle("watch-logs", (event, logFolder, filters) => {
  if (watchers[logFolder]) return;

  const watcher = chokidar.watch(logFolder, { persistent: true, ignoreInitial: false });

  watcher.on("add", (filePath) => {
    const text = fs.readFileSync(filePath, "utf8");
    event.sender.send("new-logs", { filePath, text });
  });

  watchers[logFolder] = watcher;
});
