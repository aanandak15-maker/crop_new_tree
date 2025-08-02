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
    growth_duration: "",
    // Additional detailed fields like wheat
    family: "",
    temperature_range: "",
    rainfall_requirement: "",
    humidity_range: "",
    soil_ph: "",
    drainage_requirement: "",
    land_preparation: "",
    seed_rate: "",
    row_spacing: "",
    sowing_time: "",
    fertilizer_requirement: "",
    irrigation_schedule: "",
    harvesting_info: "",
    pest_list: "",
    disease_list: "",
    average_yield: "",
    market_price: "",
    cost_of_cultivation: "",
    nutritional_info: "",
    sustainability_practices: "",
    innovations: ""
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
        name: formData.name,
        scientific_name: formData.scientific_name,
        description: formData.description,
        season: formData.season.split(',').map(s => s.trim()).filter(Boolean),
        climate_type: formData.climate_type.split(',').map(s => s.trim()).filter(Boolean),
        soil_type: formData.soil_type.split(',').map(s => s.trim()).filter(Boolean),
        water_requirement: formData.water_requirement,
        growth_duration: formData.growth_duration,
        family: formData.family,
        temperature_range: formData.temperature_range,
        rainfall_requirement: formData.rainfall_requirement,
        humidity_range: formData.humidity_range,
        soil_ph: formData.soil_ph,
        drainage_requirement: formData.drainage_requirement,
        land_preparation: formData.land_preparation.split(',').map(s => s.trim()).filter(Boolean),
        seed_rate: formData.seed_rate,
        row_spacing: formData.row_spacing,
        sowing_time: formData.sowing_time,
        fertilizer_requirement: formData.fertilizer_requirement.split(',').map(s => s.trim()).filter(Boolean),
        irrigation_schedule: formData.irrigation_schedule.split(',').map(s => s.trim()).filter(Boolean),
        harvesting_info: formData.harvesting_info.split(',').map(s => s.trim()).filter(Boolean),
        pest_list: formData.pest_list.split(',').map(s => s.trim()).filter(Boolean),
        disease_list: formData.disease_list.split(',').map(s => s.trim()).filter(Boolean),
        average_yield: formData.average_yield,
        market_price: formData.market_price,
        cost_of_cultivation: formData.cost_of_cultivation,
        nutritional_info: formData.nutritional_info,
        sustainability_practices: formData.sustainability_practices.split(',').map(s => s.trim()).filter(Boolean),
        innovations: formData.innovations.split(',').map(s => s.trim()).filter(Boolean)
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
      growth_duration: crop.growth_duration || "",
      family: (crop as any).family || "",
      temperature_range: (crop as any).temperature_range || "",
      rainfall_requirement: (crop as any).rainfall_requirement || "",
      humidity_range: (crop as any).humidity_range || "",
      soil_ph: (crop as any).soil_ph || "",
      drainage_requirement: (crop as any).drainage_requirement || "",
      land_preparation: (crop as any).land_preparation?.join(', ') || "",
      seed_rate: (crop as any).seed_rate || "",
      row_spacing: (crop as any).row_spacing || "",
      sowing_time: (crop as any).sowing_time || "",
      fertilizer_requirement: (crop as any).fertilizer_requirement?.join(', ') || "",
      irrigation_schedule: (crop as any).irrigation_schedule?.join(', ') || "",
      harvesting_info: (crop as any).harvesting_info?.join(', ') || "",
      pest_list: (crop as any).pest_list?.join(', ') || "",
      disease_list: (crop as any).disease_list?.join(', ') || "",
      average_yield: (crop as any).average_yield || "",
      market_price: (crop as any).market_price || "",
      cost_of_cultivation: (crop as any).cost_of_cultivation || "",
      nutritional_info: (crop as any).nutritional_info || "",
      sustainability_practices: (crop as any).sustainability_practices?.join(', ') || "",
      innovations: (crop as any).innovations?.join(', ') || ""
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
      growth_duration: "",
      family: "",
      temperature_range: "",
      rainfall_requirement: "",
      humidity_range: "",
      soil_ph: "",
      drainage_requirement: "",
      land_preparation: "",
      seed_rate: "",
      row_spacing: "",
      sowing_time: "",
      fertilizer_requirement: "",
      irrigation_schedule: "",
      harvesting_info: "",
      pest_list: "",
      disease_list: "",
      average_yield: "",
      market_price: "",
      cost_of_cultivation: "",
      nutritional_info: "",
      sustainability_practices: "",
      innovations: ""
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</DialogTitle>
                <DialogDescription>
                  {editingCrop ? "Update crop information" : "Enter detailed crop information like wheat example"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="family">Family</Label>
                      <Input
                        id="family"
                        value={formData.family}
                        onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                        placeholder="e.g., Poaceae (Gramineae)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="season">Seasons (comma-separated)</Label>
                      <Input
                        id="season"
                        value={formData.season}
                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                        placeholder="Kharif, Rabi, Summer"
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
                </div>

                {/* Climate & Soil Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Climate & Soil Requirements</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="temperature_range">Temperature Range</Label>
                      <Input
                        id="temperature_range"
                        value={formData.temperature_range}
                        onChange={(e) => setFormData({ ...formData, temperature_range: e.target.value })}
                        placeholder="15-25°C"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rainfall_requirement">Rainfall Requirement</Label>
                      <Input
                        id="rainfall_requirement"
                        value={formData.rainfall_requirement}
                        onChange={(e) => setFormData({ ...formData, rainfall_requirement: e.target.value })}
                        placeholder="500-700mm annually"
                      />
                    </div>
                    <div>
                      <Label htmlFor="humidity_range">Humidity Range</Label>
                      <Input
                        id="humidity_range"
                        value={formData.humidity_range}
                        onChange={(e) => setFormData({ ...formData, humidity_range: e.target.value })}
                        placeholder="50-70%"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="soil_type">Soil Types (comma-separated)</Label>
                      <Input
                        id="soil_type"
                        value={formData.soil_type}
                        onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                        placeholder="Loamy, Clay, Sandy"
                      />
                    </div>
                    <div>
                      <Label htmlFor="soil_ph">Soil pH Range</Label>
                      <Input
                        id="soil_ph"
                        value={formData.soil_ph}
                        onChange={(e) => setFormData({ ...formData, soil_ph: e.target.value })}
                        placeholder="6.0-7.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="drainage_requirement">Drainage Requirement</Label>
                      <Input
                        id="drainage_requirement"
                        value={formData.drainage_requirement}
                        onChange={(e) => setFormData({ ...formData, drainage_requirement: e.target.value })}
                        placeholder="Good drainage essential"
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
                      <Label htmlFor="water_requirement">Water Requirement</Label>
                      <Input
                        id="water_requirement"
                        value={formData.water_requirement}
                        onChange={(e) => setFormData({ ...formData, water_requirement: e.target.value })}
                        placeholder="Medium, High, Low"
                      />
                    </div>
                  </div>
                </div>

                {/* Cultivation Practices */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cultivation Practices</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="growth_duration">Growth Duration</Label>
                      <Input
                        id="growth_duration"
                        value={formData.growth_duration}
                        onChange={(e) => setFormData({ ...formData, growth_duration: e.target.value })}
                        placeholder="90-120 days"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sowing_time">Sowing Time</Label>
                      <Input
                        id="sowing_time"
                        value={formData.sowing_time}
                        onChange={(e) => setFormData({ ...formData, sowing_time: e.target.value })}
                        placeholder="Nov-Dec"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seed_rate">Seed Rate</Label>
                      <Input
                        id="seed_rate"
                        value={formData.seed_rate}
                        onChange={(e) => setFormData({ ...formData, seed_rate: e.target.value })}
                        placeholder="100-125 kg/ha"
                      />
                    </div>
                    <div>
                      <Label htmlFor="row_spacing">Row Spacing</Label>
                      <Input
                        id="row_spacing"
                        value={formData.row_spacing}
                        onChange={(e) => setFormData({ ...formData, row_spacing: e.target.value })}
                        placeholder="20-22.5 cm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="land_preparation">Land Preparation</Label>
                    <Textarea
                      id="land_preparation"
                      value={formData.land_preparation}
                      onChange={(e) => setFormData({ ...formData, land_preparation: e.target.value })}
                      placeholder="Deep ploughing, Harrowing, Leveling, Apply FYM 8-10 t/ha"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fertilizer_requirement">Fertilizer Requirement</Label>
                    <Textarea
                      id="fertilizer_requirement"
                      value={formData.fertilizer_requirement}
                      onChange={(e) => setFormData({ ...formData, fertilizer_requirement: e.target.value })}
                      placeholder="NPK: 120:60:40 kg/ha, Urea in 3 splits, DAP at sowing"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="irrigation_schedule">Irrigation Schedule</Label>
                    <Textarea
                      id="irrigation_schedule"
                      value={formData.irrigation_schedule}
                      onChange={(e) => setFormData({ ...formData, irrigation_schedule: e.target.value })}
                      placeholder="Crown root initiation (20-25 DAS), Tillering (40-45 DAS), etc."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="harvesting_info">Harvesting Information</Label>
                    <Textarea
                      id="harvesting_info"
                      value={formData.harvesting_info}
                      onChange={(e) => setFormData({ ...formData, harvesting_info: e.target.value })}
                      placeholder="Harvest at physiological maturity, Moisture content: 20-25%"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Pests & Diseases */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pests & Diseases</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pest_list">Common Pests (comma-separated)</Label>
                      <Textarea
                        id="pest_list"
                        value={formData.pest_list}
                        onChange={(e) => setFormData({ ...formData, pest_list: e.target.value })}
                        placeholder="Aphids, Termites, Cutworms, Armyworms"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="disease_list">Common Diseases (comma-separated)</Label>
                      <Textarea
                        id="disease_list"
                        value={formData.disease_list}
                        onChange={(e) => setFormData({ ...formData, disease_list: e.target.value })}
                        placeholder="Yellow rust, Brown rust, Powdery mildew"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Economics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Economic Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="average_yield">Average Yield</Label>
                      <Input
                        id="average_yield"
                        value={formData.average_yield}
                        onChange={(e) => setFormData({ ...formData, average_yield: e.target.value })}
                        placeholder="32 q/ha"
                      />
                    </div>
                    <div>
                      <Label htmlFor="market_price">Market Price</Label>
                      <Input
                        id="market_price"
                        value={formData.market_price}
                        onChange={(e) => setFormData({ ...formData, market_price: e.target.value })}
                        placeholder="₹2000-2500/quintal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost_of_cultivation">Cost of Cultivation</Label>
                      <Input
                        id="cost_of_cultivation"
                        value={formData.cost_of_cultivation}
                        onChange={(e) => setFormData({ ...formData, cost_of_cultivation: e.target.value })}
                        placeholder="₹35,000-45,000/ha"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  <div>
                    <Label htmlFor="nutritional_info">Nutritional Information</Label>
                    <Textarea
                      id="nutritional_info"
                      value={formData.nutritional_info}
                      onChange={(e) => setFormData({ ...formData, nutritional_info: e.target.value })}
                      placeholder="Calories: 340 kcal, Protein: 12.2%, Carbohydrates: 71%"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sustainability_practices">Sustainability Practices</Label>
                    <Textarea
                      id="sustainability_practices"
                      value={formData.sustainability_practices}
                      onChange={(e) => setFormData({ ...formData, sustainability_practices: e.target.value })}
                      placeholder="Crop rotation with legumes, Zero tillage technology, IPM"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="innovations">Recent Innovations</Label>
                    <Textarea
                      id="innovations"
                      value={formData.innovations}
                      onChange={(e) => setFormData({ ...formData, innovations: e.target.value })}
                      placeholder="Drought tolerant varieties, Precision sowing techniques"
                      rows={2}
                    />
                  </div>
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