'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit2, Trash2, FileText, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { deleteResumeAction } from '@/app/dashboard/actions';

interface ResumeListItem {
  id: string;
  title: string;
  updated_at: string;
}

interface ResumesListProps {
  resumes: ResumeListItem[];
  isLoading?: boolean;
  userId?: string;
  onCreateNew?: () => void;
}

export function ResumesList({
  resumes,
  isLoading = false,
  userId,
  onCreateNew,
}: ResumesListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const canDelete = Boolean(userId);
  const canCreateNew = Boolean(onCreateNew);

  const handleDelete = (resumeId: string) => {
    if (!userId) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteResumeAction(userId, resumeId);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded bg-slate-200 animate-pulse dark:bg-slate-700"
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Resumes
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} created
          </p>
        </div>
        {canCreateNew && (
          <Button
            onClick={onCreateNew}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        )}
      </div>

      {resumes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {resumes.map((resume) => (
                <tr
                  key={resume.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        {resume.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    Updated{' '}
                    {formatDistanceToNow(new Date(resume.updated_at), {
                      addSuffix: true,
                    })}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/editor?resumeId=${resume.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-300 dark:border-slate-600"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>

                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending}
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{resume.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex justify-end gap-3">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(resume.id)}
                              >
                                {isPending ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            No resumes yet. Create one to get started!
          </p>
          {canCreateNew && (
            <Button
              onClick={onCreateNew}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Resume
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
