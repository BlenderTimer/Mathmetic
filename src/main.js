import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {Menu} from 'electron';
import Store from "electron-store";
import defaultSettings from "/src/settings.js";

const store = new Store();

ipcMain.handle('get-app-info', () => {
  const pkgPath = path.join(app.getAppPath(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  return {
    name: pkg.productName,
    version: pkg.version,
    authorName: pkg.author?.name || pkg.author,
    authorEmail: pkg.author?.email,
    authorUrl: pkg.author?.url
  };
});

// —————————— Stored Data ——————————

// Settings
ipcMain.handle("settings:load", () => {
    return store.get("settings", defaultSettings);
});

ipcMain.on("settings:save", (event, settings) => {
    store.set("settings", settings);
});

ipcMain.on("mainWindow:ontop", (event, ontop) => {
    mainWindow.setAlwaysOnTop(ontop);
});

// History
ipcMain.handle("calchistory:load", () => {
    return store.get("calchistory", []);
});

ipcMain.on("calchistory:save", (event, calchistory) => {
    store.set("calchistory", calchistory);
});

if (started) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  const w = app.isPackaged ? 680:1000;
  mainWindow = new BrowserWindow({
    width: w,
    height: 360,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  if (!app.isPackaged) {mainWindow.webContents.openDevTools()};
};

app.whenReady().then(() => {
  if (app.isPackaged) {Menu.setApplicationMenu(null)};
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});