import React, { createContext, useContext, useState, useEffect } from 'react';
import { Form, FormSubmission } from '../types';

interface SubmissionContextType {
  getSubmissions: (formId: string) => FormSubmission[];
  submitForm: (formId: string, data: Record<string, any>) => void;
  deleteSubmission: (submissionId: string) => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  // Load submissions from localStorage
  useEffect(() => {
    const storedSubmissions = localStorage.getItem('formBuilder.submissions');
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    }
  }, []);

  // Save submissions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('formBuilder.submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Get submissions for a specific form
  const getSubmissions = (formId: string): FormSubmission[] => {
    return submissions.filter(submission => submission.formId === formId);
  };

  // Submit form data
  const submitForm = (formId: string, data: Record<string, any>) => {
    const newSubmission: FormSubmission = {
      id: `submission_${Date.now()}`,
      formId,
      data,
      submittedAt: Date.now()
    };
    
    setSubmissions(prev => [...prev, newSubmission]);
  };

  // Delete a submission
  const deleteSubmission = (submissionId: string) => {
    setSubmissions(prev => prev.filter(submission => submission.id !== submissionId));
  };

  return (
    <SubmissionContext.Provider value={{ getSubmissions, submitForm, deleteSubmission }}>
      {children}
    </SubmissionContext.Provider>
  );
};

// Hook to use the submission context
export const useSubmissions = (): SubmissionContextType => {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionProvider');
  }
  return context;
};