import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wheat, Sprout, Search, Calendar, MapPin, TrendingUp, Lightbulb } from 'lucide-react';
import { getAllCropNames, getCropByName } from '@/data/cropData';
import { supabase } from '@/integrations/supabase/client';
import LocationBasedRecommendations from './LocationBasedRecommendations';
import EnhancedCropSelector from './EnhancedCropSelector';

interface CropDashboardProps {
  onCropSelect: (cropName: string) => void;
}

interface DbCrop {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  season: string[];
  climate_type: string[];
  soil_type: string[];
  water_requirement: string;
  growth_duration: string;
}

const CropDashboard: React.FC<CropDashboardProps> = ({ onCropSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [dbCrops, setDbCrops] = useState<DbCrop[]>([]);
  const [loading, setLoading] = useState(true);

  const staticCrops = getAllCropNames();

  useEffect(() => {
    fetchDbCrops();
  }, []);

  const fetchDbCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDbCrops(data || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine static and database crops
  const allCrops = [...staticCrops, ...dbCrops.map(crop => crop.name)];
  
  const filteredCrops = allCrops.filter(cropName => {
    const staticCrop = getCropByName(cropName);
    const dbCrop = dbCrops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
    
    if (!staticCrop && !dbCrop) return false;
    
    // Handle search for both static and db crops
    const scientificName = staticCrop?.scientificName || dbCrop?.scientific_name || '';
    const matchesSearch = cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle season filtering
    const seasons = staticCrop?.season || dbCrop?.season || [];
    const matchesSeason = selectedSeason === 'all' || 
      seasons.some(s => s.toLowerCase().includes(selectedSeason.toLowerCase()));
    
    // Handle state filtering (only for static crops for now)
    const matchesState = selectedState === 'all' || !staticCrop ||
                        staticCrop.varieties.some(variety => 
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
    const staticCrop = getCropByName(cropName);
    const dbCrop = dbCrops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
    
    if (staticCrop) {
      const avgYieldNum = staticCrop.varieties.reduce((sum, v) => {
        const yieldStr = v.yield.replace(/[^\d.-]/g, '');
        const yieldRange = yieldStr.split('-');
        const avgYield = yieldRange.length > 1 ? 
          (parseFloat(yieldRange[0]) + parseFloat(yieldRange[1])) / 2 : 
          parseFloat(yieldRange[0]);
        return sum + (isNaN(avgYield) ? 0 : avgYield);
      }, 0) / staticCrop.varieties.length;
      
      return {
        varieties: staticCrop.varieties.length,
        avgYield: Math.round(avgYieldNum),
        states: [...new Set(staticCrop.varieties.flatMap(v => v.states))].length
      };
    } else if (dbCrop) {
      // For database crops, show basic info
      return {
        varieties: 0, // TODO: Add varieties support for db crops
        avgYield: 0,
        states: 0
      };
    }
    
    return { varieties: 0, avgYield: 0, states: 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            CropTree Explorer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore detailed crop profiles with variety-specific insights for students and farmers
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-crop-green">{allCrops.length}</div>
              <div className="text-sm text-muted-foreground">Crop Profiles</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-harvest-gold">50+</div>
              <div className="text-sm text-muted-foreground">Varieties</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">States Covered</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-secondary">100%</div>
              <div className="text-sm text-muted-foreground">ICAR Verified</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search crops by name or scientific name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 focus:border-crop-green"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-40">
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
                <SelectTrigger className="w-40">
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
        </div>

        {/* Crop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((cropName) => {
            const staticCrop = getCropByName(cropName);
            const dbCrop = dbCrops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
            const stats = getCropStats(cropName);
            
            if (!staticCrop && !dbCrop) return null;
            
            // Use static crop data if available, otherwise use db crop
            const cropData = staticCrop || {
              name: dbCrop!.name,
              scientificName: dbCrop!.scientific_name || '',
              season: dbCrop!.season || [],
              varieties: []
            };

            return (
              <Card 
                key={cropName}
                className="group cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-105 border-2 hover:border-crop-green bg-gradient-to-br from-card to-leaf-light/10"
                onClick={() => onCropSelect(cropName)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
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
                    <Badge variant="secondary" className="bg-leaf-light text-crop-green">
                      {cropData.season.join(', ')}
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
                    <div className="text-sm font-medium text-foreground mb-2">
                      {staticCrop ? "Top Varieties:" : "Details:"}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {staticCrop ? (
                        <>
                          {staticCrop.varieties.slice(0, 3).map((variety) => (
                            <Badge key={variety.name} variant="outline" className="text-xs">
                              {variety.name}
                            </Badge>
                          ))}
                          {staticCrop.varieties.length > 3 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              +{staticCrop.varieties.length - 3} more
                            </Badge>
                          )}
                        </>
                      ) : (
                        <>
                          {dbCrop?.growth_duration && (
                            <Badge variant="outline" className="text-xs">
                              {dbCrop.growth_duration}
                            </Badge>
                          )}
                          {dbCrop?.water_requirement && (
                            <Badge variant="outline" className="text-xs">
                              {dbCrop.water_requirement} water
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Climate Info */}
                  <div className="text-sm text-muted-foreground">
                    {staticCrop ? (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Temperature:</span>
                          <span>{staticCrop.climate.temperature}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Rainfall:</span>
                          <span>{staticCrop.climate.rainfall}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Climate:</span>
                          <span>{dbCrop?.climate_type?.join(', ') || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Soil:</span>
                          <span>{dbCrop?.soil_type?.join(', ') || 'Not specified'}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-crop-green to-crop-green/80 hover:from-crop-green/90 hover:to-crop-green/70 text-white shadow-elegant transition-all duration-300 hover:shadow-glow"
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

        {/* Enhanced Features Section */}
        <div className="mt-12 space-y-8">
          {/* Location-Based Recommendations */}
          <LocationBasedRecommendations onCropSelect={onCropSelect} />
          
          {/* Enhanced Crop Selector */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-harvest-gold" />
              Smart Crop Search
            </h2>
            <EnhancedCropSelector 
              onCropSelect={onCropSelect} 
              selectedCrop={filteredCrops.find(name => name === searchTerm) || null}
            />
          </div>
        </div>

        {/* No Results */}
        {filteredCrops.length === 0 && searchTerm && (
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