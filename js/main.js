/**
 * Main Application Logic
 * Cyberpunk UI interactions, project filters, 3D card tilt,
 * holographic modal with live runtime telemetry logs,
 * Matrix rain canvas, system glitch overdrive, scrollspy,
 * telemetry tickers, audio bindings, and copy uplink.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Brain Engine
  window.initCyberBrain('brain-canvas-container');

  // Initialize Interactive Terminal
  window.initCyberTerminal('cyber-terminal');

  // Initialize Custom Cyber Cursor
  initCustomCursor();

  // Initialize Audio Controls & Ambient Drone
  initAudioControls();

  // Initialize Theme Switchers
  initThemeControls();

  // Initialize Brain HUD Controls
  initBrainControls();

  // Initialize Project Filters & 3D Tilt
  initProjectFeatures();

  // Initialize Modals
  initProjectModal();

  // Initialize Telemetry Tickers (FPS & Latency)
  initTelemetryTickers();

  // Initialize Stat Number Counters on scroll
  initStatCounters();

  // Initialize Contact Uplink & Copy Buttons
  initContactUplink();

  // Mobile Navigation Menu
  initMobileNav();

  // Matrix Rain Canvas
  initMatrixRain();

  // ScrollSpy Active Nav Tracking
  initScrollSpy();

  // Floating Cyber Quick-HUD
  initFloatingHUD();
});

/* ==========================================================================
   1. CUSTOM CYBER CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cyber-cursor-dot');
  const cursorRing = document.getElementById('cyber-cursor-ring');
  if (!cursorDot || !cursorRing) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover expansion on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-node, .hud-btn, .filter-tab');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('cursor-hover');
      if (window.cyberAudio) window.cyberAudio.playHover();
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('cursor-hover');
    });
    el.addEventListener('click', () => {
      cursorRing.classList.add('cursor-click');
      setTimeout(() => cursorRing.classList.remove('cursor-click'), 200);
    });
  });
}

/* ==========================================================================
   2. AUDIO CONTROLS & PROCEDURAL AMBIENT DRONE
   ========================================================================== */
function initAudioControls() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioStatusText = document.getElementById('audio-status-text');
  const ambientBtn = document.getElementById('ambient-toggle-btn');
  const floatAmbientBtn = document.getElementById('float-ambient-btn');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!window.cyberAudio) return;
      const isMuted = window.cyberAudio.toggleMute();

      if (isMuted) {
        audioBtn.classList.add('muted');
        if (audioStatusText) audioStatusText.textContent = 'SFX: MUTED';
        if (ambientBtn) ambientBtn.classList.remove('active');
        if (floatAmbientBtn) floatAmbientBtn.classList.remove('active');
      } else {
        audioBtn.classList.remove('muted');
        if (audioStatusText) audioStatusText.textContent = 'SFX: ACTIVE';
        window.cyberAudio.playClick();
      }
    });
  }

  const toggleDrone = () => {
    if (!window.cyberAudio) return;
    const isRunning = window.cyberAudio.toggleAmbientDrone();
    if (ambientBtn) ambientBtn.classList.toggle('active', isRunning);
    if (floatAmbientBtn) floatAmbientBtn.classList.toggle('active', isRunning);

    if (audioBtn) {
      if (isRunning) {
        audioBtn.classList.remove('muted');
        if (audioStatusText) audioStatusText.textContent = 'SFX: ACTIVE';
      }
    }
    showCyberToast(isRunning ? '📻 CYBER AMBIENT DRONE: ONLINE' : '🔇 AMBIENT DRONE: STANDBY');
  };

  if (ambientBtn) ambientBtn.addEventListener('click', toggleDrone);
  if (floatAmbientBtn) floatAmbientBtn.addEventListener('click', toggleDrone);

  // Global click sound for cyber buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .cyber-btn, .nav-link, .filter-tab, .hud-btn')) {
      if (window.cyberAudio) window.cyberAudio.playClick();
    }
  });
}

/* ==========================================================================
   3. THEME SYSTEM
   ========================================================================== */
function initThemeControls() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      if (!theme) return;

      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.body.setAttribute('data-theme', theme);
      if (window.brainEngine) window.brainEngine.setTheme(theme);
      if (window.cyberAudio) window.cyberAudio.playClick();

      showCyberToast(`COLOR MATRIX SWITCHED: [${theme.toUpperCase()}]`);
    });
  });
}

/* ==========================================================================
   4. BRAIN HUD CONTROLS
   ========================================================================== */
function initBrainControls() {
  const btnDeform = document.getElementById('btn-brain-deform');
  const btnOverclock = document.getElementById('btn-brain-overclock');
  const btnReset = document.getElementById('btn-brain-reset');
  const btnPulse = document.getElementById('btn-brain-pulse');

  if (btnDeform) {
    btnDeform.addEventListener('click', () => {
      if (!window.brainEngine) return;
      window.brainEngine.toggleDeform();
      const isDeformed = window.brainEngine.targetDeformFactor > 0.5;
      btnDeform.innerHTML = isDeformed 
        ? `<span class="btn-bracket">[</span><span class="btn-text">RECONSTRUCT BRAIN</span><span class="btn-bracket">]</span>` 
        : `<span class="btn-bracket">[</span><span class="btn-text">DECONSTRUCT / GLITCH</span><span class="btn-bracket">]</span>`;
    });
  }

  if (btnOverclock) {
    btnOverclock.addEventListener('click', () => {
      if (!window.brainEngine) return;
      const isOver = window.brainEngine.toggleOverclock();
      btnOverclock.classList.toggle('active', isOver);
      btnOverclock.innerHTML = isOver
        ? `<span class="btn-bracket">[</span><span class="btn-text">OVERCLOCK: BOOSTED (432Hz)</span><span class="btn-bracket">]</span>`
        : `<span class="btn-bracket">[</span><span class="btn-text">OVERCLOCK CORE</span><span class="btn-bracket">]</span>`;
      
      showCyberToast(isOver ? '🔥 OVERCLOCK BOOST ENGAGED' : '❄️ NEURAL CORE STABILIZED');
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (!window.brainEngine) return;
      window.brainEngine.reform();
      if (window.brainEngine.isOverclocked) window.brainEngine.toggleOverclock();
      if (btnDeform) btnDeform.innerHTML = `<span class="btn-bracket">[</span><span class="btn-text">DECONSTRUCT / GLITCH</span><span class="btn-bracket">]</span>`;
      if (btnOverclock) {
        btnOverclock.classList.remove('active');
        btnOverclock.innerHTML = `<span class="btn-bracket">[</span><span class="btn-text">OVERCLOCK CORE</span><span class="btn-bracket">]</span>`;
      }
      showCyberToast('NEURAL RECEPTORS NORMALIZED');
    });
  }

  if (btnPulse) {
    btnPulse.addEventListener('click', () => {
      if (!window.brainEngine) return;
      window.brainEngine.triggerSynapticPulse();
      showCyberToast('⚡ SYNAPTIC PHOTONIC SHOCKWAVE DISPATCHED');
    });
  }
}

/* ==========================================================================
   5. PROJECT FILTERING, 3D CARD TILT & BRAIN SYNERGY
   ========================================================================== */
function initProjectFeatures() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 20);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // 3D Perspective Tilt on Hover & Brain Region Highlight
  projectCards.forEach(card => {
    const region = card.getAttribute('data-brain-region') || 'frontal';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (window.brainEngine) window.brainEngine.resetHighlights();
    });

    card.addEventListener('mouseenter', () => {
      if (window.brainEngine) window.brainEngine.highlightRegion(region);
    });
  });

  // Skills hover link to brain
  const skillNodes = document.querySelectorAll('.skill-node');
  skillNodes.forEach(node => {
    const region = node.getAttribute('data-brain-region') || 'visual';
    node.addEventListener('mouseenter', () => {
      if (window.brainEngine) window.brainEngine.highlightRegion(region);
    });
    node.addEventListener('mouseleave', () => {
      if (window.brainEngine) window.brainEngine.resetHighlights();
    });
  });
}

