import { NextResponse } from 'next/server';
import { getUserResumes, createNewResume } from '@/lib/supabase/resumes';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumes = await getUserResumes(user.id);
    return NextResponse.json({ data: resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await createNewResume(user.id);
    return NextResponse.json({ success: true, data: resume });
  } catch (error) {
    console.error('Create resume error:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
