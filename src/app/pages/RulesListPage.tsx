import { useState } from "react";
import { mockRules } from "../data/mockData";
import { Button } from "../components/ui/button";
import { StatusChip } from "../components/StatusChip";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Plus, Play, Edit, Trash2, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export function RulesListPage() {
  const [rules, setRules] = useState(mockRules);

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'inactive' as const : 'active' as const }
        : rule
    ));
    toast.success('Kural durumu güncellendi');
  };

  const handleDryRun = (rule: typeof mockRules[0]) => {
    toast.info('Kural simülasyonu', {
      description: `Bu kural ${rule.affectedCount.toLocaleString()} ürünü etkileyecek. İşlem queue\'ya eklendi.`,
    });
  };

  const handleDelete = (ruleName: string) => {
    toast.success(`"${ruleName}" kuralı silindi`);
  };

  const getConditionSummary = (rule: typeof mockRules[0]) => {
    return rule.conditions.map(c => {
      if (c.type === 'brand') return `Marka = ${c.value}`;
      if (c.type === 'attribute') return `Özellik = ${c.value}`;
      if (c.type === 'price') return `Fiyat > $${c.value}`;
      return `${c.type} ${c.operator} ${c.value}`;
    }).join(' VE ');
  };

  const getActionSummary = (rule: typeof mockRules[0]) => {
    return rule.actions.map(a => {
      if (a.type === 'send_to_hub') return `${a.params.hub} Hub'a gönder`;
      if (a.type === 'set_channels') {
        const channels = Object.entries(a.params)
          .filter(([_, active]) => active === true || active === false)
          .map(([ch, active]) => `${ch}:${active ? 'Aç' : 'Kapat'}`)
          .join(', ');
        return `Kanallar: ${channels}`;
      }
      return a.type;
    }).join(' + ');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kural Motoru</h1>
          <p className="text-sm text-gray-500 mt-1">
            Otomatik ürün dağıtım ve kanal yönetimi kuralları
          </p>
        </div>
        <Link to="/rules/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni Kural Oluştur
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Toplam Kural</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{rules.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {rules.filter(r => r.status === 'active').length} aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Etkilenen Ürün</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {rules.reduce((sum, r) => sum + (r.status === 'active' ? r.affectedCount : 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Aktif kuralların toplamı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">En Yüksek Öncelik</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.min(...rules.map(r => r.priority))}
            </p>
            <p className="text-xs text-gray-500 mt-1">Düşük sayı = yüksek öncelik</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">Kural Önceliklendirme</p>
          <p className="text-sm text-blue-700 mt-1">
            Kurallar öncelik sırasına göre çalışır. Aynı ürüne birden fazla kural uygulanıyorsa,
            en yüksek öncelikli (en düşük sayı) kural geçerli olur. Çakışmaları önlemek için
            kurallarınızı dikkatlice tasarlayın.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules
          .sort((a, b) => a.priority - b.priority)
          .map(rule => (
          <Card key={rule.id} className={rule.status === 'inactive' ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Priority Badge */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{rule.priority}</span>
                  </div>
                </div>

                {/* Rule Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    <StatusChip status={rule.status} size="md" />
                    <Badge variant="secondary" className="ml-auto">
                      {rule.affectedCount.toLocaleString()} ürün
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        IF
                      </Badge>
                      <p className="text-sm text-gray-700 flex-1">
                        {getConditionSummary(rule)}
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        THEN
                      </Badge>
                      <p className="text-sm text-gray-700 flex-1">
                        {getActionSummary(rule)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <span>Oluşturan: {rule.createdBy}</span>
                    <span>•</span>
                    <span>
                      {new Date(rule.createdAt).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={rule.status === 'active'}
                    onCheckedChange={() => toggleRuleStatus(rule.id)}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDryRun(rule)}
                  >
                    <Play className="h-4 w-4" />
                    Dry Run
                  </Button>

                  <Link to={`/rules/${rule.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Kuralı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{rule.name}" kuralını silmek istediğinize emin misiniz? 
                          Bu işlem geri alınamaz ve {rule.affectedCount.toLocaleString()} ürünü etkileyebilir.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(rule.name)}
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {rules.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Henüz kural oluşturulmamış</p>
              <Link to="/rules/new">
                <Button>İlk Kuralı Oluştur</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