/* ==========================================================================
   6. HOLOGRAPHIC PROJECT MODAL WITH LIVE RUNTIME LOGS
   ========================================================================== */
const projectDatabase = {
  proposera: {
    title: 'PROPOSERA AI - AUTONOMOUS RFP ENGINEERING SYSTEM',
    badge: 'GENAI / RAG / STREAMLIT',
    category: 'Autonomous Proposal Generation',
    tagline: 'LLM-Powered Retrieval-Augmented Generation Architecture for High-Volume RFP Creation',
    overview: 'Engineered an end-to-end intelligent proposal generation system capable of ingesting voluminous Request-For-Proposal (RFP) specification documents, cross-referencing company compliance repositories, and drafting accurate technical proposals.',
    architecture: [
      'Document Ingestion & Chunking: Recursive semantic splitting for multi-page complex enterprise RFPs.',
      'Vector Embedding & Retrieval: High-dimensional vector index for pinpoint contextual clause retrieval.',
      'Context-Augmented Reasoning: RAG pipeline synthesizing technical, operational, and financial compliance parameters.',
      'Streamlit HUD Dashboard: Intuitive, real-time control interface engineered for rapid non-technical user workflows.'
    ],
    techStack: ['Python', 'LLM (Large Language Models)', 'RAG Architecture', 'FastAPI', 'Streamlit', 'Vector Embeddings', 'MCP Protocol'],
    metrics: [
      { label: 'Drafting Speed', val: '85% Faster' },
      { label: 'Context Accuracy', val: '98.4%' },
      { label: 'Workflow Efficiency', val: '4.2x' }
    ],
    runtimeLog: `[22:50:11.204] INGEST: RFP_Spec_DoD_Section_B.pdf (148 pages) -> RecursiveCharacterSplitter
[22:50:11.450] EMBED: text-embedding-3-large -> 1,536 dims vector lattice [STORED]
[22:50:11.780] QUERY: "Section 4.2 Security Accreditation Requirements" -> Cosine Sim: 0.942
[22:50:12.110] SYNTH: Context retrieved (5 clauses). Generating compliant RFP submission...
[22:50:12.980] COMPLETE: Technical draft synthesized in 1.78s. Accuracy score: 98.4%`
  },
  cctv: {
    title: 'MULTI-STREAM CCTV MONITORING SYSTEM',
    badge: 'NVIDIA DEEPSTREAM / EDGE CV',
    category: 'High-Throughput Edge Intelligence',
    tagline: 'Simultaneous 5-Channel Real-time Video AI Analytics Powered by NVIDIA DeepStream SDK & TensorRT',
    overview: 'Engineered during AIML Internship at Sankara Eye Hospital. Built an edge-deployed real-time multi-stream video pipeline processing 5 simultaneous high-definition CCTV feeds with ultra-low latency, running PeopleNet and VehicleCamNet for automated anomaly detection.',
    architecture: [
      'NVIDIA DeepStream Pipeline: Gstreamer nvstreammux batching 5 live RTSP camera streams into single hardware tensor buffers.',
      'TensorRT Optimized Inference: Accelerated PeopleNet for crowd tracking and VehicleCamNet for parking/transit observation.',
      'Low-Latency Hardware Decoding: NVDEC / NVENC GPU acceleration avoiding CPU bottlenecks.',
      'Real-time Operational Telemetry: Automated event dispatch and security visibility dashboard.'
    ],
    techStack: ['NVIDIA DeepStream SDK', 'TensorRT', 'PeopleNet', 'VehicleCamNet', 'Python', 'OpenCV', 'GStreamer', 'C++'],
    metrics: [
      { label: 'Parallel Feeds', val: '5 Simultaneous' },
      { label: 'Pipeline Latency', val: '< 12ms / frame' },
      { label: 'Throughput', val: '150 FPS Total' }
    ],
    runtimeLog: `[22:50:11.010] PIPELINE: GStreamer nvstreammux batch-size=5 nvbuf-memory-type=0
[22:50:11.042] NVDEC: Decoding 5x RTSP H.264 streams on hardware tensor core (GPU 38%)
[22:50:11.074] INFER: Primary GIE -> PeopleNet TensorRT FP16 (Stream 1: 14 humans, Stream 2: 8 humans)
[22:50:11.085] INFER: Secondary GIE -> VehicleCamNet (Stream 3: 12 vehicles, Stream 5: 4 trucks)
[22:50:11.096] TELEMETRY: Total throughput: 150 FPS | Pipeline latency: 11.2ms/frame [STABLE]`
  },
  drone: {
    title: 'DRONE HUMAN DETECTION SYSTEM',
    badge: 'NIDAR NATIONAL FINALIST // YOLO',
    category: 'High-Altitude Aerial Surveillance',
    tagline: 'Robust Aerial Surveillance & Search-and-Rescue Human Detection Platform',
    overview: 'National Finalist project at the NIDAR National Innovation Challenge conducted by the Drone Federation of India and the Government of India. Developed an aerial detection engine using fine-tuned YOLO architectures for real-time human detection from high-altitude UAV gimbal footage.',
    architecture: [
      'Aerial Target Detection: Fine-tuned YOLO detection model tailored for high-altitude oblique angles and small bounding boxes.',
      'Motion Stabilization: Real-time optical flow filtering to negate UAV high-velocity jitter and wind turbulence.',
      'Adverse Lighting Adaptation: Dynamic gamma and contrast normalization for low-light, fog, and intense sun glare.',
      'Ground Station Telemetry: Real-time bounding box streaming and GPS geo-coordinate estimation.'
    ],
    techStack: ['YOLO', 'PyTorch', 'OpenCV', 'Drone Telemetry', 'Computer Vision', 'Python'],
    metrics: [
      { label: 'Award', val: 'NIDAR National Finalist' },
      { label: 'Govt Recognition', val: 'DFI & Govt of India' },
      { label: 'Detection Stability', val: '96.2%' }
    ],
    runtimeLog: `[22:50:11.100] TELEMETRY: UAV-01 Altitude: 120.4m AGL | Yaw: 142° | Pitch: -45° (Gimbal Lock)
[22:50:11.140] FRAME: Oblique aerial stream 1080p60 -> Optical flow motion de-jitter
[22:50:11.175] YOLO-INFER: Bounding box [x:412, y:890, w:34, h:72] class='person' conf=0.978
[22:50:11.190] DISPATCH: GPS Geo-coordinates estimated: 11.0168° N, 76.9558° E [TARGET IDENTIFIED]
[22:50:11.205] STATUS: NIDAR National Finalist Model - Real-time Search & Rescue Mode Active`
  },
  mulenet: {
    title: 'MULENET - GRAPH NEURAL NETWORK FRAUD DETECTION',
    badge: 'GRAPH NEURAL NETWORKS / FINTECH',
    category: 'Financial Crime & Mule Account Defense',
    tagline: 'Real-Time Fraud Ring Detection Using Graph Convolutional Networks & Community Clustering',
    overview: 'Engineered an intelligent anti-money laundering and money-mule detection engine that treats financial transactions as high-dimensional dynamic graphs, uncovering synchronized multi-hop transaction laundering rings invisible to traditional tabular detectors.',
    architecture: [
      'Dynamic Transaction Graph Construction: Directed bipartite graph mapping accounts, routing intermediaries, and transactional bursts.',
      'Graph Convolutional Networks (GCN): Node classification and edge prediction extracting topological anomaly fingerprints.',
      'Louvain Community Detection: Identifying tightly coupled subgraphs operating as collaborative money-mule syndicates.',
      'Analytical Interpretability: Automated sub-graph visualization for financial investigation units.'
    ],
    techStack: ['PyTorch Geometric', 'Graph Neural Networks', 'NetworkX', 'Python', 'Community Detection', 'Scikit-Learn'],
    metrics: [
      { label: 'Ring Detection Rate', val: '94.7%' },
      { label: 'False Positive Reduction', val: '62%' },
      { label: 'Sub-graph Speed', val: '< 20ms' }
    ],
    runtimeLog: `[22:50:11.050] GRAPH: Ingested 14,200 dynamic financial transactions -> Directed bipartite graph
[22:50:11.120] GCN LAYER: Graph Convolutional Network computing 64-dim node topological embeddings
[22:50:11.210] CLUSTERING: Louvain community modularity Q = 0.84 -> Detected 3 synchronized mule rings
[22:50:11.240] ALERT: Syndicate Cluster #042 tagged -> Rapid 4-hop fund dispersal anomaly (Conf: 94.7%)
[22:50:11.260] ACTION: Automated SAR visualization generated for Compliance Units in 18.4ms`
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-project-modal');

  if (!modal || !modalContent) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectDatabase[projId];
      if (!data) return;

      modalContent.innerHTML = `
        <div class="modal-header-cyber">
          <div class="modal-badge">${data.badge}</div>
          <h2 class="modal-title">${data.title}</h2>
          <div class="modal-tagline">${data.tagline}</div>
        </div>
        <div class="modal-body-cyber">
          <div class="modal-section">
            <h4 class="modal-subheading"><span class="neon-icon">▶</span> SYSTEM OVERVIEW</h4>
            <p class="modal-text">${data.overview}</p>
          </div>

          <div class="modal-section">
            <h4 class="modal-subheading"><span class="neon-icon">⚡</span> ARCHITECTURAL SPECIFICATIONS</h4>
            <ul class="modal-spec-list">
              ${data.architecture.map(a => `<li><span class="spec-bracket">[ // ]</span> ${a}</li>`).join('')}
            </ul>
          </div>

          <div class="modal-metrics-grid">
            ${data.metrics.map(m => `
              <div class="metric-card">
                <div class="metric-val">${m.val}</div>
                <div class="metric-label">${m.label}</div>
              </div>
            `).join('')}
          </div>

          <div class="modal-section">
            <h4 class="modal-subheading"><span class="neon-icon">💻</span> LIVE SIMULATED RUNTIME TELEMETRY</h4>
            <pre class="modal-runtime-log"><code>${data.runtimeLog}</code></pre>
          </div>

          <div class="modal-section">
            <h4 class="modal-subheading"><span class="neon-icon">⚙️</span> TECH STACK</h4>
            <div class="modal-tech-pills">
              ${data.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.cyberAudio) window.cyberAudio.playSuccess();
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.cyberAudio) window.cyberAudio.playClick();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   7. TELEMETRY TICKERS (FPS, LATENCY, CLOCK)
   ========================================================================== */
function initTelemetryTickers() {
  const fpsEl = document.getElementById('hud-fps-counter');
  const latEl = document.getElementById('hud-latency-counter');
  const clockEl = document.getElementById('hud-realtime-clock');

  let frameCount = 0;
  let lastTime = performance.now();

  function updateFps() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      if (fpsEl) fpsEl.textContent = `${Math.min(fps, 60)} FPS`;
      frameCount = 0;
      lastTime = now;

      // Realistic jitter for edge latency (8ms - 13ms)
      if (latEl) {
        const jitter = (8.2 + Math.random() * 4.4).toFixed(1);
        latEl.textContent = `${jitter} ms`;
      }
    }
    requestAnimationFrame(updateFps);
  }
  requestAnimationFrame(updateFps);

  // Real-time Cyber Clock
  function updateClock() {
    if (clockEl) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      clockEl.textContent = `${timeStr} UTC+05:30`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();
}

/* ==========================================================================
   8. STAT NUMBER COUNTERS (Intersection Observer)
   ========================================================================== */
function initStatCounters() {
  const statElements = document.querySelectorAll('.counter-val');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target') || '0');
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const isDecimal = String(target).includes('.');
        let current = 0;
        const duration = 1400;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1.0);
          const ease = 1 - Math.pow(1 - progress, 4);
          const val = current + (target - current) * ease;
          entry.target.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;

          if (progress < 1.0) {
            requestAnimationFrame(step);
          } else {
            entry.target.textContent = target + suffix;
          }
        }
        requestAnimationFrame(step);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. CONTACT UPLINK & CLIPBOARD COPY
   ========================================================================== */
