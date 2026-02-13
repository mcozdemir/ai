// Mock data for Çatı PIM Admin Panel

export type SourceERP = 'Jupiter ERP' | 'Olka ERP' | 'Satürn ERP' | 'Neptün ERP' | 'Marlin ERP';
export type Hub = 'Hunter-Klaud HUB' | 'High5 HUB' | 'Skechers HUB' | 'Brooks HUB';
export type Channel = 'WEB' | 'AMZ' | 'TYFT' | 'N11' | 'TDY' | 'HB' | 'AMZSF' | 'MRP';
export type ListingState = 'Active' | 'Inactive' | 'Pending' | 'Failed';
export type JobType = 'sync' | 'push' | 'deactivate' | 'bulk_update' | 'rule_apply';
export type JobStatus = 'Running' | 'Completed' | 'Failed' | 'Partial';
export type RuleConditionType = 'brand' | 'category' | 'attribute' | 'sourceERP' | 'price' | 'stock';
export type RuleActionType = 'send_to_hub' | 'set_channels' | 'block' | 'set_default';
export type Season = 'FW24' | 'FW25' | 'SS24' | 'SS25';
export type ProductGroup = 'Giyim' | 'Aksesuar' | 'Ayakkabı';
export type Brand = 'Skechers' | 'Hunter' | 'Brooks' | 'Asics' | 'On' | 'Clarks' | 'Timberland' | 'Ecco' | 'Camper' | 'Birkenstock' | 'Crocs' | 'Steve Madden' | 'EMU' | 'Hoka' | 'Salomon' | 'Saucony' | 'High5';

export interface Product {
  id: string;
  optionCode: string;
  name: string;
  sourceERP: SourceERP;
  brand: Brand;
  category: string;
  price: number;
  productGroup: ProductGroup;
  season: Season;
  attributes: Record<string, string>;
  listings: Listing[];
  updatedAt: string;
  updatedBy: string;
  archived?: boolean;
}

export interface Listing {
  hub: Hub;
  state: ListingState;
  channels: ChannelStatus[];
  lastSync: string;
  errors?: string[];
}

export interface ChannelStatus {
  channel: Channel;
  active: boolean;
}

export interface Rule {
  id: string;
  name: string;
  priority: number;
  status: 'active' | 'inactive';
  conditions: RuleCondition[];
  actions: RuleAction[];
  affectedCount: number;
  createdAt: string;
  createdBy: string;
}

export interface RuleCondition {
  type: RuleConditionType;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: string | string[] | number;
}

export interface RuleAction {
  type: RuleActionType;
  params: Record<string, any>;
}

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  startTime: string;
  endTime?: string;
  affectedProducts: number;
  successCount: number;
  failedCount: number;
  errors: JobError[];
  triggeredBy: string;
  metadata?: Record<string, any>;
}

export interface JobError {
  productId: string;
  optionCode: string;
  error: string;
  retryable: boolean;
}

export interface Integration {
  id: string;
  type: 'ERP' | 'HUB';
  name: string;
  health: 'Healthy' | 'Warning' | 'Error';
  lastSync: string;
  endpoint: string;
  authStatus: 'Connected' | 'Expired' | 'Failed';
  syncCount: number;
  errorCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Ops' | 'ReadOnly';
  avatar?: string;
}

