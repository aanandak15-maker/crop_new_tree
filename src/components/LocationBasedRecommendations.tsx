import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCropNames, getCropByName } from '@/data/cropData';
import { MapPin, TrendingUp, Shield, Clock } from 'lucide-react';

interface LocationBasedRecommendationsProps {
  onCropSelect: (cropName: string) => void;
}

const LocationBasedRecommendations: React.FC<LocationBasedRecommendationsProps> = ({
  onCropSelect
}) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');

  const states = [
    'Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal', 
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Madhya Pradesh', 'Rajasthan'
  ];

  const seasons = ['Rabi', 'Kharif', 'Zaid'];

  const getRecommendationsForLocation = () => {
    if (!selectedState) return [];
    
    const allCrops = getAllCropNames();
    const recommendations = [];

    for (const cropName of allCrops) {
      const crop = getCropByName(cropName);
      if (!crop) continue;

      const suitableVarieties = crop.varieties.filter(variety => {
        const stateMatch = variety.states.some(state => 
          state.toLowerCase().includes(selectedState.toLowerCase())
        );
        const seasonMatch = selectedSeason === 'all' || !selectedSeason || crop.season.some(s => 
          s.toLowerCase() === selectedSeason.toLowerCase()
        );
        return stateMatch && seasonMatch;
      });

      if (suitableVarieties.length > 0) {
        // Calculate average yield for ranking
        const avgYield = suitableVarieties.reduce((sum, variety) => {
          const yieldStr = variety.yield.replace(/[^\d.-]/g, '');
          const yieldNum = parseFloat(yieldStr.split('-')[0]) || 0;
          return sum + yieldNum;
        }, 0) / suitableVarieties.length;

        recommendations.push({
          crop: crop,
          varieties: suitableVarieties,
          avgYield: avgYield
        });
      }
    }

    // Sort by average yield (descending)
    return recommendations.sort((a, b) => b.avgYield - a.avgYield);
  };

  const recommendations = getRecommendationsForLocation();

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-primary to-crop-green text-white">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location-Based Crop Recommendations
        </CardTitle>
        <CardDescription className="text-white/90">
          Find the best crop varieties for your specific location and season
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Location and Season Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state.toLowerCase()}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger>
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select season (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {seasons.map((season) => (
                <SelectItem key={season} value={season.toLowerCase()}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recommendations Display */}
        {selectedState && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-crop-green" />
              <h3 className="text-lg font-semibold">
                Top Recommendations for {selectedState}
                {selectedSeason && selectedSeason !== 'all' && ` (${selectedSeason})`}
              </h3>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.slice(0, 6).map((rec, index) => (
                  <Card key={rec.crop.name} className="hover:shadow-elegant transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{rec.crop.name}</CardTitle>
                        <Badge variant="secondary" className="bg-harvest-gold/20 text-harvest-gold">
                          #{index + 1}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm italic">
                        {rec.crop.scientificName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Varieties:</span>
                          <div className="text-muted-foreground">{rec.varieties.length}</div>
                        </div>
                        <div>
                          <span className="font-medium">Avg Yield:</span>
                          <div className="text-muted-foreground">{Math.round(rec.avgYield)} q/ha</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">Top Varieties:</div>
                        <div className="flex flex-wrap gap-1">
                          {rec.varieties.slice(0, 2).map((variety) => (
                            <Badge key={variety.name} variant="outline" className="text-xs">
                              {variety.name}
                            </Badge>
                          ))}
                          {rec.varieties.length > 2 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              +{rec.varieties.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-crop-green to-crop-green/80 hover:from-crop-green/90 hover:to-crop-green/70"
                        onClick={() => onCropSelect(rec.crop.name)}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No recommendations found</h4>
                <p className="text-muted-foreground">
                  Try selecting a different state or season combination
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!selectedState && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Get Personalized Recommendations</h4>
            <p className="text-muted-foreground">
              Select your state to see the best crop varieties for your region
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationBasedRecommendations;