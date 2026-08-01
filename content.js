// Content script: não injeta mais nenhum painel na página. Apenas expõe o(s)
// <video> da página para o popup da extensão via mensagens, e recebe comandos
// (play/pause, seek, volume, velocidade, fullscreen) de lá.

const speedSteps = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0];
const speedIndexByVideo = new WeakMap();

function getMostVisibleVideo() {
  const videos = Array.from(document.querySelectorAll("video"));
  if (videos.length === 0) return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let best = null;
  let bestScore = -1;
  videos.forEach((video) => {
    const rect = video.getBoundingClientRect();
    const visibleWidth = Math.max(0, Math.min(rect.right, vw) - Math.max(rect.left, 0));
    const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
    const visibleArea = visibleWidth * visibleHeight;
    if (visibleArea <= 0) return;
    const score = visibleArea + (!video.paused ? 1 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = video;
    }
  });
  return best;
}

function isVideoFullscreen(video) {
  return document.fullscreenElement === video || document.fullscreenElement === video.parentElement;
}

function describeState(video) {
  return {
    found: true,
    paused: video.paused,
    currentTime: video.currentTime,
    duration: isFinite(video.duration) ? video.duration : 0,
    volume: video.volume,
    muted: video.muted,
    playbackRate: video.playbackRate,
    isFullscreen: isVideoFullscreen(video),
  };
}

function requestFullscreenOn(video) {
  const container = video.parentElement || video;
  const request =
    container.requestFullscreen ||
    container.webkitRequestFullscreen ||
    container.mozRequestFullScreen ||
    container.msRequestFullscreen;
  if (request) request.call(container);
}

function exitFullscreen() {
  const exit =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;
  if (exit) exit.call(document);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const video = getMostVisibleVideo();
  if (!video) {
    sendResponse({ found: false });
    return;
  }

  switch (message.type) {
    case "getState":
      sendResponse(describeState(video));
      break;
    case "playPause":
      if (video.paused) video.play();
      else video.pause();
      sendResponse(describeState(video));
      break;
    case "restart":
      video.currentTime = 0;
      sendResponse(describeState(video));
      break;
    case "rewind":
      video.currentTime = Math.max(0, video.currentTime - 5);
      sendResponse(describeState(video));
      break;
    case "forward":
      video.currentTime = Math.min(video.duration || video.currentTime, video.currentTime + 5);
      sendResponse(describeState(video));
      break;
    case "seek":
      if (video.duration) video.currentTime = message.payload.fraction * video.duration;
      sendResponse(describeState(video));
      break;
    case "setVolume":
      video.volume = message.payload.value;
      video.muted = false;
      sendResponse(describeState(video));
      break;
    case "toggleMute":
      video.muted = !video.muted;
      sendResponse(describeState(video));
      break;
    case "cycleSpeed": {
      let idx = speedIndexByVideo.has(video) ? speedIndexByVideo.get(video) : speedSteps.indexOf(1.0);
      idx = (idx + message.payload.direction + speedSteps.length) % speedSteps.length;
      speedIndexByVideo.set(video, idx);
      video.playbackRate = speedSteps[idx];
      sendResponse(describeState(video));
      break;
    }
    case "toggleFullscreen":
      if (!document.fullscreenElement) requestFullscreenOn(video);
      else exitFullscreen();
      sendResponse(describeState(video));
      break;
    default:
      sendResponse({ found: true, error: "unknown message type" });
  }
});
