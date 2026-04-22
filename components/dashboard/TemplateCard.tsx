'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, Sparkles, Loader2, ArrowUpRight, FileEdit } from 'lucide-react';
import { TEMPLATES } from '@/components/templates';
import { TemplatePreview } from './TemplatePreview';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export function TemplateCard({
  id,
  name,
  description,
  isNew = false,
  isFeatured = false,
}: TemplateCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    if (mountedRef.current) {
      setIsImageLoading(false);
    }
  }, []);

  const template = TEMPLATES.find(t => t.id === id);

  const router = useRouter();

  if (!template) {
    return null;
  }

  // Simplified logic for badges to avoid clutter
  const isPremium = template.id.includes('premium');
  const isPopular = ['classic', 'modern', 'minimal'].includes(template.id);

  const handleClick = () => {
    router.push(`/dashboard/templates/${id}`);
  };

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/editor?template=${id}`);
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Preview Area - Aspect ratio mimics a document */}
      <div className="relative w-full aspect-[3/4] bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* Loading State */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-100 dark:bg-slate-900">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        )}
          
          {/* Template Preview */}
          <div className="w-full h-full flex items-center justify-center p-3 transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-lg shadow-sm overflow-hidden bg-white relative border border-slate-100">
              <TemplatePreview 
                templateId={id} 
                scale={0.32} 
                onLoad={handleImageLoad}
              />
            </div>
          </div>

        {/* Minimal Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isFeatured && (
            <Badge className="bg-blue-600 text-white border-0 text-[10px] font-medium shadow-sm px-2 py-0.5 flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-current" /> Featured
            </Badge>
          )}
          {isPremium && (
            <Badge className="bg-amber-500 text-white border-0 text-[10px] font-medium shadow-sm px-2 py-0.5 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Premium
            </Badge>
          )}
          {isNew && !isPremium && (
            <Badge className="bg-emerald-500 text-white border-0 text-[10px] font-medium shadow-sm px-2 py-0.5">
              NEW
            </Badge>
          )}
        </div>

        {/* Hover Overlay with Action */}
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 flex items-center justify-center ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            size="sm"
            className="bg-white text-slate-900 hover:bg-slate-100 font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 rounded-full px-6"
          >
            Preview <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Info Area - Clean and Simple */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
          {name}
        </h3>
        <Button
          onClick={handleUseTemplate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          size="sm"
        >
          <FileEdit className="w-4 h-4 mr-2" />
          Use Template
        </Button>
      </div>
    </Card>
  );
}