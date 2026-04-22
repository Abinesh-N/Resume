'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Mail, User } from 'lucide-react';

interface UserCardProps {
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
}

export function UserCard({ fullName, email, avatarUrl }: UserCardProps) {
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : email.charAt(0).toUpperCase();

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={avatarUrl || undefined} alt={fullName || email} />
          <AvatarFallback className="bg-blue-500 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {fullName || 'Welcome'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <p className="text-slate-600 dark:text-slate-400">{email}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
