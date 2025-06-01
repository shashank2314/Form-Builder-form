// Field types
export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'dropdown' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'number' 
  | 'email' 
  | 'phone';

// Validation types
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value: string | number | boolean;
  message: string;
}

// Option for select, radio, checkbox
export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

// Form field interface
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | string[] | boolean;
  options?: FieldOption[];
  validation?: ValidationRule[];
  className?: string;
}

// Step interface for multi-step forms
export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

// Form interface
export interface Form {
  id: string;
  title: string;
  description?: string;
  steps: FormStep[];
  createdAt: number;
  updatedAt: number;
  isPublished: boolean;
}

// Form submission
export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: number;
}

// Form template
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  form: Form;
}

// Preview mode
export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

// Theme mode
export type ThemeMode = 'light' | 'dark';

// History action for undo/redo
export interface HistoryAction {
  form: Form;
  timestamp: number;
}

// Form builder state
export interface FormBuilderState {
  currentForm: Form | null;
  currentStep: number;
  selectedFieldId: string | null;
  previewMode: PreviewMode;
  isPreviewActive: boolean;
  history: HistoryAction[];
  historyIndex: number;
  themeMode: ThemeMode;
}