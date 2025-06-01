import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  Form, 
  FormField, 
  FormStep, 
  FormBuilderState,
  HistoryAction,
  PreviewMode,
  ThemeMode
} from '../types';
import { createNewForm } from '../utils/formUtils';

// Action types
type FormBuilderAction =
  | { type: 'SET_CURRENT_FORM'; payload: Form }
  | { type: 'UPDATE_FORM'; payload: Partial<Form> }
  | { type: 'ADD_FIELD'; payload: { stepId: string; field: FormField } }
  | { type: 'UPDATE_FIELD'; payload: { stepId: string; fieldId: string; updates: Partial<FormField> } }
  | { type: 'REMOVE_FIELD'; payload: { stepId: string; fieldId: string } }
  | { type: 'REORDER_FIELDS'; payload: { stepId: string; newOrder: FormField[] } }
  | { type: 'ADD_STEP'; payload: FormStep }
  | { type: 'UPDATE_STEP'; payload: { stepId: string; updates: Partial<FormStep> } }
  | { type: 'REMOVE_STEP'; payload: { stepId: string } }
  | { type: 'REORDER_STEPS'; payload: { newOrder: FormStep[] } }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SELECT_FIELD'; payload: string | null }
  | { type: 'SET_PREVIEW_MODE'; payload: PreviewMode }
  | { type: 'TOGGLE_PREVIEW'; payload?: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_HISTORY'; payload: Form }
  | { type: 'SET_THEME'; payload: ThemeMode };

// Initial state
const initialState: FormBuilderState = {
  currentForm: null,
  currentStep: 0,
  selectedFieldId: null,
  previewMode: 'desktop',
  isPreviewActive: false,
  history: [],
  historyIndex: -1,
  themeMode: 'light'
};

// Reducer function
const formBuilderReducer = (state: FormBuilderState, action: FormBuilderAction): FormBuilderState => {
  switch (action.type) {
    case 'SET_CURRENT_FORM':
      return {
        ...state,
        currentForm: action.payload,
        currentStep: 0,
        selectedFieldId: null,
        history: [{ form: action.payload, timestamp: Date.now() }],
        historyIndex: 0
      };
      
    case 'UPDATE_FORM':
      if (!state.currentForm) return state;
      
      const updatedForm = {
        ...state.currentForm,
        ...action.payload,
        updatedAt: Date.now()
      };
      
      return {
        ...state,
        currentForm: updatedForm
      };
      
    case 'ADD_FIELD':
      if (!state.currentForm) return state;
      
      const formWithNewField = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: state.currentForm.steps.map(step => 
          step.id === action.payload.stepId
            ? { ...step, fields: [...step.fields, action.payload.field] }
            : step
        )
      };
      
      return {
        ...state,
        currentForm: formWithNewField,
        selectedFieldId: action.payload.field.id
      };
      
    case 'UPDATE_FIELD':
      if (!state.currentForm) return state;
      
      const formWithUpdatedField = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: state.currentForm.steps.map(step => 
          step.id === action.payload.stepId
            ? {
                ...step,
                fields: step.fields.map(field => 
                  field.id === action.payload.fieldId
                    ? { ...field, ...action.payload.updates }
                    : field
                )
              }
            : step
        )
      };
      
      return {
        ...state,
        currentForm: formWithUpdatedField
      };
      
    case 'REMOVE_FIELD':
      if (!state.currentForm) return state;
      
      const formWithFieldRemoved = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: state.currentForm.steps.map(step => 
          step.id === action.payload.stepId
            ? {
                ...step,
                fields: step.fields.filter(field => field.id !== action.payload.fieldId)
              }
            : step
        )
      };
      
      return {
        ...state,
        currentForm: formWithFieldRemoved,
        selectedFieldId: null
      };
      
    case 'REORDER_FIELDS':
      if (!state.currentForm) return state;
      
      const formWithReorderedFields = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: state.currentForm.steps.map(step => 
          step.id === action.payload.stepId
            ? { ...step, fields: action.payload.newOrder }
            : step
        )
      };
      
      return {
        ...state,
        currentForm: formWithReorderedFields
      };
      
    case 'ADD_STEP':
      if (!state.currentForm) return state;
      
      const formWithNewStep = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: [...state.currentForm.steps, action.payload]
      };
      
      return {
        ...state,
        currentForm: formWithNewStep,
        currentStep: formWithNewStep.steps.length - 1
      };
      
    case 'UPDATE_STEP':
      if (!state.currentForm) return state;
      
      const formWithUpdatedStep = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: state.currentForm.steps.map(step => 
          step.id === action.payload.stepId
            ? { ...step, ...action.payload.updates }
            : step
        )
      };
      
      return {
        ...state,
        currentForm: formWithUpdatedStep
      };
      
    case 'REMOVE_STEP':
      if (!state.currentForm || state.currentForm.steps.length <= 1) return state;
      
      const formWithStepRemoved = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: state.currentForm.steps.filter(step => step.id !== action.payload.stepId)
      };
      
      const newCurrentStep = Math.min(state.currentStep, formWithStepRemoved.steps.length - 1);
      
      return {
        ...state,
        currentForm: formWithStepRemoved,
        currentStep: newCurrentStep,
        selectedFieldId: null
      };
      
    case 'REORDER_STEPS':
      if (!state.currentForm) return state;
      
      const formWithReorderedSteps = {
        ...state.currentForm,
        updatedAt: Date.now(),
        steps: action.payload.newOrder
      };
      
      return {
        ...state,
        currentForm: formWithReorderedSteps
      };
      
    case 'SET_CURRENT_STEP':
      if (!state.currentForm) return state;
      const safeStepIndex = Math.max(0, Math.min(action.payload, state.currentForm.steps.length - 1));
      
      return {
        ...state,
        currentStep: safeStepIndex,
        selectedFieldId: null
      };
      
    case 'SELECT_FIELD':
      return {
        ...state,
        selectedFieldId: action.payload
      };
      
    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload
      };
      
    case 'TOGGLE_PREVIEW':
      const newPreviewState = action.payload !== undefined ? action.payload : !state.isPreviewActive;
      
      return {
        ...state,
        isPreviewActive: newPreviewState,
        selectedFieldId: newPreviewState ? null : state.selectedFieldId
      };
      
    case 'ADD_HISTORY':
      // Don't add to history if the form is the same as the current one
      if (
        state.historyIndex >= 0 && 
        state.history[state.historyIndex].form.id === action.payload.id &&
        state.history[state.historyIndex].form.updatedAt === action.payload.updatedAt
      ) {
        return state;
      }
      
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ form: action.payload, timestamp: Date.now() });
      
      // Limit history to last 30 actions
      if (newHistory.length > 30) {
        newHistory.shift();
      }
      
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
      
    case 'UNDO':
      if (state.historyIndex <= 0) return state;
      
      const prevHistoryIndex = state.historyIndex - 1;
      const prevForm = state.history[prevHistoryIndex].form;
      
      return {
        ...state,
        currentForm: prevForm,
        historyIndex: prevHistoryIndex,
        selectedFieldId: null
      };
      
    case 'REDO':
      if (state.historyIndex >= state.history.length - 1) return state;
      
      const nextHistoryIndex = state.historyIndex + 1;
      const nextForm = state.history[nextHistoryIndex].form;
      
      return {
        ...state,
        currentForm: nextForm,
        historyIndex: nextHistoryIndex,
        selectedFieldId: null
      };
      
    case 'SET_THEME':
      return {
        ...state,
        themeMode: action.payload
      };
      
    default:
      return state;
  }
};