function initContactUplink() {
  const copyBtns = document.querySelectorAll('.copy-trigger');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy');
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        showCyberToast(`COPIED TO CLIPBOARD: ${val}`);
        if (window.cyberAudio) window.cyberAudio.playSuccess();
      }).catch(() => {
        showCyberToast(`DATA: ${val}`);
      });
    });
  });
}

/* ==========================================================================
   10. MOBILE NAV
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links-menu');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
      toggleBtn.classList.toggle('active');
      if (window.cyberAudio) window.cyberAudio.playClick();
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        toggleBtn.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   11. MATRIX RAIN CANVAS BACKGROUND
   ========================================================================== */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationId = null;
  let active = false;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const characters = '0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';
  const fontSize = 14;
  let columns = Math.floor(width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
    ctx.fillRect(0, 0, width, height);

    const theme = document.body.getAttribute('data-theme') || 'cyan';
    const colorMap = {
      cyan: '#00f0ff',
      matrix: '#00ff66',
      magenta: '#ff007f',
      amber: '#ffaa00'
    };
    ctx.fillStyle = colorMap[theme] || '#00f0ff';
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    if (active) animationId = requestAnimationFrame(draw);
  }

  window.toggleMatrixRain = function(forceState) {
    active = typeof forceState === 'boolean' ? forceState : !active;
    canvas.style.opacity = active ? '0.35' : '0';
    if (active) {
      drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
      draw();
      showCyberToast('🟢 MATRIX DATASTREAM: ACTIVE');
    } else {
      cancelAnimationFrame(animationId);
      setTimeout(() => ctx.clearRect(0, 0, width, height), 400);
      showCyberToast('MATRIX DATASTREAM: DOCKED');
    }
    return active;
  };
}

