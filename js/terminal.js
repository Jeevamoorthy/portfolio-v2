/**
 * CyberTerminal - Interactive Cyberpunk Shell
 * Netrunner CLI with command parsing, matrix rain, 3D brain linking,
 * simulated live DeepStream telemetry, and decryption sequences.
 */

class CyberTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.output = this.container.querySelector('.terminal-output');
    this.input = this.container.querySelector('.terminal-input');
    this.promptUser = 'jeeva@neural-core:~$';
    this.history = [];
    this.historyIndex = -1;
    this.matrixInterval = null;

    this.commands = {
      help: () => this.cmdHelp(),
      about: () => this.cmdAbout(),
      bio: () => this.cmdAbout(),
      projects: () => this.cmdProjects(),
      proj: () => this.cmdProjects(),
      skills: () => this.cmdSkills(),
      arsenal: () => this.cmdSkills(),
      experience: () => this.cmdExperience(),
      logs: () => this.cmdExperience(),
      certs: () => this.cmdCerts(),
      contact: () => this.cmdContact(),
      uplink: () => this.cmdContact(),
      clear: () => this.cmdClear(),
      cls: () => this.cmdClear(),
      deform: () => this.cmdDeform(),
      reform: () => this.cmdReform(),
      overclock: () => this.cmdOverclock(),
      pulse: () => this.cmdPulse(),
      glitch: () => this.cmdGlitch(),
      overdrive: () => this.cmdGlitch(),
      hack: () => this.cmdHack(),
      drone: () => this.cmdDrone(),
      rag: () => this.cmdRag(),
      theme: (args) => this.cmdTheme(args),
      matrix: () => this.cmdMatrix(),
      sudo: () => this.cmdSudo(),
      deepstream: () => this.cmdDeepStream(),
      audio: (args) => this.cmdAudio(args),
      date: () => this.printLine(`[TELEMETRY CLOCK] ${new Date().toISOString()}`),
      whoami: () => this.printLine(`GUEST_NETRUNNER // IP: 127.0.0.1 // CLEARANCE: LEVEL_3`),
      stats: () => this.cmdStats(),
      resume: () => this.cmdResume(),
      cv: () => this.cmdResume()
    };

    this.init();
  }

  init() {
    if (!this.input) return;

    this.input.addEventListener('keydown', (e) => {
      if (window.cyberAudio) window.cyberAudio.playTerminalKey();

      if (e.key === 'Enter') {
        const raw = this.input.value.trim();
        if (raw) {
          this.history.push(raw);
          this.historyIndex = this.history.length;
          this.execute(raw);
        } else {
          this.printLine(`${this.promptUser} `);
        }
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autoComplete();
      }
    });

    // Welcome banner
    this.printLine(`<span class="term-cyan">┌─────────────────────────────────────────────────────────┐</span>`);
    this.printLine(`<span class="term-cyan">│</span> <span class="term-highlight">NEURAL OS v2.8.0 [ONLINE] - RECEPTOR MATRIX COHERENT</span>   <span class="term-cyan">│</span>`);
    this.printLine(`<span class="term-cyan">│</span> System Architect: <span class="term-green">JEEVA M I</span> | Clearance: <span class="term-magenta">OMEGA</span>         <span class="term-cyan">│</span>`);
    this.printLine(`<span class="term-cyan">│</span> Edge Engine: <span class="term-yellow">NVIDIA DeepStream + TensorRT Accelerated</span>  <span class="term-cyan">│</span>`);
    this.printLine(`<span class="term-cyan">└─────────────────────────────────────────────────────────┘</span>`);
    this.printLine(`Type <span class="term-yellow">help</span> to inspect subroutines, or try <span class="term-green">hack</span>, <span class="term-magenta">deepstream</span>, or <span class="term-cyan">pulse</span>.`);
    this.printLine(``);
  }

  printLine(html) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = html;
    this.output.appendChild(line);
    this.container.scrollTop = this.container.scrollHeight;
  }

  execute(cmdStr) {
    this.printLine(`<span class="term-prompt">${this.promptUser}</span> <span class="term-input-echo">${this.escapeHTML(cmdStr)}</span>`);

    // Stop matrix if running in terminal
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
      this.matrixInterval = null;
    }

    const parts = cmdStr.split(' ').filter(Boolean);
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (mainCmd === 'brain') {
      if (args[0] === 'deform') this.cmdDeform();
      else if (args[0] === 'reform') this.cmdReform();
      else if (args[0] === 'overclock') this.cmdOverclock();
      else if (args[0] === 'pulse') this.cmdPulse();
      else this.printLine(`<span class="term-yellow">Usage: brain [deform | reform | overclock | pulse]</span>`);
      return;
    }

    if (mainCmd === 'cat' && (args[0] === 'resume' || args[0] === 'cv')) {
      this.cmdResume();
      return;
    }

    if (this.commands[mainCmd]) {
      this.commands[mainCmd](args);
    } else {
      this.printLine(`<span class="term-red">Command not recognized: "${mainCmd}". Type <span class="term-yellow">help</span> for protocol manual.</span>`);
    }
  }

  autoComplete() {
    const val = this.input.value.trim().toLowerCase();
    if (!val) return;
    const matches = Object.keys(this.commands).filter(c => c.startsWith(val));
    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.printLine(`<span class="term-muted">Suggestions: ${matches.join('  ')}</span>`);
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  cmdHelp() {
    this.printLine(`<span class="term-cyan">═══════════════ NEURAL PROTOCOL COMMAND MANUAL ═══════════════</span>`);
    this.printLine(`  <span class="term-yellow">about</span>        - Display biometric dossier & neural specialization`);
    this.printLine(`  <span class="term-yellow">projects</span>     - Inspect classified engineering operations`);
    this.printLine(`  <span class="term-yellow">skills</span>       - Matrix of AI/ML, Vision, DeepStream & LLM nodes`);
    this.printLine(`  <span class="term-yellow">experience</span>   - Mission logs (Creozen, Sankara Eye Hospital)`);
    this.printLine(`  <span class="term-yellow">certs</span>        - NIDAR National Finalist & NVIDIA certifications`);
    this.printLine(`  <span class="term-yellow">contact</span>      - Open direct encrypted comms channels`);
    this.printLine(`  <span class="term-green">pulse</span>        - Send synaptic photonic shockwave through 3D connectome`);
    this.printLine(`  <span class="term-green">deform</span>       - Deconstruct 3D Brain into quantum particle cloud`);
    this.printLine(`  <span class="term-green">reform</span>       - Synthesize 3D Brain back into anatomical form`);
    this.printLine(`  <span class="term-green">overclock</span>    - Overclock brain pulse frequency & chromatic power`);
    this.printLine(`  <span class="term-magenta">deepstream</span>   - Stream live 5-channel NVIDIA DeepStream video telemetry`);
    this.printLine(`  <span class="term-magenta">drone</span>        - UAV Aerial Human Detection telemetry & radar`);
    this.printLine(`  <span class="term-magenta">hack</span>         - Execute brute-force netrunner security bypass`);
    this.printLine(`  <span class="term-green">glitch</span>       - Trigger global chromatic aberration pulse`);
    this.printLine(`  <span class="term-green">matrix</span>       - Toggle cascading cyber digital rain`);
    this.printLine(`  <span class="term-magenta">theme &lt;id&gt;</span>  - Switch theme: [cyan | matrix | magenta | amber]`);
    this.printLine(`  <span class="term-yellow">audio &lt;on|off&gt;</span> - Control procedural synthesizer audio`);
    this.printLine(`  <span class="term-yellow">clear</span>        - Flush terminal buffer`);
  }

  cmdAbout() {
    this.printLine(`<span class="term-cyan">[DOSSIER // JEEVA M I]</span>`);
    this.printLine(`Role: <span class="term-green">AI & DeepStream Systems Architect / Computer Vision Engineer</span>`);
    this.printLine(`Education: <span class="term-white">B.Tech Artificial Intelligence & Data Science (2023 - 2027)</span>`);
    this.printLine(`Academy: <span class="term-white">Bannari Amman Institute of Technology, Tamil Nadu</span>`);
    this.printLine(`Specialty: <span class="term-yellow">Real-time Multi-Stream Video Analytics, YOLO Edge Detection, Autonomous RAG & Graph Neural Networks.</span>`);
    this.printLine(`Location: <span class="term-white">Coimbatore, Tamil Nadu, India</span>`);
  }

  cmdProjects() {
    this.printLine(`<span class="term-cyan">[CLASSIFIED ENGINEERING OPERATIONS]</span>`);
    this.printLine(`1. <span class="term-yellow">Proposera AI</span> - Autonomous RFP Engineering System (LLM, RAG, Streamlit)`);
    this.printLine(`2. <span class="term-green">Multi-Stream CCTV Monitoring</span> - 5 Simultaneous Feeds via NVIDIA DeepStream`);
    this.printLine(`3. <span class="term-magenta">Drone Human Detection</span> - NIDAR National Finalist (YOLO Aerial Surveillance)`);
    this.printLine(`4. <span class="term-cyan">MuleNet</span> - Graph Neural Network Fraud Detection & Financial Ring Defense`);
    this.printLine(`Type <span class="term-yellow">deepstream</span> or <span class="term-magenta">drone</span> to inspect operational hardware telemetry.`);
  }

  cmdSkills() {
    this.printLine(`<span class="term-cyan">┌────────────────────── SYNAPTIC ARSENAL ─────────────────────┐</span>`);
    this.printLine(`  <span class="term-green">AI / Vision</span>   : [||||||||||||||||||||] 96% - YOLO, OpenCV, DeepStream, CNN`);
    this.printLine(`  <span class="term-cyan">Hardware SDK</span>  : [||||||||||||||||||░░] 92% - TensorRT, GStreamer, NVDEC/NVENC`);
    this.printLine(`  <span class="term-yellow">GenAI / NLP</span>   : [|||||||||||||||||░░░] 88% - LLMs, RAG Pipelines, Vector DBs, MCP`);
    this.printLine(`  <span class="term-magenta">Languages</span>     : [||||||||||||||||||||] 95% - Python, C++, C, JavaScript, SQL`);
    this.printLine(`  <span class="term-white">Graph AI</span>      : [||||||||||||||||░░░░] 84% - PyTorch Geometric, NetworkX, GNN`);
    this.printLine(`<span class="term-cyan">└─────────────────────────────────────────────────────────────┘</span>`);
  }

  cmdExperience() {
    this.printLine(`<span class="term-cyan">[MISSION LOGS & CAREER TIMELINE]</span>`);
    this.printLine(`• <span class="term-green">AI Developer Intern | Creozen</span> (Sep 2025 - Present)`);
    this.printLine(`  - Real-time people counting & crowd analytics with neural network detectors`);
    this.printLine(`  - AI-assisted development workflows and rapid edge monitoring prototypes`);
    this.printLine(`• <span class="term-yellow">AIML Intern | Sankara Eye Hospital</span> (Mar 2025 - Apr 2025)`);
    this.printLine(`  - Engineered real-time multi-stream monitoring via NVIDIA DeepStream SDK`);
    this.printLine(`  - Processed 5 simultaneous CCTV feeds using PeopleNet & VehicleCamNet`);
    this.printLine(`• <span class="term-cyan">Bannari Amman Institute of Technology</span> (2023 - 2027)`);
    this.printLine(`  - B.Tech in Artificial Intelligence & Data Science`);
  }

  cmdCerts() {
    this.printLine(`<span class="term-cyan">[ACCOLADES & OFFICIAL CERTIFICATIONS]</span>`);
    this.printLine(`🏆 <span class="term-yellow">FINALIST - NIDAR National Innovation Challenge</span>`);
    this.printLine(`   Conducted by the Drone Federation of India & Government of India.`);
    this.printLine(`⚡ <span class="term-green">NVIDIA CERTIFIED: Building Real-Time Video AI Applications</span>`);
    this.printLine(`   Using NVIDIA DeepStream SDK & TensorRT Pipeline Optimization.`);
  }

  cmdContact() {
    this.printLine(`<span class="term-cyan">[SECURE UPLINK CHANNELS]</span>`);
    this.printLine(`Email    : <span class="term-green">jeevamiofficial@gmail.com</span>`);
    this.printLine(`LinkedIn : <a class="term-link" href="https://linkedin.com/in/jeeva-m-i" target="_blank">linkedin.com/in/jeeva-m-i</a>`);
    this.printLine(`GitHub   : <a class="term-link" href="https://github.com/Jeevamoorthy" target="_blank">github.com/Jeevamoorthy</a>`);
    this.printLine(`Location : Coimbatore, Tamil Nadu, India`);
  }

  cmdPulse() {
    if (window.brainEngine && window.brainEngine.triggerSynapticPulse) {
      window.brainEngine.triggerSynapticPulse();
      this.printLine(`<span class="term-cyan">⚡ SYNAPTIC PHOTONIC SHOCKWAVE DISPATCHED (4.8 GW)</span>`);
    } else {
      this.printLine(`<span class="term-yellow">Firing simulated synaptic pulse...</span>`);
      if (window.cyberAudio) window.cyberAudio.playPulse();
    }
  }

  cmdGlitch() {
    if (window.triggerCyberGlitch) {
      window.triggerCyberGlitch();
      this.printLine(`<span class="term-magenta">⚠️ SYSTEM OVERDRIVE TRIGGERED: Chromatic aberration & quantum burst active!</span>`);
    }
  }

  cmdHack() {
    this.printLine(`<span class="term-green">INITIALIZING BRUTE-FORCE CIPHER CRACKER...</span>`);
    const stages = [
      'Bypassing quantum firewall... [OK]',
      'Cracking AES-512 neural lattice encryption...',
      'Root exploit injected via DeepStream buffer overflow...',
      'CLEARANCE ELEVATED: OMEGA ARCHITECT GRANTED.'
    ];

    stages.forEach((msg, idx) => {
      setTimeout(() => {
        this.printLine(`<span class="${idx === 3 ? 'term-green' : 'term-yellow'}">[SEC_BYPASS] ${msg}</span>`);
        if (window.cyberAudio) {
          if (idx === 3) window.cyberAudio.playSuccess();
          else window.cyberAudio.playScan();
        }
      }, (idx + 1) * 350);
    });
  }

  cmdDrone() {
    this.printLine(`<span class="term-magenta">┌─────────────── NIDAR UAV AERIAL DETECTION TELEMETRY ───────────────┐</span>`);
    this.printLine(`  UAV Altitude      : 120.4 m AGL | GSD: 2.4 cm/pixel`);
    this.printLine(`  Detector Model    : Fine-Tuned YOLOv8-Aerial (Small Object Tailored)`);
    this.printLine(`  Inference Speed   : 14.2 ms / frame @ TensorRT FP16`);
    this.printLine(`  Detection Recall  : 96.2% under low-light & optical turbulence`);
    this.printLine(`  Status            : <span class="term-green">FINALIST - Drone Federation of India & Govt of India</span>`);
    this.printLine(`<span class="term-magenta">└────────────────────────────────────────────────────────────────────┘</span>`);
    if (window.cyberAudio) window.cyberAudio.playScan();
  }

  cmdRag() {
    this.printLine(`<span class="term-cyan">┌──────────────── PROPOSERA AI / RAG INFERENCE PIPELINE ─────────────┐</span>`);
    this.printLine(`  Chunk Indexing    : Semantic Recursive Splitting (512 tokens / chunk)`);
    this.printLine(`  Vector Store      : High-Dimensional Cosine Similarity (top_k: 5)`);
    this.printLine(`  Mean Reciprocal   : 0.942 MRR | Synthesis Latency: 1.8s`);
    this.printLine(`  Workflow Speed    : 4.2x Faster RFP Technical Spec Synthesis`);
    this.printLine(`<span class="term-cyan">└────────────────────────────────────────────────────────────────────┘</span>`);
  }

  cmdStats() {
    this.printLine(`<span class="term-green">[LIVE SYSTEM TELEMETRY]</span>`);
    this.printLine(`FPS: 60 | Latency: 9.2ms | Neural Core: Stable | Clearance: Omega`);
    this.printLine(`CCTV Feeds: 5 Simultaneous | System Uptime: 99.4%`);
  }

  cmdResume() {
    this.printLine(`<span class="term-green">Initiating CV Transmission Uplink...</span>`);
    window.location.href = 'mailto:jeevamiofficial@gmail.com?subject=Inquiry%20from%20Portfolio';
    if (window.cyberAudio) window.cyberAudio.playSuccess();
  }

  cmdAudio(args) {
    if (!window.cyberAudio) return;
    const mode = args[0] ? args[0].toLowerCase() : '';
    if (mode === 'off' || mode === 'mute') {
      if (!window.cyberAudio.muted) window.cyberAudio.toggleMute();
      this.printLine(`<span class="term-yellow">Audio Synthesizer: MUTED</span>`);
    } else if (mode === 'on') {
      if (window.cyberAudio.muted) window.cyberAudio.toggleMute();
      this.printLine(`<span class="term-green">Audio Synthesizer: ACTIVE</span>`);
    } else {
      const isMuted = window.cyberAudio.toggleMute();
      this.printLine(`Audio Synthesizer: <span class="${isMuted ? 'term-yellow' : 'term-green'}">${isMuted ? 'MUTED' : 'ACTIVE'}</span>`);
    }
  }

  cmdDeform() {
    if (window.brainEngine) {
      window.brainEngine.deform();
      this.printLine(`<span class="term-magenta">⚡ DECONSTRUCT SIGNAL BROADCASTED: Brain scattering into quantum particle storm.</span>`);
    } else {
      this.printLine(`<span class="term-red">Error: Neural 3D Engine offline.</span>`);
    }
  }

  cmdReform() {
    if (window.brainEngine) {
      window.brainEngine.reform();
      this.printLine(`<span class="term-green">✨ RECONSTRUCT SIGNAL BROADCASTED: Particles magnetically snapping to anatomical cortex coordinates.</span>`);
    } else {
      this.printLine(`<span class="term-red">Error: Neural 3D Engine offline.</span>`);
    }
  }

  cmdOverclock() {
    if (window.brainEngine) {
      const state = window.brainEngine.toggleOverclock();
      if (state) {
        this.printLine(`<span class="term-yellow">🔥 OVERCLOCK ENGAGED: Pulse frequency set to 432.8 Hz. Neural throughput +300%.</span>`);
      } else {
        this.printLine(`<span class="term-cyan">❄️ OVERCLOCK DISENGAGED: System normalized to 144.2 Hz.</span>`);
      }
    }
  }

  cmdTheme(args) {
    const themeName = args[0] ? args[0].toLowerCase() : '';
    const valid = ['cyan', 'matrix', 'magenta', 'amber'];
    if (valid.includes(themeName)) {
      if (window.brainEngine) window.brainEngine.setTheme(themeName);
      document.body.setAttribute('data-theme', themeName);
      this.printLine(`<span class="term-green">Palette switched to: [${themeName.toUpperCase()}].</span>`);
    } else {
      this.printLine(`<span class="term-yellow">Usage: theme [cyan | matrix | magenta | amber]</span>`);
    }
  }

  cmdDeepStream() {
    this.printLine(`<span class="term-green">>>> INITIALIZING NVIDIA DEEPSTREAM 6.3 PIPELINE...</span>`);
    this.printLine(`<span class="term-muted">[STREAM 1/5] RTSP_CAM_01: 1080p @ 30fps -> Gst-nvstreammux -> nvinferserver (PeopleNet) [ONLINE]</span>`);
    this.printLine(`<span class="term-muted">[STREAM 2/5] RTSP_CAM_02: 1080p @ 30fps -> Gst-nvstreammux -> nvinferserver (PeopleNet) [ONLINE]</span>`);
    this.printLine(`<span class="term-muted">[STREAM 3/5] RTSP_CAM_03: 1080p @ 30fps -> Gst-nvstreammux -> nvinferserver (VehicleCamNet) [ONLINE]</span>`);
    this.printLine(`<span class="term-muted">[STREAM 4/5] RTSP_CAM_04: 1080p @ 30fps -> Gst-nvstreammux -> nvinferserver (CrowdDensity) [ONLINE]</span>`);
    this.printLine(`<span class="term-muted">[STREAM 5/5] RTSP_CAM_05: 1080p @ 30fps -> Gst-nvstreammux -> nvinferserver (VehicleCamNet) [ONLINE]</span>`);
    this.printLine(`<span class="term-cyan">LATENCY: 8.4ms | INFERENCE BATCH SIZE: 5 | HARDWARE ACCELERATION: NVIDIA TENSORRT ACTIVE</span>`);
  }

  cmdMatrix() {
    // Also toggle the full-screen matrix rain canvas
    if (window.toggleMatrixRain) {
      const active = window.toggleMatrixRain();
      this.printLine(`<span class="term-green">MATRIX RAIN ${active ? 'ENGAGED' : 'DEACTIVATED'} ACROSS VIEWPORT.</span>`);
    }

    this.printLine(`<span class="term-green">STREAMING DATA MATRIX... (press any key to stop terminal stream)</span>`);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    this.matrixInterval = setInterval(() => {
      let line = '';
      for (let i = 0; i < 48; i++) {
        line += chars[Math.floor(Math.random() * chars.length)] + ' ';
      }
      this.printLine(`<span class="term-green">${line}</span>`);
    }, 120);

    const stop = () => {
      if (this.matrixInterval) {
        clearInterval(this.matrixInterval);
        this.matrixInterval = null;
        this.printLine(`<span class="term-cyan">[DATA STREAM TERMINATED]</span>`);
      }
      window.removeEventListener('keydown', stop);
    };
    setTimeout(() => {
      window.addEventListener('keydown', stop, { once: true });
    }, 200);
  }

  cmdSudo() {
    this.printLine(`<span class="term-red">ACCESS DENIED: Neural root clearance required. Nice try, Netrunner.</span>`);
    if (window.cyberAudio) window.cyberAudio.playGlitch();
  }

  cmdClear() {
    this.output.innerHTML = '';
  }
}

window.initCyberTerminal = function(id) {
  window.cyberTerminal = new CyberTerminal(id);
  return window.cyberTerminal;
};
