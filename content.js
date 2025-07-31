function createControls(video) {
  if (video.hasCustomControls) return; // Prevent multiple controls
  video.hasCustomControls = true;

  // Use chrome.runtime.getURL to get correct extension paths for icons
  const playIconSrc = chrome.runtime.getURL('assets/play-circle.svg');
  const stopIconSrc = chrome.runtime.getURL('assets/stop-circle.svg');
  const rewindIconSrc = chrome.runtime.getURL('assets/rewind-circle.svg');
  const forwardIconSrc = chrome.runtime.getURL('assets/fast-forward-circle.svg');

  const controls = document.createElement("div");
  controls.className = "custom-video-controls";

  // Progress bar container
  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "progress-bar-container";
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBarContainer.appendChild(progressBar);
  controls.appendChild(progressBarContainer);

  // Play/Pause Button (Play/Stop Circle)
  const playPause = document.createElement("button");
  playPause.innerHTML = video.paused
    ? `<img src="${playIconSrc}" alt="Play" title="Play" width="28" height="28" />`
    : `<img src="${stopIconSrc}" alt="Pause" title="Pause" width="28" height="28" />`;
  playPause.setAttribute("aria-label", "Play/Pause");
  playPause.onclick = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playPause.innerHTML = video.paused
      ? `<img src="${playIconSrc}" alt="Play" title="Play" width="28" height="28" />`
      : `<img src="${stopIconSrc}" alt="Pause" title="Pause" width="28" height="28" />`;
  };

  // Rewind 5s
  const rewind = document.createElement("button");
  rewind.innerHTML = `<img src="${rewindIconSrc}" alt="Rewind 5 seconds" title="Rewind 5 seconds" width="28" height="28" />`;
  rewind.setAttribute("aria-label", "Rewind 5 seconds");
  rewind.onclick = () => {
    video.currentTime = Math.max(0, video.currentTime - 5);
  };

  // Forward 5s
  const forward = document.createElement("button");
  forward.innerHTML = `<img src="${forwardIconSrc}" alt="Forward 5 seconds" title="Forward 5 seconds" width="28" height="28" />`;
  forward.setAttribute("aria-label", "Forward 5 seconds");
  forward.onclick = () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 5);
  };

  // Volume slider
  const volume = document.createElement("input");
  volume.type = "range";
  volume.min = 0;
  volume.max = 1;
  volume.step = 0.01;
  volume.value = video.volume;
  volume.style.width = "80px";
  volume.setAttribute("aria-label", "Volume");
  volume.oninput = () => {
    video.volume = volume.value;
  };

  // Update playPause icon on video events
  video.addEventListener("play", () => {
    playPause.innerHTML = `<img src="${stopIconSrc}" alt="Pause" title="Pause" width="28" height="28" />`;
  });
  video.addEventListener("pause", () => {
    playPause.innerHTML = `<img src="${playIconSrc}" alt="Play" title="Play" width="28" height="28" />`;
  });

  // Update progress bar as video plays
  function updateProgress() {
    if (video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      progressBar.style.width = percent + "%";
    } else {
      progressBar.style.width = "0%";
    }
  }
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("durationchange", updateProgress);
  video.addEventListener("progress", updateProgress);
  // Initial update
  updateProgress();

  controls.appendChild(rewind);
  controls.appendChild(playPause);
  controls.appendChild(forward);
  controls.appendChild(volume);

  // Set the parent of video to relative so absolute controls can float over video
  const parent = video.parentNode;
  if (parent && parent.style.position !== "relative" && parent.style.position !== "absolute" && parent.style.position !== "fixed") {
    parent.style.position = "relative";
  }
  // Place controls as the last element inside the parent, so it overlays the video
  parent.appendChild(controls);

  // Optional: style video to avoid overlap
  video.style.display = "block";
}

function addControlsToVideos() {
  document.querySelectorAll("video").forEach(createControls);
}

// For dynamically added videos (e.g. SPA), use MutationObserver
const observer = new MutationObserver(addControlsToVideos);
observer.observe(document.body, { childList: true, subtree: true });

addControlsToVideos();