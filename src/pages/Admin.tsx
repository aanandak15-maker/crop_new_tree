import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Sprout, Bug, Shield, Upload, Database, Link, History, Image, CheckCircle, Calendar, Globe, Activity } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("crops");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Crop Data Management System
            </CardTitle>
            <CardDescription>
              Manage crops, varieties, pests, diseases, and import data from Excel files
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-12">
            <TabsTrigger value="crops" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Crops
            </TabsTrigger>
            <TabsTrigger value="varieties" className="flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              Varieties
            </TabsTrigger>
            <TabsTrigger value="pests" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Pests
            </TabsTrigger>
            <TabsTrigger value="diseases" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Diseases
            </TabsTrigger>
            <TabsTrigger value="relations" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Relations
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Audit
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crops">
            <EnhancedCropManagement />
          </TabsContent>

          <TabsContent value="varieties">
            <VarietyManagement />
          </TabsContent>

          <TabsContent value="pests">
            <PestManagement />
          </TabsContent>

          <TabsContent value="diseases">
            <DiseaseManagement />
          </TabsContent>

          <TabsContent value="relations">
            <CropPestDiseaseRelations />
          </TabsContent>

          <TabsContent value="import">
            <ExcelImport />
          </TabsContent>

          <TabsContent value="images">
            <ImageManager />
          </TabsContent>

          <TabsContent value="validation">
            <DataValidation />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>

          <TabsContent value="backup">
            <DataBackupVersioning />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;