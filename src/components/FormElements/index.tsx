import React from 'react';
import { FormField } from '../../types';
import TextField from './TextField';
import TextAreaField from './TextAreaField';
import DropdownField from './DropdownField';
import CheckboxField from './CheckboxField';
import RadioField from './RadioField';
import DateField from './DateField';

interface FormElementProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  isPreview?: boolean;
}

const FormElement: React.FC<FormElementProps> = ({ field, value, onChange, isPreview = false }) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
      return (
        <TextField 
          field={field} 
          value={value || ''} 
          onChange={onChange} 
          isPreview={isPreview} 
        />
      );
      
    case 'textarea':
      return (
        <TextAreaField 
          field={field} 
          value={value || ''} 
          onChange={onChange} 
          isPreview={isPreview} 
        />
      );
      
    case 'dropdown':
      return (
        <DropdownField 
          field={field} 
          value={value || ''} 
          onChange={onChange} 
          isPreview={isPreview} 
        />
      );
      
    case 'checkbox':
      return (
        <CheckboxField 
          field={field} 
          value={Array.isArray(value) ? value : []} 
          onChange={onChange} 
          isPreview={isPreview} 
        />
      );
      
    case 'radio':
      return (
        <RadioField 
          field={field} 
          value={value || ''} 
          onChange={onChange} 
          isPreview={isPreview} 
        />
      );
      
    case 'date':
      return (
        <DateField 
          field={field} 
          value={value || ''} 
          onChange={onChange} 
          isPreview={isPreview} 
        />
      );
      
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};

export default FormElement;