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
        const seasonMatch = !selectedSeason || crop.season.some(s => 
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
              <SelectItem value="">All Seasons</SelectItem>
              {seasons.map((season) => (
                <SelectItem key={season} value={season.toLowerCase()}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recommendations */}
        {selectedState && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-crop-green" />
              Recommended Crops for {selectedState.charAt(0).toUpperCase() + selectedState.slice(1)}
              {selectedSeason && ` (${selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} Season)`}
            </h3>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(0, 6).map(({ crop, varieties, avgYield }) => (
                  <Card 
                    key={crop.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-crop-green"
                    onClick={() => onCropSelect(crop.name)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{crop.name}</CardTitle>
                          <CardDescription className="text-sm italic">
                            {crop.scientificName}
                          </CardDescription>
                        </div>
                        <Badge className="bg-crop-green text-white">
                          {Math.round(avgYield)} q/ha
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium">Suitable Varieties:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {varieties.slice(0, 3).map((variety) => (
                              <Badge key={variety.id} variant="outline" className="text-xs">
                                {variety.name}
                              </Badge>
                            ))}
                            {varieties.length > 3 && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{varieties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-crop-green" />
                            {varieties.filter(v => v.resistance.length > 0).length} resistant varieties
                          </span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-crop-green hover:text-crop-green hover:bg-leaf-light"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCropSelect(crop.name);
                            }}
                          >
                            Explore →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🌾</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No specific recommendations found
                </h3>
                <p className="text-muted-foreground">
                  Try selecting a different state or season combination
                </p>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        {!selectedState && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Get Personalized Recommendations
            </h3>
            <p className="text-muted-foreground mb-4">
              Select your state to see the best crop varieties for your region
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationBasedRecommendations;