import { NextRequest, NextResponse } from 'next/server';
import { saveResume } from '@/lib/supabase/resumes';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();
    
    // If not authenticated, just return success (data is saved in localStorage)
    if (!user) {
      return NextResponse.json({ success: true, message: 'Resume saved locally' });
    }

    const resume = await request.json();

    // Save resume to database
    const saved = await saveResume(user.id, resume);

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('Save resume error:', error);
    // Return success anyway since data is saved in localStorage
    return NextResponse.json({ success: true, message: 'Resume saved locally' });
  }
}
