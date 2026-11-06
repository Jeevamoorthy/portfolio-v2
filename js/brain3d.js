/**
 * CyberBrain 3D Engine
 * Procedural Reactive Human Brain with Deformation & Reformation Physics,
 * Synaptic Connectome, Cyberpunk Multi-point Lighting, and Mouse Reactivity.
 */

class CyberBrainEngine {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) {
      console.error(`Container #${canvasContainerId} not found.`);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // Brain Geometry Data
    this.particleCount = 7500;
    this.particlesGeometry = null;
    this.particlesMesh = null;
    this.particlesData = [];
    
    // Connectome Lines
    this.linesMesh = null;
    this.linesGeometry = null;
    this.maxConnections = 450;
    this.connectomePairs = [];

    // Action Potentials (Traveling Synaptic Impulses)
    this.impulsesMesh = null;
    this.impulsesCount = 180;
    this.impulsesData = [];

    // Holographic Cyber Rings
    this.hudRings = [];
    this.satellites = [];

    // Synaptic Pulse Photonic Wave
    this.pulseActive = false;
    this.pulseProgress = 0.0;

    // Lighting
    this.lights = {};
    this.cursorLight = null;

    // Interaction & Animation State
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.mouseWorldPos = new THREE.Vector3(0, 0, 0);

    // Physics & Morphing parameters
    this.deformFactor = 0.0;          // 0.0 = Assembled, 1.0 = Deconstructed/Shattered
    this.targetDeformFactor = 0.0;
    this.isOverclocked = false;
    this.overclockLevel = 0.0;
    this.time = 0;
    this.clock = new THREE.Clock();
    
    // Theme Palettes
    this.currentTheme = 'cyan';
    this.palettes = {
      cyan: {
        leftHemi: new THREE.Color(0x00f0ff),     // Cyber Cyan
        rightHemi: new THREE.Color(0xff007f),    // Neon Pink
        core: new THREE.Color(0x7928ca),         // Violet
        stem: new THREE.Color(0x00ff66),         // Emerald (NVIDIA DeepStream)
        sparks: new THREE.Color(0xffffff),
        ring1: 0x00f0ff,
        ring2: 0xff007f,
        lightKey: 0x00f0ff,
        lightRim: 0xff007f,
        lightStem: 0x00ff66
      },
      matrix: {
        leftHemi: new THREE.Color(0x00ff66),     // Terminal Green
        rightHemi: new THREE.Color(0x00ee44),
        core: new THREE.Color(0x005522),
        stem: new THREE.Color(0x76ff03),
        sparks: new THREE.Color(0xffffff),
        ring1: 0x00ff66,
        ring2: 0x76ff03,
        lightKey: 0x00ff66,
        lightRim: 0x76ff03,
        lightStem: 0x00ee44
      },
      magenta: {
        leftHemi: new THREE.Color(0xff0055),     // Neon Red/Pink
        rightHemi: new THREE.Color(0x9d00ff),    // Ultraviolet
        core: new THREE.Color(0xff00aa),
        stem: new THREE.Color(0xffaa00),
        sparks: new THREE.Color(0xffffff),
        ring1: 0xff0055,
        ring2: 0x9d00ff,
        lightKey: 0xff0055,
        lightRim: 0x9d00ff,
        lightStem: 0xffaa00
      },
      amber: {
        leftHemi: new THREE.Color(0xffaa00),     // Neural Amber
        rightHemi: new THREE.Color(0xff5500),    // Solar Flare
        core: new THREE.Color(0xffdd00),
        stem: new THREE.Color(0x00f0ff),
        sparks: new THREE.Color(0xffffff),
        ring1: 0xffaa00,
        ring2: 0xff5500,
        lightKey: 0xffaa00,
        lightRim: 0xff5500,
        lightStem: 0x00f0ff
      }
    };

    // Camera targets for scroll-driven choreography
    this.baseCameraPos = new THREE.Vector3(0, 0, 7.2);
    this.targetCameraPos = new THREE.Vector3(0, 0, 7.2);
    this.brainRotationTarget = new THREE.Vector2(0, 0);

