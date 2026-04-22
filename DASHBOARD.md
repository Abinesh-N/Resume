# Dashboard Implementation Guide

This guide documents the professional Dashboard system built for the Resume Builder SaaS application.

## 📁 Project Structure

```
app/
├── dashboard/
│   ├── page.tsx                 # Main dashboard page
│   ├── resumes/
│   │   └── page.tsx            # My Resumes page
│   ├── templates/
│   │   └── page.tsx            # Templates browse page
│   └── profile/
│       └── page.tsx            # Profile management page

components/
└── dashboard/
    ├── Sidebar.tsx             # Navigation sidebar
    ├── DashboardLayout.tsx      # Dashboard layout wrapper
    ├── UserCard.tsx            # User info card component
    ├── StatsCard.tsx           # Stats display card
    ├── TemplateCard.tsx        # Resume template card
    ├── ResumesList.tsx         # Resumes list table
    ├── LoadingSkeleton.tsx      # Loading skeleton components
    └── index.ts                # Barrel export

lib/
└── supabase/
    ├── profiles.ts             # Profile queries (NEW)
    └── resumes.ts              # Resume queries (EXISTING)
```

## 🎯 Features Implemented

### 1. **Dashboard Main Page** (`/dashboard`)
- User welcome section
- User info card with avatar support
- Statistics cards showing:
  - Total resumes created
  - Last updated resume info
  - Active template usage
- Resume templates grid (6 templates)
- Recent resumes list with quick actions

### 2. **My Resumes Page** (`/dashboard/resumes`)
- All user resumes displayed in a table
- Resume metadata (title, last updated)
- Edit and Delete actions
- Create new resume button
- Empty state with call-to-action

### 3. **Templates Page** (`/dashboard/templates`)
- Browse all available templates
- Template preview cards
- Use template and preview buttons
- Template selection tips and guidance

### 4. **Profile Page** (`/dashboard/profile`)
- View and edit profile information
- Full name management
- Avatar display (read-only, future enhancement)
- Account details (created date, last updated)
- Danger zone (delete account - coming soon)

### 5. **Sidebar Navigation**
- Dashboard link
- My Resumes link
- Templates link
- Profile link
- Logout button
- Active state indication
- Professional dark theme

### 6. **Reusable Components**

#### UserCard
Displays user profile information with avatar

```tsx
<UserCard 
  fullName={profile?.full_name}
  email={user.email}
  avatarUrl={profile?.avatar_url}
/>
```

#### StatsCard
Shows statistics with customizable variants

```tsx
<StatsCard
  icon={FileText}
  title="Total Resumes"
  value={5}
  description="Resumes created"
  variant="default"
/>
```

#### TemplateCard
Template selection card with preview and actions

```tsx
<TemplateCard
  id="modern"
  name="Modern"
  description="Contemporary design"
  isNew={true}
/>
```

#### ResumesList
Table view of user resumes with actions

```tsx
<ResumesList
  resumes={resumes}
  onDelete={handleDelete}
  onCreateNew={handleCreate}
/>
```

#### LoadingSkeleton
Production-ready loading states

```tsx
<DashboardLoadingSkeleton />
```

## 🔧 Setup Instructions

### 1. Database Schema

The following Supabase tables are already set up via `/scripts/01_init_schema.sql`:

