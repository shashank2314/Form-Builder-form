import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import { getPredefinedTemplates } from '../utils/formUtils';

const TemplatesPage: React.FC = () => {
  const { dispatch } = useFormBuilder();
  const navigate = useNavigate();
  const templates = getPredefinedTemplates();

  const handleSelectTemplate = (templateIndex: number) => {
    const selectedTemplate = templates[templateIndex];
    
    if (selectedTemplate) {
      dispatch({ type: 'SET_CURRENT_FORM', payload: selectedTemplate.form });
      navigate(`/builder/${selectedTemplate.form.id}`);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Forms
          </Link>
          <h1 className="text-2xl font-bold mt-2">Form Templates</h1>
          <p className="text-gray-600 mt-1">
            Choose a template to quickly create a new form.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <div 
              key={template.id} 
              className="bg-[var(--card-bg)] rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <button
                  type="button"
                  onClick={() => handleSelectTemplate(index)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;