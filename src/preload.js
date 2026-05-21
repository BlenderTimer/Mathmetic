const { contextBridge, ipcRenderer, shell } = require('electron');
const { execSync } = require("child_process");
import defaultSettings from "/src/settings.js";

contextBridge.exposeInMainWorld('appInfo', {getInfo: () => ipcRenderer.invoke('get-app-info')});
contextBridge.exposeInMainWorld('electron', {openExternal: (url) => shell.openExternal(url)});

// ============================== Settings ==============================
let settings = defaultSettings;

ipcRenderer.invoke("settings:load").then(stored => {
  if (stored) settings = stored;
});

function saveSettings() {
  ipcRenderer.send("settings:save", settings);
}

contextBridge.exposeInMainWorld('settings', {
  setFormatting: (format, value) => {settings["formatting"][format] = value},
  getFormatting: (format) => {return settings["formatting"][format]},
  
  setCalcSys: (value) => {settings["calcSys"] = value},
  getCalcSys: () => {return settings["calcSys"]},

  setTrig: (value) => {settings["trig"] = value},
  getTrig: () => {return settings["trig"]},

  setPrecision: (value) => {settings["precision"] = value; saveSettings()},
  getPrecision: () => {return settings["precision"]},

  setOnTop: (value) => {settings["ontop"] = value},
  getOnTop: () => {return settings["ontop"]},

  setVariablesVisible: (value) => {settings["variablesVisible"] = value; saveSettings()},
  getVariablesVisible: () => {return settings["variablesVisible"]},

  writeVariables: (value) => {settings["variables"] = value},
  getVariables: () => {return settings["variables"]},

  setCalcFormatted: (calc, value) => {settings["calcsFormatted"][calc-1] = value; saveSettings()},
  getCalcFormatted: (calc) => {return settings["calcsFormatted"][calc-1]},

  getSetting: (setting) => {return settings[setting]},
  saveSettings: () => {saveSettings()},
  resetSetting: (setting) => {settings[setting] = defaultSettings[setting]; saveSettings()},
  reset: () => {settings = defaultSettings; saveSettings()}
});

// ============================== History ==============================
let calchistory = [];

ipcRenderer.invoke("calchistory:load").then(stored => {
  if (stored) calchistory = stored;
});

function saveHistory() {
  ipcRenderer.send("calchistory:save", calchistory);
}

contextBridge.exposeInMainWorld('calchistory', {
  add: (formula, fullresult, result, calc, precision, time, date, version, sys) => {
    calchistory.unshift({formula, fullresult, result, calc, precision, time, date, version, sys});
    if (calchistory.length > 100000) {calchistory.shift()};
    saveHistory();
  },
  get: (id) => {return calchistory[id]},
  getHistory: () => {return calchistory},
  prune: (age, length) => {
    const now = Date.now();
    calchistory = calchistory.filter(item => {
      const tooOld = age.enabled && ((now - item.date) / (1000 * 60 * 60 * 24)) > age.value;
      const tooLong = length.enabled && item.fullresult.length > length.value;
      return !(tooOld || tooLong);
    });
    saveHistory();
  },
  abc: () => {calchistory = calchistory.filter((_, i) => i % 2 === 0);saveHistory()},
  save: () => {saveHistory()},
  reset: () => {calchistory = []; saveHistory()}
});

// ============================== mainWindow ==============================

contextBridge.exposeInMainWorld('mainWindow', {
  setAlwaysOnTop: (ontop) => {ipcRenderer.send("mainWindow:ontop", ontop);}
});

// ============================== Device Data ==============================
const os = require("os");
contextBridge.exposeInMainWorld('deviceData', {
  owner: getWindowsFullName()
});

function getWindowsFullName() {
  try {
    const username = os.userInfo().username;
    const command = `(Get-LocalUser -Name '${username}').FullName`;
    const fullName = execSync(`powershell -command "${command}"`, {
      encoding: "utf8"
    }).trim();
    const names = fullName.trim().split(" ")
    return {firstName:names[0] || "",lastName:names[1] ? names.slice(1).join(" ") : "",username:username};
  } catch (err) {
    return "user";
  }
};