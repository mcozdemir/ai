import { useState } from "react";
import { mockProducts, type Product, type Hub, type Channel, type Season, type ProductGroup, type Brand } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatusChip } from "../components/StatusChip";
import { BulkActionBar } from "../components/BulkActionBar";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Search, Filter, Download, X } from "lucide-react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function ProductsListPage() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterERP, setFilterERP] = useState<Set<string>>(new Set());
  const [filterBrand, setFilterBrand] = useState<Set<string>>(new Set());
  const [filterHub, setFilterHub] = useState<Set<string>>(new Set());
  const [filterSeason, setFilterSeason] = useState<Set<string>>(new Set());
  const [filterProductGroup, setFilterProductGroup] = useState<Set<string>>(new Set());
  const [filterChannels, setFilterChannels] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [showHubDialog, setShowHubDialog] = useState(false);
  const [showChannelDialog, setShowChannelDialog] = useState(false);
  const [selectedHubForSend, setSelectedHubForSend] = useState<string>("");
  const [selectedChannelsForSet, setSelectedChannelsForSet] = useState<Set<string>>(new Set());

  // Filter out archived products (only show non-archived)
  const activeProducts = mockProducts.filter(product => !product.archived);

  const filteredProducts = activeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.optionCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesERP = filterERP.size === 0 || filterERP.has(product.sourceERP);
    const matchesBrand = filterBrand.size === 0 || filterBrand.has(product.brand);
    const matchesHub = filterHub.size === 0 || product.listings.some(l => filterHub.has(l.hub));
    const matchesSeason = filterSeason.size === 0 || filterSeason.has(product.season);
    const matchesProductGroup = filterProductGroup.size === 0 || filterProductGroup.has(product.productGroup);
    
    const matchesChannels = filterChannels.size === 0 || Array.from(filterChannels).every(channel => {
      return product.listings.some(listing => 
        listing.channels.some(ch => ch.channel === channel && ch.active)
      );
    });
    
    return matchesSearch && matchesERP && matchesBrand && matchesHub && matchesSeason && matchesProductGroup && matchesChannels;
  });

  const toggleFilter = (set: Set<string>, value: string, setter: (set: Set<string>) => void) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setter(newSet);
  };

  const toggleProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const toggleAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const clearSelection = () => setSelectedProducts(new Set());

  const handleBulkAction = (action: string) => {
    toast.success(`${action} işlemi başlatıldı`, {
      description: `${selectedProducts.size} ürün için işlem queue'ya eklendi.`,
    });
    clearSelection();
  };

  const handleArchive = () => {
    toast.success('Ürünler arşivleniyor', {
      description: `${selectedProducts.size} ürün arşivlendi. Arşivlenen Ürünler sayfasında görünecek.`,
    });
    clearSelection();
  };

  const handleSendToHub = () => {
    setShowHubDialog(true);
  };

  const handleSetChannels = () => {
    setShowChannelDialog(true);
  };

  const handleHubSubmit = () => {
    if (!selectedHubForSend) {
      toast.error('Hub seçilmedi', {
        description: 'Lütfen bir hub seçin.',
      });
      return;
    }
    
    toast.success(`Ürünler ${selectedHubForSend}'a gönderiliyor`, {
      description: `${selectedProducts.size} ürün için işlem queue'ya eklendi.`,
    });
    setShowHubDialog(false);
    setSelectedHubForSend("");
    clearSelection();
  };

  const handleChannelSubmit = () => {
    if (selectedChannelsForSet.size === 0) {
      toast.error('Kanal seçilmedi', {
        description: 'Lütfen en az bir kanal seçin.',
      });
      return;
    }
    
    toast.success('Kanallar ayarlanıyor', {
      description: `${selectedProducts.size} ürün için ${selectedChannelsForSet.size} kanal aktifleştiriliyor.`,
    });
    setShowChannelDialog(false);
    setSelectedChannelsForSet(new Set());
    clearSelection();
  };

  const toggleChannelForSet = (channel: string) => {
    const newSet = new Set(selectedChannelsForSet);
    if (newSet.has(channel)) {
      newSet.delete(channel);
    } else {
      newSet.add(channel);
    }
    setSelectedChannelsForSet(newSet);
  };

  const getHubChips = (product: Product) => {
    return product.listings.map(listing => (
      <div key={listing.hub} className="flex items-center gap-1">
        <Badge variant="outline" className="text-xs">
          {listing.hub}
        </Badge>
        <StatusChip status={listing.state} size="sm" />
      </div>
    ));
  };

  const getActiveChannels = (product: Product) => {
    const allChannels = new Set<string>();
    product.listings.forEach(listing => {
      listing.channels.filter(ch => ch.active).forEach(ch => {
        allChannels.add(ch.channel);
      });
    });
    return Array.from(allChannels);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Kataloğu</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tüm ERP'lerden toplanan master ürün listesi
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Ürün adı veya Option Code ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* ERP Multi-Select Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[180px] justify-between">
              {filterERP.size === 0 ? 'Tüm ERP\'ler' : `${filterERP.size} ERP seçili`}
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">ERP Seç</Label>
              {(['Jupiter ERP', 'Olka ERP', 'Satürn ERP', 'Neptün ERP', 'Marlin ERP']).map(erp => (
                <div key={erp} className="flex items-center gap-2">
                  <Checkbox
                    id={`erp-${erp}`}
                    checked={filterERP.has(erp)}
                    onCheckedChange={() => toggleFilter(filterERP, erp, setFilterERP)}
                  />
                  <label htmlFor={`erp-${erp}`} className="text-sm cursor-pointer flex-1">
                    {erp}
                  </label>
                </div>
              ))}
              {filterERP.size > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setFilterERP(new Set())}
                >
                  Temizle
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Brand Multi-Select Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[180px] justify-between">
              {filterBrand.size === 0 ? 'Tüm Markalar' : `${filterBrand.size} marka seçili`}
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <Label className="text-sm font-medium">Marka Seç</Label>
              {(['Skechers', 'Hunter', 'Brooks', 'Asics', 'On', 'Clarks', 'Timberland', 'Ecco', 'Camper', 'Birkenstock', 'Crocs', 'Steve Madden', 'EMU', 'Hoka', 'Salomon', 'Saucony', 'High5'] as Brand[]).map(brand => (
                <div key={brand} className="flex items-center gap-2">
                  <Checkbox
                    id={`quick-brand-${brand}`}
                    checked={filterBrand.has(brand)}
                    onCheckedChange={() => toggleFilter(filterBrand, brand, setFilterBrand)}
                  />
                  <label htmlFor={`quick-brand-${brand}`} className="text-sm cursor-pointer flex-1">
                    {brand}
                  </label>
                </div>
              ))}
              {filterBrand.size > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setFilterBrand(new Set())}
                >
                  Temizle
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Hub Multi-Select Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[180px] justify-between">
              {filterHub.size === 0 ? 'Tüm Hub\'lar' : `${filterHub.size} hub seçili`}
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hub Seç</Label>
              {(['Hunter-Klaud HUB', 'High5 HUB', 'Skechers HUB', 'Brooks HUB'] as Hub[]).map(hub => (
                <div key={hub} className="flex items-center gap-2">
                  <Checkbox
                    id={`hub-${hub}`}
                    checked={filterHub.has(hub)}
                    onCheckedChange={() => toggleFilter(filterHub, hub, setFilterHub)}
                  />
                  <label htmlFor={`hub-${hub}`} className="text-sm cursor-pointer flex-1">
                    {hub}
                  </label>
                </div>
              ))}
              {filterHub.size > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setFilterHub(new Set())}
                >
                  Temizle
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Season Multi-Select Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[180px] justify-between">
              {filterSeason.size === 0 ? 'Tüm Sezonlar' : `${filterSeason.size} sezon seçili`}
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sezon Seç</Label>
              {(['FW24', 'FW25', 'SS24', 'SS25'] as Season[]).map(season => (
                <div key={season} className="flex items-center gap-2">
                  <Checkbox
                    id={`quick-season-${season}`}
                    checked={filterSeason.has(season)}
                    onCheckedChange={() => toggleFilter(filterSeason, season, setFilterSeason)}
                  />
                  <label htmlFor={`quick-season-${season}`} className="text-sm cursor-pointer flex-1">
                    {season}
                  </label>
                </div>
              ))}
              {filterSeason.size > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setFilterSeason(new Set())}
                >
                  Temizle
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Gelişmiş Filtre
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Gelişmiş Filtreler</SheetTitle>
              <SheetDescription>
                Ürünlerinizi daha hassas bir şekilde filtrelemek için kullanın.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              {/* Marka Filtreleri */}
              <div>
                <Label className="mb-2 block">Markalar</Label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {(['Skechers', 'Hunter', 'Brooks', 'Asics', 'On', 'Clarks', 'Timberland', 'Ecco', 'Camper', 'Birkenstock', 'Crocs', 'Steve Madden', 'EMU', 'Hoka', 'Salomon', 'Saucony', 'High5'] as Brand[]).map(brand => (
                    <div key={brand} className="flex items-center gap-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filterBrand.has(brand)}
                        onCheckedChange={() => toggleFilter(filterBrand, brand, setFilterBrand)}
                      />
                      <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sezon Filtreleri */}
              <div>
                <Label className="mb-2 block">Sezonlar</Label>
                <div className="space-y-2 border border-gray-200 rounded-lg p-3">
                  {(['FW24', 'FW25', 'SS24', 'SS25'] as Season[]).map(season => (
                    <div key={season} className="flex items-center gap-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={filterSeason.has(season)}
                        onCheckedChange={() => toggleFilter(filterSeason, season, setFilterSeason)}
                      />
                      <label htmlFor={`season-${season}`} className="text-sm cursor-pointer">
                        {season}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ürün Grubu Filtreleri */}
              <div>
                <Label className="mb-2 block">Ürün Grupları</Label>
                <div className="space-y-2 border border-gray-200 rounded-lg p-3">
                  {(['Ayakkabı', 'Giyim', 'Aksesuar'] as ProductGroup[]).map(group => (
                    <div key={group} className="flex items-center gap-2">
                      <Checkbox
                        id={`group-${group}`}
                        checked={filterProductGroup.has(group)}
                        onCheckedChange={() => toggleFilter(filterProductGroup, group, setFilterProductGroup)}
                      />
                      <label htmlFor={`group-${group}`} className="text-sm cursor-pointer">
                        {group}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kanal Filtreleri */}
              <div>
                <Label className="mb-2 block">Aktif Kanallar</Label>
                <div className="space-y-2 border border-gray-200 rounded-lg p-3">
                  {(['WEB', 'AMZ', 'TYFT', 'N11', 'TDY', 'HB', 'AMZSF', 'MRP'] as Channel[]).map(channel => (
                    <div key={channel} className="flex items-center gap-2">
                      <Checkbox
                        id={`channel-${channel}`}
                        checked={filterChannels.has(channel)}
                        onCheckedChange={() => toggleFilter(filterChannels, channel, setFilterChannels)}
                      />
                      <label htmlFor={`channel-${channel}`} className="text-sm cursor-pointer">
                        {channel}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Fiyat Aralığı</Label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" placeholder="Min" />
                  <Input type="number" placeholder="Max" />
                </div>
              </div>
              
              <Button className="w-full" onClick={() => {
                setFilterBrand(new Set());
                setFilterSeason(new Set());
                setFilterProductGroup(new Set());
                setFilterChannels(new Set());
                toast.success('Filtreler temizlendi');
              }}>
                Filtreleri Temizle
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {(filterERP.size > 0 || filterBrand.size > 0 || filterHub.size > 0 || filterSeason.size > 0 || filterProductGroup.size > 0 || filterChannels.size > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Aktif Filtreler:</span>
          {Array.from(filterERP).map(erp => (
            <Badge key={`filter-erp-${erp}`} variant="secondary" className="gap-1">
              {erp}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(filterERP, erp, setFilterERP)} />
            </Badge>
          ))}
          {Array.from(filterBrand).map(brand => (
            <Badge key={`filter-brand-${brand}`} variant="secondary" className="gap-1">
              {brand}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(filterBrand, brand, setFilterBrand)} />
            </Badge>
          ))}
          {Array.from(filterHub).map(hub => (
            <Badge key={`filter-hub-${hub}`} variant="secondary" className="gap-1">
              {hub}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(filterHub, hub, setFilterHub)} />
            </Badge>
          ))}
          {Array.from(filterSeason).map(season => (
            <Badge key={`filter-season-${season}`} variant="secondary" className="gap-1">
              {season}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(filterSeason, season, setFilterSeason)} />
            </Badge>
          ))}
          {Array.from(filterProductGroup).map(group => (
            <Badge key={`filter-group-${group}`} variant="secondary" className="gap-1">
              {group}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(filterProductGroup, group, setFilterProductGroup)} />
            </Badge>
          ))}
          {Array.from(filterChannels).map(channel => (
            <Badge key={`filter-channel-${channel}`} variant="secondary" className="gap-1">
              {channel}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(filterChannels, channel, setFilterChannels)} />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setFilterERP(new Set());
              setFilterBrand(new Set());
              setFilterHub(new Set());
              setFilterSeason(new Set());
              setFilterProductGroup(new Set());
              setFilterChannels(new Set());
              toast.success('Tüm filtreler temizlendi');
            }}
          >
            Tümünü Temizle
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          <span className="font-medium">{filteredProducts.length}</span> ürün gösteriliyor
          {selectedProducts.size > 0 && (
            <span className="ml-2 text-blue-600">
              • {selectedProducts.size} ürün seçili
            </span>
          )}
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">
                  <Checkbox
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Option Code
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Ürün
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                  ERP
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Hub Durumları
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Aktif Kanallar
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Ürün Grubu
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase">
                  Güncelleme
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50 ${selectedProducts.has(product.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={selectedProducts.has(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.optionCode}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/products/${product.id}`} className="hover:underline">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.brand} • {product.category}
                      </p>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{product.sourceERP}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {getHubChips(product)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {getActiveChannels(product).map(channel => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">
                      {product.productGroup}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(product.updatedAt).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedProducts.size}
        onClear={clearSelection}
        onSendToHub={handleSendToHub}
        onSetChannels={handleSetChannels}
        onArchive={handleArchive}
      />

      {/* Hub Dialog */}
      <Dialog open={showHubDialog} onOpenChange={setShowHubDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünleri Hub'a Gönder</DialogTitle>
            <DialogDescription>
              Seçilen ürünleri hangi hub'a göndermek istediğinizi seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={selectedHubForSend}
              onValueChange={setSelectedHubForSend}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Hub seçin" />
              </SelectTrigger>
              <SelectContent>
                {(['Hunter-Klaud HUB', 'High5 HUB', 'Skechers HUB', 'Brooks HUB'] as Hub[]).map(hub => (
                  <SelectItem key={hub} value={hub}>
                    {hub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowHubDialog(false)}
            >
              İptal
            </Button>
            <Button type="button" onClick={handleHubSubmit}>
              Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Channel Dialog */}
      <Dialog open={showChannelDialog} onOpenChange={setShowChannelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünlerin Kanallarını Ayarla</DialogTitle>
            <DialogDescription>
              {selectedProducts.size} ürün için hangi kanalları aktif hale getirmek istediğinizi seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {(['WEB', 'AMZ', 'TYFT', 'N11', 'TDY', 'HB', 'AMZSF', 'MRP'] as Channel[]).map(channel => (
              <div key={channel} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                <Checkbox
                  id={`channel-dialog-${channel}`}
                  checked={selectedChannelsForSet.has(channel)}
                  onCheckedChange={() => toggleChannelForSet(channel)}
                />
                <label htmlFor={`channel-dialog-${channel}`} className="text-sm cursor-pointer flex-1 font-medium">
                  {channel}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowChannelDialog(false);
                setSelectedChannelsForSet(new Set());
              }}
            >
              İptal
            </Button>
            <Button type="button" onClick={handleChannelSubmit}>
              Ayarla ({selectedChannelsForSet.size} kanal)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}