# Video Custom Controls

A Chrome extension that adds custom controls (play, pause, rewind, forward, and volume) to all `<video>` elements on any website. The extension replaces the default browser video controls with a modern, floating UI and custom SVG icons.

## Features

- **Custom Play/Pause Button:** Uses SVG icons for play and pause.
- **Rewind & Forward:** Jump 5 seconds backward or forward.
- **Volume Slider:** Adjust the video volume directly from the custom controls.
- **Always Visible:** Controls float over the video and remain visible.
- **Works Everywhere:** Injects controls into all videos on all websites.
- **SPA Support:** Uses MutationObserver to handle dynamically loaded videos.


## Installation

1. Go to the Chrome Web Store and search for "Video Custom Controls".
2. Or directly access: [Video Custom Controls](https://chromewebstore.google.com/detail/video-custom-controls/clknmnfeamcbampmbjoihgonikcinafd)
3. Click "Add to Chrome" to install the extension.

## Usage

- Open any website with a video.
- The default controls will be hidden and replaced by the custom controls.
- Use the play/pause, rewind, forward, and volume buttons as needed.

## Project Structure

```
video-custom-controls/
├── assets/
│   ├── play-circle.svg
│   ├── stop-circle.svg
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