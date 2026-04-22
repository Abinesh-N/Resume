'use client';

import { Resume } from '@/lib/types/resume';
import { TEMPLATES } from '@/components/templates';
import { DEFAULT_RESUME } from '@/lib/types/resume';
import { useEffect, useState, useRef, useCallback } from 'react';

interface TemplatePreviewProps {
  templateId: string;
  scale?: number;
  onLoad?: () => void;
}

export function TemplatePreview({ templateId, scale = 0.35, onLoad }: TemplatePreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const mountedRef = useRef(false);
  
  const template = TEMPLATES.find(t => t.id === templateId);

  useEffect(() => {
    mountedRef.current = true;
    setIsClient(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Reset states when template changes
    if (mountedRef.current) {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [templateId]);

  const handleLoad = useCallback(() => {
    if (mountedRef.current) {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (mountedRef.current) {
      setHasError(true);
      onLoad?.(); // Still call onLoad to hide loading state
    }
  }, [onLoad]);

  // Handle loading completion with useEffect to avoid hydration issues
  useEffect(() => {
    if (!isLoaded && !hasError && mountedRef.current) {
      const timer = setTimeout(() => {
        handleLoad();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasError, handleLoad]);

  if (!template) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Template not found: {templateId}</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = template.component;
  if (!TemplateComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Template component not found: {templateId}</p>
        </div>
      </div>
    );
  }

  // Don't render template on server to avoid hydration issues
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-slate-200 rounded animate-pulse mx-auto mb-2"></div>
            <p className="text-xs text-slate-400">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  // A4 dimensions
  const a4Width = 794;
  const a4Height = 1123;

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-red-200 dark:bg-red-800 rounded-lg mx-auto mb-2"></div>
          <p className="text-xs text-red-600 dark:text-red-400">Preview unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      {/* Scaled container for A4 template */}
      <div 
        className="bg-white shadow-lg border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: `${a4Width}px`,
          height: `${a4Height}px`,
          opacity: isLoaded ? 1 : 0.8,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {/* Template content container */}
        <div className="w-full h-full overflow-hidden bg-white">
          <div className="w-full h-full p-0 m-0">
            <TemplateComponent resume={DEFAULT_RESUME} />
          </div>
        </div>
        
        {/* Professional loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-lg z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
