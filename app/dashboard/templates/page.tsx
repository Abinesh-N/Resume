'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TemplateCard } from '@/components/dashboard/TemplateCard';
import { TEMPLATES } from '@/components/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid, List, ArrowRight } from 'lucide-react';


// Template categories
const TEMPLATE_CATEGORIES = {
  all: { name: 'All Templates', color: 'blue' },
  professional: { name: 'Professional', color: 'slate' },
  creative: { name: 'Creative', color: 'purple' },
  modern: { name: 'Modern', color: 'cyan' },
  premium: { name: 'Premium', color: 'amber' }
} as const;

type CategoryKey = keyof typeof TEMPLATE_CATEGORIES;

// Template categorization logic
function categorizeTemplate(templateId: string): CategoryKey[] {
  const categories: CategoryKey[] = ['all'];
  
  if (templateId.includes('premium')) {
    categories.push('premium');
  }
  
  if (['classic', 'minimal', 'executive', 'editorial'].includes(templateId)) {
    categories.push('professional');
  }
  
  if (['creative', 'premium-creative', 'modern', 'minimal'].includes(templateId)) {
    categories.push('creative');
  }
  
  if (['modern', 'minimal', 'template-06', 'template-07', 'template-08', 'template-09', 'template-10'].includes(templateId)) {
    categories.push('modern');
  }
  
  return categories;
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(template => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const templateCategories = categorizeTemplate(template.id);
      const matchesCategory = activeCategory === 'all' || templateCategories.includes(activeCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <DashboardLayout activeTab="templates">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Professional Resume Templates
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Choose from our carefully curated collection of ATS-friendly templates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {filteredTemplates.length} Available
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost' }
              size="sm"
              onClick={() => setViewMode('grid') }
              className="h-9 w-9 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost' }
              size="sm"
              onClick={() => setViewMode('list') }
              className="h-9 w-9 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => {
            const isActive = activeCategory === key;
            const colorClass = {
              blue: isActive ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              slate: isActive ? 'bg-slate-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              purple: isActive ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              cyan: isActive ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              amber: isActive ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }[category.color];

            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key as CategoryKey)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${colorClass} hover:shadow-md`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Templates Grid/List */}
        {filteredTemplates.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          }>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                id={template.id}
                name={template.name}
                description={template.description}
                isNew={['template-06', 'template-07', 'template-08', 'template-09', 'template-10'].includes(template.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No templates found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              variant="outline"
              className="border-slate-300 dark:border-slate-600"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <span className="text-xl">Tips for Choosing a Template</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Classic Templates</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Best for traditional industries like finance, law, and healthcare
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Modern Templates</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Great for tech, marketing, and creative professional roles
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Premium Templates</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Advanced designs with unique layouts and premium features
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <span>Can't find what you're looking for?</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
