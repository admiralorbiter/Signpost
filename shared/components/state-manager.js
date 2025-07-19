/**
 * Signpost Observatory Engine - State Management
 * Global state manager for application-wide data
 * 
 * Features:
 * - Single source of truth for application state
 * - Reactive state updates
 * - State persistence
 * - Debug and logging capabilities
 */

class StateManager {
    constructor() {
        this.state = {
            // User state
            user: {
                id: null,
                name: 'Anonymous',
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                vrMode: false,
                deviceType: 'desktop',
                preferences: {
                    audioVolume: 0.7,
                    graphicsQuality: 'medium',
                    locomotionType: 'teleport'
                }
            },
            
            // Scene state
            scene: {
                currentLevel: null,
                currentCategory: null,
                entities: [],
                interactions: [],
                environment: {
                    lighting: 'day',
                    weather: 'clear',
                    timeOfDay: 12
                }
            },
            
            // Application state
            app: {
                isLoading: false,
                currentView: 'main',
                notifications: [],
                errors: [],
                performance: {
                    fps: 0,
                    drawCalls: 0,
                    memoryUsage: 0
                }
            },
            
            // Data state
            data: {
                currentDataset: null,
                loadedData: {},
                filters: {},
                visualizations: {}
            },
            
            // UI state
            ui: {
                overlays: {},
                modals: {},
                tooltips: {},
                menus: {}
            }
        };
        
        // State history for undo/redo
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        
        // Subscribers for reactive updates
        this.subscribers = new Map();
        
        // State persistence
        this.storageKey = 'signpost-engine-state';
        this.loadPersistedState();
        
        console.log('📊 State Manager initialized');
    }
    
    /**
     * Get state value by path
     */
    get(path = null) {
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
     * Set state value by path
     */
    set(path, value) {
        const keys = path.split('.');
        let current = this.state;
        
        // Navigate to the parent of the target property
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        const oldValue = current[keys[keys.length - 1]];
        current[keys[keys.length - 1]] = value;
        
        // Add to history
        this.addToHistory(path, oldValue, value);
        
        // Notify subscribers
        this.notifySubscribers(path, value, oldValue);
        
        // Persist state
        this.persistState();
        
        return value;
    }
    
    /**
     * Update multiple state values at once
     */
    update(updates) {
        const oldValues = {};
        const newValues = {};
        
        for (const [path, value] of Object.entries(updates)) {
            oldValues[path] = this.get(path);
            this.set(path, value);
            newValues[path] = value;
        }
        
        // Notify subscribers for batch update
        this.notifySubscribers('batch', newValues, oldValues);
    }
    
    /**
     * Subscribe to state changes
     */
    subscribe(path, callback) {
        if (!this.subscribers.has(path)) {
            this.subscribers.set(path, new Set());
        }
        this.subscribers.get(path).add(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(path);
            if (callbacks) {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    this.subscribers.delete(path);
                }
            }
        };
    }
    
    /**
     * Notify subscribers of state changes
     */
    notifySubscribers(path, newValue, oldValue) {
        // Notify specific path subscribers
        if (this.subscribers.has(path)) {
            this.subscribers.get(path).forEach(callback => {
                try {
                    callback(newValue, oldValue, path);
                } catch (error) {
                    console.error('Error in state subscriber:', error);
                }
            });
        }
        
        // Notify wildcard subscribers
        if (this.subscribers.has('*')) {
            this.subscribers.get('*').forEach(callback => {
                try {
                    callback(newValue, oldValue, path);
                } catch (error) {
                    console.error('Error in state subscriber:', error);
                }
            });
        }
    }
    
    /**
     * Add to history for undo/redo
     */
    addToHistory(path, oldValue, newValue) {
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new history entry
        this.history.push({
            path,
            oldValue,
            newValue,
            timestamp: Date.now()
        });
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }
    
    /**
     * Undo last state change
     */
    undo() {
        if (this.historyIndex >= 0) {
            const entry = this.history[this.historyIndex];
            this.set(entry.path, entry.oldValue);
            this.historyIndex--;
            return true;
        }
        return false;
    }
    
    /**
     * Redo last undone state change
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const entry = this.history[this.historyIndex];
            this.set(entry.path, entry.newValue);
            return true;
        }
        return false;
    }
    
    /**
     * Persist state to localStorage
     */
    persistState() {
        try {
            const persistData = {
                user: this.state.user,
                scene: this.state.scene,
                app: this.state.app
            };
            localStorage.setItem(this.storageKey, JSON.stringify(persistData));
        } catch (error) {
            console.warn('Failed to persist state:', error);
        }
    }
    
    /**
     * Load persisted state from localStorage
     */
    loadPersistedState() {
        try {
            const persisted = localStorage.getItem(this.storageKey);
            if (persisted) {
                const data = JSON.parse(persisted);
                this.update(data);
                console.log('📥 Persisted state loaded');
            }
        } catch (error) {
            console.warn('Failed to load persisted state:', error);
        }
    }
    
    /**
     * Clear persisted state
     */
    clearPersistedState() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ Persisted state cleared');
        } catch (error) {
            console.warn('Failed to clear persisted state:', error);
        }
    }
    
    /**
     * Reset state to initial values
     */
    reset() {
        this.state = {
            user: {
                id: null,
                name: 'Anonymous',
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                vrMode: false,
                deviceType: 'desktop',
                preferences: {
                    audioVolume: 0.7,
                    graphicsQuality: 'medium',
                    locomotionType: 'teleport'
                }
            },
            scene: {
                currentLevel: null,
                currentCategory: null,
                entities: [],
                interactions: [],
                environment: {
                    lighting: 'day',
                    weather: 'clear',
                    timeOfDay: 12
                }
            },
            app: {
                isLoading: false,
                currentView: 'main',
                notifications: [],
                errors: [],
                performance: {
                    fps: 0,
                    drawCalls: 0,
                    memoryUsage: 0
                }
            },
            data: {
                currentDataset: null,
                loadedData: {},
                filters: {},
                visualizations: {}
            },
            ui: {
                overlays: {},
                modals: {},
                tooltips: {},
                menus: {}
            }
        };
        
        this.history = [];
        this.historyIndex = -1;
        
        this.notifySubscribers('*', this.state, null);
        console.log('🔄 State reset to initial values');
    }
    
    /**
     * Debug utilities
     */
    debug() {
        console.log('🔍 State Manager Debug Info:');
        console.log('Current State:', this.state);
        console.log('History Size:', this.history.length);
        console.log('Subscribers:', this.subscribers.size);
        console.log('History Index:', this.historyIndex);
    }
    
    /**
     * Export state as JSON
     */
    export() {
        return JSON.stringify(this.state, null, 2);
    }
    
    /**
     * Import state from JSON
     */
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.update(data);
            console.log('📥 State imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            return false;
        }
    }
}

// Global state manager instance
window.StateManager = StateManager;
window.stateManager = new StateManager();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.stateManager) {
        // Subscribe to engine events if available
        if (window.engine) {
            window.engine.on('state-changed', (data) => {
                window.stateManager.set(data.path, data.value);
            });
        }
    }
});

console.log('📦 State Manager loaded');