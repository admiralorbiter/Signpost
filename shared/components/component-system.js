/**
 * Signpost Observatory Engine - Component-Entity System
 * Modular A-Frame components for reusable behaviors
 * 
 * Features:
 * - Self-contained components
 * - Event-based communication
 * - Reusable behaviors
 * - Component lifecycle management
 */

// Base Component Class
class BaseComponent {
    constructor() {
        this.el = null;
        this.data = {};
        this.isInitialized = false;
        this.isDestroyed = false;
    }
    
    init() {
        this.isInitialized = true;
        this.setupEventListeners();
        this.onInit();
    }
    
    update(deltaTime) {
        if (!this.isInitialized || this.isDestroyed) return;
        this.onUpdate(deltaTime);
    }
    
    remove() {
        this.isDestroyed = true;
        this.removeEventListeners();
        this.onRemove();
    }
    
    // Override these methods in subclasses
    onInit() {}
    onUpdate(deltaTime) {}
    onRemove() {}
    
    setupEventListeners() {}
    removeEventListeners() {}
    
    // Utility methods
    emit(eventName, data = null) {
        if (this.el) {
            this.el.emit(eventName, data);
        }
    }
    
    addEventListener(eventName, callback) {
        if (this.el) {
            this.el.addEventListener(eventName, callback);
        }
    }
    
    removeEventListener(eventName, callback) {
        if (this.el) {
            this.el.removeEventListener(eventName, callback);
        }
    }
}

// Grabbable Component
AFRAME.registerComponent('grabbable', {
    schema: {
        physics: { type: 'boolean', default: true },
        throwable: { type: 'boolean', default: true },
        grabDistance: { type: 'number', default: 2.0 },
        grabOffset: { type: 'vec3', default: { x: 0, y: 0, z: 0 } }
    },
    
    init: function() {
        this.isGrabbed = false;
        this.grabbedBy = null;
        this.originalPosition = null;
        this.originalRotation = null;
        this.originalParent = null;
        
        this.setupEventListeners();
        this.addVisualFeedback();
    },
    
    setupEventListeners: function() {
        this.el.addEventListener('grab-start', this.onGrabStart.bind(this));
        this.el.addEventListener('grab-end', this.onGrabEnd.bind(this));
        this.el.addEventListener('hover-start', this.onHoverStart.bind(this));
        this.el.addEventListener('hover-end', this.onHoverEnd.bind(this));
    },
    
    onGrabStart: function(event) {
        if (this.isGrabbed) return;
        
        this.isGrabbed = true;
        this.grabbedBy = event.detail.hand;
        
        // Store original transform
        this.originalPosition = this.el.getAttribute('position');
        this.originalRotation = this.el.getAttribute('rotation');
        this.originalParent = this.el.parentNode;
        
        // Attach to hand
        if (this.grabbedBy) {
            this.grabbedBy.appendChild(this.el);
        }
        
        // Disable physics if enabled
        if (this.data.physics) {
            this.el.setAttribute('physics-body', 'type', 'kinematic');
        }
        
        this.emit('grabbable-grabbed', { entity: this.el, hand: this.grabbedBy });
    },
    
    onGrabEnd: function(event) {
        if (!this.isGrabbed) return;
        
        this.isGrabbed = false;
        const hand = this.grabbedBy;
        this.grabbedBy = null;
        
        // Restore original parent
        if (this.originalParent) {
            this.originalParent.appendChild(this.el);
        }
        
        // Restore original transform
        if (this.originalPosition) {
            this.el.setAttribute('position', this.originalPosition);
        }
        if (this.originalRotation) {
            this.el.setAttribute('rotation', this.originalRotation);
        }
        
        // Re-enable physics if enabled
        if (this.data.physics) {
            this.el.setAttribute('physics-body', 'type', 'dynamic');
        }
        
        // Handle throwing
        if (this.data.throwable && hand) {
            this.handleThrowing(hand);
        }
        
        this.emit('grabbable-released', { entity: this.el, hand: hand });
    },
    
    handleThrowing: function(hand) {
        // Calculate throw velocity based on hand movement
        const handVelocity = hand.getAttribute('velocity') || { x: 0, y: 0, z: 0 };
        const throwForce = 5.0;
        
        this.el.setAttribute('velocity', {
            x: handVelocity.x * throwForce,
            y: handVelocity.y * throwForce,
            z: handVelocity.z * throwForce
        });
    },
    
    onHoverStart: function() {
        this.el.setAttribute('animation__hover', {
            property: 'scale',
            to: '1.1 1.1 1.1',
            dur: 200
        });
    },
    
    onHoverEnd: function() {
        this.el.setAttribute('animation__hover', {
            property: 'scale',
            to: '1 1 1',
            dur: 200
        });
    },
    
    addVisualFeedback: function() {
        // Add outline material
        this.el.setAttribute('material', {
            ...this.el.getAttribute('material'),
            emissive: '#444444',
            emissiveIntensity: 0.1
        });
    }
});

