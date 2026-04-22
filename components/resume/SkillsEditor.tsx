'use client';

import { SkillItem } from '@/lib/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

interface SkillsEditorProps {
  items: SkillItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<SkillItem>) => void;
}

export function SkillsEditor({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: SkillsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-muted/30 border border-border rounded-lg p-3 flex items-center justify-between gap-2">
            <div className="flex-1">
              <Input
                value={item.name}
                onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                placeholder="Skill name (e.g., React, Python)"
                className="text-sm"
              />
              {item.category && (
                <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
              className="text-destructive hover:text-destructive/80 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={onAddItem}
        variant="outline"
        className="w-full mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Skill
      </Button>
    </div>
  );
}
