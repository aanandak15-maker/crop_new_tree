import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wheat, Sprout, Search, TrendingUp } from 'lucide-react';
import { getAllCropNames, getCropByName } from '@/data/cropData';

interface SimpleCropDashboardProps {
  onCropSelect: (cropName: string) => void;
}

const SimpleCropDashboard: React.FC<SimpleCropDashboardProps> = ({ onCropSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const staticCrops = getAllCropNames();
  const filteredCrops = staticCrops.filter(cropName => 
    cropName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCropIcon = (cropName: string) => {
    if (cropName.toLowerCase() === 'wheat') {
      return <Wheat className="h-8 w-8 text-harvest-gold" />;
    }
    return <Sprout className="h-8 w-8 text-crop-green" />;
  };

  const renderCropCard = (cropName: string) => {
    const cropData = getCropByName(cropName);
    if (!cropData) return null;

    return (
      <Card 
        key={cropName}
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-crop-green"
        onClick={() => onCropSelect(cropName)}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            {getCropIcon(cropName)}
            <div>
              <CardTitle className="text-xl group-hover:text-crop-green transition-colors">
                {cropData.name}
              </CardTitle>
              <CardDescription className="text-sm italic">
                {cropData.scientificName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {cropData.season.join(', ')}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-crop-green">{cropData.varieties.length}</div>
                <div className="text-xs text-muted-foreground">Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-harvest-gold">
                  {cropData.economics.averageYield.split(' ')[0]}
                </div>
                <div className="text-xs text-muted-foreground">Avg Yield</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {cropData.economics.majorStates.length}
                </div>
                <div className="text-xs text-muted-foreground">States</div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-crop-green to-crop-green/80 hover:from-crop-green/90 hover:to-crop-green/70"
              onClick={(e) => {
                e.stopPropagation();
                onCropSelect(cropName);
              }}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Explore Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-light via-background to-leaf-light/30">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-crop-green via-harvest-gold to-crop-green bg-clip-text text-transparent">
            CropTree Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover comprehensive crop profiles with scientific insights
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search crops by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <p>Total crops: {staticCrops.length}</p>
          <p>Filtered crops: {filteredCrops.length}</p>
          <p>All crop names: {staticCrops.join(', ')}</p>
          <p>Filtered crop names: {filteredCrops.join(', ')}</p>
        </div>

        {/* Crop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((cropName) => renderCropCard(cropName))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-2">No crops found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCropDashboard;
