import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CropManagement from "@/components/admin/CropManagement";
import VarietyManagement from "@/components/admin/VarietyManagement";
import PestManagement from "@/components/admin/PestManagement";
import DiseaseManagement from "@/components/admin/DiseaseManagement";
import ExcelImport from "@/components/admin/ExcelImport";
import { Sprout, Bug, Shield, Upload, Database } from "lucide-react";

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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crops">
            <CropManagement />
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

          <TabsContent value="import">
            <ExcelImport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;