# Çatı PIM Admin Panel - Design System & Information Architecture

## 📋 İçindekiler

1. [Bilgi Mimarisi (Information Architecture)](#bilgi-mimarisi)
2. [Ekran Listesi & Wireframe Özeti](#ekran-listesi)
3. [Veri Modeli](#veri-modeli)
4. [Component Inventory](#component-inventory)
5. [Microcopy & UX Writing](#microcopy)
6. [Design Tokens](#design-tokens)
7. [Edge Cases & Validasyonlar](#edge-cases)

---

## 📐 Bilgi Mimarisi

### Site Map

```
Çatı PIM Admin Panel
├── Dashboard (/)
│   ├── KPI Cards (Total Products, Active Listings, Failed Jobs, Pending)
│   ├── Recent Jobs Timeline
│   ├── System Health Overview
│   └── Quick Stats
│
├── Ürünler (/products)
│   ├── Products List
│   │   ├── Advanced Filters
│   │   ├── Bulk Selection & Actions
│   │   └── Export
│   └── Product Detail (/products/:id)
│       ├── Master Data
│       ├── Distribution Matrix (Hub x Channel Grid)
│       └── Audit Timeline
│
├── Dağıtım Kontrolü (/distribution)
│   ├── Hub Selection Panel
│   ├── Channel Settings
│   └── Product Distribution List
│
├── Kural Motoru (/rules)
│   ├── Rules List
│   │   ├── Priority-based Sorting
│   │   ├── Active/Inactive Toggle
│   │   └── Dry Run Preview
│   └── Rule Builder (/rules/new, /rules/:id/edit)
│       ├── Condition Builder (IF)
│       └── Action Builder (THEN)
│
├── İşler & Loglar (/jobs)
│   ├── Job List with Status
│   ├── Error Details
│   └── Retry Mechanism
│   └── Job Detail (/jobs/:id)
│
├── Entegrasyonlar (/integrations)
│   ├── ERP Connectors Health
│   └── HUB Connectors Health
│
├── Raporlar (/reports)
│   ├── Hub Distribution Chart
│   ├── Sync Trend Graph
│   ├── Channel Distribution
│   └── Summary Table
│
└── Ayarlar (/settings)
    ├── User Management
    ├── Role Permissions Matrix
    └── System Configuration
```

### Navigasyon Hiyerarşisi

**Primary Navigation (Sol Sidebar)**
- Level 1: Ana menü öğeleri (Dashboard, Ürünler, Dağıtım, Kurallar, İşler, Entegrasyonlar, Raporlar, Ayarlar)
- Level 2: Alt sayfalar (ör: Product Detail, Rule Builder)

**Contextual Navigation**
- Breadcrumbs: Product Detail sayfasında "Ürünler > {Product Name}"
- Back buttons: Detay sayfalarında geri dönüş
- Tab navigation: Gelecek genişlemeler için hazır

---

## 🖼️ Ekran Listesi

### 1. Dashboard (Ana Sayfa)

**Amaç:** Sistem geneli sağlık durumu, son aktiviteler ve kritik metrikler

**Ana Bileşenler:**
- 4x KPI Stat Cards (Total Products, Active Listings, Failed Jobs, Pending Products)
- Recent Jobs Card (son 5 iş)
- System Health Card (entegrasyon durumları)
- Failed Jobs Alert (varsa)
- Quick Stats (3x mini cards)

**User Actions:**
- Jobs sayfasına git
- Integrations sayfasına git
- Failed job detayına git

**Empty State:** N/A (her zaman veri var)

---

### 2. Products List (Ürün Kataloğu)

**Amaç:** Tüm ürünleri görüntüleme, filtreleme ve bulk işlem yapma

**Ana Bileşenler:**
- Search bar
- Filter dropdowns (ERP, Brand, Hub)
- Gelişmiş Filtre Sheet (Fiyat, Stok, Tarih)
- Data Table (checkbox, option code, name, ERP, hub statuses, channels, stock, updated)
- Bulk Action Bar (sticky bottom)
- Export button

**User Actions:**
- Ürün seç (bulk)
- Filtreleri uygula
- Ürün detayına git
- Bulk Hub'a gönder
- Bulk kanal ayarla
- Bulk pasifleştir
- Export CSV

**Empty State:** "Filtreye uygun ürün bulunamadı. Filtreleri sıfırlayın."

---

### 3. Product Detail

**Amaç:** Tek ürünün tüm detaylarını görüntüleme ve yönetme

**Ana Bileşenler:**
- Header (name, option code, status)
- Action buttons (Düzenle, Hub'a Gönder, Pasifleştir, Senkronize Et)
- Master Data Card (brand, category, price, stock, attributes)
- Distribution Matrix (Hub x Channel grid with toggles)
- Quick Info Card (ID, source ERP, hub count, channel count, last updated by)
- Audit Timeline

**User Actions:**
- Kanal toggle (on/off)
- Hub'a gönder
- Ürünü pasifleştir
- Manuel senkronize et
- Audit geçmişini gör

**Empty State (Distribution Matrix):** "Bu ürün henüz herhangi bir Hub'a gönderilmemiş."

---

### 4. Distribution Control (Dağıtım Kontrolü)

**Amaç:** Toplu hub ve kanal dağıtımı yönetimi

**Ana Bileşenler:**
- Hub Selection Panel (radio buttons)
- Channel Settings (switches)
- Apply Distribution Button
- Hub Stats Card (active, pending, failed counts)
- Product List with search
- Product status badges

**User Actions:**
- Hub seç
- Kanal durumlarını ayarla
- Ürünlere uygula
- Ürün ara
- Tek ürün gönder/güncelle

**Empty State (Products):** "Ürün bulunamadı"

---

### 5. Rules List (Kural Motoru)

**Amaç:** Otomatik dağıtım kurallarını listeleme ve yönetme

**Ana Bileşenler:**
- Stats Cards (Total Rules, Affected Products, Highest Priority)
- Info Alert (kural önceliklendirme açıklaması)
- Rule Cards (priority badge, condition summary, action summary)
- Active/Inactive toggle per rule
- Dry Run button
- Edit/Delete actions

**User Actions:**
- Yeni kural oluştur
- Kuralı aktif/pasif yap
- Dry Run (simülasyon)
- Kuralı düzenle
- Kuralı sil (confirmation modal)

**Empty State:** "Henüz kural oluşturulmamış. İlk Kuralı Oluştur"

**Microcopy:**
- "Kurallar öncelik sırasına göre çalışır. Aynı ürüne birden fazla kural uygulanıyorsa, en yüksek öncelikli (en düşük sayı) kural geçerli olur."

---

### 6. Jobs & Logs (İşler)

**Amaç:** Tüm sync ve bulk işlemleri izleme, hata yönetimi

**Ana Bileşenler:**
- Filter dropdowns (Status, Type)
- Job Cards (type badge, status chip, progress bar, error details)
- Success rate indicator
- Duration display
- Error accordion
- Retry button

**User Actions:**
- Filtre uygula
- Job detayına git
- Retry (başarısız joblar için)
- Export logs

**Empty State:** "Seçilen filtrelere uygun iş bulunamadı"

**Microcopy:**
- "Retry başlatıldı - İş yeniden çalıştırılıyor..."

---

### 7. Integrations (Entegrasyonlar)

**Amaç:** ERP ve Hub bağlantılarının sağlık durumu

**Ana Bileşenler:**
- Overview Stats (Total, Healthy, Warning, Error)
- Integration Cards grouped by type (ERP / HUB)
- Health status badges
- Last sync time
- Auth status
- Error count alerts
- Manuel sync button
- Configure button

**User Actions:**
- Manuel senkronizasyon tetikle
- Yapılandırma sayfasına git
- Sağlık detaylarını gör

**Empty State:** N/A

**Microcopy (Warning):**
- "Dikkat Gerekli - Son 24 saatte {X} hata kaydedildi. Lütfen log dosyalarını kontrol edin."

---

### 8. Reports (Raporlar)

**Amaç:** Analitik ve metrikler

**Ana Bileşenler:**
- Hub Distribution Bar Chart
- Sync Trend Line Chart (7 günlük)
- Channel Distribution Pie Chart
- Summary Table (Today, This Week, This Month, Trend)

**User Actions:**
- Rapor indir
- Grafikleri görüntüle

**Empty State:** N/A

---

### 9. Settings (Ayarlar)

**Amaç:** Kullanıcı ve sistem yönetimi

**Ana Bileşenler:**
- User Management List (avatar, name, email, role, actions)
- Role Permissions Matrix Table
- System Settings Card

**User Actions:**
- Yeni kullanıcı ekle
- Kullanıcı düzenle/sil
- Sistem ayarlarını düzenle

**Empty State:** N/A

---

## 📊 Veri Modeli

### Core Entities

```typescript
Product {
  id: string
  optionCode: string (unique key)
  name: string
  sourceERP: SourceERP
  brand: string
  category: string
  price: number
  stock: number
  attributes: Record<string, string>
  listings: Listing[]
  updatedAt: timestamp
  updatedBy: string
}

Listing {
  hub: Hub
  state: ListingState (Active | Inactive | Pending | Failed)
  channels: ChannelStatus[]
  lastSync: timestamp
  errors?: string[]
}

ChannelStatus {
  channel: Channel
  active: boolean
}

Rule {
  id: string
  name: string
  priority: number (1 = highest)
  status: 'active' | 'inactive'
  conditions: RuleCondition[]
  actions: RuleAction[]
  affectedCount: number
  createdAt: timestamp
  createdBy: string
}

RuleCondition {
  type: 'brand' | 'category' | 'attribute' | 'sourceERP' | 'price' | 'stock'
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in'
  value: string | string[] | number
}

RuleAction {
  type: 'send_to_hub' | 'set_channels' | 'block' | 'set_default'
  params: Record<string, any>
}

Job {
  id: string
  type: 'sync' | 'push' | 'deactivate' | 'bulk_update' | 'rule_apply'
  status: 'Running' | 'Completed' | 'Failed' | 'Partial'
  startTime: timestamp
  endTime?: timestamp
  affectedProducts: number
  successCount: number
  failedCount: number
  errors: JobError[]
  triggeredBy: string
  metadata?: Record<string, any>
}

Integration {
  id: string
  type: 'ERP' | 'HUB'
  name: string
  health: 'Healthy' | 'Warning' | 'Error'
  lastSync: timestamp
  endpoint: string
  authStatus: 'Connected' | 'Expired' | 'Failed'
  syncCount: number
  errorCount: number
}
```

### Enums

```typescript
SourceERP: 'SAP-TR' | 'Oracle-EU' | 'NetSuite-US' | 'Dynamics-UK'
Hub: 'Hunter' | 'High5' | 'Skechers' | 'Brooks' | 'Nike'
Channel: 'WEB' | 'APP' | 'MP' | 'SM_MP' | 'B2B'
ListingState: 'Active' | 'Inactive' | 'Pending' | 'Failed'
JobType: 'sync' | 'push' | 'deactivate' | 'bulk_update' | 'rule_apply'
JobStatus: 'Running' | 'Completed' | 'Failed' | 'Partial'
```

---

## 🧩 Component Inventory

### Custom Components

| Component | Props | Usage | Location |
|-----------|-------|-------|----------|
| **StatusChip** | status, size | Durum göstergesi badge'i | Tüm listelerde |
| **StatCard** | title, value, icon, trend, description | Dashboard KPI kartları | Dashboard |
| **BulkActionBar** | selectedCount, onClear, onSendToHub, onDeactivate, onDelete, onSetChannels | Bulk işlem kontrol barı | Products List |
| **DistributionMatrix** | listings, onToggleChannel, readonly | Hub x Channel grid | Product Detail |
| **AuditTimeline** | entries | Değişiklik geçmişi timeline | Product Detail |
| **MainLayout** | - | Ana layout (sidebar + header) | Tüm sayfalar |

### UI Library Components (shadcn/ui)

- Badge, Button, Card, Checkbox, Input, Label
- Select, Switch, Table, Tabs, Tooltip
- Dialog, Sheet, AlertDialog
- DropdownMenu, Progress
- Avatar, Separator, ScrollArea
- Sonner (Toast)

### Third-Party Components

- **Recharts:** BarChart, LineChart, PieChart (Reports sayfası)
- **React Router:** Link, useParams, useLocation, RouterProvider

---

## 📝 Microcopy & UX Writing

### Button Labels

| Context | Label | Icon |
|---------|-------|------|
| Primary Action | Hub'a Gönder | Send |
| Secondary Action | Pasifleştir | Archive |
| Destructive | Sil | Trash2 |
| Retry | Retry | RotateCcw |
| Save | Kaydet | Save |
| Cancel | İptal | X |
| Export | Export / Rapor İndir | Download |
| Add | Yeni {Entity} Ekle | Plus |
| Edit | Düzenle | Edit |
| View | Detay / Görüntüle | Eye |
| Sync | Manuel Sync / Senkronize Et | RotateCcw |
| Clear Selection | Temizle | X |
| Apply | Uygula / Ayarları Uygula | - |
| Back | Geri | ArrowLeft |

### Page Headers

```
Dashboard: "Dashboard" / "Çatı PIM sistemi genel durum özeti"
Products: "Ürün Kataloğu" / "Tüm ERP'lerden toplanan master ürün listesi"
Distribution: "Dağıtım Kontrolü" / "Hub ve kanal bazlı toplu ürün dağıtımı yönetimi"
Rules: "Kural Motoru" / "Otomatik ürün dağıtım ve kanal yönetimi kuralları"
Jobs: "İşler & Loglar" / "Tüm senkronizasyon ve bulk işlem geçmişi"
Integrations: "Entegrasyonlar" / "ERP ve Hub bağlantılarının sağlık durumu ve yapılandırması"
Reports: "Raporlar & Analitik" / "Ürün dağıtım ve senkronizasyon metrikleri"
Settings: "Ayarlar" / "Kullanıcılar, roller ve sistem yapılandırması"
```

### Empty States

```
No Products: "Filtreye uygun ürün bulunamadı. Filtreleri sıfırlayın."
No Distribution: "Bu ürün henüz herhangi bir Hub'a gönderilmemiş."
No Rules: "Henüz kural oluşturulmamış. İlk Kuralı Oluştur"
No Jobs: "Seçilen filtrelere uygun iş bulunamadı"
No Audit: "Henüz değişiklik kaydı bulunmuyor."
Product Not Found: "Ürün bulunamadı"
```

### Toast Messages

```
Success:
- "Kanal durumu güncellendi"
- "Kural durumu güncellendi"
- "Retry başlatıldı - İş yeniden çalıştırılıyor..."
- "{Hub'a Gönder} işlemi başlatıldı - {X} ürün için işlem queue'ya eklendi."
- "Dağıtım ayarları uygulandı - {Hub} Hub • Kanallar: {channels}"
- "{Name} senkronizasyonu başlatıldı"
- "{RuleName} kuralı silindi"

Info:
- "Kural simülasyonu - Bu kural {X} ürünü etkileyecek. İşlem queue'ya eklendi."
- "{Name} yapılandırma sayfası açılıyor..."
```

### Alert Messages

```
Rule Priority Info:
"Kurallar öncelik sırasına göre çalışır. Aynı ürüne birden fazla kural uygulanıyorsa, 
en yüksek öncelikli (en düşük sayı) kural geçerli olur. Çakışmaları önlemek için 
kurallarınızı dikkatlice tasarlayın."

Distribution Info:
"Bu ayarlar seçili ürünlere uygulanacak. Mevcut dağıtımları değiştirir ve yeni job oluşturur."

Integration Warning:
"Dikkat Gerekli - Son 24 saatte {X} hata kaydedildi. Lütfen log dosyalarını kontrol edin."

Delete Confirmation:
"{RuleName} kuralını silmek istediğinize emin misiniz? 
Bu işlem geri alınamaz ve {X} ürünü etkileyebilir."

Failed Jobs Alert:
"Dikkat! {X} İş Başarısız"
```

### Table Headers

```
Products Table:
- Option Code
- Ürün
- ERP
- Hub Durumları
- Aktif Kanallar
- Stok
- Güncelleme

Distribution Matrix:
- Hub
- Durum
- WEB / APP / MP / SM_MP / B2B (channel columns)
- Son Sync

Jobs Table:
- Tip
- Durum
- Başlangıç
- Süre
- Toplam Ürün
- Tetikleyen

Permissions Table:
- Özellik
- Admin / Ops / ReadOnly (role columns)
```

### Badges & Chips

```
Status:
- Active (green)
- Inactive (gray)
- Pending (blue)
- Failed (red)
- Running (blue, animated)
- Completed (green)
- Partial (orange)

Health:
- Healthy (green)
- Warning (amber)
- Error (red)

Auth:
- Connected (green)
- Expired (red)
- Failed (red)

Role:
- Admin (default/blue)
- Ops (secondary)
- ReadOnly (outline)
```

---

## 🎨 Design Tokens

### Color Palette

```css
/* Status Colors */
--status-active: #10B981 (green-500)
--status-inactive: #6B7280 (gray-500)
--status-pending: #3B82F6 (blue-500)
--status-failed: #EF4444 (red-500)
--status-warning: #F59E0B (amber-500)

/* Background */
--bg-page: #F9FAFB (gray-50)
--bg-card: #FFFFFF
--bg-sidebar: #FFFFFF
--bg-hover: #F3F4F6 (gray-100)

/* Text */
--text-primary: #111827 (gray-900)
--text-secondary: #6B7280 (gray-500)
--text-muted: #9CA3AF (gray-400)

/* Border */
--border-default: #E5E7EB (gray-200)
--border-hover: #D1D5DB (gray-300)

/* Brand Colors */
--brand-primary: #3B82F6 (blue-600)
--brand-secondary: #8B5CF6 (purple-600)
--brand-gradient: linear-gradient(135deg, #3B82F6, #8B5CF6)
```

### Typography

```css
/* Headings */
--h1: 24px / 32px, font-bold (Page titles)
--h2: 18px / 28px, font-semibold (Section titles)
--h3: 16px / 24px, font-semibold (Card titles)

/* Body */
--body: 14px / 20px, font-normal
--body-sm: 12px / 16px, font-normal
--body-xs: 11px / 16px, font-normal

/* Code */
--code: 12px, monospace
```

### Spacing

```css
/* Component Spacing */
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px

/* Layout */
--sidebar-width: 256px (16rem)
--sidebar-collapsed: 80px (5rem)
--header-height: 64px (4rem)
--content-padding: 24px (1.5rem)
```

### Radius

```css
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-full: 9999px
```

### Shadow

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15)
```

---

## ⚠️ Edge Cases & Validasyonlar

### 1. Çoklu ERP'den Aynı Option Code

**Problem:** Aynı Option Code iki farklı ERP'den gelirse çakışma oluşur.

**Çözüm:**
- Conflict Resolution ekranı göster
- "Option Code: {code} şu anda {ERP1}'de mevcut. {ERP2}'den gelen veriyi uygula / reddet?"
- Kullanıcı "Merge" veya "Override" seçeneği seçer
- Conflict log tutulur

**UI:**
```
[!] Çakışma Tespit Edildi
Option Code: HUNT-001-BLK-42
Mevcut Kaynak: SAP-TR
Yeni Kaynak: Oracle-EU

[Mevcut Veride Kal] [Yeni Veriyi Uygula] [Manuel Merge]
```

### 2. Hub Push Başarısız (Partial Success)

**Problem:** 500 üründen 488'i başarılı, 12'si hata aldı.

**Çözüm:**
- Job durumu "Partial" olarak işaretle
- Hatalı ürünleri listele
- Retry butonu sadece hatalı ürünler için çalışır
- "12 ürün için retry yapılacak. Devam edilsin mi?" confirmation

**UI:**
```
[Job #j3] Partial Success
488 / 500 başarılı (97.6%)

Hatalar:
- HUNT-102-GRN-41: Hub API timeout (Retryable)
- SKE-777-BLK-40: Invalid attribute mapping (Not Retryable)

[Retry (12 ürün)] [Export Error CSV]
```

### 3. Kural Çakışması

**Problem:** Aynı ürüne birden fazla kural uygulanabilir.

**Çözüm:**
- Priority sistemi (1 = en yüksek öncelik)
- Dry Run özelliği: kural uygulanmadan önce etkilenecek ürünleri göster
- Conflict warning: "Bu kural Rule #2 ile çakışıyor (450 ortak ürün)"

**UI:**
```
[⚠] Kural Çakışması Uyarısı

Bu kural aşağıdaki kurallarla çakışıyor:
- Rule #2 "Socks → Block Marketplace" (450 ortak ürün)

Öncelik sistemi nedeniyle bu kural daha düşük öncelikli.

[Önceliği Değiştir] [Yine de Kaydet] [İptal]
```

### 4. Bulk İşlem Limiti

**Problem:** 10,000 ürün seçilip bulk işlem yapılırsa sistem yavaşlar.

**Çözüm:**
- Bulk işlem > 1000 ürün ise otomatik Job'a dönüştür
- "Bu işlem 10,450 ürünü etkileyecek. İşlem arka planda job olarak çalıştırılacak."
- Progress bar göster
- Job tamamlandığında notification gönder

**UI:**
```
[i] Büyük İşlem Tespit Edildi

10,450 ürün seçildi. Bu işlem arka planda job olarak çalıştırılacak.
Tahmini süre: ~15 dakika

İşlem tamamlandığında bildirim alacaksınız.

[Job Başlat] [İptal]
```

### 5. Hub API Timeout / Downtime

**Problem:** Hub servisi yanıt vermiyor.

**Çözüm:**
- Integration health "Error" olarak işaretle
- Auto-retry mekanizması (3 deneme, exponential backoff)
- Manuel retry butonu
- Alternative hub önerisi: "Skechers Hub yanıt vermiyor. Ürünü High5 Hub'a göndermek ister misiniz?"

**UI:**
```
[!] Hub Bağlantı Hatası

Skechers Hub şu anda yanıt vermiyor.
Son başarılı bağlantı: 2 saat önce

İşlemler otomatik olarak 5 dk sonra tekrar denenecek.

[Manuel Retry] [Bildirimleri Kapat]
```

### 6. Unauthorized ERP Access

**Problem:** ERP credential'ları expired.

**Çözüm:**
- Integration auth status "Expired" olarak güncelle
- Dashboard'da critical alert göster
- Settings > Integrations > Re-authenticate butonu
- İlgili kullanıcılara email/notification gönder

**UI:**
```
[🔴] Kritik: Oracle-EU Bağlantısı Kesildi

Auth token süresi doldu. Senkronizasyon durdu.

[Yeniden Bağlan] [Admin'e Bildir]
```

### 7. Empty Distribution Matrix

**Problem:** Ürün hiçbir Hub'da değil.

**Çözüm:**
- Empty state göster: "Bu ürün henüz herhangi bir Hub'a gönderilmemiş."
- CTA button: "İlk Hub'a Gönder"
- Kural öneri: "Otomatik dağıtım için kural oluşturmak ister misiniz?"

**UI:**
```
[Dağıtım Matrisi]

Bu ürün henüz herhangi bir Hub'a gönderilmemiş.

[Hub'a Gönder] [Kural Oluştur]
```

### 8. Low Stock Warning

**Problem:** Stok 50'nin altına düştü ama ürün hala aktif.

**Çözüm:**
- Products List'te stock kolonunda kırmızı renk
- Product Detail'de warning badge
- Kural: "Stok < 50 ise MP'yi kapat" (opsiyonel)

**UI:**
```
[⚠] Düşük Stok Uyarısı

Bu ürünün stoğu 45 adete düştü.
MP kanalını kapatmak ister misiniz?

[MP'yi Kapat] [Uyarıyı Kapat]
```

---

## 🔄 User Flow Örnekleri

### Flow A: "Bir ürünü seçip X HUB'a gönder, Y HUB'da kapat, WEB'de açık MP'de kapalı yap"

1. Products List'e git
2. Ürünü ara (search veya filtre)
3. Ürünü seç (checkbox)
4. Bulk Action Bar'da "Hub'a Gönder" > "Skechers Hub" seç
5. Confirmation: "1 ürün Skechers Hub'a gönderilecek. WEB ve APP kanalları aktif edilecek."
6. Approve
7. Job oluşturulur, notification gösterilir
8. (Alternatif: Product Detail'den tek tek toggle yapılabilir)

### Flow B: "Option Code bazında 500 ürünü bulk seç, 'Skechers HUB + WEB açık, MP kapalı' uygula"

1. Products List'e git
2. Search: Option Code listesini yapıştır (veya CSV upload)
3. Filtreyi uygula
4. "Tümünü Seç" checkbox
5. Bulk Action Bar: "Hub'a Gönder" > "Skechers Hub"
6. Modal: "500 ürün etkilenecek. Kanal ayarları: WEB: Açık, MP: Kapalı"
7. Approve
8. Job başlatılır (>1000 ise otomatik job, <1000 ise direkt apply)
9. Progress notification

### Flow C: "Kural tanımla: Brand=Skechers ise Skechers HUB'a gönder; Attribute=socks ise MP'de kapalı"

1. Rules List'e git
2. "Yeni Kural Oluştur"
3. Rule Builder:
   - Name: "Skechers Auto Route + Socks MP Block"
   - Priority: 2
   - IF: Brand equals "Skechers" AND Attribute equals "socks"
   - THEN: Send to Hub "Skechers" AND Set Channels {WEB: true, APP: true, MP: false}
4. Dry Run: "Bu kural 450 ürünü etkileyecek"
5. Preview etkilenecek ürünleri
6. Save
7. Kural aktif edilir, arka planda job çalıştırılır

### Flow D: "Job takip: hangi ürünler hangi job ile gitti, hata aldı mı, retry yap"

1. Jobs & Logs'a git
2. Filter: Status = "Failed" veya "Partial"
3. Job kartında "Detay" butonuna tıkla
4. Job Detail sayfası:
   - Hangi ürünler başarısız: liste
   - Hata mesajları
   - Retryable/Non-retryable ayrımı
5. "Retry" butonuna tıkla
6. Confirmation: "12 ürün için retry yapılacak"
7. Approve
8. Yeni job oluşturulur

---

## 📦 Deployment & Maintenance Notes

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader friendly (ARIA labels)
- Color contrast ratio ≥ 4.5:1

### Responsive Breakpoints
- Desktop: 1280px+
- Tablet: 768px - 1279px
- Mobile: < 768px (sidebar collapses to hamburger menu)

---

## 🎯 Success Metrics

### Business Metrics
- Reduction in hub management time: Target 60%
- Increase in product distribution accuracy: Target 95%+
- Decrease in manual errors: Target 80%

### Technical Metrics
- System uptime: 99.5%
- Average job completion time: < 10 minutes
- Failed job rate: < 2%

### User Satisfaction
- Task completion rate: > 90%
- User satisfaction score: > 4/5
- Support tickets: < 5 per week

---

**Version:** 1.0  
**Last Updated:** 2026-02-12  
**Author:** Product Designer + Information Architect
