import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Thermometer, 
  Droplet, 
  Sun, 
  Leaf, 
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

interface DataVisualizationProps {
  cropData: any;
  type: 'yield' | 'nutrition' | 'climate' | 'comparison';
  className?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ 
  cropData, 
  type, 
  className = '' 
}) => {
  // Generate yield trend data
  const generateYieldData = (crop: any) => {
    if (!crop.average_yield && !crop.yield) return [];
    
    const baseYield = parseFloat(crop.average_yield?.replace(/[^\d.-]/g, '') || crop.yield?.replace(/[^\d.-]/g, '') || '0');
    
    return [
      { month: 'Jan', yield: baseYield * 0.8, target: baseYield },
      { month: 'Feb', yield: baseYield * 0.85, target: baseYield },
      { month: 'Mar', yield: baseYield * 0.9, target: baseYield },
      { month: 'Apr', yield: baseYield * 0.95, target: baseYield },
      { month: 'May', yield: baseYield, target: baseYield },
      { month: 'Jun', yield: baseYield * 1.05, target: baseYield },
      { month: 'Jul', yield: baseYield * 1.1, target: baseYield },
      { month: 'Aug', yield: baseYield * 1.15, target: baseYield },
      { month: 'Sep', yield: baseYield * 1.2, target: baseYield },
      { month: 'Oct', yield: baseYield * 1.1, target: baseYield },
      { month: 'Nov', yield: baseYield * 0.95, target: baseYield },
      { month: 'Dec', yield: baseYield * 0.9, target: baseYield }
    ];
  };

  // Generate nutritional composition data
  const generateNutritionData = (crop: any) => {
    const nutritionData = [];
    
    if (crop.calories) {
      nutritionData.push({ name: 'Calories', value: parseFloat(crop.calories.replace(/[^\d.-]/g, '')) || 0, color: '#ef4444' });
    }
    if (crop.protein) {
      nutritionData.push({ name: 'Protein', value: parseFloat(crop.protein.replace(/[^\d.-]/g, '')) || 0, color: '#3b82f6' });
    }
    if (crop.carbohydrates) {
      nutritionData.push({ name: 'Carbs', value: parseFloat(crop.carbohydrates.replace(/[^\d.-]/g, '')) || 0, color: '#10b981' });
    }
    if (crop.fat) {
      nutritionData.push({ name: 'Fat', value: parseFloat(crop.fat.replace(/[^\d.-]/g, '')) || 0, color: '#f59e0b' });
    }
    if (crop.fiber) {
      nutritionData.push({ name: 'Fiber', value: parseFloat(crop.fiber.replace(/[^\d.-]/g, '')) || 0, color: '#8b5cf6' });
    }
    
    return nutritionData.length > 0 ? nutritionData : [
      { name: 'Sample Data', value: 100, color: '#6b7280' }
    ];
  };

  // Generate climate suitability radar data
  const generateClimateData = (crop: any) => {
    const climateData = [
      { subject: 'Temperature', A: 80, B: 70, fullMark: 100 },
      { subject: 'Humidity', A: 75, B: 65, fullMark: 100 },
      { subject: 'Rainfall', A: 85, B: 75, fullMark: 100 },
      { subject: 'Sunlight', A: 90, B: 80, fullMark: 100 },
      { subject: 'Soil pH', A: 70, B: 60, fullMark: 100 },
      { subject: 'Altitude', A: 65, B: 55, fullMark: 100 }
    ];

    // Adjust based on actual crop data if available
    if (crop.optimum_temp) {
      const temp = parseFloat(crop.optimum_temp.replace(/[^\d.-]/g, ''));
      if (!isNaN(temp)) {
        climateData[0].A = Math.min(100, Math.max(0, 100 - Math.abs(temp - 25) * 2));
      }
    }

    return climateData;
  };

  // Generate comparison data for multiple crops
  const generateComparisonData = (crops: any[]) => {
    if (!Array.isArray(crops) || crops.length === 0) return [];
    
    return crops.map(crop => ({
      name: crop.name || 'Unknown',
      yield: parseFloat(crop.average_yield?.replace(/[^\d.-]/g, '') || crop.yield?.replace(/[^\d.-]/g, '') || '0'),
      duration: parseFloat(crop.growth_duration?.replace(/[^\d.-]/g, '') || '0'),
      temp: parseFloat(crop.optimum_temp?.replace(/[^\d.-]/g, '') || '0'),
      water: crop.water_requirement === 'high' ? 3 : crop.water_requirement === 'medium' ? 2 : 1
    }));
  };

  const renderYieldChart = () => {
    const data = generateYieldData(cropData);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value: any, name: string) => [
              `${value.toFixed(1)} tons/ha`, 
              name === 'yield' ? 'Actual Yield' : 'Target Yield'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="yield" 
            stackId="1" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.6}
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderNutritionChart = () => {
    const data = generateNutritionData(cropData);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => [`${value} g/100g`, 'Amount']} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderClimateChart = () => {
    const data = generateClimateData(cropData);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Current Conditions"
            dataKey="A"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Radar
            name="Optimal Range"
            dataKey="B"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.1}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderComparisonChart = () => {
    const data = generateComparisonData(Array.isArray(cropData) ? cropData : [cropData]);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="yield" fill="#10b981" name="Yield (tons/ha)" />
          <Bar dataKey="duration" fill="#3b82f6" name="Duration (days)" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const getChartTitle = () => {
    switch (type) {
      case 'yield': return 'Yield Trends & Targets';
      case 'nutrition': return 'Nutritional Composition';
      case 'climate': return 'Climate Suitability';
      case 'comparison': return 'Crop Comparison';
      default: return 'Data Visualization';
    }
  };

  const getChartIcon = () => {
    switch (type) {
      case 'yield': return <TrendingUp className="h-5 w-5" />;
      case 'nutrition': return <Leaf className="h-5 w-5" />;
      case 'climate': return <Thermometer className="h-5 w-5" />;
      case 'comparison': return <BarChart3 className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'yield': return renderYieldChart();
      case 'nutrition': return renderNutritionChart();
      case 'climate': return renderClimateChart();
      case 'comparison': return renderComparisonChart();
      default: return <div>Select a chart type</div>;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getChartIcon()}
            {getChartTitle()}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
