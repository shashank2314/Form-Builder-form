import React from 'react';
import { FormField } from '../../types';
import { validateField } from '../../utils/formUtils';

interface TextFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  isPreview?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({ field, value, onChange, isPreview = false }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (error) {
      const validationError = validateField(field, e.target.value);
      setError(validationError);
    }
  };

  const handleBlur = () => {
    const validationError = validateField(field, value);
    setError(validationError);
  };

  return (
    <div className="mb-4">
      <label 
        htmlFor={field.id} 
        className="block text-sm font-medium mb-1"
      >
        {field.label}
        {field.validation?.some(v => v.type === 'required') && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>
      
      <input
        id={field.id}
        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder}
        className={`w-full px-3 py-2 border rounded-md ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          field.className || ''
        }`}
        disabled={isPreview && !field.defaultValue}
      />
      
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TextField;