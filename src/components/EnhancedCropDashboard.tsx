import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
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
  Bell,
  Home,
  User,
  ChevronRight,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  CloudRain
} from 'lucide-react';
// Removed unused import - data comes from Supabase
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
  common_weeds?: string;
  weed_season?: string;
  weed_control_method?: string;
  critical_period_weed?: string;
  pests?: string[];
  diseases?: string[];
  created_at?: string;
  updated_at?: string;
}

const EnhancedCropDashboard: React.FC<EnhancedCropDashboardProps> = ({ onCropSelect }) => {
  // Core state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedCropType, setSelectedCropType] = useState<string>('all');
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
  
  // New state for enhanced features
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [showCompareTray, setShowCompareTray] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<number>(3);
  const [userRole, setUserRole] = useState<'student' | 'researcher' | 'farmer' | 'admin'>('farmer');

  // No static crops - data comes from Supabase

  useEffect(() => {
    fetchDbCrops();
  }, []);

  const fetchDbCrops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crops')
        .select(`
          *,
          crop_images (
            id,
            image_url,
            alt_text,
            caption,
            is_primary
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching crops:', error);
        setDbCrops([]);
        return;
      }
      
      setDbCrops(data || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setDbCrops([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter database crops only
  const filteredCrops = dbCrops.filter(dbCrop => {
    if (!dbCrop.name) return false;
    
    // Handle search
    const matchesSearch = dbCrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dbCrop.scientific_name && dbCrop.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Handle season filtering
    const matchesSeason = selectedSeason === 'all' || 
      (dbCrop.season && dbCrop.season.some((s: string) => s.toLowerCase().includes(selectedSeason.toLowerCase())));
    
    // Handle crop type filtering (database crops don't have crop type data yet)
    const matchesCropType = selectedCropType === 'all' || true; // For now, include all database crops
    
    // Handle state filtering (if available in database crop)
    const matchesState = selectedState === 'all' || true; // For now, include all database crops
    
    return matchesSearch && matchesSeason && matchesCropType && matchesState;
  }).map(crop => crop.name);

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

  // Use only database crops for final display
  const finalFilteredCrops = applyAdvancedFilters(dbCrops);

  // Production logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Dashboard loaded successfully
    }
  }, [dbCrops.length, finalFilteredCrops.length]);

  // Crop selection handlers
  const handleCropSelection = (cropName: string) => {
    if (selectedCrops.includes(cropName)) {
      setSelectedCrops(selectedCrops.filter(name => name !== cropName));
    } else {
      setSelectedCrops([...selectedCrops, cropName]);
    }
  };

  const clearSelection = () => {
    setSelectedCrops([]);
  };

  // Utility functions
  const getCropPriority = (cropName: string) => {
    // Priority logic based on user role and crop importance
    if (userRole === 'farmer') return 'high';
    if (userRole === 'researcher') return 'medium';
    return 'low';
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

  const getCropImage = (crop: any) => {
    // First, check if this is a database crop with uploaded images
    if (crop.crop_images && crop.crop_images.length > 0) {
      // Find the primary image or use the first one
      const primaryImage = crop.crop_images.find((img: any) => img.is_primary) || crop.crop_images[0];
      
      return (
        <img 
          src={primaryImage.image_url} 
          alt={primaryImage.alt_text || crop.name} 
          className="h-full w-full object-cover rounded-full"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    
    // For static crops, use predefined images
    const cropNameLower = crop.name.toLowerCase();
    
    switch (cropNameLower) {
      case 'wheat':
        return (
          <img 
            src="/images/wheat.svg" 
            alt="Wheat" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'rice':
        return (
          <img 
            src="/images/rice.svg" 
            alt="Rice" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'maize':
        return (
          <img 
            src="/images/maize.svg" 
            alt="Maize" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'anand':
        return (
          <img 
            src="/images/anand.svg" 
            alt="Anand" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'ashwagandha':
        return (
          <img 
            src="/images/ashwagandha.svg" 
            alt="Ashwagandha" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'tulsi':
        return (
          <img 
            src="/images/tulsi.svg" 
            alt="Tulsi" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'marigold':
        return (
          <img 
            src="/images/marigold.svg" 
            alt="Marigold" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'rose':
        return (
          <img 
            src="/images/rose.svg" 
            alt="Rose" 
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      default:
        // For database crops without images, show a generic icon
        return <Sprout className="h-8 w-8 text-white" />;
    }
  };

  const getQuickMetrics = (cropData: any) => {
    const metrics = [];
    
    // Yield information
    if (cropData.average_yield || cropData.yield) {
      metrics.push({
        label: 'Yield',
        value: cropData.average_yield || cropData.yield,
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'text-yellow-600'
      });
    }
    
    // Growth duration
    if (cropData.growth_duration) {
      metrics.push({
        label: 'Duration',
        value: cropData.growth_duration,
        icon: <Clock className="h-4 w-4" />,
        color: 'text-blue-600'
      });
    }
    
    // Temperature requirements
    if (cropData.optimum_temp || cropData.climate?.temperature) {
      metrics.push({
        label: 'Temperature',
        value: cropData.optimum_temp || cropData.climate?.temperature || 'N/A',
        icon: <Thermometer className="h-4 w-4" />,
        color: 'text-orange-600'
      });
    }
    
    // Water requirements
    if (cropData.water_requirement) {
      metrics.push({
        label: 'Water',
        value: cropData.water_requirement,
        icon: <Droplets className="h-4 w-4" />,
        color: 'text-blue-500'
      });
    }

    // Soil pH
    if (cropData.soil_ph || cropData.soil?.ph) {
      metrics.push({
        label: 'Soil pH',
        value: cropData.soil_ph || cropData.soil?.ph || 'N/A',
        icon: <Leaf className="h-4 w-4" />,
        color: 'text-green-600'
      });
    }

    // Rainfall requirements
    if (cropData.rainfall_requirement || cropData.climate?.rainfall) {
      metrics.push({
        label: 'Rainfall',
        value: cropData.rainfall_requirement || cropData.climate?.rainfall || 'N/A',
        icon: <CloudRain className="h-4 w-4" />,
        color: 'text-cyan-600'
      });
    }

    return metrics;
  };

  const renderCropCard = (crop: any, index: number) => {
    // Safety checks for production
    if (!crop || !crop.name) {
      console.warn('Invalid crop data:', crop);
      return null;
    }

    const isSelected = selectedCrops.includes(crop.name);
    
    return (
      <Card 
        key={crop.id || crop.name}
        className={`group cursor-pointer transition-all duration-300 ease-out hover:shadow-xl border-2 ${
          isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
        } rounded-xl overflow-hidden`}
        onClick={() => onCropSelect(crop.name)}
      >
        {/* Simple Header with Image and Name */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white relative">
          {/* Selection checkbox */}
          <div className="absolute top-4 right-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleCropSelection(crop.name)}
              className="data-[state=checked]:bg-white data-[state=checked]:text-green-600"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 overflow-hidden">
                {getCropImage(crop)}
                <Sprout className="h-8 w-8 text-white hidden" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                {crop.name || 'Unknown Crop'}
              </CardTitle>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                onCropSelect(crop.name);
              }}
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              Explore Full Profile
            </Button>
            
            <Button 
              variant="outline"
              className="px-4 py-3 border-green-300 text-green-600 hover:bg-green-50 rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                handleCropSelection(crop.name);
              }}
            >
              {isSelected ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
          </div>
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
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-3/4 bg-gray-200" />
          <Skeleton className="h-4 w-1/2 bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Control Strip - Search, Filter, Compare */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Perfect Crop</h2>
              <p className="text-gray-600">Search, filter, and compare crops based on your research needs</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-end">
              {/* Smart Search - Smaller */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="🔍 Search crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`pl-10 h-12 text-base border-2 bg-white rounded-lg transition-all duration-300 ${
                      isSearchFocused 
                        ? 'border-green-400 shadow-lg shadow-green-400/20' 
                        : 'border-gray-200 hover:border-green-400/50'
                    }`}
                  />
                </div>
              </div>
              
              {/* Season Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-full sm:w-40 h-12 bg-white border-gray-200 rounded-lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌱 All Seasons</SelectItem>
                    <SelectItem value="rabi">☀️ Rabi</SelectItem>
                    <SelectItem value="kharif">🌧️ Kharif</SelectItem>
                    <SelectItem value="zaid">⚡ Zaid</SelectItem>
                  </SelectContent>
                </Select>

                {/* Crop Type Filter */}
                <Select value={selectedCropType} onValueChange={setSelectedCropType}>
                  <SelectTrigger className="w-full sm:w-40 h-12 bg-white border-gray-200 rounded-lg">
                    <Leaf className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Crop Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌾 All Types</SelectItem>
                    <SelectItem value="cereals">🌾 Cereals</SelectItem>
                    <SelectItem value="pulses">🫘 Pulses</SelectItem>
                    <SelectItem value="vegetables">🥬 Vegetables</SelectItem>
                    <SelectItem value="fruits">🍎 Fruits</SelectItem>
                    <SelectItem value="oilseeds">🫘 Oilseeds</SelectItem>
                    <SelectItem value="spices">🌶️ Spices</SelectItem>
                    <SelectItem value="medicinal">🌿 Medicinal</SelectItem>
                    <SelectItem value="ornamental">🌸 Ornamental</SelectItem>
                  </SelectContent>
                </Select>



                <Button
                  variant="outline"
                  onClick={() => setShowComparison(!showComparison)}
                  className="h-12 bg-white border-gray-200 hover:border-blue-400 rounded-lg px-4 font-medium"
                >
                  <GitCompare className="h-4 w-4 mr-2" />
                  {showComparison ? 'Hide' : 'Compare'}
                </Button>
              </div>
            </div>


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
              onClose={() => setShowComparison(false)} 
            />
          </div>
        )}

        {/* Quick Stats Summary */}
        {(searchTerm || selectedSeason !== 'all' || selectedState !== 'all' || Object.keys(advancedFilters).length > 0) && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">

                <div className="flex flex-wrap gap-3">
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                      🔍 Search: "{searchTerm}"
                    </Badge>
                  )}
                  {selectedSeason !== 'all' && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1">
                      🌱 Season: {selectedSeason}
                    </Badge>
                  )}
                  {selectedCropType !== 'all' && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-300 px-3 py-1">
                      🌾 Type: {selectedCropType}
                    </Badge>
                  )}
                  {selectedState !== 'all' && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300 px-3 py-1">
                      🗺️ State: {selectedState}
                    </Badge>
                  )}
                  {Object.keys(advancedFilters).length > 0 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300 px-3 py-1">
                      ⚙️ Advanced Filters: {Object.keys(advancedFilters).length}
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
                  setSelectedCropType('all');
                  setSelectedState('all');
                  setAdvancedFilters({});
                }}
                className="text-sm border-green-300 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Tabs and View Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300">
                🌾 All Crops ({finalFilteredCrops.length})
              </TabsTrigger>
              <TabsTrigger value="priority" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300">
                ⭐ Priority Crops
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300">
                🆕 Recently Added
              </TabsTrigger>
              <TabsTrigger value="popular" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-300">
                🔥 Most Popular
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Crop Cards Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {Array.from({ length: 6 }).map((_, index) => renderSkeletonCard(index))}
          </div>
        ) : finalFilteredCrops.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm">
              <div className="text-6xl mb-6">🌾</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Crops Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your search terms or filters to find the crops you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSeason('all');
                  setSelectedCropType('all');
                  setSelectedState('all');
                  setAdvancedFilters({});
                }}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl"
              >
                🔄 Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {finalFilteredCrops.map((crop, index) => renderCropCard(crop, index))}
          </div>
        )}

        {/* Floating Compare Tray */}
        {selectedCrops.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Selected:</span>
                <Badge className="bg-green-100 text-green-800">{selectedCrops.length}</Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowCompareTray(true)}
                  disabled={selectedCrops.length < 2}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <GitCompare className="h-4 w-4 mr-1" />
                  Compare
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSelection}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCropDashboard;
