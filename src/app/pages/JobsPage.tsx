import { useState } from "react";
import { mockJobs, type JobStatus } from "../data/mockData";
import { Button } from "../components/ui/button";
import { StatusChip } from "../components/StatusChip";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { RotateCcw, Download, Eye, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

export function JobsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredJobs = mockJobs.filter(job => {
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    const matchesType = filterType === "all" || job.type === filterType;
    return matchesStatus && matchesType;
  });

  const handleRetry = (jobId: string) => {
    toast.success('Retry başlatıldı', {
      description: 'İş yeniden çalıştırılıyor...',
    });
  };

  const getSuccessRate = (job: typeof mockJobs[0]) => {
    if (job.affectedProducts === 0) return 0;
    return (job.successCount / job.affectedProducts) * 100;
  };

  const getDuration = (job: typeof mockJobs[0]) => {
    if (!job.endTime) return 'Devam ediyor';
    const start = new Date(job.startTime).getTime();
    const end = new Date(job.endTime).getTime();
    const diff = Math.floor((end - start) / 1000);
    
    if (diff < 60) return `${diff}s`;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İşler & Loglar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tüm senkronizasyon ve bulk işlem geçmişi
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Durum Filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="Running">Çalışıyor</SelectItem>
            <SelectItem value="Completed">Tamamlandı</SelectItem>
            <SelectItem value="Failed">Başarısız</SelectItem>
            <SelectItem value="Partial">Kısmi Başarılı</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tip Filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Tipler</SelectItem>
            <SelectItem value="sync">Sync</SelectItem>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="bulk_update">Bulk Update</SelectItem>
            <SelectItem value="deactivate">Deactivate</SelectItem>
            <SelectItem value="rule_apply">Rule Apply</SelectItem>
          </SelectContent>
        </Select>

        <p className="text-sm text-gray-600 ml-auto">
          <span className="font-medium">{filteredJobs.length}</span> iş gösteriliyor
        </p>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map(job => {
          const successRate = getSuccessRate(job);
          
          return (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-xs uppercase">
                        {job.type}
                      </Badge>
                      <StatusChip status={job.status} size="md" />
                      {job.metadata && (
                        <span className="text-sm text-gray-600">
                          {Object.values(job.metadata)[0]}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Başlangıç</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {new Date(job.startTime).toLocaleString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Süre</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {getDuration(job)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Toplam Ürün</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {job.affectedProducts.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tetikleyen</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {job.triggeredBy}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {job.status !== 'Failed' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Başarı Oranı</span>
                          <span className="font-medium text-gray-900">
                            {successRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={successRate} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="text-green-600">
                            ✓ {job.successCount.toLocaleString()} başarılı
                          </span>
                          {job.failedCount > 0 && (
                            <span className="text-red-600">
                              ✗ {job.failedCount.toLocaleString()} hatalı
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {job.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 mb-2">
                              {job.errors.length} Hata Oluştu
                            </p>
                            <div className="space-y-1">
                              {job.errors.slice(0, 2).map((error, idx) => (
                                <p key={idx} className="text-xs text-red-700">
                                  <code className="bg-red-100 px-1 py-0.5 rounded">
                                    {error.optionCode}
                                  </code>
                                  : {error.error}
                                </p>
                              ))}
                              {job.errors.length > 2 && (
                                <p className="text-xs text-red-600">
                                  +{job.errors.length - 2} daha fazla hata
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 w-full">
                        <Eye className="h-4 w-4" />
                        Detay
                      </Button>
                    </Link>
                    
                    {(job.status === 'Failed' || job.status === 'Partial') && 
                     job.errors.some(e => e.retryable) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleRetry(job.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <p>Seçilen filtrelere uygun iş bulunamadı</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
