'use client';

import { useState, useCallback } from 'react';
import { Resume, Section, PersonalInfo, Theme, ExperienceItem, EducationItem, SkillItem, ProjectItem } from '@/lib/types/resume';
import { PersonalInfoForm } from '@/components/resume/PersonalInfoForm';
import { SectionEditor } from '@/components/resume/SectionEditor';
import { ThemeCustomizer } from '@/components/resume/ThemeCustomizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderKanban, 
  Plus,
  ChevronDown,
  ChevronUp,
  Settings,
  Palette
} from 'lucide-react';

interface EditorSidebarProps {
  resume: Resume;
  onUpdatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  onAddSectionItem: (sectionId: string) => void;
  onRemoveSectionItem: (sectionId: string, itemId: string) => void;
  onUpdateSectionItem: (sectionId: string, itemId: string, updates: Partial<ExperienceItem | EducationItem | SkillItem | ProjectItem>) => void;
  editingMode: 'simple' | 'advanced';
  onUpdateTheme: (theme: Partial<Theme>) => void;
}

interface SectionConfig {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  type: string;
}

const sectionConfigs: SectionConfig[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: User,
    description: 'Name, contact details, and summary',
    type: 'personal'
  },
  {
    id: 'experience',
    title: 'Work Experience',
    icon: Briefcase,
    description: 'Professional work history',
    type: 'experience'
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    description: 'Academic background and qualifications',
    type: 'education'
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: Code,
    description: 'Technical and soft skills',
    type: 'skills'
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: FolderKanban,
    description: 'Personal and professional projects',
    type: 'projects'
  }
];

export function EditorSidebar({
  resume,
  onUpdatePersonalInfo,
  onUpdateSection,
  onAddSectionItem,
  onRemoveSectionItem,
  onUpdateSectionItem,
  editingMode,
  onUpdateTheme
}: EditorSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']));
  const [activeSection, setActiveSection] = useState<string>('personal');

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionIcon = useCallback((sectionType: string) => {
    const config = sectionConfigs.find(c => c.type === sectionType);
    return config?.icon || Settings;
  }, []);

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Resume Editor
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Build your professional resume
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Auto-save on</span>
          </div>
        </div>

        {/* Personal Information Section */}
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('personal')}
                className="h-8 w-8 p-0"
                aria-label={expandedSections.has('personal') ? 'Collapse personal information section' : 'Expand personal information section'}
              >
                {expandedSections.has('personal') ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.has('personal') && (
            <CardContent className="pt-0">
              <PersonalInfoForm data={resume.personalInfo} onChange={onUpdatePersonalInfo} />
            </CardContent>
          )}
        </Card>

        {/* Resume Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Resume Sections
            </h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Section
            </Button>
          </div>

          {resume.sections.map((section) => {
            const Icon = getSectionIcon(section.type);
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <Card 
                key={section.id} 
                className={`border-slate-200 dark:border-slate-700 shadow-sm transition-all ${
                  activeSection === section.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{section.title}</CardTitle>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {section.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(section.id)}
                        className="h-8 w-8 p-0"
                        aria-label={`Edit ${section.title} section settings`}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(section.id)}
                        className="h-8 w-8 p-0"
                        aria-label={isExpanded ? `Collapse ${section.title} section` : `Expand ${section.title} section`}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <SectionEditor
                      section={section}
                      onUpdateSection={(updates) => onUpdateSection(section.id, updates)}
                      onAddItem={() => onAddSectionItem(section.id)}
                      onRemoveItem={(itemId) => onRemoveSectionItem(section.id, itemId)}
                      onUpdateItem={(itemId, updates) => onUpdateSectionItem(section.id, itemId, updates)}
                      editingMode={editingMode}
                    />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Theme Customizer */}
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme & Style
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('theme')}
                className="h-8 w-8 p-0"
              >
                {expandedSections.has('theme') ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.has('theme') && (
            <CardContent className="pt-0">
              <ThemeCustomizer 
                theme={resume.theme}
                onUpdateTheme={onUpdateTheme}
              />
            </CardContent>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
