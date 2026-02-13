import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { availablePermissions, type Role, type Permission } from "../data/mockData";

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role;
  onSave: (role: Partial<Role>) => void;
}

export function RoleDialog({ isOpen, onClose, role, onSave }: RoleDialogProps) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [permissions, setPermissions] = useState<Permission[]>(
    role?.permissions || availablePermissions.map(p => ({ ...p, granted: false }))
  );

  if (!isOpen) return null;

  const handlePermissionToggle = (key: string) => {
    setPermissions(prev =>
      prev.map(p => (p.key === key ? { ...p, granted: !p.granted } : p))
    );
  };

  const handleSave = () => {
    onSave({
      id: role?.id,
      name,
      description,
      permissions,
      userCount: role?.userCount || 0,
      createdAt: role?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const grantedCount = permissions.filter(p => p.granted).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {role ? "Rol Düzenle" : "Yeni Rol Ekle"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Rol bilgilerini ve yetkilerini tanımlayın
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Role Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol Adı <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Kategori Yöneticisi"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bu rolün sorumluluklarını açıklayın"
                rows={3}
                className="w-full"
              />
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Yetkiler
              </label>
              <span className="text-xs text-gray-500">
                {grantedCount} / {permissions.length} yetki seçildi
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg divide-y">
              {permissions.map((permission) => (
                <div
                  key={permission.key}
                  className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={permission.key}
                    checked={permission.granted}
                    onCheckedChange={() => handlePermissionToggle(permission.key)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={permission.key}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {permission.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {permission.description}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
          >
            {role ? "Güncelle" : "Rol Ekle"}
          </Button>
        </div>
      </div>
    </div>
  );
}
