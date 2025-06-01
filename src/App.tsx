import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormBuilderProvider } from './contexts/FormBuilderContext';
import { SubmissionProvider } from './contexts/SubmissionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import FormPage from './pages/FormPage';
import ResponsesPage from './pages/ResponsesPage';
import TemplatesPage from './pages/TemplatesPage';

function App() {
  return (
    <ThemeProvider>
      <FormBuilderProvider>
        <SubmissionProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/builder/:formId" element={<BuilderPage />} />
              <Route path="/forms/:formId" element={<FormPage />} />
              <Route path="/responses/:formId" element={<ResponsesPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
            </Routes>
          </Router>
        </SubmissionProvider>
      </FormBuilderProvider>
    </ThemeProvider>
  );
}

export default App;