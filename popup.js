const noVideoEl = document.getElementById("no-video");
const panelEl = document.getElementById("panel");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const seekEl = document.getElementById("seek");
const playPauseBtn = document.getElementById("play-pause");
const playPauseIcon = document.getElementById("play-pause-icon");
const restartBtn = document.getElementById("restart");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");
const volumeEl = document.getElementById("volume");
const speedBtn = document.getElementById("speed");
const fullscreenBtn = document.getElementById("fullscreen");
const fullscreenIcon = document.getElementById("fullscreen-icon");

let tabId = null;
let isSeeking = false;
let isAdjustingVolume = false;
let lastDuration = 0;

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function getActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ? tab.id : null;
}

async function sendMessage(type, payload) {
  if (!tabId) return null;
  try {
    return await chrome.tabs.sendMessage(tabId, { type, payload });
  } catch (e) {
    return null;
  }
}

function applyState(state) {
  if (!state || !state.found) {
    noVideoEl.hidden = false;
    panelEl.hidden = true;
    return;
  }
  noVideoEl.hidden = true;
  panelEl.hidden = false;

  playPauseIcon.src = state.paused ? "assets/play-circle.svg" : "assets/stop-circle.svg";
  playPauseIcon.alt = state.paused ? "Play" : "Pause";

  lastDuration = state.duration;
  if (!isSeeking) {
    currentTimeEl.textContent = formatTime(state.currentTime);
    durationEl.textContent = formatTime(state.duration);
    seekEl.value = state.duration ? Math.floor((state.currentTime / state.duration) * 1000) : 0;
  }

  if (!isAdjustingVolume) {
    volumeEl.value = state.muted ? 0 : state.volume;
  }

  speedBtn.textContent = `${state.playbackRate}x`;

  fullscreenIcon.src = state.isFullscreen ? "assets/fullscreen-exit.svg" : "assets/fullscreen.svg";
  fullscreenIcon.alt = state.isFullscreen ? "Sair da tela cheia" : "Tela cheia";
}

async function refreshState() {
  const state = await sendMessage("getState");
  applyState(state);
}

playPauseBtn.addEventListener("click", async () => {
  applyState(await sendMessage("playPause"));
});

restartBtn.addEventListener("click", async () => {
  applyState(await sendMessage("restart"));
});

rewindBtn.addEventListener("click", async () => {
  applyState(await sendMessage("rewind"));
});

forwardBtn.addEventListener("click", async () => {
  applyState(await sendMessage("forward"));
});

seekEl.addEventListener("input", () => {
  isSeeking = true;
  currentTimeEl.textContent = formatTime((Number(seekEl.value) / 1000) * lastDuration);
});

seekEl.addEventListener("change", async () => {
  const fraction = Number(seekEl.value) / 1000;
  applyState(await sendMessage("seek", { fraction }));
  isSeeking = false;
});

volumeEl.addEventListener("input", () => {
  isAdjustingVolume = true;
});

volumeEl.addEventListener("change", async () => {
  applyState(await sendMessage("setVolume", { value: Number(volumeEl.value) }));
  isAdjustingVolume = false;
});

speedBtn.addEventListener("click", async () => {
  applyState(await sendMessage("cycleSpeed", { direction: 1 }));
});

speedBtn.addEventListener("contextmenu", async (e) => {
  e.preventDefault();
  applyState(await sendMessage("cycleSpeed", { direction: -1 }));
});

fullscreenBtn.addEventListener("click", async () => {
  applyState(await sendMessage("toggleFullscreen"));
});

(async function init() {
  tabId = await getActiveTabId();
  await refreshState();
  setInterval(refreshState, 500);
})();
