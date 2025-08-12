import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CropTemplate, CropCategory } from '@/types/cropTemplates';
import { cropTemplates } from '@/data/cropTemplates';
import { Wheat, Sprout, Apple, Leaf, Scissors, Flower2, Pill, Zap } from 'lucide-react';

interface CropTemplateSelectorProps {
  onTemplateSelect: (template: CropTemplate) => void;
  selectedTemplateId?: string;
}

const getCategoryIcon = (category: CropCategory) => {
  switch (category) {
    case 'cereal':
      return <Wheat className="h-6 w-6" />;
    case 'pulse':
      return <Sprout className="h-6 w-6" />;
    case 'oilseed':
      return <Leaf className="h-6 w-6" />;
    case 'vegetable':
      return <Apple className="h-6 w-6" />;
    case 'fruit':
      return <Apple className="h-6 w-6" />;
    case 'spice':
      return <Zap className="h-6 w-6" />;
    case 'fiber':
      return <Scissors className="h-6 w-6" />;
    case 'medicinal':
      return <Pill className="h-6 w-6" />;
    default:
      return <Flower2 className="h-6 w-6" />;
  }
};

const getCategoryColor = (category: CropCategory) => {
  switch (category) {
    case 'cereal':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'pulse':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'oilseed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'vegetable':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'fruit':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'spice':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'fiber':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'medicinal':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const CropTemplateSelector: React.FC<CropTemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplateId
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Crop Template</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose a template based on the crop type you want to add. Each template comes with 
          pre-filled common values and field validation to ensure data quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cropTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const categoryColor = getCategoryColor(template.category);
          
          return (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryColor}`}>
                      {getCategoryIcon(template.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className={categoryColor}>
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 mb-4">
                  {template.description}
                </CardDescription>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Required Fields:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {template.baseFields.length}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Optional Fields:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {template.optionalFields.length}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pre-filled Values:</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {Object.keys(template.defaultValues).length}
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  className={`w-full mt-4 ${
                    isSelected 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  variant={isSelected ? 'default' : 'outline'}
                >
                  {isSelected ? 'Selected' : 'Select Template'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {cropTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flower2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Available</h3>
          <p className="text-gray-600">
            Crop templates will be available here once they are configured.
          </p>
        </div>
      )}
    </div>
  );
};
