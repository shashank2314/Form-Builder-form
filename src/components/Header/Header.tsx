import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Save, 
  FileText, 
  Plus, 
  Share2, 
  Undo2, 
  Redo2, 
  Moon, 
  Sun,
  LayoutTemplate
} from 'lucide-react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { useTheme } from '../../contexts/ThemeContext';
import PreviewControls from '../Preview/PreviewControls';

interface HeaderProps {
  showFormControls?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showFormControls = false }) => {
  const { state, dispatch, saveForm, createForm, publishForm } = useFormBuilder();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleCreateForm = () => {
    createForm();
    navigate('/builder');
  };

  const handleSaveForm = () => {
    saveForm();
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const handleShareForm = () => {
    publishForm();
    
    const formId = state.currentForm?.id;
    if (formId) {
      // Create shareable link
      const shareUrl = `${window.location.origin}/forms/${formId}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Form link copied to clipboard!');
      });
    }
  };
  
  const handleTemplates = () => {
    navigate('/templates');
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <header className="bg-[var(--bg-color)] border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <FileText className="h-6 w-6 text-blue-500 mr-2" />
            <span className="font-bold text-xl">FormBuilder</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          {showFormControls && (
            <>
              <PreviewControls />
              
              <div className="border-l mx-2 h-6" />
              
              <button
                type="button"
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:pointer-events-none"
                title="Undo"
              >
                <Undo2 size={18} />
              </button>
              
              <button
                type="button"
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:pointer-events-none"
                title="Redo"
              >
                <Redo2 size={18} />
              </button>
              
              <div className="border-l mx-2 h-6" />
              
              <button
                type="button"
                onClick={handleSaveForm}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                title="Save form"
              >
                <Save size={18} />
              </button>
              
              <button
                type="button"
                onClick={handleShareForm}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                title="Share form"
              >
                <Share2 size={18} />
              </button>
              
              <button
                type="button"
                onClick={handleTemplates}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                title="Templates"
              >
                <LayoutTemplate size={18} />
              </button>
            </>
          )}
          
          <button
            type="button"
            onClick={handleCreateForm}
            className="ml-2 flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            New Form
          </button>
          
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md ml-2"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;