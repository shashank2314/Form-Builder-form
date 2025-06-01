import React from 'react';
import { FormField } from '../../types';
import { validateField } from '../../utils/formUtils';

interface DropdownFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  isPreview?: boolean;
}

const DropdownField: React.FC<DropdownFieldProps> = ({ field, value, onChange, isPreview = false }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      
      <select
        id={field.id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border rounded-md ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          field.className || ''
        }`}
        disabled={isPreview && !field.defaultValue}
      >
        <option value="">Select an option</option>
        {field.options?.map(option => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DropdownField;