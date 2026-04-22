'use client';

import { Resume } from '@/lib/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ThemeCustomizerProps {
  theme: Resume['theme'];
  onUpdateTheme: (updates: Partial<Resume['theme']>) => void;
}

const PRESET_COLORS = [
  { name: 'Blue', primary: '#0066cc', accent: '#ff6b6b' },
  { name: 'Purple', primary: '#7c3aed', accent: '#ec4899' },
  { name: 'Green', primary: '#059669', accent: '#f59e0b' },
  { name: 'Red', primary: '#dc2626', accent: '#06b6d4' },
  { name: 'Slate', primary: '#475569', accent: '#8b5cf6' },
];

export function ThemeCustomizer({ theme, onUpdateTheme }: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4 border shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Theme Customization</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="gap-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {isOpen && (
          <div className="space-y-4 pt-2 border-t">
            {/* Preset colors */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Preset Colors</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_COLORS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onUpdateTheme({
                        primaryColor: preset.primary,
                        accentColor: preset.accent,
                      });
                    }}
                    className="justify-start gap-3"
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom colors */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Custom Colors</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-foreground">Primary Color</label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      value={theme.primaryColor}
                      onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                      className="flex-1"
                      placeholder="#0066cc"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Accent Color</label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      value={theme.accentColor}
                      onChange={(e) => onUpdateTheme({ accentColor: e.target.value })}
                      className="flex-1"
                      placeholder="#ff6b6b"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
