import React from 'react';
import { FormField } from '../../types';
import { validateField } from '../../utils/formUtils';

interface RadioFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  isPreview?: boolean;
}

const RadioField: React.FC<RadioFieldProps> = ({ field, value, onChange, isPreview = false }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (optionValue: string) => {
    onChange(optionValue);
    
    if (error) {
      const validationError = validateField(field, optionValue);
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
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                onBlur={handleBlur}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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

export default RadioField;