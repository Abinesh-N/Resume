'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useResume } from '@/lib/hooks/useResume';
import { TEMPLATES } from '@/components/templates';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { ResponsiveLayout } from '@/components/editor/ResponsiveLayout';
import { ExperienceItem, EducationItem, SkillItem, ProjectItem } from '@/lib/types/resume';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    resume,
    isLoading,
    updateResume,
    updatePersonalInfo,
    updateSection,
    addSectionItem,
    removeSectionItem,
    updateSectionItem,
    resetResume,
  } = useResume();

  // Handle template selection from URL
  useEffect(() => {
    if (templateId && resume && resume.templateId !== templateId && TEMPLATES) {
      // Validate template exists
      const template = TEMPLATES.find(t => t.id === templateId);
      if (template) {
        console.log(`Applying template: ${template.name} (${templateId})`);
        updateResume({ templateId });
      } else {
        console.warn(`Template not found: ${templateId}`);
      }
    }
  }, [templateId, resume, updateResume, searchParams]);

  if (isLoading || !resume) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading resume editor...</p>
        </div>
      </div>
    );
  }

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddSectionItem = (sectionId: string) => {
    const section = resume.sections.find((s) => s.id === sectionId);
    if (!section) return;

    let newItem: ExperienceItem | EducationItem | SkillItem | ProjectItem;

    switch (section.type) {
      case 'experience':
        newItem = {
          id: generateId(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: '',
        } as ExperienceItem;
        break;
      case 'education':
        newItem = {
          id: generateId(),
          school: '',
          degree: '',
          field: '',
          graduationDate: '',
          gpa: '',
        } as EducationItem;
        break;
      case 'skills':
        newItem = {
          id: generateId(),
          name: '',
          category: '',
        } as SkillItem;
        break;
      case 'projects':
        newItem = {
          id: generateId(),
          name: '',
          description: '',
          technologies: '',
          link: '',
        } as ProjectItem;
        break;
      default:
        return; // Exit if section type is not recognized
    }

    addSectionItem(sectionId, newItem);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would update the document class or theme context
  };

  return (
    <div className={`h-screen flex flex-col bg-slate-50 dark:bg-slate-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* Modern Toolbar */}
      <EditorToolbar
        resume={resume}
        onReset={resetResume}
        onUpdateResume={updateResume}
        isDarkMode={isDarkMode}
        onToggleTheme={handleThemeToggle}
        lastSaved={lastSaved}
        isSaving={isSaving}
      />

      {/* Responsive Main Editor Layout */}
      <ResponsiveLayout>
        {/* Left: Editor Sidebar (40% on desktop, full on mobile/tablet) */}
        <div key="editor-sidebar" className="lg:w-2/5 w-full lg:border-r border-slate-200 dark:border-slate-700 lg:flex-shrink-0">
          <EditorSidebar
            resume={resume}
            onUpdatePersonalInfo={updatePersonalInfo}
            onUpdateSection={updateSection}
            onAddSectionItem={handleAddSectionItem}
            onRemoveSectionItem={removeSectionItem}
            onUpdateSectionItem={updateSectionItem}
            editingMode={resume.editingMode}
            onUpdateTheme={(theme) => updateResume({ theme: { ...resume.theme, ...theme } })}
          />
        </div>

        {/* Right: Preview Panel (60% on desktop, full on mobile/tablet) */}
        <div key="preview-panel" className="lg:w-3/5 w-full lg:flex-shrink-0 lg:border-t-0 border-t border-slate-200 dark:border-slate-700">
          <PreviewPanel resume={resume} />
        </div>
      </ResponsiveLayout>
    </div>
  );
}
