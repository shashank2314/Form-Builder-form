import React from 'react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';

const FormProperties: React.FC = () => {
  const { state, dispatch } = useFormBuilder();
  const form = state.currentForm;
  
  if (!form) return null;
  
  const updateForm = (updates: Partial<{ title: string; description: string }>) => {
    dispatch({ type: 'UPDATE_FORM', payload: updates });
  };
  
  return (
    <div className="p-4 bg-[var(--card-bg)] rounded-md border">
      <h3 className="text-lg font-medium mb-4">Form Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Form Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={form.description || ''}
            onChange={(e) => updateForm({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FormProperties;