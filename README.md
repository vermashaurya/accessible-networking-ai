# ML-Keras Robotic Mechanism [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/vermashaurya/ML-Keras-Bot)

A robotic control platform combining a real-time web dashboard, UDP socket networking, and AI-powered emotion detection. Built with accessibility at its core.

**Live at:** https://vermashaurya.github.io/ML-Keras-Bot

## Overview

This project provides a full-stack interface for controlling a robot over a UDP socket connection. The web UI serves as the control surface — sending directional commands, streaming a live camera feed, running real-time emotion analysis, and supporting two-way chat. A Python tkinter GUI and UDP socket layer handle the backend communication.

## Features

**Web Dashboard**
- Live robot status, quick D-pad controls, camera preview, emotion detection, and recent chat — all on one screen

**Robot Controller**
- Full directional control: Forward, Backward, Left, Right, Rotate Left/Right, Stop
- Keyboard shortcuts: Arrow keys, `Q`/`E` to rotate, `Space` to stop
- Timestamped command log

**Camera & Emotion Detection**
- Live webcam feed with REC indicator and timestamp overlay
- Real-time emotion analysis (Happy, Neutral, Sad, Surprised, Angry) with confidence bars

**Chat**
- Text and voice messaging with simulated responses
- Dashboard preview of recent messages

**Python Backend**
- `PID/controller.py` — tkinter GUI for local robot command dispatch
- `Socket/server.py` — UDP server on `localhost:12371`
- `Socket/client.py` — UDP client on `localhost:12370`


## Project Structure

```
accessible-networking-ai/
├── Frontend/
│   └── UI/
│       ├── index.html       # Single-page app shell
│       ├── script.js        # All UI logic and state
│       └── styles.css       # CSS variables, theming, responsive layout
├── PID/
│   └── controller.py        # tkinter robot controller GUI
├── Socket/
│   ├── server.py            # UDP server (port 12371)
│   └── client.py            # UDP client (port 12370)
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages auto-deploy
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Web UI

No build step required. Open `Frontend/UI/index.html` directly in a browser, or serve it with any static file server:

```bash
cd Frontend/UI
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

### Python Backend

---


Requires Python 3 with `tkinter` (included in most standard installs).

Start the UDP server:

```bash
python3 Socket/server.py
```

Start the UDP client (in a separate terminal):

```bash
python3 Socket/client.py
```

Launch the tkinter controller GUI:

```bash
python3 PID/controller.py
```

### Socket Ports

---

| Component | Address           |
|-----------|-------------------|
| Server    | `localhost:12371` |
| Client    | `localhost:12370` |


## Keyboard Shortcuts

| Key          | Action       |
|--------------|--------------|
| `↑`          | Forward      |
| `↓`          | Backward     |
| `←`          | Left         |
| `→`          | Right        |
| `Q`          | Rotate Left  |
| `E`          | Rotate Right |
| `Space`      | Stop         |

Shortcuts are active on the Dashboard and Robot Controller views.

---

## License

Licensed under the [Apache License 2.0](LICENSE).

Copyright (c) 2026
<img src = name-geo1.avif width="600px"><br>

[![License](https://img.shields.io/badge/License-Apache%202.0-green?style=flat-square)](LICENSE)
