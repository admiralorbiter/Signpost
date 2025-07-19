// Navigation Component for VR Gateway
// Handles movement, teleportation, and navigation controls

AFRAME.registerComponent('vr-navigation', {
  schema: {
    speed: {type: 'number', default: 2.0},
    teleportEnabled: {type: 'boolean', default: true},
    flyEnabled: {type: 'boolean', default: false}
  },

  init: function () {
    this.setupMovementControls();
    this.setupTeleportation();
    this.setupGazeNavigation();
    this.bindKeyboardControls();
    
    // Track navigation state
    this.isMoving = false;
    this.lastPosition = this.el.getAttribute('position');
  },

  setupMovementControls: function () {
    // Enhanced WASD controls with momentum
    this.el.setAttribute('wasd-controls', {
      acceleration: 30,
      fly: this.data.flyEnabled
    });
    
    // Mouse look controls
    this.el.setAttribute('look-controls', {
      touchEnabled: true,
      magicWindowTrackingEnabled: true
    });
  },

  setupTeleportation: function () {
    if (!this.data.teleportEnabled) return;
    
    // Create teleportation system
    const teleportControls = document.createElement('a-entity');
    teleportControls.setAttribute('teleport-controls', {
      button: 'trigger',
      collisionEntities: '[teleport-destination]',
      cameraRig: this.el,
      teleportFade: true
    });
    
    this.el.appendChild(teleportControls);
  },

  setupGazeNavigation: function () {
    // Create gaze cursor for non-VR navigation
    const cursor = document.createElement('a-entity');
    cursor.setAttribute('cursor', {
      fuse: true,
      fuseTimeout: 1500,
      rayOrigin: 'entity'
    });
    cursor.setAttribute('geometry', {
      primitive: 'ring',
      radiusInner: 0.01,
      radiusOuter: 0.02
    });
    cursor.setAttribute('material', {
      color: '#4CC3D9',
      shader: 'flat'
    });
    cursor.setAttribute('position', '0 0 -1');
    cursor.setAttribute('animation__fuse', {
      property: 'scale',
      startEvents: 'fusing',
      from: '1 1 1',
      to: '0.1 0.1 0.1',
      dur: 1500
    });
    
    // Add cursor to camera
    const camera = this.el.querySelector('[camera]') || this.el;
    camera.appendChild(cursor);
  },

  bindKeyboardControls: function () {
    // Additional keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      switch(event.code) {
        case 'KeyR':
          this.resetPosition();
          break;
        case 'KeyF':
          this.toggleFlight();
          break;
        case 'KeyT':
          this.toggleTeleportMode();
          break;
        case 'Escape':
          this.showNavigationHelp();
          break;
      }
    });
  },

  resetPosition: function () {
    // Reset to starting position
    this.el.setAttribute('position', '0 1.6 3');
    this.el.setAttribute('rotation', '0 0 0');
    
    console.log('Position reset to start');
    this.showNotification('Position Reset', 'Returned to starting point');
  },

  toggleFlight: function () {
    const wasdControls = this.el.components['wasd-controls'];
    if (wasdControls) {
      const currentFly = wasdControls.data.fly;
      wasdControls.updateProperties({ fly: !currentFly });
      
      const mode = !currentFly ? 'Flight' : 'Ground';
      this.showNotification(`${mode} Mode`, `Switched to ${mode.toLowerCase()} movement`);
    }
  },

  toggleTeleportMode: function () {
    this.data.teleportEnabled = !this.data.teleportEnabled;
    const mode = this.data.teleportEnabled ? 'Enabled' : 'Disabled';
    this.showNotification(`Teleport ${mode}`, `Teleportation is now ${mode.toLowerCase()}`);
  },

  showNavigationHelp: function () {
    const helpText = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: left;
        z-index: 1000;
        max-width: 400px;
      ">
        <h2 style="text-align: center; margin-bottom: 20px;">🎮 Navigation Controls</h2>
        <div style="line-height: 1.8;">
          <strong>Movement:</strong><br>
          • WASD - Move around<br>
          • Mouse - Look around<br>
          • R - Reset position<br>
          • F - Toggle flight mode<br>
          • T - Toggle teleportation<br><br>
          
          <strong>VR Controls:</strong><br>
          • Trigger - Teleport (if enabled)<br>
          • Gaze + Hold - Select portals<br><br>
          
          <strong>Other:</strong><br>
          • ESC - Show this help<br>
          • Click portals to navigate
        </div>
        <button onclick="this.parentElement.remove()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: #4CC3D9;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          width: 100%;
        ">Got it!</button>
      </div>
    `;
    
    const helpDiv = document.createElement('div');
    helpDiv.innerHTML = helpText;
    document.body.appendChild(helpDiv);
  },

  showNotification: function (title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(76, 195, 217, 0.9);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      z-index: 1000;
      backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <strong>${title}</strong><br>
      <small>${message}</small>
    `;
    
    // Add animation styles
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  },

  tick: function () {
    // Track movement for analytics or effects
    const currentPosition = this.el.getAttribute('position');
    
    if (this.hasPositionChanged(currentPosition)) {
      this.isMoving = true;
      this.lastPosition = Object.assign({}, currentPosition);
    } else {
      this.isMoving = false;
    }
  },

  hasPositionChanged: function (currentPos) {
    const threshold = 0.01;
    return Math.abs(currentPos.x - this.lastPosition.x) > threshold ||
           Math.abs(currentPos.y - this.lastPosition.y) > threshold ||
           Math.abs(currentPos.z - this.lastPosition.z) > threshold;
  }
});

// Auto-apply navigation to camera rig
document.addEventListener('DOMContentLoaded', () => {
  const cameraRig = document.querySelector('#cameraRig') || document.querySelector('a-camera');
  if (cameraRig) {
    cameraRig.setAttribute('vr-navigation', '');
  }
}); 