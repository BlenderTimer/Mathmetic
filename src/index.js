import BigNumber from "bignumber.js";
import xSvg from '../img/x.svg';


// —————————— ESCAPE KEY ——————————
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    aboutWindow.removeAttribute('style');
    settingsWindow.removeAttribute('style');
    historyWindow.removeAttribute('style');
    while (historyWindow.children.length > 1) {historyWindow.lastChild.remove()};
    historyLoadedTo = 0;
    historyHeight = 0;
  }
});


// —————————— APPLICATION INFOFORMATION ——————————
let currentVersion = '';
window.appInfo.getInfo().then(info => {
  document.getElementById("info-appname").innerHTML = `<b>App Name:</b> ${info.name}`;
  document.getElementById("info-version").innerHTML = `<b>Version:</b> ${info.version}`;
  currentVersion = info.version;
  document.getElementById("info-company").innerHTML = `<b>Company:</b> ${info.authorName}`;
  document.getElementById("info-website").innerHTML = `<b>Website:</b> <a id="info-website-link" href="${info.authorUrl}">${info.authorUrl}</a>`;
  document.getElementById("info-email").innerHTML = `<b>Email:</b> ${info.authorEmail}`;
  document.getElementById("info-website-link").addEventListener('click', (e) => {const link = e.target.closest('a[href]');if (!link) return;e.preventDefault();window.electron.openExternal(link.href);});
});

// Make all external links open in the default browser
for (const link of document.querySelectorAll('.external-link, .external-link-button')) {
  link.addEventListener('click', (e) => {const link = e.target.closest('a[href]');if (!link) return;e.preventDefault();window.electron.openExternal(link.href);});
}


// —————————— ABOUT WINDOW ——————————
const aboutWindow = document.getElementById('about-window');

// Exit
aboutWindow.children[0].addEventListener('click', function(e) {
  aboutWindow.removeAttribute('style');
});

// Check for updates
document.getElementById("update-btn").addEventListener('click', (e) => {
  let newVersion = "";
  fetch('https://blendertimer.com/software/mathmetic/version.txt').then(res => res.text()).then(text => {
    newVersion = text;
    if (newVersion == currentVersion) {
      document.getElementById("update-result").innerHTML = `<p>You're using the latest version!</p>`;
    }
    else {
      document.getElementById("update-result").innerHTML = `<a href="https://blendertimer.com/software/mathmetic" id="update-link"><b>Update available:</b> ${currentVersion} -> ${newVersion}</a>`;
      document.getElementById("update-link").addEventListener('click', (e) => {const link = e.target.closest('a[href]');if (!link) return;e.preventDefault();window.electron.openExternal(link.href);});
    }
  }).catch(error => {document.getElementById("update-result").innerHTML = `<b style="color: #ff3232">Unable to check for updates. Check your internet connection.</b>`});
});

// Donate
document.getElementById("donate-btn").addEventListener('click', (e) => {
  window.electron.openExternal('https://blendertimer.com/donate?p=Mathmetic+Donation');
});

// Toggle function descriptions in "Syntax, Functions, and Variables"
for (const li of document.getElementsByTagName('li')) {
  li.addEventListener('click', (e) => {
    if (e.currentTarget.style.textWrapMode == 'wrap') {e.currentTarget.removeAttribute('style')}
    else {
      e.currentTarget.style.textWrapMode = "wrap";
    }
  });
}


// —————————— SETTINGS WINDOW ——————————
const settingsWindow = document.getElementById('settings-window');

// Exit
settingsWindow.children[0].addEventListener('click', function(e) {
  settingsWindow.removeAttribute('style');
});

// Calculation system selector
const calcSysCont = document.getElementById('calc-sys');
calcSysCont.children[0].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  calcSysCont.children[1].removeAttribute('style');
  window.settings.setCalcSys('decimal');
  window.settings.saveSettings();
});
calcSysCont.children[1].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  calcSysCont.children[0].removeAttribute('style');
  window.settings.setCalcSys('integer');
  window.settings.saveSettings();
});

// Load calculation system on startup
if (window.settings.getCalcSys() === 'decimal') {calcSysCont.children[0].style.background = "var(--pricol)"}
else {calcSysCont.children[1].style.background = "var(--pricol)"};

// Default trigonometry mode
const trigModeContDef = document.getElementById('trig-mode-def');
trigModeContDef.children[0].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  trigModeContDef.children[1].removeAttribute('style');
  window.settings.setTrig('deg');
  window.settings.saveSettings();
});
trigModeContDef.children[1].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  trigModeContDef.children[0].removeAttribute('style');
  window.settings.setTrig('rad');
  window.settings.saveSettings();
});

// Load default trigonometry mode on startup
if (window.settings.getTrig() === 'deg') {trigModeContDef.children[0].style.background = "var(--pricol)"}
else {trigModeContDef.children[1].style.background = "var(--pricol)"};

// Decimal precision
const decPrecisionContDef = document.getElementById('decimal-precision-def');
decPrecisionContDef.value = window.settings.getPrecision();
decPrecisionContDef.addEventListener('input', function(e) {
  if (decPrecisionContDef.value.toString().length > 0 && decPrecisionContDef.value >= 0) {
    window.settings.setPrecision(parseInt(decPrecisionContDef.value));
    window.settings.saveSettings();
    setPrecision(window.settings.getPrecision());
  }
});

// Decimal separator
const decSepCont = document.getElementById('dec-sep');
decSepCont.value = window.settings.getFormatting('decimal');
decSepCont.addEventListener('input', function(e) {
  if (decSepCont.value.length > 0) {
    window.settings.setFormatting('decimal', decSepCont.value);
    window.settings.saveSettings();
  }
});

// Thousands separator
const thouSepCont = document.getElementById('thou-sep');
thouSepCont.value = window.settings.getFormatting('thousands');
thouSepCont.addEventListener('input', function(e) {
  if (thouSepCont.value.length > 0) {
    window.settings.setFormatting('thousands', thouSepCont.value);
    window.settings.saveSettings();
  }
});

// Window on top by default
const ontopContDef = document.getElementById('ontop-def');
ontopContDef.children[0].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  ontopContDef.children[1].removeAttribute('style');
  window.settings.setOnTop(true);
  window.settings.saveSettings();
});
ontopContDef.children[1].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  ontopContDef.children[0].removeAttribute('style');
  window.settings.setOnTop(false);
  window.settings.saveSettings();
});

// Load on top setting on startup
if (window.settings.getOnTop() === true) {ontopContDef.children[0].style.background = "var(--pricol)"}
else {ontopContDef.children[1].style.background = "var(--pricol)"};


// —————————— HISTORY WINDOW ——————————
let historyLoadedTo = 0;
let historyHeight = 0;
let historySort = 'latest';

const historyWindow = document.getElementById('history-window');

// Exit
const historyList = document.getElementById('history-list');
historyWindow.children[0].children[0].addEventListener('click', function(e) {
  historyWindow.removeAttribute('style');
  while (historyList.children.length > 0) {historyList.lastChild.remove()};
  historyLoadedTo = 0;
  historyHeight = 0;
});

// Refresh history button
historyWindow.children[0].children[1].addEventListener('click', function(e) {refreshHistory()});

// Pruning
historyWindow.children[0].children[3].addEventListener('click', function(e) {pruneControls.style.display = 'flex'});

// Exit pruning
document.getElementById('prune-controls-exit').addEventListener('click', function(e) {pruneControls.removeAttribute('style')});

// Prune controls
const pruneControls = document.getElementById('prune-controls');
const pruneAgeToggle = document.getElementById('prune-age-toggle');
const pruneAge = document.getElementById('prune-age');
pruneAgeToggle.children[0].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  pruneAgeToggle.children[1].removeAttribute('style');
});
pruneAgeToggle.children[1].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  pruneAgeToggle.children[0].removeAttribute('style');
});
pruneAgeToggle.children[1].style.background = "var(--pricol)";

const pruneLengthToggle = document.getElementById('prune-length-toggle');
const pruneLength = document.getElementById('prune-length');
pruneLengthToggle.children[0].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  pruneLengthToggle.children[1].removeAttribute('style');
});
pruneLengthToggle.children[1].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  pruneLengthToggle.children[0].removeAttribute('style');
});
pruneLengthToggle.children[1].style.background = "var(--pricol)";

const pruneButton = document.getElementById('prune-button');
pruneButton.addEventListener('click', () => {pruneHistory()});

function pruneHistory() {
  const ageEnabled = (pruneAgeToggle.children[1].style.background && pruneAgeToggle.children[1].style.background.length > 0) ? true : false;
  const lengthEnabled = (pruneLengthToggle.children[1].style.background && pruneLengthToggle.children[1].style.background.length > 0) ? true : false;
  window.calchistory.prune({enabled:ageEnabled, value:parseInt(pruneAge.value)}, {enabled:lengthEnabled, value:parseInt(pruneLength.value)});
  pruneControls.removeAttribute('style');
  refreshHistory();
}

// History list
function loadHistoryUI() {
  const hist = window.calchistory.getHistory();
  const hl = hist.length;
  for (let i=0; i < hist.length; i++) {hist[i].id = hl-i};
  if (historySort == 'oldest') {hist.sort((a, b) => a.date - b.date)}
  else if (historySort == 'fastest') {hist.sort((a, b) => a.time - b.time)}
  else if (historySort == 'slowest') {hist.sort((a, b) => b.time - a.time)}
  while (historyLoadedTo < hl && historyHeight < ((window.innerHeight * 3) + historyList.scrollTop)) {
    const h = hist[historyLoadedTo];
    const el = document.createElement('div');
    el.className = 'history-entry';
    if (h.sys == 'integer') {
      el.innerHTML = `
<div class="history-entry-general">
  <b>${h.calc}</b>
  <div class="heg-spr"></div>
  <p>Precision: INTEGER</p>
  <div class="heg-spr"></div>
  <p title="${timeString(h.time)}">Calculation time: ${h.time}ms</p>
  <div class="heg-spr"></div>
  <i>ID: ${h.id}</i>
  <div class="heg-spr"></div>
  <i title="${new Date(h.date).toString()}">${new Date(h.date).toISOString().split('T')[0]}</i>
</div>
<input type="text" class="history-entry-formula" value="${h.formula}" readonly>
<input type="text" class="history-entry-result" value="${h.fullresult}" readonly>
<input type="text" class="history-entry-result" value="${h.result}" readonly>`; 
    }
    else {
      el.innerHTML = `
<div class="history-entry-general">
  <b>${h.calc}</b>
  <div class="heg-spr"></div>
  <p>Precision: ${h.precision}</p>
  <div class="heg-spr"></div>
  <p title="${timeString(h.time)}">Calculation time: ${h.time}ms</p>
  <div class="heg-spr"></div>
  <i>ID: ${h.id}</i>
  <div class="heg-spr"></div>
  <i title="${new Date(h.date).toString()}">${new Date(h.date).toISOString().split('T')[0]}</i>
</div>
<input type="text" class="history-entry-formula" value="${h.formula}" readonly>
<input type="text" class="history-entry-result" value="${h.fullresult}" readonly>
<input type="text" class="history-entry-result" value="${h.result}" readonly>`;
    }
    el.style.height = "105px";
    historyList.appendChild(el);
    historyHeight += 105 + 5; // height + margin
    historyLoadedTo++;
  }
}
historyList.addEventListener('scroll', (e) => {loadHistoryUI()});

function timeString(ms) {
  let total = Math.round(ms * 1e4) / 1e4;
  const h = String(Math.floor(total / 3600000)).padStart(2, '0');
  const m = String(Math.floor(total / 60000) % 60).padStart(2, '0');
  total %= 60000;
  const s = Math.floor(total / 1000);
  const sec = (total / 1000).toFixed(4).padStart(7, '0'); // ss.mmmm
  return `${h}:${m}:${sec}`;
};

function refreshHistory() {
  while (historyList.children.length > 0) {historyList.lastChild.remove()};
  historyLoadedTo = 0;
  historyHeight = 0;
  loadHistoryUI();
}

// History sorting
const historySortCont = document.getElementById('history-sort');
historySortCont.children[0].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  historySortCont.children[1].removeAttribute('style');
  historySortCont.children[2].removeAttribute('style');
  historySortCont.children[3].removeAttribute('style');
  historySort = e.target.textContent.toLowerCase();
  refreshHistory();
});
historySortCont.children[1].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  historySortCont.children[0].removeAttribute('style');
  historySortCont.children[2].removeAttribute('style');
  historySortCont.children[3].removeAttribute('style');
  historySort = e.target.textContent.toLowerCase();
  refreshHistory();
});
historySortCont.children[2].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  historySortCont.children[0].removeAttribute('style');
  historySortCont.children[1].removeAttribute('style');
  historySortCont.children[3].removeAttribute('style');
  historySort = e.target.textContent.toLowerCase();
  refreshHistory();
});
historySortCont.children[3].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  historySortCont.children[0].removeAttribute('style');
  historySortCont.children[1].removeAttribute('style');
  historySortCont.children[2].removeAttribute('style');
  historySort = e.target.textContent.toLowerCase();
  refreshHistory();
});
if (historySort === 'latest') {historySortCont.children[0].style.background = "var(--pricol)"}
else if (historySort === 'oldest') {historySortCont.children[1].style.background = "var(--pricol)"}
else if (historySort === 'fastest') {historySortCont.children[2].style.background = "var(--pricol)"}
else if (historySort === 'slowest') {historySortCont.children[3].style.background = "var(--pricol)"};


// —————————— MENUBAR ——————————
// Trigonometry mode
let trigMode = window.settings.getTrig();
const trigModeCont = document.getElementById('trig-mode');
trigModeCont.children[0].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  trigModeCont.children[1].removeAttribute('style');
  trigMode = 'deg';
});
trigModeCont.children[1].addEventListener('click', function(e) {
  e.target.style.background = "var(--pricol)";
  trigModeCont.children[0].removeAttribute('style');
  trigMode = 'rad';
});

// Load trigonometry mode on startup
if (trigMode === 'deg') {trigModeCont.children[0].style.background = "var(--pricol)"}
else {trigModeCont.children[1].style.background = "var(--pricol)"};

// Error display
const errorDisplay = document.getElementById('error-display');

// On top
document.getElementById('ontop-btn').addEventListener('click', function(e) {
  if (e.target.style.background) {window.mainWindow.setAlwaysOnTop(false);e.target.style.background = null}
  else {window.mainWindow.setAlwaysOnTop(true);e.target.style.background = "var(--pricol)"};
});

// Load on top setting on startup
if (window.settings.getOnTop() === true) {
  window.mainWindow.setAlwaysOnTop(true);
  document.getElementById('ontop-btn').style.background = "var(--pricol)";
}

// Additional menu buttons
document.getElementById('history-btn').addEventListener('click', function(e) {
  if (historyWindow.style.display) {historyWindow.removeAttribute('style');while (historyWindow.children.length > 1) {historyWindow.lastChild.remove()};historyLoadedTo = 0;historyHeight = 0;}
  else {loadHistoryUI();historyWindow.style.display = "block"};
});

document.getElementById('settings-btn').addEventListener('click', function(e) {
  if (settingsWindow.style.display) {settingsWindow.removeAttribute('style')}
  else {settingsWindow.style.display = "block"};
});

document.getElementById('about-btn').addEventListener('click', function(e) {
  if (aboutWindow.style.display) {aboutWindow.removeAttribute('style')}
  else {aboutWindow.style.display = "block"};
});


// —————————— VARIABLES ——————————
const variableList = document.getElementById('variable-list');

// Hide/exit variables
const hideVariables = document.getElementById('hide-variables');
hideVariables.addEventListener('click', function (e) {
  if (window.settings.getVariablesVisible() === true) {
    window.settings.setVariablesVisible(false);
    varVis(false);
  }
  else {
    window.settings.setVariablesVisible(true);
    varVis(true);
  }
});

function varVis(visible) {
  if (visible == false) {
    hideVariables.style.background = "var(--wincol)";
    hideVariables.style.width = "12px";
    hideVariables.style.height = "auto";
    hideVariables.style.top = "0px";
    hideVariables.style.bottom = "0px";
    hideVariables.style.right = "-12px";
    hideVariables.style.borderRadius = "0px";
    hideVariables.title = "Show variable list";
    hideVariables.children[0].style.display = "none";
    variableList.style.display = "none";
    variableList.parentNode.children[0].style.display = "none";
    variableList.parentNode.children[3].style.display = "none";
    variableList.parentNode.style.left = "-5px";
    variableList.parentNode.style.marginRight = "5px";
    variableList.parentNode.parentNode.style.gridTemplateColumns = "5px auto";
  }
  else {
    hideVariables.removeAttribute('style');
    hideVariables.title = "Hide variable list";
    hideVariables.children[0].removeAttribute('style');
    variableList.removeAttribute('style');
    variableList.parentNode.children[0].removeAttribute('style');
    variableList.parentNode.children[3].removeAttribute('style');
    variableList.parentNode.removeAttribute('style');
    variableList.parentNode.parentNode.removeAttribute('style');
  }
}

// Create new variable
document.getElementById('new-variable').addEventListener('click', function() {newVariable()});

function newVariable(name = '', value = '') {
  const item = document.createElement('div');
  item.className = "variable";
  const input1 = document.createElement('input');
  input1.className = "var-name";
  input1.type = "text";
  input1.placeholder = "name";
  input1.title = name;
  input1.value = name;
  input1.addEventListener('input', function(e) {
    const el = e.target;
    if (el.parentNode.children[0].value.length > 0) {
      el.parentNode.children[0].removeAttribute('style');
      clearError();
      _defaultCalc.removeVariable(el.parentNode.children[0].title);
      let er = _defaultCalc.setVariable(el.parentNode.children[0].value, el.parentNode.children[1].value);
      if (er) {
        el.parentNode.children[0].style.borderBottom = "2px solid #ff3737";
        el.parentNode.children[0].style.color = "#ff3737";
        writeError(null, er);
        updateVariables();
      }
      else {
        el.parentNode.children[0].title = el.parentNode.children[0].value;
        updateVariables();
      }
    }
  })
  const input2 = document.createElement('input');
  input2.className = "var-value";
  input2.type = "text";
  input2.placeholder = "value";
  input2.value = value;
  input2.addEventListener('input', function(e) {
    const el = e.target;
    if (!(Object.keys(_defaultVariables).includes(el.parentNode.children[0].value)) && el.parentNode.children[1].value.length > 0 && el.parentNode.children[0].value.length > 0) {
      _defaultCalc.setVariable(el.parentNode.children[0].value, el.parentNode.children[1].value);
      updateVariables();
    }
  })
  const img = document.createElement('img');
  img.src = xSvg;
  img.alt = "Delete";
  img.title = "Delete variable";
  img.addEventListener('click', function(e) {
    const el = e.target;
    if (!(Object.keys(_defaultVariables).includes(el.parentNode.children[0].title))) {_defaultCalc.removeVariable(el.parentNode.children[0].title);updateVariables()};
    el.parentNode.remove();
  })
  item.appendChild(input1);
  item.appendChild(input2);
  item.appendChild(img);
  variableList.appendChild(item);
}

function updateVariables() {
  let vars = _defaultCalc.getVariables();
  let varKeys = Object.keys(vars);
  let newVars = {};
  for (let i=0; i < varKeys.length; i++) {
    if (!(Object.keys(_defaultVariables).includes(varKeys[i])) && !(['calc1', 'calc2', 'calc3', 'calc4', 'calc5', 'calc6'].includes(varKeys[i]))) {newVars[varKeys[i]] = vars[varKeys[i]]};
  }
  window.settings.writeVariables(newVars);
  window.settings.saveSettings();
}

