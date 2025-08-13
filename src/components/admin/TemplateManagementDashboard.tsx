import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CropTemplate, cropTemplates } from '@/data/cropTemplates';
import { 
  Wheat, Sprout, Apple, Leaf, Zap, Scissors, 
  Plus, Edit, Trash2, Download, Upload, Settings,
  TrendingUp, Users, Database, Shield
} from 'lucide-react';

interface TemplateStats {
  totalTemplates: number;
  totalFields: number;
  averageFieldsPerTemplate: number;
  mostUsedTemplate: string;
  templatesByCategory: Record<string, number>;
}

export const TemplateManagementDashboard: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CropTemplate | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cereal': return <Wheat className="h-5 w-5" />;
      case 'pulse': return <Sprout className="h-5 w-5" />;
      case 'vegetable': return <Apple className="h-5 w-5" />;
      case 'oilseed': return <Leaf className="h-5 w-5" />;
      case 'fruit': return <Apple className="h-5 w-5" />;
      case 'spice': return <Zap className="h-5 w-5" />;
      case 'fiber': return <Scissors className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cereal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pulse': return 'bg-green-100 text-green-800 border-green-200';
      case 'vegetable': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'oilseed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fruit': return 'bg-red-100 text-red-800 border-red-200';
      case 'spice': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'fiber': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateStats = (): TemplateStats => {
    const totalFields = cropTemplates.reduce((acc, template) => 
      acc + template.baseFields.length + template.optionalFields.length, 0
    );
    
    const templatesByCategory = cropTemplates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedTemplate = cropTemplates.reduce((prev, current) => 
      (prev.baseFields.length + prev.optionalFields.length) > 
      (current.baseFields.length + current.optionalFields.length) ? prev : current
    );

    return {
      totalTemplates: cropTemplates.length,
      totalFields,
      averageFieldsPerTemplate: Math.round(totalFields / cropTemplates.length),
      mostUsedTemplate: mostUsedTemplate.name,
      templatesByCategory
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎛️ Template Management Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage and monitor your crop template system. View statistics, 
            analyze usage patterns, and optimize template performance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Total Templates</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-3xl font-bold text-blue-600">{stats.totalTemplates}</p>
              <p className="text-sm text-gray-600">Available crop types</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Total Fields</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-3xl font-bold text-green-600">{stats.totalFields}</p>
              <p className="text-sm text-gray-600">Across all templates</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Avg Fields</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-3xl font-bold text-purple-600">{stats.averageFieldsPerTemplate}</p>
              <p className="text-sm text-gray-600">Per template</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Most Complex</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-2xl font-bold text-orange-600">{stats.mostUsedTemplate}</p>
              <p className="text-sm text-gray-600">Most fields</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Template Distribution by Category
                  </CardTitle>
                  <CardDescription>
                    Number of templates available for each crop category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.templatesByCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span className="capitalize font-medium">{category}</span>
                        </div>
                        <Badge variant="outline" className={getCategoryColor(category)}>
                          {count} template{count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common template management tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Template
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Templates
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Templates
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Template Fields
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cropTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(template.category)}`}>
                          {getCategoryIcon(template.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="mb-4">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Usage Analytics</CardTitle>
                <CardDescription>
                  Track how templates are being used and identify optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Analytics dashboard coming soon...</p>
                  <p className="text-sm">Track template usage, user behavior, and performance metrics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template System Settings</CardTitle>
                <CardDescription>
                  Configure template behavior and system preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Settings panel coming soon...</p>
                  <p className="text-sm">Configure validation rules, field requirements, and system preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
