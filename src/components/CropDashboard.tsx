import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Wheat, 
  Sprout, 
  Search, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  Thermometer,
  Droplets,
  Sun,
  Zap,
  Award,
  Leaf,
  BarChart3,
  Users,
  Globe,
  Shield
} from 'lucide-react';
import { getAllCropNames, getCropByName } from '@/data/cropData';
import { supabase } from '@/integrations/supabase/client';


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
  average_yield?: string;
  // New fields from admin form
  field_name?: string;
  origin?: string;
  climate_zone?: string;
  growth_habit?: string;
  life_span?: string;
  plant_type?: string;
  root_system?: string;
  leaf?: string;
  flowering_season?: string;
  inflorescence_type?: string;
  fruit_type?: string;
  fruit_development?: string;
  unique_morphology?: string;
  edible_part?: string;
  chromosome_number?: string;
  breeding_methods?: string;
  biotech_advances?: string;
  hybrid_varieties?: string;
  patents?: string;
  research_institutes?: string;
  pollination?: string;
  propagation_type?: string;
  planting_material?: string;
  germination_percent?: string;
  rootstock_compatibility?: string;
  nursery_practices?: string;
  training_system?: string;
  spacing?: string;
  planting_season?: string;
  npk_n?: string;
  npk_p?: string;
  npk_k?: string;
  micronutrient_needs?: string;
  biofertilizer_usage?: string;
  application_schedule_method?: string;
  application_schedule_stages?: string;
  application_schedule_frequency?: string;
  water_quality?: string;
  optimum_temp?: string;
  tolerable_temp?: string;
  altitude?: string;
  soil_texture?: string;
  light_requirement?: string;
  common_weeds?: string;
  weed_season?: string;
  weed_control_method?: string;
  critical_period_weed?: string;
  pest_name?: string;
  pest_symptoms?: string;
  pest_life_cycle?: string;
  pest_etl?: string;
  pest_management?: string;
  pest_biocontrol?: string;
  disease_name?: string;
  disease_causal_agent?: string;
  disease_symptoms?: string;
  disease_life_cycle?: string;
  disease_management?: string;
  disease_biocontrol?: string;
  disorder_name?: string;
  disorder_cause?: string;
  disorder_symptoms?: string;
  disorder_impact?: string;
  disorder_control?: string;
  nematode_name?: string;
  nematode_symptoms?: string;
  nematode_life_cycle?: string;
  nematode_etl?: string;
  nematode_management?: string;
  nematode_biocontrol?: string;
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  minerals?: string;
  bioactive_compounds?: string;
  health_benefits?: string;
  variety_name?: string;
  yield?: string;
  variety_features?: string;
  variety_suitability?: string;
  market_demand?: string;
  harvest_time?: string;
  maturity_indicators?: string;
  harvesting_tools?: string;
  post_harvest_losses?: string;
  storage_conditions?: string;
  shelf_life?: string;
  processed_products?: string;
  packaging_types?: string;
  cold_chain?: string;
  ripening_characteristics?: string;
  pre_cooling?: string;
  market_trends?: string;
  export_potential?: string;
  export_destinations?: string;
  value_chain_players?: string;
  certifications?: string;
  subsidies?: string;
  schemes?: string;
  support_agencies?: string;
  ai_ml_iot?: string;
  smart_farming?: string;
  sustainability_potential?: string;
  waste_to_wealth?: string;
  climate_resilience?: string;
  carbon_footprint?: string;
  religious_use?: string;
  traditional_uses?: string;
  gi_status?: string;
  fun_fact?: string;
  key_takeaways?: string;
  swot_strengths?: string;
  swot_weaknesses?: string;
  swot_opportunities?: string;
  swot_threats?: string;
}

const CropDashboard: React.FC<CropDashboardProps> = ({ onCropSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dbCrops, setDbCrops] = useState<DbCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
    const icons = {
      wheat: <Wheat className="h-8 w-8 text-harvest-gold" />,
      rice: <Sprout className="h-8 w-8 text-crop-green" />,
      corn: <Sprout className="h-8 w-8 text-harvest-gold" />,
      potato: <Sprout className="h-8 w-8 text-earth-brown" />,
      tomato: <Sprout className="h-8 w-8 text-red-500" />,
      cotton: <Sprout className="h-8 w-8 text-white" />,
      sugarcane: <Sprout className="h-8 w-8 text-green-600" />,
      default: <Sprout className="h-8 w-8 text-crop-green" />
    };
    
    const cropKey = cropName.toLowerCase();
    return icons[cropKey as keyof typeof icons] || icons.default;
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
      // Extract yield from database crop
      const yieldStr = dbCrop.average_yield?.replace(/[^\d.-]/g, '') || dbCrop.yield?.replace(/[^\d.-]/g, '') || '0';
      const yieldNum = parseFloat(yieldStr) || 0;
      
      // Count unique features for variety-like info
      const uniqueFeatures = [
        dbCrop.variety_name,
        dbCrop.variety_features,
        dbCrop.variety_suitability
      ].filter(Boolean).length;
      
      // Count management practices
      const managementPractices = [
        dbCrop.pest_name,
        dbCrop.disease_name,
        dbCrop.nematode_name,
        dbCrop.disorder_name
      ].filter(Boolean).length;
      
      return {
        varieties: uniqueFeatures || 1, // At least 1 if it's a database crop
        avgYield: Math.round(yieldNum),
        states: dbCrop.climate_zone ? 1 : (dbCrop.soil_type?.length || 0)
      };
    }
    
    return { varieties: 0, avgYield: 0, states: 0 };
  };

  const getSeasonIcon = (season: string) => {
    switch (season.toLowerCase()) {
      case 'rabi': return <Sun className="h-4 w-4 text-harvest-gold" />;
      case 'kharif': return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'zaid': return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCropPriority = (cropName: string) => {
    // Priority based on importance and data richness
    const priorityCrops = ['wheat', 'rice', 'corn', 'potato', 'tomato'];
    return priorityCrops.includes(cropName.toLowerCase()) ? 'high' : 'normal';
  };

  const renderCropCard = (cropName: string, index: number) => {
            const staticCrop = getCropByName(cropName);
            const dbCrop = dbCrops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
            const stats = getCropStats(cropName);
    const priority = getCropPriority(cropName);
            
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
        className={`
          group cursor-pointer transition-all duration-500 hover:shadow-elegant hover:scale-105 
          border-2 hover:border-crop-green bg-gradient-to-br from-card to-leaf-light/10
          relative overflow-hidden animate-grow hover:animate-float
          ${priority === 'high' ? 'ring-2 ring-harvest-gold/20' : ''}
          ${viewMode === 'list' ? 'flex flex-row' : ''}
        `}
        style={{ 
          animationDelay: `${index * 100}ms`,
          animationDuration: '0.6s'
        }}
                onClick={() => onCropSelect(cropName)}
              >
        {/* Priority Badge */}
        {priority === 'high' && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="bg-harvest-gold/20 text-harvest-gold border-harvest-gold/30">
              <Star className="h-3 w-3 mr-1" />
              Priority
            </Badge>
          </div>
        )}

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-crop-green rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-harvest-gold rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        <CardHeader className={`pb-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
              <div className="relative">
                      {getCropIcon(cropName)}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-crop-green rounded-full border-2 border-white"></div>
              </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-crop-green transition-colors">
                          {cropData.name}
                        </CardTitle>
                        <CardDescription className="text-sm italic">
                          {cropData.scientificName}
                        </CardDescription>
                      </div>
                    </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                {cropData.season.map((season, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    {getSeasonIcon(season)}
                    <span className="text-xs font-medium">{season}</span>
                  </div>
                ))}
              </div>
            </div>
                  </div>
                </CardHeader>

        <CardContent className={`space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-crop-green/10 to-crop-green/5 rounded-lg p-3 border border-crop-green/20">
              <div className="flex items-center justify-center mb-1">
                <BarChart3 className="h-4 w-4 text-crop-green mr-1" />
                <div className="text-lg font-bold text-crop-green">{stats.varieties}</div>
              </div>
              <div className="text-xs text-muted-foreground text-center">Varieties</div>
            </div>
            <div className="bg-gradient-to-br from-harvest-gold/10 to-harvest-gold/5 rounded-lg p-3 border border-harvest-gold/20">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-harvest-gold mr-1" />
                <div className="text-lg font-bold text-harvest-gold">{stats.avgYield}</div>
              </div>
              <div className="text-xs text-muted-foreground text-center">Avg Yield</div>
                    </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center justify-center mb-1">
                <Globe className="h-4 w-4 text-primary mr-1" />
                <div className="text-lg font-bold text-primary">{stats.states}</div>
                    </div>
              <div className="text-xs text-muted-foreground text-center">States</div>
                    </div>
                  </div>

          {/* Enhanced Varieties/Details */}
                  <div>
            <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              {staticCrop ? (
                <>
                  <Users className="h-4 w-4 text-crop-green" />
                  Top Varieties
                </>
              ) : (
                <>
                  <Leaf className="h-4 w-4 text-crop-green" />
                  Key Details
                </>
              )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {staticCrop ? (
                        <>
                          {staticCrop.varieties.slice(0, 3).map((variety) => (
                    <Badge key={variety.name} variant="outline" className="text-xs bg-crop-green/5 border-crop-green/20 text-crop-green">
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
                    <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                      <Clock className="h-3 w-3 mr-1" />
                              {dbCrop.growth_duration}
                            </Badge>
                          )}
                          {dbCrop?.plant_type && (
                    <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                      <Sprout className="h-3 w-3 mr-1" />
                              {dbCrop.plant_type}
                            </Badge>
                          )}
                  {dbCrop?.optimum_temp && (
                    <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
                      <Thermometer className="h-3 w-3 mr-1" />
                      {dbCrop.optimum_temp}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>

          {/* Special Features for Database Crops */}
                  {dbCrop && (
            <div className="space-y-3">
                      {dbCrop.description && (
                <div className="text-xs text-muted-foreground line-clamp-2 bg-muted/30 rounded p-2">
                          {dbCrop.description}
                        </div>
                      )}
                      
              {/* Enhanced Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                        {dbCrop.calories && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded p-2 border border-red-200">
                    <div className="font-medium text-red-700 text-xs">Calories</div>
                    <div className="text-red-600 font-bold">{dbCrop.calories}</div>
                          </div>
                        )}
                        {dbCrop.protein && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded p-2 border border-blue-200">
                    <div className="font-medium text-blue-700 text-xs">Protein</div>
                    <div className="text-blue-600 font-bold">{dbCrop.protein}</div>
                          </div>
                        )}
                      </div>

              {/* Special Badges */}
                        <div className="flex flex-wrap gap-1">
                          {dbCrop.gi_status && (
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Award className="h-3 w-3 mr-1" />
                              GI Status
                            </Badge>
                          )}
                          {dbCrop.patents && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                    <Shield className="h-3 w-3 mr-1" />
                              Patented
                            </Badge>
                          )}
                          {dbCrop.ai_ml_iot && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                    <Shield className="h-3 w-3 mr-1" />
                              Smart Tech
                            </Badge>
                          )}
                        </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
            className="w-full bg-gradient-to-r from-crop-green to-crop-green/80 hover:from-crop-green/90 hover:to-crop-green/70 text-white shadow-elegant transition-all duration-300 hover:shadow-glow group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCropSelect(cropName);
                    }}
                  >
            <TrendingUp className="mr-2 h-4 w-4" />
            Explore Details
                  </Button>
                </CardContent>
              </Card>
            );
  };

  const renderSkeletonCard = (index: number) => (
    <Card key={index} className="animate-pulse bg-gradient-to-br from-card to-leaf-light/10 border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full bg-gradient-to-r from-crop-green/20 to-harvest-gold/20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-gradient-to-r from-crop-green/20 to-harvest-gold/20" />
            <Skeleton className="h-3 w-24 bg-gradient-to-r from-muted to-muted/50" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton 
              key={i} 
              className="h-16 rounded-lg bg-gradient-to-br from-crop-green/10 to-harvest-gold/10" 
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <Skeleton className="h-4 w-full bg-gradient-to-r from-muted to-muted/50" />
        <Skeleton className="h-10 w-full bg-gradient-to-r from-crop-green/20 to-crop-green/10" />
      </CardContent>
    </Card>
  );


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-light via-background to-leaf-light/30">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-crop-green via-harvest-gold to-crop-green bg-clip-text text-transparent">
              CropTree Explorer
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-harvest-gold rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-crop-green rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover comprehensive crop profiles with scientific insights, variety-specific recommendations, and AI-powered farming guidance
          </p>
          

        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search crops by name, scientific name, or characteristics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchTerm('');
                        e.currentTarget.blur();
                      }
                    }}
                    className={`pl-12 h-14 text-lg border-2 bg-background/80 backdrop-blur-sm transition-all duration-300 ${
                      isSearchFocused 
                        ? 'border-crop-green shadow-lg shadow-crop-green/20 scale-105' 
                        : 'border-border hover:border-crop-green/50'
                    }`}
                    aria-label="Search crops"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden w-full h-14 bg-background/80 backdrop-blur-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>

                {/* Desktop Filters */}
                <div className={`flex gap-3 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="w-full sm:w-40 h-14 bg-background/80 backdrop-blur-sm">
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
                    <SelectTrigger className="w-full sm:w-40 h-14 bg-background/80 backdrop-blur-sm">
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

                  <div className="flex border rounded-lg bg-background/80 backdrop-blur-sm">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-14 px-3"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-14 px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        {(searchTerm || selectedSeason !== 'all' || selectedState !== 'all') && (
          <div className="mb-6 p-4 bg-gradient-to-r from-crop-green/10 to-harvest-gold/10 rounded-xl border border-crop-green/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-bold text-crop-green">{filteredCrops.length}</span> of <span className="font-bold">{allCrops.length}</span> crops
                </div>
                {(searchTerm || selectedSeason !== 'all' || selectedState !== 'all') && (
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge variant="secondary" className="bg-crop-green/20 text-crop-green border-crop-green/30">
                        Search: "{searchTerm}"
                      </Badge>
                    )}
                    {selectedSeason !== 'all' && (
                      <Badge variant="secondary" className="bg-harvest-gold/20 text-harvest-gold border-harvest-gold/30">
                        Season: {selectedSeason}
                      </Badge>
                    )}
                    {selectedState !== 'all' && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        State: {selectedState}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSeason('all');
                  setSelectedState('all');
                }}
                className="text-xs"
              >
                <Filter className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Tabs for Different Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-crop-green data-[state=active]:text-white">
              All Crops ({filteredCrops.length})
            </TabsTrigger>
            <TabsTrigger value="priority" className="data-[state=active]:bg-harvest-gold data-[state=active]:text-white">
              Priority Crops
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Recently Added
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              Most Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>



        {/* Crop Cards Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {Array.from({ length: 6 }).map((_, index) => renderSkeletonCard(index))}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCrops.map((cropName, index) => renderCropCard(cropName, index))}
          </div>
        )}



        {/* Enhanced No Results */}
        {filteredCrops.length === 0 && searchTerm && !loading && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <Sprout className="h-20 w-20 text-muted-foreground mx-auto mb-4 animate-float" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-crop-green/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-harvest-gold/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">No crops found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or browse our complete collection
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSeason('all');
                setSelectedState('all');
              }}
              className="bg-gradient-to-r from-crop-green to-crop-green/80 hover:from-crop-green/90 hover:to-crop-green/70"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-crop-green to-crop-green/80 hover:from-crop-green/90 hover:to-crop-green/70 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CropDashboard;