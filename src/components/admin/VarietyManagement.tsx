import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Crop {
  id: string;
  name: string;
}

interface Variety {
  id: string;
  crop_id: string;
  name: string;
  duration: string;
  yield_potential: string;
  grain_quality: string;
  market_type: string;
  suitable_states: string[];
  disease_resistance: string[];
  special_features: string[];
  crop?: { name: string };
}

const VarietyManagement = () => {
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState<Variety | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    crop_id: "",
    name: "",
    duration: "",
    yield_potential: "",
    grain_quality: "",
    market_type: "",
    suitable_states: "",
    disease_resistance: "",
    special_features: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch crops for dropdown
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('id, name')
        .order('name');
      
      if (cropsError) throw cropsError;
      setCrops(cropsData || []);

      // Fetch varieties with crop names
      const { data: varietiesData, error: varietiesError } = await supabase
        .from('varieties')
        .select(`
          *,
          crop:crops(name)
        `)
        .order('created_at', { ascending: false });
      
      if (varietiesError) throw varietiesError;
      setVarieties(varietiesData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const varietyData = {
        ...formData,
        suitable_states: formData.suitable_states.split(',').map(s => s.trim()).filter(Boolean),
        disease_resistance: formData.disease_resistance.split(',').map(s => s.trim()).filter(Boolean),
        special_features: formData.special_features.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingVariety) {
        const { error } = await supabase
          .from('varieties')
          .update(varietyData)
          .eq('id', editingVariety.id);
        if (error) throw error;
        toast({ title: "Success", description: "Variety updated successfully" });
      } else {
        const { error } = await supabase
          .from('varieties')
          .insert([varietyData]);
        if (error) throw error;
        toast({ title: "Success", description: "Variety created successfully" });
      }

      setIsDialogOpen(false);
      setEditingVariety(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save variety",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (variety: Variety) => {
    setEditingVariety(variety);
    setFormData({
      crop_id: variety.crop_id,
      name: variety.name,
      duration: variety.duration || "",
      yield_potential: variety.yield_potential || "",
      grain_quality: variety.grain_quality || "",
      market_type: variety.market_type || "",
      suitable_states: variety.suitable_states?.join(', ') || "",
      disease_resistance: variety.disease_resistance?.join(', ') || "",
      special_features: variety.special_features?.join(', ') || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this variety?")) return;

    try {
      const { error } = await supabase
        .from('varieties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Variety deleted successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete variety",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      crop_id: "",
      name: "",
      duration: "",
      yield_potential: "",
      grain_quality: "",
      market_type: "",
      suitable_states: "",
      disease_resistance: "",
      special_features: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Variety Management</CardTitle>
            <CardDescription>Manage crop varieties and their characteristics</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingVariety(null); resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Variety
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingVariety ? "Edit Variety" : "Add New Variety"}</DialogTitle>
                <DialogDescription>
                  {editingVariety ? "Update variety information" : "Enter variety details"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crop_id">Crop *</Label>
                    <Select value={formData.crop_id} onValueChange={(value) => setFormData({ ...formData, crop_id: value })}>
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
                    <Label htmlFor="name">Variety Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="90-120 days"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yield_potential">Yield Potential</Label>
                    <Input
                      id="yield_potential"
                      value={formData.yield_potential}
                      onChange={(e) => setFormData({ ...formData, yield_potential: e.target.value })}
                      placeholder="40-50 quintals/hectare"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grain_quality">Grain Quality</Label>
                    <Input
                      id="grain_quality"
                      value={formData.grain_quality}
                      onChange={(e) => setFormData({ ...formData, grain_quality: e.target.value })}
                      placeholder="Good, Medium, High"
                    />
                  </div>
                  <div>
                    <Label htmlFor="market_type">Market Type</Label>
                    <Input
                      id="market_type"
                      value={formData.market_type}
                      onChange={(e) => setFormData({ ...formData, market_type: e.target.value })}
                      placeholder="Local, Export, Industrial"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="suitable_states">Suitable States (comma-separated)</Label>
                  <Input
                    id="suitable_states"
                    value={formData.suitable_states}
                    onChange={(e) => setFormData({ ...formData, suitable_states: e.target.value })}
                    placeholder="Punjab, Haryana, Uttar Pradesh"
                  />
                </div>

                <div>
                  <Label htmlFor="disease_resistance">Disease Resistance (comma-separated)</Label>
                  <Input
                    id="disease_resistance"
                    value={formData.disease_resistance}
                    onChange={(e) => setFormData({ ...formData, disease_resistance: e.target.value })}
                    placeholder="Blast, Brown spot, Bacterial blight"
                  />
                </div>

                <div>
                  <Label htmlFor="special_features">Special Features (comma-separated)</Label>
                  <Input
                    id="special_features"
                    value={formData.special_features}
                    onChange={(e) => setFormData({ ...formData, special_features: e.target.value })}
                    placeholder="Drought tolerant, High protein, Early maturing"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingVariety ? "Update" : "Create"}
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
              <TableHead>Crop</TableHead>
              <TableHead>Variety Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Yield Potential</TableHead>
              <TableHead>Grain Quality</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {varieties.map((variety) => (
              <TableRow key={variety.id}>
                <TableCell>
                  <Badge variant="outline">
                    {variety.crop?.name || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{variety.name}</TableCell>
                <TableCell>{variety.duration}</TableCell>
                <TableCell>{variety.yield_potential}</TableCell>
                <TableCell>{variety.grain_quality}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(variety)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(variety.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {varieties.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No varieties found. Add your first variety to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VarietyManagement;