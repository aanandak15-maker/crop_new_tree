import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wheat, Sprout, Search, Calendar, MapPin, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LocationBasedRecommendations from './LocationBasedRecommendations';

interface CropData {
  id: string;
  name: string;
  scientific_name: string | null;
  season: string[] | null;
  description: string | null;
  average_yield: string | null;
  market_price: string | null;
  varieties?: any[];
}

interface SimpleCropDashboardProps {
  onCropSelect: (cropName: string) => void;
}

const SimpleCropDashboard: React.FC<SimpleCropDashboardProps> = ({ onCropSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [crops, setCrops] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch crops from Supabase
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crops')
          .select(`
            *,
            varieties (*)
          `);
        
        if (error) {
          console.error('Error fetching crops:', error);
          setError('Failed to load crops');
          return;
        }
        
        setCrops(data || []);
      } catch (err) {
        console.error('Error fetching crops:', err);
        setError('Failed to load crops');
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const filteredCrops = crops.filter(crop => {
    // Search filtering
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (crop.scientific_name && crop.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Season filtering
    const matchesSeason = selectedSeason === 'all' || 
      (crop.season && crop.season.some(s => s.toLowerCase().includes(selectedSeason.toLowerCase())));
    
    // State filtering
    const matchesState = selectedState === 'all' || 
      (crop.varieties && crop.varieties.some(variety => 
        variety.suitable_states && variety.suitable_states.some((state: string) => 
          state.toLowerCase().includes(selectedState.toLowerCase())
        )
      ));
    
    return matchesSearch && matchesSeason && matchesState;
  });

  const getCropIcon = (cropName: string) => {
    switch (cropName.toLowerCase()) {
      case 'wheat': return <Wheat className="h-8 w-8 text-yellow-600" />;
      case 'anand': return <Sprout className="h-8 w-8 text-blue-500" />;
      default: return <Sprout className="h-8 w-8 text-yellow-600" />;
    }
  };

  const getCropStats = (crop: CropData) => {
    const varieties = crop.varieties?.length || 0;
    const states = crop.varieties ? 
      [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))].length : 0;
    
    // Try to extract yield from average_yield field
    let avgYield = 0;
    if (crop.average_yield) {
      const yieldMatch = crop.average_yield.match(/(\d+)/);
      avgYield = yieldMatch ? parseInt(yieldMatch[1]) : 0;
    }
    
    return { varieties, avgYield, states };
  };

  const renderCropCard = (crop: CropData) => {
    const stats = getCropStats(crop);

    return (
      <Card 
        key={crop.id}
        className="group cursor-pointer transition-all duration-200 ease-out hover:shadow-lg border border-gray-200 bg-white hover:border-yellow-400"
        onClick={() => onCropSelect(crop.name)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getCropIcon(crop.name)}
              <div>
                <CardTitle className="text-lg group-hover:text-yellow-600 transition-colors text-gray-800">
                  {crop.name}
                </CardTitle>
                <CardDescription className="text-sm italic text-gray-600">
                  {crop.scientific_name || 'Scientific name not available'}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {crop.season ? crop.season.join(', ') : 'Season not specified'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-yellow-600">{stats.varieties}</div>
              <div className="text-xs text-gray-600">Varieties</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-yellow-600">{stats.avgYield}</div>
              <div className="text-xs text-gray-600">Avg Yield</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-blue-600">{stats.states}</div>
              <div className="text-xs text-gray-600">States</div>
            </div>
          </div>

          {/* Description */}
          {crop.description && (
            <p className="text-sm text-gray-600 line-clamp-2 max-w-prose">
              {crop.description}
            </p>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onCropSelect(crop.name);
            }}
          >
            Explore Details
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-crop-green" />
          <p className="text-muted-foreground">Loading crops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leaf-light to-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="text-center mb-8">
            <h1 className="text-[clamp(24px,3vw,32px)] font-bold text-gray-800 mb-2">
              🌾 Crop Explorer Dashboard
            </h1>
            <p className="text-gray-600 text-lg max-w-prose mx-auto">
              Discover comprehensive crop information and recommendations
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Sprout className="h-6 w-6 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{crops.length}</div>
                    <div className="text-sm text-gray-600">Total Crops</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {crops.reduce((sum, crop) => sum + (crop.varieties?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Varieties</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {crops.reduce((sum, crop) => {
                        const states = crop.varieties ? 
                          [...new Set(crop.varieties.flatMap(v => v.suitable_states || []))] : [];
                        return sum + states.length;
                      }, 0)}
                    </div>
                    <div className="text-sm text-gray-600">States Covered</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search crops by name or scientific name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
              </div>
            </div>
            
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-full md:w-48 bg-white border border-gray-300">
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="kharif">Kharif</SelectItem>
                <SelectItem value="rabi">Rabi</SelectItem>
                <SelectItem value="zaid">Zaid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-48 bg-white border border-gray-300">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                <SelectItem value="bihar">Bihar</SelectItem>
                <SelectItem value="jharkhand">Jharkhand</SelectItem>
                <SelectItem value="west bengal">West Bengal</SelectItem>
                <SelectItem value="odisha">Odisha</SelectItem>
                <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="madhya pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
               {/* Location-Based Recommendations */}
         <LocationBasedRecommendations onCropSelect={onCropSelect} />

        {/* Crop Grid */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h2 className="text-[clamp(18px,2vw,24px)] font-bold text-gray-800">
              Available Crops ({filteredCrops.length})
            </h2>
          </div>

          {filteredCrops.length === 0 ? (
            <Card className="text-center py-12 bg-white border border-gray-200">
              <CardContent>
                <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">No crops found</h3>
                <p className="text-gray-600 max-w-prose mx-auto">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map(renderCropCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCropDashboard;
