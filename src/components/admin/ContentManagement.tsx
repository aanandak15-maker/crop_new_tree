import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Plus, Eye, Clock, Settings, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContentSchedule {
  id: string;
  content_type: 'crop' | 'variety' | 'pest' | 'disease';
  content_id: string;
  content_title: string;
  action: 'publish' | 'unpublish' | 'update';
  scheduled_for: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_by: string;
  created_at: string;
}

interface Translation {
  id: string;
  content_type: string;
  content_id: string;
  field_name: string;
  language_code: string;
  original_text: string;
  translated_text: string;
  status: 'pending' | 'completed' | 'needs_review';
  translated_by?: string;
  updated_at: string;
}

interface SEOSettings {
  id: string;
  content_type: string;
  content_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  updated_at: string;
}

const ContentManagement = () => {
  const [schedules, setSchedules] = useState<ContentSchedule[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  const { toast } = useToast();

  const [scheduleForm, setScheduleForm] = useState({
    content_type: "crop" as const,
    content_id: "",
    action: "publish" as const,
    scheduled_for: ""
  });

  const [translationForm, setTranslationForm] = useState({
    content_type: "crop",
    content_id: "",
    field_name: "",
    language_code: "es",
    original_text: "",
    translated_text: ""
  });

  const [seoForm, setSeoForm] = useState({
    content_type: "crop",
    content_id: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_title: "",
    og_description: ""
  });

  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "zh", name: "Chinese" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data - in production this would come from database
      const mockSchedules: ContentSchedule[] = [
        {
          id: "1",
          content_type: "crop",
          content_id: "tomato-id",
          content_title: "Tomato Crop Guide",
          action: "publish",
          scheduled_for: new Date(Date.now() + 86400000).toISOString(),
          status: "pending",
          created_by: "admin@example.com",
          created_at: new Date().toISOString()
        }
      ];

      const mockTranslations: Translation[] = [
        {
          id: "1",
          content_type: "crop",
          content_id: "tomato-id",
          field_name: "description",
          language_code: "es",
          original_text: "Tomato is a popular vegetable crop...",
          translated_text: "El tomate es un cultivo vegetal popular...",
          status: "completed",
          translated_by: "translator@example.com",
          updated_at: new Date().toISOString()
        }
      ];

      const mockSEO: SEOSettings[] = [
        {
          id: "1",
          content_type: "crop",
          content_id: "tomato-id",
          meta_title: "Complete Guide to Growing Tomatoes",
          meta_description: "Learn everything about tomato cultivation, varieties, and pest management",
          keywords: ["tomato", "cultivation", "farming", "vegetables"],
          canonical_url: "/crops/tomato",
          og_title: "Tomato Growing Guide",
          og_description: "Expert tips for successful tomato cultivation",
          updated_at: new Date().toISOString()
        }
      ];

      setSchedules(mockSchedules);
      setTranslations(mockTranslations);
      setSeoSettings(mockSEO);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async () => {
    if (!scheduleForm.content_id || !scheduleForm.scheduled_for) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newSchedule: ContentSchedule = {
        id: Date.now().toString(),
        ...scheduleForm,
        content_title: `${scheduleForm.content_type} Content`,
        status: "pending",
        created_by: "admin@example.com",
        created_at: new Date().toISOString()
      };

      setSchedules(prev => [newSchedule, ...prev]);
      setIsScheduleDialogOpen(false);
      setScheduleForm({
        content_type: "crop",
        content_id: "",
        action: "publish",
        scheduled_for: ""
      });

      toast({
        title: "Success",
        description: "Content scheduled successfully"
      });
    } catch (error) {
      console.error("Schedule error:", error);
      toast({
        title: "Error",
        description: "Failed to schedule content",
        variant: "destructive"
      });
    }
  };

  const saveTranslation = async () => {
    if (!translationForm.content_id || !translationForm.translated_text) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newTranslation: Translation = {
        id: Date.now().toString(),
        ...translationForm,
        status: "completed",
        translated_by: "admin@example.com",
        updated_at: new Date().toISOString()
      };

      setTranslations(prev => [newTranslation, ...prev]);
      setIsTranslationDialogOpen(false);
      setTranslationForm({
        content_type: "crop",
        content_id: "",
        field_name: "",
        language_code: "es",
        original_text: "",
        translated_text: ""
      });

      toast({
        title: "Success",
        description: "Translation saved successfully"
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Error",
        description: "Failed to save translation",
        variant: "destructive"
      });
    }
  };

  const saveSEO = async () => {
    if (!seoForm.content_id) {
      toast({
        title: "Error",
        description: "Please select content",
        variant: "destructive"
      });
      return;
    }

    try {
      const newSEO: SEOSettings = {
        id: Date.now().toString(),
        ...seoForm,
        keywords: seoForm.keywords.split(',').map(k => k.trim()).filter(k => k),
        updated_at: new Date().toISOString()
      };

      setSeoSettings(prev => [newSEO, ...prev]);
      setIsSeoDialogOpen(false);
      setSeoForm({
        content_type: "crop",
        content_id: "",
        meta_title: "",
        meta_description: "",
        keywords: "",
        og_title: "",
        og_description: ""
      });

      toast({
        title: "Success",
        description: "SEO settings saved successfully"
      });
    } catch (error) {
      console.error("SEO error:", error);
      toast({
        title: "Error",
        description: "Failed to save SEO settings",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'needs_review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading content management...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Advanced Content Management
          </CardTitle>
          <CardDescription>
            Manage content scheduling, translations, and SEO optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scheduling" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scheduling" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Content Scheduling
              </TabsTrigger>
              <TabsTrigger value="translations" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Multi-language
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                SEO Optimization
              </TabsTrigger>
            </TabsList>

            {/* Content Scheduling */}
            <TabsContent value="scheduling">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Scheduled Content</h3>
                  <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Schedule Content
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Content Action</DialogTitle>
                        <DialogDescription>
                          Schedule content to be published, updated, or unpublished
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Content Type</Label>
                          <Select value={scheduleForm.content_type} onValueChange={(value: any) => 
                            setScheduleForm(prev => ({ ...prev, content_type: value }))
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
                          <Label>Content ID</Label>
                          <Input
                            value={scheduleForm.content_id}
                            onChange={(e) => setScheduleForm(prev => ({ ...prev, content_id: e.target.value }))}
                            placeholder="Enter content ID"
                          />
                        </div>
                        <div>
                          <Label>Action</Label>
                          <Select value={scheduleForm.action} onValueChange={(value: any) => 
                            setScheduleForm(prev => ({ ...prev, action: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="publish">Publish</SelectItem>
                              <SelectItem value="unpublish">Unpublish</SelectItem>
                              <SelectItem value="update">Update</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Scheduled Date & Time</Label>
                          <Input
                            type="datetime-local"
                            value={scheduleForm.scheduled_for}
                            onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduled_for: e.target.value }))}
                          />
                        </div>
                        <Button onClick={createSchedule} className="w-full">
                          Schedule Content
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Scheduled For</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{schedule.content_title}</p>
                              <p className="text-sm text-gray-500">{schedule.content_type}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{schedule.action}</Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(schedule.scheduled_for), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(schedule.status)}>
                              {schedule.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{schedule.created_by}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Multi-language Translations */}
            <TabsContent value="translations">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Content Translations</h3>
                  <Dialog open={isTranslationDialogOpen} onOpenChange={setIsTranslationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Translation
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Translation</DialogTitle>
                        <DialogDescription>
                          Translate content to support multiple languages
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Content Type</Label>
                          <Select value={translationForm.content_type} onValueChange={(value) => 
                            setTranslationForm(prev => ({ ...prev, content_type: value }))
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
                          <Label>Content ID</Label>
                          <Input
                            value={translationForm.content_id}
                            onChange={(e) => setTranslationForm(prev => ({ ...prev, content_id: e.target.value }))}
                            placeholder="Enter content ID"
                          />
                        </div>
                        <div>
                          <Label>Field Name</Label>
                          <Input
                            value={translationForm.field_name}
                            onChange={(e) => setTranslationForm(prev => ({ ...prev, field_name: e.target.value }))}
                            placeholder="e.g., name, description"
                          />
                        </div>
                        <div>
                          <Label>Language</Label>
                          <Select value={translationForm.language_code} onValueChange={(value) => 
                            setTranslationForm(prev => ({ ...prev, language_code: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map(lang => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  {lang.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Original Text</Label>
                          <Textarea
                            value={translationForm.original_text}
                            onChange={(e) => setTranslationForm(prev => ({ ...prev, original_text: e.target.value }))}
                            placeholder="Original text in English"
                          />
                        </div>
                        <div>
                          <Label>Translated Text</Label>
                          <Textarea
                            value={translationForm.translated_text}
                            onChange={(e) => setTranslationForm(prev => ({ ...prev, translated_text: e.target.value }))}
                            placeholder="Translated text"
                          />
                        </div>
                        <Button onClick={saveTranslation} className="w-full">
                          Save Translation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {translations.map((translation) => (
                        <TableRow key={translation.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{translation.content_id}</p>
                              <p className="text-sm text-gray-500">{translation.content_type}</p>
                            </div>
                          </TableCell>
                          <TableCell>{translation.field_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {languages.find(l => l.code === translation.language_code)?.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(translation.status)}>
                              {translation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(translation.updated_at), "MMM dd, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* SEO Optimization */}
            <TabsContent value="seo">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">SEO Settings</h3>
                  <Dialog open={isSeoDialogOpen} onOpenChange={setIsSeoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Configure SEO
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>SEO Configuration</DialogTitle>
                        <DialogDescription>
                          Optimize content for search engines
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div>
                          <Label>Content Type</Label>
                          <Select value={seoForm.content_type} onValueChange={(value) => 
                            setSeoForm(prev => ({ ...prev, content_type: value }))
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
                          <Label>Content ID</Label>
                          <Input
                            value={seoForm.content_id}
                            onChange={(e) => setSeoForm(prev => ({ ...prev, content_id: e.target.value }))}
                            placeholder="Enter content ID"
                          />
                        </div>
                        <div>
                          <Label>Meta Title</Label>
                          <Input
                            value={seoForm.meta_title}
                            onChange={(e) => setSeoForm(prev => ({ ...prev, meta_title: e.target.value }))}
                            placeholder="SEO-optimized title"
                          />
                        </div>
                        <div>
                          <Label>Meta Description</Label>
                          <Textarea
                            value={seoForm.meta_description}
                            onChange={(e) => setSeoForm(prev => ({ ...prev, meta_description: e.target.value }))}
                            placeholder="Brief description for search results"
                          />
                        </div>
                        <div>
                          <Label>Keywords (comma-separated)</Label>
                          <Input
                            value={seoForm.keywords}
                            onChange={(e) => setSeoForm(prev => ({ ...prev, keywords: e.target.value }))}
                            placeholder="keyword1, keyword2, keyword3"
                          />
                        </div>
                        <div>
                          <Label>Open Graph Title</Label>
                          <Input
                            value={seoForm.og_title}
                            onChange={(e) => setSeoForm(prev => ({ ...prev, og_title: e.target.value }))}
                            placeholder="Title for social media sharing"
                          />
                        </div>
                        <div>
                          <Label>Open Graph Description</Label>
                          <Textarea
                            value={seoForm.og_description}
                            onChange={(e) => setSeoForm(prev => ({ ...prev, og_description: e.target.value }))}
                            placeholder="Description for social media sharing"
                          />
                        </div>
                        <Button onClick={saveSEO} className="w-full">
                          Save SEO Settings
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Meta Title</TableHead>
                        <TableHead>Keywords</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seoSettings.map((seo) => (
                        <TableRow key={seo.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{seo.content_id}</p>
                              <p className="text-sm text-gray-500">{seo.content_type}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-48 truncate">
                            {seo.meta_title || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {seo.keywords?.slice(0, 3).map((keyword, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                              {seo.keywords && seo.keywords.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{seo.keywords.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(seo.updated_at), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;