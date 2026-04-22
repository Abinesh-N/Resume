'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-background">
        {children}
      </div>
    </ProtectedRoute>
  );
}
