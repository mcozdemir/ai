import { mockUsers, mockRoles, availablePermissions } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Plus, Edit, Trash2, Users, Shield } from "lucide-react";
import { useState } from "react";
import { RoleDialog } from "../components/RoleDialog";
import type { Role } from "../data/mockData";

export function SettingsPage() {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleAddRole = () => {
    setEditingRole(undefined);
    setIsRoleDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsRoleDialogOpen(false);
    setEditingRole(undefined);
  };

  const handleSaveRole = (role: Partial<Role>) => {
    // Handle role save logic here
    console.log("Saving role:", role);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kullanıcılar, roller ve sistem yapılandırması
          </p>
        </div>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Kullanıcı Yönetimi</CardTitle>
            <Button className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Yeni Kullanıcı
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      user.role === 'Admin' ? 'default' :
                      user.role === 'Ops' ? 'secondary' :
                      'outline'
                    }
                  >
                    {user.role}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Rol Yönetimi</CardTitle>
            <Button className="gap-2" size="sm" onClick={handleAddRole}>
              <Plus className="h-4 w-4" />
              Yeni Rol
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRoles.map(role => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{role.name}</p>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{role.userCount} kullanıcı</span>
                  </div>
                  <Badge variant="outline">
                    {role.permissions.filter(p => p.granted).length} yetki
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRole(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rol İzinleri Matrisi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700">Özellik</th>
                  {mockRoles.map(role => (
                    <th key={role.id} className="py-3 px-4 text-center text-xs font-medium text-gray-700">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {availablePermissions.map(permission => (
                  <tr key={permission.key}>
                    <td className="py-3 px-4 text-sm text-gray-900">{permission.label}</td>
                    {mockRoles.map(role => {
                      const rolePermission = role.permissions.find(p => p.key === permission.key);
                      return (
                        <td key={role.id} className="py-3 px-4 text-center">
                          {rolePermission?.granted ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-300">✗</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sistem Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Varsayılan Sync Interval</label>
              <p className="text-sm text-gray-900 mt-1">Her 15 dakika</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Job Timeout</label>
              <p className="text-sm text-gray-900 mt-1">30 dakika</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Retry Policy</label>
              <p className="text-sm text-gray-900 mt-1">3 deneme, exponential backoff</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Log Retention</label>
              <p className="text-sm text-gray-900 mt-1">90 gün</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Ayarları Düzenle</Button>
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <RoleDialog
        isOpen={isRoleDialogOpen}
        onClose={handleCloseDialog}
        role={editingRole}
        onSave={handleSaveRole}
      />
    </div>
  );
}