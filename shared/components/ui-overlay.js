// UI Overlay Component for VR Gateway
// Handles 2D UI elements, HUD, and overlay interfaces

AFRAME.registerComponent('ui-overlay', {
  schema: {
    showFPS: {type: 'boolean', default: false},
    showPosition: {type: 'boolean', default: false},
    showInstructions: {type: 'boolean', default: true}
  },

  init: function () {
    this.createMainUI();
    this.createLoadingScreen();
    this.createFPSCounter();
    this.createPositionTracker();
    this.createInstructionsPanel();
    this.setupEventListeners();
  },

  createMainUI: function () {
    // Main UI container
    this.uiContainer = document.createElement('div');
    this.uiContainer.id = 'vr-ui-overlay';
    this.uiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
      font-family: 'Arial', sans-serif;
    `;
    document.body.appendChild(this.uiContainer);
  },

  createLoadingScreen: function () {
    this.loadingScreen = document.createElement('div');
    this.loadingScreen.id = 'loading-screen';
    this.loadingScreen.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
      ">
        <div style="
          animation: pulse 2s ease-in-out infinite;
          margin-bottom: 30px;
          font-size: 4rem;
        ">🌌</div>
        <h1 style="font-size: 2.5rem; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          The Signpost Observatory
        </h1>
        <p style="font-size: 1.2rem; margin: 10px 0; opacity: 0.9;">
          Initializing VR Gateway...
        </p>
        <div style="
          width: 200px;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          margin: 20px 0;
          overflow: hidden;
        ">
          <div style="
            width: 0%;
            height: 100%;
            background: #4CC3D9;
            border-radius: 2px;
            animation: loading 3s ease-out forwards;
          "></div>
        </div>
        <small style="opacity: 0.7;">
          "All we can be now is the signposts for tomorrow and those that come after"
        </small>
      </div>
    `;

    // Add loading animation styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.7; }
      }
      @keyframes loading {
        0% { width: 0%; }
        100% { width: 100%; }
      }
    `;
    document.head.appendChild(loadingStyles);

    this.uiContainer.appendChild(this.loadingScreen);

    // Hide loading screen after 3 seconds
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 3000);
  },

  hideLoadingScreen: function () {
    if (this.loadingScreen) {
      this.loadingScreen.style.opacity = '0';
      this.loadingScreen.style.transition = 'opacity 1s ease-out';
      setTimeout(() => {
        if (this.loadingScreen && this.loadingScreen.parentElement) {
          this.loadingScreen.remove();
        }
      }, 1000);
    }
  },

  createFPSCounter: function () {
    this.fpsCounter = document.createElement('div');
    this.fpsCounter.id = 'fps-counter';
    this.fpsCounter.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.7);
      color: #4CC3D9;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      pointer-events: auto;
      display: ${this.data.showFPS ? 'block' : 'none'};
      backdrop-filter: blur(10px);
    `;
    this.fpsCounter.innerHTML = 'FPS: --';
    this.uiContainer.appendChild(this.fpsCounter);

    // Update FPS counter
    this.frameCount = 0;
    this.lastTime = performance.now();
    setInterval(() => {
      this.updateFPS();
    }, 1000);
  },

  updateFPS: function () {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    const fps = Math.round(1000 / (deltaTime / this.frameCount));
    
    if (this.fpsCounter && this.data.showFPS) {
      this.fpsCounter.innerHTML = `FPS: ${fps}`;
      
      // Color based on performance
      if (fps >= 60) {
        this.fpsCounter.style.color = '#4CC3D9';
      } else if (fps >= 30) {
        this.fpsCounter.style.color = '#FFC65D';
      } else {
        this.fpsCounter.style.color = '#FF6B6B';
      }
    }
    
    this.frameCount = 0;
    this.lastTime = currentTime;
  },

  createPositionTracker: function () {
    this.positionTracker = document.createElement('div');
    this.positionTracker.id = 'position-tracker';
    this.positionTracker.style.cssText = `
      position: fixed;
      top: 50px;
      left: 10px;
      background: rgba(0,0,0,0.7);
      color: #4CC3D9;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-family: monospace;
      pointer-events: auto;
      display: ${this.data.showPosition ? 'block' : 'none'};
      backdrop-filter: blur(10px);
    `;
    this.positionTracker.innerHTML = 'Position: (0, 0, 0)';
    this.uiContainer.appendChild(this.positionTracker);
  },

  createInstructionsPanel: function () {
    this.instructionsPanel = document.createElement('div');
    this.instructionsPanel.id = 'instructions-panel';
    this.instructionsPanel.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      text-align: center;
      pointer-events: auto;
      display: ${this.data.showInstructions ? 'block' : 'none'};
      backdrop-filter: blur(10px);
      transition: opacity 0.3s ease;
    `;
    this.instructionsPanel.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>🎮 Controls</strong>
      </div>
      <div style="font-size: 0.9em; line-height: 1.4;">
        WASD: Move • Mouse: Look • Click: Interact • ESC: Help
      </div>
      <button onclick="this.parentElement.style.display='none'" style="
        margin-top: 10px;
        padding: 5px 15px;
        background: transparent;
        border: 1px solid #4CC3D9;
        border-radius: 4px;
        color: #4CC3D9;
        cursor: pointer;
        font-size: 0.8em;
      ">Hide</button>
    `;
    this.uiContainer.appendChild(this.instructionsPanel);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (this.instructionsPanel && this.data.showInstructions) {
        this.instructionsPanel.style.opacity = '0.5';
      }
    }, 10000);
  },

  setupEventListeners: function () {
    // VR mode enter/exit events
    document.addEventListener('enter-vr', () => {
      this.onEnterVR();
    });

    document.addEventListener('exit-vr', () => {
      this.onExitVR();
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.onResize();
    });

    // Toggle UI elements with keyboard
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey) {
        switch(event.code) {
          case 'KeyF':
            event.preventDefault();
            this.toggleFPS();
            break;
          case 'KeyP':
            event.preventDefault();
            this.togglePosition();
            break;
          case 'KeyI':
            event.preventDefault();
            this.toggleInstructions();
            break;
        }
      }
    });
  },

  onEnterVR: function () {
    // Hide 2D UI elements in VR mode
    this.uiContainer.style.display = 'none';
    console.log('Entered VR mode - UI overlay hidden');
  },

  onExitVR: function () {
    // Show 2D UI elements when exiting VR
    this.uiContainer.style.display = 'block';
    console.log('Exited VR mode - UI overlay shown');
  },

  onResize: function () {
    // Handle responsive design changes
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && this.instructionsPanel) {
      this.instructionsPanel.style.fontSize = '0.8rem';
      this.instructionsPanel.style.padding = '10px 15px';
    }
  },

  toggleFPS: function () {
    this.data.showFPS = !this.data.showFPS;
    this.fpsCounter.style.display = this.data.showFPS ? 'block' : 'none';
  },

  togglePosition: function () {
    this.data.showPosition = !this.data.showPosition;
    this.positionTracker.style.display = this.data.showPosition ? 'block' : 'none';
  },

  toggleInstructions: function () {
    this.data.showInstructions = !this.data.showInstructions;
    this.instructionsPanel.style.display = this.data.showInstructions ? 'block' : 'none';
  },

  showNotification: function (title, message, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(76, 195, 217, 0.95);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      backdrop-filter: blur(10px);
      pointer-events: auto;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
      <div style="font-size: 0.9em; opacity: 0.9;">${message}</div>
    `;

    this.uiContainer.appendChild(notification);

    // Auto-remove
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }
    }, duration);

    return notification;
  },

  tick: function () {
    this.frameCount++;

    // Update position tracker if enabled
    if (this.data.showPosition && this.positionTracker) {
      const camera = document.querySelector('[camera]');
      if (camera) {
        const position = camera.getAttribute('position');
        const rotation = camera.getAttribute('rotation');
        this.positionTracker.innerHTML = `
          Position: (${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)})<br>
          Rotation: (${rotation.x.toFixed(0)}°, ${rotation.y.toFixed(0)}°, ${rotation.z.toFixed(0)}°)
        `;
      }
    }
  }
});

// Auto-initialize UI overlay
document.addEventListener('DOMContentLoaded', () => {
  // Add to scene or body
  const scene = document.querySelector('a-scene');
  if (scene) {
    scene.setAttribute('ui-overlay', '');
  } else {
    // Create invisible entity for the component
    const uiEntity = document.createElement('a-entity');
    uiEntity.setAttribute('ui-overlay', '');
    document.body.appendChild(uiEntity);
  }

  // Add slide animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}); 