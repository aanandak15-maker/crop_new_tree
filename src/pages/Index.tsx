import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import EnhancedCropDashboard from "@/components/EnhancedCropDashboard";
import SimpleCropProfile from "@/components/SimpleCropProfile";
import EnhancedCropProfile from "@/components/EnhancedCropProfile";

const Index = () => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'enhanced'>('simple');
  const [enhancedLocked] = useState(true); // Lock enhanced view for now

  const handleCropSelect = (cropName: string) => {
    setSelectedCrop(cropName);
  };

  const handleBack = () => {
    setSelectedCrop(null);
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'simple' ? 'enhanced' : 'simple');
  };

  return (
    <div className="min-h-screen">
      {selectedCrop ? (
        <div>
          {/* View Mode Toggle */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">View Mode:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('simple')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === 'simple'
                        ? 'bg-yellow-400 text-gray-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setViewMode('enhanced')}
                    disabled={enhancedLocked}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === 'enhanced'
                        ? 'bg-yellow-400 text-gray-800'
                        : enhancedLocked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={enhancedLocked ? 'Enhanced view is currently locked' : ''}
                  >
                    Enhanced
                    {enhancedLocked && (
                      <span className="ml-1 text-xs">🔒</span>
                    )}
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {enhancedLocked ? 'Enhanced view locked - Simple mode only' : (viewMode === 'enhanced' ? 'Advanced data visualization & analysis' : 'Basic crop information')}
              </div>
            </div>
          </div>
          
          {/* Crop Profile */}
          {viewMode === 'simple' ? (
            <SimpleCropProfile cropName={selectedCrop} onBack={handleBack} />
          ) : enhancedLocked ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Enhanced View Locked</h2>
                <p className="text-gray-600 mb-4">The enhanced view is currently unavailable. Please use the simple view mode.</p>
                <button
                  onClick={() => setViewMode('simple')}
                  className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
                >
                  Switch to Simple View
                </button>
              </div>
            </div>
          ) : (
            <EnhancedCropProfile cropName={selectedCrop} onBack={handleBack} />
          )}
        </div>
      ) : (
        <EnhancedCropDashboard onCropSelect={handleCropSelect} />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
