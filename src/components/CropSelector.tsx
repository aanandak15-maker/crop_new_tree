import React, { useState, useMemo } from 'react';
import { Search, Sprout, Download, RotateCcw, Crown } from 'lucide-react';
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
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cropNames = getAllCropNames();
  
  // Auto-complete suggestions with enhanced filtering
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return cropNames.filter(crop => 
      crop.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, cropNames]);

  const filteredCrops = cropNames.filter(crop =>
    crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    if (searchTerm && filteredCrops.length > 0) {
      onCropSelect(filteredCrops[0]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (crop: string) => {
    setSearchTerm(crop);
    onCropSelect(crop);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <Card className="bg-gradient-to-r from-background via-leaf-light to-background border-primary shadow-nature">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Crown className="h-6 w-6 animate-float text-harvest-gold" />
          CropTree Explorer - Variety Focus
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Generate comprehensive crop profiles with enhanced variety sub-profiles and resistance data
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enhanced Search Section with Auto-complete */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Start typing crop name - auto-complete enabled (e.g., Wheat, Rice, Maize...)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="pl-10 border-primary/20 focus:border-primary"
            />
            
            {/* Auto-complete suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {filteredSuggestions.map((crop, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-accent cursor-pointer text-sm border-b border-border last:border-b-0 flex items-center gap-2"
                    onClick={() => handleSuggestionClick(crop)}
                  >
                    <Sprout className="h-3 w-3 text-primary" />
                    <span className="font-medium">{crop}</span>
                    <Crown className="h-3 w-3 text-harvest-gold ml-auto" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-crop-green to-harvest-gold hover:from-crop-green/90 hover:to-harvest-gold/90 text-white px-6"
            disabled={!searchTerm}
          >
            Generate Profile
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

        {/* Enhanced Quick Crop Suggestions */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Crown className="h-4 w-4 text-harvest-gold" />
            Featured Crops with Rich Variety Data
          </label>
          <div className="flex flex-wrap gap-2">
            {cropNames.slice(0, 6).map((crop) => (
              <Badge
                key={crop}
                variant={selectedCrop === crop ? "default" : "secondary"}
                className="cursor-pointer hover:bg-gradient-to-r hover:from-primary hover:to-harvest-gold hover:text-white transition-all duration-200 transform hover:scale-105"
                onClick={() => onCropSelect(crop)}
              >
                <Crown className="h-3 w-3 mr-1" />
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