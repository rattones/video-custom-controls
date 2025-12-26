
// Funções utilitárias para criar cada controle
function createPlayPauseButton(video, icons) {
  const btn = document.createElement("button");
  btn.setAttribute("aria-label", "Play/Pause");
  function updateIcon() {
    btn.innerHTML = video.paused
      ? `<img src="${icons.play}" alt="Play" title="Play" width="28" height="28" />`
      : `<img src="${icons.stop}" alt="Pause" title="Pause" width="28" height="28" />`;
  }
  btn.onclick = () => {
    if (video.paused) video.play();
    else video.pause();
    updateIcon();
  };
  video.addEventListener("play", updateIcon);
  video.addEventListener("pause", updateIcon);
  updateIcon();
  return btn;
}

function createRestartButton(video, icons) {
  const btn = document.createElement("button");
  btn.innerHTML = `<img src="${icons.restart}" alt="Restart video" title="Restart video" width="28" height="28" />`;
  btn.setAttribute("aria-label", "Restart video");
  btn.onclick = () => {
    video.currentTime = 0;
  };
  return btn;
}

function createRewindButton(video, icons) {
  const btn = document.createElement("button");
  btn.innerHTML = `<img src="${icons.rewind}" alt="Rewind 5 seconds" title="Rewind 5 seconds" width="28" height="28" />`;
  btn.setAttribute("aria-label", "Rewind 5 seconds");
  btn.onclick = () => {
    video.currentTime = Math.max(0, video.currentTime - 5);
  };
  return btn;
}

function createForwardButton(video, icons) {
  const btn = document.createElement("button");
  btn.innerHTML = `<img src="${icons.forward}" alt="Forward 5 seconds" title="Forward 5 seconds" width="28" height="28" />`;
  btn.setAttribute("aria-label", "Forward 5 seconds");
  btn.onclick = () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 5);
  };
  return btn;
}

function createVolumeSlider(video) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = 0;
  input.max = 1;
  input.step = 0.01;
  input.value = video.volume;
  input.classList.add("custom-volume-slider");
  input.setAttribute("aria-label", "Volume");
  input.oninput = () => {
    video.volume = input.value;
    video.muted = false;
  };
  input.onclick = () => {
    video.muted = false;
  };
  return input;
}

function createSpeedButton(video) {
  const speedSteps = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0];
  let speedIndex = speedSteps.indexOf(1.0);
  const btn = document.createElement("button");
  btn.setAttribute("aria-label", "Playback speed");
  btn.style.fontWeight = "bold";
  btn.textContent = `${speedSteps[speedIndex]}x`;
  function updateSpeed(increment) {
    speedIndex = (speedIndex + increment + speedSteps.length) % speedSteps.length;
    video.playbackRate = speedSteps[speedIndex];
    btn.textContent = `${speedSteps[speedIndex]}x`;
  }
  btn.onclick = () => {
    updateSpeed(1);
  };
  btn.oncontextmenu = (e) => {
    e.preventDefault();
    updateSpeed(-1);
  };
  return btn;
}

function createProgressBar(video) {
  const container = document.createElement("div");
  container.className = "progress-bar-container";
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  container.appendChild(bar);
  function update() {
    if (video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      bar.style.width = percent + "%";
    } else {
      bar.style.width = "0%";
    }
  }
  video.addEventListener("timeupdate", update);
  video.addEventListener("durationchange", update);
  video.addEventListener("progress", update);
  update();
  return { container, bar };
}

function createProgressInput(video) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = 0;
  input.max = 1000;
  input.value = 0;
  input.className = "custom-progress-input custom-progress-input-pos";
  input.setAttribute("aria-label", "Video progress");
  function update() {
    if (video.duration) {
      input.value = Math.floor((video.currentTime / video.duration) * 1000);
    } else {
      input.value = 0;
    }
  }
  video.addEventListener("timeupdate", update);
  video.addEventListener("durationchange", update);
  video.addEventListener("progress", update);
  input.addEventListener("input", () => {
    if (video.duration) {
      video.currentTime = (input.value / 1000) * video.duration;
    }
  });
  update();
  return input;
}

function setupAutoHide(controls, controlsBox, progressBarContainer, getOriginalBottom) {
  let hideTimeout = null;
  function hideControlsBox() {
    controlsBox.style.opacity = "0";
    controlsBox.style.pointerEvents = "none";
    controls.classList.add("minimized");
    controls.style.bottom = "0px";
  }
  function showControlsBox() {
    controlsBox.style.opacity = "1";
    controlsBox.style.pointerEvents = "auto";
    controls.classList.remove("minimized");
    controls.style.bottom = getOriginalBottom() + "px";
  }
  hideControlsBox();
  controls.addEventListener("mouseleave", (e) => {
    if (e.relatedTarget && progressBarContainer.contains(e.relatedTarget)) return;
    hideTimeout = setTimeout(hideControlsBox, 2000);
  });
  controls.addEventListener("mouseenter", () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    showControlsBox();
  });
  progressBarContainer.addEventListener("mouseenter", () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    showControlsBox();
  });
  progressBarContainer.addEventListener("mouseleave", (e) => {
    if (e.relatedTarget && controlsBox.contains(e.relatedTarget)) return;
    hideTimeout = setTimeout(hideControlsBox, 2000);
  });
  controlsBox.addEventListener("mouseenter", () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    showControlsBox();
  });
  controlsBox.addEventListener("mouseleave", (e) => {
    if (e.relatedTarget && progressBarContainer.contains(e.relatedTarget)) return;
    hideTimeout = setTimeout(hideControlsBox, 2000);
  });
}

function createControls(video) {
  if (video.hasCustomControls) return;
  if (!isFinite(video.duration) || isNaN(video.duration) || video.duration === 0) {
    const onMeta = () => {
      if (!isFinite(video.duration) || isNaN(video.duration) || video.duration === 0) {
        return;
      } else {
        video.removeEventListener('loadedmetadata', onMeta);
        createControls(video);
      }
    };
    video.addEventListener('loadedmetadata', onMeta);
    return;
  }
  video.hasCustomControls = true;
  const icons = {
    play: chrome.runtime.getURL('assets/play-circle.svg'),
    stop: chrome.runtime.getURL('assets/stop-circle.svg'),
    restart: chrome.runtime.getURL('assets/skip-start-circle.svg'),
    rewind: chrome.runtime.getURL('assets/rewind-circle.svg'),
    forward: chrome.runtime.getURL('assets/fast-forward-circle.svg'),
  };
  const controls = document.createElement("div");
  controls.className = "custom-video-controls";
  const controlsBox = document.createElement("div");
  controlsBox.className = "custom-controls-box";
  const { container: progressBarContainer } = createProgressBar(video);
  controls.appendChild(progressBarContainer);
  const playPause = createPlayPauseButton(video, icons);
  const restart = createRestartButton(video, icons);
  const rewind = createRewindButton(video, icons);
  const forward = createForwardButton(video, icons);
  const volume = createVolumeSlider(video);
  const speedBtn = createSpeedButton(video);
  const progressInput = createProgressInput(video);
  controls.appendChild(progressInput);
  controls.classList.add("custom-controls-relative");
  controlsBox.appendChild(restart);
  controlsBox.appendChild(rewind);
  controlsBox.appendChild(playPause);
  controlsBox.appendChild(forward);
  controlsBox.appendChild(volume);
  controlsBox.appendChild(speedBtn);
  controls.appendChild(controlsBox);
  const parent = video.parentNode;
  if (parent && parent.style.position !== "relative" && parent.style.position !== "absolute" && parent.style.position !== "fixed") {
    parent.style.position = "relative";
  }
  parent.appendChild(controls);
  let originalBottom = null;
  function updateControlsPosition() {
    const rect = video.getBoundingClientRect();
    const videoHeight = rect.height || video.offsetHeight;
    if (videoHeight) {
      const bottom = (videoHeight * 0.1);
      controls.style.bottom = bottom + "px";
      originalBottom = bottom;
    }
  }
  updateControlsPosition();
  window.addEventListener('resize', updateControlsPosition);
  video.addEventListener('loadedmetadata', updateControlsPosition);
  video.addEventListener('resize', updateControlsPosition);
  video.classList.add("custom-video-block");
  setupAutoHide(controls, controlsBox, progressBarContainer, () => originalBottom ?? 0);
}

function addControlsToVideos() {
  const videos = document.querySelectorAll("video");
  videos.forEach(function (video) {
    if (video.style.position === "absolute") {
      video.style.position = "";
    }
    if (!video.hasCustomControls) {
      createControls(video);
    }
  });
}

// MutationObserver otimizado para adicionar controles apenas a vídeos novos
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        if (node.tagName === "VIDEO") {
          if (!node.hasCustomControls) createControls(node);
        } else {
          // Se for container, busca vídeos dentro
          node.querySelectorAll && node.querySelectorAll("video").forEach(video => {
            if (!video.hasCustomControls) createControls(video);
          });
        }
      }
    });
  });
});
observer.observe(document.body, { childList: true, subtree: true });

addControlsToVideos();