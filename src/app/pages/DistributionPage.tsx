import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Upload, Send, X, FileSpreadsheet, CheckCircle2, AlertCircle, Archive, ArchiveRestore } from "lucide-react";
import { mockProducts, type Hub, type Channel } from "../data/mockData";
import { toast } from "sonner";

const HUBS: Hub[] = ['Hunter-Klaud HUB', 'High5 HUB', 'Skechers HUB', 'Brooks HUB'];
const CHANNELS: Channel[] = ['WEB', 'AMZ', 'TYFT', 'N11', 'TDY', 'HB', 'AMZSF', 'MRP'];

interface UploadedProduct {
  optionCode: string;
  found: boolean;
  productName?: string;
  brand?: string;
}

export function DistributionPage() {
  const [selectedHub, setSelectedHub] = useState<Hub>('Hunter-Klaud HUB');
  const [channelSettings, setChannelSettings] = useState<Record<Channel, boolean>>({
    WEB: true,
    AMZ: true,
    TYFT: false,
    N11: false,
    TDY: false,
    HB: false,
    AMZSF: false,
    MRP: false,
  });
  const [uploadedProducts, setUploadedProducts] = useState<UploadedProduct[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const toggleChannel = (channel: Channel) => {
    setChannelSettings(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleApplyDistribution = () => {
    if (uploadedProducts.length === 0) {
      toast.error('Önce ürün yüklemelisiniz', {
        description: 'Dağıtım yapmak için Excel/CSV dosyası yükleyin.',
      });
      return;
    }

    const foundProducts = uploadedProducts.filter(p => p.found);
    if (foundProducts.length === 0) {
      toast.error('Sistemde bulunan ürün yok', {
        description: 'Yüklenen option code\'lardan hiçbiri sistemde bulunamadı.',
      });
      return;
    }

    const activeChannels = Object.entries(channelSettings)
      .filter(([_, active]) => active)
      .map(([ch]) => ch)
      .join(', ');
    
    toast.success('Dağıtım başlatıldı', {
      description: `${foundProducts.length} ürün ${selectedHub} Hub'a gönderiliyor • Kanallar: ${activeChannels}`,
    });
  };

  const getProductStatus = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    const listing = product?.listings.find(l => l.hub === selectedHub);
    return listing ? listing.state : 'Not Listed';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      const products: UploadedProduct[] = lines.map(line => {
        const optionCode = line.trim();
        const product = mockProducts.find(p => p.optionCode === optionCode);
        return {
          optionCode,
          found: !!product,
          productName: product?.name,
          brand: product?.brand,
        };
      });
      
      setUploadedProducts(products);
      const foundCount = products.filter(p => p.found).length;
      const notFoundCount = products.filter(p => !p.found).length;
      
      toast.success(`${products.length} ürün yüklendi`, {
        description: `✓ ${foundCount} bulunan • ✗ ${notFoundCount} bulunamayan`,
      });
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleFileDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearUploadedProducts = () => {
    setUploadedProducts([]);
    toast.info('Yüklenen ürünler temizlendi');
  };

  const applyToUploadedProducts = () => {
    const activeChannels = Object.entries(channelSettings)
      .filter(([_, active]) => active)
      .map(([ch]) => ch)
      .join(', ');
    
    const foundProducts = uploadedProducts.filter(p => p.found);
    
    toast.success('Dağıtım başlatıldı', {
      description: `${foundProducts.length} ürün ${selectedHub} Hub'a gönderiliyor • Kanallar: ${activeChannels}`,
    });
  };

  const handleArchiveProducts = () => {
    if (uploadedProducts.length === 0) {
      toast.error('Önce ürün yüklemelisiniz', {
        description: 'Arşivlemek için Excel/CSV dosyası yükleyin.',
      });
      return;
    }

    const foundProducts = uploadedProducts.filter(p => p.found);
    if (foundProducts.length === 0) {
      toast.error('Sistemde bulunan ürün yok', {
        description: 'Yüklenen option code\'lardan hiçbiri sistemde bulunamadı.',
      });
      return;
    }

    toast.success(`${foundProducts.length} ürün arşivleniyor`, {
      description: 'Ürünler artık Arşivlenen Ürünler sayfasında görünecek.',
    });
  };

  const handleUnarchiveProducts = () => {
    if (uploadedProducts.length === 0) {
      toast.error('Önce ürün yüklemelisiniz', {
        description: 'Arşivden çıkarmak için Excel/CSV dosyası yükleyin.',
      });
      return;
    }

    const foundProducts = uploadedProducts.filter(p => p.found);
    if (foundProducts.length === 0) {
      toast.error('Sistemde bulunan ürün yok', {
        description: 'Yüklenen option code\'lardan hiçbiri sistemde bulunamadı.',
      });
      return;
    }

    toast.success(`${foundProducts.length} ürün arşivden çıkarılıyor`, {
      description: 'Ürünler artık ana ürünler listesinde görünecek.',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Toplu Ürün Dağıtımı</h1>
        <p className="text-sm text-gray-500 mt-1">Hub ve kanal bazlı toplu ürün dağıtımı</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dağıtım Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hub Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Hedef Hub Seçin
                </label>
                <div className="space-y-2">
                  {HUBS.map(hub => (
                    <button
                      key={hub}
                      onClick={() => setSelectedHub(hub)}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                        selectedHub === hub
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{hub}</span>
                        {selectedHub === hub && (
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Settings */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Kanal Durumları
                </label>
                <div className="space-y-3">
                  {CHANNELS.map(channel => (
                    <div key={channel} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{channel}</Badge>
                      </div>
                      <Switch
                        checked={channelSettings[channel]}
                        onCheckedChange={() => toggleChannel(channel)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleApplyDistribution}
              >
                <Send className="h-4 w-4" />
                Ayarları Uygula
              </Button>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  Bu ayarlar seçili ürünlere uygulanacak. 
                  Mevcut dağıtımları değiştirir ve yeni job oluşturur.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          
        </div>

        {/* Upload Area & Product List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ürün Yükleme ve Dağıtım</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedProducts.length === 0 ? (
                // Upload Area
                <div
                  onDrop={handleFileDrop}
                  onDragOver={handleFileDragOver}
                  onDragEnter={handleFileDragEnter}
                  onDragLeave={handleFileDragLeave}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileSpreadsheet className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        Excel/CSV Dosyası Yükleyin
                      </p>
                      <p className="text-sm text-gray-500">
                        Dosyayı buraya sürükleyin veya seçmek için tıklayın
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>• Tek sütunda Option Code'lar olmalı</p>
                      <p>• Excel (.xlsx, .xls) veya CSV (.csv, .txt) formatında</p>
                      <p>• Her satırda bir Option Code</p>
                    </div>
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="gap-2" asChild>
                        <span>
                          <Upload className="h-4 w-4" />
                          Dosya Seç
                        </span>
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                // Uploaded Products List
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedProducts.length} ürün yüklendi
                        </p>
                        <p className="text-xs text-gray-500">
                          {uploadedProducts.filter(p => p.found).length} bulunan •{' '}
                          {uploadedProducts.filter(p => !p.found).length} bulunamayan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={clearUploadedProducts}
                      >
                        <X className="h-4 w-4" />
                        Temizle
                      </Button>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={applyToUploadedProducts}
                        disabled={uploadedProducts.filter(p => p.found).length === 0}
                      >
                        <Send className="h-4 w-4" />
                        Dağıtımı Başlat ({uploadedProducts.filter(p => p.found).length})
                      </Button>
                    </div>
                  </div>

                  {/* Archive Actions */}
                  <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">Arşivleme İşlemleri</p>
                      <p className="text-xs text-orange-700">Yüklenen ürünleri arşivleyebilir veya arşivden çıkarabilirsiniz</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-orange-300 hover:bg-orange-100"
                      onClick={handleArchiveProducts}
                      disabled={uploadedProducts.filter(p => p.found).length === 0}
                    >
                      <Archive className="h-4 w-4" />
                      Arşivle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-orange-300 hover:bg-orange-100"
                      onClick={handleUnarchiveProducts}
                      disabled={uploadedProducts.filter(p => p.found).length === 0}
                    >
                      <ArchiveRestore className="h-4 w-4" />
                      Arşivden Çıkar
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                          <tr>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                              Durum
                            </th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                              Option Code
                            </th>
                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                              Ürün Bilgisi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {uploadedProducts.map((product, index) => (
                            <tr
                              key={index}
                              className={product.found ? 'bg-white' : 'bg-red-50'}
                            >
                              <td className="py-2 px-4">
                                {product.found ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                )}
                              </td>
                              <td className="py-2 px-4">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {product.optionCode}
                                </code>
                              </td>
                              <td className="py-2 px-4">
                                {product.found ? (
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {product.productName}
                                    </p>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {product.brand}
                                    </Badge>
                                  </div>
                                ) : (
                                  <p className="text-xs text-red-600">
                                    Sistemde bulunamadı
                                  </p>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}