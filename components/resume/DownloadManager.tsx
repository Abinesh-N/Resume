'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';
import { exportResumeToPDF, generatePDFFilename } from '@/lib/utils/pdfExport';
import { Resume } from '@/lib/types/resume';

interface DownloadManagerProps {
  resume: Resume;
}

export function DownloadManager({ resume }: DownloadManagerProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    setError(null);
    setIsExporting(true);

    try {
      const filename = generatePDFFilename(resume.title);
      await exportResumeToPDF(resume, filename);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export PDF';
      setError(errorMessage);
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownloadPDF}
        disabled={isExporting}
        className="w-full"
      >
        {isExporting ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </>
        )}
      </Button>
      
      {error && (
        <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
