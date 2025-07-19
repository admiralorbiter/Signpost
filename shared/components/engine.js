/**
 * Signpost Observatory Engine - Core Engine Library
 * Central JavaScript library for scene management, rendering, and game loop
 * 
 * Features:
 * - Scene initialization and management
 * - Main update loop (tick)
 * - Global event listeners
 * - Utility functions for common tasks
 * - State management integration
 */

class SignpostEngine {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.targetFps = 60;
        
        // State management
        this.state = {
            user: {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                vrMode: false,
                deviceType: 'desktop'
            },
            scene: {
                currentLevel: null,
                entities: [],
                interactions: []
            },
            performance: {
                fps: 0,
                drawCalls: 0,
                memoryUsage: 0
            }
        };
        
        // Event system
        this.events = {};
        this.eventQueue = [];
        
        // Component registry
        this.components = new Map();
        
        // Utility functions
        this.utils = {
            vector: this.createVectorUtils(),
            math: this.createMathUtils(),
            raycast: this.createRaycastUtils()
        };
        
        console.log('🚀 Signpost Engine initialized');
    }
    
    /**
     * Initialize the engine with A-Frame scene
     */
    init(sceneElement = null) {
        if (!sceneElement) {
            sceneElement = document.querySelector('a-scene');
        }
        
        if (!sceneElement) {
            console.error('❌ No A-Frame scene found');
            return false;
        }
        
        this.scene = sceneElement;
        this.camera = document.querySelector('[camera]') || document.querySelector('a-camera');
        
        // Initialize renderer
        this.initRenderer();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start the engine
        this.start();
        
        console.log('✅ Engine initialized successfully');
        return true;
    }
    
    /**
     * Initialize the renderer
     */
    initRenderer() {
        // Get A-Frame's renderer
        if (this.scene.renderer) {
            this.renderer = this.scene.renderer;
        } else {
            // Fallback to Three.js renderer
            this.renderer = this.scene.object3D.children.find(child => 
                child.type === 'WebGLRenderer'
            );
        }
        
        // Configure renderer for VR
        if (this.renderer) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
    }
    
    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // VR mode changes
        this.scene.addEventListener('enter-vr', () => {
            this.state.user.vrMode = true;
            this.state.user.deviceType = 'vr';
            this.emit('vr-mode-changed', { mode: 'enter' });
        });
        
        this.scene.addEventListener('exit-vr', () => {
            this.state.user.vrMode = false;
            this.state.user.deviceType = 'desktop';
            this.emit('vr-mode-changed', { mode: 'exit' });
        });
        
        // Device connection/disconnection
        window.addEventListener('vrdisplayconnect', (event) => {
            this.emit('device-connected', { device: event.display });
        });
        
        window.addEventListener('vrdisplaydisconnect', (event) => {
            this.emit('device-disconnected', { device: event.display });
        });
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }
    
    /**
     * Start the engine loop
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        
        // Start the main loop
        this.tick();
        
        console.log('▶️ Engine started');
    }
    
    /**
     * Stop the engine loop
     */
    stop() {
        this.isRunning = false;
        console.log('⏹️ Engine stopped');
    }
    
    /**
     * Main update loop (tick)
     */
    tick() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update FPS
        this.fps = 1 / this.deltaTime;
        this.state.performance.fps = Math.round(this.fps);
        
        // Update state
        this.updateState();
        
        // Process events
        this.processEventQueue();
        
        // Update components
        this.updateComponents();
        
        // Request next frame
        requestAnimationFrame(() => this.tick());
    }
    
    /**
     * Update engine state
     */
    updateState() {
        // Update user position and rotation
        if (this.camera) {
            const position = this.camera.getAttribute('position');
            const rotation = this.camera.getAttribute('rotation');
            
            if (position) {
                this.state.user.position = {
                    x: position.x || 0,
                    y: position.y || 0,
                    z: position.z || 0
                };
            }
            
            if (rotation) {
                this.state.user.rotation = {
                    x: rotation.x || 0,
                    y: rotation.y || 0,
                    z: rotation.z || 0
                };
            }
        }
        
        // Update performance metrics
        if (this.renderer) {
            this.state.performance.drawCalls = this.renderer.info.render.calls;
            this.state.performance.memoryUsage = this.renderer.info.memory.geometries;
        }
    }
    
    /**
     * Process event queue
     */
    processEventQueue() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            this.emit(event.name, event.data);
        }
    }
    
    /**
     * Update all registered components
     */
    updateComponents() {
        this.components.forEach((component, id) => {
            if (component.update && typeof component.update === 'function') {
                component.update(this.deltaTime);
            }
        });
    }
    
    /**
     * Event system
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    
    off(eventName, callback) {
        if (this.events[eventName]) {
            const index = this.events[eventName].indexOf(callback);
            if (index > -1) {
                this.events[eventName].splice(index, 1);
            }
        }
    }
    
    emit(eventName, data = null) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventName}:`, error);
                }
            });
        }
    }
    
    queueEvent(eventName, data = null) {
        this.eventQueue.push({ name: eventName, data });
    }
    
    /**
     * Component system
     */
    registerComponent(id, component) {
        this.components.set(id, component);
        console.log(`📦 Component registered: ${id}`);
    }
    
    unregisterComponent(id) {
        this.components.delete(id);
        console.log(`🗑️ Component unregistered: ${id}`);
    }
    
    getComponent(id) {
        return this.components.get(id);
    }
    
    /**
     * State management
     */
    setState(path, value) {
        const keys = path.split('.');
        let current = this.state;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        this.emit('state-changed', { path, value });
    }
    
    getState(path = null) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let current = this.state;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined;
            }
        }
        
        return current;
    }
    
    /**
     * Utility functions
     */
    createVectorUtils() {
        return {
            distance: (v1, v2) => {
                const dx = v1.x - v2.x;
                const dy = v1.y - v2.y;
                const dz = v1.z - v2.z;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            },
            
            lerp: (v1, v2, t) => {
                return {
                    x: v1.x + (v2.x - v1.x) * t,
                    y: v1.y + (v2.y - v1.y) * t,
                    z: v1.z + (v2.z - v1.z) * t
                };
            },
            
            normalize: (v) => {
                const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
                if (length === 0) return { x: 0, y: 0, z: 0 };
                return {
                    x: v.x / length,
                    y: v.y / length,
                    z: v.z / length
                };
            }
        };
    }
    
    createMathUtils() {
        return {
            clamp: (value, min, max) => Math.min(Math.max(value, min), max),
            
            lerp: (a, b, t) => a + (b - a) * t,
            
            degToRad: (degrees) => degrees * Math.PI / 180,
            
            radToDeg: (radians) => radians * 180 / Math.PI,
            
            randomRange: (min, max) => Math.random() * (max - min) + min,
            
            randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
        };
    }
    
    createRaycastUtils() {
        return {
            raycast: (origin, direction, entities) => {
                // Simple raycast implementation
                const results = [];
                
                entities.forEach(entity => {
                    const position = entity.getAttribute('position');
                    if (position) {
                        const distance = this.utils.vector.distance(origin, position);
                        if (distance < 10) { // Simple distance check
                            results.push({
                                entity: entity,
                                distance: distance,
                                point: position
                            });
                        }
                    }
                });
                
                return results.sort((a, b) => a.distance - b.distance);
            },
            
            screenToWorld: (screenX, screenY, camera) => {
                // Convert screen coordinates to world coordinates
                const vector = new THREE.Vector3();
                vector.set(screenX, screenY, 0.5);
                vector.unproject(camera);
                return vector;
            }
        };
    }
    
    /**
     * Performance monitoring
     */
    setupPerformanceMonitoring() {
        // FPS counter
        let frameCount = 0;
        let lastFpsUpdate = 0;
        
        const updateFps = () => {
            frameCount++;
            const now = performance.now();
            
            if (now - lastFpsUpdate >= 1000) {
                this.state.performance.fps = frameCount;
                frameCount = 0;
                lastFpsUpdate = now;
            }
        };
        
        this.on('tick', updateFps);
    }
    
    /**
     * Debug utilities
     */
    debug() {
        console.log('�� Engine Debug Info:');
        console.log('State:', this.state);
        console.log('Components:', this.components.size);
        console.log('Events:', Object.keys(this.events));
        console.log('Performance:', this.state.performance);
    }
}

// Global engine instance
window.SignpostEngine = SignpostEngine;
window.engine = new SignpostEngine();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.engine) {
        window.engine.init();
    }
});

console.log('📦 Signpost Engine loaded'); 