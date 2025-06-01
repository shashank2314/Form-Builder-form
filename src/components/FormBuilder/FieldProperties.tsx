import React from 'react';
import { FormField, ValidationRule, FieldOption } from '../../types';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FieldPropertiesProps {
  field: FormField;
  stepId: string;
}

const FieldProperties: React.FC<FieldPropertiesProps> = ({ field, stepId }) => {
  const { dispatch } = useFormBuilder();

  const updateField = (updates: Partial<FormField>) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { stepId, fieldId: field.id, updates }
    });
  };

  const addValidationRule = (type: ValidationRule['type']) => {
    const newValidation = field.validation || [];
    const existingRule = newValidation.find(rule => rule.type === type);
    
    if (existingRule) return;
    
    let value: string | number | boolean;
    let message = '';
    
    switch (type) {
      case 'required':
        value = true;
        message = `${field.label} is required`;
        break;
      case 'minLength':
        value = 1;
        message = `Minimum length is 1 character`;
        break;
      case 'maxLength':
        value = 100;
        message = `Maximum length is 100 characters`;
        break;
      case 'pattern':
        value = '';
        message = `Invalid format`;
        break;
      case 'min':
        value = 0;
        message = `Minimum value is 0`;
        break;
      case 'max':
        value = 100;
        message = `Maximum value is 100`;
        break;
      default:
        value = '';
        message = '';
    }
    
    newValidation.push({ type, value, message });
    updateField({ validation: newValidation });
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    if (!field.validation) return;
    
    const newValidation = [...field.validation];
    newValidation[index] = { ...newValidation[index], ...updates };
    
    updateField({ validation: newValidation });
  };

  const removeValidationRule = (index: number) => {
    if (!field.validation) return;
    
    const newValidation = [...field.validation];
    newValidation.splice(index, 1);
    
    updateField({ validation: newValidation });
  };

  const addOption = () => {
    const newOptions = [...(field.options || [])];
    newOptions.push({
      id: uuidv4(),
      label: `Option ${newOptions.length + 1}`,
      value: `option${newOptions.length + 1}`
    });
    
    updateField({ options: newOptions });
  };

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    if (!field.options) return;
    
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], ...updates };
    
    updateField({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!field.options) return;
    
    const newOptions = [...field.options];
    newOptions.splice(index, 1);
    
    updateField({ options: newOptions });
  };

  return (
    <div className="p-4 bg-[var(--card-bg)] rounded-md border">
      <h3 className="text-lg font-medium mb-4">Field Properties</h3>
      
      <div className="space-y-4">
        {/* Basic Properties */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField({ label: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Help Text
          </label>
          <input
            type="text"
            value={field.helpText || ''}
            onChange={(e) => updateField({ helpText: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Options for dropdown, checkbox, radio */}
        {(field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'radio') && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Options
              </label>
              <button
                type="button"
                onClick={addOption}
                className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Option
              </button>
            </div>
            
            {field.options?.map((option, index) => (
              <div key={option.id} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(index, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  placeholder="Option label"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Validation Rules */}
        <div >
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Validation
            </label>
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addValidationRule(e.target.value as ValidationRule['type']);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1 border rounded-md text-sm"
                defaultValue=""
              >
                <option value="" disabled>Add validation</option>
                <option value="required">Required</option>
                <option value="minLength">Min Length</option>
                <option value="maxLength">Max Length</option>
                <option value="pattern">Pattern</option>
                {(field.type === 'number') && (
                  <>
                    <option value="min">Min Value</option>
                    <option value="max">Max Value</option>
                  </>
                )}
              </select>
            </div>
          </div>
          <div className='border-white border-2 rounded-md'>
          {field.validation?.map((rule, index) => (
            <div key={index} className=" p-3 rounded-md mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium capitalize">
                  {rule.type.replace(/([A-Z])/g, ' $1')}
                </span>
                <button
                  type="button"
                  onClick={() => removeValidationRule(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {rule.type !== 'required' && (
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Value
                  </label>
                  <input
                    type={rule.type === 'min' || rule.type === 'max' || rule.type === 'minLength' || rule.type === 'maxLength' ? 'number' : 'text'}
                    value={rule.value.toString()}
                    onChange={(e) => {
                      const value = 
                        rule.type === 'min' || rule.type === 'max' || rule.type === 'minLength' || rule.type === 'maxLength'
                          ? parseInt(e.target.value, 10)
                          : e.target.value;
                      updateValidationRule(index, { value });
                    }}
                    className="w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Error Message
                </label>
                <input
                  type="text"
                  value={rule.message}
                  onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                  className="w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldProperties;