import { mockIntegrations } from "../data/mockData";
import { Button } from "../components/ui/button";
import { StatusChip } from "../components/StatusChip";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Plug, RotateCcw, Settings, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function IntegrationsPage() {
  const erpIntegrations = mockIntegrations.filter(i => i.type === 'ERP');
  const hubIntegrations = mockIntegrations.filter(i => i.type === 'HUB');

  const handleSync = (name: string) => {
    toast.success(`${name} senkronizasyonu başlatıldı`);
  };

  const handleConfigure = (name: string) => {
    toast.info(`${name} yapılandırma sayfası açılıyor...`);
  };

  const IntegrationCard = ({ integration }: { integration: typeof mockIntegrations[0] }) => {
    const isHealthy = integration.health === 'Healthy';
    const hasErrors = integration.errorCount > 0;

    return (
      <Card className={!isHealthy ? 'border-amber-200' : ''}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                isHealthy ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                <Plug className={`h-6 w-6 ${
                  isHealthy ? 'text-green-600' : 'text-amber-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {integration.type}
                </Badge>
              </div>
            </div>
            <StatusChip status={integration.health} size="md" />
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Son Senkronizasyon</span>
              <span className="font-medium text-gray-900">
                {new Date(integration.lastSync).toLocaleString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Toplam Sync</span>
              <span className="font-medium text-gray-900">
                {integration.syncCount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Auth Durumu</span>
              <StatusChip status={integration.authStatus} size="sm" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Endpoint</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[200px] truncate">
                {integration.endpoint}
              </code>
            </div>

            {hasErrors && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hatalar</span>
                <span className="text-red-600 font-medium">
                  {integration.errorCount} hata
                </span>
              </div>
            )}
          </div>

          {hasErrors && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">Dikkat Gerekli</p>
                <p className="text-xs text-amber-700 mt-1">
                  Son 24 saatte {integration.errorCount} hata kaydedildi. 
                  Lütfen log dosyalarını kontrol edin.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 flex-1"
              onClick={() => handleSync(integration.name)}
            >
              <RotateCcw className="h-4 w-4" />
              Manuel Sync
            </Button>
            
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Entegrasyon & Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">ERP ve Hub bağlantılarının sağlık durumu ve görev tetiklemeleri</p>
      </div>

      {/* Overview Stats */}
      

      {/* ERP Integrations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ERP Entegrasyonları ({erpIntegrations.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {erpIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>

      {/* HUB Integrations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hub Entegrasyonları ({hubIntegrations.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}