/* ==========================================================================
   12. SYSTEM OVERDRIVE / GLITCH PULSE
   ========================================================================== */
window.triggerCyberGlitch = function() {
  if (window.cyberAudio) window.cyberAudio.playGlitch();
  document.body.classList.add('glitch-active');
  if (window.brainEngine) {
    window.brainEngine.deform();
  }
  showCyberToast('⚡ SYSTEM OVERDRIVE // QUANTUM BURST INJECTED');

  setTimeout(() => {
    document.body.classList.remove('glitch-active');
    if (window.brainEngine) {
      window.brainEngine.reform();
    }
  }, 1400);
};

/* ==========================================================================
   13. SCROLLSPY ACTIVE NAV HIGHLIGHT
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   14. FLOATING CYBER QUICK-HUD
   ========================================================================== */
function initFloatingHUD() {
  const btnTop = document.getElementById('float-top-btn');
  const btnGlitch = document.getElementById('float-glitch-btn');
  const btnCli = document.getElementById('float-cli-btn');
  const btnMatrix = document.getElementById('float-matrix-btn');
  const hudGlitchTop = document.getElementById('hud-glitch-btn');

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  }

  if (btnGlitch) {
    btnGlitch.addEventListener('click', () => {
      if (window.triggerCyberGlitch) window.triggerCyberGlitch();
    });
  }

  if (btnMatrix) {
    btnMatrix.addEventListener('click', () => {
      if (window.toggleMatrixRain) {
        const isActive = window.toggleMatrixRain();
        btnMatrix.classList.toggle('active', isActive);
      }
    });
  }

  if (btnCli) {
    btnCli.addEventListener('click', () => {
      const term = document.getElementById('terminal');
      const input = document.querySelector('.terminal-input');
      if (term) term.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => { if (input) input.focus(); }, 400);
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  }

  if (hudGlitchTop) {
    hudGlitchTop.addEventListener('click', () => {
      if (window.triggerCyberGlitch) window.triggerCyberGlitch();
    });
  }
}

/* ==========================================================================
   CYBER TOAST NOTIFICATION
   ========================================================================== */
function showCyberToast(msg) {
  let toast = document.getElementById('cyber-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-toast';
    toast.className = 'cyber-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="toast-bracket">[ // ]</span> ${msg}`;
  toast.classList.add('visible');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}