function refreshVariables() {
  let vars = _defaultCalc.getVariables();
  let varKeys = Object.keys(vars);
  for (let i=0; i < varKeys.length; i++) {
    if (!(Object.keys(_defaultVariables).includes(varKeys[i])) && !(['calc1', 'calc2', 'calc3', 'calc4', 'calc5', 'calc6'].includes(varKeys[i]))) {newVariable(varKeys[i], vars[varKeys[i]])};
  }
}


// —————————— CALCULATORS ——————————
function clamp(value, min, max) {return Math.max(min, Math.min(max, value))};


// —————————— CALCULATOR 1 ——————————
const calc1 = document.getElementById('calculator1');
const calc1Formula = document.getElementById('calc1-formula');
const calc1FullResult = document.getElementById('calc1-fullresult');
const calc1Result = document.getElementById('calc1-result');
calc1.addEventListener('input', function(e) {formulaInput(e, 'calc1')});
calc1.children[1].addEventListener('click', function(e) {navigator.clipboard.writeText('calc1')});
calc1.children[3].addEventListener('click', function(e) {navigator.clipboard.writeText(calc1FullResult.value)});
calc1.children[5].addEventListener('click', function(e) {
  if (e.target.style.background) {e.target.removeAttribute('style');window.settings.setCalcFormatted(1, false)}
  else {e.target.style.background = "var(--pricol)";window.settings.setCalcFormatted(1, true)}
  formulaInput(e.target.parentNode.children[0], 'calc1');
});
let calc1LastCalc = {formula:"", fullresult:"", result:"", calc:"calc1", precision:20, time:0, date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:true};

// calc1Formula Scrolling
let calc1FormulaScroll = 0;
let calc1FormulaBlurring = false;
let calc1FormulaTargetScroll = 0;
let calc1FormulaScrolling = false;
calc1Formula.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc1FormulaTargetScroll = calc1Formula.scrollWidth - calc1Formula.clientWidth;if (!calc1FormulaScrolling) {calc1FormulaScrolling = true; requestAnimationFrame(calc1FormulaAnimateScroll)}}
  else if (e.key == 'Home') {calc1FormulaTargetScroll = 0;if (!calc1FormulaScrolling) {calc1FormulaScrolling = true; requestAnimationFrame(calc1FormulaAnimateScroll)}};
});
calc1Formula.addEventListener('scroll', (e) => {if (calc1FormulaBlurring == false) {calc1FormulaScroll = e.target.scrollLeft}});
calc1Formula.addEventListener('blur', (e) => {calc1FormulaBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc1FormulaScroll;calc1FormulaBlurring = false})});
calc1Formula.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc1FormulaTargetScroll += e.deltaY;
  calc1FormulaTargetScroll = clamp(calc1FormulaTargetScroll, 0, maxScroll);
  if (!calc1FormulaScrolling) {calc1FormulaScrolling = true; requestAnimationFrame(calc1FormulaAnimateScroll)}
}, { passive: false });
function calc1FormulaAnimateScroll() {
  const current = calc1Formula.scrollLeft;
  const diff = calc1FormulaTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc1FormulaScroll += step;
  calc1Formula.scrollLeft = calc1FormulaScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc1FormulaAnimateScroll)}
  else {calc1Formula.scrollLeft = calc1FormulaTargetScroll;calc1FormulaScrolling = false};
}

// calc1FullResult Scrolling
let calc1FullResultScroll = 0;
let calc1FullResultBlurring = false;
let calc1FullResultTargetScroll = 0;
let calc1FullResultScrolling = false;
calc1FullResult.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc1FullResultTargetScroll = calc1FullResult.scrollWidth - calc1FullResult.clientWidth;if (!calc1FullResultScrolling) {calc1FullResultScrolling = true; requestAnimationFrame(calc1FullResultAnimateScroll)}}
  else if (e.key == 'Home') {calc1FullResultTargetScroll = 0;if (!calc1FullResultScrolling) {calc1FullResultScrolling = true; requestAnimationFrame(calc1FullResultAnimateScroll)}};
});
calc1FullResult.addEventListener('scroll', (e) => {if (calc1FullResultBlurring == false) {calc1FullResultScroll = e.target.scrollLeft}});
calc1FullResult.addEventListener('blur', (e) => {calc1FullResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc1FullResultScroll;calc1FullResultBlurring = false})});
calc1FullResult.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc1FullResultTargetScroll += e.deltaY;
  calc1FullResultTargetScroll = clamp(calc1FullResultTargetScroll, 0, maxScroll);
  if (!calc1FullResultScrolling) {calc1FullResultScrolling = true; requestAnimationFrame(calc1FullResultAnimateScroll)}
}, { passive: false });
function calc1FullResultAnimateScroll() {
  const current = calc1FullResult.scrollLeft;
  const diff = calc1FullResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc1FullResultScroll += step;
  calc1FullResult.scrollLeft = calc1FullResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc1FullResultAnimateScroll)}
  else {calc1FullResult.scrollLeft = calc1FullResultTargetScroll;calc1FullResultScrolling = false};
}

// calc1Result Scrolling
let calc1ResultScroll = 0;
let calc1ResultBlurring = false;
let calc1ResultTargetScroll = 0;
let calc1ResultScrolling = false;
calc1Result.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc1ResultTargetScroll = calc1Result.scrollWidth - calc1Result.clientWidth;if (!calc1ResultScrolling) {calc1ResultScrolling = true; requestAnimationFrame(calc1ResultAnimateScroll)}}
  else if (e.key == 'Home') {calc1ResultTargetScroll = 0;if (!calc1ResultScrolling) {calc1ResultScrolling = true; requestAnimationFrame(calc1ResultAnimateScroll)}};
});
calc1Result.addEventListener('scroll', (e) => {if (calc1ResultBlurring == false) {calc1ResultScroll = e.target.scrollLeft}});
calc1Result.addEventListener('blur', (e) => {calc1ResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc1ResultScroll;calc1ResultBlurring = false})});
calc1Result.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc1ResultTargetScroll += e.deltaY;
  calc1ResultTargetScroll = clamp(calc1ResultTargetScroll, 0, maxScroll);
  if (!calc1ResultScrolling) {calc1ResultScrolling = true; requestAnimationFrame(calc1ResultAnimateScroll)}
}, { passive: false });
function calc1ResultAnimateScroll() {
  const current = calc1Result.scrollLeft;
  const diff = calc1ResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc1ResultScroll += step;
  calc1Result.scrollLeft = calc1ResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc1ResultAnimateScroll)}
  else {calc1Result.scrollLeft = calc1ResultTargetScroll;calc1ResultScrolling = false};
}


// —————————— CALCULATOR 2 ——————————
const calc2 = document.getElementById('calculator2');
const calc2Formula = document.getElementById('calc2-formula');
const calc2FullResult = document.getElementById('calc2-fullresult');
const calc2Result = document.getElementById('calc2-result');
calc2.addEventListener('input', function(e) {formulaInput(e, 'calc2')});
calc2.children[1].addEventListener('click', function(e) {navigator.clipboard.writeText('calc2')});
calc2.children[3].addEventListener('click', function(e) {navigator.clipboard.writeText(calc2FullResult.value)});
calc2.children[5].addEventListener('click', function(e) {
  if (e.target.style.background) {e.target.removeAttribute('style');window.settings.setCalcFormatted(2, false)}
  else {e.target.style.background = "var(--pricol)";window.settings.setCalcFormatted(2, true)}
  formulaInput(e.target.parentNode.children[0], 'calc2');
});
let calc2LastCalc = {formula:"", fullresult:"", result:"", calc:"calc2", precision:20, time:0, date:Date.now(), sys:window.settings.getCalcSys(), logged:true};

// calc2Formula Scrolling
let calc2FormulaScroll = 0;
let calc2FormulaBlurring = false;
let calc2FormulaTargetScroll = 0;
let calc2FormulaScrolling = false;
calc2Formula.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc2FormulaTargetScroll = calc2Formula.scrollWidth - calc2Formula.clientWidth;if (!calc2FormulaScrolling) {calc2FormulaScrolling = true; requestAnimationFrame(calc2FormulaAnimateScroll)}}
  else if (e.key == 'Home') {calc2FormulaTargetScroll = 0;if (!calc2FormulaScrolling) {calc2FormulaScrolling = true; requestAnimationFrame(calc2FormulaAnimateScroll)}};
});
calc2Formula.addEventListener('scroll', (e) => {if (calc2FormulaBlurring == false) {calc2FormulaScroll = e.target.scrollLeft}});
calc2Formula.addEventListener('blur', (e) => {calc2FormulaBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc2FormulaScroll;calc2FormulaBlurring = false})});
calc2Formula.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc2FormulaTargetScroll += e.deltaY;
  calc2FormulaTargetScroll = clamp(calc2FormulaTargetScroll, 0, maxScroll);
  if (!calc2FormulaScrolling) {calc2FormulaScrolling = true; requestAnimationFrame(calc2FormulaAnimateScroll)}
}, { passive: false });
function calc2FormulaAnimateScroll() {
  const current = calc2Formula.scrollLeft;
  const diff = calc2FormulaTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc2FormulaScroll += step;
  calc2Formula.scrollLeft = calc2FormulaScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc2FormulaAnimateScroll)}
  else {calc2Formula.scrollLeft = calc2FormulaTargetScroll;calc2FormulaScrolling = false};
}

// calc2FullResult Scrolling
let calc2FullResultScroll = 0;
let calc2FullResultBlurring = false;
let calc2FullResultTargetScroll = 0;
let calc2FullResultScrolling = false;
calc2FullResult.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc2FullResultTargetScroll = calc2FullResult.scrollWidth - calc2FullResult.clientWidth;if (!calc2FullResultScrolling) {calc2FullResultScrolling = true; requestAnimationFrame(calc2FullResultAnimateScroll)}}
  else if (e.key == 'Home') {calc2FullResultTargetScroll = 0;if (!calc2FullResultScrolling) {calc2FullResultScrolling = true; requestAnimationFrame(calc2FullResultAnimateScroll)}};
});
calc2FullResult.addEventListener('scroll', (e) => {if (calc2FullResultBlurring == false) {calc2FullResultScroll = e.target.scrollLeft}});
calc2FullResult.addEventListener('blur', (e) => {calc2FullResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc2FullResultScroll;calc2FullResultBlurring = false})});
calc2FullResult.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc2FullResultTargetScroll += e.deltaY;
  calc2FullResultTargetScroll = clamp(calc2FullResultTargetScroll, 0, maxScroll);
  if (!calc2FullResultScrolling) {calc2FullResultScrolling = true; requestAnimationFrame(calc2FullResultAnimateScroll)}
}, { passive: false });
function calc2FullResultAnimateScroll() {
  const current = calc2FullResult.scrollLeft;
  const diff = calc2FullResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc2FullResultScroll += step;
  calc2FullResult.scrollLeft = calc2FullResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc2FullResultAnimateScroll)}
  else {calc2FullResult.scrollLeft = calc2FullResultTargetScroll;calc2FullResultScrolling = false};
}

// calc2Result Scrolling
let calc2ResultScroll = 0;
let calc2ResultBlurring = false;
let calc2ResultTargetScroll = 0;
let calc2ResultScrolling = false;
calc2Result.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc2ResultTargetScroll = calc2Result.scrollWidth - calc2Result.clientWidth;if (!calc2ResultScrolling) {calc2ResultScrolling = true; requestAnimationFrame(calc2ResultAnimateScroll)}}
  else if (e.key == 'Home') {calc2ResultTargetScroll = 0;if (!calc2ResultScrolling) {calc2ResultScrolling = true; requestAnimationFrame(calc2ResultAnimateScroll)}};
});
calc2Result.addEventListener('scroll', (e) => {if (calc2ResultBlurring == false) {calc2ResultScroll = e.target.scrollLeft}});
calc2Result.addEventListener('blur', (e) => {calc2ResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc2ResultScroll;calc2ResultBlurring = false})});
calc2Result.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc2ResultTargetScroll += e.deltaY;
  calc2ResultTargetScroll = clamp(calc2ResultTargetScroll, 0, maxScroll);
  if (!calc2ResultScrolling) {calc2ResultScrolling = true; requestAnimationFrame(calc2ResultAnimateScroll)}
}, { passive: false });
function calc2ResultAnimateScroll() {
  const current = calc2Result.scrollLeft;
  const diff = calc2ResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc2ResultScroll += step;
  calc2Result.scrollLeft = calc2ResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc2ResultAnimateScroll)}
  else {calc2Result.scrollLeft = calc2ResultTargetScroll;calc2ResultScrolling = false};
}


// —————————— CALCULATOR 3 ——————————
const calc3 = document.getElementById('calculator3');
const calc3Formula = document.getElementById('calc3-formula');
const calc3FullResult = document.getElementById('calc3-fullresult');
const calc3Result = document.getElementById('calc3-result');
calc3.addEventListener('input', function(e) {formulaInput(e, 'calc3')});
calc3.children[1].addEventListener('click', function(e) {navigator.clipboard.writeText('calc3')});
calc3.children[3].addEventListener('click', function(e) {navigator.clipboard.writeText(calc3FullResult.value)});
calc3.children[5].addEventListener('click', function(e) {
  if (e.target.style.background) {e.target.removeAttribute('style');window.settings.setCalcFormatted(3, false)}
  else {e.target.style.background = "var(--pricol)";window.settings.setCalcFormatted(3, true)}
  formulaInput(e.target.parentNode.children[0], 'calc3');
});
let calc3LastCalc = {formula:"", fullresult:"", result:"", calc:"calc3", precision:20, time:0, date:Date.now(), sys:window.settings.getCalcSys(), logged:true};

// calc3Formula Scrolling
let calc3FormulaScroll = 0;
let calc3FormulaBlurring = false;
let calc3FormulaTargetScroll = 0;
let calc3FormulaScrolling = false;
calc3Formula.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc3FormulaTargetScroll = calc3Formula.scrollWidth - calc3Formula.clientWidth;if (!calc3FormulaScrolling) {calc3FormulaScrolling = true; requestAnimationFrame(calc3FormulaAnimateScroll)}}
  else if (e.key == 'Home') {calc3FormulaTargetScroll = 0;if (!calc3FormulaScrolling) {calc3FormulaScrolling = true; requestAnimationFrame(calc3FormulaAnimateScroll)}};
});
calc3Formula.addEventListener('scroll', (e) => {if (calc3FormulaBlurring == false) {calc3FormulaScroll = e.target.scrollLeft}});
calc3Formula.addEventListener('blur', (e) => {calc3FormulaBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc3FormulaScroll;calc3FormulaBlurring = false})});
calc3Formula.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc3FormulaTargetScroll += e.deltaY;
  calc3FormulaTargetScroll = clamp(calc3FormulaTargetScroll, 0, maxScroll);
  if (!calc3FormulaScrolling) {calc3FormulaScrolling = true; requestAnimationFrame(calc3FormulaAnimateScroll)}
}, { passive: false });
function calc3FormulaAnimateScroll() {
  const current = calc3Formula.scrollLeft;
  const diff = calc3FormulaTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc3FormulaScroll += step;
  calc3Formula.scrollLeft = calc3FormulaScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc3FormulaAnimateScroll)}
  else {calc3Formula.scrollLeft = calc3FormulaTargetScroll;calc3FormulaScrolling = false};
}

// calc3FullResult Scrolling
let calc3FullResultScroll = 0;
let calc3FullResultBlurring = false;
let calc3FullResultTargetScroll = 0;
let calc3FullResultScrolling = false;
calc3FullResult.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc3FullResultTargetScroll = calc3FullResult.scrollWidth - calc3FullResult.clientWidth;if (!calc3FullResultScrolling) {calc3FullResultScrolling = true; requestAnimationFrame(calc3FullResultAnimateScroll)}}
  else if (e.key == 'Home') {calc3FullResultTargetScroll = 0;if (!calc3FullResultScrolling) {calc3FullResultScrolling = true; requestAnimationFrame(calc3FullResultAnimateScroll)}};
});
calc3FullResult.addEventListener('scroll', (e) => {if (calc3FullResultBlurring == false) {calc3FullResultScroll = e.target.scrollLeft}});
calc3FullResult.addEventListener('blur', (e) => {calc3FullResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc3FullResultScroll;calc3FullResultBlurring = false})});
calc3FullResult.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc3FullResultTargetScroll += e.deltaY;
  calc3FullResultTargetScroll = clamp(calc3FullResultTargetScroll, 0, maxScroll);
  if (!calc3FullResultScrolling) {calc3FullResultScrolling = true; requestAnimationFrame(calc3FullResultAnimateScroll)}
}, { passive: false });
function calc3FullResultAnimateScroll() {
  const current = calc3FullResult.scrollLeft;
  const diff = calc3FullResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc3FullResultScroll += step;
  calc3FullResult.scrollLeft = calc3FullResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc3FullResultAnimateScroll)}
  else {calc3FullResult.scrollLeft = calc3FullResultTargetScroll;calc3FullResultScrolling = false};
}

// calc3Result Scrolling
let calc3ResultScroll = 0;
let calc3ResultBlurring = false;
let calc3ResultTargetScroll = 0;
let calc3ResultScrolling = false;
calc3Result.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc3ResultTargetScroll = calc3Result.scrollWidth - calc3Result.clientWidth;if (!calc3ResultScrolling) {calc3ResultScrolling = true; requestAnimationFrame(calc3ResultAnimateScroll)}}
  else if (e.key == 'Home') {calc3ResultTargetScroll = 0;if (!calc3ResultScrolling) {calc3ResultScrolling = true; requestAnimationFrame(calc3ResultAnimateScroll)}};
});
calc3Result.addEventListener('scroll', (e) => {if (calc3ResultBlurring == false) {calc3ResultScroll = e.target.scrollLeft}});
calc3Result.addEventListener('blur', (e) => {calc3ResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc3ResultScroll;calc3ResultBlurring = false})});
calc3Result.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc3ResultTargetScroll += e.deltaY;
  calc3ResultTargetScroll = clamp(calc3ResultTargetScroll, 0, maxScroll);
  if (!calc3ResultScrolling) {calc3ResultScrolling = true; requestAnimationFrame(calc3ResultAnimateScroll)}
}, { passive: false });
function calc3ResultAnimateScroll() {
  const current = calc3Result.scrollLeft;
  const diff = calc3ResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc3ResultScroll += step;
  calc3Result.scrollLeft = calc3ResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc3ResultAnimateScroll)}
  else {calc3Result.scrollLeft = calc3ResultTargetScroll;calc3ResultScrolling = false};
}


// —————————— CALCULATOR 4 ——————————
const calc4 = document.getElementById('calculator4');
const calc4Formula = document.getElementById('calc4-formula');
const calc4FullResult = document.getElementById('calc4-fullresult');
const calc4Result = document.getElementById('calc4-result');
calc4.addEventListener('input', function(e) {formulaInput(e, 'calc4')});
calc4.children[1].addEventListener('click', function(e) {navigator.clipboard.writeText('calc4')});
calc4.children[3].addEventListener('click', function(e) {navigator.clipboard.writeText(calc4FullResult.value)});
calc4.children[5].addEventListener('click', function(e) {
  if (e.target.style.background) {e.target.removeAttribute('style');window.settings.setCalcFormatted(4, false)}
  else {e.target.style.background = "var(--pricol)";window.settings.setCalcFormatted(4, true)}
  formulaInput(e.target.parentNode.children[0], 'calc4');
});
let calc4LastCalc = {formula:"", fullresult:"", result:"", calc:"calc4", precision:20, time:0, date:Date.now(), sys:window.settings.getCalcSys(), logged:true};

