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

interface Pest {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  affected_crops: string[];
  symptoms: string[];
  prevention_methods: string[];
  treatment_methods: string[];
}

const PestManagement = () => {
  const [pests, setPests] = useState<Pest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPest, setEditingPest] = useState<Pest | null>(null);
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
    fetchPests();
  }, []);

  const fetchPests = async () => {
    try {
      const { data, error } = await supabase
        .from('pests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pests",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pestData = {
        ...formData,
        affected_crops: formData.affected_crops.split(',').map(s => s.trim()).filter(Boolean),
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        prevention_methods: formData.prevention_methods.split(',').map(s => s.trim()).filter(Boolean),
        treatment_methods: formData.treatment_methods.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingPest) {
        const { error } = await supabase
          .from('pests')
          .update(pestData)
          .eq('id', editingPest.id);
        if (error) throw error;
        toast({ title: "Success", description: "Pest updated successfully" });
      } else {
        const { error } = await supabase
          .from('pests')
          .insert([pestData]);
        if (error) throw error;
        toast({ title: "Success", description: "Pest created successfully" });
      }

      setIsDialogOpen(false);
      setEditingPest(null);
      resetForm();
      fetchPests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pest",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pest: Pest) => {
    setEditingPest(pest);
    setFormData({
      name: pest.name,
      scientific_name: pest.scientific_name || "",
      description: pest.description || "",
      affected_crops: pest.affected_crops?.join(', ') || "",
      symptoms: pest.symptoms?.join(', ') || "",
      prevention_methods: pest.prevention_methods?.join(', ') || "",
      treatment_methods: pest.treatment_methods?.join(', ') || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pest?")) return;

    try {
      const { error } = await supabase
        .from('pests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Pest deleted successfully" });
      fetchPests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pest",
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
            <CardTitle>Pest Management</CardTitle>
            <CardDescription>Manage pest information and control methods</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingPest(null); resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Pest
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPest ? "Edit Pest" : "Add New Pest"}</DialogTitle>
                <DialogDescription>
                  {editingPest ? "Update pest information" : "Enter pest details"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Pest Name *</Label>
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
                    placeholder="Leaf damage, Stem borer holes, Yellowing"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="prevention_methods">Prevention Methods (comma-separated)</Label>
                  <Textarea
                    id="prevention_methods"
                    value={formData.prevention_methods}
                    onChange={(e) => setFormData({ ...formData, prevention_methods: e.target.value })}
                    placeholder="Crop rotation, Clean cultivation, Resistant varieties"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="treatment_methods">Treatment Methods (comma-separated)</Label>
                  <Textarea
                    id="treatment_methods"
                    value={formData.treatment_methods}
                    onChange={(e) => setFormData({ ...formData, treatment_methods: e.target.value })}
                    placeholder="Insecticide spray, Biological control, IPM practices"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingPest ? "Update" : "Create"}
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
            {pests.map((pest) => (
              <TableRow key={pest.id}>
                <TableCell className="font-medium">{pest.name}</TableCell>
                <TableCell>{pest.scientific_name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pest.affected_crops?.slice(0, 3).map((crop) => (
                      <Badge key={crop} variant="secondary">{crop}</Badge>
                    ))}
                    {pest.affected_crops?.length > 3 && (
                      <Badge variant="outline">+{pest.affected_crops.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{pest.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(pest)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(pest.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pests found. Add your first pest to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PestManagement;