import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileSpreadsheet, FileImage, File, Save, Database } from 'lucide-react';
import { DocumentUpload, ExtractedCropData } from './useDocumentProcessor';

interface DocumentDetailViewProps {
  currentDocument: DocumentUpload | null;
  saveAllCrops: () => Promise<void>;
  saveCropToDatabase: (cropData: ExtractedCropData) => Promise<any>;
}

export const DocumentDetailView: React.FC<DocumentDetailViewProps> = ({
  currentDocument,
  saveAllCrops,
  saveCropToDatabase
}) => {
  // Debug logging
  console.log('DocumentDetailView render - currentDocument:', currentDocument);
  console.log('Extracted crops count:', currentDocument?.extracted_crops?.length || 0);
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case 'image':
        return <FileImage className="h-4 w-4 text-blue-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!currentDocument) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a document to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getFileIcon(currentDocument.type)}
          {currentDocument.name}
        </CardTitle>
        <CardDescription>
          {currentDocument.extracted_crops.length} crops extracted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="extracted" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
            <TabsTrigger value="save">Save to Database</TabsTrigger>
          </TabsList>

          <TabsContent value="extracted" className="space-y-4">
            <div className="grid gap-6">
              {currentDocument.extracted_crops.map((crop, index) => (
                <Card key={index} className="p-6">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{crop.name}</h3>
                        <Badge variant="outline" className="text-sm">
                          {crop.confidence_score ? `${(crop.confidence_score * 100).toFixed(0)}%` : 'N/A'}
                        </Badge>
                      </div>
                      <p className="text-lg text-muted-foreground mb-3">
                        {crop.scientific_name}
                      </p>
                      <p className="text-base leading-relaxed">{crop.description}</p>
                    </div>
                  </div>

                  {/* Basic Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Growing Conditions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Growing Conditions</h4>
                      <div className="space-y-2">
                        {crop.season && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Seasons:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crop.season.map((s, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {crop.climate_type && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Climate:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crop.climate_type.map((c, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {crop.climate_zone && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Climate Zones:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crop.climate_zone.map((z, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {z}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {crop.soil_type && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Soil Types:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crop.soil_type.map((s, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {crop.soil_texture && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Soil Texture:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crop.soil_texture.map((t, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Plant Characteristics */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Plant Characteristics</h4>
                      <div className="space-y-2 text-sm">
                        {crop.origin && <div><span className="font-medium">Origin:</span> {crop.origin}</div>}
                        {crop.growth_habit && <div><span className="font-medium">Growth Habit:</span> {crop.growth_habit}</div>}
                        {crop.life_span && <div><span className="font-medium">Life Span:</span> {crop.life_span}</div>}
                        {crop.plant_type && <div><span className="font-medium">Plant Type:</span> {crop.plant_type}</div>}
                        {crop.fruit_type && <div><span className="font-medium">Fruit Type:</span> {crop.fruit_type}</div>}
                        {crop.edible_part && <div><span className="font-medium">Edible Part:</span> {crop.edible_part}</div>}
                        {crop.pollination && <div><span className="font-medium">Pollination:</span> {crop.pollination}</div>}
                        {crop.propagation_type && <div><span className="font-medium">Propagation:</span> {crop.propagation_type}</div>}
                        {crop.planting_season && <div><span className="font-medium">Planting Season:</span> {crop.planting_season}</div>}
                        {crop.light_requirement && <div><span className="font-medium">Light:</span> {crop.light_requirement}</div>}
                      </div>
                    </div>

                    {/* Environmental Requirements */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Environmental Requirements</h4>
                      <div className="space-y-2 text-sm">
                        {crop.water_requirement && <div><span className="font-medium">Water:</span> {crop.water_requirement}</div>}
                        {crop.optimum_temp && <div><span className="font-medium">Optimum Temp:</span> {crop.optimum_temp}</div>}
                        {crop.tolerable_temp && <div><span className="font-medium">Tolerable Temp:</span> {crop.tolerable_temp}</div>}
                        {crop.growth_duration && <div><span className="font-medium">Growth Duration:</span> {crop.growth_duration}</div>}
                        {crop.average_yield && <div><span className="font-medium">Average Yield:</span> {crop.average_yield}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Additional Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pests & Diseases */}
                    {(crop.pest_name || crop.disease_name) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pests & Diseases</h4>
                        <div className="space-y-2">
                          {crop.pest_name && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Pests:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {crop.pest_name.map((pest, i) => (
                                  <Badge key={i} variant="destructive" className="text-xs">
                                    {pest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {crop.disease_name && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Diseases:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {crop.disease_name.map((disease, i) => (
                                  <Badge key={i} variant="destructive" className="text-xs">
                                    {disease}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Harvest & Storage */}
                    {(crop.harvest_time || crop.maturity_indicators || crop.storage_conditions || crop.shelf_life) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Harvest & Storage</h4>
                        <div className="space-y-2 text-sm">
                          {crop.harvest_time && <div><span className="font-medium">Harvest Time:</span> {crop.harvest_time}</div>}
                          {crop.maturity_indicators && <div><span className="font-medium">Maturity Indicators:</span> {crop.maturity_indicators}</div>}
                          {crop.storage_conditions && <div><span className="font-medium">Storage:</span> {crop.storage_conditions}</div>}
                          {crop.shelf_life && <div><span className="font-medium">Shelf Life:</span> {crop.shelf_life}</div>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Products & Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Processed Products */}
                    {crop.processed_products && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Processed Products</h4>
                        <div className="flex flex-wrap gap-1">
                          {crop.processed_products.map((product, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Health Benefits */}
                    {crop.health_benefits && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Health Benefits</h4>
                        <p className="text-sm">{crop.health_benefits}</p>
                      </div>
                    )}
                  </div>

                  {/* Varieties */}
                  {crop.variety_name && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Varieties</h4>
                      <div className="flex flex-wrap gap-1">
                        {crop.variety_name.map((variety, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {variety}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extraction Notes */}
                  {crop.extraction_notes && (
                    <div className="mt-6 p-3 bg-muted rounded-lg">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Extraction Notes</h4>
                      <p className="text-sm text-muted-foreground">{crop.extraction_notes}</p>
                    </div>
                  )}
                </Card>
              ))}
              {currentDocument.extracted_crops.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No crops extracted yet</p>
                  <p className="text-sm">Processing may still be in progress</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="save" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Save Extracted Crops</h4>
                  <p className="text-sm text-muted-foreground">
                    Save all extracted crops to the database
                  </p>
                </div>
                <Button
                  onClick={saveAllCrops}
                  disabled={currentDocument.extracted_crops.length === 0}
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  Save All ({currentDocument.extracted_crops.length})
                </Button>
              </div>

              <div className="grid gap-4">
                {currentDocument.extracted_crops.map((crop, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium">{crop.name}</h5>
                        <p className="text-sm text-muted-foreground">{crop.scientific_name}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveCropToDatabase(crop)}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
