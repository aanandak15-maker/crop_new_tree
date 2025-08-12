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
  Shield,
  GitCompare,
  PieChart,
  Activity,
  Target,
  Heart,
  Brain,
  Zap as ZapIcon,
  RefreshCw,
  Settings,
  BookOpen,
  Lightbulb,
  Home,
  Sprout as Seedling,
  BarChart,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { getAllCropNames, getCropByName } from '@/data/cropData';
import { supabase } from '@/integrations/supabase/client';
import EnhancedCropCard from './EnhancedCropCard';
import AdvancedFilters from './AdvancedFilters';
import DataVisualization from './DataVisualization';
import CropComparison from './CropComparison';
import DashboardInsights from './DashboardInsights';

interface EnhancedCropDashboardProps {
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
  // Additional fields from admin
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

const EnhancedCropDashboard: React.FC<EnhancedCropDashboardProps> = ({ onCropSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dbCrops, setDbCrops] = useState<DbCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<any>({});

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

  // For now, let's use only static crops to ensure wheat shows up
  const filteredCrops = staticCrops.filter(cropName => {
    const staticCrop = getCropByName(cropName);
    if (!staticCrop) return false;
    
    // Handle search
    const matchesSearch = cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staticCrop.scientificName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle season filtering
    const matchesSeason = selectedSeason === 'all' || 
      staticCrop.season?.some(s => s.toLowerCase().includes(selectedSeason.toLowerCase()));
    
    // Handle state filtering
    const matchesState = selectedState === 'all' || 
      staticCrop.varieties?.some(variety => 
        variety.states?.some(state => 
          state.toLowerCase().includes(selectedState.toLowerCase())
        )
      );
    
    return matchesSearch && matchesSeason && matchesState;
  });

  // Apply advanced filters
  const applyAdvancedFilters = (crops: any[]) => {
    if (Object.keys(advancedFilters).length === 0) return crops;
    
    return crops.filter(crop => {
      // Basic filters
      if (advancedFilters.name && !crop.name?.toLowerCase().includes(advancedFilters.name.toLowerCase())) {
        return false;
      }
      
      if (advancedFilters.scientific_name && !crop.scientific_name?.toLowerCase().includes(advancedFilters.scientific_name.toLowerCase())) {
        return false;
      }
      
      // Season filters
      if (advancedFilters.season && advancedFilters.season.length > 0) {
        const cropSeasons = crop.season || [];
        if (!advancedFilters.season.some((s: string) => cropSeasons.includes(s))) {
          return false;
        }
      }
      
      // Climate filters
      if (advancedFilters.climate_type && advancedFilters.climate_type.length > 0) {
        const cropClimate = crop.climate_type || [];
        if (!advancedFilters.climate_type.some((c: string) => cropClimate.includes(c))) {
          return false;
        }
      }
      
      // Water requirement
      if (advancedFilters.water_requirement && crop.water_requirement !== advancedFilters.water_requirement) {
        return false;
      }
      
      // Growth duration
      if (advancedFilters.growth_duration && crop.growth_duration !== advancedFilters.growth_duration) {
        return false;
      }
      
      // Plant type
      if (advancedFilters.plant_type && advancedFilters.plant_type.length > 0) {
        if (!advancedFilters.plant_type.includes(crop.plant_type)) {
          return false;
        }
      }
      
      // Special features
      if (advancedFilters.gi_status && !crop.gi_status) return false;
      if (advancedFilters.patents && !crop.patents) return false;
      if (advancedFilters.ai_ml_iot && !crop.ai_ml_iot) return false;
      
      return true;
    });
  };

  // Combine static and database crops for final display
  const combinedCrops = [
    ...staticCrops.map(cropName => {
      const staticCrop = getCropByName(cropName);
      return {
        id: cropName,
        name: cropName,
        scientific_name: staticCrop?.scientificName || '',
        description: staticCrop?.description || '',
        season: staticCrop?.season || [],
        climate_type: staticCrop?.climate?.zone ? [staticCrop.climate.zone] : [],
        soil_type: staticCrop?.soil?.type || [],
        water_requirement: staticCrop?.climate?.rainfall || '',
        growth_duration: staticCrop?.morphology?.lifeSpan || '',
        average_yield: staticCrop?.economics?.averageYield || '',
        yield: staticCrop?.economics?.averageYield || '',
        // Add more fields as needed for filtering
        gi_status: staticCrop?.cultural?.giStatus ? true : false,
        patents: staticCrop?.genetics?.patents || false,
        ai_ml_iot: staticCrop?.technology?.aiMlIot ? true : false,
        // Add static crop data for display
        staticCropData: staticCrop
      };
    }),
    ...dbCrops
  ];

  const finalFilteredCrops = applyAdvancedFilters(
    combinedCrops.filter(crop => filteredCrops.includes(crop.name))
  );

  // Debug logging
  useEffect(() => {
    console.log('Static crops:', staticCrops);
    console.log('Database crops:', dbCrops);
    console.log('Filtered crops:', filteredCrops);
    console.log('Combined crops:', combinedCrops);
    console.log('Final filtered crops:', finalFilteredCrops);
  }, [staticCrops, dbCrops, filteredCrops, combinedCrops, finalFilteredCrops]);

  const renderCropCard = (crop: any, index: number) => {
    const priority = getCropPriority(crop.name);
    const status = getCropStatus(crop);
    
    return (
      <Card 
        key={crop.id || crop.name}
        className="group cursor-pointer transition-all duration-200 ease-out hover:shadow-lg border border-gray-200 bg-white hover:border-yellow-400"
        onClick={() => onCropSelect(crop.name)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-gray-800" />
                </div>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">
                  {crop.name || 'Unknown Crop'}
                </CardTitle>
                <div className="text-sm italic text-gray-600">
                  {crop.scientific_name || 'Scientific name not available'}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                {crop.season?.map((season: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1">
                    {getSeasonIcon(season)}
                    <span className="text-xs font-medium text-gray-600">{season}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Metrics Grid */}
          {getQuickMetrics(crop).length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {getQuickMetrics(crop).map((metric, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-center mb-1">
                    <div className={`${metric.color} mr-1`}>
                      {metric.icon}
                    </div>
                    <div className="text-base font-bold text-gray-800">{metric.value}</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">{metric.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Description Preview */}
          {crop.description && (
            <div className="text-sm text-gray-600 line-clamp-2 bg-gray-50 rounded p-3 max-w-prose">
              {crop.description}
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onCropSelect(crop.name);
            }}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Explore Full Profile
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderSkeletonCard = (index: number) => (
    <Card key={index} className="animate-pulse bg-white border border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-200" />
            <Skeleton className="h-3 w-24 bg-gray-200" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton 
              key={i} 
              className="h-16 rounded-lg bg-gray-200" 
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-10 w-full bg-gray-200" />
      </CardContent>
    </Card>
  );

  // Helper functions
  const getCropPriority = (cropName: string) => {
    const priorityCrops = ['wheat', 'rice', 'corn', 'potato', 'tomato'];
    return priorityCrops.includes(cropName?.toLowerCase()) ? 'high' : 'normal';
  };

  const getCropStatus = (cropData: any) => {
    if (cropData.gi_status) return 'gi';
    if (cropData.patents) return 'patented';
    if (cropData.ai_ml_iot) return 'smart';
    return 'standard';
  };

  const getSeasonIcon = (season: string) => {
    switch (season?.toLowerCase()) {
      case 'rabi': return <Sun className="h-4 w-4 text-yellow-600" />;
      case 'kharif': return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'zaid': return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'gi': return <Award className="h-4 w-4 text-yellow-600" />;
      case 'patented': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'smart': return <ZapIcon className="h-4 w-4 text-purple-600" />;
      default: return <Leaf className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'gi': return 'GI Status';
      case 'patented': return 'Patented';
      case 'smart': return 'Smart Tech';
      default: return 'Standard';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'gi': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'patented': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'smart': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getQuickMetrics = (cropData: any) => {
    const metrics = [];
    
    if (cropData.average_yield || cropData.yield) {
      metrics.push({
        label: 'Yield',
        value: cropData.average_yield || cropData.yield,
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'text-yellow-600'
      });
    }
    
    if (cropData.growth_duration) {
      metrics.push({
        label: 'Duration',
        value: cropData.growth_duration,
        icon: <Clock className="h-4 w-4" />,
        color: 'text-blue-600'
      });
    }
    
    if (cropData.optimum_temp) {
      metrics.push({
        label: 'Opt. Temp',
        value: cropData.optimum_temp,
        icon: <Thermometer className="h-4 w-4" />,
        color: 'text-orange-600'
      });
    }
    
    if (cropData.water_requirement) {
      metrics.push({
        label: 'Water',
        value: cropData.water_requirement,
        icon: <Droplets className="h-4 w-4" />,
        color: 'text-blue-500'
      });
    }

    return metrics;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold text-gray-800">
              CropTree Explorer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-prose mx-auto mb-8 leading-relaxed">
            Discover comprehensive crop profiles with scientific insights, variety-specific recommendations, and AI-powered farming guidance
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowInsights(!showInsights)}
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-gray-800"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              {showInsights ? 'Hide Insights' : 'Show Insights'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowComparison(!showComparison)}
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-gray-800"
            >
              <GitCompare className="h-5 w-5 mr-2" />
              {showComparison ? 'Hide Comparison' : 'Compare Crops'}
            </Button>
          </div>
        </div>

        {/* Dashboard Insights */}
        {showInsights && (
          <div className="mb-8">
            <DashboardInsights 
              crops={finalFilteredCrops}
              onCropSelect={onCropSelect}
            />
          </div>
        )}

        {/* Enhanced Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                    className={`pl-12 h-14 text-lg border-2 bg-white transition-all duration-200 ${
                      isSearchFocused 
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
                        : 'border-gray-300 hover:border-yellow-400/50'
                    }`}
                    aria-label="Search crops"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-14 bg-white border-gray-300 hover:border-yellow-400"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>

                <div className="flex gap-3">
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="w-full sm:w-40 h-14 bg-white border-gray-300">
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
                    <SelectTrigger className="w-full sm:w-40 h-14 bg-white border-gray-300">
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

                  <div className="flex border border-gray-300 rounded-lg bg-white">
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

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-8">
            <AdvancedFilters
              onFiltersChange={setAdvancedFilters}
              onClearFilters={() => setAdvancedFilters({})}
              isLoading={loading}
            />
          </div>
        )}

        {/* Crop Comparison Tool */}
        {showComparison && (
          <div className="mb-8">
            <CropComparison 
              availableCrops={finalFilteredCrops}
              onClose={() => setShowComparison(false)}
            />
          </div>
        )}

        {/* Quick Stats Summary */}
        {(searchTerm || selectedSeason !== 'all' || selectedState !== 'all' || Object.keys(advancedFilters).length > 0) && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-bold text-yellow-600">{finalFilteredCrops.length}</span> of <span className="font-bold">{dbCrops.length}</span> crops
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {selectedSeason !== 'all' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Season: {selectedSeason}
                    </Badge>
                  )}
                  {selectedState !== 'all' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      State: {selectedState}
                    </Badge>
                  )}
                  {Object.keys(advancedFilters).length > 0 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">
                      Advanced Filters: {Object.keys(advancedFilters).length}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSeason('all');
                  setSelectedState('all');
                  setAdvancedFilters({});
                }}
                className="text-xs border-yellow-300 text-yellow-600 hover:bg-yellow-50"
              >
                <Filter className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Tabs for Different Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
              All Crops ({finalFilteredCrops.length})
            </TabsTrigger>
            <TabsTrigger value="priority" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
              Priority Crops
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
              Recently Added
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
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
            {finalFilteredCrops.map((crop, index) => renderCropCard(crop, index))}
          </div>
        )}

        {/* Enhanced No Results */}
        {finalFilteredCrops.length === 0 && (searchTerm || selectedSeason !== 'all' || selectedState !== 'all' || Object.keys(advancedFilters).length > 0) && !loading && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <Sprout className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No crops found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or browse our complete collection
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSeason('all');
                setSelectedState('all');
                setAdvancedFilters({});
              }}
              className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}
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

export default EnhancedCropDashboard;
