import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, UserCheck, UserX, Mail, Building, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  organization: string;
  role: 'user' | 'moderator' | 'admin';
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      setProcessingUser(userId);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_approved: true } : user
      ));

      toast({
        title: "User Approved",
        description: "User can now access the system",
      });

      // TODO: Send approval email to user
      
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      setProcessingUser(userId);
      
      // Delete the user profile
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "User Rejected",
        description: "User registration has been rejected",
      });

      // TODO: Send rejection email to user
      
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive",
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setProcessingUser(userId);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ));

      toast({
        title: "Role Updated",
        description: `User role changed to ${newRole}`,
      });
      
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && user.is_approved) ||
                         (statusFilter === 'pending' && !user.is_approved);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingUsers = users.filter(user => !user.is_approved);
  const approvedUsers = users.filter(user => user.is_approved);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (isApproved: boolean) => {
    return isApproved 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage user accounts, approve registrations, and assign roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{users.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">Pending Approval</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{pendingUsers.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Approved Users</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{approvedUsers.length}</p>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingUsers.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedUsers.length})</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Users</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, email, or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="role-filter">Filter by Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="status-filter">Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.organization}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(user.is_approved)}>
                            {user.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!user.is_approved ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveUser(user.id)}
                                  disabled={processingUser === user.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {processingUser === user.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectUser(user.id)}
                                  disabled={processingUser === user.id}
                                >
                                  {processingUser === user.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              </>
                            ) : (
                              <Select
                                value={user.role}
                                onValueChange={(value) => handleUpdateRole(user.id, value)}
                                disabled={processingUser === user.id}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingUsers.length === 0 ? (
                <Alert>
                  <AlertDescription>No pending user registrations.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{user.full_name}</h4>
                              <Badge variant="secondary">{user.role}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {user.organization}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Registered: {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveUser(user.id)}
                              disabled={processingUser === user.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRejectUser(user.id)}
                              disabled={processingUser === user.id}
                            >
                              {processingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.organization}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.updated_at 
                            ? new Date(user.updated_at).toLocaleDateString()
                            : new Date(user.created_at).toLocaleDateString()
                          }
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleUpdateRole(user.id, value)}
                            disabled={processingUser === user.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="management" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Operations</CardTitle>
                  <CardDescription>Perform actions on multiple users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => {
                        // TODO: Implement bulk approve
                        toast({
                          title: "Coming Soon",
                          description: "Bulk operations will be available soon",
                        });
                      }}
                    >
                      <UserCheck className="h-6 w-6" />
                      Bulk Approve Users
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => {
                        // TODO: Implement bulk role update
                        toast({
                          title: "Coming Soon",
                          description: "Bulk operations will be available soon",
                        });
                      }}
                    >
                      <Shield className="h-6 w-6" />
                      Bulk Role Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
