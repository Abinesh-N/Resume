'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export function DashboardLayout({
  children,
  activeTab = 'dashboard',
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl py-8 px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
