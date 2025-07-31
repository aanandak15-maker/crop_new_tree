import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";

const ExcelImport = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const { toast } = useToast();

  const importTypes = [
    { value: "crops", label: "Crops", description: "Import crop information" },
    { value: "varieties", label: "Varieties", description: "Import crop varieties" },
    { value: "pests", label: "Pests", description: "Import pest information" },
    { value: "diseases", label: "Diseases", description: "Import disease information" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        setSelectedFile(file);
        setImportResults(null);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive"
        });
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !importType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and import type",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    // Simulate Excel import process
    // In a real implementation, you would:
    // 1. Parse the Excel file using a library like SheetJS
    // 2. Validate the data structure
    // 3. Insert data into Supabase tables
    
    setTimeout(() => {
      setIsImporting(false);
      setImportResults({
        success: true,
        imported: Math.floor(Math.random() * 50) + 10,
        errors: Math.floor(Math.random() * 5),
        warnings: Math.floor(Math.random() * 3)
      });
      toast({
        title: "Import Complete",
        description: `Successfully imported data from ${selectedFile.name}`,
      });
    }, 3000);
  };

  const downloadTemplate = (type: string) => {
    // In a real implementation, this would download actual Excel templates
    const templates = {
      crops: "crops_template.xlsx",
      varieties: "varieties_template.xlsx", 
      pests: "pests_template.xlsx",
      diseases: "diseases_template.xlsx"
    };
    
    toast({
      title: "Template Download",
      description: `Downloading ${templates[type as keyof typeof templates]} template`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Excel Data Import
          </CardTitle>
          <CardDescription>
            Import bulk data from Excel files into your crop database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="import-type">Import Type</Label>
                <Select value={importType} onValueChange={setImportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type to import" />
                  </SelectTrigger>
                  <SelectContent>
                    {importTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">Excel File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <FileSpreadsheet className="h-4 w-4" />
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <Button 
                onClick={handleImport} 
                disabled={!selectedFile || !importType || isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Download Templates</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {importTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTemplate(type.value)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Download and use the correct template for your data type. 
                  Ensure all required columns are filled before importing.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{importResults.imported}</div>
                    <div className="text-sm text-muted-foreground">Records Imported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{importResults.warnings}</div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">File Requirements</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Excel format (.xlsx or .xls)</li>
                <li>• Maximum file size: 10MB</li>
                <li>• First row should contain column headers</li>
                <li>• Use the provided templates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Format</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Required fields must be filled</li>
                <li>• Use comma-separated values for arrays</li>
                <li>• Avoid special characters in names</li>
                <li>• Check for duplicate entries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExcelImport;