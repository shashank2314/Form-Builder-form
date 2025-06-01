import React from 'react';
import { FormField } from '../../types';
import { validateField } from '../../utils/formUtils';

interface CheckboxFieldProps {
  field: FormField;
  value: string[];
  onChange: (value: string[]) => void;
  isPreview?: boolean;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ field, value, onChange, isPreview = false }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (optionValue: string, checked: boolean) => {
    let newValue: string[];
    
    if (checked) {
      newValue = [...value, optionValue];
    } else {
      newValue = value.filter(v => v !== optionValue);
    }
    
    onChange(newValue);
    
    if (error) {
      const validationError = validateField(field, newValue);
      setError(validationError);
    }
  };

  const handleBlur = () => {
    const validationError = validateField(field, value);
    setError(validationError);
  };

  return (
    <div className="mb-4">
      <fieldset>
        <legend className="block text-sm font-medium mb-1">
          {field.label}
          {field.validation?.some(v => v.type === 'required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </legend>
        
        <div className="space-y-2">
          {field.options?.map(option => (
            <div key={option.id} className="flex items-center">
              <input
                id={`${field.id}-${option.id}`}
                type="checkbox"
                value={option.value}
                checked={value.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                onBlur={handleBlur}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isPreview && !field.defaultValue}
              />
              <label 
                htmlFor={`${field.id}-${option.id}`}
                className="ml-2 block text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CheckboxField;