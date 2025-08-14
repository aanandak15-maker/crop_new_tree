import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import EnhancedCropManagement from "@/components/admin/EnhancedCropManagement";
import VarietyManagement from "@/components/admin/VarietyManagement";
import PestManagement from "@/components/admin/PestManagement";
import DiseaseManagement from "@/components/admin/DiseaseManagement";
import CropPestDiseaseRelations from "@/components/admin/CropPestDiseaseRelations";
import ExcelImport from "@/components/admin/ExcelImport";
import AuditLogs from "@/components/admin/AuditLogs";
import ImageManager from "@/components/admin/ImageManager";
import DataValidation from "@/components/admin/DataValidation";
import DataBackupVersioning from "@/components/admin/DataBackupVersioning";
import ContentManagement from "@/components/admin/ContentManagement";
import PerformanceMonitoring from "@/components/admin/PerformanceMonitoring";
import UserManagement from "@/components/admin/UserManagement";
import { AIDocumentProcessor } from "@/components/admin/ai-doc-processor";
import { Sprout, Bug, Shield, Upload, Database, Link, History, Image, CheckCircle, Calendar, Globe, Activity, Sparkles, Users, Menu, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("crops");
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);

  const tabItems = [
    { value: "crops", label: "Crops", icon: Sprout },
    { value: "varieties", label: "Varieties", icon: Sprout },
    { value: "pests", label: "Pests", icon: Bug },
    { value: "diseases", label: "Diseases", icon: Shield },
    { value: "relations", label: "Relations", icon: Link },
    { value: "import", label: "Import", icon: Upload },
    { value: "images", label: "Images", icon: Image },
    { value: "validation", label: "Validation", icon: CheckCircle },
    { value: "audit", label: "Audit", icon: History },
    { value: "backup", label: "Backup", icon: Calendar },
    { value: "content", label: "Content", icon: Globe },
    { value: "performance", label: "Performance", icon: Activity },
    { value: "ai-processor", label: "AI Processor", icon: Sparkles },
  ];

  // Fetch pending users count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', false);

        if (!error && count !== null) {
          setPendingUsersCount(count);
        }
      } catch (error) {
        console.error('Error fetching pending users count:', error);
      }
    };

    fetchPendingCount();

    // Set up real-time subscription for pending users count
    const channel = supabase
      .channel('pending_users_count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        () => {
          // Refresh count when user_profiles table changes
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-4 lg:p-6">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-slate-800">
                  <Database className="h-7 w-7 text-emerald-600" />
                  Crop Data Management System
                </CardTitle>
                <CardDescription className="text-slate-600 mt-1">
                  Manage crops, varieties, pests, diseases, and import data from Excel files
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUserManagement(!showUserManagement)}
                className="flex items-center gap-2 relative"
              >
                <Users className="h-4 w-4" />
                User Management
                {pendingUsersCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                  >
                    <Bell className="h-3 w-3" />
                  </Badge>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-1 p-2">
                    {tabItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.value}
                          variant={activeTab === item.value ? "default" : "ghost"}
                          className={`w-full justify-start gap-3 h-12 ${
                            activeTab === item.value
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                          onClick={() => setActiveTab(item.value)}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm min-h-[calc(100vh-200px)]">
              <CardContent className="p-6">
                {activeTab === "crops" && <EnhancedCropManagement />}
                {activeTab === "varieties" && <VarietyManagement />}
                {activeTab === "pests" && <PestManagement />}
                {activeTab === "diseases" && <DiseaseManagement />}
                {activeTab === "relations" && <CropPestDiseaseRelations />}
                {activeTab === "import" && <ExcelImport />}
                {activeTab === "images" && <ImageManager />}
                {activeTab === "validation" && <DataValidation />}
                {activeTab === "audit" && <AuditLogs />}
                {activeTab === "backup" && <DataBackupVersioning />}
                {activeTab === "content" && <ContentManagement />}
                {activeTab === "performance" && <PerformanceMonitoring />}
                {activeTab === "ai-processor" && <AIDocumentProcessor />}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Management Modal */}
        {showUserManagement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] border-0 shadow-xl bg-white">
              <CardHeader className="border-b bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
                    <Users className="h-6 w-6 text-emerald-600" />
                    User Management
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserManagement(false)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Manage user accounts, approve registrations, and assign roles
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(90vh-140px)]">
                  <div className="p-6">
                    <UserManagement />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;