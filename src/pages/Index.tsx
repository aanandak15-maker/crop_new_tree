import React, { useState } from 'react';
import { CropSelector } from '../components/CropSelector';
import { CropFlowChart } from '../components/CropFlowChart';
import { CropDetails } from '../components/CropDetails';
import { getCropByName } from '../data/cropData';
import { toast } from '../hooks/use-toast';
import { Wheat, TreePine, Sprout } from 'lucide-react';

const Index = () => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const cropData = selectedCrop ? getCropByName(selectedCrop) : null;

  const handleCropSelect = (cropName: string) => {
    const crop = getCropByName(cropName);
    if (crop) {
      setSelectedCrop(cropName);
      toast({
        title: "Crop Profile Generated",
        description: `Successfully loaded profile for ${cropName}`,
      });
    } else {
      toast({
        title: "Crop Not Found",
        description: `Sorry, we don't have data for ${cropName} yet. Try Wheat, Rice, or Maize.`,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality coming soon!",
    });
  };

  const handleReset = () => {
    setSelectedCrop(null);
    toast({
      title: "Reset Complete",
      description: "Cleared current crop selection",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-leaf-light to-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-crop-green to-harvest-gold text-white shadow-nature">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <TreePine className="h-8 w-8 animate-float" />
              <Wheat className="h-6 w-6" />
              <Sprout className="h-7 w-7 animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold">CropTree Explorer</h1>
              <p className="text-lg opacity-90">Smart Crop Profile Flowchart Generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Crop Selector */}
        <CropSelector
          onCropSelect={handleCropSelect}
          selectedCrop={selectedCrop}
          onExport={handleExport}
          onReset={handleReset}
        />

        {/* Flowchart */}
        {cropData && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <TreePine className="h-6 w-6" />
              {cropData.name} Profile Tree
            </h2>
            <CropFlowChart cropData={cropData} />
          </div>
        )}

        {/* Detailed Information */}
        {cropData && <CropDetails cropData={cropData} />}

        {/* Welcome Message when no crop selected */}
        {!selectedCrop && (
          <div className="mt-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-crop-green rounded-full flex items-center justify-center animate-float">
                  <Wheat className="h-8 w-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-harvest-gold rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                  <Sprout className="h-8 w-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-earth-brown rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <TreePine className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Welcome to CropTree Explorer
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Generate comprehensive, interactive flowcharts for any crop. Perfect for agriculture students, 
                competitive exam preparation, and agricultural education.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="p-4 bg-card rounded-lg border">
                  <h4 className="font-semibold text-primary mb-2">🌱 Botanical Info</h4>
                  <p className="text-muted-foreground">Scientific classification, family details, and seasonal patterns</p>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <h4 className="font-semibold text-primary mb-2">🔬 Variety Profiles</h4>
                  <p className="text-muted-foreground">State-wise recommendations, resistance traits, and yield data</p>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <h4 className="font-semibold text-primary mb-2">📊 Cultivation Guide</h4>
                  <p className="text-muted-foreground">Complete farming practices, pest management, and economics</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">
            Built for Agriculture Students & Educators | Data from ICAR & State Agricultural Universities
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