// Clickable Component
AFRAME.registerComponent('clickable', {
    schema: {
        clickDistance: { type: 'number', default: 3.0 },
        clickSound: { type: 'string', default: '' },
        clickEffect: { type: 'string', default: 'pulse' }
    },
    
    init: function() {
        this.isHovered = false;
        this.setupEventListeners();
        this.addClickableEffects();
    },
    
    setupEventListeners: function() {
        this.el.addEventListener('click', this.onClick.bind(this));
        this.el.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    },
    
    onClick: function(event) {
        // Play click sound
        if (this.data.clickSound) {
            const audio = new Audio(this.data.clickSound);
            audio.play();
        }
        
        // Trigger click effect
        this.triggerClickEffect();
        
        // Emit custom event
        this.el.emit('clickable-clicked', { 
            entity: this.el,
            position: event.detail.intersection?.point
        });
    },
    
    onMouseEnter: function() {
        this.isHovered = true;
        this.el.setAttribute('animation__hover', {
            property: 'scale',
            to: '1.05 1.05 1.05',
            dur: 150
        });
    },
    
    onMouseLeave: function() {
        this.isHovered = false;
        this.el.setAttribute('animation__hover', {
            property: 'scale',
            to: '1 1 1',
            dur: 150
        });
    },
    
    triggerClickEffect: function() {
        switch (this.data.clickEffect) {
            case 'pulse':
                this.el.setAttribute('animation__pulse', {
                    property: 'scale',
                    to: '1.2 1.2 1.2',
                    dur: 200,
                    easing: 'easeOutQuad'
                });
                break;
            case 'shake':
                this.el.setAttribute('animation__shake', {
                    property: 'rotation',
                    to: '0 0 5',
                    dur: 100,
                    easing: 'easeInOutQuad'
                });
                break;
        }
    },
    
    addClickableEffects: function() {
        // Add cursor pointer
        this.el.setAttribute('cursor-listener', '');
        
        // Add outline on hover
        this.el.setAttribute('material', {
            ...this.el.getAttribute('material'),
            emissive: '#666666',
            emissiveIntensity: 0.2
        });
    }
});

