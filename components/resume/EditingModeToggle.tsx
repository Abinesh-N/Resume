'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface EditingModeToggleProps {
  value: 'simple' | 'advanced';
  onChange: (mode: 'simple' | 'advanced') => void;
}

export function EditingModeToggle({ value, onChange }: EditingModeToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground">Editing Mode:</span>
      <ToggleGroup type="single" value={value} onValueChange={(v) => v && onChange(v as 'simple' | 'advanced')}>
        <ToggleGroupItem value="simple" aria-label="Simple mode">
          Simple
        </ToggleGroupItem>
        <ToggleGroupItem value="advanced" aria-label="Advanced mode with markdown">
          Advanced (Markdown)
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
