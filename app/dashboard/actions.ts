'use server';

import { deleteResume, createNewResume } from '@/lib/supabase/resumes';
import { updateProfile } from '@/lib/supabase/profiles';
import { revalidatePath } from 'next/cache';

/**
 * Server action to delete a resume
 * Revalidates the dashboard and my-resumes pages
 */
export async function deleteResumeAction(userId: string, resumeId: string) {
  try {
    await deleteResume(userId, resumeId);
    
    // Revalidate related pages
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/resumes');
    
    return { success: true, message: 'Resume deleted successfully' };
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw new Error('Failed to delete resume');
  }
}

/**
 * Server action to create a new resume
 * Revalidates dashboard pages
 */
export async function createResumeAction(userId: string, title: string = 'My Resume') {
  try {
    const newResume = await createNewResume(userId, title);
    
    // Revalidate related pages
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/resumes');
    
    return { 
      success: true, 
      resumeId: newResume.id,
      message: 'Resume created successfully' 
    };
  } catch (error) {
    console.error('Error creating resume:', error);
    throw new Error('Failed to create resume');
  }
}

/**
 * Server action to update user profile
 * Revalidates dashboard pages
 */
export async function updateProfileAction(
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
) {
  try {
    const updatedProfile = await updateProfile(userId, updates);
    
    // Revalidate related pages
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    
    return { 
      success: true, 
      profile: updatedProfile,
      message: 'Profile updated successfully' 
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
}
