import html2pdf from 'html2pdf.js';
import { Resume } from '@/lib/types/resume';

export async function exportResumeToPDF(resume: Resume, filename: string = 'resume.pdf') {
  try {
    // Wait a bit for the DOM to be fully rendered
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get the resume preview HTML element with enhanced selectors
    let element = document.getElementById('resume-preview-content');
    
    // If not found, try alternative selectors in order of preference
    if (!element) {
      element = document.querySelector('[data-resume-preview="true"]') as HTMLElement;
    }
    
    if (!element) {
      element = document.querySelector('.bg-white.shadow-2xl.rounded-lg') as HTMLElement;
    }
    
    if (!element) {
      element = document.querySelector('div[id*="resume"]') as HTMLElement;
    }
    
    if (!element) {
      element = document.querySelector('.relative.w-full.h-full') as HTMLElement;
    }
    
    if (!element) {
      // Create a detailed error message for debugging
      const allElements = document.querySelectorAll('[id*="resume"], [class*="resume"], [data-resume-preview]');
      const elementList = Array.from(allElements).map(el => ({
        id: el.id,
        className: el.className,
        tagName: el.tagName
      }));
      
      throw new Error(
        'Resume preview element not found. ' +
        `Available elements: ${allElements.length} found.\n` +
        `Elements found: ${JSON.stringify(elementList, null, 2)}\n` +
        'Please ensure the ResumePreview component is rendered with id="resume-preview-content"'
      );
    }

    // Clone the element to avoid modifying the original
    const cloneElement = element.cloneNode(true) as HTMLElement;
    
    // Enhanced cleanup for PDF export
    cloneElement.querySelectorAll('button, input, textarea, [role="button"], .absolute.pointer-events-none').forEach((el) => {
      el.remove();
    });
    
    // Remove any hover states, animations, or interactive elements
    cloneElement.querySelectorAll('[class*="hover:"], [class*="transition"], [class*="animate-"]').forEach((el) => {
      const element = el as HTMLElement;
      element.style.transition = 'none';
      element.style.animation = 'none';
    });
    
    // Ensure proper styling for PDF export
    cloneElement.style.transform = 'none';
    cloneElement.style.scale = '1';
    cloneElement.style.overflow = 'visible';
    cloneElement.style.width = '794px';
    cloneElement.style.height = '1123px';
    cloneElement.style.minHeight = '1123px';
    cloneElement.style.maxWidth = '794px';
    cloneElement.style.maxHeight = '1123px';
    cloneElement.style.boxShadow = 'none';
    cloneElement.style.borderRadius = '0';
    cloneElement.style.margin = '0';
    cloneElement.style.padding = '0';

    // Enhanced PDF options optimized for A4
    const options = {
      margin: [5, 5, 5, 5] as [number, number, number, number], // Reduced margins for better fit
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
        logging: false // Reduce console noise
      },
      jsPDF: { 
        orientation: 'portrait' as const, 
        unit: 'mm' as const, 
        format: 'a4' as const,
        compress: true,
        precision: 16
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.page-break-avoid'
      },
    };

    // Generate PDF with enhanced error handling
    console.log('Generating PDF with element:', {
      elementId: element.id,
      dimensions: { width: 794, height: 1123 },
      filename: filename
    });
    
    // Generate PDF without unsupported event listeners
    html2pdf().set(options).from(cloneElement).save();
    
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    
    // Enhanced error reporting with actionable steps
    if (error instanceof Error) {
      const enhancedError = new Error(
        `PDF Export Failed: ${error.message}\n\n` +
        `Troubleshooting steps:\n` +
        `1. Ensure the resume preview is fully loaded and visible\n` +
        `2. Check that the element with id="resume-preview-content" exists in the DOM\n` +
        `3. Try refreshing the page and exporting again\n` +
        `4. Check browser console for additional errors\n` +
        `5. Verify that html2pdf.js library is properly loaded\n` +
        `6. Try a different browser if the issue persists`
      );
      throw enhancedError;
    }
    
    throw error;
  }
}

export function generatePDFFilename(resumeTitle: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitized = resumeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${sanitized}-${timestamp}.pdf`;
}
