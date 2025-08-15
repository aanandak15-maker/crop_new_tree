import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Integration hook for seamless crop guide experience within main app
export const useCropGuideIntegration = () => {
  const [isInCropGuide, setIsInCropGuide] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [cropGuideData, setCropGuideData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is in crop guide
  useEffect(() => {
    const isCropRoute = location.pathname.startsWith('/crops');
    setIsInCropGuide(isCropRoute);
  }, [location.pathname]);

  // Navigate to crop guide
  const openCropGuide = useCallback((initialCrop?: string) => {
    const path = initialCrop ? `/crops/${initialCrop}` : '/crops';
    navigate(path);
    if (initialCrop) {
      setSelectedCrop(initialCrop);
    }
  }, [navigate]);

  // Navigate to specific crop
  const selectCrop = useCallback((cropName: string) => {
    setSelectedCrop(cropName);
    navigate(`/crops/${cropName}`);
  }, [navigate]);

  // Return to main app from crop guide
  const exitCropGuide = useCallback((returnPath = '/') => {
    setSelectedCrop(null);
    setCropGuideData(null);
    navigate(returnPath);
  }, [navigate]);

  // Navigate to crop admin
  const openCropAdmin = useCallback(() => {
    navigate('/crops/admin');
  }, [navigate]);

  // Store crop guide data for main app use
  const storeCropData = useCallback((data: any) => {
    setCropGuideData(data);
    
    // Optionally emit event for other parts of main app
    window.dispatchEvent(new CustomEvent('cropDataSelected', { 
      detail: data 
    }));
  }, []);

  // Get crop guide breadcrumbs for main app navigation
  const getBreadcrumbs = useCallback(() => {
    const crumbs = [
      { label: 'Home', path: '/' }
    ];

    if (isInCropGuide) {
      crumbs.push({ label: 'Crop Guide', path: '/crops' });
      
      if (selectedCrop) {
        crumbs.push({ 
          label: selectedCrop, 
          path: `/crops/${selectedCrop}` 
        });
      }

      if (location.pathname.includes('/admin')) {
        crumbs.push({ 
          label: 'Administration', 
          path: '/crops/admin' 
        });
      }
    }

    return crumbs;
  }, [isInCropGuide, selectedCrop, location.pathname]);

  return {
    // State
    isInCropGuide,
    selectedCrop,
    cropGuideData,
    breadcrumbs: getBreadcrumbs(),

    // Actions
    openCropGuide,
    selectCrop,
    exitCropGuide,
    openCropAdmin,
    storeCropData,

    // Utilities
    isOnCropDashboard: location.pathname === '/crops',
    isOnCropProfile: location.pathname.startsWith('/crops/') && !location.pathname.includes('/admin'),
    isOnCropAdmin: location.pathname.includes('/crops/admin')
  };
};
