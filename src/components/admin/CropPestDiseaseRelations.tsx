import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Link, Shield, Bug } from "lucide-react";

interface Crop {
  id: string;
  name: string;
}

interface Pest {
  id: string;
  name: string;
  scientific_name?: string;
}

interface Disease {
  id: string;
  name: string;
  scientific_name?: string;
}

interface CropPestRelation {
  id: string;
  crop_id: string;
  pest_id: string;
  severity_level: string;
  occurrence_frequency: string;
  crop?: { name: string };
  pest?: { name: string; scientific_name?: string };
}

interface CropDiseaseRelation {
  id: string;
  crop_id: string;
  disease_id: string;
  severity_level: string;
  occurrence_frequency: string;
  crop?: { name: string };
  disease?: { name: string; scientific_name?: string };
}

const CropPestDiseaseRelations = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [pests, setPests] = useState<Pest[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [cropPestRelations, setCropPestRelations] = useState<CropPestRelation[]>([]);
  const [cropDiseaseRelations, setCropDiseaseRelations] = useState<CropDiseaseRelation[]>([]);
  const [isPestDialogOpen, setIsPestDialogOpen] = useState(false);
  const [isDiseaseDialogOpen, setIsDiseaseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pests" | "diseases">("pests");
  const { toast } = useToast();

  const [pestFormData, setPestFormData] = useState({
    crop_id: "",
    pest_id: "",
    severity_level: "medium",
    occurrence_frequency: "occasional"
  });

  const [diseaseFormData, setDiseaseFormData] = useState({
    crop_id: "",
    disease_id: "",
    severity_level: "medium",
    occurrence_frequency: "occasional"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch crops
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('id, name')
        .order('name');
      
      if (cropsError) throw cropsError;
      setCrops(cropsData || []);

      // Fetch pests
      const { data: pestsData, error: pestsError } = await supabase
        .from('pests')
        .select('id, name, scientific_name')
        .order('name');
      
      if (pestsError) throw pestsError;
      setPests(pestsData || []);

      // Fetch diseases
      const { data: diseasesData, error: diseasesError } = await supabase
        .from('diseases')
        .select('id, name, scientific_name')
        .order('name');
      
      if (diseasesError) throw diseasesError;
      setDiseases(diseasesData || []);

      // Fetch crop-pest relations
      const { data: cropPestData, error: cropPestError } = await supabase
        .from('crop_pests')
        .select(`
          *,
          crop:crops(name),
          pest:pests(name, scientific_name)
        `)
        .order('created_at', { ascending: false });
      
      if (cropPestError) throw cropPestError;
      setCropPestRelations(cropPestData || []);

      // Fetch crop-disease relations
      const { data: cropDiseaseData, error: cropDiseaseError } = await supabase
        .from('crop_diseases')
        .select(`
          *,
          crop:crops(name),
          disease:diseases(name, scientific_name)
        `)
        .order('created_at', { ascending: false });
      
      if (cropDiseaseError) throw cropDiseaseError;
      setCropDiseaseRelations(cropDiseaseData || []);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    }
  };

  const handlePestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('crop_pests')
        .insert([pestFormData]);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Crop-pest relation added successfully" });
      setIsPestDialogOpen(false);
      resetPestForm();
      fetchData();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Error",
          description: "This crop-pest relation already exists",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add crop-pest relation",
          variant: "destructive"
        });
      }
    }
  };

  const handleDiseaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('crop_diseases')
        .insert([diseaseFormData]);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "Crop-disease relation added successfully" });
      setIsDiseaseDialogOpen(false);
      resetDiseaseForm();
      fetchData();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Error",
          description: "This crop-disease relation already exists",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add crop-disease relation",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeletePestRelation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this crop-pest relation?")) return;

    try {
      const { error } = await supabase
        .from('crop_pests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Crop-pest relation deleted successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crop-pest relation",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDiseaseRelation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this crop-disease relation?")) return;

    try {
      const { error } = await supabase
        .from('crop_diseases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Crop-disease relation deleted successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crop-disease relation",
        variant: "destructive"
      });
    }
  };

  const resetPestForm = () => {
    setPestFormData({
      crop_id: "",
      pest_id: "",
      severity_level: "medium",
      occurrence_frequency: "occasional"
    });
  };

  const resetDiseaseForm = () => {
    setDiseaseFormData({
      crop_id: "",
      disease_id: "",
      severity_level: "medium",
      occurrence_frequency: "occasional"
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "pests" ? "default" : "outline"}
          onClick={() => setActiveTab("pests")}
          className="flex items-center gap-2"
        >
          <Bug className="h-4 w-4" />
          Crop-Pest Relations
        </Button>
        <Button
          variant={activeTab === "diseases" ? "default" : "outline"}
          onClick={() => setActiveTab("diseases")}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Crop-Disease Relations
        </Button>
      </div>

      {/* Crop-Pest Relations */}
      {activeTab === "pests" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Crop-Pest Relations
                </CardTitle>
                <CardDescription>Manage relationships between crops and pests</CardDescription>
              </div>
              <Dialog open={isPestDialogOpen} onOpenChange={setIsPestDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetPestForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Relation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Crop-Pest Relation</DialogTitle>
                    <DialogDescription>
                      Create a new relationship between a crop and pest
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePestSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="crop">Crop *</Label>
                      <Select value={pestFormData.crop_id} onValueChange={(value) => setPestFormData({ ...pestFormData, crop_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a crop" />
                        </SelectTrigger>
                        <SelectContent>
                          {crops.map((crop) => (
                            <SelectItem key={crop.id} value={crop.id}>
                              {crop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="pest">Pest *</Label>
                      <Select value={pestFormData.pest_id} onValueChange={(value) => setPestFormData({ ...pestFormData, pest_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pest" />
                        </SelectTrigger>
                        <SelectContent>
                          {pests.map((pest) => (
                            <SelectItem key={pest.id} value={pest.id}>
                              {pest.name} {pest.scientific_name && `(${pest.scientific_name})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="severity">Severity Level</Label>
                      <Select value={pestFormData.severity_level} onValueChange={(value) => setPestFormData({ ...pestFormData, severity_level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="frequency">Occurrence Frequency</Label>
                      <Select value={pestFormData.occurrence_frequency} onValueChange={(value) => setPestFormData({ ...pestFormData, occurrence_frequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="occasional">Occasional</SelectItem>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="very_common">Very Common</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsPestDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Relation</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Pest</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cropPestRelations.map((relation) => (
                  <TableRow key={relation.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {relation.crop?.name || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{relation.pest?.name || "Unknown"}</div>
                        {relation.pest?.scientific_name && (
                          <div className="text-sm text-muted-foreground">
                            {relation.pest.scientific_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(relation.severity_level)}>
                        {relation.severity_level}
                      </Badge>
                    </TableCell>
                    <TableCell>{relation.occurrence_frequency}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeletePestRelation(relation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {cropPestRelations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No crop-pest relations found. Add your first relation to get started.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Crop-Disease Relations */}
      {activeTab === "diseases" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Crop-Disease Relations
                </CardTitle>
                <CardDescription>Manage relationships between crops and diseases</CardDescription>
              </div>
              <Dialog open={isDiseaseDialogOpen} onOpenChange={setIsDiseaseDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetDiseaseForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Relation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Crop-Disease Relation</DialogTitle>
                    <DialogDescription>
                      Create a new relationship between a crop and disease
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDiseaseSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="crop">Crop *</Label>
                      <Select value={diseaseFormData.crop_id} onValueChange={(value) => setDiseaseFormData({ ...diseaseFormData, crop_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a crop" />
                        </SelectTrigger>
                        <SelectContent>
                          {crops.map((crop) => (
                            <SelectItem key={crop.id} value={crop.id}>
                              {crop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="disease">Disease *</Label>
                      <Select value={diseaseFormData.disease_id} onValueChange={(value) => setDiseaseFormData({ ...diseaseFormData, disease_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a disease" />
                        </SelectTrigger>
                        <SelectContent>
                          {diseases.map((disease) => (
                            <SelectItem key={disease.id} value={disease.id}>
                              {disease.name} {disease.scientific_name && `(${disease.scientific_name})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="severity">Severity Level</Label>
                      <Select value={diseaseFormData.severity_level} onValueChange={(value) => setDiseaseFormData({ ...diseaseFormData, severity_level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="frequency">Occurrence Frequency</Label>
                      <Select value={diseaseFormData.occurrence_frequency} onValueChange={(value) => setDiseaseFormData({ ...diseaseFormData, occurrence_frequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="occasional">Occasional</SelectItem>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="very_common">Very Common</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDiseaseDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Relation</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cropDiseaseRelations.map((relation) => (
                  <TableRow key={relation.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {relation.crop?.name || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{relation.disease?.name || "Unknown"}</div>
                        {relation.disease?.scientific_name && (
                          <div className="text-sm text-muted-foreground">
                            {relation.disease.scientific_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(relation.severity_level)}>
                        {relation.severity_level}
                      </Badge>
                    </TableCell>
                    <TableCell>{relation.occurrence_frequency}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteDiseaseRelation(relation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {cropDiseaseRelations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No crop-disease relations found. Add your first relation to get started.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropPestDiseaseRelations;