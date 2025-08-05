import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Play, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ValidationIssue {
  id: string;
  table: string;
  record_id: string;
  field: string;
  issue_type: 'missing' | 'invalid' | 'duplicate' | 'orphaned';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  current_value?: string;
  suggested_fix?: string;
}

interface ValidationSummary {
  total_records: number;
  valid_records: number;
  issues_found: number;
  critical_issues: number;
  tables_checked: string[];
}

const DataValidation = () => {
  const [validationResults, setValidationResults] = useState<ValidationIssue[]>([]);
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runValidation = async () => {
    setIsValidating(true);
    setProgress(0);
    const issues: ValidationIssue[] = [];
    let totalRecords = 0;
    let validRecords = 0;

    try {
      // Validate Crops
      setProgress(20);
      const { data: crops } = await supabase.from("crops").select("*");
      if (crops) {
        totalRecords += crops.length;
        crops.forEach(crop => {
          if (!crop.name || crop.name.trim() === '') {
            issues.push({
              id: `crop-${crop.id}-name`,
              table: 'crops',
              record_id: crop.id,
              field: 'name',
              issue_type: 'missing',
              description: 'Crop name is required',
              severity: 'critical',
              suggested_fix: 'Add a valid crop name'
            });
          }
          if (!crop.scientific_name || crop.scientific_name.trim() === '') {
            issues.push({
              id: `crop-${crop.id}-scientific`,
              table: 'crops',
              record_id: crop.id,
              field: 'scientific_name',
              issue_type: 'missing',
              description: 'Scientific name is missing',
              severity: 'high',
              suggested_fix: 'Add scientific name for proper identification'
            });
          }
          if (!crop.description || crop.description.length < 10) {
            issues.push({
              id: `crop-${crop.id}-desc`,
              table: 'crops',
              record_id: crop.id,
              field: 'description',
              issue_type: 'invalid',
              description: 'Description is too short or missing',
              severity: 'medium',
              current_value: crop.description || 'None',
              suggested_fix: 'Add detailed description (at least 10 characters)'
            });
          }
        });
        validRecords += crops.filter(crop => 
          crop.name && crop.scientific_name && crop.description && crop.description.length >= 10
        ).length;
      }

      // Validate Varieties
      setProgress(40);
      const { data: varieties } = await supabase.from("varieties").select("*");
      if (varieties) {
        totalRecords += varieties.length;
        varieties.forEach(variety => {
          if (!variety.name || variety.name.trim() === '') {
            issues.push({
              id: `variety-${variety.id}-name`,
              table: 'varieties',
              record_id: variety.id,
              field: 'name',
              issue_type: 'missing',
              description: 'Variety name is required',
              severity: 'critical',
              suggested_fix: 'Add a valid variety name'
            });
          }
          if (!variety.crop_id) {
            issues.push({
              id: `variety-${variety.id}-crop`,
              table: 'varieties',
              record_id: variety.id,
              field: 'crop_id',
              issue_type: 'orphaned',
              description: 'Variety is not linked to any crop',
              severity: 'critical',
              suggested_fix: 'Link variety to a valid crop'
            });
          }
        });
        validRecords += varieties.filter(variety => 
          variety.name && variety.crop_id
        ).length;
      }

      // Validate Pests
      setProgress(60);
      const { data: pests } = await supabase.from("pests").select("*");
      if (pests) {
        totalRecords += pests.length;
        pests.forEach(pest => {
          if (!pest.name || pest.name.trim() === '') {
            issues.push({
              id: `pest-${pest.id}-name`,
              table: 'pests',
              record_id: pest.id,
              field: 'name',
              issue_type: 'missing',
              description: 'Pest name is required',
              severity: 'critical',
              suggested_fix: 'Add a valid pest name'
            });
          }
          if (!pest.symptoms || !Array.isArray(pest.symptoms) || pest.symptoms.length === 0) {
            issues.push({
              id: `pest-${pest.id}-symptoms`,
              table: 'pests',
              record_id: pest.id,
              field: 'symptoms',
              issue_type: 'missing',
              description: 'Pest symptoms are missing',
              severity: 'high',
              suggested_fix: 'Add at least one symptom'
            });
          }
        });
        validRecords += pests.filter(pest => 
          pest.name && pest.symptoms && Array.isArray(pest.symptoms) && pest.symptoms.length > 0
        ).length;
      }

      // Validate Diseases
      setProgress(80);
      const { data: diseases } = await supabase.from("diseases").select("*");
      if (diseases) {
        totalRecords += diseases.length;
        diseases.forEach(disease => {
          if (!disease.name || disease.name.trim() === '') {
            issues.push({
              id: `disease-${disease.id}-name`,
              table: 'diseases',
              record_id: disease.id,
              field: 'name',
              issue_type: 'missing',
              description: 'Disease name is required',
              severity: 'critical',
              suggested_fix: 'Add a valid disease name'
            });
          }
          if (!disease.symptoms || !Array.isArray(disease.symptoms) || disease.symptoms.length === 0) {
            issues.push({
              id: `disease-${disease.id}-symptoms`,
              table: 'diseases',
              record_id: disease.id,
              field: 'symptoms',
              issue_type: 'missing',
              description: 'Disease symptoms are missing',
              severity: 'high',
              suggested_fix: 'Add at least one symptom'
            });
          }
        });
        validRecords += diseases.filter(disease => 
          disease.name && disease.symptoms && Array.isArray(disease.symptoms) && disease.symptoms.length > 0
        ).length;
      }

      // Check for duplicates
      setProgress(90);
      const allCropNames = crops?.map(c => c.name.toLowerCase()) || [];
      const duplicateCrops = allCropNames.filter((name, index) => allCropNames.indexOf(name) !== index);
      duplicateCrops.forEach(name => {
        const duplicateRecords = crops?.filter(c => c.name.toLowerCase() === name) || [];
        duplicateRecords.forEach(crop => {
          issues.push({
            id: `crop-${crop.id}-duplicate`,
            table: 'crops',
            record_id: crop.id,
            field: 'name',
            issue_type: 'duplicate',
            description: `Duplicate crop name: ${crop.name}`,
            severity: 'medium',
            current_value: crop.name,
            suggested_fix: 'Rename or merge duplicate crops'
          });
        });
      });

      setProgress(100);

      setSummary({
        total_records: totalRecords,
        valid_records: validRecords,
        issues_found: issues.length,
        critical_issues: issues.filter(i => i.severity === 'critical').length,
        tables_checked: ['crops', 'varieties', 'pests', 'diseases']
      });

      setValidationResults(issues);

      toast({
        title: "Validation Complete",
        description: `Found ${issues.length} issues across ${totalRecords} records`
      });

    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Error",
        description: "Failed to run validation",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueIcon = (issueType: string) => {
    switch (issueType) {
      case 'missing': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'invalid': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'duplicate': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'orphaned': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const exportResults = () => {
    const csv = [
      "Table,Record ID,Field,Issue Type,Severity,Description,Current Value,Suggested Fix",
      ...validationResults.map(issue => 
        `${issue.table},${issue.record_id},${issue.field},${issue.issue_type},${issue.severity},"${issue.description}","${issue.current_value || ''}","${issue.suggested_fix || ''}"`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-validation-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Data Validation
              </CardTitle>
              <CardDescription>
                Validate data quality and identify issues across all tables
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={runValidation} 
                disabled={isValidating}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isValidating ? 'Validating...' : 'Run Validation'}
              </Button>
              {validationResults.length > 0 && (
                <Button variant="outline" onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isValidating && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                Validating data... {progress}%
              </p>
            </div>
          )}

          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{summary.total_records}</div>
                  <p className="text-sm text-gray-600">Total Records</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{summary.valid_records}</div>
                  <p className="text-sm text-gray-600">Valid Records</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{summary.issues_found}</div>
                  <p className="text-sm text-gray-600">Issues Found</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{summary.critical_issues}</div>
                  <p className="text-sm text-gray-600">Critical Issues</p>
                </CardContent>
              </Card>
            </div>
          )}

          {validationResults.length > 0 && (
            <>
              {summary && summary.critical_issues > 0 && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{summary.critical_issues} critical issues</strong> found that need immediate attention.
                    These issues may prevent the system from functioning properly.
                  </AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Suggested Fix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults
                      .sort((a, b) => {
                        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                        return severityOrder[a.severity] - severityOrder[b.severity];
                      })
                      .map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getIssueIcon(issue.issue_type)}
                            <span className="capitalize">{issue.issue_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{issue.table}</TableCell>
                        <TableCell>{issue.field}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.description}</TableCell>
                        <TableCell className="max-w-32 truncate">
                          {issue.current_value || '-'}
                        </TableCell>
                        <TableCell className="max-w-48 text-sm">
                          {issue.suggested_fix}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {!isValidating && !summary && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No validation results yet</p>
              <p className="text-sm text-gray-400">Click "Run Validation" to check data quality</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataValidation;