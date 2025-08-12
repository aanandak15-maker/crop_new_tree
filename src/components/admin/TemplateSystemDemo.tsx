import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CropTemplateSelector } from './CropTemplateSelector';
import { CropTemplate } from '@/types/cropTemplates';
import { cropTemplates } from '@/data/cropTemplates';
import { ArrowRight, CheckCircle, Zap, Info } from 'lucide-react';

export const TemplateSystemDemo: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CropTemplate | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  const handleTemplateSelect = (template: CropTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  const resetDemo = () => {
    setSelectedTemplate(null);
    setShowTemplateSelector(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌱 Crop Template System Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how our intelligent crop template system makes adding new crops 
            faster and more accurate than ever before.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">70% Faster</CardTitle>
              <CardDescription>
                Pre-filled templates reduce data entry time significantly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </CardDescription>
              <CardTitle className="text-lg">Data Quality</CardTitle>
              <CardDescription>
                Built-in validation ensures consistent, accurate information
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Info className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Smart Guidance</CardTitle>
              <CardDescription>
                Field categorization and required field highlighting
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Template Selection */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Step 1: Choose Your Crop Template</CardTitle>
                <CardDescription>
                  Select from our pre-configured templates based on crop type
                </CardDescription>
              </div>
              {selectedTemplate && (
                <Button onClick={resetDemo} variant="outline">
                  Reset Demo
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {showTemplateSelector ? (
              <CropTemplateSelector
                onTemplateSelect={handleTemplateSelect}
                selectedTemplateId={selectedTemplate?.id}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Template Selected: {selectedTemplate?.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  Great choice! This template will pre-fill {Object.keys(selectedTemplate?.defaultValues || {}).length} fields 
                  with common values for {selectedTemplate?.category} crops.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Required Fields ({selectedTemplate?.baseFields.length})</h4>
                    <div className="space-y-2">
                      {selectedTemplate?.baseFields.slice(0, 8).map((field, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                      ))}
                      {selectedTemplate?.baseFields.length > 8 && (
                        <div className="text-sm text-gray-500">
                          +{selectedTemplate.baseFields.length - 8} more fields...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Pre-filled Values ({Object.keys(selectedTemplate?.defaultValues || {}).length})</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedTemplate?.defaultValues || {}).slice(0, 8).map(([key, value], index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 font-medium">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                          <span className="text-gray-600">{Array.isArray(value) ? value.join(', ') : value}</span>
                        </div>
                      ))}
                      {Object.keys(selectedTemplate?.defaultValues || {}).length > 8 && (
                        <div className="text-sm text-gray-500">
                          +{Object.keys(selectedTemplate?.defaultValues || {}).length - 8} more values...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button 
                    onClick={() => setShowTemplateSelector(true)}
                    className="mr-4"
                    variant="outline"
                  >
                    ← Choose Different Template
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Continue to Form <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How the Template System Works</CardTitle>
            <CardDescription>
              A step-by-step guide to using our intelligent crop management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-2">Choose Template</h4>
                <p className="text-sm text-gray-600">
                  Select from cereal, pulse, vegetable, or other crop types
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  2
                </div>
                <h4 className="font-semibold mb-2">Auto-fill Fields</h4>
                <p className="text-sm text-gray-600">
                  Common values are automatically populated based on crop type
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  3
                </div>
                <h4 className="font-semibold mb-2">Complete Details</h4>
                <p className="text-sm text-gray-600">
                  Fill in crop-specific information using the organized tab structure
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  4
                </div>
                <h4 className="font-semibold mb-2">Save & Publish</h4>
                <p className="text-sm text-gray-600">
                  Your new crop is ready with comprehensive information
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
