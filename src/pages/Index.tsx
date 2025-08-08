import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import CropDashboard from "@/components/CropDashboard";
import CropProfile from "@/components/CropProfile";
import TestCropData from "@/components/TestCropData";
import MinimalTest from "@/components/MinimalTest";
import CropDataTest from "@/components/CropDataTest";
import SimpleCropDashboard from "@/components/SimpleCropDashboard";
import SimpleCropProfile from "@/components/SimpleCropProfile";
import ProfessionalCropProfile from "@/components/ProfessionalCropProfile";

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
        <ProfessionalCropProfile cropName={selectedCrop} onBack={handleBack} />
      ) : (
        <SimpleCropDashboard onCropSelect={handleCropSelect} />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
