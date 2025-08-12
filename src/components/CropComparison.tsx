import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  X, 
  Plus, 
  TrendingUp, 
  Thermometer, 
  Droplets, 
  Leaf, 
  Shield,
  Bug,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Minus,
  BarChart3,
  GitCompare
} from 'lucide-react';
import { getAllCropNames, getCropByName } from '@/data/cropData';
import { supabase } from '@/integrations/supabase/client';

interface CropComparisonProps {
  onClose: () => void;
}

interface ComparisonCrop {
  name: string;
  data: any;
  loading: boolean;
}

const CropComparison: React.FC<CropComparisonProps> = ({ onClose }) => {
  const [selectedCrops, setSelectedCrops] = useState<ComparisonCrop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableCrops();
  }, []);

  const loadAvailableCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('name')
        .order('name');

      if (error) {
        console.error('Error loading crops:', error);
        // Fallback to static data
        setAvailableCrops(getAllCropNames());
        return;
      }

      const cropNames = data.map(crop => crop.name);
      setAvailableCrops(cropNames);
    } catch (err) {
      // Fallback to static data
      setAvailableCrops(getAllCropNames());
    }
  };

  const addCrop = async (cropName: string) => {
    if (selectedCrops.find(crop => crop.name === cropName)) {
      return; // Already selected
    }

    const newCrop: ComparisonCrop = {
      name: cropName,
      data: null,
      loading: true
    };

    setSelectedCrops(prev => [...prev, newCrop]);

    try {
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

      let cropData = data;
      if (!cropData) {
        // Fallback to static data
        cropData = getCropByName(cropName);
      }

      setSelectedCrops(prev => 
        prev.map(crop => 
          crop.name === cropName 
            ? { ...crop, data: cropData, loading: false }
            : crop
        )
      );
    } catch (err) {
      setSelectedCrops(prev => 
        prev.map(crop => 
          crop.name === cropName 
            ? { ...crop, data: null, loading: false }
            : crop
        )
      );
    }
  };

  const removeCrop = (cropName: string) => {
    setSelectedCrops(prev => prev.filter(crop => crop.name !== cropName));
  };

  const filteredCrops = availableCrops.filter(crop =>
    crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComparisonValue = (crop: any, field: string) => {
    if (!crop) return 'N/A';
    return crop[field] || 'N/A';
  };

  const getComparisonScore = (crop: any, field: string) => {
    const value = getComparisonValue(crop, field);
    if (value === 'N/A') return 0;
    
    if (typeof value === 'string') {
      if (value.toLowerCase().includes('high')) return 80;
      if (value.toLowerCase().includes('medium')) return 50;
      if (value.toLowerCase().includes('low')) return 20;
    }
    
    return 50; // Default score
  };

  const renderComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-800">Feature</th>
            {selectedCrops.map(crop => (
              <th key={crop.name} className="text-center p-3 font-semibold text-gray-800 min-w-[200px]">
                {crop.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Basic Info */}
          <tr className="border-b border-gray-100">
            <td className="p-3 font-medium text-gray-700">Scientific Name</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center text-sm text-gray-600">
                {getComparisonValue(crop.data, 'scientific_name')}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="p-3 font-medium text-gray-700">Growth Duration</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center text-sm text-gray-600">
                {getComparisonValue(crop.data, 'growth_duration')}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="p-3 font-medium text-gray-700">Average Yield</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center text-sm text-gray-600">
                {getComparisonValue(crop.data, 'average_yield')}
              </td>
            ))}
          </tr>
          
          {/* Climate & Environment */}
          <tr className="border-b border-gray-100 bg-gray-50">
            <td className="p-3 font-medium text-gray-700">Water Requirement</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center">
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">
                    {getComparisonValue(crop.data, 'water_requirement')}
                  </span>
                  <Progress value={getComparisonScore(crop.data, 'water_requirement')} className="h-2" />
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="p-3 font-medium text-gray-700">Optimum Temperature</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center text-sm text-gray-600">
                {getComparisonValue(crop.data, 'optimum_temp')}
              </td>
            ))}
          </tr>
          
          {/* Market & Economics */}
          <tr className="border-b border-gray-100 bg-gray-50">
            <td className="p-3 font-medium text-gray-700">Market Price</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center text-sm text-gray-600">
                {getComparisonValue(crop.data, 'market_price')}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="p-3 font-medium text-gray-700">Cost of Cultivation</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center text-sm text-gray-600">
                {getComparisonValue(crop.data, 'cost_of_cultivation')}
              </td>
            ))}
          </tr>
          
          {/* Sustainability */}
          <tr className="border-b border-gray-100 bg-gray-50">
            <td className="p-3 font-medium text-gray-700">Climate Resilience</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center">
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">
                    {getComparisonValue(crop.data, 'climate_resilience')}
                  </span>
                  <Progress value={getComparisonScore(crop.data, 'climate_resilience')} className="h-2" />
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="p-3 font-medium text-gray-700">Sustainability Potential</td>
            {selectedCrops.map(crop => (
              <td key={crop.name} className="p-3 text-center">
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">
                    {getComparisonValue(crop.data, 'sustainability_potential')}
                  </span>
                  <Progress value={getComparisonScore(crop.data, 'sustainability_potential')} className="h-2" />
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderVisualComparison = () => (
    <div className="space-y-6">
      {/* Yield Comparison */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Yield Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedCrops.map(crop => (
              <div key={crop.name} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">{crop.name}</div>
                <div className="flex-1">
                  <Progress value={getComparisonScore(crop.data, 'average_yield')} className="h-3" />
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {getComparisonValue(crop.data, 'average_yield')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Climate Suitability */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Thermometer className="h-5 w-5 text-blue-500" />
            Climate Suitability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedCrops.map(crop => (
              <div key={crop.name} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">{crop.name}</div>
                <div className="flex-1">
                  <Progress value={getComparisonScore(crop.data, 'climate_resilience')} className="h-3" />
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {getComparisonValue(crop.data, 'climate_resilience')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Potential */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <DollarSign className="h-5 w-5 text-yellow-500" />
            Market Potential
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedCrops.map(crop => (
              <div key={crop.name} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">{crop.name}</div>
                <div className="flex-1">
                  <Progress value={getComparisonScore(crop.data, 'market_price')} className="h-3" />
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {getComparisonValue(crop.data, 'market_price')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <GitCompare className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-800">Crop Comparison Tool</h2>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              {selectedCrops.length} Crops
            </Badge>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Crop Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select onValueChange={addCrop}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add crop to compare" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCrops.map(crop => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Crops */}
            <div className="flex flex-wrap gap-2">
              {selectedCrops.map(crop => (
                <Badge key={crop.name} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  {crop.name}
                  {crop.loading && <div className="ml-2 animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCrop(crop.name)}
                    className="ml-2 h-4 w-4 p-0 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {selectedCrops.length === 0 ? (
            <div className="text-center py-12">
              <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">No crops selected</h3>
              <p className="text-gray-600 mb-4">Add crops from the dropdown above to start comparing</p>
            </div>
          ) : (
            <Tabs defaultValue="table" className="space-y-6">
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="table" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Feature Matrix
                </TabsTrigger>
                <TabsTrigger value="visual" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Visual Comparison
                </TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-6">
                {renderComparisonTable()}
              </TabsContent>

              <TabsContent value="visual" className="space-y-6">
                {renderVisualComparison()}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropComparison;
