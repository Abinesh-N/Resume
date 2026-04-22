'use client';

import { EducationItem } from '@/lib/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

interface EducationEditorProps {
  items: EducationItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<EducationItem>) => void;
}

export function EducationEditor({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: EducationEditorProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-foreground">Education {index + 1}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">School/University</label>
              <Input
                value={item.school}
                onChange={(e) => onUpdateItem(item.id, { school: e.target.value })}
                placeholder="University Name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Degree</label>
              <Input
                value={item.degree}
                onChange={(e) => onUpdateItem(item.id, { degree: e.target.value })}
                placeholder="Bachelor's, Master's, etc."
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Field of Study</label>
              <Input
                value={item.field}
                onChange={(e) => onUpdateItem(item.id, { field: e.target.value })}
                placeholder="Computer Science"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Graduation Date</label>
              <Input
                type="month"
                value={item.graduationDate}
                onChange={(e) => onUpdateItem(item.id, { graduationDate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">GPA (Optional)</label>
            <Input
              value={item.gpa || ''}
              onChange={(e) => onUpdateItem(item.id, { gpa: e.target.value })}
              placeholder="3.8"
              className="mt-1"
            />
          </div>
        </div>
      ))}

      <Button
        onClick={onAddItem}
        variant="outline"
        className="w-full mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
