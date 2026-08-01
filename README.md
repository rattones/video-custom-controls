# Video Custom Controls

A Chrome extension that lets you control any `<video>` element on any website — play, pause, rewind, forward, volume, playback speed, seek and fullscreen — from the extension's toolbar popup, instead of an overlay drawn on top of the page.

This design avoids conflicts with sites that use complex nested CSS stacking contexts (e.g. Instagram), where an on-page overlay panel can end up rendered behind the site's own UI and stop receiving clicks/hover.

## Features

- **Popup-based controls:** Click the extension icon to open a small control panel — no UI is injected into the page.
- **Auto-detects the active video:** If a page has multiple videos (e.g. a feed with several preloaded videos), the popup automatically controls the one that's most visible on screen.
- **Play/Pause, Restart, Rewind/Forward (5s), Volume, Interactive seek bar, Playback speed** (click to increase, right-click to decrease), **Fullscreen toggle**.
- **Native controls hidden:** the browser's default video control bar stays hidden, as before.
- **Works everywhere:** any `<video>` element on any website.

## Installation

1. Go to the Chrome Web Store and search for "Video Custom Controls".
2. Or directly access: [Video Custom Controls](https://chromewebstore.google.com/detail/video-custom-controls/clknmnfeamcbampmbjoihgonikcinafd)
3. Click "Add to Chrome" to install the extension.

## Usage

- Open any website with a video and click the extension icon in the toolbar.
- The popup shows controls for whichever video is most visible on the page.
- Use the restart, play/pause, rewind, forward, volume slider, seek bar, fullscreen, and speed buttons as needed.
- Left-click the speed button to increase playback speed, right-click to decrease.

## Project Structure

```
video-custom-controls/
├── assets/
│   ├── play-circle.svg
│   ├── stop-circle.svg
│   ├── skip-start-circle.svg
│   ├── rewind-circle.svg
│   ├── fast-forward-circle.svg
│   ├── fullscreen.svg
│   └── fullscreen-exit.svg
├── content.js
├── styles.css
├── popup.html
├── popup.css
├── popup.js
├── manifest.json
└── README.md
```

- **assets/**: SVG icons used by the popup.
- **content.js**: Hides native video controls and responds to popup commands (play/pause, seek, volume, speed, fullscreen) for the currently active video.
- **styles.css**: Hides the browser's native video control bar.
- **popup.html / popup.css / popup.js**: The toolbar popup UI and its logic.
- **manifest.json**: Chrome extension manifest.


## License

MIT

## Author

[Marcelo Ratton](https://github.com/rattones)

## Repository

[https://github.com/rattones/video-custom-controls](https://github.com/rattones/video-custom-controls)