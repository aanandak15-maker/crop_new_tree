import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Download, Upload, Plus, Search, Filter, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BackupRecord {
  id: string;
  table_name: string;
  backup_type: 'manual' | 'scheduled' | 'pre_update';
  file_size: number;
  created_at: string;
  created_by: string;
  description?: string;
  status: 'completed' | 'in_progress' | 'failed';
}

interface DataVersion {
  id: string;
  table_name: string;
  record_id: string;
  version_number: number;
  data_snapshot: any;
  created_at: string;
  created_by: string;
  change_description: string;
}

const DataBackupVersioning = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [versions, setVersions] = useState<DataVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateBackupOpen, setIsCreateBackupOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [backupDescription, setBackupDescription] = useState("");
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableFilter, setTableFilter] = useState("all");
  const { toast } = useToast();

  const tables = ["crops", "varieties", "pests", "diseases", "crop_pests", "crop_diseases"];

  useEffect(() => {
    fetchBackups();
    fetchVersions();
  }, []);

  const fetchBackups = async () => {
    try {
      // Mock backup data - in production this would come from backup_logs table
      const mockBackups: BackupRecord[] = [
        {
          id: "1",
          table_name: "crops",
          backup_type: "manual",
          file_size: 2048576,
          created_at: new Date().toISOString(),
          created_by: "admin@example.com",
          description: "Pre-migration backup",
          status: "completed"
        },
        {
          id: "2",
          table_name: "varieties",
          backup_type: "scheduled",
          file_size: 1024000,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          created_by: "system",
          description: "Daily automated backup",
          status: "completed"
        }
      ];
      setBackups(mockBackups);
    } catch (error) {
      console.error("Error fetching backups:", error);
    }
  };

  const fetchVersions = async () => {
    try {
      // Mock version data - in production this would come from data_versions table
      const mockVersions: DataVersion[] = [
        {
          id: "1",
          table_name: "crops",
          record_id: "tomato-id",
          version_number: 3,
          data_snapshot: { name: "Tomato", scientific_name: "Solanum lycopersicum" },
          created_at: new Date().toISOString(),
          created_by: "admin@example.com",
          change_description: "Updated scientific name"
        },
        {
          id: "2",
          table_name: "crops",
          record_id: "tomato-id",
          version_number: 2,
          data_snapshot: { name: "Tomato", scientific_name: "Lycopersicon esculentum" },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          created_by: "admin@example.com",
          change_description: "Initial scientific name"
        }
      ];
      setVersions(mockVersions);
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    if (!selectedTable) {
      toast({
        title: "Error",
        description: "Please select a table to backup",
        variant: "destructive"
      });
      return;
    }

    setIsBackingUp(true);
    try {
      // In production, this would trigger a real backup process
      let data, error;
      if (selectedTable === 'crops') {
        const result = await supabase.from('crops').select("*");
        data = result.data;
        error = result.error;
      } else if (selectedTable === 'varieties') {
        const result = await supabase.from('varieties').select("*");
        data = result.data;
        error = result.error;
      } else if (selectedTable === 'pests') {
        const result = await supabase.from('pests').select("*");
        data = result.data;
        error = result.error;
      } else if (selectedTable === 'diseases') {
        const result = await supabase.from('diseases').select("*");
        data = result.data;
        error = result.error;
      } else {
        throw new Error(`Unsupported table: ${selectedTable}`);
      }

      if (error) throw error;

      // Simulate backup creation
      const backup: BackupRecord = {
        id: Date.now().toString(),
        table_name: selectedTable,
        backup_type: "manual",
        file_size: JSON.stringify(data).length,
        created_at: new Date().toISOString(),
        created_by: "admin@example.com",
        description: backupDescription,
        status: "completed"
      };

      setBackups(prev => [backup, ...prev]);

      toast({
        title: "Success",
        description: `Backup created for ${selectedTable} table`
      });

      setIsCreateBackupOpen(false);
      setSelectedTable("");
      setBackupDescription("");
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const downloadBackup = async (backup: BackupRecord) => {
    try {
      let data, error;
      if (backup.table_name === 'crops') {
        const result = await supabase.from('crops').select("*");
        data = result.data;
        error = result.error;
      } else if (backup.table_name === 'varieties') {
        const result = await supabase.from('varieties').select("*");
        data = result.data;
        error = result.error;
      } else if (backup.table_name === 'pests') {
        const result = await supabase.from('pests').select("*");
        data = result.data;
        error = result.error;
      } else if (backup.table_name === 'diseases') {
        const result = await supabase.from('diseases').select("*");
        data = result.data;
        error = result.error;
      } else {
        throw new Error(`Unsupported table: ${backup.table_name}`);
      }

      if (error) throw error;

      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${backup.table_name}_backup_${format(new Date(backup.created_at), "yyyy-MM-dd_HH-mm")}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Backup downloaded successfully"
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download backup",
        variant: "destructive"
      });
    }
  };

  const restoreVersion = async (version: DataVersion) => {
    try {
      // In production, this would restore the specific version
      console.log("Restoring version:", version);
      
      toast({
        title: "Success",
        description: `Version ${version.version_number} restored for record ${version.record_id}`
      });
    } catch (error) {
      console.error("Restore error:", error);
      toast({
        title: "Error",
        description: "Failed to restore version",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTable = tableFilter === "all" || backup.table_name === tableFilter;
    return matchesSearch && matchesTable;
  });

  if (loading) {
    return <div>Loading backup and versioning data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Backup Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Data Backup Management
              </CardTitle>
              <CardDescription>
                Create, manage, and restore data backups
              </CardDescription>
            </div>
            <Dialog open={isCreateBackupOpen} onOpenChange={setIsCreateBackupOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Backup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Backup</DialogTitle>
                  <DialogDescription>
                    Create a manual backup of your data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="table">Table to Backup</Label>
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map(table => (
                          <SelectItem key={table} value={table}>
                            {table}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={backupDescription}
                      onChange={(e) => setBackupDescription(e.target.value)}
                      placeholder="Optional description for this backup"
                    />
                  </div>
                  <Button 
                    onClick={createBackup} 
                    disabled={isBackingUp || !selectedTable}
                    className="w-full"
                  >
                    {isBackingUp ? "Creating Backup..." : "Create Backup"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 md:w-1/2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search backups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Filter by table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {tables.map(table => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBackups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.table_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{backup.backup_type}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(backup.file_size)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{backup.created_by}</TableCell>
                    <TableCell>{format(new Date(backup.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                    <TableCell className="max-w-48 truncate">
                      {backup.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBackup(backup)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Data Version History
          </CardTitle>
          <CardDescription>
            Track and restore previous versions of your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Changed At</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">{version.table_name}</TableCell>
                    <TableCell className="font-mono text-sm">{version.record_id}</TableCell>
                    <TableCell>
                      <Badge>v{version.version_number}</Badge>
                    </TableCell>
                    <TableCell>{version.created_by}</TableCell>
                    <TableCell>{format(new Date(version.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                    <TableCell className="max-w-48 truncate">{version.change_description}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restoreVersion(version)}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataBackupVersioning;