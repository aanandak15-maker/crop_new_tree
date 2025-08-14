import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Filter, 
  X, 
  Search, 
  Thermometer, 
  Droplet, 
  Mountain, 
  Sun, 
  Leaf, 
  Zap, 
  Heart, 
  Target, 
  TrendingUp, 
  Shield, 
  Award,
  RefreshCw,
  Save,
  Loader2
} from 'lucide-react';

interface FilterCriteria {
  // Basic filters
  name?: string;
  scientific_name?: string;
  season?: string[];
  climate_type?: string[];
  soil_type?: string[];
  
  // Growing conditions
  water_requirement?: string;
  growth_duration?: string;
  optimum_temp?: string;
  altitude?: string;
  light_requirement?: string;
  
  // Plant characteristics
  plant_type?: string;
  growth_habit?: string;
  life_span?: string;
  root_system?: string;
  
  // Nutritional filters
  calories_min?: number;
  calories_max?: number;
  protein_min?: number;
  protein_max?: number;
  vitamins?: string[];
  
  // Market filters
  market_demand?: string;
  export_potential?: string;
  certifications?: string[];
  
  // Special features
  gi_status?: boolean;
  patents?: boolean;
  ai_ml_iot?: boolean;
  
  // Pest & Disease resistance
  pest_resistance?: string[];
  disease_resistance?: string[];
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterCriteria) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFiltersChange, 
  onClearFilters, 
  isLoading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [savedFilters, setSavedFilters] = useState<{ [key: string]: FilterCriteria }>({});

  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof FilterCriteria, value: string, checked: boolean) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  const handleSaveFilters = () => {
    const filterName = prompt('Enter a name for these filters:');
    if (filterName && filterName.trim()) {
      setSavedFilters(prev => ({
        ...prev,
        [filterName.trim()]: { ...filters }
      }));
    }
  };

  const handleLoadFilters = (filterName: string) => {
    const savedFilter = savedFilters[filterName];
    if (savedFilter) {
      setFilters(savedFilter);
      onFiltersChange(savedFilter);
    }
  };

  const handleDeleteSavedFilter = (filterName: string) => {
    const newSavedFilters = { ...savedFilters };
    delete newSavedFilters[filterName];
    setSavedFilters(newSavedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof FilterCriteria];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== '';
    }).length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-crop-green hover:text-crop-green/80"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="growing">Growing</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="special">Special</TabsTrigger>
            </TabsList>

            {/* Basic Filters Tab */}
            <TabsContent value="basic" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name-filter">Crop Name</Label>
                  <Input
                    id="name-filter"
                    placeholder="Search crop names..."
                    value={filters.name || ''}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scientific-name-filter">Scientific Name</Label>
                  <Input
                    id="scientific-name-filter"
                    placeholder="Search scientific names..."
                    value={filters.scientific_name || ''}
                    onChange={(e) => handleFilterChange('scientific_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Season</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['Rabi', 'Kharif', 'Zaid'].map((season) => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={(filters.season || []).includes(season)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('season', season, checked as boolean)
                        }
                      />
                      <Label htmlFor={`season-${season}`} className="text-sm">{season}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Climate Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Tropical', 'Subtropical', 'Temperate', 'Arid', 'Semi-arid'].map((climate) => (
                    <div key={climate} className="flex items-center space-x-2">
                      <Checkbox
                        id={`climate-${climate}`}
                        checked={(filters.climate_type || []).includes(climate)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('climate_type', climate, checked as boolean)
                        }
                      />
                      <Label htmlFor={`climate-${climate}`} className="text-sm">{climate}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Growing Conditions Tab */}
            <TabsContent value="growing" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="water-requirement">Water Requirement</Label>
                  <Select 
                    value={filters.water_requirement || ''} 
                    onValueChange={(value) => handleFilterChange('water_requirement', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select water requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growth-duration">Growth Duration</Label>
                  <Select 
                    value={filters.growth_duration || ''} 
                    onValueChange={(value) => handleFilterChange('growth_duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (60-90 days)</SelectItem>
                      <SelectItem value="medium">Medium (90-120 days)</SelectItem>
                      <SelectItem value="long">Long (120+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="optimum-temp">Optimum Temperature (°C)</Label>
                  <Input
                    id="optimum-temp"
                    placeholder="e.g., 25-30"
                    value={filters.optimum_temp || ''}
                    onChange={(e) => handleFilterChange('optimum_temp', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="altitude">Altitude (m)</Label>
                  <Input
                    id="altitude"
                    placeholder="e.g., 0-1000"
                    value={filters.altitude || ''}
                    onChange={(e) => handleFilterChange('altitude', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Plant Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Annual', 'Perennial', 'Biennial', 'Herb', 'Shrub', 'Tree'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`plant-type-${type}`}
                        checked={(filters.plant_type || []).includes(type)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('plant_type', type, checked as boolean)
                        }
                      />
                      <Label htmlFor={`plant-type-${type}`} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories-min">Calories (min)</Label>
                  <Input
                    id="calories-min"
                    type="number"
                    placeholder="0"
                    value={filters.calories_min || ''}
                    onChange={(e) => handleFilterChange('calories_min', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories-max">Calories (max)</Label>
                  <Input
                    id="calories-max"
                    type="number"
                    placeholder="1000"
                    value={filters.calories_max || ''}
                    onChange={(e) => handleFilterChange('calories_max', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein-min">Protein (min %)</Label>
                  <Input
                    id="protein-min"
                    type="number"
                    placeholder="0"
                    value={filters.protein_min || ''}
                    onChange={(e) => handleFilterChange('protein_min', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protein-max">Protein (max %)</Label>
                  <Input
                    id="protein-max"
                    type="number"
                    placeholder="50"
                    value={filters.protein_max || ''}
                    onChange={(e) => handleFilterChange('protein_max', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Vitamins</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D', 'Vitamin E', 'Vitamin K'].map((vitamin) => (
                    <div key={vitamin} className="flex items-center space-x-2">
                      <Checkbox
                        id={`vitamin-${vitamin}`}
                        checked={(filters.vitamins || []).includes(vitamin)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('vitamins', vitamin, checked as boolean)
                        }
                      />
                      <Label htmlFor={`vitamin-${vitamin}`} className="text-sm">{vitamin}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Market Tab */}
            <TabsContent value="market" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="market-demand">Market Demand</Label>
                  <Select 
                    value={filters.market_demand || ''} 
                    onValueChange={(value) => handleFilterChange('market_demand', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select demand level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-potential">Export Potential</Label>
                  <Select 
                    value={filters.export_potential || ''} 
                    onValueChange={(value) => handleFilterChange('export_potential', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select export potential" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Certifications</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Organic', 'Fair Trade', 'Rainforest Alliance', 'UTZ', 'Global GAP', 'ISO'].map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cert-${cert}`}
                        checked={(filters.certifications || []).includes(cert)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('certifications', cert, checked as boolean)
                        }
                      />
                      <Label htmlFor={`cert-${cert}`} className="text-sm">{cert}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Special Features Tab */}
            <TabsContent value="special" className="mt-4 space-y-4">
              <div className="space-y-3">
                <Label>Special Features</Label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gi-status"
                      checked={filters.gi_status || false}
                      onCheckedChange={(checked) => handleFilterChange('gi_status', checked)}
                    />
                    <Label htmlFor="gi-status" className="text-sm">Geographical Indication (GI) Status</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="patents"
                      checked={filters.patents || false}
                      onCheckedChange={(checked) => handleFilterChange('patents', checked)}
                    />
                    <Label htmlFor="patents" className="text-sm">Patented Varieties</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ai-ml-iot"
                      checked={filters.ai_ml_iot || false}
                      onCheckedChange={(checked) => handleFilterChange('ai_ml_iot', checked)}
                    />
                    <Label htmlFor="ai-ml-iot" className="text-sm">AI/ML/IoT Integration</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Resistance Traits</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Drought', 'Flood', 'Heat', 'Cold', 'Salinity', 'Disease'].map((trait) => (
                    <div key={trait} className="flex items-center space-x-2">
                      <Checkbox
                        id={`resistance-${trait}`}
                        checked={(filters.pest_resistance || []).includes(trait)}
                        onCheckedChange={(checked) => 
                          handleArrayFilterChange('pest_resistance', trait, checked as boolean)
                        }
                      />
                      <Label htmlFor={`resistance-${trait}`} className="text-sm">{trait}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveFilters}
                disabled={activeFilterCount === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Filters
              </Button>
              
              {Object.keys(savedFilters).length > 0 && (
                <Select onValueChange={handleLoadFilters}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Load saved filters" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(savedFilters).map((filterName) => (
                      <SelectItem key={filterName} value={filterName}>
                        <div className="flex items-center justify-between w-full">
                          <span>{filterName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSavedFilter(filterName);
                            }}
                            className="h-6 w-6 p-0 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                disabled={activeFilterCount === 0}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdvancedFilters;
