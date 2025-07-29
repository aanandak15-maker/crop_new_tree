import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import CropDashboard from "@/components/CropDashboard";
import CropProfile from "@/components/CropProfile";

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
        <CropProfile cropName={selectedCrop} onBack={handleBack} />
      ) : (
        <CropDashboard onCropSelect={handleCropSelect} />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
