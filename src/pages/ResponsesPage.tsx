import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import { useSubmissions } from '../contexts/SubmissionContext';
import { Form, FormSubmission } from '../types';

const ResponsesPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { getAllForms } = useFormBuilder();
  const { getSubmissions, deleteSubmission } = useSubmissions();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (formId) {
      const formData = localStorage.getItem(`formBuilder.form.${formId}`);
      if (formData) {
        setForm(JSON.parse(formData));
        setSubmissions(getSubmissions(formId));
      } else {
        setNotFound(true);
      }
    }
  }, [formId]);

  const handleDeleteSubmission = (submissionId: string) => {
    if (confirm('Are you sure you want to delete this response?')) {
      deleteSubmission(submissionId);
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    }
  };

  const exportResponses = () => {
    if (!submissions.length || !form) return;
    
    // Convert submissions to CSV
    const allFields = form.steps.flatMap(step => step.fields);
    const headers = ['Submission ID', 'Submitted At', ...allFields.map(f => f.label)];
    
    const rows = submissions.map(submission => {
      const row = [
        submission.id,
        new Date(submission.submittedAt).toLocaleString(),
      ];
      
      allFields.forEach(field => {
        const value = submission.data[field.id];
        row.push(Array.isArray(value) ? value.join(', ') : String(value || ''));
      });
      
      return row;
    });
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${form.title} - Responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Forms
            </Link>
            <h1 className="text-2xl font-bold mt-2">{form.title} - Responses</h1>
          </div>
          
          {submissions.length > 0 && (
            <button
              type="button"
              onClick={exportResponses}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </button>
          )}
        </div>
        
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-2">No responses yet</h2>
            <p className="text-gray-500 mb-4">
              When users submit this form, their responses will appear here.
            </p>
            <Link
              to={`/forms/${form.id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Form
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    {form.steps.flatMap(step => step.fields).map(field => (
                      <th key={field.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {field.label}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map(submission => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </td>
                      {form.steps.flatMap(step => step.fields).map(field => (
                        <td key={field.id} className="px-6 py-4 text-sm text-gray-500">
                          {Array.isArray(submission.data[field.id]) 
                            ? submission.data[field.id].join(', ')
                            : submission.data[field.id] || '-'}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteSubmission(submission.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsesPage;