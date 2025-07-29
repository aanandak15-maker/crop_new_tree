import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCropNames, getCropByName } from '@/data/cropData';
import { Search, Filter, MapPin, Calendar, TrendingUp, Sparkles } from 'lucide-react';

interface EnhancedCropSelectorProps {
  onCropSelect: (cropName: string) => void;
  selectedCrop: string | null;
}

const EnhancedCropSelector: React.FC<EnhancedCropSelectorProps> = ({ 
  onCropSelect, 
  selectedCrop 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const allCrops = getAllCropNames();
  
  const filteredCrops = useMemo(() => {
    return allCrops.filter(cropName => {
      const crop = getCropByName(cropName);
      if (!crop) return false;
      
      const matchesSearch = cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeason = selectedSeason === 'all' || crop.season.some(s => s.toLowerCase().includes(selectedSeason));
      
      const matchesState = selectedState === 'all' || 
                          crop.varieties.some(variety => 
                            variety.states.some(state => 
                              state.toLowerCase().includes(selectedState.toLowerCase())
                            )
                          );
      
      return matchesSearch && matchesSeason && matchesState;
    });
  }, [searchTerm, selectedSeason, selectedState, allCrops]);

  const getVarietyCount = (cropName: string) => {
    const crop = getCropByName(cropName);
    return crop ? crop.varieties.length : 0;
  };

  const handleQuickSelect = (cropName: string) => {
    setSearchTerm(cropName);
    onCropSelect(cropName);
  };

  const featuredCrops = ['Wheat', 'Rice', 'Maize'];

  return (
    <Card className="w-full shadow-nature border-2 border-leaf-light">
      <CardHeader className="bg-growth-gradient text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Smart Crop Explorer
            </CardTitle>
            <CardDescription className="text-white/90">
              Select a crop to explore detailed variety profiles and cultivation insights
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-white hover:bg-white/20"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search crops by name or scientific name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg border-2 focus:border-crop-green"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-leaf-light rounded-lg">
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="rabi">Rabi Season</SelectItem>
                <SelectItem value="kharif">Kharif Season</SelectItem>
                <SelectItem value="zaid">Zaid Season</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
                <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="bihar">Bihar</SelectItem>
                <SelectItem value="west bengal">West Bengal</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Featured Crops Quick Access */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-crop-green" />
            Featured Crops
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featuredCrops.map((crop) => (
              <Button
                key={crop}
                variant={selectedCrop === crop ? "default" : "outline"}
                onClick={() => handleQuickSelect(crop)}
                className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <span className="font-semibold">{crop}</span>
                <Badge variant="secondary" className="text-xs">
                  {getVarietyCount(crop)} varieties
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Search Results ({filteredCrops.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {filteredCrops.slice(0, 8).map((cropName) => {
                const crop = getCropByName(cropName);
                if (!crop) return null;
                
                return (
                  <Button
                    key={cropName}
                    variant="ghost"
                    onClick={() => onCropSelect(cropName)}
                    className="h-auto p-3 justify-start border hover:border-crop-green hover:bg-leaf-light transition-all"
                  >
                    <div className="text-left">
                      <div className="font-medium">{crop.name}</div>
                      <div className="text-xs text-muted-foreground italic">
                        {crop.scientificName}
                      </div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {crop.varieties.length} varieties
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {crop.season.join(', ')}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Selection */}
        {selectedCrop && (
          <div className="p-4 bg-crop-green/10 border border-crop-green rounded-lg">
            <h3 className="font-semibold text-crop-green mb-2">Currently Exploring:</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">{selectedCrop}</span>
              <Badge className="bg-crop-green text-white">
                ✓ Selected
              </Badge>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!selectedCrop && !searchTerm && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start Your Crop Exploration
            </h3>
            <p className="text-muted-foreground mb-4">
              Search for a crop or select from featured options to begin
            </p>
            <Button
              onClick={() => handleQuickSelect('Wheat')}
              className="bg-crop-green hover:bg-crop-green/90"
            >
              Explore Wheat Varieties
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCropSelector;