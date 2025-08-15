/**
 * Main App Integration Helper for Crop Guide Module
 * 
 * This script helps integrate the Crop Guide seamlessly into your main application
 */

class CropGuideIntegration {
  constructor(config = {}) {
    this.config = {
      cropGuideUrl: 'https://crops.yourmainapp.com',
      containerId: 'crop-guide-container',
      loadingText: 'Loading Crop Guide...',
      theme: 'main-app',
      hideNavigation: false,
      ...config
    };
    
    this.iframe = null;
    this.container = null;
  }

  /**
   * Initialize the crop guide integration
   */
  init() {
    this.setupContainer();
    this.setupMessageListener();
    this.loadCropGuide();
  }

  /**
   * Setup the container for the crop guide
   */
  setupContainer() {
    this.container = document.getElementById(this.config.containerId);
    if (!this.container) {
      console.error(`Container with ID '${this.config.containerId}' not found`);
      return;
    }

    // Add styles for seamless integration
    this.container.style.cssText = `
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
      background: #f8fafc;
    `;

    // Add loading state
    this.showLoading();
  }

  /**
   * Show loading indicator
   */
  showLoading() {
    const loadingHtml = `
      <div id="crop-guide-loading" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8fafc;
        z-index: 1000;
        transition: opacity 0.3s ease;
      ">
        <div style="text-align: center;">
          <div style="
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #10b981;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          "></div>
          <p style="color: #6b7280; font-family: system-ui;">${this.config.loadingText}</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    this.container.innerHTML = loadingHtml;
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loading = document.getElementById('crop-guide-loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => {
        if (loading.parentNode) {
          loading.parentNode.removeChild(loading);
        }
      }, 300);
    }
  }

  /**
   * Load the crop guide iframe
   */
  loadCropGuide() {
    // Build URL with integration parameters
    const url = new URL(this.config.cropGuideUrl);
    url.searchParams.set('embed', 'true');
    url.searchParams.set('theme', this.config.theme);
    url.searchParams.set('hideNav', this.config.hideNavigation.toString());

    // Create iframe
    this.iframe = document.createElement('iframe');
    this.iframe.src = url.toString();
    this.iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    `;
    
    // Security attributes
    this.iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation';
    
    // Handle load event
    this.iframe.onload = () => {
      this.hideLoading();
      this.onCropGuideLoaded();
    };

    // Handle error
    this.iframe.onerror = () => {
      this.showError('Failed to load Crop Guide');
    };

    this.container.appendChild(this.iframe);
  }

  /**
   * Setup message listener for communication with crop guide
   */
  setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Validate origin for security
      const allowedOrigins = [
        this.config.cropGuideUrl,
        new URL(this.config.cropGuideUrl).origin
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      // Handle messages from crop guide
      if (event.data.source === 'crop-guide') {
        this.handleCropGuideMessage(event.data);
      }
    });
  }

  /**
   * Handle messages from the crop guide iframe
   */
  handleCropGuideMessage(message) {
    switch (message.type) {
      case 'CROP_SELECTED':
        this.onCropSelected(message.data);
        break;
      
      case 'NAVIGATE':
        this.onNavigate(message.data);
        break;
      
      case 'BACK_TO_MAIN':
        this.onBackToMain();
        break;
      
      case 'SIGN_OUT':
        this.onSignOut();
        break;
      
      default:
        console.log('Unknown message from crop guide:', message);
    }
  }

  /**
   * Send message to crop guide iframe
   */
  sendMessage(type, data = {}) {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage({
        type,
        data,
        source: 'main-app'
      }, this.config.cropGuideUrl);
    }
  }

  /**
   * Event handlers (override these in your implementation)
   */
  onCropGuideLoaded() {
    console.log('Crop Guide loaded successfully');
    // Override this method to handle load event
  }

  onCropSelected(cropData) {
    console.log('Crop selected:', cropData);
    // Override this method to handle crop selection
    // You might want to store this in your main app state
  }

  onNavigate(navigationData) {
    console.log('Navigation requested:', navigationData);
    // Override this method to handle navigation within crop guide
  }

  onBackToMain() {
    console.log('Back to main app requested');
    // Override this method to handle return to main app
    // this.destroy(); // Example: destroy crop guide and return to main view
  }

  onSignOut() {
    console.log('Sign out requested from crop guide');
    // Override this method to handle sign out
    // You might want to sign out the user from your main app too
  }

  /**
   * Show error message
   */
  showError(message) {
    this.container.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        color: #ef4444;
        font-family: system-ui;
      ">
        <div>
          <h3>Error Loading Crop Guide</h3>
          <p>${message}</p>
          <button onclick="location.reload()" style="
            background: #10b981;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 16px;
          ">Try Again</button>
        </div>
      </div>
    `;
  }

  /**
   * Destroy the integration
   */
  destroy() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Navigate to specific crop in the guide
   */
  navigateToCrop(cropName) {
    this.sendMessage('NAVIGATE_TO_CROP', { cropName });
  }

  /**
   * Set authentication data for the crop guide
   */
  setAuthData(authData) {
    this.sendMessage('SET_AUTH', authData);
  }
}

// Usage example:
/*
const cropGuide = new CropGuideIntegration({
  cropGuideUrl: 'https://crops.yourmainapp.com',
  containerId: 'crop-guide-container',
  theme: 'main-app',
  hideNavigation: true
});

// Override event handlers
cropGuide.onCropSelected = (cropData) => {
  console.log('User selected crop:', cropData.cropName);
  // Update main app state
  mainApp.setSelectedCrop(cropData.cropName);
};

cropGuide.onBackToMain = () => {
  // Return to main app view
  mainApp.showDashboard();
  cropGuide.destroy();
};

// Initialize
cropGuide.init();
*/

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CropGuideIntegration;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
  window.CropGuideIntegration = CropGuideIntegration;
}
