// Voice Analysis Utility for VR Gateway
// Handles speech recognition, voice commands, and audio analysis

class VoiceAnalyzer {
  constructor(options = {}) {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.isListening = false;
    this.recognition = null;
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    
    // Configuration
    this.config = {
      continuous: options.continuous || true,
      interimResults: options.interimResults || true,
      language: options.language || 'en-US',
      maxAlternatives: options.maxAlternatives || 1,
      sensitivity: options.sensitivity || 0.7,
      ...options
    };
    
    // Voice command handlers
    this.commands = new Map();
    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null,
      onAudioLevel: null
    };
    
    this.init();
  }

  init() {
    if (!this.isSupported) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.language;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    
    this.setupEventListeners();
    this.registerDefaultCommands();
  }

  setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
      if (this.callbacks.onStart) this.callbacks.onStart();
      this.showVoiceIndicator();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
      if (this.callbacks.onEnd) this.callbacks.onEnd();
      this.hideVoiceIndicator();
    };

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join('');
      
      const confidence = results[results.length - 1][0].confidence;
      const isFinal = results[results.length - 1].isFinal;
      
      console.log(`Voice input: "${transcript}" (confidence: ${confidence})`);
      
      if (this.callbacks.onResult) {
        this.callbacks.onResult({ transcript, confidence, isFinal });
      }
      
      if (isFinal && confidence > this.config.sensitivity) {
        this.processVoiceCommand(transcript.toLowerCase().trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      if (this.callbacks.onError) this.callbacks.onError(event.error);
      this.hideVoiceIndicator();
    };
  }

  registerDefaultCommands() {
    // Navigation commands
    this.addCommand(['go home', 'home', 'reset position'], () => {
      this.resetCameraPosition();
    });

    this.addCommand(['help', 'show help', 'commands'], () => {
      this.showVoiceHelp();
    });

    this.addCommand(['stop listening', 'stop voice', 'disable voice'], () => {
      this.stop();
    });

    // Portal navigation
    this.addCommand(['education', 'learning', 'school'], () => {
      this.navigateToPortal('education');
    });

    this.addCommand(['connection', 'connect', 'social'], () => {
      this.navigateToPortal('connection');
    });

    this.addCommand(['analysis', 'data', 'analytics'], () => {
      this.navigateToPortal('analysis');
    });

    // VR controls
    this.addCommand(['enter vr', 'start vr', 'vr mode'], () => {
      this.enterVRMode();
    });

    this.addCommand(['exit vr', 'stop vr', 'desktop mode'], () => {
      this.exitVRMode();
    });
  }

  addCommand(triggers, callback, description = '') {
    const commandId = Date.now() + Math.random();
    const triggerArray = Array.isArray(triggers) ? triggers : [triggers];
    
    this.commands.set(commandId, {
      triggers: triggerArray,
      callback,
      description
    });
    
    return commandId;
  }

  removeCommand(commandId) {
    return this.commands.delete(commandId);
  }

  processVoiceCommand(transcript) {
    let commandFound = false;
    
    for (const [id, command] of this.commands) {
      for (const trigger of command.triggers) {
        if (transcript.includes(trigger)) {
          console.log(`Executing voice command: "${trigger}"`);
          command.callback(transcript);
          commandFound = true;
          this.showNotification('Voice Command', `Executed: "${trigger}"`);
          break;
        }
      }
      if (commandFound) break;
    }
    
    if (!commandFound) {
      console.log(`Unrecognized voice command: "${transcript}"`);
      this.showNotification('Voice Command', `Unrecognized: "${transcript}"`, 'warning');
    }
  }

  async initAudioAnalysis() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser.fftSize = 256;
      this.microphone.connect(this.analyser);
      
      this.startAudioLevelAnalysis();
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      return false;
    }
  }

  startAudioLevelAnalysis() {
    if (!this.analyser) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const analyzeAudio = () => {
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const averageLevel = sum / bufferLength / 255;
      
      if (this.callbacks.onAudioLevel) {
        this.callbacks.onAudioLevel(averageLevel);
      }
      
      if (this.isListening) {
        requestAnimationFrame(analyzeAudio);
      }
    };
    
    analyzeAudio();
  }

  start() {
    if (!this.isSupported) {
      this.showNotification('Voice Control', 'Speech recognition not supported', 'error');
      return false;
    }
    
    if (this.isListening) {
      console.log('Voice recognition already running');
      return true;
    }
    
    try {
      this.recognition.start();
      this.initAudioAnalysis();
      return true;
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.showNotification('Voice Control', 'Failed to start voice recognition', 'error');
      return false;
    }
  }

  stop() {
    if (!this.isListening) return;
    
    try {
      this.recognition.stop();
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
      this.showNotification('Voice Control', 'Voice recognition stopped');
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }

  toggle() {
    return this.isListening ? this.stop() : this.start();
  }

  // Command implementations
  resetCameraPosition() {
    const camera = document.querySelector('#cameraRig') || document.querySelector('[camera]');
    if (camera) {
      camera.setAttribute('position', '0 1.6 3');
      camera.setAttribute('rotation', '0 0 0');
      this.showNotification('Navigation', 'Position reset to home');
    }
  }

  navigateToPortal(portalName) {
    const portal = document.querySelector(`[portal-system][destination*="${portalName}"]`);
    if (portal) {
      portal.click();
    } else {
      this.showNotification('Navigation', `Portal "${portalName}" not found`, 'warning');
    }
  }

  enterVRMode() {
    const scene = document.querySelector('a-scene');
    if (scene && scene.enterVR) {
      scene.enterVR();
    } else {
      this.showNotification('VR Mode', 'VR not available', 'warning');
    }
  }

  exitVRMode() {
    const scene = document.querySelector('a-scene');
    if (scene && scene.exitVR) {
      scene.exitVR();
    }
  }

  showVoiceIndicator() {
    let indicator = document.getElementById('voice-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'voice-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        background: radial-gradient(circle, #4CC3D9, #3498db);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        z-index: 1001;
        animation: pulse 1.5s ease-in-out infinite;
        box-shadow: 0 4px 20px rgba(76, 195, 217, 0.4);
      `;
      indicator.innerHTML = '🎤';
      document.body.appendChild(indicator);
    }
    
    indicator.style.display = 'flex';
  }

  hideVoiceIndicator() {
    const indicator = document.getElementById('voice-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  showVoiceHelp() {
    const commands = Array.from(this.commands.values()).map(cmd => 
      cmd.triggers.join(', ')
    ).join('\n• ');
    
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
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
      ">
        <h2 style="text-align: center; margin-bottom: 20px; color: #4CC3D9;">
          🎤 Voice Commands
        </h2>
        <div style="line-height: 1.8; font-size: 0.9rem;">
          <strong>Available Commands:</strong><br><br>
          • ${commands}
        </div>
        <p style="margin-top: 20px; opacity: 0.8; font-size: 0.8rem;">
          Speak clearly and wait for the microphone icon to appear.
        </p>
        <button onclick="this.parentElement.remove()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: #4CC3D9;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          width: 100%;
        ">Close</button>
      </div>
    `;
    
    const helpDiv = document.createElement('div');
    helpDiv.innerHTML = helpText;
    document.body.appendChild(helpDiv);
  }

  showNotification(title, message, type = 'info') {
    // Use the UI overlay notification system if available
    const uiOverlay = document.querySelector('[ui-overlay]');
    if (uiOverlay && uiOverlay.components['ui-overlay']) {
      uiOverlay.components['ui-overlay'].showNotification(title, message);
      return;
    }
    
    // Fallback notification
    console.log(`${title}: ${message}`);
  }

  // Event handler setters
  onResult(callback) { this.callbacks.onResult = callback; }
  onError(callback) { this.callbacks.onError = callback; }
  onStart(callback) { this.callbacks.onStart = callback; }
  onEnd(callback) { this.callbacks.onEnd = callback; }
  onAudioLevel(callback) { this.callbacks.onAudioLevel = callback; }
}

// Global voice analyzer instance
window.VoiceAnalyzer = VoiceAnalyzer;

// Auto-initialize if requested
document.addEventListener('DOMContentLoaded', () => {
  // Add voice control toggle button
  const voiceButton = document.createElement('button');
  voiceButton.id = 'voice-toggle';
  voiceButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(45deg, #4CC3D9, #3498db);
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(76, 195, 217, 0.3);
    transition: all 0.3s ease;
  `;
  voiceButton.innerHTML = '🎤';
  voiceButton.title = 'Toggle Voice Control (V)';
  
  // Create global voice analyzer
  const voiceAnalyzer = new VoiceAnalyzer();
  
  voiceButton.addEventListener('click', () => {
    if (voiceAnalyzer.toggle()) {
      voiceButton.style.background = voiceAnalyzer.isListening ? 
        'linear-gradient(45deg, #e74c3c, #c0392b)' : 
        'linear-gradient(45deg, #4CC3D9, #3498db)';
    }
  });
  
  // Keyboard shortcut
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyV' && !event.ctrlKey && !event.altKey) {
      voiceButton.click();
    }
  });
  
  document.body.appendChild(voiceButton);
  
  // Make available globally
  window.voiceAnalyzer = voiceAnalyzer;
}); 