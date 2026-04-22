import { supabase } from './client';
import { Resume } from '@/lib/types/resume';

export async function saveResume(userId: string, resume: Resume) {
  const { data, error } = await supabase
    .from('resumes')
    .upsert(
      {
        id: resume.id,
        user_id: userId,
        title: resume.title,
        data: resume,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getResume(userId: string, resumeId: string) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .eq('id', resumeId)
    .single();

  if (error) throw error;
  return data?.data as Resume;
}

export async function getUserResumes(userId: string) {
  const { data, error } = await supabase
    .from('resumes')
    .select('id, title, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteResume(userId: string, resumeId: string) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('user_id', userId)
    .eq('id', resumeId);

  if (error) throw error;
}

export async function createNewResume(userId: string, title: string = 'My Resume') {
  const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newResume: Resume = {
    id: resumeId,
    title,
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      website: '',
      linkedin: '',
      github: '',
    },
    sections: [
      { id: 'experience', type: 'experience', title: 'Professional Experience', visible: true, order: 0, items: [] },
      { id: 'education', type: 'education', title: 'Education', visible: true, order: 1, items: [] },
      { id: 'skills', type: 'skills', title: 'Skills', visible: true, order: 2, items: [] },
      { id: 'projects', type: 'projects', title: 'Projects', visible: true, order: 3, items: [] },
    ],
    templateId: 'classic',
    theme: { primaryColor: '#0066cc', accentColor: '#ff6b6b', fontFamily: 'Inter' },
    editingMode: 'simple',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return await saveResume(userId, newResume);
}
