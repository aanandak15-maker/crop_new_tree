import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitCompare, 
  Plus, 
  X, 
  TrendingUp, 
  Thermometer, 
  Droplet, 
  Sun, 
  Leaf, 
  Target, 
  Award,
  Shield,
  Zap,
  Clock,
  MapPin,
  BarChart3,
  CheckCircle,
  XCircle,
  Minus,
  Star
} from 'lucide-react';
import DataVisualization from './DataVisualization';

interface CropComparisonProps {
  availableCrops: any[];
  onClose?: () => void;
}

interface ComparisonMetric {
  key: string;
  label: string;
  icon: React.ReactNode;
  category: 'basic' | 'growing' | 'nutrition' | 'market' | 'special';
  formatter?: (value: any) => string;
  color?: string;
}

const CropComparison: React.FC<CropComparisonProps> = ({ 
  availableCrops, 
  onClose 
}) => {
  const [selectedCrops, setSelectedCrops] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [comparisonMode, setComparisonMode] = useState<'table' | 'charts'>('table');

  // Define comparison metrics
  const comparisonMetrics: ComparisonMetric[] = [
    // Basic metrics
    { key: 'name', label: 'Crop Name', icon: <Leaf className="h-4 w-4" />, category: 'basic' },
    { key: 'scientific_name', label: 'Scientific Name', icon: <Target className="h-4 w-4" />, category: 'basic' },
    { key: 'origin', label: 'Origin', icon: <MapPin className="h-4 w-4" />, category: 'basic' },
    
    // Growing conditions
    { key: 'growth_duration', label: 'Growth Duration', icon: <Clock className="h-4 w-4" />, category: 'growing' },
    { key: 'optimum_temp', label: 'Optimum Temperature', icon: <Thermometer className="h-4 w-4" />, category: 'growing' },
    { key: 'water_requirement', label: 'Water Requirement', icon: <Droplet className="h-4 w-4" />, category: 'growing' },
    { key: 'soil_texture', label: 'Soil Texture', icon: <Sun className="h-4 w-4" />, category: 'growing' },
    { key: 'light_requirement', label: 'Light Requirement', icon: <Sun className="h-4 w-4" />, category: 'growing' },
    
    // Nutritional metrics
    { key: 'calories', label: 'Calories', icon: <TrendingUp className="h-4 w-4" />, category: 'nutrition', formatter: (v) => `${v} kcal` },
    { key: 'protein', label: 'Protein', icon: <Target className="h-4 w-4" />, category: 'nutrition', formatter: (v) => `${v}%` },
    { key: 'vitamins', label: 'Vitamins', icon: <Leaf className="h-4 w-4" />, category: 'nutrition' },
    { key: 'minerals', label: 'Minerals', icon: <Award className="h-4 w-4" />, category: 'nutrition' },
    
    // Market metrics
    { key: 'market_demand', label: 'Market Demand', icon: <BarChart3 className="h-4 w-4" />, category: 'market' },
    { key: 'export_potential', label: 'Export Potential', icon: <TrendingUp className="h-4 w-4" />, category: 'market' },
    { key: 'shelf_life', label: 'Shelf Life', icon: <Clock className="h-4 w-4" />, category: 'market' },
    
    // Special features
    { key: 'gi_status', label: 'GI Status', icon: <Award className="h-4 w-4" />, category: 'special' },
    { key: 'patents', label: 'Patents', icon: <Shield className="h-4 w-4" />, category: 'special' },
    { key: 'ai_ml_iot', label: 'Smart Tech', icon: <Zap className="h-4 w-4" />, category: 'special' }
  ];

  const addCropToComparison = (crop: any) => {
    if (selectedCrops.length < 4 && !selectedCrops.find(c => c.id === crop.id)) {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const removeCropFromComparison = (cropId: string) => {
    setSelectedCrops(selectedCrops.filter(c => c.id !== cropId));
  };

  const getMetricValue = (crop: any, metric: ComparisonMetric) => {
    const value = crop[metric.key];
    
    if (value === undefined || value === null || value === '') {
      return { value: 'N/A', status: 'missing' };
    }
    
    if (metric.key === 'gi_status' || metric.key === 'patents' || metric.key === 'ai_ml_iot') {
      return { value: value ? 'Yes' : 'No', status: value ? 'positive' : 'negative' };
    }
    
    if (metric.key === 'water_requirement') {
      const status = value === 'low' ? 'positive' : value === 'medium' ? 'neutral' : 'negative';
      return { value, status };
    }
    
    if (metric.key === 'market_demand' || metric.key === 'export_potential') {
      const status = value === 'high' ? 'positive' : value === 'medium' ? 'neutral' : 'negative';
      return { value, status };
    }
    
    return { value: metric.formatter ? metric.formatter(value) : value, status: 'neutral' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'negative': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'neutral': return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'bg-green-50 border-green-200 text-green-800';
      case 'negative': return 'bg-red-50 border-red-200 text-red-800';
      case 'neutral': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-400';
    }
  };

  const renderComparisonTable = () => {
    if (selectedCrops.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <GitCompare className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No crops selected for comparison</h3>
          <p>Select up to 4 crops to compare their characteristics</p>
        </div>
      );
    }

    const filteredMetrics = comparisonMetrics.filter(metric => metric.category === activeTab || activeTab === 'overview');

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium text-muted-foreground">Metrics</th>
              {selectedCrops.map((crop, index) => (
                <th key={crop.id} className="text-center p-3 font-medium">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gradient-to-br from-crop-green to-harvest-gold rounded-full flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold">{crop.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCropFromComparison(crop.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMetrics.map((metric) => (
              <tr key={metric.key} className="border-b hover:bg-muted/50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="font-medium">{metric.label}</span>
                  </div>
                </td>
                {selectedCrops.map((crop) => {
                  const metricData = getMetricValue(crop, metric);
                  return (
                    <td key={crop.id} className="p-3 text-center">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(metricData.status)}`}>
                        {getStatusIcon(metricData.status)}
                        {metricData.value}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderComparisonCharts = () => {
    if (selectedCrops.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No crops selected for charts</h3>
          <p>Select crops to view comparison charts</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataVisualization 
          cropData={selectedCrops} 
          type="comparison" 
          className="h-80"
        />
        <DataVisualization 
          cropData={selectedCrops[0] || {}} 
          type="yield" 
          className="h-80"
        />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-xl">
              <GitCompare className="h-6 w-6" />
              Crop Comparison Tool
            {selectedCrops.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedCrops.length} crops
              </Badge>
            )}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Crop Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Select Crops to Compare</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonMode(comparisonMode === 'table' ? 'charts' : 'table')}
              >
                {comparisonMode === 'table' ? <BarChart3 className="h-4 w-4 mr-2" /> : <Compare className="h-4 w-4 mr-2" />}
                {comparisonMode === 'table' ? 'Show Charts' : 'Show Table'}
              </Button>
            </div>
          </div>

          {selectedCrops.length < 4 && (
            <Select onValueChange={(cropId) => {
              const crop = availableCrops.find(c => c.id === cropId);
              if (crop) addCropToComparison(crop);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add a crop to comparison..." />
              </SelectTrigger>
              <SelectContent>
                {availableCrops
                  .filter(crop => !selectedCrops.find(c => c.id === crop.id))
                  .map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-crop-green" />
                        {crop.name}
                        {crop.scientific_name && (
                          <span className="text-sm text-muted-foreground italic">
                            ({crop.scientific_name})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}

          {/* Selected Crops Display */}
          {selectedCrops.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCrops.map((crop) => (
                <Badge 
                  key={crop.id} 
                  variant="secondary" 
                  className="flex items-center gap-2 px-3 py-2 bg-crop-green/10 text-crop-green border-crop-green/20"
                >
                  <Leaf className="h-3 w-3" />
                  {crop.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCropFromComparison(crop.id)}
                    className="h-4 w-4 p-0 hover:bg-crop-green/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Content */}
        {comparisonMode === 'table' ? (
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="growing">Growing</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="special">Special</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-4">
                {renderComparisonTable()}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div>
            {renderComparisonCharts()}
          </div>
        )}

        {/* Summary Insights */}
        {selectedCrops.length > 1 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-harvest-gold" />
              Comparison Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCrops.map((crop, index) => {
                const insights = [];
                
                if (crop.average_yield || crop.yield) {
                  const yieldValue = parseFloat(crop.average_yield?.replace(/[^\d.-]/g, '') || crop.yield?.replace(/[^\d.-]/g, '') || '0');
                  if (yieldValue > 0) {
                    insights.push(`High yield potential: ${yieldValue} tons/ha`);
                  }
                }
                
                if (crop.gi_status) insights.push('Has GI status');
                if (crop.patents) insights.push('Patented variety');
                if (crop.ai_ml_iot) insights.push('Smart farming ready');
                
                return (
                  <Card key={crop.id} className="p-4">
                    <h4 className="font-semibold text-crop-green mb-2">{crop.name}</h4>
                    {insights.length > 0 ? (
                      <ul className="space-y-1">
                        {insights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No special insights available</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CropComparison;
