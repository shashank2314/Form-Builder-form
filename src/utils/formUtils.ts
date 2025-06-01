import { v4 as uuidv4 } from 'uuid';
import { 
  Form, 
  FormField, 
  FormStep, 
  FieldType, 
  ValidationRule,
  FieldOption
} from '../types';

// Create a new empty form
export const createNewForm = (): Form => {
  const defaultStep: FormStep = {
    id: uuidv4(),
    title: 'Step 1',
    fields: []
  };

  return {
    id: uuidv4(),
    title: 'Untitled Form',
    steps: [defaultStep],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPublished: false
  };
};

// Create a new step
export const createNewStep = (title = 'New Step'): FormStep => {
  return {
    id: uuidv4(),
    title,
    fields: []
  };
};

// Create a new field with default properties based on type
export const createNewField = (type: FieldType): FormField => {
  const baseField: FormField = {
    id: uuidv4(),
    type,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
  };

  switch (type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
      return {
        ...baseField,
        placeholder: 'Enter value here',
        defaultValue: '',
      };
    
    case 'textarea':
      return {
        ...baseField,
        placeholder: 'Enter text here',
        defaultValue: '',
      };
    
    case 'dropdown':
    case 'radio':
      return {
        ...baseField,
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' },
        ],
        defaultValue: '',
      };
    
    case 'checkbox':
      return {
        ...baseField,
        options: [
          { id: uuidv4(), label: 'Option 1', value: 'option1' },
          { id: uuidv4(), label: 'Option 2', value: 'option2' },
        ],
        defaultValue: [],
      };
    
    case 'date':
      return {
        ...baseField,
        defaultValue: '',
      };
    
    default:
      return baseField;
  }
};

// Create a validation rule
export const createValidationRule = (
  type: ValidationRule['type'],
  value: ValidationRule['value'],
  message: string
): ValidationRule => {
  return { type, value, message };
};

// Add option to a field that supports options
export const addOption = (
  field: FormField,
  label = 'New Option'
): FieldOption => {
  const newOption = {
    id: uuidv4(),
    label,
    value: label.toLowerCase().replace(/\s+/g, '_'),
  };
  
  if (!field.options) {
    field.options = [];
  }
  
  field.options.push(newOption);
  return newOption;
};

// Validate form data
export const validateField = (field: FormField, value: any): string | null => {
  if (!field.validation) return null;
  
  for (const rule of field.validation) {
    switch (rule.type) {
      case 'required':
        if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
          return rule.message || 'This field is required';
        }
        break;
        
      case 'minLength':
        if (typeof value === 'string' && value.length < Number(rule.value)) {
          return rule.message || `Minimum length is ${rule.value} characters`;
        }
        break;
        
      case 'maxLength':
        if (typeof value === 'string' && value.length > Number(rule.value)) {
          return rule.message || `Maximum length is ${rule.value} characters`;
        }
        break;
        
      case 'pattern':
        if (typeof value === 'string' && !new RegExp(String(rule.value)).test(value)) {
          return rule.message || 'Invalid format';
        }
        break;
        
      case 'min':
        if (typeof value === 'number' && value < Number(rule.value)) {
          return rule.message || `Minimum value is ${rule.value}`;
        }
        break;
        
      case 'max':
        if (typeof value === 'number' && value > Number(rule.value)) {
          return rule.message || `Maximum value is ${rule.value}`;
        }
        break;
    }
  }
  
  return null;
};

// Get predefined templates
export const getPredefinedTemplates = () => {
  return [
    {
      id: 'contact-form',
      name: 'Contact Us',
      description: 'Simple contact form with name, email, and message',
      form: {
        id: uuidv4(),
        title: 'Contact Us',
        description: 'We would love to hear from you. Please fill out this form.',
        steps: [
          {
            id: uuidv4(),
            title: 'Contact Information',
            fields: [
              {
                id: uuidv4(),
                type: 'text',
                label: 'Full Name',
                placeholder: 'Enter your full name',
                validation: [
                  { type: 'required', value: true, message: 'Name is required' }
                ]
              },
              {
                id: uuidv4(),
                type: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email address',
                validation: [
                  { type: 'required', value: true, message: 'Email is required' },
                  { type: 'pattern', value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', message: 'Please enter a valid email' }
                ]
              },
              {
                id: uuidv4(),
                type: 'textarea',
                label: 'Message',
                placeholder: 'Enter your message',
                validation: [
                  { type: 'required', value: true, message: 'Message is required' }
                ]
              }
            ]
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPublished: false
      }
    },
    {
      id: 'signup-form',
      name: 'User Registration',
      description: 'Multi-step registration form with account and profile details',
      form: {
        id: uuidv4(),
        title: 'Create an Account',
        description: 'Complete the form below to register',
        steps: [
          {
            id: uuidv4(),
            title: 'Account Information',
            fields: [
              {
                id: uuidv4(),
                type: 'text',
                label: 'Username',
                placeholder: 'Choose a username',
                validation: [
                  { type: 'required', value: true, message: 'Username is required' },
                  { type: 'minLength', value: 4, message: 'Username must be at least 4 characters' }
                ]
              },
              {
                id: uuidv4(),
                type: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email address',
                validation: [
                  { type: 'required', value: true, message: 'Email is required' },
                  { type: 'pattern', value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', message: 'Please enter a valid email' }
                ]
              }
            ]
          },
          {
            id: uuidv4(),
            title: 'Personal Details',
            fields: [
              {
                id: uuidv4(),
                type: 'text',
                label: 'Full Name',
                placeholder: 'Enter your full name',
                validation: [
                  { type: 'required', value: true, message: 'Name is required' }
                ]
              },
              {
                id: uuidv4(),
                type: 'date',
                label: 'Date of Birth',
                validation: [
                  { type: 'required', value: true, message: 'Date of birth is required' }
                ]
              },
              {
                id: uuidv4(),
                type: 'dropdown',
                label: 'Country',
                options: [
                  { id: uuidv4(), label: 'United States', value: 'us' },
                  { id: uuidv4(), label: 'Canada', value: 'ca' },
                  { id: uuidv4(), label: 'United Kingdom', value: 'uk' },
                  { id: uuidv4(), label: 'Australia', value: 'au' }
                ],
                validation: [
                  { type: 'required', value: true, message: 'Country is required' }
                ]
              }
            ]
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPublished: false
      }
    }
  ];
};