```sql
-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  template_id TEXT,
  editing_mode TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 2. Supabase Configuration

Ensure your Supabase environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Row Level Security (RLS)

RLS policies are already configured in the SQL schema to ensure users can only:
- View their own profile
- Update their own profile
- View/Create/Update/Delete their own resumes

## 📊 Data Flow

### Authentication Flow
```
User Login → Auth Check → Redirect to /dashboard → Load User & Resumes → Render Dashboard
```

### Data Fetching
All dashboard pages use **Server-Side Rendering (SSR)** for:
- Authentication checks
- User profile data
- Resume metadata
- Preventing unauthorized access

```tsx
// Server Component
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  
  const profile = await getProfile(user.id);
  const resumes = await getUserResumes(user.id);
  
  // Render with data
}
```

## 🎨 Styling

- **Framework:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Dark Mode:** Full support via Tailwind's dark mode
- **Responsive:** Mobile, tablet, desktop layouts
- **Colors:**
  - Primary: Blue (#0066cc)
  - Secondary: Slate (gray)
  - Success: Green
  - Warning: Amber
  - Danger: Red

## 🔐 Security Features

1. **Server-Side Authentication Checks**
   - All dashboard pages redirect unauthenticated users to login

2. **Row Level Security (RLS)**
   - Supabase RLS policies enforce user data isolation

3. **Protected Routes**
   - Dashboard pages require authentication
   - No sensitive data exposed to client

4. **Session Management**
   - AuthContext manages user session
   - Automatic logout on token expiration

## 📱 API Endpoints Used

### Supabase Queries

#### Profiles (`lib/supabase/profiles.ts`)
- `getProfile(userId)` - Fetch user profile
- `createProfile(userId, email, fullName)` - Create user profile
- `updateProfile(userId, updates)` - Update profile info
- `uploadProfileAvatar(userId, file)` - Upload profile avatar

#### Resumes (`lib/supabase/resumes.ts`)
- `getUserResumes(userId)` - Get all user resumes
- `getResume(userId, resumeId)` - Get single resume
- `saveResume(userId, resume)` - Save/update resume
- `deleteResume(userId, resumeId)` - Delete resume
- `createNewResume(userId, title)` - Create new resume

## 🚀 Usage Examples

### Creating a New Resume
```tsx
import { createNewResume } from '@/lib/supabase/resumes';

const newResume = await createNewResume(userId, 'My Resume');
router.push(`/editor?resumeId=${newResume.id}`);
```

### Updating User Profile
```tsx
import { updateProfile } from '@/lib/supabase/profiles';

await updateProfile(userId, {
  full_name: 'John Doe',
});
```

### Fetching Resumes
```tsx
import { getUserResumes } from '@/lib/supabase/resumes';

const resumes = await getUserResumes(userId);
```

## 📈 Performance Optimizations

1. **Server-Side Rendering**
   - Data fetched on the server
   - Reduced client-side loading

2. **Loading Skeletons**
   - Smooth loading experience
   - No content shift

3. **Image Optimization**
   - Avatar images through Supabase Storage
   - Proper caching headers

4. **Database Indexing**
   - Indexed queries on user_id, created_at
   - Optimized resume listing

## 🐛 Error Handling

All API calls include error handling:

```tsx
try {
  const profile = await getProfile(userId);
} catch (error) {
  console.error('Failed to fetch profile:', error);
  toast({
    title: 'Error',
    description: 'Failed to load profile',
    variant: 'destructive',
  });
}
```

## 🎯 Future Enhancements

1. **Avatar Upload**
   - Implement avatar upload in profile page
   - Image cropping and compression

2. **Resume Statistics**
   - View count tracking
   - Download count
   - Template usage analytics

3. **Sharing & Collaboration**
   - Share resumes with others
   - View-only links
   - Comments and feedback

4. **Resume Versioning**
   - Track resume versions
   - Restore previous versions
   - Version history timeline

5. **Template Customization**
   - Save custom templates
   - Template preview before download
   - Font and color customization

6. **Notifications**
   - Resume download notifications
   - New template notifications
   - Account activity log

## 📝 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🧪 Testing the Dashboard

1. **Sign up** at `/auth/signup`
2. **Log in** at `/auth/login` (redirects to `/dashboard`)
3. **Navigate** through sidebar:
   - Dashboard → View stats and templates
   - My Resumes → Create, edit, delete resumes
   - Templates → Browse templates
   - Profile → Edit user info
   - Logout → Return to login

## 📚 Related Documentation

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🤝 Component Props Reference

### DashboardLayout
```tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: 'dashboard' | 'resumes' | 'templates' | 'profile';
}
```

### UserCard
```tsx
interface UserCardProps {
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
}
```

### StatsCard
```tsx
interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}
```

### TemplateCard
```tsx
interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  isNew?: boolean;
}
```

### ResumesList
```tsx
interface ResumesListProps {
  resumes: Resume[];
  isLoading?: boolean;
  onDelete?: (resumeId: string) => Promise<void>;
  onCreateNew?: () => void;
}
```

---

**Built with:** Next.js App Router, Supabase, Tailwind CSS, shadcn/ui
**Version:** 1.0.0
