import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { getCropByName } from '@/data/cropData';
import { 
  ArrowLeft, Info, Wheat, Leaf, Shield, Apple, TrendingUp, 
  Sprout, Bug, MapPin, Clock, Loader2, Home, Sprout as Seedling, BarChart, DollarSign, AlertTriangle
} from 'lucide-react';

interface CropVariety {
  id: string;
  name: string;
  duration: string | null;
  yield_potential: string | null;
  suitable_states: string[] | null;
  disease_resistance: string[] | null;
  special_features: string[] | null;
  grain_quality: string | null;
  description: string | null;
}

interface CropData {
  id: string;
  name: string;
  scientific_name: string | null;
  family: string | null;
  season: string[] | null;
  description: string | null;
  origin?: string;
  climate_type: string[] | null;
  temperature_range: string | null;
  rainfall_requirement: string | null;
  humidity_range: string | null;
  soil_type: string[] | null;
  soil_ph: string | null;
  drainage_requirement: string | null;
  land_preparation: string[] | null;
  sowing_time: string | null;
  seed_rate: string | null;
  row_spacing: string | null;
  fertilizer_requirement: string[] | null;
  irrigation_schedule: string[] | null;
  harvesting_info: string[] | null;
  pest_list: string[] | null;
  disease_list: string[] | null;
  average_yield: string | null;
  market_price: string | null;
  cost_of_cultivation: string | null;
  nutritional_info: string | null;
  innovations: string[] | null;
  sustainability_practices: string[] | null;
  water_requirement: string | null;
  varieties?: CropVariety[];
}

interface SimpleCropProfileProps {
  cropName: string;
  onBack: () => void;
}

const SimpleCropProfile: React.FC<SimpleCropProfileProps> = ({ cropName, onBack }) => {
  const [crop, setCrop] = useState<CropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setLoading(true);
        // Use maybeSingle to avoid 406 when no row exists
        const { data, error } = await supabase
          .from('crops')
          .select(`
            *,
            varieties (*)
          `)
          .eq('name', cropName)
          .maybeSingle();

        if (error) {
          console.error('Error fetching crop:', error);
        }

        if (data) {
          setCrop(data as unknown as CropData);
          return;
        }

        // Fallback to static dataset if DB has no record
        const staticCrop = getCropByName(cropName);
        if (staticCrop) {
          const mapped: CropData = {
            id: staticCrop.id,
            name: staticCrop.name,
            scientific_name: staticCrop.scientificName || null,
            family: staticCrop.family || null,
            season: staticCrop.season || null,
            description: staticCrop.description || null,
            origin: staticCrop.origin,
            climate_type: staticCrop.climate?.zone ? [staticCrop.climate.zone] : null,
            temperature_range: staticCrop.climate?.temperature || null,
            rainfall_requirement: staticCrop.climate?.rainfall || null,
            humidity_range: staticCrop.climate?.humidity || null,
            soil_type: staticCrop.soil?.type || null,
            soil_ph: staticCrop.soil?.ph || null,
            drainage_requirement: staticCrop.soil?.drainage || null,
            land_preparation: staticCrop.cultivation?.landPreparation || null,
            sowing_time: Array.isArray(staticCrop.cultivation?.sowing)
              ? staticCrop.cultivation.sowing.join('; ')
              : null,
            seed_rate: null,
            row_spacing: staticCrop.cultivation?.spacing || null,
            fertilizer_requirement: staticCrop.cultivation?.fertilizers || null,
            irrigation_schedule: staticCrop.cultivation?.irrigation || null,
            harvesting_info: staticCrop.cultivation?.harvesting || null,
            pest_list: staticCrop.pests || null,
            disease_list: staticCrop.diseases || null,
            average_yield: staticCrop.economics?.averageYield || null,
            market_price: staticCrop.economics?.marketPrice || null,
            cost_of_cultivation: staticCrop.economics?.costOfCultivation || null,
            nutritional_info: staticCrop.nutrition
              ? `Calories: ${staticCrop.nutrition.calories}, Protein: ${staticCrop.nutrition.protein}, Carbs: ${staticCrop.nutrition.carbohydrates}`
              : null,
            innovations: staticCrop.innovations || null,
            sustainability_practices: staticCrop.sustainability || null,
            water_requirement: staticCrop.climate?.rainfall || null,
            varieties: (staticCrop.varieties || []).map(v => ({
              id: v.id,
              name: v.name,
              duration: v.duration || null,
              yield_potential: v.yield || null,
              suitable_states: v.states || null,
              disease_resistance: v.resistance || null,
              special_features: v.characteristics || null,
              grain_quality: v.grainQuality || null,
              description: null,
            })),
          };

          setCrop(mapped);
          setError(null);
          return;
        }

        setError(`Could not find crop: ${cropName}`);
      } catch (err) {
        console.error('Error fetching crop:', err);
        setError('Failed to load crop data');
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [cropName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-crop-green" />
          <p className="text-muted-foreground">Loading crop data...</p>
        </div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Crop Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              {error || `Could not find crop: ${cropName}`}
            </p>
            <Button onClick={onBack}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStatCard = (title: string, value: string | number, icon: any, color: string) => (
    <Card className="hover:shadow-elegant transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>
          {value}
        </div>
        <p className="text-sm text-muted-foreground">Available {title.toLowerCase()}</p>
      </CardContent>
    </Card>
  );

  const getCropStats = () => {
    const varieties = crop.varieties?.length || 0;
    const states = crop.varieties ? 
      [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length : 0;
    
    // Try to extract yield from average_yield field
    let avgYield = 0;
    if (crop.average_yield) {
      const yieldMatch = crop.average_yield.match(/(\d+)/);
      avgYield = yieldMatch ? parseInt(yieldMatch[1]) : 0;
    }
    
    // Try to extract duration from varieties
    let avgDuration = 0;
    if (crop.varieties && crop.varieties.length > 0) {
      const durations = crop.varieties
        .map(v => v.duration)
        .filter(d => d)
        .map(d => {
          const match = d?.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
      avgDuration = durations.length > 0 ? 
        Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length) : 0;
    }
    
    return { varieties, avgYield, states, avgDuration };
  };

  const stats = getCropStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-gray-800 hover:text-yellow-600 hover:bg-yellow-50">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-[clamp(24px,3vw,32px)] font-bold text-gray-800">
                {crop.name}
              </h1>
              <p className="text-gray-600 italic">
                {crop.scientific_name || 'Scientific name not available'}
              </p>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {crop.season ? crop.season.join(', ') : 'Season not specified'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-white border border-gray-200 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="varieties" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Sprout className="h-4 w-4" />
                <span className="hidden sm:inline">Varieties</span>
              </TabsTrigger>
              <TabsTrigger value="cultivation" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Cultivation</span>
              </TabsTrigger>
              <TabsTrigger value="management" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Management</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Apple className="h-4 w-4" />
                <span className="hidden sm:inline">Nutrition</span>
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Market</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderStatCard(
                "Varieties", 
                stats.varieties, 
                <Sprout className="h-5 w-5 text-yellow-600" />, 
                "text-yellow-600"
              )}
              {renderStatCard(
                "States", 
                stats.states, 
                <MapPin className="h-5 w-5 text-blue-600" />, 
                "text-blue-600"
              )}
              {renderStatCard(
                "Avg Yield", 
                stats.avgYield, 
                <TrendingUp className="h-5 w-5 text-yellow-600" />, 
                "text-yellow-600"
              )}
              {renderStatCard(
                "Duration", 
                stats.avgDuration, 
                <Clock className="h-5 w-5 text-gray-600" />, 
                "text-gray-600"
              )}
            </div>

            {/* Quick Facts */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Botanical Classification</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Family:</span> {crop.family || 'Not specified'}</p>
                    <p><span className="font-medium">Scientific Name:</span> {crop.scientific_name || 'Not specified'}</p>
                    <p><span className="font-medium">Season:</span> {crop.season ? crop.season.join(', ') : 'Not specified'}</p>
                    <p><span className="font-medium">Origin:</span> {crop.origin || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Major Growing States</h4>
                  <div className="flex flex-wrap gap-1">
                    {crop.varieties ? 
                      [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].slice(0, 8).map((state) => (
                        <Badge key={state} variant="outline" className="text-xs border-gray-300 text-gray-700">
                          {state}
                        </Badge>
                      )) : []
                    }
                    {crop.varieties && [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length > 8 && (
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        +{[...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Climate & Soil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Info className="h-5 w-5 text-blue-500" />
                    Climate Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Temperature:</span> {crop.temperature_range || 'Not specified'}</p>
                  <p><span className="font-medium">Rainfall:</span> {crop.rainfall_requirement || 'Not specified'}</p>
                  <p><span className="font-medium">Humidity:</span> {crop.humidity_range || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Soil Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Soil Types:</span> {crop.soil_type ? crop.soil_type.join(', ') : 'Not specified'}</p>
                  <p><span className="font-medium">pH Range:</span> {crop.soil_ph || 'Not specified'}</p>
                  <p><span className="font-medium">Drainage:</span> {crop.drainage_requirement || 'Not specified'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Varieties Tab */}
          <TabsContent value="varieties" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold text-gray-800 mb-2">
                🌟 Crop Varieties - Our Specialty
              </h2>
              <p className="text-gray-600 max-w-prose mx-auto">
                Detailed variety profiles with state-wise recommendations
              </p>
            </div>

            {crop.varieties && crop.varieties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {crop.varieties.map((variety, index) => (
                  <Card key={variety.id} className="border border-gray-200 hover:border-yellow-400 transition-all duration-200 ease-out cursor-pointer bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-gray-800">
                        <span>{variety.name}</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">#{index + 1}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-800">Yield:</span>
                          <span className="ml-2 text-gray-600">{variety.yield_potential || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Duration:</span>
                          <span className="ml-2 text-gray-600">{variety.duration || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-sm text-gray-800">Suitable States:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {variety.suitable_states ? variety.suitable_states.slice(0, 6).map((state) => (
                            <Badge key={state} variant="outline" className="text-xs border-gray-300 text-gray-700">{state}</Badge>
                          )) : []}
                          {variety.suitable_states && variety.suitable_states.length > 6 && (
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                              +{variety.suitable_states.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {variety.description && (
                        <p className="text-sm text-gray-600">
                          {variety.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 bg-white border border-gray-200">
                <CardContent>
                  <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">No varieties available</h3>
                  <p className="text-gray-600 max-w-prose mx-auto">
                    Variety information has not been added for this crop yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cultivation Tab */}
          <TabsContent value="cultivation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {crop.land_preparation && crop.land_preparation.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Sprout className="h-5 w-5 text-green-500" />
                      Land Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {crop.land_preparation.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {crop.sowing_time && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Sowing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Sowing Time:</span> {crop.sowing_time}</p>
                    <p><span className="font-medium">Seed Rate:</span> {crop.seed_rate || 'Not specified'}</p>
                    <p><span className="font-medium">Row Spacing:</span> {crop.row_spacing || 'Not specified'}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {crop.fertilizer_requirement && crop.fertilizer_requirement.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Fertilizer Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      {crop.fertilizer_requirement.map((fertilizer, index) => (
                        <li key={index}>{fertilizer}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {crop.pest_list && crop.pest_list.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Bug className="h-5 w-5 text-red-500" />
                      Pest Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {crop.pest_list.map((pest, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{pest}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Apple className="h-5 w-5 text-green-500" />
                    Nutritional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {crop.nutritional_info || 'Nutritional information not available'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Info className="h-5 w-5 text-purple-500" />
                    Health Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Detailed health benefits information will be available soon
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Economics & Market
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Average Yield:</span> {crop.average_yield || 'Not specified'}</p>
                  <p><span className="font-medium">Market Price:</span> {crop.market_price || 'Not specified'}</p>
                  <p><span className="font-medium">Cost of Cultivation:</span> {crop.cost_of_cultivation || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Innovations:</span> {crop.innovations ? crop.innovations.join(', ') : 'Not specified'}</p>
                  <p><span className="font-medium">Sustainability:</span> {crop.sustainability_practices ? crop.sustainability_practices.join(', ') : 'Not specified'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200">
        <nav className="flex justify-around px-4 py-2">
          <a className="flex flex-col items-center gap-1 text-yellow-600" href="#">
            <div className="h-8 flex items-center justify-center">
              <Home className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium tracking-wide">Overview</p>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors duration-200" href="#">
            <div className="h-8 flex items-center justify-center">
              <Seedling className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium tracking-wide">Cultivation</p>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors duration-200" href="#">
            <div className="h-8 flex items-center justify-center">
              <BarChart className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium tracking-wide">Growth</p>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors duration-200" href="#">
            <div className="h-8 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium tracking-wide">Economics</p>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-600 hover:text-yellow-600 transition-colors duration-200" href="#">
            <div className="h-8 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium tracking-wide">Challenges</p>
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default SimpleCropProfile;
