import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TEMPLATES } from '@/components/templates';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { DEFAULT_RESUME } from '@/lib/types/resume';

interface TemplatePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: TemplatePageProps) {
  const template = TEMPLATES.find(t => t.id === params.id);
  
  if (!template) {
    return {
      title: 'Template Not Found - Resume Builder',
      description: 'The requested template was not found',
    };
  }

  return {
    title: `${template.name} Template - Resume Builder`,
    description: `Preview and use the ${template.name} resume template. ${template.description}`,
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  // Check if user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const template = TEMPLATES.find(t => t.id === params.id);

  if (!template) {
    redirect('/dashboard/templates');
  }

  return (
    <DashboardLayout activeTab="templates">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {template.name} Template
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {template.description}
              </p>
            </div>
          </div>
          <Link href={`/editor?template=${template.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          </Link>
        </div>

        {/* Template Preview */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Template Preview
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                  Demo Content
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-4xl mx-auto">
              <ResumePreview resume={DEFAULT_RESUME} />
            </div>
          </div>
        </div>

        {/* Template Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Professional Layout
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Clean, organized structure that highlights your experience and skills effectively.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Easy Customization
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personalize colors, fonts, and layout to match your professional brand.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              ATS Friendly
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Optimized for applicant tracking systems to ensure your resume gets noticed.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
