/**
 * Signpost Observatory Engine - Asset Manager
 * Handles loading, caching, and management of 3D assets (GLB/GLTF models)
 * 
 * Features:
 * - GLB/GLTF model loading and caching
 * - Asset preloading for performance
 * - Error handling and fallbacks
 * - Asset optimization and compression
 */

class AssetManager {
    constructor() {
        this.assets = new Map();
        this.loadingAssets = new Map();
        this.assetCache = new Map();
        this.maxCacheSize = 50; // Maximum number of cached assets
        
        // Asset types and their loaders
        this.loaders = {
            'glb': this.loadGLBModel.bind(this),
            'gltf': this.loadGLTFModel.bind(this),
            'obj': this.loadOBJModel.bind(this),
            'fbx': this.loadFBXModel.bind(this)
        };
        
        // Asset categories
        this.categories = {
            buildings: '/assets/models/buildings/',
            props: '/assets/models/props/',
            environment: '/assets/models/environment/',
            characters: '/assets/models/characters/',
            vehicles: '/assets/models/vehicles/'
        };
        
        console.log('📦 Asset Manager initialized');
    }
    
    /**
     * Load a 3D asset by path
     */
    async loadAsset(path, options = {}) {
        const assetId = this.generateAssetId(path);
        
        // Check if already loaded
        if (this.assets.has(assetId)) {
            return this.assets.get(assetId);
        }
        
        // Check if currently loading
        if (this.loadingAssets.has(assetId)) {
            return this.loadingAssets.get(assetId);
        }
        
        // Start loading
        const loadPromise = this.loadAssetInternal(path, options);
        this.loadingAssets.set(assetId, loadPromise);
        
        try {
            const asset = await loadPromise;
            this.assets.set(assetId, asset);
            this.loadingAssets.delete(assetId);
            
            // Cache the asset
            this.cacheAsset(assetId, asset);
            
            console.log(`✅ Asset loaded: ${path}`);
            return asset;
        } catch (error) {
            this.loadingAssets.delete(assetId);
            console.error(`❌ Failed to load asset: ${path}`, error);
            throw error;
        }
    }
    
    /**
     * Load asset with internal error handling
     */
    async loadAssetInternal(path, options) {
        const fileExtension = path.split('.').pop().toLowerCase();
        const loader = this.loaders[fileExtension];
        
        if (!loader) {
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }
        
        return await loader(path, options);
    }
    
    /**
     * Load GLB model
     */
    async loadGLBModel(path, options = {}) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                path,
                (gltf) => {
                    const asset = {
                        type: 'glb',
                        path: path,
                        scene: gltf.scene,
                        animations: gltf.animations,
                        scenes: gltf.scenes,
                        cameras: gltf.cameras,
                        asset: gltf.asset,
                        parser: gltf.parser,
                        userData: gltf.userData,
                        options: options
                    };
                    
                    // Apply default transformations if specified
                    if (options.scale) {
                        asset.scene.scale.setScalar(options.scale);
                    }
                    if (options.position) {
                        asset.scene.position.copy(options.position);
                    }
                    if (options.rotation) {
                        asset.scene.rotation.copy(options.rotation);
                    }
                    
                    resolve(asset);
                },
                (progress) => {
                    if (options.onProgress) {
                        options.onProgress(progress);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Load GLTF model
     */
    async loadGLTFModel(path, options = {}) {
        return this.loadGLBModel(path, options);
    }
    
    /**
     * Load OBJ model (fallback)
     */
    async loadOBJModel(path, options = {}) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.OBJLoader();
            
            loader.load(
                path,
                (object) => {
                    const asset = {
                        type: 'obj',
                        path: path,
                        scene: object,
                        options: options
                    };
                    
                    resolve(asset);
                },
                (progress) => {
                    if (options.onProgress) {
                        options.onProgress(progress);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Load FBX model (fallback)
     */
    async loadFBXModel(path, options = {}) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FBXLoader();
            
            loader.load(
                path,
                (object) => {
                    const asset = {
                        type: 'fbx',
                        path: path,
                        scene: object,
                        options: options
                    };
                    
                    resolve(asset);
                },
                (progress) => {
                    if (options.onProgress) {
                        options.onProgress(progress);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Preload multiple assets
     */
    async preloadAssets(assetList) {
        console.log(`🔄 Preloading ${assetList.length} assets...`);
        
        const loadPromises = assetList.map(asset => {
            const { path, options = {} } = asset;
            return this.loadAsset(path, options).catch(error => {
                console.warn(`⚠️ Failed to preload: ${path}`, error);
                return null;
            });
        });
        
        const results = await Promise.allSettled(loadPromises);
        const successful = results.filter(result => result.status === 'fulfilled' && result.value !== null);
        
        console.log(`✅ Preloaded ${successful.length}/${assetList.length} assets`);
        return successful.map(result => result.value);
    }
    
    /**
     * Create an entity with a 3D model
     */
    createModelEntity(assetPath, options = {}) {
        const entity = document.createElement('a-entity');
        
        // Set position, rotation, scale
        if (options.position) {
            entity.setAttribute('position', options.position);
        }
        if (options.rotation) {
            entity.setAttribute('rotation', options.rotation);
        }
        if (options.scale) {
            entity.setAttribute('scale', options.scale);
        }
        
        // Add gltf-model component
        entity.setAttribute('gltf-model', assetPath);
        
        // Add additional components
        if (options.components) {
            Object.entries(options.components).forEach(([component, params]) => {
                entity.setAttribute(component, params);
            });
        }
        
        // Add event listeners
        if (options.events) {
            Object.entries(options.events).forEach(([event, handler]) => {
                entity.addEventListener(event, handler);
            });
        }
        
        return entity;
    }
    
    /**
     * Create a building entity
     */
    createBuildingEntity(buildingName, options = {}) {
        const buildingPath = `${this.categories.buildings}${buildingName}.glb`;
        return this.createModelEntity(buildingPath, {
            ...options,
            components: {
                ...options.components,
                'building-component': 'enabled: true'
            }
        });
    }
    
    /**
     * Create a prop entity
     */
    createPropEntity(propName, options = {}) {
        const propPath = `${this.categories.props}${propName}.glb`;
        return this.createModelEntity(propPath, {
            ...options,
            components: {
                ...options.components,
                'prop-component': 'enabled: true'
            }
        });
    }
    
    /**
     * Generate unique asset ID
     */
    generateAssetId(path) {
        return path.replace(/[^a-zA-Z0-9]/g, '_');
    }
    
    /**
     * Cache an asset
     */
    cacheAsset(assetId, asset) {
        if (this.assetCache.size >= this.maxCacheSize) {
            // Remove oldest asset
            const firstKey = this.assetCache.keys().next().value;
            this.assetCache.delete(firstKey);
        }
        
        this.assetCache.set(assetId, asset);
    }
    
    /**
     * Get cached asset
     */
    getCachedAsset(assetId) {
        return this.assetCache.get(assetId);
    }
    
    /**
     * Clear asset cache
     */
    clearCache() {
        this.assetCache.clear();
        console.log('🗑️ Asset cache cleared');
    }
    
    /**
     * Get asset statistics
     */
    getStats() {
        return {
            loadedAssets: this.assets.size,
            loadingAssets: this.loadingAssets.size,
            cachedAssets: this.assetCache.size,
            maxCacheSize: this.maxCacheSize
        };
    }
    
    /**
     * Debug asset manager
     */
    debug() {
        console.log('🔍 Asset Manager Debug Info:');
        console.log('Loaded Assets:', this.assets.size);
        console.log('Loading Assets:', this.loadingAssets.size);
        console.log('Cached Assets:', this.assetCache.size);
        console.log('Asset Categories:', Object.keys(this.categories));
        
        // List loaded assets
        console.log('Loaded Asset Paths:');
        this.assets.forEach((asset, id) => {
            console.log(`  - ${id}: ${asset.path}`);
        });
    }
}

// Global asset manager instance
window.AssetManager = AssetManager;
window.assetManager = new AssetManager();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.assetManager) {
        console.log('📦 Asset Manager loaded');
    }
});

console.log('📦 Asset Manager component loaded'); 