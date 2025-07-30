import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { getAllCropNames, getCropByName, CropData, CropVariety } from '@/data/cropData';
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  Shield, 
  Star,
  ChevronRight,
  BarChart3,
  Users
} from 'lucide-react';

interface ComparisonToolProps {
  initialCrop?: string;
  onCropSelect?: (cropName: string) => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ initialCrop, onCropSelect }) => {
  const [selectedCrops, setSelectedCrops] = useState<string[]>(initialCrop ? [initialCrop] : []);
  const [selectedVarieties, setSelectedVarieties] = useState<{[key: string]: string}>({});

  const allCrops = getAllCropNames();

  const addCropForComparison = (cropName: string) => {
    if (!selectedCrops.includes(cropName) && selectedCrops.length < 3) {
      setSelectedCrops([...selectedCrops, cropName]);
    }
  };

  const removeCropFromComparison = (cropName: string) => {
    setSelectedCrops(selectedCrops.filter(name => name !== cropName));
    const newVarieties = { ...selectedVarieties };
    delete newVarieties[cropName];
    setSelectedVarieties(newVarieties);
  };

  const selectVariety = (cropName: string, varietyName: string) => {
    setSelectedVarieties({
      ...selectedVarieties,
      [cropName]: varietyName
    });
  };

  const getYieldValue = (yieldStr: string): number => {
    const cleaned = yieldStr.replace(/[^\d.-]/g, '');
    const range = cleaned.split('-');
    if (range.length > 1) {
      return (parseFloat(range[0]) + parseFloat(range[1])) / 2;
    }
    return parseFloat(range[0]) || 0;
  };

  const getResistanceScore = (resistanceArray: string[]): number => {
    if (!resistanceArray || resistanceArray.length === 0) return 0;
    
    const scores = resistanceArray.map(resistance => {
      if (resistance.toLowerCase().includes('high')) return 3;
      if (resistance.toLowerCase().includes('medium')) return 2;
      if (resistance.toLowerCase().includes('moderate')) return 2;
      if (resistance.toLowerCase().includes('low')) return 1;
      return 1;
    });
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const getComparisonData = () => {
    return selectedCrops.map(cropName => {
      const crop = getCropByName(cropName);
      if (!crop) return null;
      
      const varietyName = selectedVarieties[cropName];
      const variety = varietyName ? 
        crop.varieties.find(v => v.name === varietyName) : 
        crop.varieties[0]; // Default to first variety
      
      return {
        crop,
        variety,
        yieldValue: variety ? getYieldValue(variety.yield) : 0,
        resistanceScore: variety ? getResistanceScore(variety.resistance) : 0
      };
    }).filter(Boolean);
  };

  const comparisonData = getComparisonData();
  const maxYield = Math.max(...comparisonData.map(d => d!.yieldValue));
  const maxResistance = Math.max(...comparisonData.map(d => d!.resistanceScore));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Crop & Variety Comparison Tool
        </h3>
        <p className="text-muted-foreground">
          Compare different crops and varieties side-by-side to make informed decisions
        </p>
      </div>

      {/* Crop Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Select Crops to Compare ({selectedCrops.length}/3)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCrops.map(cropName => {
              const crop = getCropByName(cropName);
              return (
                <Badge key={cropName} variant="secondary" className="px-3 py-1">
                  {crop?.name}
                  <button 
                    onClick={() => removeCropFromComparison(cropName)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>

          {selectedCrops.length < 3 && (
            <Select onValueChange={addCropForComparison}>
              <SelectTrigger>
                <SelectValue placeholder="Add a crop to compare" />
              </SelectTrigger>
              <SelectContent>
                {allCrops
                  .filter(cropName => !selectedCrops.includes(cropName))
                  .map(cropName => (
                    <SelectItem key={cropName} value={cropName}>
                      {getCropByName(cropName)?.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Variety Selection */}
      {selectedCrops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Varieties for Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedCrops.map(cropName => {
                const crop = getCropByName(cropName);
                if (!crop) return null;

                return (
                  <div key={cropName}>
                    <h4 className="font-semibold mb-2">{crop.name}</h4>
                    <Select 
                      value={selectedVarieties[cropName] || ''} 
                      onValueChange={(value) => selectVariety(cropName, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select variety" />
                      </SelectTrigger>
                      <SelectContent>
                        {crop.varieties.map(variety => (
                          <SelectItem key={variety.name} value={variety.name}>
                            {variety.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Results */}
      {comparisonData.length > 1 && (
        <div className="grid gap-6">
          {/* Yield Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Yield Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonData.map(({ crop, variety, yieldValue }) => (
                  <div key={`${crop!.name}-${variety?.name}`} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {crop!.name} - {variety?.name}
                      </span>
                      <Badge variant="outline">
                        {variety?.yield}
                      </Badge>
                    </div>
                    <Progress 
                      value={(yieldValue / maxYield) * 100} 
                      className="h-3"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resistance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Disease Resistance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonData.map(({ crop, variety, resistanceScore }) => (
                  <div key={`${crop!.name}-${variety?.name}`} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {crop!.name} - {variety?.name}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < resistanceScore 
                                ? 'fill-harvest-gold text-harvest-gold' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <Progress 
                      value={(resistanceScore / maxResistance) * 100} 
                      className="h-3"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration & Suitability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Duration & Regional Suitability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {comparisonData.map(({ crop, variety }) => (
                  <div key={`${crop!.name}-${variety?.name}`} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{crop!.name} - {variety?.name}</h4>
                      <Badge variant="secondary">{variety?.duration}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {variety?.states.slice(0, 5).map(state => (
                        <Badge key={state} variant="outline" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                      {variety && variety.states.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{variety.states.length - 5} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      {variety?.lateSowingSuitable && (
                        <Badge variant="outline" className="text-xs">Late Sowing Suitable</Badge>
                      )}
                      {variety?.irrigationResponsive && (
                        <Badge variant="outline" className="text-xs">Irrigation Responsive</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {comparisonData.map(({ crop }) => (
              <Button 
                key={crop!.name}
                onClick={() => onCropSelect && onCropSelect(crop!.name)}
                className="flex items-center gap-2"
              >
                Explore {crop!.name} Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedCrops.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Comparing Crops</h3>
            <p className="text-muted-foreground mb-4">
              Select at least 2 crops from the dropdown above to begin comparison
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComparisonTool;