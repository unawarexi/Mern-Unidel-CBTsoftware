/**
 * Fraud Detection System for Exam Security
 * Monitors student behavior during exams and reports violations
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
  }

  /**
   * Initialize all fraud detection listeners
   */
  init() {
    if (this.isActive) {
      console.warn("Fraud detection already active");
      return;
    }

    this.isActive = true;
    console.log("🛡️ Fraud detection system activated");

    // 1. Tab/Window Hidden Detection (High Priority)
    this.addListener(document, "visibilitychange", () => {
      if (document.hidden) {
        this.reportViolation("TAB_HIDDEN", {
          detail: "Student switched tabs or minimized window",
        });
      }
    });

    // 2. Window Blur Detection (High Priority)
    this.addListener(window, "blur", () => {
      this.reportViolation("WINDOW_BLUR", {
        detail: "Window lost focus (Alt+Tab or app switch)",
      });
    });

    // 3. Fullscreen Exit Detection (Medium Priority)
    this.addListener(document, "fullscreenchange", () => {
      if (!document.fullscreenElement) {
        this.reportViolation("EXIT_FULLSCREEN", {
          detail: "Student exited fullscreen mode",
        });
      }
    });

    // 4. Context Menu Detection (Low Priority)
    this.addListener(document, "contextmenu", (e) => {
      e.preventDefault();
      this.reportViolation("CONTEXT_MENU", {
        detail: "Right-click attempt detected",
      });
    });

    // 5. Copy/Paste Detection (Medium Priority)
    this.addListener(document, "copy", (e) => {
      e.preventDefault();
      this.reportViolation("COPY_PASTE", {
        detail: "Copy attempt detected",
      });
    });

    this.addListener(document, "paste", (e) => {
      e.preventDefault();
      this.reportViolation("COPY_PASTE", {
        detail: "Paste attempt detected",
      });
    });

    // 6. DevTools Detection (High Priority)
    this.detectDevTools();

    // 7. Navigation Blocking
    this.blockNavigation();

    console.log("✅ All fraud detection listeners activated");
  }

  /**
   * Add event listener and track for cleanup
   */
  addListener(target, event, handler) {
    target.addEventListener(event, handler);
    this.listeners.push({ target, event, handler });
  }

  /**
   * Detect DevTools opening
   */
  detectDevTools() {
    const threshold = 160; // DevTools width threshold
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        this.reportViolation("DEVTOOLS_OPEN", {
          detail: "Developer tools detected",
        });
      }
    };

    // Check every 1 second
    this.devToolsInterval = setInterval(checkDevTools, 1000);
  }

  /**
   * Block browser navigation during exam
   */
  blockNavigation() {
    // Block back button
    window.history.pushState(null, "", window.location.href);
    this.addListener(window, "popstate", () => {
      window.history.pushState(null, "", window.location.href);
      this.reportViolation("ROUTE_CHANGE", {
        detail: "Back button pressed",
      });
    });

    // Warn before page unload
    const beforeUnloadHandler = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your exam will be auto-submitted.";
      this.reportViolation("ROUTE_CHANGE", {
        detail: "Attempt to leave exam page",
      });
      return e.returnValue;
    };
    this.addListener(window, "beforeunload", beforeUnloadHandler);
  }

  /**
   * Report violation to backend
   */
  async reportViolation(violationType, metadata = {}) {
    if (!this.isActive) return;

    this.violationCount++;
    console.warn(`⚠️ Violation #${this.violationCount}:`, violationType);

    try {
      const response = await this.onViolation({
        examId: this.examId,
        submissionId: this.submissionId,
        violationType,
        questionIndex: this.questionIndex,
        additionalInfo: {
          ...metadata,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      });

      // Check if auto-submit triggered
      if (response?.autoSubmitted) {
        console.error("🚨 Auto-submit triggered due to violations");
        this.cleanup();
        this.onAutoSubmit(response);
      }

      return response;
    } catch (error) {
      console.error("Failed to report violation:", error);
    }
  }

  /**
   * Update current question index
   */
  setQuestionIndex(index) {
    this.questionIndex = index;
  }

  /**
   * Request fullscreen mode
   */
  async requestFullscreen() {
    try {
      await document.documentElement.requestFullscreen();
      console.log("📺 Fullscreen mode activated");
    } catch (error) {
      console.warn("Fullscreen request failed:", error);
    }
  }

  /**
   * Cleanup all listeners and intervals
   */
  cleanup() {
    if (!this.isActive) return;

    console.log("🧹 Cleaning up fraud detection system");

    // Remove all event listeners
    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.listeners = [];

    // Clear intervals
    if (this.devToolsInterval) {
      clearInterval(this.devToolsInterval);
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