// Teleportation Component
AFRAME.registerComponent('teleportation', {
    schema: {
        maxDistance: { type: 'number', default: 10.0 },
        teleportSound: { type: 'string', default: '' },
        fadeEffect: { type: 'boolean', default: true }
    },
    
    init: function() {
        this.teleportTarget = null;
        this.teleportLine = null;
        this.setupTeleportLine();
        this.setupEventListeners();
    },
    
    setupTeleportLine: function() {
        // Create teleport line
        this.teleportLine = document.createElement('a-entity');
        this.teleportLine.setAttribute('line', {
            start: { x: 0, y: 0, z: 0 },
            end: { x: 0, y: 0, z: 0 },
            color: '#4CC3D9'
        });
        this.teleportLine.setAttribute('visible', false);
        this.sceneEl.appendChild(this.teleportLine);
    },
    
    setupEventListeners: function() {
        this.el.addEventListener('triggerdown', this.onTriggerDown.bind(this));
        this.el.addEventListener('triggerup', this.onTriggerUp.bind(this));
        this.el.addEventListener('thumbstickmoved', this.onThumbstickMoved.bind(this));
    },
    
    onTriggerDown: function() {
        this.startTeleport();
    },
    
    onTriggerUp: function() {
        this.endTeleport();
    },
    
    onThumbstickMoved: function(event) {
        if (this.isTeleporting) {
            this.updateTeleportTarget(event);
        }
    },
    
    startTeleport: function() {
        this.isTeleporting = true;
        this.teleportLine.setAttribute('visible', true);
    },
    
    endTeleport: function() {
        if (this.teleportTarget) {
            this.performTeleport();
        }
        
        this.isTeleporting = false;
        this.teleportLine.setAttribute('visible', false);
        this.teleportTarget = null;
    },
    
    updateTeleportTarget: function(event) {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.el.object3D.quaternion);
        
        const raycaster = new THREE.Raycaster();
        raycaster.set(this.el.object3D.position, direction);
        
        const intersects = raycaster.intersectObjects(this.sceneEl.object3D.children, true);
        
        if (intersects.length > 0 && intersects[0].distance <= this.data.maxDistance) {
            this.teleportTarget = intersects[0].point;
            this.updateTeleportLine(intersects[0].point);
        } else {
            this.teleportTarget = null;
            this.updateTeleportLine(null);
        }
    },
    
    updateTeleportLine: function(target) {
        if (target) {
            this.teleportLine.setAttribute('line', {
                start: this.el.object3D.position,
                end: target,
                color: '#4CC3D9'
            });
        } else {
            this.teleportLine.setAttribute('line', {
                start: this.el.object3D.position,
                end: this.el.object3D.position.clone().add(
                    new THREE.Vector3(0, 0, -this.data.maxDistance)
                ),
                color: '#666666'
            });
        }
    },
    
    performTeleport: function() {
        if (!this.teleportTarget) return;
        
        // Fade effect
        if (this.data.fadeEffect) {
            this.fadeOut(() => {
                this.moveToTarget();
                this.fadeIn();
            });
        } else {
            this.moveToTarget();
        }
        
        // Play teleport sound
        if (this.data.teleportSound) {
            const audio = new Audio(this.data.teleportSound);
            audio.play();
        }
    },
    
    moveToTarget: function() {
        this.el.setAttribute('position', {
            x: this.teleportTarget.x,
            y: this.teleportTarget.y,
            z: this.teleportTarget.z
        });
    },
    
    fadeOut: function(callback) {
        const overlay = this.createFadeOverlay();
        overlay.style.opacity = '1';
        setTimeout(callback, 300);
    },
    
    fadeIn: function() {
        const overlay = document.getElementById('teleport-fade');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    },
    
    createFadeOverlay: function() {
        let overlay = document.getElementById('teleport-fade');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'teleport-fade';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                z-index: 1000;
            `;
            document.body.appendChild(overlay);
        }
        return overlay;
    }
});

// Physics Body Component
AFRAME.registerComponent('physics-body', {
    schema: {
        type: { type: 'string', default: 'dynamic' }, // dynamic, kinematic, static
        mass: { type: 'number', default: 1.0 },
        friction: { type: 'number', default: 0.3 },
        restitution: { type: 'number', default: 0.3 },
        linearDamping: { type: 'number', default: 0.01 },
        angularDamping: { type: 'number', default: 0.01 }
    },
    
    init: function() {
        this.body = null;
        this.initPhysics();
    },
    
    initPhysics: function() {
        // This is a placeholder for physics integration
        // In a real implementation, you would integrate with cannon-es or similar
        console.log(`Physics body initialized: ${this.data.type}`);
    },
    
    update: function() {
        // Update physics body properties
        if (this.body) {
            this.body.mass = this.data.mass;
            this.body.friction = this.data.friction;
            this.body.restitution = this.data.restitution;
        }
    }
});

// Haptic Feedback Component
AFRAME.registerComponent('haptic-feedback', {
    schema: {
        intensity: { type: 'number', default: 0.5 },
        duration: { type: 'number', default: 100 }
    },
    
    init: function() {
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        this.el.addEventListener('grab-start', this.triggerHaptic.bind(this));
        this.el.addEventListener('click', this.triggerHaptic.bind(this));
    },
    
    triggerHaptic: function() {
        // Trigger haptic feedback on VR controllers
        if (window.engine && window.engine.state.user.vrMode) {
            // This would integrate with WebXR haptic feedback
            console.log('Haptic feedback triggered');
        }
    }
});

console.log('📦 Component System loaded');