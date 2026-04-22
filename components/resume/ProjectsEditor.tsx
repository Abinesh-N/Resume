'use client';

import { ProjectItem } from '@/lib/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from './RichTextEditor';
import { Trash2, Plus } from 'lucide-react';

interface ProjectsEditorProps {
  items: ProjectItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<ProjectItem>) => void;
  editingMode?: 'simple' | 'advanced';
}

export function ProjectsEditor({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  editingMode = 'simple',
}: ProjectsEditorProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-foreground">Project {index + 1}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Project Name</label>
            <Input
              value={item.name}
              onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
              placeholder="Project title"
              className="mt-1"
            />
          </div>

          <div>
            {editingMode === 'advanced' ? (
              <RichTextEditor
                value={item.description}
                onChange={(value) => onUpdateItem(item.id, { description: value })}
                placeholder="What did the project do? What problem did it solve?"
                label="Description"
              />
            ) : (
              <>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                  placeholder="What did the project do? What problem did it solve?"
                  className="mt-1 min-h-20"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Technologies</label>
              <Input
                value={item.technologies}
                onChange={(e) => onUpdateItem(item.id, { technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Project Link</label>
              <Input
                value={item.link || ''}
                onChange={(e) => onUpdateItem(item.id, { link: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={onAddItem}
        variant="outline"
        className="w-full mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}
