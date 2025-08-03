import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Filter, Download, Upload, RefreshCw } from "lucide-react";

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
  family?: string;
  temperature_range?: string;
  rainfall_requirement?: string;
  humidity_range?: string;
  soil_ph?: string;
  drainage_requirement?: string;
  land_preparation?: string[];
  seed_rate?: string;
  row_spacing?: string;
  sowing_time?: string;
  fertilizer_requirement?: string[];
  irrigation_schedule?: string[];
  harvesting_info?: string[];
  pest_list?: string[];
  disease_list?: string[];
  average_yield?: string;
  market_price?: string;
  cost_of_cultivation?: string;
  nutritional_info?: string;
  sustainability_practices?: string[];
  innovations?: string[];
}

const EnhancedCropManagement = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [climateFilter, setClimateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

  useEffect(() => {
    applyFilters();
  }, [crops, searchTerm, seasonFilter, climateFilter]);

  const fetchCrops = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = crops.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeason = seasonFilter === "all" || 
                           crop.season?.some(s => s.toLowerCase().includes(seasonFilter.toLowerCase()));
      
      const matchesClimate = climateFilter === "all" || 
                             crop.climate_type?.some(c => c.toLowerCase().includes(climateFilter.toLowerCase()));
      
      return matchesSearch && matchesSeason && matchesClimate;
    });
    
    setFilteredCrops(filtered);
    setCurrentPage(1);
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
      family: crop.family || "",
      temperature_range: crop.temperature_range || "",
      rainfall_requirement: crop.rainfall_requirement || "",
      humidity_range: crop.humidity_range || "",
      soil_ph: crop.soil_ph || "",
      drainage_requirement: crop.drainage_requirement || "",
      land_preparation: crop.land_preparation?.join(', ') || "",
      seed_rate: crop.seed_rate || "",
      row_spacing: crop.row_spacing || "",
      sowing_time: crop.sowing_time || "",
      fertilizer_requirement: crop.fertilizer_requirement?.join(', ') || "",
      irrigation_schedule: crop.irrigation_schedule?.join(', ') || "",
      harvesting_info: crop.harvesting_info?.join(', ') || "",
      pest_list: crop.pest_list?.join(', ') || "",
      disease_list: crop.disease_list?.join(', ') || "",
      average_yield: crop.average_yield || "",
      market_price: crop.market_price || "",
      cost_of_cultivation: crop.cost_of_cultivation || "",
      nutritional_info: crop.nutritional_info || "",
      sustainability_practices: crop.sustainability_practices?.join(', ') || "",
      innovations: crop.innovations?.join(', ') || ""
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

  const handleBulkDelete = async () => {
    if (selectedCrops.length === 0) {
      toast({
        title: "Warning",
        description: "Please select crops to delete",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCrops.length} crops?`)) return;

    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .in('id', selectedCrops);
      
      if (error) throw error;
      toast({ title: "Success", description: `${selectedCrops.length} crops deleted successfully` });
      setSelectedCrops([]);
      fetchCrops();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crops",
        variant: "destructive"
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCrops(paginatedCrops.map(crop => crop.id));
    } else {
      setSelectedCrops([]);
    }
  };

  const handleSelectCrop = (cropId: string, checked: boolean) => {
    if (checked) {
      setSelectedCrops(prev => [...prev, cropId]);
    } else {
      setSelectedCrops(prev => prev.filter(id => id !== cropId));
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Scientific Name,Description,Season,Climate Type,Soil Type\n"
      + filteredCrops.map(crop => 
          `"${crop.name}","${crop.scientific_name || ''}","${crop.description || ''}","${crop.season?.join('; ') || ''}","${crop.climate_type?.join('; ') || ''}","${crop.soil_type?.join('; ') || ''}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "crops_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFormData({
      name: "", scientific_name: "", description: "", season: "", climate_type: "",
      soil_type: "", water_requirement: "", growth_duration: "", family: "",
      temperature_range: "", rainfall_requirement: "", humidity_range: "",
      soil_ph: "", drainage_requirement: "", land_preparation: "", seed_rate: "",
      row_spacing: "", sowing_time: "", fertilizer_requirement: "", irrigation_schedule: "",
      harvesting_info: "", pest_list: "", disease_list: "", average_yield: "",
      market_price: "", cost_of_cultivation: "", nutritional_info: "",
      sustainability_practices: "", innovations: ""
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSeasonFilter("all");
    setClimateFilter("all");
  };

  // Pagination
  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCrops = filteredCrops.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Enhanced Crop Management</CardTitle>
            <CardDescription>Advanced crop management with search, filters, and bulk operations</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={fetchCrops}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {selectedCrops.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedCrops.length})
              </Button>
            )}
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
                    {editingCrop ? "Update crop information" : "Enter detailed crop information"}
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
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search">Search Crops</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, scientific name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="min-w-[150px]">
            <Label htmlFor="season-filter">Season</Label>
            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="kharif">Kharif</SelectItem>
                <SelectItem value="rabi">Rabi</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px]">
            <Label htmlFor="climate-filter">Climate</Label>
            <Select value={climateFilter} onValueChange={setClimateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Climates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Climates</SelectItem>
                <SelectItem value="tropical">Tropical</SelectItem>
                <SelectItem value="subtropical">Subtropical</SelectItem>
                <SelectItem value="temperate">Temperate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCrops.length)} of {filteredCrops.length} crops
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <span className="text-sm font-medium">{itemsPerPage}</span>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCrops.length === paginatedCrops.length && paginatedCrops.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Scientific Name</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Climate Type</TableHead>
                <TableHead>Growth Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading crops...
                  </TableCell>
                </TableRow>
              ) : paginatedCrops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No crops found. {searchTerm || seasonFilter !== "all" || climateFilter !== "all" 
                      ? "Try adjusting your filters." 
                      : "Add your first crop to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCrops.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCrops.includes(crop.id)}
                        onCheckedChange={(checked) => handleSelectCrop(crop.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell className="text-muted-foreground">{crop.scientific_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {crop.season?.map((season, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {season}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {crop.climate_type?.map((climate, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {climate}
                          </Badge>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCropManagement;