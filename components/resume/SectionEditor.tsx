'use client';

import { Section, SectionType } from '@/lib/types/resume';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { Eye, EyeOff } from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onUpdateSection: (updates: Partial<Section>) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: any) => void;
  editingMode?: 'simple' | 'advanced';
}

export function SectionEditor({
  section,
  onUpdateSection,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  editingMode = 'simple',
}: SectionEditorProps) {
  const renderEditor = () => {
    switch (section.type) {
      case 'experience':
        return (
          <ExperienceEditor
            items={section.items as any}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            editingMode={editingMode}
          />
        );
      case 'education':
        return (
          <EducationEditor
            items={section.items as any}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
          />
        );
      case 'skills':
        return (
          <SkillsEditor
            items={section.items as any}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
          />
        );
      case 'projects':
        return (
          <ProjectsEditor
            items={section.items as any}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            editingMode={editingMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 space-y-4 border shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateSection({ visible: !section.visible })}
          className="text-muted-foreground hover:text-foreground"
          title={section.visible ? 'Hide this section' : 'Show this section'}
        >
          {section.visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      </div>

      {!section.visible && (
        <div className="bg-muted/50 p-3 rounded text-sm text-muted-foreground italic">
          This section is hidden in the resume preview
        </div>
      )}

      {section.visible && <div className="pt-2">{renderEditor()}</div>}
    </Card>
  );
}