export interface Permission {
  key: string;
  label: string;
  description: string;
  granted: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'p1',
    optionCode: 'HUNT-001-BLK-42',
    name: 'Hunter Original Tall Boot Black',
    sourceERP: 'Jupiter ERP',
    brand: 'Hunter',
    category: 'Boots',
    price: 195.00,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'Black', size: '42', material: 'Rubber' },
    listings: [
      {
        hub: 'Hunter-Klaud HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'TYFT', active: false },
        ],
        lastSync: '2026-02-12T10:30:00Z',
      },
    ],
    updatedAt: '2026-02-12T09:15:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p2',
    optionCode: 'SKE-302-WHT-39',
    name: 'Skechers D\'Lites Fresh Start',
    sourceERP: 'Olka ERP',
    brand: 'Skechers',
    category: 'Sneakers',
    price: 89.99,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'White', size: '39', type: 'chunky' },
    listings: [
      {
        hub: 'Skechers HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'TYFT', active: true },
          { channel: 'N11', active: false },
        ],
        lastSync: '2026-02-12T11:00:00Z',
      },
    ],
    updatedAt: '2026-02-11T16:22:00Z',
    updatedBy: 'ops@pim.com',
  },
  {
    id: 'p3',
    optionCode: 'BRK-501-GRY-43',
    name: 'Brooks Ghost 15 Running Shoe',
    sourceERP: 'Satürn ERP',
    brand: 'Brooks',
    category: 'Running',
    price: 140.00,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'Grey', size: '43', cushion: 'neutral' },
    listings: [
      {
        hub: 'Brooks HUB',
        state: 'Pending',
        channels: [
          { channel: 'WEB', active: false },
          { channel: 'AMZ', active: false },
        ],
        lastSync: '2026-02-12T08:45:00Z',
      },
    ],
    updatedAt: '2026-02-12T08:45:00Z',
    updatedBy: 'sync-job',
  },
  {
    id: 'p4',
    optionCode: 'HIGH-220-RED-40',
    name: 'High5 Performance Socks',
    sourceERP: 'Jupiter ERP',
    brand: 'High5',
    category: 'Accessories',
    price: 12.50,
    productGroup: 'Aksesuar',
    season: 'FW24',
    attributes: { color: 'Red', size: '40-44', category: 'socks' },
    listings: [
      {
        hub: 'High5 HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'TYFT', active: false },
        ],
        lastSync: '2026-02-12T07:20:00Z',
      },
    ],
    updatedAt: '2026-02-10T14:30:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p5',
    optionCode: 'HUNT-102-GRN-41',
    name: 'Hunter Chelsea Boot Green',
    sourceERP: 'Jupiter ERP',
    brand: 'Hunter',
    category: 'Boots',
    price: 165.00,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'Green', size: '41', material: 'Rubber' },
    listings: [
      {
        hub: 'Hunter-Klaud HUB',
        state: 'Failed',
        channels: [],
        lastSync: '2026-02-11T22:10:00Z',
        errors: ['Hub API timeout', 'Retry scheduled'],
      },
    ],
    updatedAt: '2026-02-11T22:10:00Z',
    updatedBy: 'sync-job',
  },
  {
    id: 'p6',
    optionCode: 'SKE-410-BLK-38',
    name: 'Skechers Go Walk Joy',
    sourceERP: 'Olka ERP',
    brand: 'Skechers',
    category: 'Walking',
    price: 75.00,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'Black', size: '38', type: 'slip-on' },
    listings: [
      {
        hub: 'Skechers HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'TYFT', active: true },
        ],
        lastSync: '2026-02-12T10:00:00Z',
      },
      {
        hub: 'High5 HUB',
        state: 'Inactive',
        channels: [],
        lastSync: '2026-02-10T12:00:00Z',
      },
    ],
    updatedAt: '2026-02-12T10:00:00Z',
    updatedBy: 'rule-engine',
  },
  {
    id: 'p7',
    optionCode: 'BRK-605-BLU-44',
    name: 'Brooks Adrenaline GTS 23',
    sourceERP: 'Satürn ERP',
    brand: 'Brooks',
    category: 'Running',
    price: 150.00,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'Blue', size: '44', cushion: 'stability' },
    listings: [
      {
        hub: 'Brooks HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'MRP', active: true },
        ],
        lastSync: '2026-02-12T09:30:00Z',
      },
    ],
    updatedAt: '2026-02-12T09:30:00Z',
    updatedBy: 'ops@pim.com',
  },
  {
    id: 'p8',
    optionCode: 'ASICS-120-BLK-42',
    name: 'Asics Gel-Kayano 30',
    sourceERP: 'Neptün ERP',
    brand: 'Asics',
    category: 'Running',
    price: 160.00,
    productGroup: 'Ayakkabı',
    season: 'FW25',
    attributes: { color: 'Black', size: '42', type: 'stability' },
    listings: [
      {
        hub: 'Brooks HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'TYFT', active: false },
        ],
        lastSync: '2026-02-12T10:15:00Z',
      },
    ],
    updatedAt: '2026-02-12T10:15:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p9',
    optionCode: 'ON-340-WHT-43',
    name: 'On Cloudmonster',
    sourceERP: 'Marlin ERP',
    brand: 'On',
    category: 'Running',
    price: 180.00,
    productGroup: 'Ayakkabı',
    season: 'FW25',
    attributes: { color: 'White', size: '43', type: 'max-cushion' },
    listings: [
      {
        hub: 'High5 HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'N11', active: true },
        ],
        lastSync: '2026-02-12T11:20:00Z',
      },
    ],
    updatedAt: '2026-02-12T11:20:00Z',
    updatedBy: 'ops@pim.com',
  },
  {
    id: 'p10',
    optionCode: 'CLARK-450-BRN-41',
    name: 'Clarks Desert Boot',
    sourceERP: 'Jupiter ERP',
    brand: 'Clarks',
    category: 'Casual',
    price: 130.00,
    productGroup: 'Ayakkabı',
    season: 'FW25',
    attributes: { color: 'Brown', size: '41', material: 'Suede' },
    listings: [
      {
        hub: 'Hunter-Klaud HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'TYFT', active: true },
        ],
        lastSync: '2026-02-12T09:45:00Z',
      },
    ],
    updatedAt: '2026-02-12T09:45:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p11',
    optionCode: 'TIMB-230-YEL-44',
    name: 'Timberland 6-Inch Premium Boot',
    sourceERP: 'Olka ERP',
    brand: 'Timberland',
    category: 'Boots',
    price: 200.00,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'Wheat', size: '44', material: 'Nubuck' },
    listings: [
      {
        hub: 'Hunter-Klaud HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'HB', active: true },
        ],
        lastSync: '2026-02-12T10:50:00Z',
      },
    ],
    updatedAt: '2026-02-12T10:50:00Z',
    updatedBy: 'ops@pim.com',
  },
  {
    id: 'p12',
    optionCode: 'ECCO-180-BLK-40',
    name: 'Ecco Soft 7 Sneaker',
    sourceERP: 'Satürn ERP',
    brand: 'Ecco',
    category: 'Sneakers',
    price: 140.00,
    productGroup: 'Ayakkabı',
    season: 'SS24',
    attributes: { color: 'Black', size: '40', material: 'Leather' },
    listings: [
      {
        hub: 'High5 HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: false },
        ],
        lastSync: '2026-02-12T08:30:00Z',
      },
    ],
    updatedAt: '2026-02-12T08:30:00Z',
    updatedBy: 'sync-job',
  },
  {
    id: 'p13',
    optionCode: 'CAMP-290-GRY-42',
    name: 'Camper Peu Cami',
    sourceERP: 'Neptün ERP',
    brand: 'Camper',
    category: 'Casual',
    price: 165.00,
    productGroup: 'Ayakkabı',
    season: 'SS24',
    attributes: { color: 'Grey', size: '42', type: 'casual' },
    listings: [
      {
        hub: 'Skechers HUB',
        state: 'Pending',
        channels: [],
        lastSync: '2026-02-12T07:15:00Z',
      },
    ],
    updatedAt: '2026-02-12T07:15:00Z',
    updatedBy: 'sync-job',
  },
  {
    id: 'p14',
    optionCode: 'BIRK-550-BRN-39',
    name: 'Birkenstock Arizona Sandal',
    sourceERP: 'Marlin ERP',
    brand: 'Birkenstock',
    category: 'Sandals',
    price: 95.00,
    productGroup: 'Ayakkabı',
    season: 'SS25',
    attributes: { color: 'Brown', size: '39', material: 'Cork' },
    listings: [
      {
        hub: 'High5 HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'TYFT', active: true },
          { channel: 'N11', active: true },
        ],
        lastSync: '2026-02-12T11:10:00Z',
      },
    ],
    updatedAt: '2026-02-12T11:10:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p15',
    optionCode: 'CROCS-670-PNK-38',
    name: 'Crocs Classic Clog',
    sourceERP: 'Jupiter ERP',
    brand: 'Crocs',
    category: 'Clogs',
    price: 45.00,
    productGroup: 'Ayakkabı',
    season: 'SS25',
    attributes: { color: 'Pink', size: '38', type: 'classic' },
    listings: [
      {
        hub: 'Skechers HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'TYFT', active: true },
          { channel: 'N11', active: true },
        ],
        lastSync: '2026-02-12T10:40:00Z',
      },
    ],
    updatedAt: '2026-02-12T10:40:00Z',
    updatedBy: 'ops@pim.com',
  },
  {
    id: 'p16',
    optionCode: 'STEVE-340-BLK-40',
    name: 'Steve Madden Troopa Boot',
    sourceERP: 'Olka ERP',
    brand: 'Steve Madden',
    category: 'Boots',
    price: 120.00,
    productGroup: 'Ayakkabı',
    season: 'FW25',
    attributes: { color: 'Black', size: '40', material: 'Leather' },
    listings: [
      {
        hub: 'Hunter-Klaud HUB',
        state: 'Inactive',
        channels: [],
        lastSync: '2026-02-11T16:00:00Z',
      },
    ],
    updatedAt: '2026-02-11T16:00:00Z',
    updatedBy: 'sync-job',
  },
  {
    id: 'p17',
    optionCode: 'EMU-210-CHE-41',
    name: 'EMU Australia Stinger Boot',
    sourceERP: 'Satürn ERP',
    brand: 'EMU',
    category: 'Boots',
    price: 150.00,
    productGroup: 'Ayakkabı',
    season: 'FW24',
    attributes: { color: 'Chestnut', size: '41', material: 'Sheepskin' },
    listings: [
      {
        hub: 'Hunter-Klaud HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
        ],
        lastSync: '2026-02-12T09:00:00Z',
      },
    ],
    updatedAt: '2026-02-12T09:00:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p18',
    optionCode: 'HOKA-480-BLU-43',
    name: 'Hoka Clifton 9',
    sourceERP: 'Neptün ERP',
    brand: 'Hoka',
    category: 'Running',
    price: 145.00,
    productGroup: 'Ayakkabı',
    season: 'SS24',
    attributes: { color: 'Blue', size: '43', type: 'neutral' },
    listings: [
      {
        hub: 'Brooks HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
          { channel: 'TYFT', active: false },
          { channel: 'TDY', active: true },
        ],
        lastSync: '2026-02-12T10:25:00Z',
      },
    ],
    updatedAt: '2026-02-12T10:25:00Z',
    updatedBy: 'ops@pim.com',
  },
  {
    id: 'p19',
    optionCode: 'SALO-320-GRN-44',
    name: 'Salomon Speedcross 5',
    sourceERP: 'Marlin ERP',
    brand: 'Salomon',
    category: 'Trail Running',
    price: 135.00,
    productGroup: 'Ayakkabı',
    season: 'FW25',
    attributes: { color: 'Green', size: '44', type: 'trail' },
    listings: [
      {
        hub: 'Brooks HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: true },
        ],
        lastSync: '2026-02-12T11:05:00Z',
      },
    ],
    updatedAt: '2026-02-12T11:05:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p20',
    optionCode: 'SAUC-260-RED-42',
    name: 'Saucony Ride 16',
    sourceERP: 'Jupiter ERP',
    brand: 'Saucony',
    category: 'Running',
    price: 140.00,
    productGroup: 'Ayakkabı',
    season: 'SS25',
    attributes: { color: 'Red', size: '42', type: 'neutral' },
    listings: [
      {
        hub: 'Brooks HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: false },
          { channel: 'AMZSF', active: true },
        ],
        lastSync: '2026-02-12T09:50:00Z',
      },
    ],
    updatedAt: '2026-02-12T09:50:00Z',
    updatedBy: 'ops@pim.com',
  },
  {
    id: 'p21',
    optionCode: 'SKE-880-NAV-M',
    name: 'Skechers Performance Shirt',
    sourceERP: 'Olka ERP',
    brand: 'Skechers',
    category: 'Sportswear',
    price: 35.00,
    productGroup: 'Giyim',
    season: 'SS24',
    attributes: { color: 'Navy', size: 'M', material: 'Polyester' },
    listings: [
      {
        hub: 'Skechers HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'TYFT', active: true },
        ],
        lastSync: '2026-02-12T08:55:00Z',
      },
    ],
    updatedAt: '2026-02-12T08:55:00Z',
    updatedBy: 'admin@pim.com',
  },
  {
    id: 'p22',
    optionCode: 'HUNT-990-BLK-OS',
    name: 'Hunter Rain Hat',
    sourceERP: 'Jupiter ERP',
    brand: 'Hunter',
    category: 'Headwear',
    price: 40.00,
    productGroup: 'Aksesuar',
    season: 'FW24',
    attributes: { color: 'Black', size: 'One Size', material: 'Waterproof' },
    listings: [
      {
        hub: 'Hunter-Klaud HUB',
        state: 'Active',
        channels: [
          { channel: 'WEB', active: true },
          { channel: 'AMZ', active: false },
        ],
        lastSync: '2026-02-12T07:30:00Z',
      },
    ],
    updatedAt: '2026-02-12T07:30:00Z',
    updatedBy: 'ops@pim.com',
  },
];

// Mock Rules
export const mockRules: Rule[] = [
  {
    id: 'r1',
    name: 'Skechers Brand Auto-Route',
    priority: 1,
    status: 'active',
    conditions: [
      { type: 'brand', operator: 'equals', value: 'Skechers' },
    ],
    actions: [
      { type: 'send_to_hub', params: { hub: 'Skechers HUB' } },
      { type: 'set_channels', params: { WEB: true, AMZ: true, TYFT: true } },
    ],
    affectedCount: 1250,
    createdAt: '2026-01-15T10:00:00Z',
    createdBy: 'admin@pim.com',
  },
  {
    id: 'r2',
    name: 'Socks → Block Marketplace',
    priority: 2,
    status: 'active',
    conditions: [
      { type: 'attribute', operator: 'equals', value: 'socks' },
    ],
    actions: [
      { type: 'set_channels', params: { TYFT: false, N11: false } },
    ],
    affectedCount: 450,
    createdAt: '2026-01-20T14:30:00Z',
    createdBy: 'ops@pim.com',
  },
  {
    id: 'r3',
    name: 'High-Value Items → B2B Only',
    priority: 3,
    status: 'active',
    conditions: [
      { type: 'price', operator: 'greater_than', value: 200 },
    ],
    actions: [
      { type: 'set_channels', params: { MRP: true, TYFT: false } },
    ],
    affectedCount: 89,
    createdAt: '2026-02-01T09:00:00Z',
    createdBy: 'admin@pim.com',
  },
  {
    id: 'r4',
    name: 'Brooks → Brooks Hub',
    priority: 1,
    status: 'active',
    conditions: [
      { type: 'brand', operator: 'equals', value: 'Brooks' },
    ],
    actions: [
      { type: 'send_to_hub', params: { hub: 'Brooks HUB' } },
    ],
    affectedCount: 567,
    createdAt: '2026-01-10T11:00:00Z',
    createdBy: 'admin@pim.com',
  },
  {
    id: 'r5',
    name: 'Low Stock Alert (Inactive)',
    priority: 5,
    status: 'inactive',
    conditions: [
      { type: 'stock', operator: 'less_than', value: 50 },
    ],
    actions: [
      { type: 'set_channels', params: { TYFT: false } },
    ],
    affectedCount: 0,
    createdAt: '2026-02-05T16:00:00Z',
    createdBy: 'ops@pim.com',
  },
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'j1',
    type: 'bulk_update',
    status: 'Completed',
    startTime: '2026-02-12T10:00:00Z',
    endTime: '2026-02-12T10:05:32Z',
    affectedProducts: 500,
    successCount: 500,
    failedCount: 0,
    errors: [],
    triggeredBy: 'admin@pim.com',
    metadata: { action: 'Send to Skechers Hub + WEB active' },
  },
  {
    id: 'j2',
    type: 'sync',
    status: 'Running',
    startTime: '2026-02-12T11:30:00Z',
    affectedProducts: 1200,
    successCount: 850,
    failedCount: 0,
    errors: [],
    triggeredBy: 'system-cron',
    metadata: { source: 'Jupiter ERP' },
  },
  {
    id: 'j3',
    type: 'rule_apply',
    status: 'Partial',
    startTime: '2026-02-12T09:15:00Z',
    endTime: '2026-02-12T09:20:12Z',
    affectedProducts: 450,
    successCount: 438,
    failedCount: 12,
    errors: [
      { productId: 'p5', optionCode: 'HUNT-102-GRN-41', error: 'Hub API timeout', retryable: true },
      { productId: 'p99', optionCode: 'SKE-777-BLK-40', error: 'Invalid attribute mapping', retryable: false },
    ],
    triggeredBy: 'rule-engine',
    metadata: { ruleId: 'r2', ruleName: 'Socks → Block Marketplace' },
  },
  {
    id: 'j4',
    type: 'deactivate',
    status: 'Failed',
    startTime: '2026-02-11T22:00:00Z',
    endTime: '2026-02-11T22:01:45Z',
    affectedProducts: 25,
    successCount: 0,
    failedCount: 25,
    errors: [
      { productId: 'p5', optionCode: 'HUNT-102-GRN-41', error: 'Connection refused to Hunter Hub', retryable: true },
    ],
    triggeredBy: 'ops@pim.com',
    metadata: { hub: 'Hunter-Klaud HUB' },
  },
  {
    id: 'j5',
    type: 'push',
    status: 'Completed',
    startTime: '2026-02-11T08:00:00Z',
    endTime: '2026-02-11T08:12:00Z',
    affectedProducts: 120,
    successCount: 120,
    failedCount: 0,
    errors: [],
    triggeredBy: 'admin@pim.com',
    metadata: { hub: 'Brooks HUB', channel: 'WEB' },
  },
];

