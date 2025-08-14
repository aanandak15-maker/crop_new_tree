import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CropTemplate, cropTemplates } from '@/data/cropTemplates';
import { 
  Upload, Download, Plus, Trash2, CheckCircle, AlertCircle,
  FileSpreadsheet, Database, Users, Clock, Zap
} from 'lucide-react';

interface BulkCropData {
  name: string;
  scientific_name: string;
  description: string;
  season: string;
  family: string;
  origin: string;
  [key: string]: string;
}

interface BulkOperation {
  id: string;
  template: CropTemplate;
  crops: BulkCropData[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  errors: string[];
}

export const BulkCropOperations: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CropTemplate | null>(null);
  const [bulkData, setBulkData] = useState<string>('');
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTemplateSelect = (template: CropTemplate) => {
    setSelectedTemplate(template);
  };

  const parseBulkData = (data: string): BulkCropData[] => {
    try {
      // Simple CSV-like parsing (can be enhanced for actual CSV)
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      return lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const crop: BulkCropData = {
          name: '',
          scientific_name: '',
          description: '',
          season: '',
          family: '',
          origin: ''
        };
        
        headers.forEach((header, i) => {
          if (values[i]) {
            crop[header] = values[i];
          }
        });
        
        return crop;
      }).filter(crop => crop.name); // Filter out empty rows
    } catch (error) {
      console.error('Error parsing bulk data:', error);
      return [];
    }
  };

  const validateBulkData = (crops: BulkCropData[]): string[] => {
    const errors: string[] = [];
    
    crops.forEach((crop, index) => {
      if (!crop.name) {
        errors.push(`Row ${index + 1}: Missing crop name`);
      }
      if (!crop.scientific_name) {
        errors.push(`Row ${index + 1}: Missing scientific name`);
      }
      if (!crop.family) {
        errors.push(`Row ${index + 1}: Missing family`);
      }
      if (!crop.season) {
        errors.push(`Row ${index + 1}: Missing season`);
      }
    });
    
    return errors;
  };

  const processBulkOperation = async (operation: BulkOperation) => {
    setIsProcessing(true);
    
    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, progress: i, status: i === 100 ? 'completed' : 'processing' }
          : op
      ));
    }
    
    setIsProcessing(false);
  };

  const handleBulkUpload = () => {
    if (!selectedTemplate || !bulkData.trim()) return;
    
    const crops = parseBulkData(bulkData);
    const errors = validateBulkData(crops);
    
    if (errors.length > 0) {
      alert('Validation errors found:\n' + errors.join('\n'));
      return;
    }
    
    const operation: BulkOperation = {
      id: Date.now().toString(),
      template: selectedTemplate,
      crops,
      status: 'pending',
      progress: 0,
      errors: []
    };
    
    setOperations(prev => [...prev, operation]);
    setBulkData('');
    
    // Start processing
    processBulkOperation(operation);
  };

  const downloadTemplate = () => {
    if (!selectedTemplate) return;
    
    const headers = [
      'name', 'scientific_name', 'description', 'season', 'family', 'origin',
      'growth_habit', 'life_span', 'plant_type', 'root_system', 'leaf', 'flowering_season'
    ];
    
    const csvContent = [
      headers.join(','),
      'Wheat,Triticum aestivum,Staple cereal crop,Rabi,Poaceae,Southwest Asia',
      'Rice,Oryza sativa,Staple food crop,Kharif,Poaceae,China',
      'Maize,Zea mays,Important cereal crop,Kharif,Poaceae,Mexico'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.name.toLowerCase()}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📦 Bulk Crop Operations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Add multiple crops simultaneously using templates. 
            Upload CSV data, validate information, and process crops in batches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Selection & Data Input */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Select Template
                </CardTitle>
                <CardDescription>
                  Choose a crop template for bulk operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cropTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                      className="justify-start h-auto p-3"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {template.baseFields.length} required fields
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                {selectedTemplate && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Template Selected: {selectedTemplate.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Input Crop Data
                </CardTitle>
                <CardDescription>
                  Enter crop information in CSV format or use the template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={downloadTemplate}
                    disabled={!selectedTemplate}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="bulk-data">Crop Data (CSV format)</Label>
                  <Textarea
                    id="bulk-data"
                    placeholder="Enter crop data in CSV format...&#10;name,scientific_name,description,season,family,origin&#10;Wheat,Triticum aestivum,Staple cereal crop,Rabi,Poaceae,Southwest Asia"
                    value={bulkData}
                    onChange={(e) => setBulkData(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
                
                <Button 
                  onClick={handleBulkUpload}
                  disabled={!selectedTemplate || !bulkData.trim() || isProcessing}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Process Bulk Upload
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operations Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Operations Status
                </CardTitle>
                <CardDescription>
                  Monitor bulk operations and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {operations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No operations yet</p>
                    <p className="text-sm">Start a bulk upload to see operations here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {operations.map((operation) => (
                      <div key={operation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{operation.template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {operation.crops.length} crops
                            </p>
                          </div>
                          <Badge 
                            variant={
                              operation.status === 'completed' ? 'default' :
                              operation.status === 'error' ? 'destructive' :
                              operation.status === 'processing' ? 'secondary' : 'outline'
                            }
                          >
                            {operation.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{operation.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                operation.status === 'completed' ? 'bg-green-500' :
                                operation.status === 'error' ? 'bg-red-500' :
                                operation.status === 'processing' ? 'bg-blue-500' : 'bg-gray-400'
                              }`}
                              style={{ width: `${operation.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {operation.errors.length > 0 && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800">Errors</span>
                            </div>
                            <ul className="text-xs text-red-700 space-y-1">
                              {operation.errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {operations.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Operations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {operations.filter(op => op.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {operations.filter(op => op.status === 'processing').length}
                    </div>
                    <div className="text-sm text-gray-600">Processing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {operations.filter(op => op.status === 'error').length}
                    </div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
