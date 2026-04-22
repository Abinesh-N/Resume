'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { getProfile, updateProfile } from '@/lib/supabase/profiles';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserCard } from '@/components/dashboard/UserCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user?.id) return;

        const profileData = await getProfile(user.id);
        if (profileData) {
          setProfile(profileData);
          setFormData({
            fullName: profileData.full_name || '',
            email: profileData.email || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: formData.fullName,
      });

      setProfile({
        ...profile,
        full_name: formData.fullName,
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="profile">
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="profile">
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your account information
          </p>
        </div>

        {/* Profile Preview */}
        {profile && (
          <UserCard
            fullName={profile.full_name}
            email={profile.email}
            avatarUrl={profile.avatar_url}
          />
        )}

        {/* Edit Profile Form */}
        <Card className="p-6 border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Account Information
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                disabled
                className="bg-slate-100 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Contact support to change your email
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex gap-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({
                    fullName: profile.full_name || '',
                    email: profile.email || '',
                  })
                }
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Information */}
        <Card className="p-6 border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Account Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">
                Account Created
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {new Date(profile?.created_at || '').toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600 dark:text-slate-400">
                Last Updated
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {new Date(profile?.updated_at || '').toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </span>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-red-800 dark:text-red-200 mb-4">
            Deleting your account is permanent and cannot be undone. All your
            resumes and data will be lost.
          </p>
          <Button
            variant="outline"
            disabled
            className="border-red-300 text-red-600 dark:border-red-800 dark:text-red-400 cursor-not-allowed"
          >
            Delete Account (Coming Soon)
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
