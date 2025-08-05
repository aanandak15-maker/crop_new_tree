import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, Trash2, Eye, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageRecord {
  id: string;
  image_url: string;
  caption?: string;
  alt_text?: string;
  is_primary: boolean;
  created_at: string;
  entity_type: 'crop' | 'variety' | 'pest' | 'disease';
  entity_id: string;
  entity_name: string;
}

const ImageManager = () => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    entity_type: "crop" as const,
    entity_id: "",
    caption: "",
    alt_text: "",
    is_primary: false
  });
  const [entities, setEntities] = useState<{[key: string]: Array<{id: string, name: string}>}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
    fetchEntities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [images, searchTerm, entityFilter]);

  const fetchEntities = async () => {
    try {
      const [crops, varieties, pests, diseases] = await Promise.all([
        supabase.from("crops").select("id, name"),
        supabase.from("varieties").select("id, name"),
        supabase.from("pests").select("id, name"),
        supabase.from("diseases").select("id, name")
      ]);

      setEntities({
        crop: crops.data || [],
        variety: varieties.data || [],
        pest: pests.data || [],
        disease: diseases.data || []
      });
    } catch (error) {
      console.error("Error fetching entities:", error);
    }
  };

  const fetchImages = async () => {
    try {
      // Fetch all image records from different tables
      const [cropImages, varietyImages, pestImages, diseaseImages] = await Promise.all([
        supabase.from("crop_images").select(`
          id, image_url, caption, alt_text, is_primary, created_at, crop_id,
          crops!inner(name)
        `),
        supabase.from("variety_images").select(`
          id, image_url, caption, alt_text, is_primary, created_at, variety_id,
          varieties!inner(name)
        `),
        supabase.from("pest_images").select(`
          id, image_url, caption, alt_text, is_primary, created_at, pest_id,
          pests!inner(name)
        `),
        supabase.from("disease_images").select(`
          id, image_url, caption, alt_text, is_primary, created_at, disease_id,
          diseases!inner(name)
        `)
      ]);

      // Combine all images into a unified format
      const allImages: ImageRecord[] = [
        ...(cropImages.data || []).map(img => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption,
          alt_text: img.alt_text,
          is_primary: img.is_primary,
          created_at: img.created_at,
          entity_type: 'crop' as const,
          entity_id: img.crop_id,
          entity_name: img.crops.name
        })),
        ...(varietyImages.data || []).map(img => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption,
          alt_text: img.alt_text,
          is_primary: img.is_primary,
          created_at: img.created_at,
          entity_type: 'variety' as const,
          entity_id: img.variety_id,
          entity_name: img.varieties.name
        })),
        ...(pestImages.data || []).map(img => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption,
          alt_text: img.alt_text,
          is_primary: img.is_primary,
          created_at: img.created_at,
          entity_type: 'pest' as const,
          entity_id: img.pest_id,
          entity_name: img.pests.name
        })),
        ...(diseaseImages.data || []).map(img => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption,
          alt_text: img.alt_text,
          is_primary: img.is_primary,
          created_at: img.created_at,
          entity_type: 'disease' as const,
          entity_id: img.disease_id,
          entity_name: img.diseases.name
        }))
      ];

      setImages(allImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = images;

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (entityFilter !== "all") {
      filtered = filtered.filter(img => img.entity_type === entityFilter);
    }

    setFilteredImages(filtered);
  };

  const handleFileUpload = async (file: File) => {
    if (!uploadForm.entity_id) {
      toast({
        title: "Error",
        description: "Please select an entity",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uploadForm.entity_type}-${uploadForm.entity_id}-${Date.now()}.${fileExt}`;
      const bucketName = `${uploadForm.entity_type}-images`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // Save image record to appropriate table
      let dbError;
      if (uploadForm.entity_type === 'crop') {
        const { error } = await supabase.from('crop_images').insert({
          crop_id: uploadForm.entity_id,
          image_url: publicUrl,
          caption: uploadForm.caption,
          alt_text: uploadForm.alt_text,
          is_primary: uploadForm.is_primary
        });
        dbError = error;
      } else if (uploadForm.entity_type === 'variety') {
        const { error } = await supabase.from('variety_images').insert({
          variety_id: uploadForm.entity_id,
          image_url: publicUrl,
          caption: uploadForm.caption,
          alt_text: uploadForm.alt_text,
          is_primary: uploadForm.is_primary
        });
        dbError = error;
      } else if (uploadForm.entity_type === 'pest') {
        const { error } = await supabase.from('pest_images').insert({
          pest_id: uploadForm.entity_id,
          image_url: publicUrl,
          caption: uploadForm.caption,
          alt_text: uploadForm.alt_text,
          is_primary: uploadForm.is_primary
        });
        dbError = error;
      } else if (uploadForm.entity_type === 'disease') {
        const { error } = await supabase.from('disease_images').insert({
          disease_id: uploadForm.entity_id,
          image_url: publicUrl,
          caption: uploadForm.caption,
          alt_text: uploadForm.alt_text,
          is_primary: uploadForm.is_primary
        });
        dbError = error;
      }

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });

      setIsUploadDialogOpen(false);
      setUploadForm({
        entity_type: "crop",
        entity_id: "",
        caption: "",
        alt_text: "",
        is_primary: false
      });
      fetchImages();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (image: ImageRecord) => {
    try {
      let error;
      if (image.entity_type === 'crop') {
        const result = await supabase.from('crop_images').delete().eq('id', image.id);
        error = result.error;
      } else if (image.entity_type === 'variety') {
        const result = await supabase.from('variety_images').delete().eq('id', image.id);
        error = result.error;
      } else if (image.entity_type === 'pest') {
        const result = await supabase.from('pest_images').delete().eq('id', image.id);
        error = result.error;
      } else if (image.entity_type === 'disease') {
        const result = await supabase.from('disease_images').delete().eq('id', image.id);
        error = result.error;
      }

      if (error) throw error;

      // Also delete from storage
      const bucketName = `${image.entity_type}-images`;
      const fileName = image.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from(bucketName).remove([fileName]);
      }

      toast({
        title: "Success",
        description: "Image deleted successfully"
      });
      fetchImages();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading images...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Manager
              </CardTitle>
              <CardDescription>
                Manage images for crops, varieties, pests, and diseases
              </CardDescription>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Image</DialogTitle>
                  <DialogDescription>
                    Upload an image and associate it with a crop, variety, pest, or disease
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="entity_type">Entity Type</Label>
                    <Select value={uploadForm.entity_type} onValueChange={(value: any) => 
                      setUploadForm(prev => ({ ...prev, entity_type: value, entity_id: "" }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crop">Crop</SelectItem>
                        <SelectItem value="variety">Variety</SelectItem>
                        <SelectItem value="pest">Pest</SelectItem>
                        <SelectItem value="disease">Disease</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="entity_id">Select {uploadForm.entity_type}</Label>
                    <Select value={uploadForm.entity_id} onValueChange={(value) => 
                      setUploadForm(prev => ({ ...prev, entity_id: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select a ${uploadForm.entity_type}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {entities[uploadForm.entity_type]?.map(entity => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Input
                      id="caption"
                      value={uploadForm.caption}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Image caption"
                    />
                  </div>

                  <div>
                    <Label htmlFor="alt_text">Alt Text</Label>
                    <Input
                      id="alt_text"
                      value={uploadForm.alt_text}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
                      placeholder="Alt text for accessibility"
                    />
                  </div>

                  <div>
                    <Label htmlFor="file">Image File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      disabled={uploading}
                    />
                  </div>

                  {uploading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/2"
            />
            
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="crop">Crops</SelectItem>
                <SelectItem value="variety">Varieties</SelectItem>
                <SelectItem value="pest">Pests</SelectItem>
                <SelectItem value="disease">Diseases</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.caption || "Image"}
                    className="w-full h-full object-cover"
                  />
                  {image.is_primary && (
                    <Badge className="absolute top-2 left-2 bg-green-600">
                      Primary
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {image.entity_type}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(image.image_url, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteImage(image)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{image.entity_name}</p>
                    {image.caption && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {image.caption}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No images found</p>
              <p className="text-sm text-gray-400">Upload images to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManager;