/**
 * Signpost Observatory Engine - Building Component
 * Handles building-specific functionality and interactions
 * 
 * Features:
 * - Building loading and placement
 * - Building interactions and events
 * - Building state management
 * - Building optimization
 */

AFRAME.registerComponent('building-component', {
    schema: {
        enabled: { type: 'boolean', default: true },
        buildingType: { type: 'string', default: 'observatory' },
        scale: { type: 'number', default: 1.0 },
        position: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        rotation: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        interactive: { type: 'boolean', default: true },
        clickable: { type: 'boolean', default: true },
        hoverable: { type: 'boolean', default: true }
    },
    
    init: function() {
        this.isLoaded = false;
        this.isInteracting = false;
        this.originalScale = null;
        this.originalPosition = null;
        
        this.setupEventListeners();
        this.setupBuilding();
    },
    
    setupEventListeners: function() {
        if (this.data.interactive) {
            if (this.data.clickable) {
                this.el.addEventListener('click', this.onBuildingClick.bind(this));
            }
            
            if (this.data.hoverable) {
                this.el.addEventListener('mouseenter', this.onBuildingHover.bind(this));
                this.el.addEventListener('mouseleave', this.onBuildingLeave.bind(this));
            }
        }
        
        // Listen for model loaded events
        this.el.addEventListener('model-loaded', this.onModelLoaded.bind(this));
        this.el.addEventListener('model-error', this.onModelError.bind(this));
    },
    
    setupBuilding: function() {
        // Store original transform
        this.originalScale = this.el.getAttribute('scale');
        this.originalPosition = this.el.getAttribute('position');
        
        // Apply building-specific settings
        this.applyBuildingSettings();
    },
    
    applyBuildingSettings: function() {
        // Apply scale
        if (this.data.scale !== 1.0) {
            this.el.setAttribute('scale', {
                x: this.data.scale,
                y: this.data.scale,
                z: this.data.scale
            });
        }
        
        // Apply position
        if (this.data.position.x !== 0 || this.data.position.y !== 0 || this.data.position.z !== 0) {
            this.el.setAttribute('position', this.data.position);
        }
        
        // Apply rotation
        if (this.data.rotation.x !== 0 || this.data.rotation.y !== 0 || this.data.rotation.z !== 0) {
            this.el.setAttribute('rotation', this.data.rotation);
        }
    },
    
    onModelLoaded: function() {
        this.isLoaded = true;
        console.log(`🏢 Building loaded: ${this.data.buildingType}`);
        
        // Add building-specific components
        this.addBuildingComponents();
        
        // Emit building loaded event
        this.el.emit('building-loaded', {
            buildingType: this.data.buildingType,
            element: this.el
        });
    },
    
    onModelError: function(error) {
        console.error(`❌ Building load error: ${this.data.buildingType}`, error);
        
        // Emit building error event
        this.el.emit('building-error', {
            buildingType: this.data.buildingType,
            error: error
        });
    },
    
    addBuildingComponents: function() {
        // Add shadow casting
        this.el.setAttribute('shadow', 'cast: true; receive: true');
        
        // Add physics body if physics is enabled
        if (window.engine && window.engine.state.scene.physicsEnabled) {
            this.el.setAttribute('physics-body', {
                type: 'static',
                mass: 0
            });
        }
        
        // Add building-specific material properties
        this.el.setAttribute('material', {
            ...this.el.getAttribute('material'),
            metalness: 0.1,
            roughness: 0.8
        });
    },
    
    onBuildingClick: function(event) {
        if (!this.data.enabled) return;
        
        console.log(`🏢 Building clicked: ${this.data.buildingType}`);
        
        // Emit building click event
        this.el.emit('building-clicked', {
            buildingType: this.data.buildingType,
            position: event.detail.intersection?.point,
            element: this.el
        });
        
        // Trigger building-specific actions
        this.triggerBuildingAction();
    },
    
    onBuildingHover: function() {
        if (!this.data.enabled || !this.data.hoverable) return;
        
        this.isInteracting = true;
        
        // Add hover effect
        this.el.setAttribute('animation__hover', {
            property: 'scale',
            to: `${this.data.scale * 1.05} ${this.data.scale * 1.05} ${this.data.scale * 1.05}`,
            dur: 300,
            easing: 'easeOutQuad'
        });
        
        // Emit building hover event
        this.el.emit('building-hover', {
            buildingType: this.data.buildingType,
            element: this.el
        });
    },
    
    onBuildingLeave: function() {
        if (!this.data.enabled || !this.data.hoverable) return;
        
        this.isInteracting = false;
        
        // Remove hover effect
        this.el.setAttribute('animation__hover', {
            property: 'scale',
            to: `${this.data.scale} ${this.data.scale} ${this.data.scale}`,
            dur: 300,
            easing: 'easeOutQuad'
        });
        
        // Emit building leave event
        this.el.emit('building-leave', {
            buildingType: this.data.buildingType,
            element: this.el
        });
    },
    
    triggerBuildingAction: function() {
        switch (this.data.buildingType) {
            case 'observatory':
                this.triggerObservatoryAction();
                break;
            case 'library':
                this.triggerLibraryAction();
                break;
            case 'laboratory':
                this.triggerLaboratoryAction();
                break;
            case 'gallery':
                this.triggerGalleryAction();
                break;
            default:
                this.triggerDefaultAction();
        }
    },
    
    triggerObservatoryAction: function() {
        console.log('🔭 Observatory action triggered');
        
        // Add special observatory effects
        this.el.setAttribute('animation__pulse', {
            property: 'material.emissiveIntensity',
            to: 0.3,
            dur: 1000,
            dir: 'alternate',
            loop: true
        });
        
        // Emit observatory event
        this.el.emit('observatory-activated', {
            element: this.el
        });
    },
    
    triggerLibraryAction: function() {
        console.log('📚 Library action triggered');
        
        // Add library-specific effects
        this.el.setAttribute('animation__glow', {
            property: 'material.emissiveIntensity',
            to: 0.2,
            dur: 2000,
            dir: 'alternate',
            loop: true
        });
        
        // Emit library event
        this.el.emit('library-activated', {
            element: this.el
        });
    },
    
    triggerLaboratoryAction: function() {
        console.log('🧪 Laboratory action triggered');
        
        // Add laboratory-specific effects
        this.el.setAttribute('animation__sparkle', {
            property: 'material.emissiveIntensity',
            to: 0.4,
            dur: 500,
            dir: 'alternate',
            loop: true
        });
        
        // Emit laboratory event
        this.el.emit('laboratory-activated', {
            element: this.el
        });
    },
    
    triggerGalleryAction: function() {
        console.log('🎨 Gallery action triggered');
        
        // Add gallery-specific effects
        this.el.setAttribute('animation__color', {
            property: 'material.color',
            to: '#ffaa00',
            dur: 1000,
            dir: 'alternate',
            loop: true
        });
        
        // Emit gallery event
        this.el.emit('gallery-activated', {
            element: this.el
        });
    },
    
    triggerDefaultAction: function() {
        console.log(`🏢 Default building action for: ${this.data.buildingType}`);
        
        // Add default effect
        this.el.setAttribute('animation__default', {
            property: 'scale',
            to: `${this.data.scale * 1.1} ${this.data.scale * 1.1} ${this.data.scale * 1.1}`,
            dur: 200,
            dir: 'alternate'
        });
        
        // Emit default building event
        this.el.emit('building-activated', {
            buildingType: this.data.buildingType,
            element: this.el
        });
    },
    
    update: function(oldData) {
        // Handle schema updates
        if (oldData.enabled !== this.data.enabled) {
            this.setEnabled(this.data.enabled);
        }
        
        if (oldData.scale !== this.data.scale) {
            this.setScale(this.data.scale);
        }
    },
    
    setEnabled: function(enabled) {
        this.data.enabled = enabled;
        
        if (enabled) {
            this.el.setAttribute('visible', true);
        } else {
            this.el.setAttribute('visible', false);
        }
    },
    
    setScale: function(scale) {
        this.data.scale = scale;
        this.el.setAttribute('scale', {
            x: scale,
            y: scale,
            z: scale
        });
    },
    
    remove: function() {
        // Clean up event listeners
        this.el.removeEventListener('click', this.onBuildingClick);
        this.el.removeEventListener('mouseenter', this.onBuildingHover);
        this.el.removeEventListener('mouseleave', this.onBuildingLeave);
        this.el.removeEventListener('model-loaded', this.onModelLoaded);
        this.el.removeEventListener('model-error', this.onModelError);
    }
});

console.log('📦 Building Component loaded'); 