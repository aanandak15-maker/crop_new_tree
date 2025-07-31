import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Disease {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  affected_crops: string[];
  symptoms: string[];
  prevention_methods: string[];
  treatment_methods: string[];
}

const DiseaseManagement = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    scientific_name: "",
    description: "",
    affected_crops: "",
    symptoms: "",
    prevention_methods: "",
    treatment_methods: ""
  });

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiseases(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch diseases",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const diseaseData = {
        ...formData,
        affected_crops: formData.affected_crops.split(',').map(s => s.trim()).filter(Boolean),
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        prevention_methods: formData.prevention_methods.split(',').map(s => s.trim()).filter(Boolean),
        treatment_methods: formData.treatment_methods.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingDisease) {
        const { error } = await supabase
          .from('diseases')
          .update(diseaseData)
          .eq('id', editingDisease.id);
        if (error) throw error;
        toast({ title: "Success", description: "Disease updated successfully" });
      } else {
        const { error } = await supabase
          .from('diseases')
          .insert([diseaseData]);
        if (error) throw error;
        toast({ title: "Success", description: "Disease created successfully" });
      }

      setIsDialogOpen(false);
      setEditingDisease(null);
      resetForm();
      fetchDiseases();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save disease",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setFormData({
      name: disease.name,
      scientific_name: disease.scientific_name || "",
      description: disease.description || "",
      affected_crops: disease.affected_crops?.join(', ') || "",
      symptoms: disease.symptoms?.join(', ') || "",
      prevention_methods: disease.prevention_methods?.join(', ') || "",
      treatment_methods: disease.treatment_methods?.join(', ') || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this disease?")) return;

    try {
      const { error } = await supabase
        .from('diseases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Disease deleted successfully" });
      fetchDiseases();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete disease",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      scientific_name: "",
      description: "",
      affected_crops: "",
      symptoms: "",
      prevention_methods: "",
      treatment_methods: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Disease Management</CardTitle>
            <CardDescription>Manage disease information and treatment methods</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingDisease(null); resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Disease
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDisease ? "Edit Disease" : "Add New Disease"}</DialogTitle>
                <DialogDescription>
                  {editingDisease ? "Update disease information" : "Enter disease details"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Disease Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="scientific_name">Scientific Name</Label>
                    <Input
                      id="scientific_name"
                      value={formData.scientific_name}
                      onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="affected_crops">Affected Crops (comma-separated)</Label>
                  <Input
                    id="affected_crops"
                    value={formData.affected_crops}
                    onChange={(e) => setFormData({ ...formData, affected_crops: e.target.value })}
                    placeholder="Rice, Wheat, Maize"
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                  <Textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Leaf spots, Wilting, Yellowing, Stunted growth"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="prevention_methods">Prevention Methods (comma-separated)</Label>
                  <Textarea
                    id="prevention_methods"
                    value={formData.prevention_methods}
                    onChange={(e) => setFormData({ ...formData, prevention_methods: e.target.value })}
                    placeholder="Seed treatment, Crop rotation, Resistant varieties"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="treatment_methods">Treatment Methods (comma-separated)</Label>
                  <Textarea
                    id="treatment_methods"
                    value={formData.treatment_methods}
                    onChange={(e) => setFormData({ ...formData, treatment_methods: e.target.value })}
                    placeholder="Fungicide spray, Bactericide, Cultural practices"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingDisease ? "Update" : "Create"}
                  </Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Scientific Name</TableHead>
              <TableHead>Affected Crops</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diseases.map((disease) => (
              <TableRow key={disease.id}>
                <TableCell className="font-medium">{disease.name}</TableCell>
                <TableCell>{disease.scientific_name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {disease.affected_crops?.slice(0, 3).map((crop) => (
                      <Badge key={crop} variant="secondary">{crop}</Badge>
                    ))}
                    {disease.affected_crops?.length > 3 && (
                      <Badge variant="outline">+{disease.affected_crops.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{disease.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(disease)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(disease.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {diseases.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No diseases found. Add your first disease to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiseaseManagement;