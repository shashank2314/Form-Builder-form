import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import Header from '../components/Header/Header';
import Toolbox from '../components/DragAndDrop/Toolbox';
import FieldDropArea from '../components/DragAndDrop/FieldDropArea';
import FieldProperties from '../components/FormBuilder/FieldProperties';
import FormProperties from '../components/FormBuilder/FormProperties';
import StepNavigation from '../components/FormBuilder/StepNavigation';
import FormPreview from '../components/Preview/FormPreview';

const BuilderPage: React.FC = () => {
  const { formId } = useParams<{ formId?: string }>();
  const navigate = useNavigate();
  const { state, loadForm, createForm } = useFormBuilder();
  const { currentForm, currentStep, selectedFieldId, isPreviewActive, previewMode } = state;

  useEffect(() => {
    if (formId) {
      loadForm(formId);
    } else {
      createForm();
    }
  }, [formId]);

  useEffect(() => {
    if (currentForm && !formId) {
      navigate(`/builder/${currentForm.id}`, { replace: true });
    }
  }, [currentForm, formId, navigate]);

  if (!currentForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const currentStepData = currentForm.steps[currentStep];
  const selectedField = currentStepData?.fields.find(field => field.id === selectedFieldId);

  return (
    <div className="min-h-screen  flex flex-col">
      <Header showFormControls={true} />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {isPreviewActive ? (
          <div className="flex flex-col items-center">
            <div className={`w-full ${
              previewMode === 'mobile' ? 'max-w-sm' :
              previewMode === 'tablet' ? 'max-w-2xl' :
              'max-w-4xl'
            }`}>
              <FormPreview 
                form={currentForm} 
                previewMode={previewMode} 
              />
            </div>
          </div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <StepNavigation />
            
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3">
                <Toolbox />
              </div>
              
              <div className="col-span-12 lg:col-span-6">
                <h2 className="text-xl font-semibold mb-4">{currentStepData.title}</h2>
                <FieldDropArea 
                  stepId={currentStepData.id} 
                  fields={currentStepData.fields} 
                />
              </div>
              
              <div className="col-span-12 lg:col-span-3">
                {selectedField ? (
                  <FieldProperties 
                    field={selectedField} 
                    stepId={currentStepData.id} 
                  />
                ) : (
                  <FormProperties />
                )}
              </div>
            </div>
          </DndProvider>
        )}
      </div>
    </div>
  );
};

export default BuilderPage;