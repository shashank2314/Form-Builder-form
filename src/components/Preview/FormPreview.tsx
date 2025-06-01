import React, { useState } from 'react';
import { FormField, FormStep, Form } from '../../types';
import FormElement from '../FormElements';
import { validateField } from '../../utils/formUtils';
import { useSubmissions } from '../../contexts/SubmissionContext';

interface FormPreviewProps {
  form: Form;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  isMultiStep?: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  form,
  previewMode = 'desktop',
  isMultiStep = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { submitForm } = useSubmissions();

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    step.fields.forEach(field => {
      const value = formData[field.id];
      const error = validateField(field, value);
      
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNext = () => {
    const currentStepData = form.steps[currentStep];
    console.log("form",form,currentStep);

    if (validateStep(currentStepData)) {
      setCurrentStep(prev => Math.min(prev + 1, form.steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStep = form.steps[currentStep];
    console.log("hiisubmit",finalStep);
    
    if (validateStep(finalStep)) {
      // Submit the form
      submitForm(form.id, formData);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className={`mx-auto p-6 bg-[var(--card-bg)] rounded-lg shadow-sm ${
        previewMode === 'mobile' ? 'max-w-sm' :
        previewMode === 'tablet' ? 'max-w-2xl' :
        'max-w-4xl'
      }`}>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
          <p className=" mb-6">Your form has been submitted successfully.</p>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = form.steps[currentStep];

  return (
    <div className={`mx-auto p-6 bg-[var(--card-bg)] rounded-lg shadow-sm ${
      previewMode === 'mobile' ? 'max-w-sm' :
      previewMode === 'tablet' ? 'max-w-2xl' :
      'max-w-4xl'
    }`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{form.title}</h2>
        {form.description && (
          <p className="text-gray-600">{form.description}</p>
        )}
      </div>
      
      {isMultiStep && form.steps.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {form.steps.length}
            </span>
            <span className="text-sm font-medium">
              {currentStepData.title}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / form.steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <form >
        <div className="space-y-4">
          {currentStepData.fields.map(field => (
            <FormElement
              key={field.id}
              field={field}
              value={formData[field.id] || field.defaultValue || ''}
              onChange={(value) => handleChange(field.id, value)}
              isPreview={false}
            />
          ))}
        </div>
        
        <div className="mt-6 flex justify-between">
          {isMultiStep && currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          
          {isMultiStep && currentStep < form.steps.length-1  ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormPreview;