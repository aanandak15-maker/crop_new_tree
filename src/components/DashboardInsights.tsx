import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  Award,
  Shield,
  Zap,
  Leaf,
  Globe,
  Users,
  Clock,
  Thermometer,
  Droplet,
  Sun,
  Star,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  MapPin
} from 'lucide-react';
import DataVisualization from './DataVisualization';

interface DashboardInsightsProps {
  crops: any[];
  onCropSelect?: (cropName: string) => void;
  className?: string;
}

interface InsightMetric {
  label: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({ 
  crops, 
  onCropSelect,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  // Calculate key metrics
  const calculateMetrics = (): InsightMetric[] => {
    if (!crops || crops.length === 0) return [];

    const totalCrops = crops.length;
    const priorityCrops = crops.filter(crop => 
      ['wheat', 'rice', 'corn', 'potato', 'tomato'].includes(crop.name?.toLowerCase())
    ).length;
    
    const giStatusCrops = crops.filter(crop => crop.gi_status).length;
    const smartTechCrops = crops.filter(crop => crop.ai_ml_iot).length;
    const patentedCrops = crops.filter(crop => crop.patents).length;
    
    const highYieldCrops = crops.filter(crop => {
      const yieldValue = parseFloat(crop.average_yield?.replace(/[^\d.-]/g, '') || crop.yield?.replace(/[^\d.-]/g, '') || '0');
      return yieldValue > 5; // Assuming 5+ tons/ha is high yield
    }).length;

    const climateResilientCrops = crops.filter(crop => 
      crop.climate_resilience || crop.drought || crop.flood || crop.heat || crop.cold
    ).length;

    return [
      {
        label: 'Total Crops',
        value: totalCrops,
        trend: 'up',
        icon: <Leaf className="h-5 w-5" />,
        color: 'text-crop-green',
        description: 'Total number of crops in database'
      },
      {
        label: 'Priority Crops',
        value: priorityCrops,
        change: Math.round((priorityCrops / totalCrops) * 100),
        trend: 'up',
        icon: <Star className="h-5 w-5" />,
        color: 'text-harvest-gold',
        description: 'High-priority staple crops'
      },
      {
        label: 'GI Status',
        value: giStatusCrops,
        change: Math.round((giStatusCrops / totalCrops) * 100),
        trend: giStatusCrops > 0 ? 'up' : 'neutral',
        icon: <Award className="h-5 w-5" />,
        color: 'text-yellow-600',
        description: 'Crops with Geographical Indication'
      },
      {
        label: 'Smart Tech',
        value: smartTechCrops,
        change: Math.round((smartTechCrops / totalCrops) * 100),
        trend: smartTechCrops > 0 ? 'up' : 'neutral',
        icon: <Zap className="h-5 w-5" />,
        color: 'text-purple-600',
        description: 'AI/ML/IoT integrated crops'
      },
      {
        label: 'Patented',
        value: patentedCrops,
        change: Math.round((patentedCrops / totalCrops) * 100),
        trend: patentedCrops > 0 ? 'up' : 'neutral',
        icon: <Shield className="h-5 w-5" />,
        color: 'text-blue-600',
        description: 'Patented crop varieties'
      },
      {
        label: 'High Yield',
        value: highYieldCrops,
        change: Math.round((highYieldCrops / totalCrops) * 100),
        trend: highYieldCrops > 0 ? 'up' : 'neutral',
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'text-green-600',
        description: 'Crops with 5+ tons/ha yield'
      },
      {
        label: 'Climate Resilient',
        value: climateResilientCrops,
        change: Math.round((climateResilientCrops / totalCrops) * 100),
        trend: climateResilientCrops > 0 ? 'up' : 'neutral',
        icon: <Globe className="h-5 w-5" />,
        color: 'text-cyan-600',
        description: 'Drought/flood/heat/cold resistant'
      }
    ];
  };

  const metrics = calculateMetrics();

  // Generate seasonal distribution data
  const getSeasonalDistribution = () => {
    const seasonCounts: { [key: string]: number } = {};
    
    crops.forEach(crop => {
      if (crop.season) {
        crop.season.forEach((season: string) => {
          seasonCounts[season] = (seasonCounts[season] || 0) + 1;
        });
      }
    });

    return Object.entries(seasonCounts).map(([season, count]) => ({
      name: season,
      value: count
    }));
  };

  // Generate climate type distribution
  const getClimateDistribution = () => {
    const climateCounts: { [key: string]: number } = {};
    
    crops.forEach(crop => {
      if (crop.climate_type) {
        crop.climate_type.forEach((climate: string) => {
          climateCounts[climate] = (climateCounts[climate] || 0) + 1;
        });
      }
    });

    return Object.entries(climateCounts).map(([climate, count]) => ({
      name: climate,
      value: count
    }));
  };

  // Generate yield distribution
  const getYieldDistribution = () => {
    const yieldRanges = [
      { range: '0-2 tons/ha', min: 0, max: 2, count: 0 },
      { range: '2-5 tons/ha', min: 2, max: 5, count: 0 },
      { range: '5-10 tons/ha', min: 5, max: 10, count: 0 },
      { range: '10+ tons/ha', min: 10, max: Infinity, count: 0 }
    ];

    crops.forEach(crop => {
      const yieldValue = parseFloat(crop.average_yield?.replace(/[^\d.-]/g, '') || crop.yield?.replace(/[^\d.-]/g, '') || '0');
      if (!isNaN(yieldValue)) {
        const range = yieldRanges.find(r => yieldValue >= r.min && yieldValue < r.max);
        if (range) range.count++;
      }
    });

    return yieldRanges.map(range => ({
      name: range.range,
      value: range.count
    }));
  };

  // Get top performing crops
  const getTopCrops = (metric: 'yield' | 'priority' | 'innovation') => {
    let sortedCrops = [...crops];
    
    switch (metric) {
      case 'yield':
        sortedCrops.sort((a, b) => {
          const yieldA = parseFloat(a.average_yield?.replace(/[^\d.-]/g, '') || a.yield?.replace(/[^\d.-]/g, '') || '0');
          const yieldB = parseFloat(b.average_yield?.replace(/[^\d.-]/g, '') || b.yield?.replace(/[^\d.-]/g, '') || '0');
          return yieldB - yieldA;
        });
        break;
      case 'priority':
        sortedCrops.sort((a, b) => {
          const priorityA = ['wheat', 'rice', 'corn', 'potato', 'tomato'].includes(a.name?.toLowerCase()) ? 1 : 0;
          const priorityB = ['wheat', 'rice', 'corn', 'potato', 'tomato'].includes(b.name?.toLowerCase()) ? 1 : 0;
          return priorityB - priorityA;
        });
        break;
      case 'innovation':
        sortedCrops.sort((a, b) => {
          const innovationA = (a.gi_status ? 1 : 0) + (a.patents ? 1 : 0) + (a.ai_ml_iot ? 1 : 0);
          const innovationB = (b.gi_status ? 1 : 0) + (b.patents ? 1 : 0) + (b.ai_ml_iot ? 1 : 0);
          return innovationB - innovationA;
        });
        break;
    }

    return sortedCrops.slice(0, 5);
  };

  const renderMetricCard = (metric: InsightMetric) => (
    <Card key={metric.label} className="bg-gradient-to-br from-card to-leaf-light/10 border-2 hover:border-crop-green/30 transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${metric.color.replace('text-', 'bg-')}/10`}>
            {metric.icon}
          </div>
          <Badge 
            variant="secondary" 
            className={`${
              metric.trend === 'up' ? 'bg-green-100 text-green-800 border-green-200' :
              metric.trend === 'down' ? 'bg-red-100 text-red-800 border-red-200' :
              'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            {metric.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
            {metric.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
            {metric.trend === 'neutral' && <Activity className="h-3 w-3 mr-1" />}
            {metric.change ? `${metric.change}%` : 'N/A'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">{metric.value}</div>
          <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
          {metric.description && (
            <div className="text-xs text-muted-foreground">{metric.description}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderTopCropsList = (metric: 'yield' | 'priority' | 'innovation') => {
    const topCrops = getTopCrops(metric);
    
    return (
      <div className="space-y-3">
        {topCrops.map((crop, index) => (
          <div 
            key={crop.id || crop.name}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onCropSelect?.(crop.name)}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-crop-green to-harvest-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="font-medium">{crop.name}</div>
                <div className="text-sm text-muted-foreground">
                  {metric === 'yield' && `${crop.average_yield || crop.yield || 'N/A'}`}
                  {metric === 'priority' && crop.scientific_name}
                  {metric === 'innovation' && [
                    crop.gi_status && 'GI',
                    crop.patents && 'Patented',
                    crop.ai_ml_iot && 'Smart Tech'
                  ].filter(Boolean).join(', ')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {crop.gi_status && <Award className="h-4 w-4 text-yellow-600" />}
              {crop.patents && <Shield className="h-4 w-4 text-blue-600" />}
              {crop.ai_ml_iot && <Zap className="h-4 w-4 text-purple-600" />}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Insights</h2>
          <p className="text-muted-foreground">Analytics and key metrics for your crop database</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(renderMetricCard)}
      </div>

      {/* Detailed Analytics */}
      {showDetails && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Seasonal Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataVisualization 
                    cropData={getSeasonalDistribution()} 
                    type="nutrition" 
                    className="h-64"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Climate Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataVisualization 
                    cropData={getClimateDistribution()} 
                    type="comparison" 
                    className="h-64"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Yield Crops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderTopCropsList('yield')}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Priority Crops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderTopCropsList('priority')}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Most Innovative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderTopCropsList('innovation')}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Yield Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataVisualization 
                    cropData={getYieldDistribution()} 
                    type="comparison" 
                    className="h-64"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-crop-green/10 rounded-lg">
                      <div className="text-2xl font-bold text-crop-green">
                        {crops.filter(c => c.climate_zone).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Climate Zones</div>
                    </div>
                    <div className="text-center p-4 bg-harvest-gold/10 rounded-lg">
                      <div className="text-2xl font-bold text-harvest-gold">
                        {crops.filter(c => c.origin).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Origins</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Technology Adoption
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI/ML Integration</span>
                      <Badge variant="secondary">
                        {crops.filter(c => c.ai_ml_iot).length} crops
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Smart Farming</span>
                      <Badge variant="secondary">
                        {crops.filter(c => c.smart_farming).length} crops
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IoT Ready</span>
                      <Badge variant="secondary">
                        {crops.filter(c => c.ai_ml_iot).length} crops
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Sustainability Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Climate Resilient</span>
                      <Badge variant="secondary">
                        {crops.filter(c => c.climate_resilience).length} crops
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Carbon</span>
                      <Badge variant="secondary">
                        {crops.filter(c => c.carbon_footprint === 'low').length} crops
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Waste to Wealth</span>
                      <Badge variant="secondary">
                        {crops.filter(c => c.waste_to_wealth).length} crops
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DashboardInsights;
