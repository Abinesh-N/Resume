'use client';

import { Resume } from '@/lib/types/resume';
import { TEMPLATES } from '@/components/templates';

interface ResumePreviewProps {
  resume: Resume;
  scale?: number;
  showBackground?: boolean;
  className?: string;
}

export function ResumePreview({ resume, scale = 0.8, showBackground = true, className = "" }: ResumePreviewProps) {
  // Enhanced template rendering with better error handling
  const renderTemplate = () => {
    if (!resume) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-slate-500">
            <p>No resume data available</p>
          </div>
        </div>
      );
    }

    // Find the template with better error handling
    const template = TEMPLATES.find((t) => t.id === resume.templateId);
    
    if (!template) {
      console.warn(`Template not found: ${resume.templateId}, falling back to first available template`);
      const defaultTemplate = TEMPLATES[0];
      if (!defaultTemplate || !defaultTemplate.component) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p>No templates available</p>
              <p className="text-sm mt-2">Please check template configuration</p>
            </div>
          </div>
        );
      }
      const DefaultComponent = defaultTemplate.component;
      return <DefaultComponent resume={resume} />;
    }
    
    const TemplateComponent = template.component;
    if (!TemplateComponent) {
      console.error(`Template component not found for: ${template.id}`);
      const defaultTemplate = TEMPLATES[0];
      if (defaultTemplate && defaultTemplate.component) {
        const DefaultComponent = defaultTemplate.component;
        return <DefaultComponent resume={resume} />;
      }
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">
            <p>Template component error</p>
            <p className="text-sm mt-2">Template: {template.name}</p>
          </div>
        </div>
      );
    }
    
    try {
      return <TemplateComponent resume={resume} />;
    } catch (error) {
      console.error(`Error rendering template ${template.id}:`, error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">
            <p>Template rendering error</p>
            <p className="text-sm mt-2">Template: {template.name}</p>
            <p className="text-xs mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      );
    }
  };

  // A4 dimensions at 96 DPI (8.27 × 11.69 inches)
  const a4Width = 794;
  const a4Height = 1123;

  // Calculate scaled dimensions for proper container sizing
  const scaledWidth = a4Width * scale;
  const scaledHeight = a4Height * scale;

  return (
    <div className={`w-full h-full ${showBackground ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800' : 'bg-slate-50 dark:bg-slate-950'} ${className}`}>
      {/* Main container with proper overflow handling */}
      <div className="w-full h-full overflow-auto">
        {/* Center container with proper padding */}
        <div className="flex justify-center items-start min-h-full p-4 lg:p-6">
          {/* Scaled container - maintains A4 aspect ratio */}
          <div 
            className="relative flex-shrink-0"
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top center',
              width: `${a4Width}px`,
              height: `${a4Height}px`,
              marginBottom: `${Math.max(0, scaledHeight - 100)}px` // Prevent container collapse
            }}
          >
            {/* A4 Paper Container - CRITICAL: This is the element PDF export will target */}
            <div 
              id="resume-preview-content"
              data-resume-preview="true"
              className="bg-white shadow-2xl rounded-lg overflow-hidden relative"
              style={{ 
                width: `${a4Width}px`,
                height: `${a4Height}px`
              }}
            >
              {/* Subtle paper texture overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/30 pointer-events-none opacity-50"></div>
              
              {/* Resume Content Container */}
              <div className="relative w-full h-full overflow-hidden">
                {renderTemplate()}
              </div>
              
              {/* Print-specific styling */}
              <style jsx>{`
                @media print {
                  #resume-preview-content {
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 794px !important;
                    height: 1123px !important;
                    overflow: visible !important;
                  }
                }
              `}</style>
            </div>
            
            {/* Decorative corner effect for visual appeal */}
            {showBackground && (
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 transform rotate-45 origin-bottom-left shadow-lg pointer-events-none"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
