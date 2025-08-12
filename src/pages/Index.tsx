import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import EnhancedCropDashboard from "@/components/EnhancedCropDashboard";
import SimpleCropProfile from "@/components/SimpleCropProfile";
import EnhancedCropProfile from "@/components/EnhancedCropProfile";

const Index = () => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'enhanced'>('simple');

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
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === 'enhanced'
                        ? 'bg-yellow-400 text-gray-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Enhanced
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {viewMode === 'enhanced' ? 'Advanced data visualization & analysis' : 'Basic crop information'}
              </div>
            </div>
          </div>
          
          {/* Crop Profile */}
          {viewMode === 'simple' ? (
            <SimpleCropProfile cropName={selectedCrop} onBack={handleBack} />
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
