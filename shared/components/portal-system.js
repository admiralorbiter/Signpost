// Portal System Component for VR Gateway
// Handles portal interactions and navigation between VR experiences

AFRAME.registerComponent('portal-system', {
  schema: {
    destination: {type: 'string'},
    title: {type: 'string'},
    description: {type: 'string'},
    color: {type: 'color', default: '#4CC3D9'}
  },

  init: function () {
    this.el.addEventListener('click', this.onPortalClick.bind(this));
    this.el.addEventListener('mouseenter', this.onPortalHover.bind(this));
    this.el.addEventListener('mouseleave', this.onPortalLeave.bind(this));
    
    // Add visual feedback
    this.addPortalEffects();
  },

  onPortalClick: function () {
    const destination = this.data.destination;
    const title = this.data.title;
    
    // Log portal interaction
    console.log(`Portal activated: ${title} -> ${destination}`);
    
    // Handle different destination types
    if (destination.startsWith('http')) {
      // External URL
      window.open(destination, '_blank');
    } else if (destination.endsWith('.html')) {
      // Local HTML file
      window.location.href = destination;
    } else {
      // Project directory
      this.loadProjectSpace(destination);
    }
    
    // Trigger transition effect
    this.triggerPortalTransition();
  },

  onPortalHover: function () {
    // Hover effects
    this.el.setAttribute('animation__mouseenter', {
      property: 'scale',
      to: '1.1 1.1 1.1',
      startEvents: 'mouseenter',
      dur: 300
    });
    
    // Show UI overlay with portal info
    this.showPortalInfo();
  },

  onPortalLeave: function () {
    this.el.setAttribute('animation__mouseleave', {
      property: 'scale',
      to: '1 1 1',
      startEvents: 'mouseleave',
      dur: 300
    });
    
    // Hide UI overlay
    this.hidePortalInfo();
  },

  addPortalEffects: function () {
    // Add particle effects
    const particles = document.createElement('a-entity');
    particles.setAttribute('particle-system', {
      preset: 'dust',
      particleCount: 100,
      color: this.data.color
    });
    this.el.appendChild(particles);
    
    // Add ambient glow
    this.el.setAttribute('material', {
      color: this.data.color,
      emissive: this.data.color,
      emissiveIntensity: 0.2
    });
  },

  loadProjectSpace: function (projectName) {
    // Future: Load specific VR experiences
    console.log(`Loading project space: ${projectName}`);
    
    // For now, show placeholder message
    this.showPlaceholderMessage(projectName);
  },

  triggerPortalTransition: function () {
    // Add screen transition effect
    const overlay = document.getElementById('transition-overlay') || this.createTransitionOverlay();
    overlay.style.opacity = '1';
    
    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 1500);
  },

  createTransitionOverlay: function () {
    const overlay = document.createElement('div');
    overlay.id = 'transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.8) 100%);
      opacity: 0;
      transition: opacity 1.5s ease;
      pointer-events: none;
      z-index: 1000;
    `;
    document.body.appendChild(overlay);
    return overlay;
  },

  showPortalInfo: function () {
    // Create or show portal info UI
    const info = document.getElementById('portal-info') || this.createPortalInfoUI();
    info.innerHTML = `
      <h3>${this.data.title}</h3>
      <p>${this.data.description}</p>
      <small>Click to enter</small>
    `;
    info.style.display = 'block';
  },

  hidePortalInfo: function () {
    const info = document.getElementById('portal-info');
    if (info) {
      info.style.display = 'none';
    }
  },

  createPortalInfoUI: function () {
    const info = document.createElement('div');
    info.id = 'portal-info';
    info.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      text-align: center;
      display: none;
      z-index: 100;
      backdrop-filter: blur(10px);
    `;
    document.body.appendChild(info);
    return info;
  },

  showPlaceholderMessage: function (projectName) {
    const message = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        z-index: 1000;
      ">
        <h2>🚀 ${projectName.toUpperCase()} Portal</h2>
        <p>This VR experience is under development.</p>
        <p>Check back soon for immersive content!</p>
        <button onclick="this.parentElement.remove()" style="
          margin-top: 15px;
          padding: 10px 20px;
          background: #4CC3D9;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
        ">Close</button>
      </div>
    `;
    
    const placeholder = document.createElement('div');
    placeholder.innerHTML = message;
    document.body.appendChild(placeholder);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (placeholder.parentElement) {
        placeholder.remove();
      }
    }, 5000);
  }
}); 