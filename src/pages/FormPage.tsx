import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import FormPreview from '../components/Preview/FormPreview';
import { Form } from '../types';

const FormPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { getAllForms } = useFormBuilder();
  const [form, setForm] = useState<Form | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (formId) {
      const formData = localStorage.getItem(`formBuilder.form.${formId}`);
      if (formData) {
        setForm(JSON.parse(formData));
      } else {
        setNotFound(true);
      }
    }
  }, [formId]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
        <p className="mb-6 text-gray-600">The form you're looking for doesn't exist or has been deleted.</p>
        <Link
          to="/"
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Forms
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Forms
          </Link>
        </div>
        
        <FormPreview form={form} previewMode="desktop" />
      </div>
    </div>
  );
};

export default FormPage;