// Mock Integrations
export const mockIntegrations: Integration[] = [
  {
    id: 'int1',
    type: 'ERP',
    name: 'Jupiter ERP',
    health: 'Healthy',
    lastSync: '2026-02-12T11:30:00Z',
    endpoint: 'https://jupiter-erp.example.com/api/v2',
    authStatus: 'Connected',
    syncCount: 45230,
    errorCount: 12,
  },
  {
    id: 'int2',
    type: 'ERP',
    name: 'Olka ERP',
    health: 'Healthy',
    lastSync: '2026-02-12T11:00:00Z',
    endpoint: 'https://olka-erp.example.com/products',
    authStatus: 'Connected',
    syncCount: 32100,
    errorCount: 8,
  },
  {
    id: 'int3',
    type: 'ERP',
    name: 'Satürn ERP',
    health: 'Warning',
    lastSync: '2026-02-12T08:45:00Z',
    endpoint: 'https://saturn-erp.example.com/rest/catalog',
    authStatus: 'Connected',
    syncCount: 18950,
    errorCount: 45,
  },
  {
    id: 'int4',
    type: 'ERP',
    name: 'Neptün ERP',
    health: 'Error',
    lastSync: '2026-02-10T14:20:00Z',
    endpoint: 'https://neptune-erp.example.com/odata/v4',
    authStatus: 'Expired',
    syncCount: 12400,
    errorCount: 230,
  },
  {
    id: 'int5',
    type: 'ERP',
    name: 'Marlin ERP',
    health: 'Healthy',
    lastSync: '2026-02-10T14:20:00Z',
    endpoint: 'https://marlin-erp.example.com/odata/v4',
    authStatus: 'Connected',
    syncCount: 12400,
    errorCount: 230,
  },
  {
    id: 'int6',
    type: 'HUB',
    name: 'Hunter-Klaud HUB',
    health: 'Warning',
    lastSync: '2026-02-12T10:30:00Z',
    endpoint: 'https://hunter-hub.example.com/api/products',
    authStatus: 'Connected',
    syncCount: 8500,
    errorCount: 25,
  },
  {
    id: 'int7',
    type: 'HUB',
    name: 'Skechers HUB',
    health: 'Healthy',
    lastSync: '2026-02-12T11:00:00Z',
    endpoint: 'https://skechers-hub.example.com/v1/catalog',
    authStatus: 'Connected',
    syncCount: 15200,
    errorCount: 3,
  },
  {
    id: 'int8',
    type: 'HUB',
    name: 'Brooks HUB',
    health: 'Healthy',
    lastSync: '2026-02-12T09:30:00Z',
    endpoint: 'https://brooks-hub.example.com/api/v2/items',
    authStatus: 'Connected',
    syncCount: 6700,
    errorCount: 1,
  },
  {
    id: 'int9',
    type: 'HUB',
    name: 'High5 HUB',
    health: 'Healthy',
    lastSync: '2026-02-12T07:20:00Z',
    endpoint: 'https://high5-hub.example.com/products',
    authStatus: 'Connected',
    syncCount: 4200,
    errorCount: 0,
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@pim.com',
    role: 'Admin',
  },
  {
    id: 'u2',
    name: 'Operations Manager',
    email: 'ops@pim.com',
    role: 'Ops',
  },
  {
    id: 'u3',
    name: 'Category Specialist',
    email: 'category@pim.com',
    role: 'Ops',
  },
  {
    id: 'u4',
    name: 'Analyst',
    email: 'analyst@pim.com',
    role: 'ReadOnly',
  },
];

