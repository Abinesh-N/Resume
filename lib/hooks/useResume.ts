'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Resume, DEFAULT_RESUME, PersonalInfo, Section } from '@/lib/types/resume';

const STORAGE_KEY = 'resume-builder-resume';
const SAVE_DELAY = 3000; // Auto-save after 3 seconds of inactivity

export function useResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadResume = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setResume(parsed);
        } else {
          const newResume = {
            ...DEFAULT_RESUME,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setResume(newResume);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newResume));
        }
      } catch (error) {
        console.error('Failed to load resume:', error);
        const newResume = {
          ...DEFAULT_RESUME,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setResume(newResume);
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, []);

  // Save to localStorage and database whenever resume changes
  useEffect(() => {
    if (resume && !isLoading) {
      // Always save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));

      // Debounced save to database
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveToDB(resume).catch((error) => {
          console.error('Failed to save resume to database:', error);
        });
      }, SAVE_DELAY);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resume, isLoading]);

  const updateResume = useCallback((updates: Partial<Resume>) => {
    setResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    setResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const addSectionItem = useCallback((sectionId: string, item: any) => {
    setResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? { ...section, items: [...section.items, item] }
            : section
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const removeSectionItem = useCallback((sectionId: string, itemId: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.filter((item: any) => item.id !== itemId),
              }
            : section
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateSectionItem = useCallback(
    (sectionId: string, itemId: string, updates: any) => {
      setResume((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  items: section.items.map((item: any) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              : section
          ),
          updatedAt: new Date().toISOString(),
        };
      });
    },
    []
  );

  const resetResume = useCallback(() => {
    const newResume = {
      ...DEFAULT_RESUME,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setResume(newResume);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newResume));
  }, []);

  return {
    resume,
    isLoading,
    updateResume,
    updatePersonalInfo,
    updateSection,
    addSectionItem,
    removeSectionItem,
    updateSectionItem,
    resetResume,
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function saveToDB(resume: Resume): Promise<void> {
  try {
    const response = await fetch('/api/resumes/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save resume');
    }
  } catch (error) {
    console.error('Database save error:', error);
    // Silently fail - the resume is still saved in localStorage
  }
}
