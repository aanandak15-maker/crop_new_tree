import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedCropManagement } from './EnhancedCropManagement';
import { TemplateManagementDashboard } from './TemplateManagementDashboard';
import { BulkCropOperations } from './BulkCropOperations';
import { CropTemplateSelector } from './CropTemplateSelector';
import { 
  Database, Users, Settings, BarChart3, FileText, 
  Upload, Download, Shield, Zap, TrendingUp
} from 'lucide-react';

interface AdminStats {
  totalCrops: number;
  totalTemplates: number;
  totalUsers: number;
  recentActivity: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState<AdminStats>({
    totalCrops: 150,
    totalTemplates: 7,
    totalUsers: 45,
    recentActivity: 23
  });

  const adminModules = [
    {
      id: 'crop-management',
      title: 'Crop Management',
      description: 'Add, edit, and manage individual crops',
      icon: <Database className="h-6 w-6" />,
      color: 'bg-blue-500',
      component: <EnhancedCropManagement />
    },
    {
      id: 'template-management',
      title: 'Template Management',
      description: 'Manage crop templates and configurations',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-green-500',
      component: <TemplateManagementDashboard />
    },
    {
      id: 'bulk-operations',
      title: 'Bulk Operations',
      description: 'Add multiple crops simultaneously',
      icon: <Upload className="h-6 w-6" />,
      color: 'bg-purple-500',
      component: <BulkCropOperations />
    }
  ];

  const getModuleComponent = (moduleId: string) => {
    const module = adminModules.find(m => m.id === moduleId);
    return module ? module.component : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎛️ Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive crop management system with templates, bulk operations, and analytics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Total Crops</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-3xl font-bold text-blue-600">{stats.totalCrops}</p>
              <p className="text-sm text-gray-600">Crops in database</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Templates</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-3xl font-bold text-green-600">{stats.totalTemplates}</p>
              <p className="text-sm text-gray-600">Crop templates</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Users</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
              <p className="text-sm text-gray-600">Active users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-3xl font-bold text-orange-600">{stats.recentActivity}</p>
              <p className="text-sm text-gray-600">Recent actions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crop-management">Crop Management</TabsTrigger>
            <TabsTrigger value="template-management">Templates</TabsTrigger>
            <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {adminModules.map((module) => (
                    <Button
                      key={module.id}
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => setActiveTab(module.id)}
                    >
                      {module.icon}
                      <span className="ml-2">{module.title}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Status
                  </CardTitle>
                  <CardDescription>
                    Current system health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Templates</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Optimal
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">New crop "Basmati Rice" added via cereal template</span>
                    <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Template "Pulse Crops" updated with new fields</span>
                    <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Bulk operation completed: 25 vegetable crops added</span>
                    <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">User "admin" exported crop data to CSV</span>
                    <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crop Management Tab */}
          <TabsContent value="crop-management">
            <EnhancedCropManagement />
          </TabsContent>

          {/* Template Management Tab */}
          <TabsContent value="template-management">
            <TemplateManagementDashboard />
          </TabsContent>

          {/* Bulk Operations Tab */}
          <TabsContent value="bulk-operations">
            <BulkCropOperations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
