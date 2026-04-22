'use client';

import { ExperienceItem } from '@/lib/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from './RichTextEditor';
import { Trash2, Plus } from 'lucide-react';

interface ExperienceEditorProps {
  items: ExperienceItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<ExperienceItem>) => void;
  editingMode?: 'simple' | 'advanced';
}

export function ExperienceEditor({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  editingMode = 'simple',
}: ExperienceEditorProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-foreground">Position {index + 1}</h3>
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
              <label className="text-sm font-medium text-foreground">Company</label>
              <Input
                value={item.company}
                onChange={(e) => onUpdateItem(item.id, { company: e.target.value })}
                placeholder="Your Company"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Position</label>
              <Input
                value={item.position}
                onChange={(e) => onUpdateItem(item.id, { position: e.target.value })}
                placeholder="Job Title"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <Input
                type="month"
                value={item.startDate}
                onChange={(e) => onUpdateItem(item.id, { startDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">End Date</label>
              <Input
                type="month"
                value={item.endDate}
                onChange={(e) => onUpdateItem(item.id, { endDate: e.target.value })}
                disabled={item.currentlyWorking}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={item.currentlyWorking}
              onCheckedChange={(checked) =>
                onUpdateItem(item.id, {
                  currentlyWorking: checked as boolean,
                  endDate: checked ? '' : item.endDate,
                })
              }
              id={`currently-working-${item.id}`}
            />
            <label htmlFor={`currently-working-${item.id}`} className="text-sm cursor-pointer">
              I currently work here
            </label>
          </div>

          <div>
            {editingMode === 'advanced' ? (
              <RichTextEditor
                value={item.description}
                onChange={(value) => onUpdateItem(item.id, { description: value })}
                placeholder="Describe your responsibilities and achievements. Use markdown for formatting."
                label="Description"
              />
            ) : (
              <>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                  placeholder="Describe your responsibilities and achievements..."
                  className="mt-1 min-h-24"
                />
              </>
            )}
          </div>
        </div>
      ))}

      <Button
        onClick={onAddItem}
        variant="outline"
        className="w-full mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Position
      </Button>
    </div>
  );
}