    this.init();
  }

  init() {
    this.createScene();
    this.createLighting();
    this.generateProceduralBrain();
    this.generateConnectomeLines();
    this.generateActionPotentialSparks();
    this.generateHolographicHUD();
    this.setupEventListeners();
    this.animate();
  }

  createScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.055);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.copy(this.baseCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // Orbit controls with smooth damping
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = true;
      this.controls.minDistance = 4.0;
      this.controls.maxDistance = 14.0;
      this.controls.maxPolarAngle = Math.PI * 0.85;
      this.controls.minPolarAngle = Math.PI * 0.15;
      this.controls.autoRotate = false;
    }
  }

  createLighting() {
    // Ambient Cyber Glow
    const ambientLight = new THREE.AmbientLight(0x0d1527, 1.2);
    this.scene.add(ambientLight);

    // Key Light 1: Cyber Cyan
    this.lights.key = new THREE.PointLight(0x00f0ff, 3.2, 25);
    this.lights.key.position.set(-6, 4, 5);
    this.scene.add(this.lights.key);

    // Rim Light 2: Neon Magenta
    this.lights.rim = new THREE.PointLight(0xff007f, 3.2, 25);
    this.lights.rim.position.set(6, 3, -4);
    this.scene.add(this.lights.rim);

    // Stem / Edge Light 3: NVIDIA DeepStream Emerald
    this.lights.stem = new THREE.PointLight(0x00ff66, 2.5, 20);
    this.lights.stem.position.set(0, -5, -2);
    this.scene.add(this.lights.stem);

    // Dynamic Reactive Mouse Spotlight
    this.cursorLight = new THREE.PointLight(0x00f0ff, 2.0, 15);
    this.cursorLight.position.set(0, 0, 4);
    this.scene.add(this.cursorLight);
  }

  /**
   * Procedural Radial Glow Texture Generator
   * Produces soft exponential circular neon glow sprites without loading external assets.
   */
  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.15, 'rgba(230, 245, 255, 0.95)');
    grad.addColorStop(0.35, 'rgba(0, 240, 255, 0.6)');
    grad.addColorStop(0.7, 'rgba(0, 150, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Procedural Anatomical Human Brain Geometry Generation
   * Accurately constructs Left/Right Hemispheres, Lobes, Cerebellum, Brainstem,
   * Sulci/Gyri folds, and Corpus Callosum.
   */
  generateProceduralBrain() {
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);

    this.particlesData = [];
    const palette = this.palettes[this.currentTheme];

    for (let i = 0; i < this.particleCount; i++) {
      let x, y, z;
      let region = 'cortex';
      let hemi = Math.random() > 0.5 ? 1 : -1; // 1 = Right, -1 = Left
      const randType = Math.random();

      if (randType < 0.72) {
        // --- CEREBRAL CORTEX (Dual Hemispheres with Sulci & Gyri) ---
        region = hemi === 1 ? 'rightHemi' : 'leftHemi';
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);

        // Ellipsoidal base dimensions: slightly longer front-to-back (Z), curved top (Y)
        const radX = 1.65;
        const radY = 1.35;
        const radZ = 2.05;

        // Base coordinate for single hemisphere
        let bx = Math.sin(phi) * Math.cos(theta) * radX;
        let by = Math.cos(phi) * radY;
        let bz = Math.sin(phi) * Math.sin(theta) * radZ;

        // Frontal narrowing & temporal lobe curve
        if (bz > 0.3) {
          bx *= 0.88; // Frontal pole taper
        }
        if (by < 0.0 && bz > -0.4 && bz < 0.8) {
          // Temporal lobe bulge
          bx *= 1.15;
          by -= 0.15;
        }

        // Longitudinal Fissure separation gap between hemispheres
        const hemiGap = 0.14 + Math.random() * 0.05;
        bx = hemi * (Math.abs(bx) * 0.82 + hemiGap);

        // Gyri and Sulci folding harmonics (brain surface convolutions)
        const fold1 = Math.sin(theta * 9.0) * Math.cos(phi * 7.0);
        const fold2 = Math.sin(by * 6.0) * Math.cos(bz * 5.0);
        const fold3 = Math.sin((bx + bz) * 8.0) * 0.5;
        const foldMod = 1.0 + (fold1 * 0.12 + fold2 * 0.10 + fold3 * 0.08);

        // Volumetric distribution: some inside cortex shell, most on folded surface
        const volDepth = Math.pow(Math.random(), 0.35); // concentrates towards surface
        x = bx * foldMod * volDepth;
        y = by * foldMod * volDepth;
        z = bz * foldMod * volDepth;

      } else if (randType < 0.86) {
        // --- CEREBELLUM (Beneath occipital lobe at rear-base) ---
        region = 'cerebellum';
        const cTheta = Math.random() * Math.PI * 2;
        const cPhi = Math.random() * Math.PI;
        const cSide = Math.random() > 0.5 ? 0.45 : -0.45;
        const cRad = 0.55 + Math.random() * 0.25;

        // Fine horizontal parallel folds (folia)
        const folia = Math.sin(cPhi * 16.0) * 0.04;

        x = cSide + Math.sin(cPhi) * Math.cos(cTheta) * (cRad * 0.85) + folia;
        y = -0.75 + Math.cos(cPhi) * (cRad * 0.55);
        z = -1.15 + Math.sin(cPhi) * Math.sin(cTheta) * (cRad * 0.95);

      } else if (randType < 0.94) {
        // --- BRAINSTEM (Pons & Medulla extending downward) ---
        region = 'stem';
        const stemHeight = -0.7 - Math.random() * 1.1; // down to -1.8
        const stemRad = 0.24 * (1.0 - (stemHeight + 0.7) * 0.2); // slight taper
        const sAng = Math.random() * Math.PI * 2;

        x = Math.cos(sAng) * (stemRad * Math.random());
        y = stemHeight;
        z = -0.35 + Math.sin(sAng) * (stemRad * Math.random()) - (stemHeight * 0.12);

      } else {
        // --- CORPUS CALLOSUM & INNER NEURAL CORE ---
        region = 'core';
        const cArch = (Math.random() - 0.5) * 1.4;
        x = (Math.random() - 0.5) * 0.35;
        y = Math.cos(cArch) * 0.45 - 0.1;
        z = cArch * 1.2;
      }

      // Store Base Anatomical Coordinate
      const basePos = new THREE.Vector3(x, y, z);

      // Procedural Shatter / Scatter Coordinate for DEFORMATION
      // Particles explode outward along normal + swirling vortex + quantum turbulence
      const norm = basePos.clone().normalize();
      const scatterDistance = 3.2 + Math.random() * 5.5;
      const swirlAngle = Math.random() * Math.PI * 2;
      const swirlRadius = 1.5 + Math.random() * 3.0;

      const scatterPos = new THREE.Vector3(
        basePos.x + norm.x * scatterDistance + Math.cos(swirlAngle) * swirlRadius,
        basePos.y + norm.y * scatterDistance + (Math.random() - 0.5) * 4.0,
        basePos.z + norm.z * scatterDistance + Math.sin(swirlAngle) * swirlRadius
      );

      // Vertex Color Assignment
      let pColor;
      if (region === 'leftHemi') {
        pColor = palette.leftHemi.clone().lerp(new THREE.Color(0xffffff), Math.random() * 0.2);
      } else if (region === 'rightHemi') {
        pColor = palette.rightHemi.clone().lerp(new THREE.Color(0xffffff), Math.random() * 0.2);
      } else if (region === 'cerebellum' || region === 'stem') {
        pColor = palette.stem.clone().lerp(palette.leftHemi, Math.random() * 0.3);
      } else {
        pColor = palette.core.clone().lerp(new THREE.Color(0xffffff), 0.3);
      }

      // Random micro-size for depth & sparkling
      const size = 0.08 + Math.random() * 0.14;

      positions[i * 3] = basePos.x;
      positions[i * 3 + 1] = basePos.y;
      positions[i * 3 + 2] = basePos.z;

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;

      sizes[i] = size;

      // Particle physics data
      this.particlesData.push({
        basePos: basePos,
        currentPos: basePos.clone(),
        scatterPos: scatterPos,
        velocity: new THREE.Vector3(0, 0, 0),
        region: region,
        hemi: hemi,
        baseColor: pColor.clone(),
        activeColor: pColor.clone(),
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.5 + Math.random() * 2.5,
        originalSize: size,
        turbulenceOffset: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        )
      });
    }

    this.particlesGeometry = new THREE.BufferGeometry();
    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      map: this.createGlowTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.particlesMesh = new THREE.Points(this.particlesGeometry, pMaterial);
    this.scene.add(this.particlesMesh);
  }

  /**
   * Synaptic Connectome Lines
   * Connects close neighbors to create holographic cybernetic axonal pathways.
   */
  generateConnectomeLines() {
    this.connectomePairs = [];
    const maxDist = 0.46;
    const maxDistSq = maxDist * maxDist;

    // Sample subset of cortex particles to form structural axonal paths
    const sampleSize = 800;
    const step = Math.floor(this.particleCount / sampleSize);

    for (let i = 0; i < this.particleCount; i += step) {
      const pA = this.particlesData[i];
      let connections = 0;

      for (let j = i + step; j < this.particleCount; j += step) {
        if (connections >= 2) break;
        const pB = this.particlesData[j];

        // Do not connect across distant regions unless near corpus callosum
        if (pA.region !== pB.region && pA.region !== 'core' && pB.region !== 'core') continue;

        const distSq = pA.basePos.distanceToSquared(pB.basePos);
        if (distSq < maxDistSq && distSq > 0.04) {
          this.connectomePairs.push({
            idxA: i,
            idxB: j,
            dist: Math.sqrt(distSq),
            baseLength: Math.sqrt(distSq),
            alpha: 0.4 + Math.random() * 0.5
          });
          connections++;
          if (this.connectomePairs.length >= this.maxConnections) break;
        }
      }
      if (this.connectomePairs.length >= this.maxConnections) break;
    }

    const linePositions = new Float32Array(this.connectomePairs.length * 2 * 3);
    const lineColors = new Float32Array(this.connectomePairs.length * 2 * 3);

    for (let i = 0; i < this.connectomePairs.length; i++) {
      const pair = this.connectomePairs[i];
      const pA = this.particlesData[pair.idxA];
      const pB = this.particlesData[pair.idxB];

      linePositions[i * 6] = pA.basePos.x;
      linePositions[i * 6 + 1] = pA.basePos.y;
      linePositions[i * 6 + 2] = pA.basePos.z;
      linePositions[i * 6 + 3] = pB.basePos.x;
      linePositions[i * 6 + 4] = pB.basePos.y;
      linePositions[i * 6 + 5] = pB.basePos.z;

      const cA = pA.baseColor;
      const cB = pB.baseColor;

      lineColors[i * 6] = cA.r * 0.7;
      lineColors[i * 6 + 1] = cA.g * 0.7;
      lineColors[i * 6 + 2] = cA.b * 0.7;
      lineColors[i * 6 + 3] = cB.r * 0.7;
      lineColors[i * 6 + 4] = cB.g * 0.7;
      lineColors[i * 6 + 5] = cB.b * 0.7;
    }

    this.linesGeometry = new THREE.BufferGeometry();
    this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });

    this.linesMesh = new THREE.LineSegments(this.linesGeometry, lineMaterial);
    this.scene.add(this.linesMesh);
  }

  /**
   * Action Potential Sparks (Traveling Neural Impulses)
   * High-voltage photonic packets traveling along the connectome axons.
   */
  generateActionPotentialSparks() {
    this.impulsesData = [];
    const positions = new Float32Array(this.impulsesCount * 3);
    const colors = new Float32Array(this.impulsesCount * 3);

    for (let i = 0; i < this.impulsesCount; i++) {
      const pairIdx = Math.floor(Math.random() * this.connectomePairs.length);
      const speed = 0.8 + Math.random() * 1.6;
      
      this.impulsesData.push({
        pairIdx: pairIdx,
        progress: Math.random(),
        speed: speed,
        direction: Math.random() > 0.5 ? 1 : -1
      });

      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;
    }

    const impGeom = new THREE.BufferGeometry();
    impGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    impGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const impMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      map: this.createGlowTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });

    this.impulsesMesh = new THREE.Points(impGeom, impMat);
    this.scene.add(this.impulsesMesh);
  }

  /**
   * Holographic Cyberpunk HUD Rings
   * Rotating coordinate rings, targeting reticles, and calibration telemetry rings.
   */
  generateHolographicHUD() {
    this.hudGroup = new THREE.Group();

    // Equatorial Telemetry Ring
    const ring1Geom = new THREE.RingGeometry(2.7, 2.74, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: this.palettes[this.currentTheme].ring1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI * 0.5;
    this.hudGroup.add(ring1);
    this.hudRings.push({ mesh: ring1, rotSpeed: 0.12, axis: 'y' });

    // Inclined Gimbal Coordinate Ring
    const ring2Geom = new THREE.RingGeometry(3.1, 3.13, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: this.palettes[this.currentTheme].ring2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI * 0.35;
    ring2.rotation.y = Math.PI * 0.2;
    this.hudGroup.add(ring2);
    this.hudRings.push({ mesh: ring2, rotSpeed: -0.08, axis: 'z' });

    // Dashed Outer Targeting Arc
    const circlePts = [];
    const arcRadius = 3.4;
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      circlePts.push(new THREE.Vector3(Math.cos(a) * arcRadius, 0, Math.sin(a) * arcRadius));
    }
    const arcGeom = new THREE.BufferGeometry().setFromPoints(circlePts);
    const arcMat = new THREE.LineDashedMaterial({
      color: 0x00f0ff,
      dashSize: 0.25,
      gapSize: 0.15,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const arcMesh = new THREE.Line(arcGeom, arcMat);
    arcMesh.computeLineDistances();
    this.hudGroup.add(arcMesh);
    this.hudRings.push({ mesh: arcMesh, rotSpeed: 0.05, axis: 'y' });

    // Autonomous Agent Orbiting Satellites (DeepStream, LLM Agent, Drone YOLO, MuleNet GNN)
    const satConfigs = [
      { name: 'DeepStream Edge', color: 0x00ff66, radius: 2.9, speed: 0.55, inclination: 0.35, angle: 0 },
      { name: 'Autonomous LLM', color: 0x00f0ff, radius: 3.2, speed: -0.42, inclination: -0.45, angle: Math.PI * 0.5 },
      { name: 'Aerial Drone CV', color: 0xff007f, radius: 3.55, speed: 0.32, inclination: 0.8, angle: Math.PI },
      { name: 'Graph Neural Net', color: 0xffaa00, radius: 2.75, speed: -0.65, inclination: -0.25, angle: Math.PI * 1.5 }
    ];

    satConfigs.forEach(cfg => {
      const satGroup = new THREE.Group();
      
      // Mini glowing satellite core
      const coreGeom = new THREE.OctahedronGeometry(0.065, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: cfg.color
      });
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      satGroup.add(coreMesh);

      // Mini satellite wireframe shell
      const shellGeom = new THREE.IcosahedronGeometry(0.11, 0);
      const shellMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const shellMesh = new THREE.Mesh(shellGeom, shellMat);
      satGroup.add(shellMesh);

      this.hudGroup.add(satGroup);
      this.satellites.push({
        group: satGroup,
        shell: shellMesh,
        ...cfg
      });
    });

    this.scene.add(this.hudGroup);
  }

  setupEventListeners() {
    // Window Resize
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // Pointer move for real-time reactivity
    const targetElement = this.container;
    
    targetElement.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
    window.addEventListener('mousemove', (e) => this.onWindowMouseMove(e), { passive: true });

    // Interactive Click / Tap on Brain
    targetElement.addEventListener('click', (e) => this.onClickBrain(e));

    // Touch support for mobile devices
    targetElement.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = targetElement.getBoundingClientRect();
        this.targetMouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.targetMouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      }
    }, { passive: true });

    targetElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.triggerQuantumPulse();
      }
    }, { passive: true });
  }

  onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    if (!this.camera || !this.renderer) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onWindowMouseMove(e) {
    // Parallax tilt for the entire brain scene
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.brainRotationTarget.x = ny * 0.25;
    this.brainRotationTarget.y = nx * 0.35;
  }

  onClickBrain(e) {
    // Check if clicked directly on brain mesh via Raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.particlesMesh);

    if (intersects.length > 0 || Math.abs(this.mouse.x) < 0.65) {
      this.triggerQuantumPulse();
      if (window.cyberAudio) window.cyberAudio.playClick();
    }
  }

  /**
   * Triggers a sudden shockwave deformation and rapid magnetic reformation
   */
  triggerQuantumPulse() {
    if (window.cyberAudio) {
      if (this.deformFactor < 0.2) {
        window.cyberAudio.playDeform();
      } else {
        window.cyberAudio.playReform();
      }
    }

    // Toggle or burst deformation
    if (this.targetDeformFactor > 0.5) {
      this.targetDeformFactor = 0.0;
    } else {
      this.targetDeformFactor = 1.0;
      // Auto-reconstruct after 3.2 seconds if user doesn't press hold
      setTimeout(() => {
        if (this.targetDeformFactor === 1.0) {
          this.targetDeformFactor = 0.0;
          if (window.cyberAudio) window.cyberAudio.playReform();
          this.updateHUDTelemetry();
        }
      }, 3400);
    }

    this.updateHUDTelemetry();
  }

  /**
   * Public Controls for UI Buttons & Terminal
   */
  deform() {
    this.targetDeformFactor = 1.0;
    if (window.cyberAudio) window.cyberAudio.playDeform();
    this.updateHUDTelemetry();
  }

  reform() {
    this.targetDeformFactor = 0.0;
    if (window.cyberAudio) window.cyberAudio.playReform();
    this.updateHUDTelemetry();
  }

  toggleDeform() {
    if (this.targetDeformFactor > 0.4) {
      this.reform();
    } else {
      this.deform();
    }
  }

  toggleOverclock() {
    this.isOverclocked = !this.isOverclocked;
    if (window.cyberAudio) window.cyberAudio.playOverclock();
    this.updateHUDTelemetry();
    return this.isOverclocked;
  }

  /**
   * Synaptic Photonic Pulse Wave
   * Dispatches high-intensity energy wave propagating outward through neural connectome
   */
  triggerSynapticPulse() {
    this.pulseActive = true;
    this.pulseProgress = 0.1;
    if (window.cyberAudio && window.cyberAudio.playPulse) {
      window.cyberAudio.playPulse();
    }
    const stateEl = document.getElementById('hud-deform-state');
    if (stateEl) {
      stateEl.textContent = 'PHOTONIC IMPULSE // 4.8 GW';
      stateEl.style.color = '#00f0ff';
    }
    setTimeout(() => {
      this.updateHUDTelemetry();
    }, 1800);
  }

  setTheme(themeName) {
    if (!this.palettes[themeName]) return;
    this.currentTheme = themeName;
    const pal = this.palettes[themeName];

    // Update lights
    this.lights.key.color.setHex(pal.lightKey);
    this.lights.rim.color.setHex(pal.lightRim);
    this.lights.stem.color.setHex(pal.lightStem);
    if (this.cursorLight) this.cursorLight.color.setHex(pal.lightKey);

    // Update particles base colors
    const colors = this.particlesGeometry.attributes.color.array;
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particlesData[i];
      let newCol;
      if (p.region === 'leftHemi') newCol = pal.leftHemi;
      else if (p.region === 'rightHemi') newCol = pal.rightHemi;
      else if (p.region === 'cerebellum' || p.region === 'stem') newCol = pal.stem;
      else newCol = pal.core;

      p.baseColor.copy(newCol);
      colors[i * 3] = newCol.r;
      colors[i * 3 + 1] = newCol.g;
      colors[i * 3 + 2] = newCol.b;
    }
    this.particlesGeometry.attributes.color.needsUpdate = true;

    // Update HUD rings
    if (this.hudRings[0]) this.hudRings[0].mesh.material.color.setHex(pal.ring1);
    if (this.hudRings[1]) this.hudRings[1].mesh.material.color.setHex(pal.ring2);
  }

  /**
   * Region Highlight (called when hovering project cards or skills)
   * e.g., 'frontal', 'visual', 'cerebellum', 'stem'
   */
  highlightRegion(regionName) {
    const colors = this.particlesGeometry.attributes.color.array;
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particlesData[i];
      let match = false;

      if (regionName === 'visual' && p.basePos.z < -0.8 && p.basePos.y > -0.4) match = true;
      else if (regionName === 'frontal' && p.basePos.z > 0.4) match = true;
      else if (regionName === 'stem' && (p.region === 'stem' || p.region === 'cerebellum')) match = true;
      else if (regionName === 'temporal' && Math.abs(p.basePos.x) > 1.2 && p.basePos.y < 0.2) match = true;
      else if (regionName === 'all') match = true;

      if (match) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = p.baseColor.r * 0.35;
        colors[i * 3 + 1] = p.baseColor.g * 0.35;
        colors[i * 3 + 2] = p.baseColor.b * 0.35;
      }
    }
    this.particlesGeometry.attributes.color.needsUpdate = true;
  }

  resetHighlights() {
    const colors = this.particlesGeometry.attributes.color.array;
    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particlesData[i];
      colors[i * 3] = p.baseColor.r;
      colors[i * 3 + 1] = p.baseColor.g;
      colors[i * 3 + 2] = p.baseColor.b;
    }
    this.particlesGeometry.attributes.color.needsUpdate = true;
  }

  updateHUDTelemetry() {
    const deformBadge = document.getElementById('hud-deform-state');
    const coherenceVal = document.getElementById('hud-coherence-val');
    const freqVal = document.getElementById('hud-freq-val');

    if (deformBadge) {
      if (this.targetDeformFactor > 0.5) {
        deformBadge.textContent = 'DECONSTRUCTED // FIELD ACTIVE';
        deformBadge.classList.add('hud-alert');
      } else {
        deformBadge.textContent = 'SYNTHESIZED // COHERENT';
        deformBadge.classList.remove('hud-alert');
      }
    }

    if (coherenceVal) {
      const pct = Math.round((1 - this.deformFactor) * 100);
      coherenceVal.textContent = `${pct}%`;
    }

    if (freqVal) {
      const baseFreq = this.isOverclocked ? 432.8 : 144.2;
      freqVal.textContent = `${baseFreq.toFixed(1)} Hz`;
    }
  }

  /**
   * Main Render Loop
   * Executes spring-mass physics, pointer wave displacement,
   * synapse firing, lighting updates, and HUD telemetry.
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.time += delta;

    // Smooth mouse interpolation
    this.mouse.lerp(this.targetMouse, 0.08);

    // Compute 3D mouse coordinate on interactive plane
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.raycaster.ray.intersectPlane(this.mousePlane, this.mouseWorldPos);

    // Update dynamic reactive cursor light
    if (this.cursorLight && this.mouseWorldPos) {
      this.cursorLight.position.x = this.mouseWorldPos.x;
      this.cursorLight.position.y = this.mouseWorldPos.y;
      this.cursorLight.position.z = 2.5;
    }

    // Overclock transition
    const targetOverclock = this.isOverclocked ? 1.0 : 0.0;
    this.overclockLevel += (targetOverclock - this.overclockLevel) * 0.08;

    // Smooth deformFactor transition (exponential easing)
    this.deformFactor += (this.targetDeformFactor - this.deformFactor) * (0.05 + this.overclockLevel * 0.04);

    // Natural Organic Breathing Pulse
    const breathFreq = 1.4 + this.overclockLevel * 2.8;
    const breathAmp = 0.035 + this.overclockLevel * 0.06;
    const breath = 1.0 + Math.sin(this.time * breathFreq) * breathAmp;

    // Rotate Entire Brain Object smoothly
    if (this.particlesMesh) {
      // Base rotation + mouse parallax
      this.particlesMesh.rotation.y += (0.0035 + this.overclockLevel * 0.008) + (this.brainRotationTarget.y - this.particlesMesh.rotation.y) * 0.04;
      this.particlesMesh.rotation.x += (this.brainRotationTarget.x - this.particlesMesh.rotation.x) * 0.04;

      if (this.linesMesh) {
        this.linesMesh.rotation.copy(this.particlesMesh.rotation);
      }
      if (this.impulsesMesh) {
        this.impulsesMesh.rotation.copy(this.particlesMesh.rotation);
      }
    }

    // Rotate Holographic HUD rings
    this.hudRings.forEach(ring => {
      ring.mesh.rotation[ring.axis] += ring.rotSpeed * delta * (1.0 + this.overclockLevel * 2.0);
    });

    // Update Orbiting Autonomous Agent Satellites
    this.satellites.forEach(sat => {
      sat.angle += delta * sat.speed * (1.0 + this.overclockLevel * 1.5);
      const x = Math.cos(sat.angle) * sat.radius;
      const z = Math.sin(sat.angle) * sat.radius;
      const y = Math.sin(sat.angle * 2.5) * 0.25;

      const pos = new THREE.Vector3(x, y, z);
      pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.inclination);
      sat.group.position.copy(pos);

      sat.shell.rotation.x += delta * 2.2;
      sat.shell.rotation.y += delta * 3.4;
    });

    // Synaptic Pulse Photonic Wave Progress
    if (this.pulseActive) {
      this.pulseProgress += delta * 2.2;
      if (this.pulseProgress > 3.8) {
        this.pulseActive = false;
      }
    }

    // --- PARTICLE UPDATE (Deformation, Reformation, Mouse Wave Reactivity) ---
    const posAttr = this.particlesGeometry.attributes.position;
    const colAttr = this.particlesGeometry.attributes.color;
    const posArray = posAttr.array;
    const colArray = colAttr.array;

    const deformT = this.deformFactor;
    const mouseRadius = 1.8;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    // Transform mouse world pos to local coordinates of particlesMesh
    const invMatrix = new THREE.Matrix4().copy(this.particlesMesh.matrixWorld).invert();
    const localMouse = this.mouseWorldPos.clone().applyMatrix4(invMatrix);

    for (let i = 0; i < this.particleCount; i++) {
      const p = this.particlesData[i];

      // Interpolate between Base Anatomical Pos and Scatter Explosion Pos
      const targetX = THREE.MathUtils.lerp(p.basePos.x * breath, p.scatterPos.x, deformT);
      const targetY = THREE.MathUtils.lerp(p.basePos.y * breath, p.scatterPos.y, deformT);
      const targetZ = THREE.MathUtils.lerp(p.basePos.z * breath, p.scatterPos.z, deformT);

      // Mouse Reactive Liquid Wave
      const dx = targetX - localMouse.x;
      const dy = targetY - localMouse.y;
      const dz = targetZ - localMouse.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      let waveX = 0, waveY = 0, waveZ = 0;
      if (distSq < mouseRadiusSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const force = (1.0 - dist / mouseRadius) * 0.75;
        // Elastic repulsion wave
        waveX = (dx / dist) * force;
        waveY = (dy / dist) * force;
        waveZ = (dz / dist) * force;

        // Sparkle / illuminate particles near cursor
        colArray[i * 3] = THREE.MathUtils.lerp(p.baseColor.r, 1.0, force * 0.7);
        colArray[i * 3 + 1] = THREE.MathUtils.lerp(p.baseColor.g, 1.0, force * 0.7);
        colArray[i * 3 + 2] = THREE.MathUtils.lerp(p.baseColor.b, 1.0, force * 0.7);
      } else {
        // Return to base color with natural synapse flash
        const flash = (Math.sin(this.time * p.pulseSpeed + p.pulsePhase) + 1.0) * 0.15;
        colArray[i * 3] = Math.min(1.0, p.baseColor.r + flash);
        colArray[i * 3 + 1] = Math.min(1.0, p.baseColor.g + flash);
        colArray[i * 3 + 2] = Math.min(1.0, p.baseColor.b + flash);
      }

      // Quantum turbulence when deconstructed or overclocked
      let turbX = 0, turbY = 0, turbZ = 0;
      if (deformT > 0.05 || this.overclockLevel > 0.1) {
        const freq = 3.0 + this.overclockLevel * 6.0;
        const amp = (deformT * 0.25) + (this.overclockLevel * 0.08);
        turbX = Math.sin(this.time * freq + p.pulsePhase) * amp;
        turbY = Math.cos(this.time * freq + p.pulsePhase * 1.3) * amp;
        turbZ = Math.sin(this.time * freq * 0.8 + p.pulsePhase) * amp;
      }

      // Synaptic Photonic Pulse Wave Displacement
      let pulseDispX = 0, pulseDispY = 0, pulseDispZ = 0;
      if (this.pulseActive) {
        const pDist = Math.sqrt(p.basePos.x * p.basePos.x + p.basePos.y * p.basePos.y + p.basePos.z * p.basePos.z);
        const pDiff = Math.abs(pDist - this.pulseProgress);
        if (pDiff < 0.45) {
          const pFactor = (1.0 - pDiff / 0.45);
          pulseDispX = (p.basePos.x / (pDist + 0.01)) * pFactor * 0.4;
          pulseDispY = (p.basePos.y / (pDist + 0.01)) * pFactor * 0.4;
          pulseDispZ = (p.basePos.z / (pDist + 0.01)) * pFactor * 0.4;
          colArray[i * 3] = Math.min(1.0, colArray[i * 3] + pFactor * 0.9);
          colArray[i * 3 + 1] = Math.min(1.0, colArray[i * 3 + 1] + pFactor * 0.9);
          colArray[i * 3 + 2] = Math.min(1.0, colArray[i * 3 + 2] + pFactor * 1.0);
        }
      }

      // Elastic Spring-Mass Physics towards current combined target
      const destX = targetX + waveX + turbX + pulseDispX;
      const destY = targetY + waveY + turbY + pulseDispY;
      const destZ = targetZ + waveZ + turbZ + pulseDispZ;

      // Spring force
      p.velocity.x += (destX - p.currentPos.x) * 0.18;
      p.velocity.y += (destY - p.currentPos.y) * 0.18;
      p.velocity.z += (destZ - p.currentPos.z) * 0.18;

      // Damping
      p.velocity.multiplyScalar(0.78);

      // Integrate
      p.currentPos.add(p.velocity);

      posArray[i * 3] = p.currentPos.x;
      posArray[i * 3 + 1] = p.currentPos.y;
      posArray[i * 3 + 2] = p.currentPos.z;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // --- CONNECTOME LINES UPDATE ---
    if (this.linesGeometry) {
      const linePosArray = this.linesGeometry.attributes.position.array;
      const lineColArray = this.linesGeometry.attributes.color.array;
      const lineOpacity = Math.max(0.08, 0.45 * (1.0 - deformT * 0.85));
      this.linesMesh.material.opacity = lineOpacity;

      for (let i = 0; i < this.connectomePairs.length; i++) {
        const pair = this.connectomePairs[i];
        const pA = this.particlesData[pair.idxA];
        const pB = this.particlesData[pair.idxB];

        linePosArray[i * 6] = pA.currentPos.x;
        linePosArray[i * 6 + 1] = pA.currentPos.y;
        linePosArray[i * 6 + 2] = pA.currentPos.z;
        linePosArray[i * 6 + 3] = pB.currentPos.x;
        linePosArray[i * 6 + 4] = pB.currentPos.y;
        linePosArray[i * 6 + 5] = pB.currentPos.z;
      }
      this.linesGeometry.attributes.position.needsUpdate = true;
    }

    // --- ACTION POTENTIAL IMPULSES (Traveling Synaptic Sparks) ---
    if (this.impulsesMesh && this.connectomePairs.length > 0) {
      const impPosArray = this.impulsesMesh.geometry.attributes.position.array;
      const speedMultiplier = (1.0 + this.overclockLevel * 2.5);

      for (let i = 0; i < this.impulsesCount; i++) {
        const imp = this.impulsesData[i];
        const pair = this.connectomePairs[imp.pairIdx];
        const pA = this.particlesData[pair.idxA];
        const pB = this.particlesData[pair.idxB];

        imp.progress += imp.speed * delta * speedMultiplier * imp.direction;

        if (imp.progress > 1.0) {
          imp.progress = 0.0;
          imp.pairIdx = Math.floor(Math.random() * this.connectomePairs.length);
        } else if (imp.progress < 0.0) {
          imp.progress = 1.0;
          imp.pairIdx = Math.floor(Math.random() * this.connectomePairs.length);
        }

        const t = imp.progress;
        impPosArray[i * 3] = THREE.MathUtils.lerp(pA.currentPos.x, pB.currentPos.x, t);
        impPosArray[i * 3 + 1] = THREE.MathUtils.lerp(pA.currentPos.y, pB.currentPos.y, t);
        impPosArray[i * 3 + 2] = THREE.MathUtils.lerp(pA.currentPos.z, pB.currentPos.z, t);
      }
      this.impulsesMesh.geometry.attributes.position.needsUpdate = true;
    }

    // Render Scene
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization helper
window.initCyberBrain = function(containerId) {
  window.brainEngine = new CyberBrainEngine(containerId);
  return window.brainEngine;
};

