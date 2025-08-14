import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCropByName } from '@/data/cropData';
import { ArrowLeft, Info, Wheat, Leaf, Dna, Shield, Apple, Scissors, TrendingUp, BookOpen } from 'lucide-react';

interface ProfessionalCropProfileProps {
  cropName: string;
  onBack: () => void;
}

const ProfessionalCropProfile: React.FC<ProfessionalCropProfileProps> = ({ cropName, onBack }) => {
  const crop = getCropByName(cropName);

  if (!crop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Crop Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onBack}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderField = (label: string, value: any) => {
    if (!value || value === '') return null;
    return (
      <div className="flex justify-between py-2 border-b border-slate-200 last:border-b-0">
        <span className="font-medium text-slate-700">{label}:</span>
        <span className="text-slate-600 text-right max-w-xs">
          {Array.isArray(value) ? value.join(', ') : value}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Wheat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{crop.name}</h1>
                  <p className="text-slate-600 italic">{crop.scientificName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="morphology">Morphology</TabsTrigger>
            <TabsTrigger value="genetics">Genetics</TabsTrigger>
            <TabsTrigger value="cultivation">Cultivation</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="varieties">Varieties</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="harvest">Harvest</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Scientific Name", crop.scientificName)}
                  {renderField("Family", crop.family)}
                  {renderField("Origin", crop.origin)}
                  {renderField("Description", crop.description)}
                  <div className="flex gap-2 mt-3">
                    {crop.season.map((season, index) => (
                      <Badge key={index} variant="secondary">
                        {season}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-orange-600" />
                    Climate & Soil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Temperature", crop.climate.temperature)}
                  {renderField("Rainfall", crop.climate.rainfall)}
                  {renderField("Humidity", crop.climate.humidity)}
                  {renderField("Soil Types", crop.soil.type)}
                  {renderField("pH Range", crop.soil.ph)}
                  {renderField("Drainage", crop.soil.drainage)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="morphology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Plant Morphology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {renderField("Growth Habit", crop.morphology?.growthHabit)}
                {renderField("Life Span", crop.morphology?.lifeSpan)}
                {renderField("Plant Type", crop.morphology?.plantType)}
                {renderField("Root System", crop.morphology?.rootSystem)}
                {renderField("Leaf", crop.morphology?.leaf)}
                {renderField("Flowering Season", crop.morphology?.floweringSeason)}
                {renderField("Edible Part", crop.morphology?.ediblePart)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genetics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dna className="h-5 w-5 text-purple-600" />
                    Genetics & Breeding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Chromosome Number", crop.genetics?.chromosomeNumber)}
                  {renderField("Breeding Methods", crop.genetics?.breedingMethods)}
                  {renderField("Research Institutes", crop.genetics?.researchInstitutes)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-pink-600" />
                    Reproduction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Pollination", crop.reproduction?.pollination)}
                  {renderField("Propagation Type", crop.reproduction?.propagationType)}
                  {renderField("Planting Material", crop.reproduction?.plantingMaterial)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cultivation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-amber-600" />
                  Cultivation Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Land Preparation</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {crop.cultivation.landPreparation.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Sowing</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {crop.cultivation.sowing.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    Nutrient Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("NPK-N", crop.management?.npkN)}
                  {renderField("NPK-P", crop.management?.npkP)}
                  {renderField("NPK-K", crop.management?.npkK)}
                  {renderField("Micronutrient Needs", crop.management?.micronutrientNeeds)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Pests & Diseases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Major Pests</h4>
                      <div className="space-y-1">
                        {crop.pests.map((pest, index) => (
                          <div key={index} className="text-sm text-slate-600">• {pest}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Major Diseases</h4>
                      <div className="space-y-1">
                        {crop.diseases.map((disease, index) => (
                          <div key={index} className="text-sm text-slate-600">• {disease}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="varieties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Crop Varieties ({crop.varieties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crop.varieties.map((variety, index) => (
                    <Card key={index} className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{variety.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Yield:</span>
                          <span className="text-sm text-slate-600">{variety.yield}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm text-slate-600">{variety.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">States:</span>
                          <span className="text-sm text-slate-600">{variety.states.join(', ')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  Nutritional Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Macronutrients</h4>
                    {renderField("Calories", crop.nutrition?.calories)}
                    {renderField("Protein", crop.nutrition?.protein)}
                    {renderField("Carbohydrates", crop.nutrition?.carbohydrates)}
                    {renderField("Fat", crop.nutrition?.fat)}
                    {renderField("Fiber", crop.nutrition?.fiber)}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Micronutrients</h4>
                    {renderField("Vitamins", crop.nutrition?.vitamins)}
                    {renderField("Minerals", crop.nutrition?.minerals)}
                    {renderField("Health Benefits", crop.nutrition?.healthBenefits)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="harvest" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-orange-600" />
                  Harvest & Post-Harvest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Harvest Information</h4>
                    {renderField("Harvest Time", crop.harvest?.harvestTime)}
                    {renderField("Maturity Indicators", crop.harvest?.maturityIndicators)}
                    {renderField("Harvesting Tools", crop.harvest?.harvestingTools)}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Storage & Processing</h4>
                    {renderField("Storage Conditions", crop.harvest?.storageConditions)}
                    {renderField("Shelf Life", crop.harvest?.shelfLife)}
                    {renderField("Processed Products", crop.harvest?.processedProducts)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Economics & Market
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Average Yield", crop.economics.averageYield)}
                  {renderField("Market Price", crop.economics.marketPrice)}
                  {renderField("Cost of Cultivation", crop.economics.costOfCultivation)}
                  <div className="mt-3">
                    <h5 className="font-medium mb-2">Major States:</h5>
                    <div className="flex flex-wrap gap-2">
                      {crop.economics.majorStates.map((state, index) => (
                        <Badge key={index} variant="outline">
                          {state}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Market Trends", crop.market?.marketTrends)}
                  {renderField("Export Potential", crop.market?.exportPotential)}
                  {renderField("Certifications", crop.market?.certifications)}
                  {renderField("Subsidies", crop.market?.subsidies)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Key Takeaways", crop.insights?.keyTakeaways)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-red-600" />
                    Cultural & Traditional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {renderField("Religious Use", crop.cultural?.religiousUse)}
                  {renderField("Traditional Uses", crop.cultural?.traditionalUses)}
                  {renderField("Fun Fact", crop.cultural?.funFact)}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  SWOT Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                      <p className="text-sm text-green-700">{crop.insights?.swotStrengths}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">Weaknesses</h4>
                      <p className="text-sm text-red-700">{crop.insights?.swotWeaknesses}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Opportunities</h4>
                      <p className="text-sm text-blue-700">{crop.insights?.swotOpportunities}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">Threats</h4>
                      <p className="text-sm text-orange-700">{crop.insights?.swotThreats}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalCropProfile;
