// Form Component Types
// Props and interfaces for form-related components

import { User } from '../api/supabase';

// Base form types
export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
}

// LoginForm component types
export interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
  className?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

// SignUpForm component types
export interface SignUpFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
  className?: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  fullName?: string;
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;
}

// SettingsForm component types
export interface SettingsFormProps {
  user: User;
  profile: Profile | null;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface SettingsFormData {
  fullName: string;
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: File | null;
  deleteAccount?: boolean;
}

// RatingInput component types
export interface RatingInputProps {
  initialRating?: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'stars' | 'numbers' | 'slider';
  showValue?: boolean;
  allowHalf?: boolean;
  className?: string;
}

// ReviewInput component types
export interface ReviewInputProps {
  initialContent?: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  showCharacterCount?: boolean;
  autoResize?: boolean;
  supportMarkdown?: boolean;
  className?: string;
}

// OAuth button types
export interface OAuthButtonProps {
  provider: 'google' | 'twitch' | 'discord' | 'github';
  variant?: 'default' | 'outline' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
  className?: string;
}

// Game form types
export interface GameFormProps {
  gameId?: number;
  initialData?: GameFormData;
  onSubmit: (data: GameFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export interface GameFormData {
  status: string | null;
  rating: number | null;
  review: string | null;
  startDate?: string;
  finishDate?: string;
  progress?: number;
  hoursPlayed?: number;
  platform?: string;
  notes?: string;
  isFavorite?: boolean;
  isPrivate?: boolean;
  tags?: string[];
}

// Search form types
export interface SearchFormProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onClear?: () => void;
  placeholder?: string;
  showFilters?: boolean;
  autoComplete?: boolean;
  className?: string;
}

export interface SearchFilters {
  genres?: string[];
  platforms?: string[];
  releaseYear?: { min: number; max: number };
  rating?: { min: number; max: number };
  developer?: string[];
  publisher?: string[];
  gameMode?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter form types
export interface FilterFormProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset?: () => void;
  availableOptions?: FilterOptions;
  className?: string;
}

export interface FilterOptions {
  genres: Array<{ id: string; name: string; count?: number }>;
  platforms: Array<{ id: string; name: string; count?: number }>;
  developers: Array<{ id: string; name: string; count?: number }>;
  publishers: Array<{ id: string; name: string; count?: number }>;
  gameModes: Array<{ id: string; name: string; count?: number }>;
  yearRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form hook types
export interface UseFormOptions<T> {
  initialData: T;
  validationRules?: ValidationRules;
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export interface FormActions<T> {
  setField: (field: keyof T, value: any) => void;
  setFields: (fields: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  reset: () => void;
  validate: () => boolean;
  submit: () => Promise<void>;
}

// File upload types
export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<string[]>;
  onError?: (error: string) => void;
  className?: string;
  variant?: 'dropzone' | 'button' | 'avatar';
  previewMode?: 'thumbnail' | 'list' | 'none';
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}