// Available Permissions
export const availablePermissions: Omit<Permission, 'granted'>[] = [
  {
    key: 'view_products',
    label: 'Ürün Görüntüleme',
    description: 'Tüm ürünleri görüntüleme yetkisi',
  },
  {
    key: 'edit_products',
    label: 'Ürün Düzenleme',
    description: 'Ürün bilgilerini düzenleme yetkisi',
  },
  {
    key: 'manage_distribution',
    label: 'Hub Dağıtımı',
    description: 'Ürünleri hub\'lara dağıtma yetkisi',
  },
  {
    key: 'bulk_operations',
    label: 'Bulk İşlemler',
    description: 'Toplu işlem yapma yetkisi',
  },
  {
    key: 'create_rules',
    label: 'Kural Oluşturma',
    description: 'Otomatik kural oluşturma ve düzenleme yetkisi',
  },
  {
    key: 'manage_users',
    label: 'Kullanıcı Yönetimi',
    description: 'Kullanıcı ve rol yönetimi yetkisi',
  },
  {
    key: 'view_reports',
    label: 'Rapor Görüntüleme',
    description: 'Sistem raporlarını görüntüleme yetkisi',
  },
  {
    key: 'manage_integrations',
    label: 'Entegrasyon Yönetimi',
    description: 'ERP ve Hub entegrasyonlarını yönetme yetkisi',
  },
  {
    key: 'view_jobs',
    label: 'Job Görüntüleme',
    description: 'Sistem job\'larını görüntüleme yetkisi',
  },
  {
    key: 'manage_channels',
    label: 'Kanal Yönetimi',
    description: 'Satış kanallarını yönetme yetkisi',
  },
];

