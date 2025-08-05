import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  record_id: string;
  old_values: any;
  new_values: any;
  changed_by: string;
  changed_at: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableFilter, setTableFilter] = useState("all");
  const [operationFilter, setOperationFilter] = useState("all");

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, tableFilter, operationFilter]);

  const fetchAuditLogs = async () => {
    try {
      // For now, create mock data - in production this would come from audit_logs table
      const mockLogs: AuditLog[] = [
        {
          id: "1",
          table_name: "crops",
          operation: "INSERT",
          record_id: "123",
          old_values: null,
          new_values: { name: "Tomato", scientific_name: "Solanum lycopersicum" },
          changed_by: "admin@example.com",
          changed_at: new Date().toISOString()
        },
        {
          id: "2", 
          table_name: "varieties",
          operation: "UPDATE",
          record_id: "456",
          old_values: { name: "Old Variety" },
          new_values: { name: "New Variety" },
          changed_by: "admin@example.com",
          changed_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.changed_by.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tableFilter !== "all") {
      filtered = filtered.filter(log => log.table_name === tableFilter);
    }

    if (operationFilter !== "all") {
      filtered = filtered.filter(log => log.operation === operationFilter);
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    const csv = [
      "Table,Operation,Record ID,Changed By,Changed At",
      ...filteredLogs.map(log => 
        `${log.table_name},${log.operation},${log.record_id},${log.changed_by},${log.changed_at}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "INSERT": return "bg-green-100 text-green-800";
      case "UPDATE": return "bg-blue-100 text-blue-800";
      case "DELETE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Audit Logs
          </CardTitle>
          <CardDescription>
            Track all changes made to the system data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />
            
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Filter by table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                <SelectItem value="crops">Crops</SelectItem>
                <SelectItem value="varieties">Varieties</SelectItem>
                <SelectItem value="pests">Pests</SelectItem>
                <SelectItem value="diseases">Diseases</SelectItem>
              </SelectContent>
            </Select>

            <Select value={operationFilter} onValueChange={setOperationFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Filter by operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operations</SelectItem>
                <SelectItem value="INSERT">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportLogs} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Changed At</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.table_name}</TableCell>
                    <TableCell>
                      <Badge className={getOperationColor(log.operation)}>
                        {log.operation}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.record_id}</TableCell>
                    <TableCell>{log.changed_by}</TableCell>
                    <TableCell>{format(new Date(log.changed_at), "MMM dd, yyyy HH:mm")}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {log.operation === "INSERT" && (
                          <span className="text-green-600">New record created</span>
                        )}
                        {log.operation === "UPDATE" && (
                          <span className="text-blue-600">
                            {Object.keys(log.new_values || {}).length} fields updated
                          </span>
                        )}
                        {log.operation === "DELETE" && (
                          <span className="text-red-600">Record deleted</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No audit logs found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;