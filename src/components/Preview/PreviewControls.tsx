import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';

const PreviewControls: React.FC = () => {
  const { state, dispatch } = useFormBuilder();
  const { previewMode, isPreviewActive } = state;

  const setPreviewMode = (mode: 'desktop' | 'tablet' | 'mobile') => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: mode });
  };

  const togglePreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={togglePreview}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          isPreviewActive
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {isPreviewActive ? 'Exit Preview' : 'Preview Form'}
      </button>
      
      {isPreviewActive && (
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 ${
              previewMode === 'desktop'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
            title="Desktop view"
          >
            <Monitor size={18} />
          </button>
          
          <button
            type="button"
            onClick={() => setPreviewMode('tablet')}
            className={`p-1.5 ${
              previewMode === 'tablet'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
            title="Tablet view"
          >
            <Tablet size={18} />
          </button>
          
          <button
            type="button"
            onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 ${
              previewMode === 'mobile'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
            title="Mobile view"
          >
            <Smartphone size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PreviewControls;