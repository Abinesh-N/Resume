import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { getUserResumes } from '@/lib/supabase/resumes';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ResumesList } from '@/components/dashboard/ResumesList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Resumes - Resume Builder',
  description: 'View and manage all your resumes',
};

export default async function MyResumesPage() {
  // Check if user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Fetch resumes
  const resumes = await getUserResumes(user.id);

  return (
    <DashboardLayout activeTab="resumes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Resumes
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage all your resumes in one place
            </p>
          </div>
          <Link href="/editor">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {/* Resumes List */}
        <ResumesList
          resumes={resumes || []}
          userId={user.id}
        />
      </div>
    </DashboardLayout>
  );
}
