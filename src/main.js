import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {Menu} from 'electron';
import Store from "electron-store";
import defaultSettings from "/src/settings.js";
import { create } from 'node:domain';

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

// ============================== Stored Data ==============================

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

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (app.isPackaged) {Menu.setApplicationMenu(null)};
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
