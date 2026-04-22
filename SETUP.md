# Resume Builder - Setup Guide

Complete step-by-step instructions to get the Resume Builder running locally and deploy it to production.

## Quick Start (5 Minutes)

### Prerequisites
- Node.js 18 or higher
- Package manager (pnpm, npm, yarn, or bun)
- Supabase account (free)

### Steps

```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd resume-builder

# 2. Install dependencies
pnpm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Add your Supabase credentials to .env.local
# (see Environment Variables section below)

# 5. Run development server
pnpm dev

# 6. Open browser
# Visit http://localhost:3000
```

---

## Detailed Setup Instructions

### Step 1: Install Dependencies

Choose your preferred package manager:

```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### Step 2: Supabase Configuration

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Select organization and enter project details:
   - **Name:** resume-builder
   - **Database Password:** Save securely
   - **Region:** Closest to your location
4. Wait for project to initialize (2-3 minutes)

#### Get API Keys

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Initialize Database Schema

1. Go to **SQL Editor** in Supabase
2. Copy and paste the contents of `/scripts/01_init_schema.sql`
3. Click **"Run"** to execute the schema

Or run the migration script:

```bash
node scripts/migrate.js
```

### Step 3: Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Razorpay Configuration (for payment testing)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_secret

# Optional: Analytics (Vercel)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxxxx
```

**⚠️ Never commit `.env.local` to version control!**

### Step 4: Run Development Server

```bash
pnpm dev
```

The application will be available at:
- **Local:** http://localhost:3000
- **Network:** http://<your-ip>:3000

### Step 5: Test the Application

1. **Sign Up:** Create a test account
2. **Create Resume:** Fill in some sample information
3. **Preview:** Check the live preview updates
4. **Save:** Verify data is saved (check browser DevTools → Storage → IndexedDB)
5. **Download:** Try exporting to PDF

---

## Database Schema Details

### Authentication (Supabase Auth)

Users are automatically managed by Supabase Auth:
- Email/password authentication
- Secure session tokens
- Automatic user creation on signup

### Resumes Table

```sql
CREATE TABLE public.resumes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'My Resume',
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Users can only access their own resumes
CREATE POLICY "Users can view their own resumes"
  ON public.resumes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON public.resumes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.resumes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.resumes
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Resume Templates Table (Optional)

For saving custom template configurations:

```sql
CREATE TABLE public.resume_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  template_config jsonb NOT NULL DEFAULT '{}',
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates"
  ON public.resume_templates
  FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Feature Configuration

### Enable/Disable Features

#### Authentication

To require login:
- ✅ Already enabled - users must sign up to save to cloud
- To disable: Remove AuthProvider wrapper in `app/layout.tsx`

#### Markdown Support

Already enabled in Advanced mode:
- To disable: Remove RichTextEditor component
- Edit: `components/resume/ExperienceEditor.tsx` and `ProjectsEditor.tsx`

#### PDF Export

Already enabled:
- To disable: Remove DownloadManager from `app/editor/page.tsx`
- Customize: Edit `lib/utils/pdfExport.ts`

#### Payment Integration

Razorpay integration setup but not required:
- To enable: Uncomment code in `lib/services/razorpay.ts`
- Add your Razorpay keys to `.env.local`

---

## Development Workflow

### Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # React components
├── lib/              # Utilities and hooks
├── public/           # Static assets
└── styles/           # Global styles
```

### Add a New Feature

1. **Create components** in `components/`
2. **Add types** in `lib/types/`
3. **Create utilities** in `lib/utils/` if needed
4. **Add API routes** in `app/api/`
5. **Update pages** in `app/`
6. **Test locally** with `pnpm dev`

### Common Tasks

**Add a new template:**
1. Create `components/templates/NewTemplate.tsx`
2. Export in `components/templates/index.ts`
3. Add to TEMPLATES array

**Add authentication:**
1. Check `lib/context/AuthContext.tsx`
2. Use `useAuth()` hook in components
3. Wrap routes with `<ProtectedRoute>`

**Modify database:**
1. Create SQL in `scripts/`
2. Run via Supabase SQL Editor
3. Update types in `lib/types/`

---

## Testing

### Manual Testing

```bash
# Test signup/login flow
1. Visit http://localhost:3000
2. Click "Get Started"
3. Create test account
4. Verify email in Supabase dashboard

