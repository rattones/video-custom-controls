function createControls(video) {
  if (video.hasCustomControls) return; // Prevent multiple controls
  // Se não for possível calcular progresso (ex: live), não exibe controles customizados
  // duration === Infinity ou NaN indica live ou sem progresso
  if (!isFinite(video.duration) || isNaN(video.duration) || video.duration === 0) {
    // Mas pode ser que o metadata ainda não foi carregado, então escuta o evento
    const onMeta = () => {
      if (!isFinite(video.duration) || isNaN(video.duration) || video.duration === 0) {
        // Não exibe controles
        return;
      } else {
        video.removeEventListener('loadedmetadata', onMeta);
        createControls(video); // tenta de novo
      }
    };
    video.addEventListener('loadedmetadata', onMeta);
    return;
  }
  video.hasCustomControls = true;

  // Use chrome.runtime.getURL to get correct extension paths for icons
  const playIconSrc = chrome.runtime.getURL('assets/play-circle.svg');
  const stopIconSrc = chrome.runtime.getURL('assets/stop-circle.svg');
  const rewindIconSrc = chrome.runtime.getURL('assets/rewind-circle.svg');
  const forwardIconSrc = chrome.runtime.getURL('assets/fast-forward-circle.svg');

  const controls = document.createElement("div");
  controls.className = "custom-video-controls";
  // Para manipular visibilidade dos controles (exceto barra de progresso)
  let hideTimeout = null;

  // Elemento para agrupar os controles (exceto barra de progresso)
  const controlsBox = document.createElement("div");
  controlsBox.className = "custom-controls-box";

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

  // Adiciona os controles na box
  controlsBox.appendChild(rewind);
  controlsBox.appendChild(playPause);
  controlsBox.appendChild(forward);
  controlsBox.appendChild(volume);

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

  // Adiciona a box de controles (exceto barra de progresso)
  controls.appendChild(controlsBox);

  // Set the parent of video to relative so absolute controls can float over video
  const parent = video.parentNode;
  if (parent && parent.style.position !== "relative" && parent.style.position !== "absolute" && parent.style.position !== "fixed") {
    parent.style.position = "relative";
  }
  // Place controls as the last element inside the parent, so it overlays the video
  parent.appendChild(controls);

  // Define a base da caixa principal a 80% da altura do vídeo
  function updateControlsPosition() {
    const rect = video.getBoundingClientRect();
    const videoHeight = rect.height || video.offsetHeight;
    if (videoHeight) {
      controls.style.bottom = (videoHeight * 0.1) + "px";
    }
  }
  // Atualiza ao carregar e ao redimensionar
  updateControlsPosition();
  window.addEventListener('resize', updateControlsPosition);
  video.addEventListener('loadedmetadata', updateControlsPosition);
  video.addEventListener('resize', updateControlsPosition);

  // Optional: style video to avoid overlap
  video.style.display = "block";

  // --- Lógica de ocultação automática dos controles ---
  // Esconde a box de controles (não a barra de progresso)

  function hideControlsBox() {
    controlsBox.style.opacity = "0";
    controlsBox.style.pointerEvents = "none";
    controls.classList.add("minimized");
  }
  // Mostra a box de controles
  function showControlsBox() {
    controlsBox.style.opacity = "1";
    controlsBox.style.pointerEvents = "auto";
    controls.classList.remove("minimized");
  }

  // Inicialmente oculta (minimizada)
  hideControlsBox();

  // Mouse sai da área da caixa principal: inicia timer para esconder
  controls.addEventListener("mouseleave", (e) => {
    // Só esconde se não está sobre a barra de progresso
    if (e.relatedTarget && progressBarContainer.contains(e.relatedTarget)) return;
    hideTimeout = setTimeout(hideControlsBox, 2000);
  });
  // Mouse entra na área da caixa principal: mostra imediatamente e cancela timer
  controls.addEventListener("mouseenter", () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    showControlsBox();
  });
  // Mouse entra na barra de progresso: mostra imediatamente
  progressBarContainer.addEventListener("mouseenter", () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    showControlsBox();
  });
  // Mouse sai da barra de progresso: se não está sobre a caixa, inicia timer
  progressBarContainer.addEventListener("mouseleave", (e) => {
    if (e.relatedTarget && controlsBox.contains(e.relatedTarget)) return;
    hideTimeout = setTimeout(hideControlsBox, 2000);
  });
  // Ao interagir com qualquer controle, mostra imediatamente
  controlsBox.addEventListener("mouseenter", () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    showControlsBox();
  });
  controlsBox.addEventListener("mouseleave", (e) => {
    if (e.relatedTarget && progressBarContainer.contains(e.relatedTarget)) return;
    hideTimeout = setTimeout(hideControlsBox, 2000);
  });
  // Fim da lógica de ocultação
}

function addControlsToVideos() {
  document.querySelectorAll("video").forEach(createControls);
}

// For dynamically added videos (e.g. SPA), use MutationObserver
const observer = new MutationObserver(addControlsToVideos);
observer.observe(document.body, { childList: true, subtree: true });

addControlsToVideos();