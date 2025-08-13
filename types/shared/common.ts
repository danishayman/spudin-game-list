// Common/Shared Types
// General-purpose types used across the application

// Base entity type
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Paginated response type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  metadata?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

// Search parameters
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Date range type
export interface DateRange {
  start: Date | string;
  end: Date | string;
}

// Coordinate type
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// File information type
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

// Image information type
export interface ImageInfo extends FileInfo {
  width: number;
  height: number;
  alt?: string;
  caption?: string;
}

// Link information type
export interface LinkInfo {
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  siteName?: string;
}

// Color type
export interface Color {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  hsl: {
    h: number;
    s: number;
    l: number;
  };
  name?: string;
}

// Dimensions type
export interface Dimensions {
  width: number;
  height: number;
}

// Position type
export interface Position {
  x: number;
  y: number;
}

// Selection type
export interface Selection<T> {
  items: T[];
  selectedIds: Set<string | number>;
}

// Option type for dropdowns, selects, etc.
export interface Option<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  group?: string;
}

// Menu item type
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string | number;
  shortcut?: string;
}

// Breadcrumb item type
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  current?: boolean;
}

// Toast/notification type
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

// Key-value pair type
export interface KeyValuePair<T = string> {
  key: string;
  value: T;
}

// Statistics type
export interface Statistics {
  count: number;
  average?: number;
  min?: number;
  max?: number;
  sum?: number;
  percentage?: number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
    period: string;
  };
}

// Progress information
export interface Progress {
  current: number;
  total: number;
  percentage: number;
  label?: string;
  status?: 'idle' | 'in_progress' | 'completed' | 'error';
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: Progress;
}

// Error state
export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  errorCode?: string;
  retryCount?: number;
  canRetry?: boolean;
}

// Network state
export interface NetworkState {
  isOnline: boolean;
  connectionType?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
}

// Device information
export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile' | 'tv' | 'watch' | 'unknown';
  os: string;
  browser: string;
  screen: Dimensions;
  isTouchDevice: boolean;
  supportsWebGL: boolean;
  supportsServiceWorker: boolean;
}

// Geolocation information
export interface GeolocationInfo {
  coordinates: Coordinates;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

// Social media links
export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
  discord?: string;
  reddit?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

// Contact information
export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  socialLinks?: SocialLinks;
}

// Utility types
export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Function types
export type EventHandler<T = void> = (event?: T) => void;
export type AsyncEventHandler<T = void> = (event?: T) => Promise<void>;
export type Callback<T = void, R = void> = (data: T) => R;
export type AsyncCallback<T = void, R = void> = (data: T) => Promise<R>;

// React-specific utility types
export type ComponentWithChildren<P = {}> = P & {
  children: React.ReactNode;
};

export type ComponentWithOptionalChildren<P = {}> = P & {
  children?: React.ReactNode;
};

// Generic CRUD operations
export interface CrudOperations<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
  create: (data: CreateData) => Promise<T>;
  read: (id: string) => Promise<T | null>;
  update: (id: string, data: UpdateData) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (params?: SearchParams) => Promise<PaginatedResponse<T>>;
}

// Cache configuration
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum number of entries
  strategy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction strategy
}

// Feature flag type
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  conditions?: Record<string, any>;
}

// Analytics event
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
}

// Performance metrics
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
  bundleSize?: number;
}
