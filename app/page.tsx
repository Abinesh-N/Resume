'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/editor');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Build Your Perfect Resume
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Create a professional resume in minutes with our intelligent resume builder. Choose from multiple templates and download as PDF.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Multiple Templates</h3>
            <p className="text-sm text-muted-foreground">
              Choose from professional templates designed by experts.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Real-time Preview</h3>
            <p className="text-sm text-muted-foreground">
              See your resume update instantly as you type.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">PDF Download</h3>
            <p className="text-sm text-muted-foreground">
              Export your resume as a PDF ready to send to employers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
