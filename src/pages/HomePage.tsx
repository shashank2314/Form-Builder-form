import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  FileText, 
  ClipboardList, 
  Calendar 
} from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import { useSubmissions } from '../contexts/SubmissionContext';
import Header from '../components/Header/Header';
import { Form } from '../types';


const HomePage: React.FC = () => {
  const { createForm, getAllForms } = useFormBuilder();
  const { getSubmissions } = useSubmissions();
  const [forms, setForms] = useState<Form[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setForms(getAllForms());
  }, []);

  const handleCreateForm = () => {
    createForm();
    navigate('/builder');
  };

  const handleDeleteForm = (formId: string) => {
    setIsDeleting(formId);
  };

  const confirmDelete = (formId: string) => {
    // Remove form from localStorage
    localStorage.removeItem(`formBuilder.form.${formId}`);
    
    // Update formList
    const formList = JSON.parse(localStorage.getItem('formBuilder.formList') || '[]');
    const updatedFormList = formList.filter((id: string) => id !== formId);
    localStorage.setItem('formBuilder.formList', JSON.stringify(updatedFormList));
    
    // Update forms state
    setForms(prev => prev.filter(form => form.id !== formId));
    setIsDeleting(null);
  };

  const cancelDelete = () => {
    setIsDeleting(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSubmissionCount = (formId: string) => {
    return getSubmissions(formId).length;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Forms</h1>
          
          <button
            type="button"
            onClick={handleCreateForm}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Form
          </button>
        </div>
        
        {forms.length === 0 ? (
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No forms yet</h2>
            <p className="text-gray-500 mb-4">Create your first form to get started</p>
            <button
              type="button"
              onClick={handleCreateForm}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Create Form
            </button>
          </div>
        ) : (
          <div className="bg-[var(--bg-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <div 
                key={form.id} 
                className="bg-[var(--card-bg)] rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                {isDeleting === form.id ? (
                  <div className="p-6">
                    <p className="text-center font-medium text-gray-700 mb-4">
                      Are you sure you want to delete this form?
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={() => confirmDelete(form.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={cancelDelete}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col justify-between h-full'>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2 truncate">{form.title}</h2>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar size={16} className="mr-1" />
                        <span>Updated {formatDate(form.updatedAt)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <ClipboardList size={16} className="mr-1" />
                        <span>{form.steps.length} step{form.steps.length !== 1 ? 's' : ''}</span>
                        <span className="mx-2">•</span>
                        <span>{getSubmissionCount(form.id)} response{getSubmissionCount(form.id) !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <div className="px-6 py-3 bg-gray-50 border-t flex justify-between">
                      <div className="flex space-x-2">
                        <Link
                          to={`/builder/${form.id}`}
                          className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded"
                          title="Edit form"
                        >
                          <Edit size={18} />
                        </Link>
                        <Link
                          to={`/forms/${form.id}`}
                          className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded"
                          title="View form"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/responses/${form.id}`}
                          className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded"
                          title="View responses"
                        >
                          <ClipboardList size={18} />
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteForm(form.id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded"
                        title="Delete form"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;