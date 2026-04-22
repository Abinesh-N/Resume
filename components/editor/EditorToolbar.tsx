'use client';

import { useState } from 'react';
import { Resume } from '@/lib/types/resume';
import { TEMPLATES } from '@/components/templates';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  RotateCcw, 
  Save, 
  Eye, 
  Moon, 
  Sun,
  Settings,
  FileText,
  Palette
} from 'lucide-react';
import { DownloadManager } from '@/components/resume/DownloadManager';
import { EditingModeToggle } from '@/components/resume/EditingModeToggle';

interface EditorToolbarProps {
  resume: Resume;
  onReset: () => void;
  onUpdateResume: (updates: Partial<Resume>) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  lastSaved?: Date;
  isSaving?: boolean;
}

export function EditorToolbar({ 
  resume, 
  onReset, 
  onUpdateResume, 
  isDarkMode = false,
  onToggleTheme,
  lastSaved,
  isSaving = false
}: EditorToolbarProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const currentTemplate = TEMPLATES.find(t => t.id === resume.templateId);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      {/* Main Toolbar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - App Brand & Template */}
          <div className="flex items-center gap-6">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Resume Builder
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Professional Resume Editor
                </p>
              </div>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                <Select 
                  value={resume.templateId} 
                  onValueChange={(value) => onUpdateResume({ templateId: value })}
                >
                  <SelectTrigger className="w-64 border-0 bg-transparent">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-slate-500" />
                      <SelectValue placeholder="Choose template" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-3 py-2">
                          <div className={`w-3 h-3 rounded-full ${
                            template.id.includes('premium') 
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                              : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-slate-500">{template.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {onToggleTheme && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleTheme}
                className="border-slate-200 dark:border-slate-700"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Editing Mode Toggle */}
            <EditingModeToggle 
              value={resume.editingMode} 
              onChange={(mode) => onUpdateResume({ editingMode: mode })} 
            />

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            {/* Download PDF */}
            <DownloadManager resume={resume} />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {/* Current Template Info */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                currentTemplate?.id.includes('premium') 
                  ? 'bg-amber-500' 
                  : 'bg-blue-500'
              }`}></div>
              <span className="text-slate-600 dark:text-slate-400">
                Template: <span className="font-medium text-slate-900 dark:text-white">
                  {currentTemplate?.name || 'Classic'}
                </span>
              </span>
            </div>

            {/* Editing Mode */}
            <div className="flex items-center gap-2">
              <Settings className="w-3 h-3 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Mode: <span className="font-medium text-slate-900 dark:text-white capitalize">
                  {resume.editingMode}
                </span>
              </span>
            </div>

            {/* Sections Count */}
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3 text-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Sections: <span className="font-medium text-slate-900 dark:text-white">
                  {resume.sections.length}
                </span>
              </span>
            </div>
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-2">
            {isSaving ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-600 dark:text-yellow-400">Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-slate-500">Not saved</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
