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
import { Plus, Edit, Trash2, Upload } from "lucide-react";

interface Crop {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  season: string[];
  climate_type: string[];
  soil_type: string[];
  water_requirement: string;
  growth_duration: string;
  created_at: string;
}

const CropManagement = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    scientific_name: "",
    description: "",
    season: "",
    climate_type: "",
    soil_type: "",
    water_requirement: "",
    growth_duration: ""
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrops(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crops",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cropData = {
        ...formData,
        season: formData.season.split(',').map(s => s.trim()).filter(Boolean),
        climate_type: formData.climate_type.split(',').map(s => s.trim()).filter(Boolean),
        soil_type: formData.soil_type.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingCrop) {
        const { error } = await supabase
          .from('crops')
          .update(cropData)
          .eq('id', editingCrop.id);
        if (error) throw error;
        toast({ title: "Success", description: "Crop updated successfully" });
      } else {
        const { error } = await supabase
          .from('crops')
          .insert([cropData]);
        if (error) throw error;
        toast({ title: "Success", description: "Crop created successfully" });
      }

      setIsDialogOpen(false);
      setEditingCrop(null);
      resetForm();
      fetchCrops();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save crop",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      scientific_name: crop.scientific_name || "",
      description: crop.description || "",
      season: crop.season?.join(', ') || "",
      climate_type: crop.climate_type?.join(', ') || "",
      soil_type: crop.soil_type?.join(', ') || "",
      water_requirement: crop.water_requirement || "",
      growth_duration: crop.growth_duration || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this crop?")) return;

    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Crop deleted successfully" });
      fetchCrops();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crop",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      scientific_name: "",
      description: "",
      season: "",
      climate_type: "",
      soil_type: "",
      water_requirement: "",
      growth_duration: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Crop Management</CardTitle>
            <CardDescription>Manage crop information and details</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCrop(null); resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Crop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</DialogTitle>
                <DialogDescription>
                  {editingCrop ? "Update crop information" : "Enter crop details"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Crop Name *</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="season">Seasons (comma-separated)</Label>
                    <Input
                      id="season"
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      placeholder="Kharif, Rabi, Summer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="growth_duration">Growth Duration</Label>
                    <Input
                      id="growth_duration"
                      value={formData.growth_duration}
                      onChange={(e) => setFormData({ ...formData, growth_duration: e.target.value })}
                      placeholder="90-120 days"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="climate_type">Climate Types (comma-separated)</Label>
                    <Input
                      id="climate_type"
                      value={formData.climate_type}
                      onChange={(e) => setFormData({ ...formData, climate_type: e.target.value })}
                      placeholder="Tropical, Subtropical"
                    />
                  </div>
                  <div>
                    <Label htmlFor="soil_type">Soil Types (comma-separated)</Label>
                    <Input
                      id="soil_type"
                      value={formData.soil_type}
                      onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                      placeholder="Loamy, Clay, Sandy"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="water_requirement">Water Requirement</Label>
                  <Input
                    id="water_requirement"
                    value={formData.water_requirement}
                    onChange={(e) => setFormData({ ...formData, water_requirement: e.target.value })}
                    placeholder="Medium, High, Low"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingCrop ? "Update" : "Create"}
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
              <TableHead>Season</TableHead>
              <TableHead>Growth Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell className="font-medium">{crop.name}</TableCell>
                <TableCell>{crop.scientific_name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {crop.season?.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{crop.growth_duration}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(crop)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(crop.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {crops.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No crops found. Add your first crop to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CropManagement;