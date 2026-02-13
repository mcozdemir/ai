import { useState } from "react";
import { mockProducts, type Product, type Hub, type Channel, type Season, type ProductGroup, type Brand } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatusChip } from "../components/StatusChip";
import { BulkActionBar } from "../components/BulkActionBar";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Search, Filter, Download, X, ArchiveRestore } from "lucide-react";
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
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function ArchivedProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterERP, setFilterERP] = useState<Set<string>>(new Set());
  const [filterBrand, setFilterBrand] = useState<Set<string>>(new Set());
  const [filterHub, setFilterHub] = useState<Set<string>>(new Set());
  const [filterSeason, setFilterSeason] = useState<Set<string>>(new Set());
  const [filterProductGroup, setFilterProductGroup] = useState<Set<string>>(new Set());
  const [filterChannels, setFilterChannels] = useState<Set<string>>(new Set());

  // Filter only archived products
  const archivedProducts = mockProducts.filter(product => product.archived === true);

  const filteredProducts = archivedProducts.filter(product => {
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

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const clearFilters = () => {
    setFilterERP(new Set());
    setFilterBrand(new Set());
    setFilterHub(new Set());
    setFilterSeason(new Set());
    setFilterProductGroup(new Set());
    setFilterChannels(new Set());
  };

  const activeFilterCount = filterERP.size + filterBrand.size + filterHub.size + filterSeason.size + filterProductGroup.size + filterChannels.size;

  const handleUnarchiveProducts = () => {
    if (selectedProducts.size === 0) {
      toast.error("Ürün seçilmedi", {
        description: "Lütfen arşivden çıkarmak için en az bir ürün seçin.",
      });
      return;
    }

    toast.success(`${selectedProducts.size} ürün arşivden çıkarılıyor`, {
      description: "Ürünler artık ana ürünler listesinde görünecek.",
    });
    setSelectedProducts(new Set());
  };

  const handleExport = () => {
    toast.success("Arşivlenmiş ürünler dışa aktarılıyor", {
      description: `${filteredProducts.length} ürün Excel formatında indiriliyor.`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Arşivlenen Ürünler</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} arşivlenmiş ürün
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Dışa Aktar
            </Button>
            <Button
              className="gap-2"
              onClick={handleUnarchiveProducts}
              disabled={selectedProducts.size === 0}
            >
              <ArchiveRestore className="h-4 w-4" />
              Arşivden Çıkar ({selectedProducts.size})
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Ürün adı veya option code ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrele
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Gelişmiş Filtreler</SheetTitle>
                <SheetDescription>
                  Ürünleri detaylı kriterlere göre filtreleyin
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {activeFilterCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
                    <X className="h-4 w-4" />
                    Tüm Filtreleri Temizle
                  </Button>
                )}

                {/* ERP Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Kaynak ERP</Label>
                  <div className="space-y-2">
                    {['Jupiter ERP', 'Olka ERP', 'Satürn ERP', 'Neptün ERP', 'Marlin ERP'].map(erp => (
                      <div key={erp} className="flex items-center gap-2">
                        <Checkbox
                          id={`erp-${erp}`}
                          checked={filterERP.has(erp)}
                          onCheckedChange={() => toggleFilter(filterERP, erp, setFilterERP)}
                        />
                        <label htmlFor={`erp-${erp}`} className="text-sm cursor-pointer">
                          {erp}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Marka</Label>
                  <div className="space-y-2">
                    {['Skechers', 'Hunter', 'Brooks', 'Asics', 'On', 'Clarks', 'Timberland', 'Ecco', 'Camper', 'Birkenstock', 'Crocs', 'Steve Madden', 'EMU', 'Hoka', 'Salomon', 'Saucony'].map(brand => (
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

                {/* Hub Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Hub</Label>
                  <div className="space-y-2">
                    {['Hunter-Klaud HUB', 'High5 HUB', 'Skechers HUB', 'Brooks HUB'].map(hub => (
                      <div key={hub} className="flex items-center gap-2">
                        <Checkbox
                          id={`hub-${hub}`}
                          checked={filterHub.has(hub)}
                          onCheckedChange={() => toggleFilter(filterHub, hub, setFilterHub)}
                        />
                        <label htmlFor={`hub-${hub}`} className="text-sm cursor-pointer">
                          {hub}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Season Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Sezon</Label>
                  <div className="space-y-2">
                    {['FW24', 'FW25', 'SS24', 'SS25'].map(season => (
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

                {/* Product Group Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Ürün Grubu</Label>
                  <div className="space-y-2">
                    {['Ayakkabı', 'Giyim', 'Aksesuar'].map(group => (
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

                {/* Channel Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Aktif Kanallar</Label>
                  <div className="space-y-2">
                    {['WEB', 'AMZ', 'TYFT', 'N11', 'TDY', 'HB', 'AMZSF', 'MRP'].map(channel => (
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Product Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <Checkbox
                  checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Ürün
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Kaynak
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Hub Durumları
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Son Güncelleme
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="block hover:text-blue-600"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {product.optionCode}
                          </code>
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <Badge variant="outline">{product.sourceERP}</Badge>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.season}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {product.productGroup}
                      </Badge>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {product.listings.map((listing, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-700">
                          {listing.hub.replace(' HUB', '')}
                        </span>
                        <StatusChip state={listing.state} size="sm" />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    <p>{new Date(product.updatedAt).toLocaleDateString('tr-TR')}</p>
                    <p className="text-xs">{product.updatedBy}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500">Arşivlenmiş ürün bulunamadı</p>
              <p className="text-sm text-gray-400 mt-1">
                Henüz hiç ürün arşivlenmemiş
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedProducts.size}
        onClear={() => setSelectedProducts(new Set())}
        onUnarchive={handleUnarchiveProducts}
      />
    </div>
  );
}