// Context type
interface FormBuilderContextType {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
  saveForm: () => void;
  loadForm: (formId: string) => void;
  createForm: () => void;
  getAllForms: () => Form[];
  publishForm: () => void;
  saveCurrentFormToHistory: () => void;
}

// Create context
const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

// Provider component
export const FormBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  // Auto-save current form to localStorage
  useEffect(() => {
    if (state.currentForm) {
      localStorage.setItem(`formBuilder.form.${state.currentForm.id}`, JSON.stringify(state.currentForm));
      
      // Update form list
      const formList = getAllForms();
      const existingIndex = formList.findIndex(form => form.id === state.currentForm.id);
      
      if (existingIndex >= 0) {
        formList[existingIndex] = state.currentForm;
      } else {
        formList.push(state.currentForm);
      }
      
      localStorage.setItem('formBuilder.formList', JSON.stringify(formList.map(form => form.id)));
      
      // Add to history
      saveCurrentFormToHistory();
    }
  }, [state.currentForm]);

  // Save current form to history (debounced)
  const saveCurrentFormToHistory = () => {
    if (state.currentForm) {
      dispatch({ type: 'ADD_HISTORY', payload: state.currentForm });
    }
  };

  // Save form to localStorage
  const saveForm = () => {
    if (state.currentForm) {
      localStorage.setItem(`formBuilder.form.${state.currentForm.id}`, JSON.stringify(state.currentForm));
    }
  };

  // Load form from localStorage
  const loadForm = (formId: string) => {
    const formJson = localStorage.getItem(`formBuilder.form.${formId}`);
    if (formJson) {
      const form = JSON.parse(formJson) as Form;
      dispatch({ type: 'SET_CURRENT_FORM', payload: form });
    }
  };

  // Create a new form
  const createForm = () => {
    const newForm = createNewForm();
    dispatch({ type: 'SET_CURRENT_FORM', payload: newForm });
  };

  // Get all forms from localStorage
  const getAllForms = (): Form[] => {
    const formListJson = localStorage.getItem('formBuilder.formList');
    if (!formListJson) return [];
    
    const formIds = JSON.parse(formListJson) as string[];
    const forms: Form[] = [];
    
    for (const formId of formIds) {
      const formJson = localStorage.getItem(`formBuilder.form.${formId}`);
      if (formJson) {
        forms.push(JSON.parse(formJson) as Form);
      }
    }
    
    return forms;
  };

  // Publish form - generates a shareable link
  const publishForm = () => {
    if (state.currentForm) {
      const publishedForm = {
        ...state.currentForm,
        isPublished: true,
        updatedAt: Date.now()
      };
      
      dispatch({ type: 'UPDATE_FORM', payload: publishedForm });
      saveForm();
    }
  };

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        dispatch,
        saveForm,
        loadForm,
        createForm,
        getAllForms,
        publishForm,
        saveCurrentFormToHistory
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

// Hook to use the form builder context
export const useFormBuilder = (): FormBuilderContextType => {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};