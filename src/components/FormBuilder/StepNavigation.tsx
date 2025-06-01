import React from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { createNewStep } from '../../utils/formUtils';

const StepNavigation: React.FC = () => {
  const { state, dispatch } = useFormBuilder();
  const { currentForm, currentStep } = state;
  
  if (!currentForm) return null;
  
  const steps = currentForm.steps;
  
  const handleAddStep = () => {
    dispatch({
      type: 'ADD_STEP',
      payload: createNewStep(`Step ${steps.length + 1}`)
    });
  };
  
  const handleDeleteStep = (stepId: string) => {
    if (steps.length <= 1) return;
    
    dispatch({
      type: 'REMOVE_STEP',
      payload: { stepId }
    });
  };
  
  const handleStepClick = (index: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: index });
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: currentStep - 1 });
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: currentStep + 1 });
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Form Steps</h3>
        <button
          type="button"
          onClick={handleAddStep}
          className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add Step
        </button>
      </div>
      
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex-1 flex items-center justify-center space-x-2 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => handleStepClick(index)}
                className={`
                  px-3 py-1 text-sm rounded-md whitespace-nowrap
                  ${currentStep === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
              >
                {step.title}
              </button>
              
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteStep(step.id)}
                  className="ml-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={handleNextStep}
          disabled={currentStep === steps.length - 1}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="h-1 bg-gray-200 rounded-full w-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepNavigation;