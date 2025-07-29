import React, { useState } from 'react';
import { Search, Sprout, Download, RotateCcw } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getAllCropNames } from '../data/cropData';

interface CropSelectorProps {
  onCropSelect: (cropName: string) => void;
  selectedCrop: string | null;
  onExport?: () => void;
  onReset?: () => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  onCropSelect,
  selectedCrop,
  onExport,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [season, setSeason] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');

  const cropNames = getAllCropNames();
  const filteredCrops = cropNames.filter(crop =>
    crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    if (searchTerm && filteredCrops.length > 0) {
      onCropSelect(filteredCrops[0]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="bg-gradient-to-r from-background via-leaf-light to-background border-primary shadow-nature">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6 animate-float" />
          CropTree Explorer
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Enter a crop name to generate its comprehensive profile flowchart
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Section */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter crop name (e.g., Wheat, Rice, Maize...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 border-primary/20 focus:border-primary"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-crop-green hover:bg-crop-green/90 text-white px-6"
            disabled={!searchTerm}
          >
            Generate Tree
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-1 block">Season</label>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="kharif">Kharif</SelectItem>
                <SelectItem value="rabi">Rabi</SelectItem>
                <SelectItem value="zaid">Zaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-1 block">Region</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="northern">Northern Plains</SelectItem>
                <SelectItem value="western">Western Region</SelectItem>
                <SelectItem value="southern">Southern Region</SelectItem>
                <SelectItem value="eastern">Eastern Region</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Crop Suggestions */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Popular Crops</label>
          <div className="flex flex-wrap gap-2">
            {cropNames.slice(0, 6).map((crop) => (
              <Badge
                key={crop}
                variant={selectedCrop === crop ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onCropSelect(crop)}
              >
                {crop}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {selectedCrop && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="border-harvest-gold text-harvest-gold hover:bg-harvest-gold hover:text-accent-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-earth-brown text-earth-brown hover:bg-earth-brown hover:text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        )}

        {/* Current Selection */}
        {selectedCrop && (
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary">
              Currently viewing: <span className="font-bold">{selectedCrop}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};