# Test resume saving
1. Fill in resume form
2. Wait 3 seconds for auto-save
3. Check Supabase → resumes table

# Test PDF export
1. Click "Download PDF"
2. Verify file downloads
3. Check PDF content
```

### Browser DevTools Testing

```javascript
// Check localStorage
localStorage.getItem('resume-builder-resume')

// Check Supabase client
window.supabaseClient

// Verify authentication
localStorage.getItem('sb-auth-token')
```

---

## Troubleshooting

### Common Issues

**1. "Cannot find module '@supabase/supabase-js'"**
```bash
pnpm install @supabase/supabase-js
```

**2. "NEXT_PUBLIC_SUPABASE_URL is not set"**
- Create `.env.local` file
- Add Supabase credentials
- Restart dev server: `pnpm dev`

**3. "Auth session missing" errors**
- This is expected when not logged in
- Data still saves to localStorage
- Login to enable cloud sync

**4. Database queries failing**
- Verify RLS policies in Supabase
- Check user authentication status
- Ensure user_id matches in database

**5. PDF export not working**
```bash
# Reinstall html2pdf.js
pnpm remove html2pdf.js
pnpm add html2pdf.js
```

---

## Performance Optimization

### Build Optimization

```bash
# Create production build
pnpm build

# Analyze bundle size
pnpm build --analyze
```

### Runtime Optimization

- Image optimization: Already enabled
- Code splitting: Automatic with Next.js
- Caching: Configured in next.config.mjs
- Database queries: Optimized with Supabase indexes

### Monitor Performance

```bash
# Check build stats
pnpm build

# Test lighthouse
# Open DevTools → Lighthouse → Run audit
```

---

## Deployment

### Deploy to Vercel (Recommended)

**Option 1: Using Git**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables in project settings
5. Deploy with one click

**Option 2: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Other Platforms

**AWS Amplify:**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```

**DigitalOcean App Platform:**
1. Connect GitHub repository
2. Create new App
3. Set environment variables
4. Deploy automatically

**Self-hosted (Docker):**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t resume-builder .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... resume-builder
```

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables in production
- [ ] Enable database RLS policies
- [ ] Configure CORS properly
- [ ] Use environment-specific keys (test vs production)
- [ ] Enable 2FA for Supabase account
- [ ] Regular database backups enabled
- [ ] Review API logs regularly
- [ ] Update dependencies: `pnpm update`
- [ ] Use strong passwords for all services

---

## Monitoring & Logging

### View Logs

**Vercel:**
- Deployments tab
- Function logs (real-time)
- Error tracking

**Supabase:**
- Database dashboard
- API logs
- Authentication logs

**Local Development:**
```bash
# Server logs
pnpm dev

# Browser console
# Press F12 → Console tab
```

---

## Getting Help

### Resources

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📖 [Supabase Docs](https://supabase.com/docs)
- 📖 [Tailwind Docs](https://tailwindcss.com/docs)
- 💬 [GitHub Discussions](https://github.com/<your-repo>/discussions)

### Report Issues

1. Check existing issues on GitHub
2. Provide:
   - Error message
   - Steps to reproduce
   - Browser/OS info
   - Screenshots if applicable

---

## Next Steps

After setup:

1. **Customize branding** - Edit colors in globals.css
2. **Add your logo** - Place in `public/` folder
3. **Configure emails** - Set up Supabase email templates
4. **Enable payments** - Configure Razorpay production keys
5. **Deploy to production** - Follow deployment guide above

---

**Happy Building! 🚀**

For more info, see [README.md](./README.md)
