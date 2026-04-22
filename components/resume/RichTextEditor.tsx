'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-foreground">{label}</label>}
      <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as 'edit' | 'preview')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Enter text. Use markdown formatting:\n**bold**, *italic*, - bullet, 1. numbered'}
            className="min-h-32 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Supports markdown: **bold**, *italic*, - lists, [links](url)
          </p>
        </TabsContent>

        <TabsContent value="preview" className="space-y-2">
          <div className="min-h-32 p-3 bg-muted/30 border border-border rounded-md prose prose-sm max-w-none text-sm">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="space-y-2">
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">No content to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