// calc4Formula Scrolling
let calc4FormulaScroll = 0;
let calc4FormulaBlurring = false;
let calc4FormulaTargetScroll = 0;
let calc4FormulaScrolling = false;
calc4Formula.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc4FormulaTargetScroll = calc4Formula.scrollWidth - calc4Formula.clientWidth;if (!calc4FormulaScrolling) {calc4FormulaScrolling = true; requestAnimationFrame(calc4FormulaAnimateScroll)}}
  else if (e.key == 'Home') {calc4FormulaTargetScroll = 0;if (!calc4FormulaScrolling) {calc4FormulaScrolling = true; requestAnimationFrame(calc4FormulaAnimateScroll)}};
});
calc4Formula.addEventListener('scroll', (e) => {if (calc4FormulaBlurring == false) {calc4FormulaScroll = e.target.scrollLeft}});
calc4Formula.addEventListener('blur', (e) => {calc4FormulaBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc4FormulaScroll;calc4FormulaBlurring = false})});
calc4Formula.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc4FormulaTargetScroll += e.deltaY;
  calc4FormulaTargetScroll = clamp(calc4FormulaTargetScroll, 0, maxScroll);
  if (!calc4FormulaScrolling) {calc4FormulaScrolling = true; requestAnimationFrame(calc4FormulaAnimateScroll)}
}, { passive: false });
function calc4FormulaAnimateScroll() {
  const current = calc4Formula.scrollLeft;
  const diff = calc4FormulaTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc4FormulaScroll += step;
  calc4Formula.scrollLeft = calc4FormulaScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc4FormulaAnimateScroll)}
  else {calc4Formula.scrollLeft = calc4FormulaTargetScroll;calc4FormulaScrolling = false};
}

// calc4FullResult Scrolling
let calc4FullResultScroll = 0;
let calc4FullResultBlurring = false;
let calc4FullResultTargetScroll = 0;
let calc4FullResultScrolling = false;
calc4FullResult.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc4FullResultTargetScroll = calc4FullResult.scrollWidth - calc4FullResult.clientWidth;if (!calc4FullResultScrolling) {calc4FullResultScrolling = true; requestAnimationFrame(calc4FullResultAnimateScroll)}}
  else if (e.key == 'Home') {calc4FullResultTargetScroll = 0;if (!calc4FullResultScrolling) {calc4FullResultScrolling = true; requestAnimationFrame(calc4FullResultAnimateScroll)}};
});
calc4FullResult.addEventListener('scroll', (e) => {if (calc4FullResultBlurring == false) {calc4FullResultScroll = e.target.scrollLeft}});
calc4FullResult.addEventListener('blur', (e) => {calc4FullResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc4FullResultScroll;calc4FullResultBlurring = false})});
calc4FullResult.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc4FullResultTargetScroll += e.deltaY;
  calc4FullResultTargetScroll = clamp(calc4FullResultTargetScroll, 0, maxScroll);
  if (!calc4FullResultScrolling) {calc4FullResultScrolling = true; requestAnimationFrame(calc4FullResultAnimateScroll)}
}, { passive: false });
function calc4FullResultAnimateScroll() {
  const current = calc4FullResult.scrollLeft;
  const diff = calc4FullResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc4FullResultScroll += step;
  calc4FullResult.scrollLeft = calc4FullResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc4FullResultAnimateScroll)}
  else {calc4FullResult.scrollLeft = calc4FullResultTargetScroll;calc4FullResultScrolling = false};
}

// calc4Result Scrolling
let calc4ResultScroll = 0;
let calc4ResultBlurring = false;
let calc4ResultTargetScroll = 0;
let calc4ResultScrolling = false;
calc4Result.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc4ResultTargetScroll = calc4Result.scrollWidth - calc4Result.clientWidth;if (!calc4ResultScrolling) {calc4ResultScrolling = true; requestAnimationFrame(calc4ResultAnimateScroll)}}
  else if (e.key == 'Home') {calc4ResultTargetScroll = 0;if (!calc4ResultScrolling) {calc4ResultScrolling = true; requestAnimationFrame(calc4ResultAnimateScroll)}};
});
calc4Result.addEventListener('scroll', (e) => {if (calc4ResultBlurring == false) {calc4ResultScroll = e.target.scrollLeft}});
calc4Result.addEventListener('blur', (e) => {calc4ResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc4ResultScroll;calc4ResultBlurring = false})});
calc4Result.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc4ResultTargetScroll += e.deltaY;
  calc4ResultTargetScroll = clamp(calc4ResultTargetScroll, 0, maxScroll);
  if (!calc4ResultScrolling) {calc4ResultScrolling = true; requestAnimationFrame(calc4ResultAnimateScroll)}
}, { passive: false });
function calc4ResultAnimateScroll() {
  const current = calc4Result.scrollLeft;
  const diff = calc4ResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc4ResultScroll += step;
  calc4Result.scrollLeft = calc4ResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc4ResultAnimateScroll)}
  else {calc4Result.scrollLeft = calc4ResultTargetScroll;calc4ResultScrolling = false};
}


// —————————— CALCULATOR 5 ——————————
const calc5 = document.getElementById('calculator5');
const calc5Formula = document.getElementById('calc5-formula');
const calc5FullResult = document.getElementById('calc5-fullresult');
const calc5Result = document.getElementById('calc5-result');
calc5.addEventListener('input', function(e) {formulaInput(e, 'calc5')});
calc5.children[1].addEventListener('click', function(e) {navigator.clipboard.writeText('calc5')});
calc5.children[3].addEventListener('click', function(e) {navigator.clipboard.writeText(calc5FullResult.value)});
calc5.children[5].addEventListener('click', function(e) {
  if (e.target.style.background) {e.target.removeAttribute('style');window.settings.setCalcFormatted(5, false)}
  else {e.target.style.background = "var(--pricol)";window.settings.setCalcFormatted(5, true)}
  formulaInput(e.target.parentNode.children[0], 'calc5');
});
let calc5LastCalc = {formula:"", fullresult:"", result:"", calc:"calc5", precision:20, time:0, date:Date.now(), sys:window.settings.getCalcSys(), logged:true};

// calc5Formula Scrolling
let calc5FormulaScroll = 0;
let calc5FormulaBlurring = false;
let calc5FormulaTargetScroll = 0;
let calc5FormulaScrolling = false;
calc5Formula.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc5FormulaTargetScroll = calc5Formula.scrollWidth - calc5Formula.clientWidth;if (!calc5FormulaScrolling) {calc5FormulaScrolling = true; requestAnimationFrame(calc5FormulaAnimateScroll)}}
  else if (e.key == 'Home') {calc5FormulaTargetScroll = 0;if (!calc5FormulaScrolling) {calc5FormulaScrolling = true; requestAnimationFrame(calc5FormulaAnimateScroll)}};
});
calc5Formula.addEventListener('scroll', (e) => {if (calc5FormulaBlurring == false) {calc5FormulaScroll = e.target.scrollLeft}});
calc5Formula.addEventListener('blur', (e) => {calc5FormulaBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc5FormulaScroll;calc5FormulaBlurring = false})});
calc5Formula.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc5FormulaTargetScroll += e.deltaY;
  calc5FormulaTargetScroll = clamp(calc5FormulaTargetScroll, 0, maxScroll);
  if (!calc5FormulaScrolling) {calc5FormulaScrolling = true; requestAnimationFrame(calc5FormulaAnimateScroll)}
}, { passive: false });
function calc5FormulaAnimateScroll() {
  const current = calc5Formula.scrollLeft;
  const diff = calc5FormulaTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc5FormulaScroll += step;
  calc5Formula.scrollLeft = calc5FormulaScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc5FormulaAnimateScroll)}
  else {calc5Formula.scrollLeft = calc5FormulaTargetScroll;calc5FormulaScrolling = false};
}

// calc5FullResult Scrolling
let calc5FullResultScroll = 0;
let calc5FullResultBlurring = false;
let calc5FullResultTargetScroll = 0;
let calc5FullResultScrolling = false;
calc5FullResult.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc5FullResultTargetScroll = calc5FullResult.scrollWidth - calc5FullResult.clientWidth;if (!calc5FullResultScrolling) {calc5FullResultScrolling = true; requestAnimationFrame(calc5FullResultAnimateScroll)}}
  else if (e.key == 'Home') {calc5FullResultTargetScroll = 0;if (!calc5FullResultScrolling) {calc5FullResultScrolling = true; requestAnimationFrame(calc5FullResultAnimateScroll)}};
});
calc5FullResult.addEventListener('scroll', (e) => {if (calc5FullResultBlurring == false) {calc5FullResultScroll = e.target.scrollLeft}});
calc5FullResult.addEventListener('blur', (e) => {calc5FullResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc5FullResultScroll;calc5FullResultBlurring = false})});
calc5FullResult.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc5FullResultTargetScroll += e.deltaY;
  calc5FullResultTargetScroll = clamp(calc5FullResultTargetScroll, 0, maxScroll);
  if (!calc5FullResultScrolling) {calc5FullResultScrolling = true; requestAnimationFrame(calc5FullResultAnimateScroll)}
}, { passive: false });
function calc5FullResultAnimateScroll() {
  const current = calc5FullResult.scrollLeft;
  const diff = calc5FullResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc5FullResultScroll += step;
  calc5FullResult.scrollLeft = calc5FullResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc5FullResultAnimateScroll)}
  else {calc5FullResult.scrollLeft = calc5FullResultTargetScroll;calc5FullResultScrolling = false};
}

// calc5Result Scrolling
let calc5ResultScroll = 0;
let calc5ResultBlurring = false;
let calc5ResultTargetScroll = 0;
let calc5ResultScrolling = false;
calc5Result.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc5ResultTargetScroll = calc5Result.scrollWidth - calc5Result.clientWidth;if (!calc5ResultScrolling) {calc5ResultScrolling = true; requestAnimationFrame(calc5ResultAnimateScroll)}}
  else if (e.key == 'Home') {calc5ResultTargetScroll = 0;if (!calc5ResultScrolling) {calc5ResultScrolling = true; requestAnimationFrame(calc5ResultAnimateScroll)}};
});
calc5Result.addEventListener('scroll', (e) => {if (calc5ResultBlurring == false) {calc5ResultScroll = e.target.scrollLeft}});
calc5Result.addEventListener('blur', (e) => {calc5ResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc5ResultScroll;calc5ResultBlurring = false})});
calc5Result.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc5ResultTargetScroll += e.deltaY;
  calc5ResultTargetScroll = clamp(calc5ResultTargetScroll, 0, maxScroll);
  if (!calc5ResultScrolling) {calc5ResultScrolling = true; requestAnimationFrame(calc5ResultAnimateScroll)}
}, { passive: false });
function calc5ResultAnimateScroll() {
  const current = calc5Result.scrollLeft;
  const diff = calc5ResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc5ResultScroll += step;
  calc5Result.scrollLeft = calc5ResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc5ResultAnimateScroll)}
  else {calc5Result.scrollLeft = calc5ResultTargetScroll;calc5ResultScrolling = false};
}


// —————————— CALCULATOR 6 ——————————
const calc6 = document.getElementById('calculator6');
const calc6Formula = document.getElementById('calc6-formula');
const calc6FullResult = document.getElementById('calc6-fullresult');
const calc6Result = document.getElementById('calc6-result');
calc6.addEventListener('input', function(e) {formulaInput(e, 'calc6')});
calc6.children[1].addEventListener('click', function(e) {navigator.clipboard.writeText('calc6')});
calc6.children[3].addEventListener('click', function(e) {navigator.clipboard.writeText(calc6FullResult.value)});
calc6.children[5].addEventListener('click', function(e) {
  if (e.target.style.background) {e.target.removeAttribute('style');window.settings.setCalcFormatted(6, false)}
  else {e.target.style.background = "var(--pricol)";window.settings.setCalcFormatted(6, true)}
  formulaInput(e.target.parentNode.children[0], 'calc6');
});
let calc6LastCalc = {formula:"", fullresult:"", result:"", calc:"calc6", precision:20, time:0, date:Date.now(), sys:window.settings.getCalcSys(), logged:true};

// calc6Formula Scrolling
let calc6FormulaScroll = 0;
let calc6FormulaBlurring = false;
let calc6FormulaTargetScroll = 0;
let calc6FormulaScrolling = false;
calc6Formula.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc6FormulaTargetScroll = calc6Formula.scrollWidth - calc6Formula.clientWidth;if (!calc6FormulaScrolling) {calc6FormulaScrolling = true; requestAnimationFrame(calc6FormulaAnimateScroll)}}
  else if (e.key == 'Home') {calc6FormulaTargetScroll = 0;if (!calc6FormulaScrolling) {calc6FormulaScrolling = true; requestAnimationFrame(calc6FormulaAnimateScroll)}};
});
calc6Formula.addEventListener('scroll', (e) => {if (calc6FormulaBlurring == false) {calc6FormulaScroll = e.target.scrollLeft}});
calc6Formula.addEventListener('blur', (e) => {calc6FormulaBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc6FormulaScroll;calc6FormulaBlurring = false})});
calc6Formula.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc6FormulaTargetScroll += e.deltaY;
  calc6FormulaTargetScroll = clamp(calc6FormulaTargetScroll, 0, maxScroll);
  if (!calc6FormulaScrolling) {calc6FormulaScrolling = true; requestAnimationFrame(calc6FormulaAnimateScroll)}
}, { passive: false });
function calc6FormulaAnimateScroll() {
  const current = calc6Formula.scrollLeft;
  const diff = calc6FormulaTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc6FormulaScroll += step;
  calc6Formula.scrollLeft = calc6FormulaScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc6FormulaAnimateScroll)}
  else {calc6Formula.scrollLeft = calc6FormulaTargetScroll;calc6FormulaScrolling = false};
}

// calc6FullResult Scrolling
let calc6FullResultScroll = 0;
let calc6FullResultBlurring = false;
let calc6FullResultTargetScroll = 0;
let calc6FullResultScrolling = false;
calc6FullResult.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc6FullResultTargetScroll = calc6FullResult.scrollWidth - calc6FullResult.clientWidth;if (!calc6FullResultScrolling) {calc6FullResultScrolling = true; requestAnimationFrame(calc6FullResultAnimateScroll)}}
  else if (e.key == 'Home') {calc6FullResultTargetScroll = 0;if (!calc6FullResultScrolling) {calc6FullResultScrolling = true; requestAnimationFrame(calc6FullResultAnimateScroll)}};
});
calc6FullResult.addEventListener('scroll', (e) => {if (calc6FullResultBlurring == false) {calc6FullResultScroll = e.target.scrollLeft}});
calc6FullResult.addEventListener('blur', (e) => {calc6FullResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc6FullResultScroll;calc6FullResultBlurring = false})});
calc6FullResult.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc6FullResultTargetScroll += e.deltaY;
  calc6FullResultTargetScroll = clamp(calc6FullResultTargetScroll, 0, maxScroll);
  if (!calc6FullResultScrolling) {calc6FullResultScrolling = true; requestAnimationFrame(calc6FullResultAnimateScroll)}
}, { passive: false });
function calc6FullResultAnimateScroll() {
  const current = calc6FullResult.scrollLeft;
  const diff = calc6FullResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc6FullResultScroll += step;
  calc6FullResult.scrollLeft = calc6FullResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc6FullResultAnimateScroll)}
  else {calc6FullResult.scrollLeft = calc6FullResultTargetScroll;calc6FullResultScrolling = false};
}

// calc6Result Scrolling
let calc6ResultScroll = 0;
let calc6ResultBlurring = false;
let calc6ResultTargetScroll = 0;
let calc6ResultScrolling = false;
calc6Result.addEventListener('keydown', (e) => {
  if (e.key == 'End') {calc6ResultTargetScroll = calc6Result.scrollWidth - calc6Result.clientWidth;if (!calc6ResultScrolling) {calc6ResultScrolling = true; requestAnimationFrame(calc6ResultAnimateScroll)}}
  else if (e.key == 'Home') {calc6ResultTargetScroll = 0;if (!calc6ResultScrolling) {calc6ResultScrolling = true; requestAnimationFrame(calc6ResultAnimateScroll)}};
});
calc6Result.addEventListener('scroll', (e) => {if (calc6ResultBlurring == false) {calc6ResultScroll = e.target.scrollLeft}});
calc6Result.addEventListener('blur', (e) => {calc6ResultBlurring = true;requestAnimationFrame(() => {e.target.scrollLeft = calc6ResultScroll;calc6ResultBlurring = false})});
calc6Result.addEventListener("wheel", (e) => {if (e.target.scrollWidth <= e.target.clientWidth) return;e.preventDefault();
  const maxScroll = e.target.scrollWidth - e.target.clientWidth;
  calc6ResultTargetScroll += e.deltaY;
  calc6ResultTargetScroll = clamp(calc6ResultTargetScroll, 0, maxScroll);
  if (!calc6ResultScrolling) {calc6ResultScrolling = true; requestAnimationFrame(calc6ResultAnimateScroll)}
}, { passive: false });
function calc6ResultAnimateScroll() {
  const current = calc6Result.scrollLeft;
  const diff = calc6ResultTargetScroll - current;
  let step = Math.sign(diff) * Math.sqrt(Math.abs(diff)) * 0.4;
  if (Math.abs(diff) > 2000) {step *= ((step*step)/100)};
  calc6ResultScroll += step;
  calc6Result.scrollLeft = calc6ResultScroll;
  if (Math.abs(diff) > 0.5) {requestAnimationFrame(calc6ResultAnimateScroll)}
  else {calc6Result.scrollLeft = calc6ResultTargetScroll;calc6ResultScrolling = false};
}


// —————————— FORMULA INPUTS ——————————
const calcs = {
  calc1:{base:calc1,formula:calc1Formula,fullresult:calc1FullResult,result:calc1Result},
  calc2:{base:calc2,formula:calc2Formula,fullresult:calc2FullResult,result:calc2Result},
  calc3:{base:calc3,formula:calc3Formula,fullresult:calc3FullResult,result:calc3Result},
  calc4:{base:calc4,formula:calc4Formula,fullresult:calc4FullResult,result:calc4Result},
  calc5:{base:calc5,formula:calc5Formula,fullresult:calc5FullResult,result:calc5Result},
  calc6:{base:calc6,formula:calc6Formula,fullresult:calc6FullResult,result:calc6Result},
};

