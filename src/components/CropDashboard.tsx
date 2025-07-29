import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCropNames, getCropByName } from '@/data/cropData';
import { Wheat, Sprout, MapPin, Calendar, TrendingUp, Search, Filter } from 'lucide-react';

interface CropDashboardProps {
  onCropSelect: (cropName: string) => void;
}

const CropDashboard: React.FC<CropDashboardProps> = ({ onCropSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  const allCrops = getAllCropNames();
  
  const filteredCrops = allCrops.filter(cropName => {
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

  const getCropIcon = (cropName: string) => {
    switch (cropName.toLowerCase()) {
      case 'wheat': return <Wheat className="h-8 w-8 text-harvest-gold" />;
      default: return <Sprout className="h-8 w-8 text-crop-green" />;
    }
  };

  const getCropStats = (cropName: string) => {
    const crop = getCropByName(cropName);
    if (!crop) return { varieties: 0, avgYield: 0, states: 0 };
    
    const avgYieldNum = crop.varieties.reduce((sum, v) => {
      const yieldStr = v.yield.replace(/[^\d.-]/g, '');
      const yieldRange = yieldStr.split('-');
      const avgYield = yieldRange.length > 1 ? 
        (parseFloat(yieldRange[0]) + parseFloat(yieldRange[1])) / 2 : 
        parseFloat(yieldRange[0]);
      return sum + (isNaN(avgYield) ? 0 : avgYield);
    }, 0) / crop.varieties.length;
    
    return {
      varieties: crop.varieties.length,
      avgYield: Math.round(avgYieldNum),
      states: [...new Set(crop.varieties.flatMap(v => v.states))].length
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            CropTree Explorer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore detailed crop profiles with variety-specific insights for students and farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search crops by name or botanical name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-32">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="rabi">Rabi</SelectItem>
                <SelectItem value="kharif">Kharif</SelectItem>
                <SelectItem value="zaid">Zaid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-32">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
                <SelectItem value="uttar pradesh">UP</SelectItem>
                <SelectItem value="bihar">Bihar</SelectItem>
                <SelectItem value="west bengal">West Bengal</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Crop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((cropName) => {
            const crop = getCropByName(cropName);
            const stats = getCropStats(cropName);
            
            if (!crop) return null;

            return (
              <Card 
                key={cropName}
                className="group cursor-pointer transition-all duration-300 hover:shadow-nature hover:scale-105 border-2 hover:border-crop-green"
                onClick={() => onCropSelect(cropName)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCropIcon(cropName)}
                      <div>
                        <CardTitle className="text-xl group-hover:text-crop-green transition-colors">
                          {crop.name}
                        </CardTitle>
                        <CardDescription className="text-sm italic">
                          {crop.scientificName}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-leaf-light text-crop-green">
                      {crop.season.join(', ')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-2xl font-bold text-crop-green">{stats.varieties}</div>
                      <div className="text-xs text-muted-foreground">Varieties</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-2xl font-bold text-harvest-gold">{stats.avgYield}</div>
                      <div className="text-xs text-muted-foreground">Avg Yield</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-2xl font-bold text-primary">{stats.states}</div>
                      <div className="text-xs text-muted-foreground">States</div>
                    </div>
                  </div>

                  {/* Top Varieties Preview */}
                  <div>
                    <div className="text-sm font-medium text-foreground mb-2">Top Varieties:</div>
                    <div className="flex flex-wrap gap-1">
                      {crop.varieties.slice(0, 3).map((variety) => (
                        <Badge key={variety.name} variant="outline" className="text-xs">
                          {variety.name}
                        </Badge>
                      ))}
                      {crop.varieties.length > 3 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          +{crop.varieties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Climate Info */}
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Temperature:</span>
                      <span>{crop.climate.temperature}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Rainfall:</span>
                      <span>{crop.climate.rainfall}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full bg-crop-green hover:bg-crop-green/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCropSelect(cropName);
                    }}
                  >
                    Explore Varieties <TrendingUp className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No crops found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDashboard;