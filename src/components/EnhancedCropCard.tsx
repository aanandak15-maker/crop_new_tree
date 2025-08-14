import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wheat, 
  Sprout, 
  Calendar, 
  TrendingUp, 
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
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  Droplet,
  Mountain,
  ThermometerIcon,
  Lightbulb,
  Zap as ZapIcon,
  Heart,
  Brain,
  Target,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EnhancedCropCardProps {
  crop: any;
  onCropSelect: (cropName: string) => void;
  index: number;
  viewMode: 'grid' | 'list';
}

const EnhancedCropCard: React.FC<EnhancedCropCardProps> = ({ 
  crop, 
  onCropSelect, 
  index, 
  viewMode 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Determine crop priority and status
  const getCropPriority = (cropData: any) => {
    const priorityCrops = ['wheat', 'rice', 'corn', 'potato', 'tomato'];
    return priorityCrops.includes(cropData.name?.toLowerCase()) ? 'high' : 'normal';
  };

  const getCropStatus = (cropData: any) => {
    if (cropData.gi_status) return 'gi';
    if (cropData.patents) return 'patented';
    if (cropData.ai_ml_iot) return 'smart';
    return 'standard';
  };

  const getSeasonIcon = (season: string) => {
    switch (season?.toLowerCase()) {
      case 'rabi': return <Sun className="h-4 w-4 text-harvest-gold" />;
      case 'kharif': return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'zaid': return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return <Calendar className="h-4 w-4 text-muted-foreground" />;
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

  const priority = getCropPriority(crop);
  const status = getCropStatus(crop);

  // Extract key metrics for quick display
  const getQuickMetrics = (cropData: any) => {
    const metrics = [];
    
    if (cropData.average_yield || cropData.yield) {
      metrics.push({
        label: 'Yield',
        value: cropData.average_yield || cropData.yield,
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'text-harvest-gold'
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
        icon: <Droplet className="h-4 w-4" />,
        color: 'text-blue-500'
      });
    }

    return metrics;
  };

  const quickMetrics = getQuickMetrics(crop);

  return (
    <Card 
      className={`
        group cursor-pointer transition-all duration-200 ease-out hover:shadow-elegant hover:scale-[1.02] 
        border border-border hover:border-crop-green bg-gradient-to-br from-card to-leaf-light/10
        relative overflow-hidden animate-grow
        ${priority === 'high' ? 'ring-1 ring-harvest-gold/20' : ''}
        ${viewMode === 'list' ? 'flex flex-row' : ''}
        ${isExpanded ? 'ring-1 ring-crop-green/30' : ''}
      `}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationDuration: '0.4s'
      }}
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

      {/* Status Badge */}
      <div className="absolute top-2 left-2 z-10">
        <Badge variant="secondary" className={`${getStatusColor(status)} border`}>
          {getStatusIcon(status)}
          <span className="ml-1 text-xs">{getStatusLabel(status)}</span>
        </Badge>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-crop-green rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-harvest-gold rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      <CardHeader className={`pb-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-br from-crop-green to-harvest-gold rounded-full flex items-center justify-center">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-crop-green rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-crop-green transition-colors">
                {crop.name || 'Unknown Crop'}
              </CardTitle>
              <div className="text-sm italic text-muted-foreground">
                {crop.scientific_name || 'Scientific name not available'}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              {crop.season?.map((season: string, idx: number) => (
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
        {/* Quick Metrics Grid */}
        {quickMetrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {quickMetrics.map((metric, idx) => (
              <div key={idx} className="bg-gradient-to-br from-crop-green/10 to-crop-green/5 rounded-lg p-3 border border-crop-green/20">
                <div className="flex items-center justify-center mb-1">
                  <div className={`${metric.color} mr-1`}>
                    {metric.icon}
                  </div>
                  <div className="text-base font-bold text-crop-green">{metric.value}</div>
                </div>
                <div className="text-xs text-muted-foreground text-center">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Description Preview */}
        {crop.description && (
          <div className="text-sm text-muted-foreground line-clamp-2 bg-muted/30 rounded p-3 max-w-prose">
            {crop.description}
          </div>
        )}

        {/* Expandable Detailed View */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-full text-crop-green hover:text-crop-green/80 hover:bg-crop-green/10"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show More Details
              </>
            )}
          </Button>

          {isExpanded && (
            <div className="border-t pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="agronomy" className="text-xs">Agronomy</TabsTrigger>
                  <TabsTrigger value="nutrition" className="text-xs">Nutrition</TabsTrigger>
                  <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {crop.origin && (
                      <div className="bg-blue-50 p-2 rounded border border-blue-200">
                        <div className="font-medium text-blue-700">Origin</div>
                        <div className="text-blue-600">{crop.origin}</div>
                      </div>
                    )}
                    {crop.climate_zone && (
                      <div className="bg-green-50 p-2 rounded border border-green-200">
                        <div className="font-medium text-green-700">Climate Zone</div>
                        <div className="text-green-600">{crop.climate_zone}</div>
                      </div>
                    )}
                    {crop.plant_type && (
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <div className="font-medium text-purple-700">Plant Type</div>
                        <div className="text-purple-600">{crop.plant_type}</div>
                      </div>
                    )}
                    {crop.life_span && (
                      <div className="bg-orange-50 p-2 rounded border border-orange-200">
                        <div className="font-medium text-orange-700">Life Span</div>
                        <div className="text-orange-600">{crop.life_span}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="agronomy" className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {crop.soil_texture && (
                      <div className="bg-brown-50 p-2 rounded border border-brown-200">
                        <div className="font-medium text-brown-700">Soil Texture</div>
                        <div className="text-brown-600">{crop.soil_texture}</div>
                      </div>
                    )}
                    {crop.light_requirement && (
                      <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                        <div className="font-medium text-yellow-700">Light</div>
                        <div className="text-yellow-600">{crop.light_requirement}</div>
                      </div>
                    )}
                    {crop.spacing && (
                      <div className="bg-indigo-50 p-2 rounded border border-indigo-200">
                        <div className="font-medium text-indigo-700">Spacing</div>
                        <div className="text-indigo-600">{crop.spacing}</div>
                      </div>
                    )}
                    {crop.planting_season && (
                      <div className="bg-pink-50 p-2 rounded border border-pink-200">
                        <div className="font-medium text-pink-700">Planting</div>
                        <div className="text-pink-600">{crop.planting_season}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="nutrition" className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {crop.calories && (
                      <div className="bg-red-50 p-2 rounded border border-red-200">
                        <div className="font-medium text-red-700">Calories</div>
                        <div className="text-red-600">{crop.calories}</div>
                      </div>
                    )}
                    {crop.protein && (
                      <div className="bg-blue-50 p-2 rounded border border-blue-200">
                        <div className="font-medium text-blue-700">Protein</div>
                        <div className="text-blue-600">{crop.protein}</div>
                      </div>
                    )}
                    {crop.vitamins && (
                      <div className="bg-green-50 p-2 rounded border border-green-200">
                        <div className="font-medium text-green-700">Vitamins</div>
                        <div className="text-green-600">{crop.vitamins}</div>
                      </div>
                    )}
                    {crop.minerals && (
                      <div className="bg-purple-50 p-2 rounded border border-purple-200">
                        <div className="font-medium text-purple-700">Minerals</div>
                        <div className="text-purple-600">{crop.minerals}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="market" className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {crop.market_demand && (
                      <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                        <div className="font-medium text-emerald-700">Demand</div>
                        <div className="text-emerald-600">{crop.market_demand}</div>
                      </div>
                    )}
                    {crop.export_potential && (
                      <div className="bg-amber-50 p-2 rounded border border-amber-200">
                        <div className="font-medium text-amber-700">Export</div>
                        <div className="text-amber-600">{crop.export_potential}</div>
                      </div>
                    )}
                    {crop.shelf_life && (
                      <div className="bg-cyan-50 p-2 rounded border border-cyan-200">
                        <div className="font-medium text-cyan-700">Shelf Life</div>
                        <div className="text-cyan-600">{crop.shelf_life}</div>
                      </div>
                    )}
                    {crop.certifications && (
                      <div className="bg-violet-50 p-2 rounded border border-violet-200">
                        <div className="font-medium text-violet-700">Certifications</div>
                        <div className="text-violet-600">{crop.certifications}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-crop-green to-crop-green/80 hover:from-crop-green/90 hover:to-crop-green/70 text-white shadow-elegant transition-all duration-200 ease-out hover:shadow-glow group-hover:scale-[1.02]"
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

export default EnhancedCropCard;
