import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import EnhancedCropDashboard from "@/components/EnhancedCropDashboard";
import SimpleCropProfile from "@/components/SimpleCropProfile";

const Index = () => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const handleCropSelect = (cropName: string) => {
    setSelectedCrop(cropName);
  };

  const handleBack = () => {
    setSelectedCrop(null);
  };

  return (
    <div className="min-h-screen">
      {selectedCrop ? (
        <SimpleCropProfile cropName={selectedCrop} onBack={handleBack} />
      ) : (
        <EnhancedCropDashboard onCropSelect={handleCropSelect} />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
