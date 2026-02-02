/* eslint-disable no-unused-vars */
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Bowser from 'bowser';

/**
 * Enhanced Fraud Detection System with Third-Party Libraries
 * Uses FingerprintJS for device identification and Bowser for browser detection
 */
class FraudDetectionSystem {
  constructor(options = {}) {
    this.examId = options.examId;
    this.submissionId = options.submissionId;
    this.onViolation = options.onViolation || (() => {});
    this.onAutoSubmit = options.onAutoSubmit || (() => {});
    this.questionIndex = options.questionIndex || 0;
    
    this.violationCount = 0;
    this.isActive = false;
    this.listeners = [];
    this.reportingInProgress = false;
    this.fingerprint = null;
    this.browserInfo = null;
    
    // Activity tracking
    this.lastActivity = Date.now();
    this.tabSwitchCount = 0;
    this.copyAttempts = 0;
    this.pasteAttempts = 0;
    this.screenshotAttempts = 0;
    
    console.log("🔒 Enhanced FraudDetectionSystem initialized");
  }

  /**
   * Initialize fraud detection with fingerprinting
   */
  async init() {
    if (this.isActive) {
      console.warn("⚠️ Fraud detection already active");
      return;
    }

    console.log("🚀 Initializing fraud detection system...");
    
    // Initialize browser fingerprinting
    await this.initializeFingerprint();
    
    // Get browser information
    this.getBrowserInfo();
    
    this.isActive = true;
    
    // Setup all detection mechanisms
    this.setupVisibilityDetection();
    this.setupFocusDetection();
    this.setupFullscreenDetection();
    this.setupClipboardDetection();
    this.setupKeyboardDetection();
    this.setupMouseDetection();
    this.setupNavigationBlocking();
    this.setupDevToolsDetection();
    this.setupActivityMonitoring();
    
    console.log("✅ Fraud detection system fully activated");
    console.log(`📊 Active listeners: ${this.listeners.length}`);
    console.log(`🔍 Device fingerprint: ${this.fingerprint}`);
    console.log(`🌐 Browser: ${this.browserInfo?.name} ${this.browserInfo?.version}`);
  }

  /**
   * Initialize device fingerprinting
   */
  async initializeFingerprint() {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      this.fingerprint = result.visitorId;
      console.log("✅ Device fingerprint generated:", this.fingerprint);
    } catch (error) {
      console.error("❌ Fingerprint initialization failed:", error);
    }
  }

  /**
   * Get detailed browser information
   */
  getBrowserInfo() {
    try {
      const browser = Bowser.getParser(window.navigator.userAgent);
      this.browserInfo = {
        name: browser.getBrowserName(),
        version: browser.getBrowserVersion(),
        os: browser.getOSName(),
        osVersion: browser.getOSVersion(),
        platform: browser.getPlatformType(),
        engine: browser.getEngineName(),
      };
      console.log("🌐 Browser info collected:", this.browserInfo);
    } catch (error) {
      console.error("❌ Browser info collection failed:", error);
    }
  }

  /**
   * Setup visibility detection (tab switching)
   */
  setupVisibilityDetection() {
    const handler = () => {
      if (document.hidden) {
        this.tabSwitchCount++;
        console.warn(`🚨 TAB_HIDDEN violation #${this.tabSwitchCount}`);
        this.reportViolation("TAB_HIDDEN", {
          detail: "Student switched tabs or minimized window",
          tabSwitchCount: this.tabSwitchCount,
          timestamp: new Date().toISOString(),
        });
      }
    };
    this.addListener(document, "visibilitychange", handler);
  }

  /**
   * Setup focus detection (window blur)
   */
  setupFocusDetection() {
    const handler = () => {
      console.warn("🚨 WINDOW_BLUR violation detected");
      this.reportViolation("WINDOW_BLUR", {
        detail: "Window lost focus",
        timestamp: new Date().toISOString(),
      });
    };
    this.addListener(window, "blur", handler);
  }

  /**
   * Setup fullscreen detection
   */
  setupFullscreenDetection() {
    const handler = () => {
      if (!document.fullscreenElement) {
        console.warn("🚨 EXIT_FULLSCREEN violation detected");
        this.reportViolation("EXIT_FULLSCREEN", {
          detail: "Student exited fullscreen mode",
          timestamp: new Date().toISOString(),
        });
      }
    };
    this.addListener(document, "fullscreenchange", handler);
  }

  /**
   * Setup clipboard detection (copy/paste)
   */
  setupClipboardDetection() {
    const copyHandler = (e) => {
      e.preventDefault();
      this.copyAttempts++;
      console.warn(`🚨 COPY attempt #${this.copyAttempts}`);
      this.reportViolation("COPY_PASTE", {
        detail: "Copy attempt detected",
        copyAttempts: this.copyAttempts,
        timestamp: new Date().toISOString(),
      });
    };
    
    const pasteHandler = (e) => {
      e.preventDefault();
      this.pasteAttempts++;
      console.warn(`🚨 PASTE attempt #${this.pasteAttempts}`);
      this.reportViolation("COPY_PASTE", {
        detail: "Paste attempt detected",
        pasteAttempts: this.pasteAttempts,
        timestamp: new Date().toISOString(),
      });
    };
    
    const cutHandler = (e) => {
      e.preventDefault();
      console.warn("🚨 CUT attempt detected");
      this.reportViolation("COPY_PASTE", {
        detail: "Cut attempt detected",
        timestamp: new Date().toISOString(),
      });
    };
    
    this.addListener(document, "copy", copyHandler);
    this.addListener(document, "paste", pasteHandler);
    this.addListener(document, "cut", cutHandler);
  }

  /**
   * Setup keyboard detection (suspicious key combinations)
   */
  setupKeyboardDetection() {
    const handler = (e) => {
      // Detect common screenshot/screen recording keys
      const suspiciousKeys = [
        { keys: ['PrintScreen'], name: 'Screenshot' },
        { keys: ['Meta', 'Shift', '3'], name: 'Mac Screenshot' },
        { keys: ['Meta', 'Shift', '4'], name: 'Mac Screenshot' },
        { keys: ['Meta', 'Shift', '5'], name: 'Mac Screen Record' },
        { keys: ['Control', 'Shift', 'Escape'], name: 'Task Manager' },
        { keys: ['Alt', 'Tab'], name: 'Alt+Tab' },
        { keys: ['Alt', 'F4'], name: 'Close Window' },
      ];

      // Context menu prevention
      if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
        e.preventDefault();
        console.warn("🚨 CONTEXT_MENU attempt via keyboard");
        this.reportViolation("CONTEXT_MENU", {
          detail: "Context menu attempt via keyboard",
          timestamp: new Date().toISOString(),
        });
      }

      // PrintScreen detection
      if (e.key === 'PrintScreen') {
        this.screenshotAttempts++;
        console.warn(`🚨 SCREENSHOT attempt #${this.screenshotAttempts}`);
        this.reportViolation("SCREENSHOT_ATTEMPT", {
          detail: "Screenshot key pressed",
          screenshotAttempts: this.screenshotAttempts,
          timestamp: new Date().toISOString(),
        });
      }

      // Developer tools shortcuts
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        console.warn("🚨 DEVTOOLS_OPEN attempt via keyboard");
        this.reportViolation("DEVTOOLS_OPEN", {
          detail: "DevTools shortcut detected",
          timestamp: new Date().toISOString(),
        });
      }

      // F12 key
      if (e.key === 'F12') {
        e.preventDefault();
        console.warn("🚨 DEVTOOLS_OPEN attempt via F12");
        this.reportViolation("DEVTOOLS_OPEN", {
          detail: "F12 key pressed",
          timestamp: new Date().toISOString(),
        });
      }
    };
    
    this.addListener(document, "keydown", handler);
  }

  /**
   * Setup mouse detection (right-click)
   */
  setupMouseDetection() {
    const handler = (e) => {
      e.preventDefault();
      console.warn("🚨 CONTEXT_MENU violation via right-click");
      this.reportViolation("CONTEXT_MENU", {
        detail: "Right-click attempt detected",
        timestamp: new Date().toISOString(),
      });
    };
    this.addListener(document, "contextmenu", handler);
  }

  /**
   * Setup navigation blocking
   */
  setupNavigationBlocking() {
    // Block back button
    window.history.pushState(null, "", window.location.href);
    
    const popstateHandler = () => {
      window.history.pushState(null, "", window.location.href);
      console.warn("🚨 ROUTE_CHANGE (back button) violation");
      this.reportViolation("ROUTE_CHANGE", {
        detail: "Back button pressed",
        timestamp: new Date().toISOString(),
      });
    };
    this.addListener(window, "popstate", popstateHandler);

    // Warn before page unload
    const beforeUnloadHandler = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your exam will be auto-submitted.";
      console.warn("🚨 ROUTE_CHANGE (page leave) violation");
      this.reportViolation("ROUTE_CHANGE", {
        detail: "Attempt to leave exam page",
        timestamp: new Date().toISOString(),
      });
      return e.returnValue;
    };
    this.addListener(window, "beforeunload", beforeUnloadHandler);
  }

  /**
   * Setup DevTools detection using various methods
   */
  setupDevToolsDetection() {
    let devtoolsOpen = false;
    
    // Method 1: Window size detection
    const checkWindowSize = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      return widthThreshold || heightThreshold;
    };

    // Method 2: Console debugging detection
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          console.warn("🚨 DEVTOOLS_OPEN detected via console");
          this.reportViolation("DEVTOOLS_OPEN", {
            detail: "DevTools detected via console access",
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    // Check periodically
    this.devToolsInterval = setInterval(() => {
      const isOpen = checkWindowSize();
      
      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        console.warn("🚨 DEVTOOLS_OPEN detected via window size");
        this.reportViolation("DEVTOOLS_OPEN", {
          detail: "DevTools detected via window dimensions",
          timestamp: new Date().toISOString(),
        });
      } else if (!isOpen) {
        devtoolsOpen = false;
      }

      // Trigger console check
      console.log(element);
      console.clear();
    }, 2000);
  }

  /**
   * Setup activity monitoring (detect if student is idle)
   */
  setupActivityMonitoring() {
    const updateActivity = () => {
      this.lastActivity = Date.now();
    };

    this.addListener(document, "mousemove", updateActivity);
    this.addListener(document, "keypress", updateActivity);
    this.addListener(document, "click", updateActivity);
    this.addListener(document, "scroll", updateActivity);

    // Check for inactivity every 30 seconds
    this.activityInterval = setInterval(() => {
      const idleTime = Date.now() - this.lastActivity;
      const fiveMinutes = 5 * 60 * 1000;

      if (idleTime > fiveMinutes) {
        console.warn("⚠️ Student idle for over 5 minutes");
        // You can report this as a violation if needed
      }
    }, 30000);
  }

  /**
   * Add event listener and track for cleanup
   */
  addListener(target, event, handler) {
    target.addEventListener(event, handler, { passive: false });
    this.listeners.push({ target, event, handler });
  }

  /**
   * Report violation to backend with enhanced metadata
   */
  async reportViolation(violationType, metadata = {}) {
    if (!this.isActive) {
      console.warn("⚠️ Fraud detection not active, skipping violation report");
      return;
    }

    if (this.reportingInProgress) {
      console.warn("⚠️ Violation report already in progress, skipping");
      return;
    }

    this.violationCount++;
    console.warn(`🚨 Violation #${this.violationCount}:`, violationType);

    this.reportingInProgress = true;

    try {
      const violationData = {
        examId: this.examId,
        submissionId: this.submissionId,
        violationType,
        questionIndex: this.questionIndex,
        additionalInfo: {
          ...metadata,
          fingerprint: this.fingerprint,
          browserInfo: this.browserInfo,
          timestamp: new Date().toISOString(),
          violationCount: this.violationCount,
          tabSwitchCount: this.tabSwitchCount,
          copyAttempts: this.copyAttempts,
          pasteAttempts: this.pasteAttempts,
          screenshotAttempts: this.screenshotAttempts,
          screenResolution: {
            width: window.screen.width,
            height: window.screen.height,
          },
          viewportSize: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
      };

      console.log("📤 Sending violation report:", violationData);
      
      const response = await this.onViolation(violationData);
      
      console.log("📥 Violation response:", response);

      // Check if auto-submit triggered
      if (response?.autoSubmitted) {
        console.error("🚨 Auto-submit triggered due to violations");
        this.cleanup();
        if (this.onAutoSubmit) {
          this.onAutoSubmit(response);
        }
      }

      return response;
    } catch (error) {
      console.error("❌ Failed to report violation:", error);
      return null;
    } finally {
      this.reportingInProgress = false;
    }
  }

  /**
   * Update current question index
   */
  setQuestionIndex(index) {
    this.questionIndex = index;
    console.log(`📍 Question index updated: ${index}`);
  }

  /**
   * Request fullscreen mode
   */
  async requestFullscreen() {
    try {
      await document.documentElement.requestFullscreen();
      console.log("✅ Fullscreen mode activated");
    } catch (error) {
      console.warn("⚠️ Fullscreen request failed:", error);
    }
  }

  /**
   * Cleanup all listeners and intervals
   */
  cleanup() {
    if (!this.isActive) {
      console.log("✅ Fraud detection already cleaned up");
      return;
    }

    console.log("🧹 Cleaning up fraud detection system");
    console.log(`📊 Removing ${this.listeners.length} listeners`);

    // Remove all event listeners
    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.listeners = [];

    // Clear intervals
    if (this.devToolsInterval) {
      clearInterval(this.devToolsInterval);
    }
    if (this.activityInterval) {
      clearInterval(this.activityInterval);
    }

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    this.isActive = false;
    console.log("✅ Fraud detection system deactivated");
  }
}

export default FraudDetectionSystem;
