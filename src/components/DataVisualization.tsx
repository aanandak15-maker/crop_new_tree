import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Thermometer, 
  Droplets, 
  Sun, 
  Leaf, 
  Shield,
  Bug,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface DataVisualizationProps {
  crop: any;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ crop }) => {
  // Helper function to get trend icon
  const getTrendIcon = (value: string | number) => {
    if (typeof value === 'string') {
      if (value.toLowerCase().includes('high') || value.toLowerCase().includes('good')) {
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      } else if (value.toLowerCase().includes('low') || value.toLowerCase().includes('poor')) {
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      }
    }
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  // Helper function to get status color
  const getStatusColor = (value: string) => {
    if (value.toLowerCase().includes('high') || value.toLowerCase().includes('good')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (value.toLowerCase().includes('medium') || value.toLowerCase().includes('moderate')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (value.toLowerCase().includes('low') || value.toLowerCase().includes('poor')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Helper function to calculate progress percentage
  const calculateProgress = (value: string) => {
    if (value.toLowerCase().includes('high')) return 80;
    if (value.toLowerCase().includes('medium')) return 50;
    if (value.toLowerCase().includes('low')) return 20;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Climate Suitability Radar */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Thermometer className="h-5 w-5 text-blue-500" />
            Climate Suitability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Thermometer className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-gray-800">Temperature</p>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(crop.optimum_temp || 'Not specified')}`}>
                {crop.optimum_temp || 'Not specified'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Droplets className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-gray-800">Water</p>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(crop.water_requirement || 'Not specified')}`}>
                {crop.water_requirement || 'Not specified'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sun className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-gray-800">Light</p>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(crop.light_requirement || 'Not specified')}`}>
                {crop.light_requirement || 'Not specified'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-gray-800">Soil</p>
              <Badge variant="outline" className={`mt-1 ${getStatusColor(crop.soil_texture || 'Not specified')}`}>
                {crop.soil_texture || 'Not specified'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutritional Composition Chart */}
      {(crop.calories || crop.protein || crop.carbohydrates || crop.fat) && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Info className="h-5 w-5 text-green-500" />
              Nutritional Composition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crop.calories && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Calories</span>
                  <span className="text-sm text-gray-600">{crop.calories}</span>
                </div>
                <Progress value={calculateProgress(crop.calories)} className="h-2" />
              </div>
            )}
            {crop.protein && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Protein</span>
                  <span className="text-sm text-gray-600">{crop.protein}</span>
                </div>
                <Progress value={calculateProgress(crop.protein)} className="h-2" />
              </div>
            )}
            {crop.carbohydrates && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Carbohydrates</span>
                  <span className="text-sm text-gray-600">{crop.carbohydrates}</span>
                </div>
                <Progress value={calculateProgress(crop.carbohydrates)} className="h-2" />
              </div>
            )}
            {crop.fat && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Fat</span>
                  <span className="text-sm text-gray-600">{crop.fat}</span>
                </div>
                <Progress value={calculateProgress(crop.fat)} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pest & Disease Risk Matrix */}
      {(crop.pest_name || crop.disease_name || crop.nematode_name) && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Shield className="h-5 w-5 text-red-500" />
              Risk Assessment Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {crop.pest_name && (
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Bug className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 mb-1">Pest Risk</p>
                  <Badge variant="outline" className={`${getStatusColor(crop.pest_etl || 'Medium')}`}>
                    {crop.pest_etl || 'Medium'}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">{crop.pest_name}</p>
                </div>
              )}
              {crop.disease_name && (
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 mb-1">Disease Risk</p>
                  <Badge variant="outline" className={`${getStatusColor(crop.disease_life_cycle || 'Medium')}`}>
                    {crop.disease_life_cycle || 'Medium'}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">{crop.disease_name}</p>
                </div>
              )}
              {crop.nematode_name && (
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 mb-1">Nematode Risk</p>
                  <Badge variant="outline" className={`${getStatusColor(crop.nematode_etl || 'Medium')}`}>
                    {crop.nematode_etl || 'Medium'}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">{crop.nematode_name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Timeline */}
      {(crop.sowing_time || crop.harvest_time || crop.growth_duration) && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Growth Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Sowing</p>
                  <p className="text-sm text-gray-600">{crop.sowing_time || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Growth Duration</p>
                  <p className="text-sm text-gray-600">{crop.growth_duration || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-yellow-600">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Harvest</p>
                  <p className="text-sm text-gray-600">{crop.harvest_time || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Performance Indicators */}
      {(crop.average_yield || crop.market_price || crop.cost_of_cultivation) && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Market Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {crop.average_yield && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getTrendIcon(crop.average_yield)}
                  </div>
                  <p className="text-sm font-medium text-gray-800">Average Yield</p>
                  <p className="text-lg font-bold text-green-600">{crop.average_yield}</p>
                </div>
              )}
              {crop.market_price && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getTrendIcon(crop.market_price)}
                  </div>
                  <p className="text-sm font-medium text-gray-800">Market Price</p>
                  <p className="text-lg font-bold text-blue-600">{crop.market_price}</p>
                </div>
              )}
              {crop.cost_of_cultivation && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getTrendIcon(crop.cost_of_cultivation)}
                  </div>
                  <p className="text-sm font-medium text-gray-800">Cost of Cultivation</p>
                  <p className="text-lg font-bold text-orange-600">{crop.cost_of_cultivation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sustainability Score */}
      {(crop.sustainability_potential || crop.climate_resilience || crop.carbon_footprint) && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Leaf className="h-5 w-5 text-green-500" />
              Sustainability Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crop.sustainability_potential && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Sustainability Potential</span>
                    <Badge variant="outline" className={getStatusColor(crop.sustainability_potential)}>
                      {crop.sustainability_potential}
                    </Badge>
                  </div>
                  <Progress value={calculateProgress(crop.sustainability_potential)} className="h-2" />
                </div>
              )}
              {crop.climate_resilience && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Climate Resilience</span>
                    <Badge variant="outline" className={getStatusColor(crop.climate_resilience)}>
                      {crop.climate_resilience}
                    </Badge>
                  </div>
                  <Progress value={calculateProgress(crop.climate_resilience)} className="h-2" />
                </div>
              )}
              {crop.carbon_footprint && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Carbon Footprint</span>
                    <Badge variant="outline" className={getStatusColor(crop.carbon_footprint)}>
                      {crop.carbon_footprint}
                    </Badge>
                  </div>
                  <Progress value={calculateProgress(crop.carbon_footprint)} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataVisualization;
