import { useParams, Link } from "react-router";
import { mockProducts } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DistributionMatrix } from "../components/DistributionMatrix";
import { AuditTimeline } from "../components/AuditTimeline";
import { StatusChip } from "../components/StatusChip";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Send, Edit, Archive, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Ürün bulunamadı</p>
          <Link to="/products">
            <Button className="mt-4">Ürünlere Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  const auditEntries = [
    {
      timestamp: product.updatedAt,
      user: product.updatedBy,
      action: 'Ürün güncellendi',
      details: 'Skechers HUB\'a gönderildi, WEB ve AMZ kanalları aktif edildi',
    },
    {
      timestamp: '2026-02-10T14:30:00Z',
      user: 'admin@pim.com',
      action: 'Kanal ayarları değiştirildi',
      details: 'TYFT kanalı pasifleştirildi',
    },
    {
      timestamp: '2026-02-08T09:00:00Z',
      user: 'sync-job',
      action: 'Ürün senkronize edildi',
      details: 'Jupiter ERP\'den güncelleme alındı',
    },
  ];

  const handleChannelToggle = () => {
    toast.success('Kanal durumu güncellendi');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/products">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              {product.listings.some(l => l.state === 'Active') && (
                <StatusChip status="Active" size="md" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {product.optionCode}
              </code>
              <span>•</span>
              <Badge variant="outline">{product.sourceERP}</Badge>
              <span>•</span>
              <span>Son güncelleme: {new Date(product.updatedAt).toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Düzenle
          </Button>
          <Button variant="outline" className="gap-2">
            <Send className="h-4 w-4" />
            Hub'a Gönder
          </Button>
          <Button variant="outline" className="gap-2">
            <Archive className="h-4 w-4" />
            Pasifleştir
          </Button>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Senkronize Et
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Data */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ürün Master Verisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Marka</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{product.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fiyat</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stok</p>
                  <p className={`text-sm font-medium mt-1 ${
                    product.stock < 100 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {product.stock} adet
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Özellikler</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DistributionMatrix
            listings={product.listings}
            onToggleChannel={handleChannelToggle}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hızlı Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Ürün ID</p>
                <p className="text-sm font-mono text-gray-900 mt-1">{product.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kaynak ERP</p>
                <Badge variant="outline" className="mt-1">{product.sourceERP}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hub Sayısı</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {product.listings.length} hub
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Kanal</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {product.listings.reduce((sum, l) => 
                    sum + l.channels.filter(ch => ch.active).length, 0
                  )} kanal
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Son Güncelleyen</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{product.updatedBy}</p>
              </div>
            </CardContent>
          </Card>

          <AuditTimeline entries={auditEntries} />
        </div>
      </div>
    </div>
  );
}