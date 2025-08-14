import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  X, 
  Zap, 
  Target, 
  Thermometer, 
  Droplets, 
  Leaf,
  TrendingUp,
  DollarSign,
  Shield,
  Clock,
  MapPin,
  Star,
  Save,
  Loader2
} from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  loading?: boolean;
}

interface SearchFilters {
  query: string;
  category: string;
  climate: string;
  waterRequirement: string;
  yieldRange: [number, number];
  durationRange: [number, number];
  sustainability: string;
  marketPotential: string;
  technology: boolean;
  organic: boolean;
  exportReady: boolean;
  giStatus: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onClear, loading = false }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    climate: 'all',
    waterRequirement: 'all',
    yieldRange: [0, 100],
    durationRange: [0, 365],
    sustainability: 'all',
    marketPotential: 'all',
    technology: false,
    organic: false,
    exportReady: false,
    giStatus: false
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: '',
      category: 'all',
      climate: 'all',
      waterRequirement: 'all',
      yieldRange: [0, 100],
      durationRange: [0, 365],
      sustainability: 'all',
      marketPotential: 'all',
      technology: false,
      organic: false,
      exportReady: false,
      giStatus: false
    });
    onClear();
  };

  const saveFilter = () => {
    const filterName = `Filter ${savedFilters.length + 1}`;
    setSavedFilters(prev => [...prev, filterName]);
    // In a real app, you'd save to localStorage or backend
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category !== 'all') count++;
    if (filters.climate !== 'all') count++;
    if (filters.waterRequirement !== 'all') count++;
    if (filters.sustainability !== 'all') count++;
    if (filters.marketPotential !== 'all') count++;
    if (filters.technology) count++;
    if (filters.organic) count++;
    if (filters.exportReady) count++;
    if (filters.giStatus) count++;
    return count;
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-800">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Advanced Search
            {getActiveFiltersCount() > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-yellow-600"
            >
              <Filter className="h-4 w-4" />
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-600 hover:text-red-600"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Search Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search across all crop data (name, scientific name, characteristics, etc.)..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 space-y-6">
            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cereals">Cereals</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="medicinal">Medicinal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Climate Zone</label>
                <Select value={filters.climate} onValueChange={(value) => handleFilterChange('climate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Climates</SelectItem>
                    <SelectItem value="tropical">Tropical</SelectItem>
                    <SelectItem value="subtropical">Subtropical</SelectItem>
                    <SelectItem value="temperate">Temperate</SelectItem>
                    <SelectItem value="arid">Arid</SelectItem>
                    <SelectItem value="alpine">Alpine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Water Requirement</label>
                <Select value={filters.waterRequirement} onValueChange={(value) => handleFilterChange('waterRequirement', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requirements</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Range Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Yield Range (tons/ha): {filters.yieldRange[0]} - {filters.yieldRange[1]}
                </label>
                <Slider
                  value={filters.yieldRange}
                  onValueChange={(value) => handleFilterChange('yieldRange', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Growth Duration (days): {filters.durationRange[0]} - {filters.durationRange[1]}
                </label>
                <Slider
                  value={filters.durationRange}
                  onValueChange={(value) => handleFilterChange('durationRange', value)}
                  max={365}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Advanced Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sustainability</label>
                <Select value={filters.sustainability} onValueChange={(value) => handleFilterChange('sustainability', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Market Potential</label>
                <Select value={filters.marketPotential} onValueChange={(value) => handleFilterChange('marketPotential', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Potentials</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="technology"
                  checked={filters.technology}
                  onCheckedChange={(checked) => handleFilterChange('technology', checked)}
                />
                <label htmlFor="technology" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Technology Ready
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organic"
                  checked={filters.organic}
                  onCheckedChange={(checked) => handleFilterChange('organic', checked)}
                />
                <label htmlFor="organic" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Organic
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exportReady"
                  checked={filters.exportReady}
                  onCheckedChange={(checked) => handleFilterChange('exportReady', checked)}
                />
                <label htmlFor="exportReady" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Export Ready
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="giStatus"
                  checked={filters.giStatus}
                  onCheckedChange={(checked) => handleFilterChange('giStatus', checked)}
                />
                <label htmlFor="giStatus" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  GI Status
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={saveFilter}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Filter
                </Button>
                {savedFilters.length > 0 && (
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Load saved filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedFilters.map((filter, index) => (
                        <SelectItem key={index} value={filter}>
                          {filter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
