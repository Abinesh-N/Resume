import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabase/profiles';
import { getUserResumes } from '@/lib/supabase/resumes';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserCard } from '@/components/dashboard/UserCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TemplateCard } from '@/components/dashboard/TemplateCard';
import { ResumesList } from '@/components/dashboard/ResumesList';
import { TEMPLATES } from '@/components/templates';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Dashboard - Resume Builder',
  description: 'Manage your resumes and templates',
};

export default async function DashboardPage() {
  // Check if user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    // Fetch user profile and resumes
    const profile = await getProfile(user.id);
    const resumes = await getUserResumes(user.id);

    // Get the latest resume info
    const latestResume = resumes?.[0];
    const latestUpdated = latestResume
      ? new Date(latestResume.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Never';

    return (
      <DashboardLayout activeTab="dashboard">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your resumes and explore templates
            </p>
          </div>

          {/* User Info Card */}
          <UserCard
            fullName={profile?.full_name}
            email={user.email || ''}
            avatarUrl={profile?.avatar_url}
          />

          {/* Stats Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Your Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                icon="file-text"
                title="Total Resumes"
                value={resumes?.length || 0}
                description="Resumes created"
                variant="default"
              />
              <StatsCard
                icon="clock"
                title="Last Updated"
                value={latestUpdated}
                description={latestResume?.title || 'No resumes yet'}
                variant="info"
              />
              <StatsCard
                icon="palette"
                title="Active Template"
                value="Classic"
                description="Most used template"
                variant="success"
              />
            </div>
          </div>

          {/* Resume Templates Section */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                  Start with a Professional Template
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                  Choose from our handpicked collection of ATS-friendly templates used by millions of job seekers worldwide
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {TEMPLATES.length}+ Templates
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Templates Grid - Show only 8 */}
            <div className="relative">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-purple-950/20 rounded-3xl"></div>
              
              {/* Templates Container */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                {TEMPLATES.slice(0, 8).map((template, index) => (
                  <div key={template.id} className="group">
                    <TemplateCard
                      id={template.id}
                      name={template.name}
                      description={template.description}
                      isNew={['template-06', 'template-07', 'template-08', 'template-09', 'template-10'].includes(template.id)}
                      isFeatured={index < 4} // First 4 are featured
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* View All Templates Button */}
            <div className="text-center pt-4">
              <Link 
                href="/dashboard/templates"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] text-lg"
              >
                <span>View All {TEMPLATES.length} Templates</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                Explore our complete collection with professional, creative, and premium designs
              </p>
            </div>
          </div>

          {/* Recent Resumes Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Your Resumes
            </h2>
            <ResumesList resumes={resumes || []} />
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    throw error;
  }
}
