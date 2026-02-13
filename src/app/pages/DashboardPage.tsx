import { StatCard } from "../components/StatCard";
import { Package, CheckCircle, AlertTriangle, Clock, TrendingUp, Activity } from "lucide-react";
import { getDashboardStats, mockJobs, mockIntegrations } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { StatusChip } from "../components/StatusChip";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export function DashboardPage() {
  const stats = getDashboardStats();
  const recentJobs = mockJobs.slice(0, 5);
  const failedJobs = mockJobs.filter(j => j.status === 'Failed' || j.status === 'Partial');

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Çatı PIM sistemi genel durum özeti
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Ürün"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          trend={{ value: "+12.5%", isPositive: true }}
          description="Son 30 gün"
        />
        <StatCard
          title="Aktif Listing"
          value={stats.activeListings.toLocaleString()}
          icon={CheckCircle}
          trend={{ value: "+8.2%", isPositive: true }}
          description="Hub'larda yayında"
        />
        <StatCard
          title="Başarısız İşler"
          value={stats.failedJobs}
          icon={AlertTriangle}
          trend={{ value: "-3", isPositive: true }}
          description="Son 24 saat"
        />
        <StatCard
          title="Bekleyen Ürünler"
          value={stats.pendingProducts}
          icon={Clock}
          description="Senkronizasyon bekliyor"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Son İşler</CardTitle>
              <Link to="/jobs">
                <Button variant="ghost" size="sm">Tümünü Gör</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {job.type}
                      </Badge>
                      <StatusChip status={job.status} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {job.affectedProducts} ürün • {job.metadata && Object.values(job.metadata)[0]}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(job.startTime).toLocaleString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {job.status === 'Completed' && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {job.successCount}/{job.affectedProducts}
                      </p>
                      <p className="text-xs text-gray-500">başarılı</p>
                    </div>
                  )}
                  {(job.status === 'Failed' || job.status === 'Partial') && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        {job.failedCount} hata
                      </p>
                      <Button variant="link" size="sm" className="text-xs h-auto p-0">
                        Detay
                      </Button>
                    </div>
                  )}
                  {job.status === 'Running' && (
                    <div className="text-right">
                      <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                      <p className="text-xs text-gray-500 mt-1">Devam ediyor</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Sistem Sağlığı</CardTitle>
              <Link to="/integrations">
                <Button variant="ghost" size="sm">Detaylar</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockIntegrations.slice(0, 6).map(integration => (
                <div key={integration.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      integration.health === 'Healthy' ? 'bg-green-500' :
                      integration.health === 'Warning' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                      <p className="text-xs text-gray-500">
                        {integration.type} • {integration.syncCount.toLocaleString()} sync
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusChip status={integration.health} size="sm" />
                    {integration.errorCount > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        {integration.errorCount} hata
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failed Jobs Alert */}
      {failedJobs.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-base text-red-900">
                Dikkat! {failedJobs.length} İş Başarısız
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {failedJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.type} • {job.failedCount} ürün başarısız
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {job.errors[0]?.error}
                    </p>
                  </div>
                  <Link to={`/jobs/${job.id}`}>
                    <Button size="sm" variant="outline">Detay & Retry</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Bugün Senkronize</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">2,450</p>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+350 dünden fazla</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Aktif Kurallar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">4</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">12,450 ürünü etkiliyor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Ortalama Sync Süresi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">5.2</p>
              <span className="text-gray-600">dk</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Son 100 iş ortalaması</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