function formulaInput(e, calc, stack = []) {
  let calcElements = calcs[calc];
  let t = performance.now();
  if (stack.includes(calc)) {
    for (let i=0; i < stack.length; i++) {
      writeError(calcs[stack[i]], {text: `Circular reference: ${stack.join(" → ")}`, button: 'none'});
    }
    stack.push(calc);
    writeError(calcElements, {text: `Circular reference: ${stack.join(" → ")}`, button: 'none'});
    BYPASS_LIMITS = false;
    return;
  }
  stack.push(calc);
  let el = e.target || e;
  let result = {result:'',full:'',error:null};
  fmt.groupSeparator = el.parentNode.children[5].style.background ? window.settings.getFormatting('thousands') : '';
  fmt.decimalSeparator = window.settings.getFormatting('decimal');

  // Calculate
  if (el.value.length > 0) {result = calculate(el.value, {trigMode:trigMode, decimalSep:window.settings.getFormatting('decimal'), thousandSep:window.settings.getFormatting('thousands')})};

  if (result.error) {
    writeError(calcElements, result.error);
    if (calc == 'calc1') {calc1LastCalc = {formula:el.value, fullresult:"ERROR", result:"ERROR", calc:calc, precision:getPrecision(), time:(performance.now()-t).toFixed(1), date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:false}}
    else if (calc == 'calc2') {calc2LastCalc = {formula:el.value, fullresult:"ERROR", result:"ERROR", calc:calc, precision:getPrecision(), time:(performance.now()-t).toFixed(1), date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:false}}
    else if (calc == 'calc3') {calc3LastCalc = {formula:el.value, fullresult:"ERROR", result:"ERROR", calc:calc, precision:getPrecision(), time:(performance.now()-t).toFixed(1), date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:false}}
    else if (calc == 'calc4') {calc4LastCalc = {formula:el.value, fullresult:"ERROR", result:"ERROR", calc:calc, precision:getPrecision(), time:(performance.now()-t).toFixed(1), date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:false}}
    else if (calc == 'calc5') {calc5LastCalc = {formula:el.value, fullresult:"ERROR", result:"ERROR", calc:calc, precision:getPrecision(), time:(performance.now()-t).toFixed(1), date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:false}}
    else if (calc == 'calc6') {calc6LastCalc = {formula:el.value, fullresult:"ERROR", result:"ERROR", calc:calc, precision:getPrecision(), time:(performance.now()-t).toFixed(1), date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:false}};
  }
  else {
    clearError(calcElements);
    calcElements.fullresult.value = result.full;
    calcElements.result.value = result.result;
    if (result.full.length == 0) {_defaultCalc.removeVariable(calc)} else {_defaultCalc.setVariable(calc, result.fullnonformatted, true)};
    let lc = {formula:el.value, fullresult:result.full, result:result.result, calc:calc, precision:getPrecision(), time:(performance.now()-t).toFixed(1), date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys(), logged:false};
    if (calc == 'calc1') {calc1LastCalc = lc}
    else if (calc == 'calc2') {calc2LastCalc = lc}
    else if (calc == 'calc3') {calc3LastCalc = lc}
    else if (calc == 'calc4') {calc4LastCalc = lc}
    else if (calc == 'calc5') {calc5LastCalc = lc}
    else if (calc == 'calc6') {calc6LastCalc = lc};
    for (let i = 1; i <= 6; i++) {
      let name = `calc${i}`;
      let input = document.getElementById(`calc${i}-formula`);
      if (input.value.includes(calc)) {
        formulaInput(input, name, stack);
      }
    }
  }
  BYPASS_LIMITS = false;
}

// Error printing
function writeError(elements, error = {text:'Unknown error',button:'none'}) {
  if (elements) {
    elements.base.style.background = "#F00";
    elements.formula.style.background = "#900";
    elements.fullresult.style.background = "#900";
    elements.result.style.background = "#900";
    if (elements.fullresult.value.length == 0) {elements.fullresult.value = "ERROR"};
    if (elements.result.value.length == 0) {elements.result.value = "ERROR"};
  }
  errorDisplay.innerHTML = `<i title="${error.text}">${error.text}</i>`;
  if (error.button == 'bypass') {
    const btn = document.createElement('button');
    btn.innerHTML = "Bypass";
    btn.addEventListener('click', function(e) {BYPASS_LIMITS = true;formulaInput(elements.formula, elements.formula.id.substring(0, elements.formula.id.indexOf('-')))});
    errorDisplay.appendChild(btn);
  }
}

function clearError(elements) {
  if (elements) {
    elements.base.removeAttribute('style');
    elements.formula.removeAttribute('style');
    elements.fullresult.removeAttribute('style');
    elements.result.removeAttribute('style');
  }
  while (errorDisplay.lastChild) {errorDisplay.lastChild.remove()};
}



// ========== MATH PARSER ================================================================================
// =======================================================================================================

// —————————— FORMAT CONFIGURATION ——————————
let fmt = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: '',
};
let fmtnonformatted = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: '',
};

// —————————— PRECISON ——————————
let PRECISION = window.settings.getPrecision();

function refreshBigNumber() {
  BigNumber.config({
    DECIMAL_PLACES: PRECISION + 10,
    ROUNDING_MODE: 4,
  });
}

let BYPASS_LIMITS = false;

// —————————— HIGH-PRECISION MATH LIBRARY ——————————
function _computePI() {
  // Chudnovsky algorithm with Binary Splitting
  //
  // π = (426880 * sqrt(10005)) / Σ_{k=0}^{N} [ (-1)^k * (6k)! * (13591409 + 545140134k) ]
  //                                             / [ (3k)! * (k!)^3 * 640320^(3k) ]
  //
  // Binary splitting computes the partial sum as an exact rational P/Q,
  // avoiding per-term BigNumber divisions. Only ONE final division is needed.
  // This typically gives a 3–10× speedup at high precision.

  const targetDigits = PRECISION + 10;
  const termsNeeded = Math.ceil(targetDigits / 14) + 2;

  // Recursively compute P, Q, T for terms [a, b) using binary splitting.
  // At each leaf (b - a === 1), we compute the exact numerator/denominator
  // for term k = a without any division.
  //
  // The recurrence for the Chudnovsky series:
  //   P(a,a+1) = (6a-5)(2a-1)(6a-1)
  //   Q(a,a+1) = a^3 * C3 / 24   [C3 = 640320^3 / 24 = 10939058860032000]
  //   T(a,a+1) = P(a,a+1) * (A + B*a)  with sign
  //
  // For the midpoint split:
  //   P(a,b) = P(a,m) * P(m,b)
  //   Q(a,b) = Q(a,m) * Q(m,b)
  //   T(a,b) = T(a,m) * Q(m,b) + P(a,m) * T(m,b)

  const C3_OVER_24 = new BigNumber("10939058860032000"); // 640320^3 / 24
  const A = new BigNumber(13591409);
  const B = new BigNumber(545140134);

  function binarySplit(a, b) {
    if (b - a === 1) {
      let Pab, Qab, Tab;

      if (a === 0) {
        Pab = new BigNumber(1);
        Qab = new BigNumber(1);
      } else {
        const a_bn = new BigNumber(a);
        // P is ALWAYS positive — it's just the factorial numerator
        Pab = new BigNumber(6 * a - 5)
          .times(2 * a - 1)
          .times(6 * a - 1);
        Qab = a_bn.pow(3).times(C3_OVER_24);
      }

      // Sign lives only in T, not in P
      const linear = A.plus(B.times(a));
      Tab = a % 2 === 0
        ? Pab.times(linear)
        : Pab.times(linear).negated();

      return { P: Pab, Q: Qab, T: Tab };
    }
    
    const m = Math.floor((a + b) / 2);
    const { P: Pl, Q: Ql, T: Tl } = binarySplit(a, m);
    const { P: Pr, Q: Qr, T: Tr } = binarySplit(m, b);

    return {
      P: Pl.times(Pr), // always positive, no sign pollution
      Q: Ql.times(Qr),
      T: Tl.times(Qr).plus(Pl.times(Tr)), // sign already baked into Tl, Tr
    };
  }

  const { Q, T } = binarySplit(0, termsNeeded);

  // π = 426880 * sqrt(10005) * Q / T
 const sqrt10005 = new BigNumber(10005).sqrt();
  return new BigNumber(426880).times(sqrt10005).times(Q).dividedBy(T);
}

function _computeLN2() {
  const x = new BigNumber(1).dividedBy(3), x2 = x.times(x);
  const limit = new BigNumber(10).pow(-(PRECISION + 8));
  let term = x, sum = x, n = 1;
  while (true) {
    term = term.times(x2); n += 2;
    const next = term.dividedBy(n);
    sum = sum.plus(next);
    if (next.abs().lte(limit)) break;
  }
  return sum.times(2);
}

function _computeLN10(ln2) {
  const x = new BigNumber(2).dividedBy(3), x2 = x.times(x);
  const limit = new BigNumber(10).pow(-(PRECISION + 8));
  let term = x, sum = x, n = 1;
  while (true) {
    term = term.times(x2); n += 2;
    const next = term.dividedBy(n);
    sum = sum.plus(next);
    if (next.abs().lte(limit)) break;
  }
  return new BigNumber(ln2.toString()).plus(sum.times(2));
}

// Lazy-computed constants (recalculated when PRECISION changes)
let _piCache = null;
let _ln2Cache = null;
let _ln10Cache = null;
let _precisionAtLastCompute = PRECISION;

// Repeat function context - stores current iteration (n) and previous value (v)
let _repeatN = null;
let _repeatV = null;

function _getPI() {
  if (_piCache === null || _precisionAtLastCompute !== PRECISION) {
    _piCache = _computePI();
    _precisionAtLastCompute = PRECISION;
  }
  return _piCache;
}

function _getLN2() {
  if (_ln2Cache === null || _precisionAtLastCompute !== PRECISION) {
    _ln2Cache = _computeLN2();
    _precisionAtLastCompute = PRECISION;
  }
  return _ln2Cache;
}

function _getLN10() {
  if (_ln10Cache === null || _precisionAtLastCompute !== PRECISION) {
    const ln2 = _getLN2();
    _ln10Cache = _computeLN10(ln2);
    _precisionAtLastCompute = PRECISION;
  }
  return _ln10Cache;
}

function _setPrecision(newPrecision) {
  if (typeof newPrecision !== 'number' || newPrecision < 1 || !Number.isInteger(newPrecision)) {
    return {text:'Precision must be a positive integer',button:'none'};
  }
  
  PRECISION = newPrecision;
  refreshBigNumber();
  
  // Clear cached constants so they recalculate at new precision
  _piCache = null;
  _ln2Cache = null;
  _ln10Cache = null;
  _precisionAtLastCompute = PRECISION;
  
  return null;
}

function _ln(x) {
  if (!x.isPositive()) throw new Error('ln() requires positive argument');
  let m = new BigNumber(x.toString()), k = 0;
  const two = new BigNumber(2), half = new BigNumber('0.5');
  while (m.gte(two))  { m = m.dividedBy(two); k++; }
  while (m.lt(half))  { m = m.times(two); k--; }
  const t = m.minus(1).dividedBy(m.plus(1)), t2 = t.times(t);
  const limit = new BigNumber(10).pow(-(PRECISION + 8));
  let term = t, sum = t, n = 1;
  while (true) {
    term = term.times(t2); n += 2;
    const next = term.dividedBy(n);
    sum = sum.plus(next);
    if (next.abs().lte(limit)) break;
  }
  return new BigNumber(k).times(new BigNumber(_getLN2().toString())).plus(sum.times(2));
}

function _log10(x) { return _ln(x).dividedBy(new BigNumber(_getLN10().toString())); }
function _log2(x)  { return _ln(x).dividedBy(new BigNumber(_getLN2().toString())); }
function _logB(x, b) { return _ln(x).dividedBy(_ln(b)); }

function _exp(x) {
  const bx = new BigNumber(x.toString()), ln2 = new BigNumber(_getLN2().toString());
  const k = bx.dividedBy(ln2).integerValue(BigNumber.ROUND_HALF_UP);
  const r = bx.minus(k.times(ln2));
  const limit = new BigNumber(10).pow(-(PRECISION + 8));
  let term = new BigNumber(1), sum = new BigNumber(1), n = 0;
  while (true) {
    n++; term = term.times(r).dividedBy(n); sum = sum.plus(term);
    if (term.abs().lte(limit)) break;
  }
  return sum.times(new BigNumber(2).pow(k));
}

function _reduceAngle(bx) {
  const pi2 = new BigNumber(_getPI().times(2).toString()), pi = new BigNumber(_getPI().toString());
  let r = bx.minus(pi2.times(bx.dividedBy(pi2).integerValue(BigNumber.ROUND_DOWN)));
  if (r.gt(pi))           r = r.minus(pi2);
  if (r.lt(pi.negated())) r = r.plus(pi2);
  return r;
}

function _sin(x) {
  const r = _reduceAngle(new BigNumber(x.toString()));
  const negR2 = r.times(r).negated(), limit = new BigNumber(10).pow(-(PRECISION + 8));
  let term = r, sum = r, n = 1;
  while (true) {
    term = term.times(negR2).dividedBy((n + 1) * (n + 2)); n += 2;
    sum = sum.plus(term);
    if (term.abs().lte(limit)) break;
  }
  return sum;
}

function _cos(x) {
  const r = _reduceAngle(new BigNumber(x.toString()));
  const negR2 = r.times(r).negated(), limit = new BigNumber(10).pow(-(PRECISION + 8));
  let term = new BigNumber(1), sum = new BigNumber(1), n = 0;
  while (true) {
    term = term.times(negR2).dividedBy((n + 1) * (n + 2)); n += 2;
    sum = sum.plus(term);
    if (term.abs().lte(limit)) break;
  }
  return sum;
}

function _tan(x) {
  const c = _cos(x);
  if (c.abs().lt(new BigNumber(10).pow(-(PRECISION - 4)))) throw new Error('tan() undefined at this value');
  return _sin(x).dividedBy(c);
}

function _atan(x) {
  const bx = new BigNumber(x.toString()), one = new BigNumber(1);
  const piover2 = new BigNumber(_getPI().dividedBy(2).toString());
  if (bx.abs().gt(one)) {
    const sign = bx.isNegative() ? new BigNumber(-1) : one;
    return sign.times(piover2).minus(_atan(one.dividedBy(bx)));
  }
  let reduced = bx, factor = new BigNumber(1);
  for (let i = 0; i < 3; i++) {
    reduced = reduced.dividedBy(one.plus(one.plus(reduced.times(reduced)).sqrt()));
    factor  = factor.times(2);
  }
  const negR2 = reduced.times(reduced).negated(), limit = new BigNumber(10).pow(-(PRECISION + 8));
  let term = reduced, sum = reduced, n = 1;
  while (true) {
    term = term.times(negR2); n += 2;
    const next = term.dividedBy(n);
    sum = sum.plus(next);
    if (next.abs().lte(limit)) break;
  }
  return factor.times(sum);
}

function _asin(x) {
  const bx = new BigNumber(x.toString()), one = new BigNumber(1);
  if (bx.abs().gt(one)) throw new Error('asin() argument must be in [-1, 1]');
  if (bx.abs().eq(one)) return bx.isNegative()
    ? new BigNumber(_getPI().dividedBy(2).toString()).negated() : new BigNumber(_getPI().dividedBy(2).toString());
  return _atan(bx.dividedBy(one.minus(bx.times(bx)).sqrt()));
}

function _acos(x) { return new BigNumber(_getPI().dividedBy(2).toString()).minus(_asin(x)); }

function _sinh(x) {
  const ep = _exp(x), em = _exp(new BigNumber(x.toString()).negated());
  return ep.minus(em).dividedBy(2);
}
function _cosh(x) {
  const ep = _exp(x), em = _exp(new BigNumber(x.toString()).negated());
  return ep.plus(em).dividedBy(2);
}
function _tanh(x) {
  const ep = _exp(x), em = _exp(new BigNumber(x.toString()).negated());
  const num = ep.minus(em), den = ep.plus(em);
  if (den.isZero()) throw new Error('tanh() undefined');
  return num.dividedBy(den);
}

// High-precision power function for non-integer exponents
// Uses a^b = exp(b * ln(a)) for non-integers, direct computation for integers
function _power(base, exponent) {
  const b = new BigNumber(base.toString());
  const e = new BigNumber(exponent.toString());
  
  // Handle special cases
  if (b.isZero()) {
    if (e.isPositive()) return new BigNumber(0);
    throw new Error('0^0 or 0^negative is undefined');
  }
  if (e.isZero()) return new BigNumber(1);
  if (e.eq(1)) return b;
  if (b.eq(1)) return new BigNumber(1);
  
  // Check if exponent is an integer
  if (e.isInteger()) {
    // Use BigNumber's built-in integer power (fast and exact)
    return b.exponentiatedBy(e);
  }
  
  // For non-integer exponents: a^b = exp(b * ln(a))
  // But this only works for positive bases
  if (b.isNegative()) {
    throw new Error('Non-integer power of negative number is not supported');
  }
  
  // Compute b * ln(a)
  const lnBase = _ln(b);
  const product = e.times(lnBase);
  
  // Return exp(product)
  return _exp(product);
}

function _toRad(x) { return new BigNumber(x.toString()).times(_getPI().toString()).dividedBy(180); }
function _toDeg(x) { return new BigNumber(x.toString()).times(180).dividedBy(_getPI().toString()); }


// —————————— UNIT CONVERSION TABLE ——————————
const UNIT_CATEGORIES = [
  // —————————— Length (base: metre) ——————————
  {
    base: 'm',
    units: [
      { aliases: ['m', 'metre', 'metres', 'meter', 'meters'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['km', 'kilometre', 'kilometres', 'kilometer', 'kilometers'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['cm', 'centimetre', 'centimetres', 'centimeter', 'centimeters'],
        toBase: x => x.dividedBy(100), fromBase: x => x.times(100) },
      { aliases: ['mm', 'millimetre', 'millimetres', 'millimeter', 'millimeters'],
        toBase: x => x.dividedBy(1000), fromBase: x => x.times(1000) },
      { aliases: ['µm', 'um', 'micrometre', 'micrometres', 'micrometer', 'micrometers', 'micron', 'microns'],
        toBase: x => x.dividedBy('1e6'), fromBase: x => x.times('1e6') },
      { aliases: ['nm', 'nanometre', 'nanometres', 'nanometer', 'nanometers'],
        toBase: x => x.dividedBy('1e9'), fromBase: x => x.times('1e9') },
      { aliases: ['pm', 'picometre', 'picometres', 'picometer', 'picometers'],
        toBase: x => x.dividedBy('1e12'), fromBase: x => x.times('1e12') },
      { aliases: ['fm', 'femtometre', 'femtometres', 'femtometer', 'femtometers'],
        toBase: x => x.dividedBy('1e15'), fromBase: x => x.times('1e15') },
      { aliases: ['am', 'attometre', 'attometres', 'attometer', 'attometers'],
        toBase: x => x.dividedBy('1e18'), fromBase: x => x.times('1e18') },
      { aliases: ['zm', 'zeptometre', 'zeptometres', 'zeptometer', 'zeptometers'],
        toBase: x => x.dividedBy('1e21'), fromBase: x => x.times('1e21') },
      { aliases: ['ym', 'yoctometre', 'yoctometres', 'yoctometer', 'yoctometers'],
        toBase: x => x.dividedBy('1e24'), fromBase: x => x.times('1e24') },
      { aliases: ['rm', 'rontometre', 'rontometres', 'rontometer', 'rontometers'],
        toBase: x => x.dividedBy('1e27'), fromBase: x => x.times('1e27') },
      { aliases: ['qm', 'quectometre', 'quectometres', 'quectometer', 'quectometers'],
        toBase: x => x.dividedBy('1e30'), fromBase: x => x.times('1e30') },
      { aliases: ['å', 'angstrom', 'angstroms', 'ångström'],
        toBase: x => x.dividedBy('1e10'), fromBase: x => x.times('1e10') },
      { aliases: ['mi', 'mile', 'miles'],
        toBase: x => x.times('1609.344'), fromBase: x => x.dividedBy('1609.344') },
      { aliases: ['yd', 'yard', 'yards'],
        toBase: x => x.times('0.9144'), fromBase: x => x.dividedBy('0.9144') },
      { aliases: ['ft', 'foot', 'feet'],
        toBase: x => x.times('0.3048'), fromBase: x => x.dividedBy('0.3048') },
      { aliases: ['in', 'inch', 'inches'],
        toBase: x => x.times('0.0254'), fromBase: x => x.dividedBy('0.0254') },
      { aliases: ['nmi', 'nautical mile', 'nautical miles'],
        toBase: x => x.times('1852'), fromBase: x => x.dividedBy('1852') },
      { aliases: ['ly', 'light year', 'light years', 'lightyear', 'lightyears'],
        toBase: x => x.times('9.4607304725808e15'), fromBase: x => x.dividedBy('9.4607304725808e15') },
      { aliases: ['sr', 'solar radius', 'solar radii', 'r⊙'],
        toBase: x => x.times('695700000'), fromBase: x => x.dividedBy('695700000') },
      { aliases: ['au', 'astronomical unit', 'astronomical units'],
        toBase: x => x.times('149597870700'), fromBase: x => x.dividedBy('149597870700') },
      { aliases: ['pc', 'parsec', 'parsecs'],
        toBase: x => x.times('3.0856775814913673e16'), fromBase: x => x.dividedBy('3.0856775814913673e16') },
      { aliases: ['kpc', 'kiloparsec', 'kiloparsecs'],
        toBase: x => x.times('3.0856775814913673e19'), fromBase: x => x.dividedBy('3.0856775814913673e19') },
      { aliases: ['mpc', 'megaparsec', 'megaparsecs'],
        toBase: x => x.times('3.0856775814913673e22'), fromBase: x => x.dividedBy('3.0856775814913673e22') },
      { aliases: ['gpc', 'gigaparsec', 'gigaparsecs'],
        toBase: x => x.times('3.0856775814913673e25'), fromBase: x => x.dividedBy('3.0856775814913673e25') },
    ],
  },
  // —————————— Mass (base: gram) ——————————
  {
    base: 'g',
    units: [
      { aliases: ['g', 'gram', 'grams'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['kg', 'kilogram', 'kilograms'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['mg', 'milligram', 'milligrams'],
        toBase: x => x.dividedBy(1000), fromBase: x => x.times(1000) },
      { aliases: ['µg', 'ug', 'microgram', 'micrograms'],
        toBase: x => x.dividedBy('1e6'), fromBase: x => x.times('1e6') },
      { aliases: ['t', 'tonne', 'tonnes', 'metric ton', 'metric tons'],
        toBase: x => x.times('1e6'), fromBase: x => x.dividedBy('1e6') },
      { aliases: ['lb', 'lbs', 'pound', 'pounds'],
        toBase: x => x.times('453.59237'), fromBase: x => x.dividedBy('453.59237') },
      { aliases: ['oz', 'ounce', 'ounces'],
        toBase: x => x.times('28.349523125'), fromBase: x => x.dividedBy('28.349523125') },
      { aliases: ['st', 'stone', 'stones'],
        toBase: x => x.times('6350.29318'), fromBase: x => x.dividedBy('6350.29318') },
      { aliases: ['carat', 'carats', 'ct'],
        toBase: x => x.dividedBy(5), fromBase: x => x.times(5) },
    ],
  },
  // —————————— Temperature ——————————
  {
    base: 'c',
    units: [
      { aliases: ['c', 'celsius', '°c'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['f', 'fahrenheit', '°f'],
        toBase: x => x.minus(32).times(5).dividedBy(9),
        fromBase: x => x.times(9).dividedBy(5).plus(32) },
      { aliases: ['k', 'kelvin'],
        toBase: x => x.minus('273.15'),
        fromBase: x => x.plus('273.15') },
      { aliases: ['r', 'rankine', '°r'],
        toBase: x => x.minus('491.67').times(5).dividedBy(9),
        fromBase: x => x.times(9).dividedBy(5).plus('491.67') },
    ],
  },
  // —————————— Volume (base: litre) ——————————
  {
    base: 'l',
    units: [
      { aliases: ['l', 'litre', 'litres', 'liter', 'liters'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['ml', 'millilitre', 'millilitres', 'milliliter', 'milliliters'],
        toBase: x => x.dividedBy(1000), fromBase: x => x.times(1000) },
      { aliases: ['cl', 'centilitre', 'centilitres', 'centiliter', 'centiliters'],
        toBase: x => x.dividedBy(100), fromBase: x => x.times(100) },
      { aliases: ['km3', 'km³', 'cubic kilometre', 'cubic kilometres', 'cubic kilometer', 'cubic kilometers'],
        toBase: x => x.times('1e12'), fromBase: x => x.dividedBy('1e12') },
      { aliases: ['m3', 'm³', 'cubic metre', 'cubic metres', 'cubic meter', 'cubic meters'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['cm3', 'cm³', 'cc', 'cubic centimetre', 'cubic centimetres', 'cubic centimeter', 'cubic centimeters'],
        toBase: x => x.dividedBy(1000), fromBase: x => x.times(1000) },
      { aliases: ['mm3', 'mm³', 'cubic millimetre', 'cubic millimetres', 'cubic millimeter', 'cubic millimeters'],
        toBase: x => x.dividedBy('1e6'), fromBase: x => x.times('1e6') },
      { aliases: ['µm3', 'μm3', 'um3', 'cubic micrometre', 'cubic micrometres', 'cubic micrometer', 'cubic micrometers'],
        toBase: x => x.dividedBy('1e15'), fromBase: x => x.times('1e15') },
      { aliases: ['nm3', 'cubic nanometre', 'cubic nanometres', 'cubic nanometer', 'cubic nanometers'],
        toBase: x => x.dividedBy('1e24'), fromBase: x => x.times('1e24') },
      { aliases: ['pm3', 'cubic picometre', 'cubic picometres', 'cubic picometer', 'cubic picometers'],
        toBase: x => x.dividedBy('1e33'), fromBase: x => x.times('1e33') },
      { aliases: ['mi3', 'cubic mile', 'cubic miles'],
        toBase: x => x.times('4.168181825e12'), fromBase: x => x.dividedBy('4.168181825e12') },
      { aliases: ['yd3', 'cubic yard', 'cubic yards'],
        toBase: x => x.times('764.554857984'), fromBase: x => x.dividedBy('764.554857984') },
      { aliases: ['ft3', 'cubic foot', 'cubic feet'],
        toBase: x => x.times('28.316846592'), fromBase: x => x.dividedBy('28.316846592') },
      { aliases: ['in3', 'cubic inch', 'cubic inches'],
        toBase: x => x.times('0.016387064'), fromBase: x => x.dividedBy('0.016387064') },
      { aliases: ['gallon', 'gallons', 'gal', 'us gallon', 'us gallons'],
        toBase: x => x.times('3.785411784'), fromBase: x => x.dividedBy('3.785411784') },
      { aliases: ['qt', 'quart', 'quarts'],
        toBase: x => x.times('0.946352946'), fromBase: x => x.dividedBy('0.946352946') },
      { aliases: ['pt', 'pint', 'pints'],
        toBase: x => x.times('0.473176473'), fromBase: x => x.dividedBy('0.473176473') },
      { aliases: ['fl oz', 'floz', 'fluid ounce', 'fluid ounces'],
        toBase: x => x.times('0.0295735296'), fromBase: x => x.dividedBy('0.0295735296') },
      { aliases: ['tsp', 'teaspoon', 'teaspoons'],
        toBase: x => x.times('0.00492892159375'), fromBase: x => x.dividedBy('0.00492892159375') },
      { aliases: ['tbsp', 'tablespoon', 'tablespoons'],
        toBase: x => x.times('0.0147867647813'), fromBase: x => x.dividedBy('0.0147867647813') },
      { aliases: ['cup', 'cups'],
        toBase: x => x.times('0.2365882365'), fromBase: x => x.dividedBy('0.2365882365') },
    ],
  },
  // —————————— Speed (base: m/s) ——————————
  {
    base: 'm/s',
    units: [
      { aliases: ['m/s', 'mps', 'metres per second', 'meters per second'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['km/s', 'kps', 'kilometres per second', 'kilometers per second'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['km/h', 'kph', 'kmh', 'kilometres per hour', 'kilometers per hour'],
        toBase: x => x.dividedBy('3.6'), fromBase: x => x.times('3.6') },
      { aliases: ['cm/s', 'centimetres per second', 'centimeters per second'],
        toBase: x => x.dividedBy(100), fromBase: x => x.times(100) },
      { aliases: ['mm/s', 'millimetres per second', 'millimeters per second'],
        toBase: x => x.dividedBy(1000), fromBase: x => x.times(1000) },
      { aliases: ['mph', 'miles per hour'],
        toBase: x => x.times('0.44704'), fromBase: x => x.dividedBy('0.44704') },
      { aliases: ['mi/s', 'miles per second'],
        toBase: x => x.times('1609.344'), fromBase: x => x.dividedBy('1609.344') },
      { aliases: ['ft/s', 'fps', 'feet per second'],
        toBase: x => x.times('0.3048'), fromBase: x => x.dividedBy('0.3048') },
      { aliases: ['ft/h', 'feet per hour'],
        toBase: x => x.times('0.00008466666667'), fromBase: x => x.dividedBy('0.00008466666667') },
      { aliases: ['in/s', 'inches per second'],
        toBase: x => x.times('0.0254'), fromBase: x => x.dividedBy('0.0254') },
      { aliases: ['knot', 'knots', 'kt', 'kn'],
        toBase: x => x.times('0.514444'), fromBase: x => x.dividedBy('0.514444') },
    ],
  },
  // —————————— Area (base: m²) ——————————
  {
    base: 'm2',
    units: [
      { aliases: ['m2', 'm²', 'sq m', 'square metre', 'square metres', 'square meter', 'square meters'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['km2', 'km²', 'sq km', 'square kilometre', 'square kilometres', 'square kilometer', 'square kilometers'],
        toBase: x => x.times('1e6'), fromBase: x => x.dividedBy('1e6') },
      { aliases: ['cm2', 'cm²', 'sq cm', 'square centimetre', 'square centimetres', 'square centimeter', 'square centimeters'],
        toBase: x => x.dividedBy('1e4'), fromBase: x => x.times('1e4') },
      { aliases: ['mm2', 'mm²', 'sq mm', 'square millimetre', 'square millimetres', 'square millimeter', 'square millimeters'],
        toBase: x => x.dividedBy('1e6'), fromBase: x => x.times('1e6') },
      { aliases: ['µm2', 'μm2', 'um2', 'sq um', 'square micrometre', 'square micrometres', 'square micrometer', 'square micrometers'],
        toBase: x => x.dividedBy('1e12'), fromBase: x => x.times('1e12') },
      { aliases: ['nm2', 'sq nm', 'square nanometre', 'square nanometres', 'square nanometer', 'square nanometers'],
        toBase: x => x.dividedBy('1e18'), fromBase: x => x.times('1e18') },
      { aliases: ['pm2', 'sq pm', 'square picometre', 'square picometres', 'square picometer', 'square picometers'],
        toBase: x => x.dividedBy('1e24'), fromBase: x => x.times('1e24') },
      { aliases: ['ha', 'hectare', 'hectares'],
        toBase: x => x.times('1e4'), fromBase: x => x.dividedBy('1e4') },
      { aliases: ['acre', 'acres'],
        toBase: x => x.times('4046.8564224'), fromBase: x => x.dividedBy('4046.8564224') },
      { aliases: ['mi2', 'sq mi', 'square mile', 'square miles'],
        toBase: x => x.times('2589988.110336'), fromBase: x => x.dividedBy('2589988.110336') },
      { aliases: ['yd2', 'sq yd', 'square yard', 'square yards'],
        toBase: x => x.times('0.83612736'), fromBase: x => x.dividedBy('0.83612736') },
      { aliases: ['ft2', 'sq ft', 'square foot', 'square feet'],
        toBase: x => x.times('0.09290304'), fromBase: x => x.dividedBy('0.09290304') },
      { aliases: ['in2', 'sq in', 'square inch', 'square inches'],
        toBase: x => x.times('0.00064516'), fromBase: x => x.dividedBy('0.00064516') },
    ],
  },
  // —————————— Time (base: second) ——————————
  {
    base: 's',
    units: [
      { aliases: ['s', 'sec', 'second', 'seconds'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['ms', 'millisecond', 'milliseconds'],
        toBase: x => x.dividedBy(1000), fromBase: x => x.times(1000) },
      { aliases: ['µs', 'us', 'microsecond', 'microseconds'],
        toBase: x => x.dividedBy('1e6'), fromBase: x => x.times('1e6') },
      { aliases: ['ns', 'nanosecond', 'nanoseconds'],
        toBase: x => x.dividedBy('1e9'), fromBase: x => x.times('1e9') },
      { aliases: ['ps', 'picosecond', 'picoseconds'],
        toBase: x => x.dividedBy('1e12'), fromBase: x => x.times('1e12') },
      { aliases: ['fs', 'femtoseconds', 'femtoseconds'],
        toBase: x => x.dividedBy('1e15'), fromBase: x => x.times('1e15') },
      { aliases: ['min', 'minute', 'minutes'],
        toBase: x => x.times(60), fromBase: x => x.dividedBy(60) },
      { aliases: ['h', 'hr', 'hour', 'hours'],
        toBase: x => x.times(3600), fromBase: x => x.dividedBy(3600) },
      { aliases: ['day', 'days'],
        toBase: x => x.times(86400), fromBase: x => x.dividedBy(86400) },
      { aliases: ['week', 'weeks', 'wk'],
        toBase: x => x.times(604800), fromBase: x => x.dividedBy(604800) },
      { aliases: ['month', 'months'],
        toBase: x => x.times('2629800'), fromBase: x => x.dividedBy('2629800') },
      { aliases: ['year', 'years', 'yr'],
        toBase: x => x.times('31557600'), fromBase: x => x.dividedBy('31557600') },
      { aliases: ['decade', 'decades'],
        toBase: x => x.times('315576000'), fromBase: x => x.dividedBy('315576000') },
      { aliases: ['century', 'centuries'],
        toBase: x => x.times('3155760000'), fromBase: x => x.dividedBy('3155760000') },
    ],
  },
  // —————————— Energy (base: joule) ——————————
  {
    base: 'j',
    units: [
      { aliases: ['j', 'joule', 'joules'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['kj', 'kilojoule', 'kilojoules'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['mj', 'megajoule', 'megajoules'],
        toBase: x => x.times('1e6'), fromBase: x => x.dividedBy('1e6') },
      { aliases: ['cal', 'calorie', 'calories'],
        toBase: x => x.times('4.184'), fromBase: x => x.dividedBy('4.184') },
      { aliases: ['kcal', 'kilocalorie', 'kilocalories', 'cal (food)', 'food calorie', 'food calories'],
        toBase: x => x.times('4184'), fromBase: x => x.dividedBy('4184') },
      { aliases: ['wh', 'watt hour', 'watt hours'],
        toBase: x => x.times('3600'), fromBase: x => x.dividedBy('3600') },
      { aliases: ['kwh', 'kilowatt hour', 'kilowatt hours'],
        toBase: x => x.times('3.6e+6'), fromBase: x => x.dividedBy('3.6e+6') },
      { aliases: ['mwh', 'megawatt hour', 'megawatt hours'],
        toBase: x => x.times('3.6e+9'), fromBase: x => x.dividedBy('3.6e+9') },
      { aliases: ['gwh', 'gigawatt hour', 'gigawatt hours'],
        toBase: x => x.times('3.6e+12'), fromBase: x => x.dividedBy('3.6e+12') },
      { aliases: ['twh', 'terawatt hour', 'terawatt hours'],
        toBase: x => x.times('3.6e+15'), fromBase: x => x.dividedBy('3.6e+15') },
      { aliases: ['pwh', 'petawatt hour', 'petawatt hours'],
        toBase: x => x.times('3.6e+18'), fromBase: x => x.dividedBy('3.6e+18') },
      { aliases: ['ev', 'electronvolt', 'electronvolts'],
        toBase: x => x.times('1.602176634e-19'), fromBase: x => x.dividedBy('1.602176634e-19') },
      { aliases: ['btu', 'british thermal unit', 'british thermal units'],
        toBase: x => x.times('1055.05585262'), fromBase: x => x.dividedBy('1055.05585262') },
    ],
  },
  // —————————— Power (base: watt) ——————————
  {
    base: 'w',
    units: [
      { aliases: ['w', 'watt', 'watts'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['kw', 'kilowatt', 'kilowatts'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['mw', 'megawatt', 'megawatts'],
        toBase: x => x.times('1e6'), fromBase: x => x.dividedBy('1e6') },
      { aliases: ['gw', 'gigawatt', 'gigawatts'],
        toBase: x => x.times('1e9'), fromBase: x => x.dividedBy('1e9') },
      { aliases: ['tw', 'terawatt', 'terawatts'],
        toBase: x => x.times('1e12'), fromBase: x => x.dividedBy('1e12') },
      { aliases: ['pw', 'petawatt', 'petawatts'],
        toBase: x => x.times('1e15'), fromBase: x => x.dividedBy('1e15') },
      { aliases: ['hp', 'horsepower'],
        toBase: x => x.times('745.69987158227022'), fromBase: x => x.dividedBy('745.69987158227022') },
      { aliases: ['metric hp', 'metric horsepower', 'ps'],
        toBase: x => x.times('735.49875'), fromBase: x => x.dividedBy('735.49875') },
    ],
  },
  // —————————— Pressure (base: pascal) ——————————
  {
    base: 'pa',
    units: [
      { aliases: ['pa', 'pascal', 'pascals'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['kpa', 'kilopascal', 'kilopascals'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['mpa', 'megapascal', 'megapascals'],
        toBase: x => x.times('1e6'), fromBase: x => x.dividedBy('1e6') },
      { aliases: ['gpa', 'gigapascal', 'gigapascals'],
        toBase: x => x.times('1e9'), fromBase: x => x.dividedBy('1e9') },
      { aliases: ['tpa', 'terapascal', 'terapascals'],
        toBase: x => x.times('1e12'), fromBase: x => x.dividedBy('1e12') },
      { aliases: ['ppa', 'petapascal', 'petapascals'],
        toBase: x => x.times('1e15'), fromBase: x => x.dividedBy('1e15') },
      { aliases: ['bar'],
        toBase: x => x.times('1e5'), fromBase: x => x.dividedBy('1e5') },
      { aliases: ['millibar', 'millibars', 'mbar'],
        toBase: x => x.times(100), fromBase: x => x.dividedBy(100) },
      { aliases: ['atm', 'atmosphere', 'atmospheres'],
        toBase: x => x.times('101325'), fromBase: x => x.dividedBy('101325') },
      { aliases: ['psi', 'pounds per square inch', 'pound per square inch'],
        toBase: x => x.times('6894.757293168'), fromBase: x => x.dividedBy('6894.757293168') },
      { aliases: ['mmhg', 'mm hg', 'torr'],
        toBase: x => x.times('133.322387415'), fromBase: x => x.dividedBy('133.322387415') },
    ],
  },
  // —————————— Digital Storage (base: byte) ——————————
  {
    base: 'b',
    units: [
      { aliases: ['b', 'byte', 'bytes'],
        toBase: x => x, fromBase: x => x },

      // —————————— Bit (base unit, decimal) ——————————
      // NOTE: bit abbreviations use the 'bit' suffix (kbit, mbit, ...) rather
      // than bare 'kb', 'mb', etc., since those are already taken by the byte
      // units above and everything here is lowercase (no Kb vs KB distinction
      // available to disambiguate).
      { aliases: ['bit', 'bits'],
        toBase: x => x.dividedBy(8), fromBase: x => x.times(8) },
      { aliases: ['kbit', 'kilobit', 'kilobits'],
        toBase: x => x.times(125), fromBase: x => x.dividedBy(125) },
      { aliases: ['mbit', 'megabit', 'megabits'],
        toBase: x => x.times('1.25e5'), fromBase: x => x.dividedBy('1.25e5') },
      { aliases: ['gbit', 'gigabit', 'gigabits'],
        toBase: x => x.times('1.25e8'), fromBase: x => x.dividedBy('1.25e8') },
      { aliases: ['tbit', 'terabit', 'terabits'],
        toBase: x => x.times('1.25e11'), fromBase: x => x.dividedBy('1.25e11') },
      { aliases: ['pbit', 'petabit', 'petabits'],
        toBase: x => x.times('1.25e14'), fromBase: x => x.dividedBy('1.25e14') },
      { aliases: ['ebit', 'exabit', 'exabits'],
        toBase: x => x.times('1.25e17'), fromBase: x => x.dividedBy('1.25e17') },
      { aliases: ['zbit', 'zettabit', 'zettabits'],
        toBase: x => x.times('1.25e20'), fromBase: x => x.dividedBy('1.25e20') },

      // —————————— Byte (decimal, SI) ——————————
      { aliases: ['kb', 'kilobyte', 'kilobytes'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['mb', 'megabyte', 'megabytes'],
        toBase: x => x.times('1e6'), fromBase: x => x.dividedBy('1e6') },
      { aliases: ['gb', 'gigabyte', 'gigabytes'],
        toBase: x => x.times('1e9'), fromBase: x => x.dividedBy('1e9') },
      { aliases: ['tb', 'terabyte', 'terabytes'],
        toBase: x => x.times('1e12'), fromBase: x => x.dividedBy('1e12') },
      { aliases: ['pb', 'petabyte', 'petabytes'],
        toBase: x => x.times('1e15'), fromBase: x => x.dividedBy('1e15') },
      { aliases: ['eb', 'exabyte', 'exabytes'],
        toBase: x => x.times('1e18'), fromBase: x => x.dividedBy('1e18') },
      { aliases: ['zb', 'zettabyte', 'zettabytes'],
        toBase: x => x.times('1e21'), fromBase: x => x.dividedBy('1e21') },

      // —————————— Byte (binary, IEC) ——————————
      { aliases: ['kib', 'kibibyte', 'kibibytes'],
        toBase: x => x.times(1024), fromBase: x => x.dividedBy(1024) },
      { aliases: ['mib', 'mebibyte', 'mebibytes'],
        toBase: x => x.times(1048576), fromBase: x => x.dividedBy(1048576) },
      { aliases: ['gib', 'gibibyte', 'gibibytes'],
        toBase: x => x.times('1073741824'), fromBase: x => x.dividedBy('1073741824') },
      { aliases: ['tib', 'tebibyte', 'tebibytes'],
        toBase: x => x.times('1099511627776'), fromBase: x => x.dividedBy('1099511627776') },
      { aliases: ['pib', 'pebibyte', 'pebibytes'],
        toBase: x => x.times('1125899906842624'), fromBase: x => x.dividedBy('1125899906842624') },

      // —————————— Bit (binary, IEC) ——————————
      { aliases: ['kibit', 'kibibit', 'kibibits'],
        toBase: x => x.times(128), fromBase: x => x.dividedBy(128) }, // 1024 bits / 8
      { aliases: ['mibit', 'mebibit', 'mebibits'],
        toBase: x => x.times(131072), fromBase: x => x.dividedBy(131072) },
      { aliases: ['gibit', 'gibibit', 'gibibits'],
        toBase: x => x.times('134217728'), fromBase: x => x.dividedBy('134217728') },
      { aliases: ['tibit', 'tebibit', 'tebibits'],
        toBase: x => x.times('137438953472'), fromBase: x => x.dividedBy('137438953472') },
      { aliases: ['pibit', 'pebibit', 'pebibits'],
        toBase: x => x.times('140737488355328'), fromBase: x => x.dividedBy('140737488355328') },
    ],
  },
  // —————————— Angle (base: radian) ——————————
  {
    base: 'rad',
    units: [
      { aliases: ['rad', 'radian', 'radians'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['deg', 'degree', 'degrees', '°'],
        toBase: x => new BigNumber(x.toString()).times(_getPI().toString()).dividedBy(180),
        fromBase: x => new BigNumber(x.toString()).times(180).dividedBy(_getPI().toString()) },
      { aliases: ['grad', 'gradian', 'gradians'],
        toBase: x => new BigNumber(x.toString()).times(_getPI().toString()).dividedBy(200),
        fromBase: x => new BigNumber(x.toString()).times(200).dividedBy(_getPI().toString()) },
      { aliases: ['turn', 'turns', 'revolution', 'revolutions', 'rev'],
        toBase: x => new BigNumber(x.toString()).times(_getPI().times(2).toString()),
        fromBase: x => new BigNumber(x.toString()).dividedBy(_getPI().times(2).toString()) },
      { aliases: ['arcmin', 'arcminute', 'arcminutes', 'minute of arc', 'minutes of arc', "'"],
        toBase: x => new BigNumber(x.toString()).times(_getPI().toString()).dividedBy('10800'),
        fromBase: x => new BigNumber(x.toString()).times('10800').dividedBy(_getPI().toString()) },
      { aliases: ['arcsec', 'arcsecond', 'arcseconds', 'second of arc', 'seconds of arc', '"'],
        toBase: x => new BigNumber(x.toString()).times(_getPI().toString()).dividedBy('648000'),
        fromBase: x => new BigNumber(x.toString()).times('648000').dividedBy(_getPI().toString()) },
    ],
  },
  // —————————— Frequency (base: hertz) ——————————
  {
    base: 'hz',
    units: [
      { aliases: ['hz', 'hertz'],
        toBase: x => x, fromBase: x => x },
      { aliases: ['khz', 'kilohertz'],
        toBase: x => x.times(1000), fromBase: x => x.dividedBy(1000) },
      { aliases: ['mhz', 'megahertz'],
        toBase: x => x.times('1e6'), fromBase: x => x.dividedBy('1e6') },
      { aliases: ['ghz', 'gigahertz'],
        toBase: x => x.times('1e9'), fromBase: x => x.dividedBy('1e9') },
      { aliases: ['thz', 'terahertz'],
        toBase: x => x.times('1e12'), fromBase: x => x.dividedBy('1e12') },
      { aliases: ['rpm', 'revolutions per minute'],
        toBase: x => x.dividedBy(60), fromBase: x => x.times(60) },
    ],
  },
];

const _unitAliasMap = new Map();
for (const category of UNIT_CATEGORIES) {
  for (const unit of category.units) {
    for (const alias of unit.aliases) {
      _unitAliasMap.set(alias.toLowerCase(), {
        toBase:   unit.toBase,
        fromBase: unit.fromBase,
        category,
      });
    }
  }
}


// —————————— RUNTIME VARIABLES ——————————
const _defaultVariables = {}; // (old, not currently in use)

// —————————— FACTORIAL ——————————
function factorialBinSplit(n) {
  if (n < 2n) return 1n;
  return productRange(2n, n);
}

function productRange(lo, hi) {
  if (lo === hi) return lo;
  if (hi - lo === 1n) return lo * hi;
  const mid = (lo + hi) >> 1n;          // bit-shift = fast /2
  return productRange(lo, mid) * productRange(mid + 1n, hi);
}

function factorial(n, sys = 'decimal') {
  const N = sys == 'integer' ? n : BigInt(n.toFixed());
  if (sys == 'decimal') {
    if (!n.isInteger()) {throw new Error('Factorial requires non-negative integer')};
  }
  
  if (N < 0n || N < 0n) throw new Error('Factorial requires non-negative integer');
  if (N > 10000 && !BYPASS_LIMITS) {
    const err = new Error('Factorial argument > 10000 (safety limit)');
    err.bypassable = true;
    throw err;
  }

  return sys == 'integer' ? factorialBinSplit(N) : new BigNumber(factorialBinSplit(N));
}

function doubleFactorial(n, sys = 'decimal') {
  const N = sys == 'integer' ? n : BigInt(n.toFixed());
  if (sys == 'decimal') {
    if (!n.isInteger() || n.isNegative()) throw new Error('Double factorial requires non-negative integer');
  }

  if (N < 0n) throw new Error('Double factorial requires non-negative integer');
  if (N > 10000n && !BYPASS_LIMITS) {
    const err = new Error('Double factorial argument > 10000 (safety limit)');
    err.bypassable = true;
    throw err;
  }

  let r = 1n;
  let i = N % 2n === 0n ? 2n : 1n;
  while (i <= N) { r *= i; i += 2n; }

  return sys == 'integer' ? r : new BigNumber(r.toString());
}

// —————————— FUNCTIONS ——————————
const FUNCTIONS = {
  sqrt:  (sys, [a])    => {
    if (sys === 'integer') throw new Error('sqrt() not available with integer calculation');
    if (a === undefined) throw new Error('sqrt() takes 1 argument');
    if (a.isNegative()) throw new Error('sqrt() of negative');
    return a.sqrt();
  },
  pow:   (sys, [a, b]) => {
    if (a === undefined || b === undefined) throw new Error('pow() takes 2 arguments');
    if (sys === 'integer') {
      if (b < 0n) throw new Error('pow() exponent must be non-negative with integer calculation');
      if (b !== BigInt(b) && typeof b === 'bigint' ? false : !Number.isInteger(Number(b)))
        throw new Error('pow() exponent must be non-negative with integer calculation');
      return a ** b;
    }
    const exp = b.toNumber();
    if (Math.abs(exp) > 1000 && !BYPASS_LIMITS) {
      const err = new Error('Power exponent > 1000 (safety limit)');
      err.bypassable = true;
      throw err;
    }
    return _power(a, b);
  },
  exp:   (sys, [a]) => {
    if (sys === 'integer') throw new Error('exp() not available with integer calculation');
    if (a === undefined) throw new Error('exp() takes 1 argument');
    return new BigNumber(_exp(a).toString());
  },

  log: (sys, args) => {
    if (sys === 'integer') throw new Error('log() not available with integer calculation');
    if (args.length === 1)      return new BigNumber(_log10(args[0]).toString());
    if (args.length === 2)      return new BigNumber(_logB(args[0], args[1]).toString());
    throw new Error('log() takes 1 or 2 arguments');
  },
  log2:  (sys, [a]) => {
    if (sys === 'integer') throw new Error('log2() not available with integer calculation');
    if (a === undefined) throw new Error('log2() takes 1 argument');
    return new BigNumber(_log2(a).toString());
  },
  log10: (sys, [a]) => {
    if (sys === 'integer') throw new Error('log10() not available with integer calculation');
    if (a === undefined) throw new Error('log10() takes 1 argument');
    return new BigNumber(_log10(a).toString());
  },
  ln:    (sys, [a]) => {
    if (sys === 'integer') throw new Error('ln() not available with integer calculation');
    if (a === undefined) throw new Error('ln() takes 1 argument');
    return new BigNumber(_ln(a).toString());
  },

  abs:   (sys, [a])    => {
    if (a === undefined) throw new Error('abs() takes 1 argument');
    if (sys === 'integer') return a < 0n ? -a : a;
    return a.abs();
  },
  mod: (sys, [a, b]) => {
    if (a === undefined || b === undefined) throw new Error('mod() takes 2 arguments');
    if (sys === 'integer') return a % b;
    return a.modulo(b);
  },

  ceil:  (sys, [a])    => {
    if (a === undefined) throw new Error('ceil() takes 1 argument');
    if (sys === 'integer') return a;
    return a.integerValue(BigNumber.ROUND_CEIL);
  },
  floor: (sys, [a])    => {
    if (a === undefined) throw new Error('floor() takes 1 argument');
    if (sys === 'integer') return a;
    return a.integerValue(BigNumber.ROUND_FLOOR);
  },
  round: (sys, [a, b]) => {
    if (a === undefined) throw new Error('round() takes 1 or 2 arguments');
    if (sys === 'integer') {
      if (b !== undefined && b > 0) throw new Error('round() must be 0 decimal places with integer calculation');
      return a;
    }
    const dp = b !== undefined ? b.toNumber() : 0;
    return a.decimalPlaces(dp, BigNumber.ROUND_HALF_UP);
  },

  min: (sys, args) => {
    if (!args.length) throw new Error('min() needs ≥1 argument');
    if (sys === 'integer') return args.reduce((a, b) => a <= b ? a : b);
    return args.reduce((a, b) => a.lte(b) ? a : b);
  },
  max: (sys, args) => {
    if (!args.length) throw new Error('max() needs ≥1 argument');
    if (sys === 'integer') return args.reduce((a, b) => a >= b ? a : b);
    return args.reduce((a, b) => a.gte(b) ? a : b);
  },
  sum:  (sys, args) => {
    if (!args.length) throw new Error('sum() needs ≥1 argument');
    if (sys === 'integer') return args.reduce((acc, v) => acc + v, 0n);
    return args.reduce((acc, v) => acc.plus(v), new BigNumber(0));
  },
  avg:  (sys, args) => {
    if (!args.length) throw new Error('avg() needs ≥1 argument');
    if (sys === 'integer') throw new Error('avg() not available with integer calculation');
    return args.reduce((acc, v) => acc.plus(v), new BigNumber(0)).dividedBy(args.length);
  },

  sin: (sys, [a], tm) => {
    if (sys === 'integer') throw new Error('sin() not available with integer calculation');
    if (a === undefined) throw new Error('sin() takes 1 argument');
    return new BigNumber(_sin(tm === 'deg' ? _toRad(a) : a).toString());
  },
  cos: (sys, [a], tm) => {
    if (sys === 'integer') throw new Error('cos() not available with integer calculation');
    if (a === undefined) throw new Error('cos() takes 1 argument');
    return new BigNumber(_cos(tm === 'deg' ? _toRad(a) : a).toString());
  },
  tan: (sys, [a], tm) => {
    if (sys === 'integer') throw new Error('tan() not available with integer calculation');
    if (a === undefined) throw new Error('tan() takes 1 argument');
    return new BigNumber(_tan(tm === 'deg' ? _toRad(a) : a).toString());
  },
  asin: (sys, [a], tm) => {
    if (sys === 'integer') throw new Error('asin() not available with integer calculation');
    if (a === undefined) throw new Error('asin() takes 1 argument');
    const r = _asin(a);
    return new BigNumber(tm === 'deg' ? _toDeg(r).toString() : r.toString());
  },
  acos: (sys, [a], tm) => {
    if (sys === 'integer') throw new Error('acos() not available with integer calculation');
    if (a === undefined) throw new Error('acos() takes 1 argument');
    const r = _acos(a);
    return new BigNumber(tm === 'deg' ? _toDeg(r).toString() : r.toString());
  },
  atan: (sys, [a], tm) => {
    if (sys === 'integer') throw new Error('atan() not available with integer calculation');
    if (a === undefined) throw new Error('atan() takes 1 argument');
    const r = _atan(a);
    return new BigNumber(tm === 'deg' ? _toDeg(r).toString() : r.toString());
  },
  sinh: (sys, [a]) => {
    if (sys === 'integer') throw new Error('sinh() not available with integer calculation');
    if (a === undefined) throw new Error('sinh() takes 1 argument');
    return new BigNumber(_sinh(a).toString());
  },
  cosh: (sys, [a]) => {
    if (sys === 'integer') throw new Error('cosh() not available with integer calculation');
    if (a === undefined) throw new Error('cosh() takes 1 argument');
    return new BigNumber(_cosh(a).toString());
  },
  tanh: (sys, [a]) => {
    if (sys === 'integer') throw new Error('tanh() not available with integer calculation');
    if (a === undefined) throw new Error('tanh() takes 1 argument');
    return new BigNumber(_tanh(a).toString());
  },

  rad: (sys, [a]) => {
    if (sys === 'integer') throw new Error('rad() not available with integer calculation');
    if (a === undefined) throw new Error('rad() takes 1 argument');
    return new BigNumber(_toRad(a).toString());
  },
  deg: (sys, [a]) => {
    if (sys === 'integer') throw new Error('deg() not available with integer calculation');
    if (a === undefined) throw new Error('deg() takes 1 argument');
    return new BigNumber(_toDeg(a).toString());
  },

  dist: (sys, [x1,y1,x2,y2]) => {
    if (sys === 'integer') throw new Error('dist() not available with integer calculation');
    if ([x1,y1,x2,y2].some(v=>v===undefined)) throw new Error('dist() takes 4 arguments');
    const dx=x2.minus(x1), dy=y2.minus(y1);
    return dx.times(dx).plus(dy.times(dy)).sqrt();
  },
  dist3: (sys, [x1,y1,z1,x2,y2,z2]) => {
    if (sys === 'integer') throw new Error('dist3() not available with integer calculation');
    if ([x1,y1,z1,x2,y2,z2].some(v=>v===undefined)) throw new Error('dist3() takes 6 arguments');
    const dx=x2.minus(x1), dy=y2.minus(y1), dz=z2.minus(z1);
    return dx.times(dx).plus(dy.times(dy)).plus(dz.times(dz)).sqrt();
  },

  sphere: (sys, [v, t]) => {
    if (sys === 'integer') throw new Error('sphere() not available with integer calculation');
    const pi = new BigNumber(_getPI().toString());
    if (t !== undefined && new BigNumber(1).comparedTo(t) === 0) {v = v.dividedBy(2)}
    else if (t !== undefined && new BigNumber(2).comparedTo(t) === 0) {v = v.dividedBy(pi).dividedBy(2)};
    return new BigNumber(4).dividedBy(new BigNumber(3)).times(pi).times(_power(new BigNumber(v), new BigNumber(3)));
  },

  sound: (sys, args) => {
    if (sys === 'integer') throw new Error('sound() not available with integer calculation');

    // 1 argument: sound(temperature_C) - simplified formula
    // 3 arguments: sound(temperature_C, pressure_kPa, relative_humidity_percent) - Cramer equation (1993)

    if (args.length === 1) return _power(new BigNumber(args[0]).plus(273.15).dividedBy(273.15), 0.5).times(331.228);

    if (args.length === 3) {
      // Cramer equation (1993) - NIST standard for speed of sound in humid air
      // Reference: O. Cramer, "The variation of the specific heat ratio and the speed of sound in air
      // with temperature, pressure, humidity, and CO2 concentration", J. Acoust. Soc. Am. 93, 2510 (1993)

      const T_C = new BigNumber(args[0]);  // Temperature in Celsius
      const P_kPa = new BigNumber(args[1]); // Pressure in kPa
      const RH = new BigNumber(args[2]);    // Relative humidity (0-100%)

      // Validate inputs
      if (RH.lt(0) || RH.gt(100)) {
        throw new Error('Relative humidity must be between 0 and 100');
      }
      if (P_kPa.lte(0)) {
        throw new Error('Pressure must be positive');
      }

      // Calculate saturation vapor pressure (enhanced Arden Buck equation)
      // e_sat = 0.61121 * exp((18.678 - T/234.5) * T / (257.14 + T))
      const T_factor1 = new BigNumber('18.678').minus(T_C.dividedBy('234.5'));
      const T_factor2 = T_C.dividedBy(T_C.plus('257.14'));
      const exp_arg = T_factor1.times(T_factor2);
      const e_sat = new BigNumber('0.61121').times(_exp(exp_arg));

      // Actual vapor pressure
      const e = e_sat.times(RH).dividedBy(100);

      // Calculate enhancement factor f (accounts for non-ideal gas behavior)
      const alpha = new BigNumber('1.00062');
      const beta = new BigNumber('3.14e-8').times(P_kPa.times(1000)); // Convert kPa to Pa
      const gamma = new BigNumber('5.6e-7').times(T_C.pow(2));
      const f = alpha.plus(beta).plus(gamma);

      // Recalculate mole fraction with enhancement factor
      const x_w_enhanced = f.times(e).dividedBy(P_kPa);

      // Speed of sound using Cramer's equation
      // c = 331.5024 + 0.603055*T_C - 0.000528*T_C^2 + (0.1495874*T_C + 51.471935 - 0.000782*T_C^2) * x_w
      //     - (1.82e-7 + 3.73e-8*T_C - 2.93e-10*T_C^2) * P_Pa + (-85.20931 - 0.228525*T_C + 5.91e-5*T_C^2) * x_w^2
      //     - (2.835149 - 2.15e-13*P_Pa^2 + 29.179762*x_w + 0.000486*x_w^2)

      const T_C_sq = T_C.pow(2);
      const P_Pa = P_kPa.times(1000); // Convert to Pascals
      const x_w_sq = x_w_enhanced.pow(2);

      // Term 1: Base temperature dependence
      const term1 = new BigNumber('331.5024')
        .plus(new BigNumber('0.603055').times(T_C))
        .minus(new BigNumber('0.000528').times(T_C_sq));

      // Term 2: Humidity effect (first order)
      const term2_coeff = new BigNumber('0.1495874').times(T_C)
        .plus('51.471935')
        .minus(new BigNumber('0.000782').times(T_C_sq));
      const term2 = term2_coeff.times(x_w_enhanced);

      // Term 3: Pressure effect
      const term3_coeff = new BigNumber('1.82e-7')
        .plus(new BigNumber('3.73e-8').times(T_C))
        .minus(new BigNumber('2.93e-10').times(T_C_sq));
      const term3 = term3_coeff.times(P_Pa);

      // Term 4: Humidity effect (second order)
      const term4_coeff = new BigNumber('-85.20931')
        .minus(new BigNumber('0.228525').times(T_C))
        .plus(new BigNumber('5.91e-5').times(T_C_sq));
      const term4 = term4_coeff.times(x_w_sq);

      return term1.plus(term2).minus(term3).plus(term4);
    }

    throw new Error('sound() takes 1 or 3 arguments');
  },

  fibonacci: (sys, [n]) => {
    if (n === undefined) throw new Error('fibonacci() takes 1 argument');
    n = BigInt(n);
    if ((n > 10000n || n < -10000n) && !BYPASS_LIMITS) {
      const err = new Error('Fibonacci > 10000 (safety limit)');
      err.bypassable = true;
      throw err;
    }

    const isNegative = n < 0n;
    const absN = isNegative ? -n : n;

    // Fast doubling — O(log n) BigInt multiplications
    const fibPair = (k) => {
      if (k === 0n) return [0n, 1n];
      const [a, b] = fibPair(k >> 1n);
      const c = a * ((b << 1n) - a);
      const d = a * a + b * b;
      return (k & 1n) === 0n ? [c, d] : [d, c + d];
    };

    let result = fibPair(absN)[0];
    if (isNegative && absN % 2n === 0n) result = -result;

    return sys === 'integer' ? result : new BigNumber(result.toString());
  },
  prime: (sys, [n]) => {
    if (n === undefined) throw new Error('prime() takes 1 argument');

    const nInt = sys === 'integer'
      ? Number(n < 0n ? -n : n)
      : n.integerValue(BigNumber.ROUND_FLOOR).toNumber();

    if (nInt < 1) throw new Error('prime() only supports positive integers');

    if (nInt > 10000 && !BYPASS_LIMITS) {
      const err = new Error('nth prime > 10000 (safety limit)');
      err.bypassable = true;
      throw err;
    }

    const toResult = (p) => sys === 'integer' ? BigInt(p) : new BigNumber(p);

    const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    if (nInt <= smallPrimes.length) return toResult(smallPrimes[nInt - 1]);

    const logN = Math.log(nInt);
    const limit = Math.ceil(nInt * (logN + Math.log(logN))) + 3;

    const sqrtLimit = Math.ceil(Math.sqrt(limit));
    const smallSieve = new Uint8Array(sqrtLimit + 1);
    smallSieve.fill(1);
    smallSieve[0] = smallSieve[1] = 0;
    for (let i = 2; i * i <= sqrtLimit; i++) {
      if (smallSieve[i]) {
        for (let j = i * i; j <= sqrtLimit; j += i) smallSieve[j] = 0;
      }
    }
    const basePrimes = [];
    for (let i = 2; i <= sqrtLimit; i++) if (smallSieve[i]) basePrimes.push(i);

    const SEGMENT = 1 << 19;
    const seg = new Uint8Array(SEGMENT);
    let count = 0;

    for (let low = 2; low <= limit; low += SEGMENT) {
      const high = Math.min(low + SEGMENT - 1, limit);
      const size = high - low + 1;
      seg.fill(1, 0, size);

      for (const p of basePrimes) {
        if (p * p > high) break;
        let start = Math.ceil(low / p) * p;
        if (start === p) start += p;
        for (let j = start - low; j < size; j += p) seg[j] = 0;
      }

      if (low <= 1) seg[1 - low] = 0;

      for (let j = 0; j < size; j++) {
        if (seg[j]) {
          count++;
          if (count === nInt) return toResult(low + j);
        }
      }
    }

    throw new Error('prime() failed to find nth prime (bound too tight)');
  },
};


// —————————— PREPROCESSOR ——————————
function _processNumToken(token, decimalSep, thousandSep) {
  if (decimalSep !== null || thousandSep !== null) {
    const ds = decimalSep || '.', ts = thousandSep || ',';
    const escTs = ts.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escDs = ds.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let r = token.replace(new RegExp(escTs, 'g'), '');
    if (ds !== '.') r = r.replace(new RegExp(escDs, 'g'), '.');
    return r;
  }
  const hasComma = token.includes(','), hasPeriod = token.includes('.');
  if (!hasComma && !hasPeriod) return token;
  if (hasComma && hasPeriod) {
    return token.lastIndexOf('.') > token.lastIndexOf(',')
      ? token.replace(/,/g, '')
      : token.replace(/\./g, '').replace(/,(?=\d+$)/, '.');
  }
  if (hasComma) {
    const parts = token.split(',');
    if (parts.slice(1).every(p => p.length === 3)) return token.replace(/,/g, '');
    const idx = token.lastIndexOf(',');
    return token.slice(0, idx) + '.' + token.slice(idx + 1);
  }
  const parts = token.split('.');
  if (parts.length > 2 && parts.slice(1).every(p => p.length === 3)) return token.replace(/\./g, '');
  return token;
}

function preprocess(input, decimalSep, thousandSep, variables, sys) {
  const varNames = Object.keys(variables).sort((a, b) => b.length - a.length);
  const regexes  = Object.fromEntries(
    varNames.map(name => {
      const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return [name, new RegExp(`(?<![a-zA-Z0-9_])${esc}(?![a-zA-Z0-9_])`, 'gi')];
    })
  );

  // Step 1: variable substitution (unchanged)
  let s = input;
  const MAX_PASSES = varNames.length + 1;
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    let changed = false;
    for (const name of varNames) {
      const prev = s;
      s = s.replace(regexes[name], () => { changed = true; return `(${variables[name]})`; });
      if (changed && s !== prev) {
        const testRx = new RegExp(regexes[name].source, regexes[name].flags);
        if (testRx.test(s)) {
          const err = new Error(`Circular reference: "${name}" refers to itself`);
          err.bypassable = false;
          throw err;
        }
      }
    }
    if (!changed) break;
    if (pass === MAX_PASSES - 1) {
      const err = new Error('Circular reference inside variables');
      err.bypassable = false;
      throw err;
    }
  }

  // Step 2: separator normalisation
  const result = _depthAwareNormalise(s, decimalSep, thousandSep);

  // Step 3: integer validation — evaluate each variable's fully-expanded,
  // normalised value and confirm it resolves to a whole number.
  if (sys === 'integer') {
    for (const name of varNames) {
      // Expand this variable's value through the same substitution + normalisation
      // pipeline so any nested variable references are resolved first.
      const expandedRaw = preprocess(
        String(variables[name]), decimalSep, thousandSep, variables, null // null = skip integer check to avoid duplicate errors
      );
      let evaluated;
      try {
        // eslint-disable-next-line no-new-func
        evaluated = Function('"use strict"; return (' + expandedRaw + ')')();
      } catch {
        // If it doesn't evaluate (e.g. it's a sub-expression), skip — the
        // main formula evaluation will catch any real errors later.
        continue;
      }

      if (typeof evaluated !== 'number' || !Number.isInteger(evaluated)) {
        const err = new Error(`Variable "${name}" is not an integer`);
        err.bypassable = false;
        throw err;
      }
    }
  }

  return result;
}

// Normalise number-separator tokens in a string, tracking parenthesis depth.
// Process digit-led runs at all depths, but skip commas when inside function calls.
// A function call is detected as: identifier followed by '('
function _depthAwareNormalise(str, decimalSep, thousandSep) {
  let result = '', i = 0;
  const inFunctionCall = []; // Stack tracking whether each depth level is a function call
  
  while (i < str.length) {
    const ch = str[i];
    
    // Check if this '(' is part of a function call
    if (ch === '(') {
      // Look back to see if there's an identifier immediately before
      let j = result.length - 1;
      while (j >= 0 && /\s/.test(result[j])) j--; // Skip whitespace
      let hasIdentifier = false;
      if (j >= 0 && /[a-zA-Z0-9_]/.test(result[j])) {
        // There's an identifier-like character, this is likely a function call
        hasIdentifier = true;
      }
      inFunctionCall.push(hasIdentifier);
      result += ch;
      i++;
      continue;
    }
    
    if (ch === ')') {
      inFunctionCall.pop();
      result += ch;
      i++;
      continue;
    }
    
    // Process numbers - but skip comma processing if we're inside a function call
    if (/[0-9]/.test(ch)) {
      let tok = '';
      while (i < str.length && /[0-9,.]/.test(str[i])) tok += str[i++];
      
      // If we're inside a function call, don't process commas as thousand separators
      const isInFunctionCall = inFunctionCall.length > 0 && inFunctionCall[inFunctionCall.length - 1];
      if (isInFunctionCall && tok.includes(',')) {
        // Inside function call - preserve commas, only process the decimal separator
        result += tok;
      } else {
        // Normal context - process thousand/decimal separators
        result += _processNumToken(tok, decimalSep, thousandSep);
      }
      continue;
    }
    
    result += ch;
    i++;
  }
  return result;
}

// —————————— TOKENIZER ——————————
// Unit aliases are matched greedily, longest-first, by scanning the raw input
// string directly (including spaces and slashes like "km/h", "sq km").
// The keyword "to" is only emitted as TOKEN.TO when it appears between two unit
// tokens (the parser enforces the full UNIT TO UNIT sequence).

// Pre-sort alias keys longest-first once so the tokenizer loop is fast.
const _sortedUnitAliases = Array.from(_unitAliasMap.keys())
  .sort((a, b) => b.length - a.length);

const TOKEN = {
  NUMBER:'NUMBER', IDENT:'IDENT', BANG:'BANG', DBANG:'DBANG',
  PLUS:'PLUS', MINUS:'MINUS', STAR:'STAR', SLASH:'SLASH',
  CARET:'CARET', PERCENT:'PERCENT', LPAREN:'LPAREN', RPAREN:'RPAREN',
  COMMA:'COMMA', UNIT:'UNIT', TO:'TO', EOF:'EOF',
};

function tokenize(input, sys) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    // Skip whitespace
    if (/\s/.test(input[i])) { i++; continue; }

    // —————————— Number ——————————
    if (/[0-9]/.test(input[i]) || (input[i] === '.' && /[0-9]/.test(input[i+1] ?? ''))) {
      let num = '';
      while (i < input.length && /[0-9.]/.test(input[i])) num += input[i++];
      if (i < input.length && /[eE]/.test(input[i])) {
        num += input[i++];
        if (i < input.length && /[+\-]/.test(input[i])) num += input[i++];
        while (i < input.length && /[0-9]/.test(input[i])) num += input[i++];
      }
      tokens.push({ type: TOKEN.NUMBER, value: num });
      continue;
    }

    // —————————— Identifiers, keywords, unit names ——————————
    if (/[a-zA-Z_]/.test(input[i])) {
      // First collect the plain word identifier to check for keywords/functions.
      let nameStart = i;
      let name = '';
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) name += input[i++];
      const lower = name.toLowerCase();

      // 'to' keyword — only emit as TO, never as a unit
      if (lower === 'to') { tokens.push({ type: TOKEN.TO }); continue; }

      // Known function name followed by '(' — always treat as a function call.
      // Peek past whitespace to find the next non-space char.
      const nextNonSpace = input.slice(i).match(/^\s*(.)/);
      const nextCh = nextNonSpace ? nextNonSpace[1] : '';
      if (lower in FUNCTIONS && nextCh === '(') {
        tokens.push({ type: TOKEN.IDENT, value: lower });
        continue;
      }

      // Try to match a unit alias starting at nameStart.
      // Reset i to nameStart so we can re-scan including any '/' or spaces
      // that are part of multi-word aliases like "km/h" or "nautical miles".
      i = nameStart;
      let unitMatched = false;
      for (const alias of _sortedUnitAliases) {
        const end = i + alias.length;
        if (end > input.length) continue;
        if (input.slice(i, end).toLowerCase() !== alias) continue;
        // Word boundary check: the alias must not be a strict prefix of a longer word
        const afterChar = input[end] ?? '';
        const aliasEndsWithWord = /[a-zA-Z0-9_]/.test(alias[alias.length - 1]);
        if (aliasEndsWithWord && /[a-zA-Z0-9_]/.test(afterChar)) continue;
        tokens.push({ type: TOKEN.UNIT, value: alias });
        i = end;
        unitMatched = true;
        break;
      }
      if (unitMatched) continue;

      // Re-collect the plain identifier (reset consumed but not a unit)
      i = nameStart;
      name = '';
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) name += input[i++];
      const lower2 = name.toLowerCase();
      const builtinConsts = ['pi', 'e', 'phi', 'tau', 'n', 'v'];
      const specialFunctions = ['repeat', 'repeatsum', 'd'];
      if (lower2 in FUNCTIONS || builtinConsts.includes(lower2) || specialFunctions.includes(lower2)) {
        tokens.push({ type: TOKEN.IDENT, value: lower2 });
      }
      // Unknown identifiers silently dropped
      continue;
    }

    // —————————— Operators & punctuation ——————————
    switch (input[i]) {
      case '+': tokens.push({ type: TOKEN.PLUS });    i++; break;
      case '-': tokens.push({ type: TOKEN.MINUS });   i++; break;
      case '*': tokens.push({ type: TOKEN.STAR });    i++; break;
      case '/': tokens.push({ type: TOKEN.SLASH });   i++; break;
      case '^': tokens.push({ type: TOKEN.CARET });   i++; break;
      case '%': tokens.push({ type: TOKEN.PERCENT }); i++; break;
      case '!': 
        if (input[i + 1] === '!') {
          tokens.push({ type: TOKEN.DBANG });
          i += 2;
        } else {
          tokens.push({ type: TOKEN.BANG });
          i++;
        }
        break;
      case '(': tokens.push({ type: TOKEN.LPAREN });  i++; break;
      case ')': tokens.push({ type: TOKEN.RPAREN });  i++; break;
      case ',': tokens.push({ type: TOKEN.COMMA });   i++; break;
      default:  i++; break;
    }
  }

  tokens.push({ type: TOKEN.EOF });
  return tokens;
}


// —————————— PARSER ——————————
// Grammar (highest to lowest precedence):
//
//   expr           → conversion
//   conversion     → additive (UNIT TO UNIT)?
//   additive       → multiplicative (('+' | '-') multiplicative)*
//   multiplicative → factorial (('*' | '/' | '%') factorial)*
//   factorial      → power ('!')*
//   power          → unary ('^' unary)*         [right-associative]
//   unary          → ('-' | '+') unary | primary
//   primary        → NUMBER | IDENT '(' argList ')' | '(' expr ')'
//   argList        → expr (',' expr)*
//
// Unit conversion `UNIT TO UNIT` binds at the lowest precedence so that:
//   "5 + 5 km to mi"   →  convert (5+5=10) km to mi   = 6.213...
//   "(5+5) km to mi"   →  same, explicit grouping
//   "5 + (5 km to mi)" →  5 + 3.106...               = 8.106...  (parens override)

function createParser(tokens, trigMode, sys) {
  let pos = 0;
  const peek    = () => tokens[pos];
  const consume = () => tokens[pos++];
  const expect  = (type) => {
    const t = consume();
    if (t.type !== type) throw new Error(`Expected ${type}, got ${JSON.stringify(t)}`);
    return t;
  };

  // Top-level entry: additive result optionally followed by "UNIT to UNIT"
  function parseExpr() {
    const value = parseAdditive(sys);

    // Unit conversion: UNIT TO UNIT
    // Both the from-unit and to-unit tokens must be present for conversion to trigger.
    if (peek().type === TOKEN.UNIT) {
      if (sys == 'integer') {throw new Error('Unit conversions not available with integer calculation')};
      const fromAlias = consume().value;
      if (peek().type === TOKEN.TO) {
        consume(); // eat 'to'
        if (peek().type !== TOKEN.UNIT) throw new Error('Expected unit after "to"');
        const toAlias = consume().value;

        const fromUnit = _unitAliasMap.get(fromAlias.toLowerCase());
        const toUnit   = _unitAliasMap.get(toAlias.toLowerCase());
        if (!fromUnit || !toUnit) throw new Error(`Unknown unit: ${fromAlias} or ${toAlias}`);
        if (fromUnit.category !== toUnit.category)
          throw new Error(`Unit category mismatch: "${fromAlias}" vs "${toAlias}"`);

        const inBase = fromUnit.toBase(value);
        return toUnit.fromBase(inBase);
      }
      // UNIT without TO: leave it — the UNIT token is just silently consumed
      // (this handles "50 km" used as a bare annotation without conversion)
    }

    return value;
  }

  function parseAdditive(sys) {
    let left = parseMultiplicative(sys);
    while (peek().type === TOKEN.PLUS || peek().type === TOKEN.MINUS) {
      const op = consume().type, right = parseMultiplicative(sys);
      if (sys == 'integer') {left = op === TOKEN.PLUS ? left + right : left - right;}
      else {left = op === TOKEN.PLUS ? left.plus(right) : left.minus(right)};
    }
    return left;
  }

  function parseMultiplicative(sys) {
    let left = parseDoubleFactorial();
    while (peek().type===TOKEN.STAR || peek().type===TOKEN.SLASH || peek().type===TOKEN.PERCENT) {
      const op = consume().type, right = parseFactorial(sys);
      if (sys == 'integer') {
        if (op===TOKEN.STAR)       left = left * right;
        else if (op===TOKEN.SLASH) { if (right == 0) throw new Error('Division by zero'); left = left / right; }
        else                       left = left % right;
      }
      else {
        if (op===TOKEN.STAR)       left = left.multipliedBy(right);
        else if (op===TOKEN.SLASH) { if (right.isZero()) throw new Error('Division by zero'); left = left.dividedBy(right); }
        else                       left = left.modulo(right);
      };
    }
    return left;
  }

  function parseDoubleFactorial() {
    let val = parseFactorial(sys);
    if (peek().type === TOKEN.DBANG) { consume(); val = doubleFactorial(val, sys); }
    return val;
  }

  function parseFactorial(sys) {
    let val = parsePower(sys);
    if (peek().type === TOKEN.BANG) { consume(); val = factorial(val, sys); }
    return val;
  }

  function parsePower(sys) {
    const base = parseUnary(sys);
    if (sys == 'integer') {
      if (peek().type === TOKEN.CARET) {
        consume();
        const exp = parseUnary(sys);
        if ((exp > 100000n || exp < -100000n) && !BYPASS_LIMITS) {
          const err = new Error('Power exponent > 100000 (safety limit)');
          err.bypassable = true;
          throw err;
        }
        return base ** exp;
      }
    }
    else {
      if (peek().type === TOKEN.CARET) {
        consume();
        const exponent = parseUnary(sys);
        const exp = exponent.toNumber();
        if (Math.abs(exp) > 100000 && !BYPASS_LIMITS) {
          const err = new Error('Power exponent > 100000 (safety limit)');
          err.bypassable = true;
          throw err;
        }
        return _power(base, exponent);
      }
    };
    return base;
  }

  function parseUnary(sys) {
    if (sys == 'integer') {if (peek().type === TOKEN.MINUS) { consume(); return parseUnary(sys) * -1n}}
    else {if (peek().type === TOKEN.MINUS) { consume(); return parseUnary(sys).negated()}};
    if (peek().type === TOKEN.PLUS)  { consume(); return parseUnary(sys); }
    return parsePrimary(sys);
  }

  function parsePrimary(sys) {
    const t = peek();

    if (sys == 'integer') {if (t.type === TOKEN.NUMBER) { consume(); return BigInt(t.value)}}
    else {if (t.type === TOKEN.NUMBER) { consume(); return new BigNumber(t.value)}};

    if (t.type === TOKEN.IDENT) {
      consume();
      const name = t.value;
      if (peek().type === TOKEN.LPAREN) {
        consume();
        
        // Special handling for d(expr [, precision]) - returns decimal part of expr,
        // optionally re-evaluated at a custom precision level.
        if (name === 'd') {
          if (sys == 'integer') {
            throw new Error('d() is not valid with integer calculation');
          }
          else {
            // Collect inner expression tokens (depth-aware, stop at first top-level comma or ')')
            const exprTokens = [];
            let parenDepth = 0;
            while (true) {
              const tok = peek();
              if (tok.type === TOKEN.EOF) throw new Error('Unexpected end in d()');
              if ((tok.type === TOKEN.COMMA || tok.type === TOKEN.RPAREN) && parenDepth === 0) break;
              if (tok.type === TOKEN.LPAREN) parenDepth++;
              if (tok.type === TOKEN.RPAREN) parenDepth--;
              exprTokens.push(consume());
            }

            // Optional second argument: custom precision
            let customPrecision = null;
            if (peek().type === TOKEN.COMMA) {
              consume(); // eat ','
              const precVal = parseExpr();
              customPrecision = precVal.toNumber();
              if (!Number.isInteger(customPrecision) || customPrecision < 1) {
                throw new Error('d() precision argument must be a positive integer');
              }
              if (customPrecision > 1000 && !BYPASS_LIMITS) {
                const err = new Error('d() precision > 1000 (safety limit)');
                err.bypassable = true;
                throw err;
              }
            }
            expect(TOKEN.RPAREN);

            // Evaluate the inner expression, temporarily overriding precision if requested
            let innerVal;
            if (customPrecision !== null) {
              const savedPrecision = PRECISION;
              _setPrecision(customPrecision);
              try {
                const subTokens = [...exprTokens, { type: TOKEN.EOF }];
                const subParser = createParser(subTokens, trigMode, sys);
                innerVal = subParser.parseExpr();
              } finally {
                _setPrecision(savedPrecision);
              }
            } else {
              const subTokens = [...exprTokens, { type: TOKEN.EOF }];
              const subParser = createParser(subTokens, trigMode, sys);
              innerVal = subParser.parseExpr();
            }

            const decPart = innerVal.minus(innerVal.integerValue(BigNumber.ROUND_DOWN));
            return customPrecision !== null
              ? decPart.decimalPlaces(customPrecision, BigNumber.ROUND_DOWN)
              : decPart;
          }
        }

        // Special handling for repeatSum(expr, count) - sums expr evaluated with n=1,2,3,...
        if (name === 'repeatsum') {
          const exprTokens = [];
          let parenDepth = 0;
          
          while (true) {
            const tok = peek();
            if (tok.type === TOKEN.EOF) throw new Error('Unexpected end in repeatSum()');
            if (tok.type === TOKEN.COMMA && parenDepth === 0) break;
            if (tok.type === TOKEN.LPAREN) parenDepth++;
            if (tok.type === TOKEN.RPAREN) parenDepth--;
            exprTokens.push(consume());
          }
          
          expect(TOKEN.COMMA);
          const countVal = parseExpr();
          expect(TOKEN.RPAREN);
          
          const count = sys === 'integer' ? Number(countVal) : countVal.toNumber();
          if (!Number.isInteger(count) || count < 1) throw new Error('repeatSum() count must be a positive integer');
          if (count > 1000 && !BYPASS_LIMITS) {
            const err = new Error('repeatSum() count > 1000 (safety limit)');
            err.bypassable = true;
            throw err;
          }
          
          let result = sys === 'integer' ? 0n : new BigNumber(0);
          for (let i = 1; i <= count; i++) {
            _repeatN = sys === 'integer' ? BigInt(i) : new BigNumber(i);
            const subTokens = [...exprTokens, { type: TOKEN.EOF }];
            const subParser = createParser(subTokens, trigMode, sys);
            const iterResult = subParser.parseExpr();
            result = sys === 'integer' ? result + iterResult : result.plus(iterResult);
          }
          _repeatN = null;
          return result;
        }
        
        // Special handling for repeat(expr, count, startValue) - iterative with n and v
        if (name === 'repeat') {
          const exprTokens = [];
          let parenDepth = 0;
          
          while (true) {
            const tok = peek();
            if (tok.type === TOKEN.EOF) throw new Error('Unexpected end in repeat()');
            if (tok.type === TOKEN.COMMA && parenDepth === 0) break;
            if (tok.type === TOKEN.LPAREN) parenDepth++;
            if (tok.type === TOKEN.RPAREN) parenDepth--;
            exprTokens.push(consume());
          }
          
          expect(TOKEN.COMMA);
          const countVal = parseExpr();
          expect(TOKEN.COMMA);
          const startVal = parseExpr();
          expect(TOKEN.RPAREN);
          
          const count = sys === 'integer' ? Number(countVal) : countVal.toNumber();
          if (!Number.isInteger(count) || count < 1) throw new Error('repeat() count must be a positive integer');
          if (count > 1000 && !BYPASS_LIMITS) {
            const err = new Error('repeat() count > 1000 (safety limit)');
            err.bypassable = true;
            throw err;
          }
          
          _repeatV = startVal;
          for (let i = 1; i <= count; i++) {
            _repeatN = sys === 'integer' ? BigInt(i) : new BigNumber(i);
            const subTokens = [...exprTokens, { type: TOKEN.EOF }];
            const subParser = createParser(subTokens, trigMode, sys);
            const iterResult = subParser.parseExpr();
            _repeatV = iterResult;
          }
          const result = _repeatV;
          _repeatN = null;
          _repeatV = null;
          return result;
        }

        
        const args = [];
        if (peek().type !== TOKEN.RPAREN) {
          args.push(parseExpr());
          while (peek().type === TOKEN.COMMA) { consume(); args.push(parseExpr()); }
        }
        expect(TOKEN.RPAREN);
        const fn = FUNCTIONS[name];
        if (!fn) throw new Error(`Unknown function: ${name}()`);
        return fn(sys, args, trigMode);
      }
      
      // Built-in constants (recalculated dynamically when PRECISION changes)
      if (name === 'pi') {
        if (sys === 'integer') {throw new Error('"pi" not available with integer calculation')};
        return new BigNumber(_getPI().toString());
      }
      if (name === 'e') {
        if (sys === 'integer') {throw new Error('"e" not available with integer calculation')};
        return new BigNumber(_exp(new BigNumber(1)).toString());
      }
      if (name === 'phi') {
        if (sys === 'integer') {throw new Error('"phi" not available with integer calculation')};
        const sqrt5 = new BigNumber(5).sqrt();
        return new BigNumber(1).plus(sqrt5).dividedBy(2);
      }
      if (name === 'tau') {
        if (sys === 'integer') {throw new Error('"tau" not available with integer calculation')};
        return new BigNumber(_getPI().toString()).times(2);
      }
      
      // Repeat function context variables
      if (name === 'n') {
        if (_repeatN === null) throw new Error('"n" is only available inside repeat()');
        return _repeatN;
      }
      if (name === 'v') {
        if (_repeatV === null) throw new Error('"v" is only available inside repeat()');
        return _repeatV;
      }
      
      throw new Error(`Unknown identifier: ${name}`);
    }

    if (t.type === TOKEN.LPAREN) {
      consume();
      const val = parseExpr();
      expect(TOKEN.RPAREN);
      return val;
    }

    throw new Error(`Unexpected token: ${t.type}${t.value ? ` ("${t.value}")` : ''}`);
  }

  return { parseExpr, peek };
}


// —————————— CALCULATOR CREATION ——————————
function createCalculator() {
  const variables = Object.assign(window.settings.getVariables(), _defaultVariables);

  function setVariable(name, value, calc = 'false') {
    const key = name.toLowerCase().trim();
    if (!key) return {text:'Variable name cannot be empty',button:'none'};
    if (key in FUNCTIONS) return {text:`"${key}" is a reserved function name`,button:'none'};
    const builtinConsts = ['pi', 'e', 'phi', 'tau', 'n', 'v'];
    if (builtinConsts.includes(key)) return {text:`"${key}" is a reserved constant`,button:'none'};
    const builtinCalcs = ['calc1', 'calc2', 'calc3', 'calc4', 'calc5', 'calc6'];
    if (builtinCalcs.includes(key) && calc !== true) return {text:`"${key}" is a reserved variable name`,button:'none'};
    if (!/^[a-z_][a-z0-9_]*$/.test(key)) return {text:`Invalid variable name: "${key}"`,button:'none'};
    // Value can be a number, BigNumber, or any expression string (e.g. "pi/5", "2^10+1")
    if (calc == true && window.settings.getCalcSys() == 'integer') {variables[key] = BigInt(value.toString())}
    else {variables[key] = BigNumber.isBigNumber(value) ? value.toString() : String(value)};
  }

  function removeVariable(name) {
    const key = name.toLowerCase().trim();
    if (key in variables) { delete variables[key]; return true; }
    return false;
  }

  function getVariables() {
    return Object.assign({}, variables);
  }

  function calculate(formula, options = {}) {
    try {
      const calcSys = window.settings.getCalcSys();
      // Check precision limit before any calculation
      if (PRECISION > 10000 && !BYPASS_LIMITS && calcSys == 'decimal') {
        return { 
          result: '',
          full: '',
          fullnonformatted: '',
          error: { text: 'Precision > 10000 (safety limit)', button: 'bypass' } 
        };
      }

      if (typeof formula !== 'string' || formula.trim() === '') {
        return { result: '', full: '', fullnonformatted: '', error: { text: 'Empty formula', button: 'none' } };
      }

      const {
        decimalSep  = null,
        thousandSep = null,
        trigMode    = 'rad',
      } = options;

      if (decimalSep !== null && decimalSep === thousandSep) {
        return { result: '', full: '', fullnonformatted: '', error: { text: 'Separators cannot match', button: 'none' } };
      }

      const cleaned = preprocess(formula.trim(), decimalSep, thousandSep, variables, calcSys);
      const tokens  = tokenize(cleaned, calcSys);
      const parser  = createParser(tokens, trigMode, calcSys);
      const value   = parser.parseExpr();

      if (parser.peek().type !== TOKEN.EOF) {
        return { result: '', full: '', fullnonformatted: '', error: { text: 'Unexpected token after expression', button: 'none' } };
      }
      if (calcSys == 'decimal') {
        if (!BigNumber.isBigNumber(value) || !value.isFinite()) {
          return { result: '', full: '', fullnonformatted: '', error: { text: 'Non-finite result', button: 'none' } };
        }
        const rounded = value.decimalPlaces(PRECISION, BigNumber.ROUND_DOWN);
        return {
          result: rounded.toExponential(),
          full:   rounded.toFormat(fmt),
          fullnonformatted:   rounded.toFormat(fmtnonformatted),
          error:  null,
        }
      }
      else {
        if (fmt.groupSeparator.length == 0) {
          return {
            result: bigIntToSciNotation(value),
            full:   value.toString(),
            fullnonformatted:   value.toString(),
            error:  null,
          }
        }
        else {
          return {
            result: bigIntToSciNotation(value),
            full:   formatBigInt(value, fmt),
            fullnonformatted:   formatBigInt(value, fmtnonformatted),
            error:  null,
          }
        }
        
      }
      
    } catch (err) {
      // Catch and format error
      const isBypassable = err.bypassable === true;
      return {
        result: '',
        full:   '',
        fullnonformatted: '',
        error: {
          text:   err.message || 'Unknown error',
          button: isBypassable ? 'bypass' : 'none',
        },
      };
    }
  }

  function setBypassLimits(val) {
    BYPASS_LIMITS = !!val;
  }

  function getBypassLimits() {
    return BYPASS_LIMITS;
  }

  return { calculate, setVariable, removeVariable, getVariables, setBypassLimits, getBypassLimits, setPrecision: _setPrecision, getPrecision: () => PRECISION, UNIT_CATEGORIES };
}

const _defaultCalc = createCalculator();

function calculate(formula, options = {}) {
  return _defaultCalc.calculate(formula, options);
}

function setPrecision(val) {
  return _defaultCalc.setPrecision(val);
}

function getPrecision() {
  return _defaultCalc.getPrecision();
}

function formatBigInt(n, format) {
  if (format.groupSeparator == '') {return n.toString()};
  const sep = format.groupSeparator;
  const sign = n < 0n ? '-' : '';
  const str = (n < 0n ? -n : n).toString();

  const len = str.length;
  const firstGroupSize = len % 3 || 3;
  const partCount = Math.ceil(len / 3);
  const parts = new Array(partCount);

  parts[0] = str.slice(0, firstGroupSize);
  for (let i = 1; i < partCount; i++) {
    parts[i] = str.slice(firstGroupSize + (i - 1) * 3, firstGroupSize + i * 3);
  }

  return sign + parts.join(sep);
}

function bigIntToSciNotation(n) {
  if (n === 0n) return '0e+0';

  const sign = n < 0n ? '-' : '';
  const str = (n < 0n ? -n : n).toString();

  // Find last non-zero digit
  let lastNonZero = str.length - 1;
  while (lastNonZero > 0 && str[lastNonZero] === '0') lastNonZero--;

  const exponent = str.length - 1;
  const significand = lastNonZero === 0
    ? str[0]
    : str[0] + '.' + str.slice(1, lastNonZero + 1);

  const expSign = exponent >= 0 ? '+' : '-';
  return `${sign}${significand}e${expSign}${Math.abs(exponent)}`;
}

// =======================================================================================================
// =======================================================================================================

updateVariables();
refreshVariables();
if (window.settings.getVariablesVisible() === false) {varVis(false)};
if (window.settings.getCalcFormatted(1) === true) {calc1.children[5].style.background = "var(--pricol)"};
if (window.settings.getCalcFormatted(2) === true) {calc2.children[5].style.background = "var(--pricol)"};
if (window.settings.getCalcFormatted(3) === true) {calc3.children[5].style.background = "var(--pricol)"};
if (window.settings.getCalcFormatted(4) === true) {calc4.children[5].style.background = "var(--pricol)"};
if (window.settings.getCalcFormatted(5) === true) {calc5.children[5].style.background = "var(--pricol)"};
if (window.settings.getCalcFormatted(6) === true) {calc6.children[5].style.background = "var(--pricol)"};

// On startup: focus on calculator 1 formula input
setTimeout(function() {document.getElementById('loader').remove();calc1Formula.focus()}, 150)

// —————————— FORMULA AND RESULT LOGGING ——————————
setInterval(() => {
  const t = Date.now();
  const lastH = window.calchistory.get(0) || {formula:"", fullresult:"", result:"", calc:"calc1", precision:PRECISION, time:0, date:Date.now(), version:currentVersion, sys:window.settings.getCalcSys()};
  if ((t-calc1LastCalc.date) >= 2000 && calc1LastCalc.logged == false && !(calc1LastCalc.result == "ERROR") && calc1LastCalc.formula.length > 0 && calc1LastCalc.fullresult.length > 0 && !(calc1LastCalc.formula == lastH.formula && calc1LastCalc.fullresult == lastH.fullresult && calc1LastCalc.calc == lastH.calc && calc1LastCalc.sys == lastH.sys)) {
    window.calchistory.add(calc1LastCalc.formula, calc1LastCalc.fullresult, calc1LastCalc.result, calc1LastCalc.calc, calc1LastCalc.precision, calc1LastCalc.time, calc1LastCalc.date, calc1LastCalc.version, calc1LastCalc.sys);
    calc1LastCalc.logged = true;
  }
  if ((t-calc2LastCalc.date) >= 2000 && calc2LastCalc.logged == false && !(calc2LastCalc.result == "ERROR") && calc2LastCalc.formula.length > 0 && calc2LastCalc.fullresult.length > 0 && !(calc2LastCalc.formula == lastH.formula && calc2LastCalc.fullresult == lastH.fullresult && calc2LastCalc.calc == lastH.calc && calc2LastCalc.sys == lastH.sys)) {
    window.calchistory.add(calc2LastCalc.formula, calc2LastCalc.fullresult, calc2LastCalc.result, calc2LastCalc.calc, calc2LastCalc.precision, calc2LastCalc.time, calc2LastCalc.date, calc2LastCalc.version, calc1LastCalc.sys);
    calc2LastCalc.logged = true;
  }
  if ((t-calc3LastCalc.date) >= 2000 && calc3LastCalc.logged == false && !(calc3LastCalc.result == "ERROR") && calc3LastCalc.formula.length > 0 && calc3LastCalc.fullresult.length > 0 && !(calc3LastCalc.formula == lastH.formula && calc3LastCalc.fullresult == lastH.fullresult && calc3LastCalc.calc == lastH.calc && calc3LastCalc.sys == lastH.sys)) {
    window.calchistory.add(calc3LastCalc.formula, calc3LastCalc.fullresult, calc3LastCalc.result, calc3LastCalc.calc, calc3LastCalc.precision, calc3LastCalc.time, calc3LastCalc.date, calc3LastCalc.version, calc1LastCalc.sys);
    calc3LastCalc.logged = true;
  }
  if ((t-calc4LastCalc.date) >= 2000 && calc4LastCalc.logged == false && !(calc4LastCalc.result == "ERROR") && calc4LastCalc.formula.length > 0 && calc4LastCalc.fullresult.length > 0 && !(calc4LastCalc.formula == lastH.formula && calc4LastCalc.fullresult == lastH.fullresult && calc4LastCalc.calc == lastH.calc && calc4LastCalc.sys == lastH.sys)) {
    window.calchistory.add(calc4LastCalc.formula, calc4LastCalc.fullresult, calc4LastCalc.result, calc4LastCalc.calc, calc4LastCalc.precision, calc4LastCalc.time, calc4LastCalc.date, calc4LastCalc.version, calc1LastCalc.sys);
    calc4LastCalc.logged = true;
  }
  if ((t-calc5LastCalc.date) >= 2000 && calc5LastCalc.logged == false && !(calc5LastCalc.result == "ERROR") && calc5LastCalc.formula.length > 0 && calc5LastCalc.fullresult.length > 0 && !(calc5LastCalc.formula == lastH.formula && calc5LastCalc.fullresult == lastH.fullresult && calc5LastCalc.calc == lastH.calc && calc5LastCalc.sys == lastH.sys)) {
    window.calchistory.add(calc5LastCalc.formula, calc5LastCalc.fullresult, calc5LastCalc.result, calc5LastCalc.calc, calc5LastCalc.precision, calc5LastCalc.time, calc5LastCalc.date, calc5LastCalc.version, calc1LastCalc.sys);
    calc5LastCalc.logged = true;
  }
  if ((t-calc6LastCalc.date) >= 2000 && calc6LastCalc.logged == false && !(calc6LastCalc.result == "ERROR") && calc6LastCalc.formula.length > 0 && calc6LastCalc.fullresult.length > 0 && !(calc6LastCalc.formula == lastH.formula && calc6LastCalc.fullresult == lastH.fullresult && calc6LastCalc.calc == lastH.calc && calc6LastCalc.sys == lastH.sys)) {
    window.calchistory.add(calc6LastCalc.formula, calc6LastCalc.fullresult, calc6LastCalc.result, calc6LastCalc.calc, calc6LastCalc.precision, calc6LastCalc.time, calc6LastCalc.date, calc6LastCalc.version, calc1LastCalc.sys);
    calc6LastCalc.logged = true;
  }
}, 500);