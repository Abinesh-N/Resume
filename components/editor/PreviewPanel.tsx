'use client';

import { useState, useCallback, useEffect } from 'react';
import { Resume } from '@/lib/types/resume';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Eye,
  RotateCw,
  Monitor,
  Smartphone
} from 'lucide-react';
import { exportResumeToPDF, generatePDFFilename } from '@/lib/utils/pdfExport';

interface PreviewPanelProps {
  resume: Resume;
  className?: string;
}

export function PreviewPanel({ resume, className = "" }: PreviewPanelProps) {
  const [scale, setScale] = useState(0.7);
  const [showGrid, setShowGrid] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const zoomLevels = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5];
  
  const handleZoomIn = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(scale);
    if (currentIndex < zoomLevels.length - 1) {
      setScale(zoomLevels[currentIndex + 1]);
    }
  }, [scale]);

  const handleZoomOut = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(scale);
    if (currentIndex > 0) {
      setScale(zoomLevels[currentIndex - 1]);
    }
  }, [scale]);

  const handleResetZoom = useCallback(() => {
    setScale(0.7);
  }, []);

  const handleFitToScreen = useCallback(() => {
    setScale(0.8);
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    try {
      const filename = generatePDFFilename(resume.title);
      await exportResumeToPDF(resume, filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  }, [resume]);

  // Add keyboard shortcuts for zoom controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleResetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleResetZoom]);

  return (
    <div className={`w-full h-full bg-slate-50 dark:bg-slate-950 flex flex-col ${className}`}>
      {/* Preview Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Live Preview
                </h3>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  Desktop
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </Button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoomLevels.indexOf(scale) === 0}
                  className="h-8 w-8 p-0"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoomLevels.indexOf(scale) === zoomLevels.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Reset
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFitToScreen}
                className="gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Fit
              </Button>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={showGrid ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''}
              >
                Grid
              </Button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span>A4 Size (794 × 1123px)</span>
              <span>Scale: {Math.round(scale * 100)}%</span>
              <span>Template: {resume.templateId}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live preview active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Grid Background (Optional) */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        )}

        {/* Preview Container */}
        <div className={`w-full h-full ${
          viewMode === 'mobile' ? 'max-w-md mx-auto' : ''
        }`}>
          <ResumePreview 
            resume={resume} 
            scale={viewMode === 'mobile' ? scale * 0.5 : scale} 
            showBackground={false}
            className="w-full h-full"
          />
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            onClick={handleDownloadPDF}
            className="shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            aria-label="Download resume as PDF"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span>Ready to export</span>
            <span>High quality PDF</span>
            <span>Print optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Tip:</span>
            <span>Use zoom controls for better visibility</span>
          </div>
        </div>
      </div>
    </div>
  );
}
