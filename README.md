# 🧠 JEEVA M I // Cyberpunk 3D Neural Portfolio

A production-ready, ultra-high-voltage Cyberpunk Portfolio engineered for **Jeeva M I** (AI & DeepStream Systems Architect / Computer Vision Engineer).

---

## ⚡ Key Updates & Enhancements

### 1. Fixed Alignment (Zero-Wrapping Navigation & Controls)
- **Bracket Isolation Fix**: Resolved the closing bracket `]` line-wrapping bug across all viewports by setting strict `white-space: nowrap !important;`, `display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;` and wrapping button text inside `.nav-link-text`.
- **Responsive Telemetry Cascading**:
  - `> 1380px`: Full HUD telemetry (CORE, FPS, LAT, TIME).
  - `1180px – 1380px`: Streamlined telemetry (CORE & FPS only).
  - `< 1180px`: Telemetry automatically hidden to give navigation buttons breathing room.
  - `< 980px`: Full cyber mobile drawer with backdrop blur (`backdrop-filter: blur(20px)`) and glowing brackets.
  - `< 580px`: Compact mobile navbar; hides audio text label, showing dynamic equalizer soundbars.
- **Card, Grid & Footer Alignments**: Synchronized card heights across Projects, Skills Matrix, Deployment Logs, and Contact Uplink.

---

### 2. Creative Upgrades (Futuristic Immersion)
- **Procedural Ambient Cyber Drone**:
  - Synthesizes a warm, binaural sci-fi background hum (55 Hz / 55.45 Hz detuned dual oscillators with LFO filter sweep) via Web Audio API. 100% code-synthesized with zero external audio assets.
  - Toggleable via the navbar `[ 📻 DRONE ]` button or the floating quick HUD dock.
- **3D Synaptic Photonic Pulse Wave**:
  - Click `[ SYNAPTIC PULSE ]` on the Brain HUD or type `pulse` in the terminal to launch a 4.8 GW photonic energy wave rippling outward from the brainstem through all 7,500 particles with sub-bass audio resonance.
- **Autonomous Swarm Satellite Agents**:
  - 4 interactive holographic agent nodes orbiting the 3D brain on inclined 3D gimbal axes with glowing octahedron cores and icosahedron wireframe shields (DeepStream Edge, Autonomous LLM, Aerial Drone CV, Graph Neural Net).
- **Interactive Matrix Rain Canvas**:
  - Lightweight fullscreen canvas digital rain cascading in real-time, toggleable via `[ 🟢 MATRIX ]` in the quick HUD or typing `matrix` in the terminal.
- **System Overdrive / Glitch Mode**:
  - Click `[ ⚡ OVERDRIVE ]` or type `glitch` in the CLI to trigger a global chromatic aberration pulse, particle scatter, and synthesized audio glitch.
- **Live Simulated Runtime Logs in Modals**:
  - Deep-dive project modals now feature real-time simulated telemetry output (RAG cosine embeddings, DeepStream 5-channel RTSP tensor throughput, YOLO UAV drone coordinates, and MuleNet GNN community cluster modularity).
- **ScrollSpy Navbar Tracker**:
  - Navigation links automatically detect the active section and highlight with glowing neon brackets as you scroll.
- **Floating Cyber Quick-HUD**:
  - Sleek dock on the bottom-right corner for quick actions: `[ ▲ TOP ]`, `[ ⚡ GLITCH ]`, `[ 🟢 MATRIX ]`, `[ 📻 DRONE ]`, `[ 💻 CLI ]`.

---

## 🚀 Vercel Deployment Guide

This project is 100% upload-ready for Vercel with zero build configuration required.

### Method 1: Instant Drag-and-Drop ZIP (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Drag and drop the ready file **`jeeva-portfolio-vercel.zip`** into Vercel's upload dropzone.
3. Click **Deploy**. Your portfolio will be live on a `*.vercel.app` URL within seconds!

### Method 2: GitHub Repository Push
1. Push this folder to your GitHub account (`https://github.com/Jeevamoorthy/portfolio`).
2. On Vercel, click **"Add New Project"** -> **"Import Git Repository"**.
3. Select your repository. Framework preset will automatically be detected as **"Other" (Static)**.
4. Click **Deploy**.

### Method 3: Vercel CLI
```bash
npx vercel
```
Accept the default prompts and your portfolio will be instantly deployed.

---

## 📁 Project Structure
```
├── favicon.svg                  # Glowing Cyberpunk Vector Icon
├── index.html                   # Semantic HTML5 Cyberpunk Hub with OpenGraph & PWA meta
├── manifest.json                # Web App Manifest
├── package.json                 # Project metadata & deployment config
├── vercel.json                  # Production Vercel routing, cache & security headers
├── .vercelignore                # Vercel deployment exclusions
├── jeeva-portfolio-vercel.zip   # Ready-to-upload ZIP for 1-click Vercel deployment
├── css/
│   └── cyberpunk.css            # Complete styling, neon glow, HUD layout & responsive rules
├── js/
│   ├── audio.js                 # Web Audio API synthesizer (SFX + Ambient Drone)
│   ├── brain3d.js               # Three.js 3D Brain Engine, Synaptic Pulse & Swarm Satellites
│   ├── terminal.js              # Netrunner CLI with interactive subroutines & telemetry
│   └── main.js                  # Coordinator, Matrix rain, Tilt, Glitch, ScrollSpy & Floating HUD
├── vendor/
│   ├── three.min.js             # Three.js library
│   └── OrbitControls.js         # Camera controls
└── start_portfolio.bat          # Desktop launch shortcut
```

---

## 💻 Local Testing
Run with Python:
```bash
python -m http.server 8080
```
Open `http://localhost:8080` in any browser.
