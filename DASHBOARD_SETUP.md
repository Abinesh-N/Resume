# Dashboard Setup & Best Practices Guide

## 🚀 Quick Start

### Step 1: Database Setup
Ensure your Supabase database has the required tables. Run the migration:

```bash
# Already configured in scripts/01_init_schema.sql
# Includes: profiles, resumes, resumes_metadata tables with RLS policies
```

### Step 2: Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Test the Dashboard
1. Sign up at `/auth/signup`
2. You'll be redirected to `/auth/login`
3. Log in (you'll be redirected to `/dashboard`)
4. Explore the dashboard

### Step 4: Update Avatar Storage (Optional)
To enable avatar uploads, create a storage bucket in Supabase:

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Set RLS policy for avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 📋 Feature Checklist

### Dashboard Main Page ✅
- [x] User welcome section
- [x] User info card with avatar support
- [x] Statistics cards (total resumes, last updated, active template)
- [x] Resume templates grid
- [x] Recent resumes list

### My Resumes Page ✅
- [x] List all resumes
- [x] Show last updated date
- [x] Edit button
- [x] Delete button with confirmation
- [x] Create new resume button
- [x] Empty state UI

### Templates Page ✅
- [x] Browse all templates
- [x] Template preview cards
- [x] Use Template button
- [x] Template information and tips

### Profile Page ✅
- [x] View profile information
- [x] Edit full name
- [x] Show email (read-only)
- [x] Account creation date
- [x] Delete account placeholder (for future)

### Navigation Sidebar ✅
- [x] Dashboard link
- [x] My Resumes link
- [x] Templates link
- [x] Profile link
- [x] Logout button
- [x] Active state indication
- [x] Professional dark theme

## 🎯 Best Practices Implemented

### 1. **Authentication & Authorization**
✅ Server-side authentication checks
✅ Automatic redirect to login if not authenticated
✅ Session management via AuthContext
✅ Protected routes with proper error handling

```tsx
// All dashboard pages use this pattern:
const user = await getCurrentUser();
if (!user) {
  redirect('/auth/login');
}
```

### 2. **Data Fetching**
✅ Server-side rendering (SSR) for all dashboard pages
✅ No sensitive data exposed to client
✅ Proper error handling with try-catch
✅ Type-safe Supabase queries

```tsx
// Server Component - Data fetched on server
export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getProfile(user.id);
  const resumes = await getUserResumes(user.id);
  
  // Safe to render with data
}
```

### 3. **Component Structure**
✅ Reusable components with clear interfaces
✅ Proper TypeScript types
✅ Variant patterns for styling
✅ Clear prop documentation

```tsx
// Reusable component with variants
<StatsCard
  icon={FileText}
  title="Total Resumes"
  value={5}
  variant="default"
/>
```

### 4. **Error Handling**
✅ User-facing error messages
✅ Toast notifications for feedback
✅ Graceful fallbacks
✅ Proper error logging

```tsx
try {
  await updateProfile(userId, updates);
  toast({ title: 'Success', description: 'Profile updated' });
} catch (error) {
  console.error('Error:', error);
  toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
}
```

### 5. **Performance**
✅ Server-side rendering reduces client JS
✅ Loading skeletons for smooth UX
✅ Database indexes on frequently queried columns
✅ Proper caching with revalidatePath

```tsx
// Server action with cache revalidation
export async function deleteResumeAction(userId: string, resumeId: string) {
  await deleteResume(userId, resumeId);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/resumes');
}
```

### 6. **UI/UX**
✅ Responsive design (mobile, tablet, desktop)
✅ Consistent color scheme and typography
✅ Dark mode support
✅ Accessible components (semantic HTML, ARIA labels)
✅ Smooth transitions and loading states
✅ Empty states with CTAs
✅ Confirmation dialogs for destructive actions

### 7. **Security**
✅ Row Level Security (RLS) on all tables
✅ Server-side validation
✅ No sensitive data in URLs (use POST body instead)
✅ CSRF protection via Next.js built-in
✅ Secure server actions

```tsx
// RLS prevents unauthorized access
CREATE POLICY "Users can only view their own data"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);
```

### 8. **Type Safety**
✅ Full TypeScript coverage
✅ Interfaces for all components and data
✅ Strict type checking enabled
✅ No `any` types

```tsx
interface UserCardProps {
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
}
```

## 🔧 Code Patterns

### Server Component Data Fetching
```tsx
// Fetch data on server, no data loading state needed
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### Client Component with Server Actions
```tsx
'use client';

import { serverAction } from '@/app/dashboard/actions';

export function MyComponent() {
  const handleClick = async () => {
    const result = await serverAction(data);
  };
  
  return <button onClick={handleClick}>Action</button>;
}
```

### Error Boundaries (Optional Enhancement)
```tsx
// Wrap pages with error boundary for better error handling
<Suspense fallback={<LoadingSkeleton />}>
  <DashboardContent />
</Suspense>
```

## 📊 Database Queries Reference

### Get User Profile
```tsx
const profile = await getProfile(userId);
// Returns: { id, email, full_name, avatar_url, created_at, updated_at }
```

### Get All User Resumes
```tsx
const resumes = await getUserResumes(userId);
// Returns: [{ id, title, updated_at }, ...]
```

### Update Profile
```tsx
await updateProfile(userId, { full_name: 'John Doe' });
```

### Create New Resume
```tsx
const newResume = await createNewResume(userId, 'My Resume');
// Returns: Resume object with default sections
```

### Delete Resume
```tsx
await deleteResume(userId, resumeId);
```

## 🚨 Common Issues & Solutions

### Issue: "Auth session missing" Error
**Solution:** Ensure user is logged in and session is valid
```tsx
const user = await getCurrentUser();
if (!user) redirect('/auth/login');
```

### Issue: Resume data not updating
**Solution:** Use server actions with revalidatePath
```tsx
export async function updateResumeAction(userId, resumeId, data) {
  await saveResume(userId, data);
  revalidatePath('/dashboard');
}
```

### Issue: Avatar not displaying
**Solution:** Check Supabase storage bucket permissions and public URL
```tsx
// Ensure avatars bucket has public access
const { data } = supabase.storage.from('avatars').getPublicUrl(path);
```

### Issue: Profile not found for new users
**Solution:** Profile is created via database trigger on user signup
```tsx
// If needed, manually create profile:
await createProfile(userId, email, fullName);
```

## 🎨 Customization Guide

### Change Sidebar Color
```tsx
// In Sidebar.tsx
<aside className="w-64 bg-slate-900 text-white">
  {/* Change bg-slate-900 to your color */}
</aside>
```

### Add New Sidebar Menu Item
```tsx
// In Sidebar.tsx
const menuItems = [
  // ... existing items
  {
    id: 'new-item',
    label: 'New Item',
    href: '/dashboard/new-item',
    icon: YourIcon,
  },
];
```

### Customize Stats Variants
```tsx
// In StatsCard.tsx
const variantStyles = {
  // Add new variant
  custom: 'from-custom-50 to-custom-100 dark:from-custom-900',
};
```

### Extend Profile Fields
```tsx
// 1. Update Supabase schema
ALTER TABLE public.profiles ADD COLUMN phone TEXT;

// 2. Update types
interface Profile {
  phone?: string;
}

// 3. Update form component
<Input 
  value={formData.phone} 
  onChange={(e) => setFormData({...formData, phone: e.target.value})}
/>
```

## 🧪 Testing Checklist

- [ ] Sign up creates profile correctly
- [ ] Login redirects to dashboard
- [ ] Dashboard loads user data
- [ ] Create new resume works
- [ ] Edit resume opens in editor
- [ ] Delete resume works with confirmation
- [ ] Profile page displays user info
- [ ] Profile update works
- [ ] Logout clears session
- [ ] Unauthenticated access redirects to login
- [ ] Dark mode works on all pages
- [ ] Mobile responsive layout works
- [ ] Templates page displays all templates
- [ ] Template button links to editor correctly
- [ ] Loading skeletons show while loading
- [ ] Empty states display when no resumes

## 📈 Performance Monitoring

### Recommended Tools
- Vercel Analytics (already included)
- Supabase Analytics
- Web Vitals tracking

### Key Metrics to Monitor
- Time to First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Supabase query response times

## 🔐 Security Checklist

- [x] HTTPS enforced
- [x] RLS policies configured
- [x] No sensitive data in URLs
- [x] Server-side validation on all inputs
- [x] CSRF protection (Next.js built-in)
- [x] XSS protection (React built-in)
- [x] Authentication required for dashboard
- [x] Session timeout configured
- [x] User data isolated by RLS

## 🌐 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] RLS policies verified
- [ ] Storage buckets created
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Backups configured
- [ ] CDN configured
- [ ] SSL certificate valid
- [ ] Monitoring alerts set up

---

**Last Updated:** 2024
**Dashboard Version:** 1.0.0
