import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { getCropByName } from '@/data/cropData';
import DataVisualization from './DataVisualization';
import CollapsibleSection from './CollapsibleSection';
import InfoTooltip from './InfoTooltip';
import AIInsights from './AIInsights';
import CropComparison from './CropComparison';
import { 
  ArrowLeft, Info, Wheat, Leaf, Shield, Apple, TrendingUp, 
  Sprout, Bug, MapPin, Clock, Loader2, AlertTriangle, Droplets, 
  Thermometer, Sun, Zap, Target, Users, Globe, Award, 
  BookOpen, Lightbulb, Heart, Brain, Activity, GitCompare
} from 'lucide-react';

interface EnhancedCropProfileProps {
  cropName: string;
  onBack: () => void;
}

const EnhancedCropProfile: React.FC<EnhancedCropProfileProps> = ({ cropName, onBack }) => {
  const [crop, setCrop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setLoading(true);
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

        if (data) {
          setCrop(data);
          return;
        }

        // Fallback to static dataset
        const staticCrop = getCropByName(cropName);
        if (staticCrop) {
          setCrop(staticCrop);
        } else {
          setError('Crop not found');
        }
      } catch (err) {
        setError('Failed to fetch crop data');
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [cropName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading crop information...</p>
        </div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Crop</h2>
          <p className="text-gray-600 mb-4">{error || 'Crop not found'}</p>
          <Button onClick={onBack} className="bg-yellow-400 text-gray-800 hover:bg-yellow-500">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const renderQuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4 text-center">
          <Sprout className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800">Varieties</p>
          <p className="text-2xl font-bold text-yellow-600">
            {crop.varieties?.length || 0}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4 text-center">
          <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800">States</p>
          <p className="text-2xl font-bold text-blue-600">
            {crop.varieties ? [...new Set(crop.varieties.flatMap((v: any) => v.suitable_states || []))].length : 0}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4 text-center">
          <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800">Yield</p>
          <p className="text-2xl font-bold text-green-600">
            {crop.average_yield || 'N/A'}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4 text-center">
          <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800">Duration</p>
          <p className="text-2xl font-bold text-gray-600">
            {crop.growth_duration || 'N/A'}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataVisualization = () => (
    <div className="mb-6">
      <DataVisualization crop={crop} />
    </div>
  );

  const renderAdvancedAgronomy = () => (
    <CollapsibleSection
      title="Advanced Agronomy"
      icon={<Leaf className="h-5 w-5" />}
      badge="Technical"
      status="info"
      defaultExpanded={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">NPK Requirements</span>
              <InfoTooltip content="Nitrogen, Phosphorus, and Potassium requirements for optimal growth" />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">N:</span> {crop.npk_n || 'Not specified'}</p>
              <p><span className="font-medium">P:</span> {crop.npk_p || 'Not specified'}</p>
              <p><span className="font-medium">K:</span> {crop.npk_k || 'Not specified'}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Micronutrients</span>
              <InfoTooltip content="Essential micronutrients required for healthy crop development" />
            </div>
            <p className="text-sm text-gray-600">{crop.micronutrient_needs || 'Not specified'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Application Schedule</span>
              <InfoTooltip content="Recommended timing and frequency for fertilizer application" />
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Method:</span> {crop.application_schedule_method || 'Not specified'}</p>
              <p><span className="font-medium">Stages:</span> {crop.application_schedule_stages || 'Not specified'}</p>
              <p><span className="font-medium">Frequency:</span> {crop.application_schedule_frequency || 'Not specified'}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Biofertilizer Usage</span>
              <InfoTooltip content="Organic and biological fertilizer recommendations" />
            </div>
            <p className="text-sm text-gray-600">{crop.biofertilizer_usage || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );

  const renderSustainabilityMetrics = () => (
    <CollapsibleSection
      title="Sustainability & Climate"
      icon={<Globe className="h-5 w-5" />}
      badge="Modern"
      status="success"
      defaultExpanded={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Climate Resilience</span>
              <InfoTooltip content="Ability to withstand climate change impacts" />
            </div>
            <p className="text-sm text-gray-600">{crop.climate_resilience || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Carbon Footprint</span>
              <InfoTooltip content="Environmental impact in terms of carbon emissions" />
            </div>
            <p className="text-sm text-gray-600">{crop.carbon_footprint || 'Not specified'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Sustainability Potential</span>
              <InfoTooltip content="Potential for sustainable farming practices" />
            </div>
            <p className="text-sm text-gray-600">{crop.sustainability_potential || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Waste to Wealth</span>
              <InfoTooltip content="Opportunities to convert waste into valuable products" />
            </div>
            <p className="text-sm text-gray-600">{crop.waste_to_wealth || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );

  const renderTechnologyIntegration = () => (
    <CollapsibleSection
      title="Technology & Innovation"
      icon={<Zap className="h-5 w-5" />}
      badge="Future"
      status="info"
      defaultExpanded={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">AI/ML/IoT Applications</span>
              <InfoTooltip content="Artificial Intelligence, Machine Learning, and Internet of Things applications" />
            </div>
            <p className="text-sm text-gray-600">{crop.ai_ml_iot || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Smart Farming</span>
              <InfoTooltip content="Precision agriculture and smart farming techniques" />
            </div>
            <p className="text-sm text-gray-600">{crop.smart_farming || 'Not specified'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Research Institutes</span>
              <InfoTooltip content="Leading research institutions working on this crop" />
            </div>
            <p className="text-sm text-gray-600">{crop.research_institutes || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800">Patents</span>
              <InfoTooltip content="Patents and intellectual property related to this crop" />
            </div>
            <p className="text-sm text-gray-600">{crop.patents || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );

  const renderSWOTAnalysis = () => (
    <CollapsibleSection
      title="SWOT Analysis"
      icon={<Target className="h-5 w-5" />}
      badge="Strategic"
      status="warning"
      defaultExpanded={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-green-800">Strengths</span>
              <InfoTooltip content="Internal positive factors and advantages" />
            </div>
            <p className="text-sm text-gray-600">{crop.swot_strengths || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-red-800">Weaknesses</span>
              <InfoTooltip content="Internal limitations and areas for improvement" />
            </div>
            <p className="text-sm text-gray-600">{crop.swot_weaknesses || 'Not specified'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Opportunities</span>
              <InfoTooltip content="External factors that could be beneficial" />
            </div>
            <p className="text-sm text-gray-600">{crop.swot_opportunities || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-orange-800">Threats</span>
              <InfoTooltip content="External factors that could be harmful" />
            </div>
            <p className="text-sm text-gray-600">{crop.swot_threats || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-600 hover:text-yellow-600"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{crop.name}</h1>
                <p className="text-sm text-gray-600">{crop.scientific_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowComparison(true)}
                variant="outline"
                size="sm"
                className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
              </Button>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                Enhanced View
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full bg-white border border-gray-200 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
              <TabsTrigger value="sustainability" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Sustainability</span>
              </TabsTrigger>
              <TabsTrigger value="technology" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Technology</span>
              </TabsTrigger>
              <TabsTrigger value="strategy" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-800">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Strategy</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {renderQuickStats()}
            {renderDataVisualization()}
            <AIInsights crop={crop} />
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            {renderAdvancedAgronomy()}
          </TabsContent>

          {/* Sustainability Tab */}
          <TabsContent value="sustainability" className="space-y-6">
            {renderSustainabilityMetrics()}
          </TabsContent>

          {/* Technology Tab */}
          <TabsContent value="technology" className="space-y-6">
            {renderTechnologyIntegration()}
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            {renderSWOTAnalysis()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Crop Comparison Modal */}
      {showComparison && (
        <CropComparison onClose={() => setShowComparison(false)} />
      )}
    </div>
  );
};

export default EnhancedCropProfile;