// Mock Roles
export const mockRoles: Role[] = [
  {
    id: 'role1',
    name: 'Admin',
    description: 'Tüm sistem yetkilerine sahip tam yönetici rolü',
    userCount: 1,
    permissions: availablePermissions.map(p => ({ ...p, granted: true })),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role2',
    name: 'Ops',
    description: 'Operasyon ekibi için ürün ve dağıtım yetkileri',
    userCount: 2,
    permissions: availablePermissions.map(p => ({
      ...p,
      granted: ['view_products', 'edit_products', 'manage_distribution', 'bulk_operations', 'manage_channels', 'view_reports', 'view_jobs'].includes(p.key),
    })),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-02-05T10:30:00Z',
  },
  {
    id: 'role3',
    name: 'ReadOnly',
    description: 'Sadece görüntüleme yetkisi olan sınırlı rol',
    userCount: 1,
    permissions: availablePermissions.map(p => ({
      ...p,
      granted: ['view_products', 'view_reports', 'view_jobs'].includes(p.key),
    })),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// Dashboard Statistics
export const getDashboardStats = () => {
  const totalProducts = mockProducts.length;
  const activeListings = mockProducts.filter(p => 
    p.listings.some(l => l.state === 'Active')
  ).length;
  const failedJobs = mockJobs.filter(j => j.status === 'Failed').length;
  const pendingProducts = mockProducts.filter(p =>
    p.listings.some(l => l.state === 'Pending')
  ).length;

  return {
    totalProducts,
    activeListings,
    failedJobs,
    pendingProducts,
  };
};