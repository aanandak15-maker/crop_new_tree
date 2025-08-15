// Integration configuration for seamless main app integration

export interface IntegrationConfig {
  isEmbedded: boolean;
  parentOrigin?: string;
  basePath: string;
  hideNavigation?: boolean;
  customTheme?: 'main-app' | 'standalone';
}

export const getIntegrationConfig = (): IntegrationConfig => {
  // Detect if running in iframe or as standalone
  const isEmbedded = window !== window.parent;
  
  // Get configuration from URL params or environment
  const urlParams = new URLSearchParams(window.location.search);
  const embed = urlParams.get('embed') === 'true';
  const theme = urlParams.get('theme') as 'main-app' | 'standalone' || 'standalone';
  const hideNav = urlParams.get('hideNav') === 'true';
  
  return {
    isEmbedded: isEmbedded || embed,
    parentOrigin: document.referrer ? new URL(document.referrer).origin : undefined,
    basePath: import.meta.env.VITE_BASE_PATH || '/',
    hideNavigation: hideNav,
    customTheme: theme
  };
};

// Communication with parent app
export const sendMessageToParent = (type: string, data: any) => {
  const config = getIntegrationConfig();
  if (config.isEmbedded && config.parentOrigin) {
    window.parent.postMessage({ type, data, source: 'crop-guide' }, config.parentOrigin);
  }
};

// Navigation handlers for embedded mode
export const handleNavigationInEmbedded = (path: string) => {
  const config = getIntegrationConfig();
  if (config.isEmbedded) {
    // Send navigation event to parent instead of navigating directly
    sendMessageToParent('NAVIGATE', { path });
    return true; // Prevent default navigation
  }
  return false; // Allow normal navigation
};
