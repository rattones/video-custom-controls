# Video Custom Controls

A Chrome extension that adds custom controls (play, pause, rewind, forward, and volume) to all `<video>` elements on any website. The extension replaces the default browser video controls with a modern, floating UI and custom SVG icons.


## Features

- **Custom Play/Pause Button:** Uses SVG icons for play and pause.
- **Restart Button:** Instantly jump back to the beginning of the video with a single click.
- **Rewind & Forward:** Jump 5 seconds backward or forward.
- **Volume Slider:** Adjust the video volume directly from the custom controls.
- **Playback Speed Button:** Change the video playback speed with a dedicated button (left-click to increase, right-click to decrease).
- **Interactive Progress Bar:** Drag and control the current playback position with a fully interactive progress bar.
- **Auto-Hide Controls:** Controls automatically minimize to show only the progress bar when not in use, expanding on hover.
- **Modern Design:** Sleek floating UI with custom red-themed progress indicators and consistent button styling.
- **Works Everywhere:** Injects controls into all videos on all websites.
- **SPA Support:** Uses MutationObserver to handle dynamically loaded videos.

## Installation

1. Go to the Chrome Web Store and search for "Video Custom Controls".
2. Or directly access: [Video Custom Controls](https://chromewebstore.google.com/detail/video-custom-controls/clknmnfeamcbampmbjoihgonikcinafd)
3. Click "Add to Chrome" to install the extension.

## Usage

- Open any website with a video.
- The default controls will be hidden and replaced by the custom controls.
- Hover over the video to expand the full control panel.
- Use the restart, play/pause, rewind, forward, volume slider, and speed buttons as needed.
- Left-click the speed button to increase playback speed, right-click to decrease.
- The controls automatically minimize to a slim progress bar when your cursor moves away.

## Project Structure

```
video-custom-controls/
├── assets/
│   ├── play-circle.svg
│   ├── stop-circle.svg
│   ├── skip-start-circle.svg
│   ├── rewind-circle.svg
│   └── fast-forward-circle.svg
├── content.js
├── styles.css
├── manifest.json
└── README.md
```

- **assets/**: SVG icons for the controls.
- **content.js**: Injects and manages the custom controls.
- **styles.css**: Styles for the custom controls UI.
- **manifest.json**: Chrome extension manifest.


## License

MIT

## Author

[Marcelo Ratton](https://github.com/rattones)

## Repository

[https://github.com/rattones/video-custom-controls](https://github.com/rattones/video-custom-controls)