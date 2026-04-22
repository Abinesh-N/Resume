# Resume Builder - Quick Start Guide

Get up and running in **5 minutes**. For detailed setup, see [SETUP.md](./SETUP.md).

## Prerequisites

✅ Node.js 18+  
✅ Package manager (pnpm/npm/yarn/bun)  
✅ Free Supabase account  

## 1️⃣ Clone & Install

```bash
git clone <repo-url>
cd resume-builder
pnpm install
```

## 2️⃣ Create Supabase Project

1. Go to **[supabase.com](https://supabase.com)**
2. Click **"New Project"**
3. Fill in details and create
4. Wait 2-3 minutes for initialization

## 3️⃣ Get Supabase Keys

1. Open your Supabase project
2. Go to **Settings → API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4️⃣ Setup Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxx
```

Or copy and edit the template:

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

## 5️⃣ Initialize Database

Go to Supabase → **SQL Editor** and run:

```sql
-- Resumes Table
CREATE TABLE public.resumes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'My Resume',
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);
```

## 6️⃣ Run Development Server

```bash
pnpm dev
```

Open **http://localhost:3000** in your browser.

## 7️⃣ Test It!

1. Click **"Get Started"** on landing page
2. Sign up with email/password
3. Start creating your resume
4. Try different templates
5. Test the markdown editor (Advanced mode)
6. Download as PDF
7. Check Supabase → resumes table to see your data

---

## Common Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code
pnpm format
```

## Project Structure

```
resume-builder/
├── app/                    # Pages and routes
│   ├── page.tsx           # Landing page
│   ├── editor/            # Resume editor
│   └── auth/              # Login/signup
├── components/
│   ├── resume/            # Resume components
│   └── templates/         # Resume templates
├── lib/
│   ├── hooks/             # Custom hooks
│   ├── context/           # React context
│   └── supabase/          # Database functions
├── .env.local             # Your credentials (don't commit!)
└── README.md              # Full documentation
```

## Features

✨ **5 Professional Templates**  
✨ **Simple & Markdown Editing Modes**  
✨ **Live Preview**  
✨ **Cloud Storage (Supabase)**  
✨ **PDF Export**  
✨ **Theme Customization**  
✨ **Auto-Save**  

## Next: Full Setup

For detailed instructions on:
- Deployment to Vercel
- Database configuration
- Payment integration
- Advanced customization

See **[SETUP.md](./SETUP.md)** →

## Need Help?

1. Check **[README.md](./README.md)** for full documentation
2. See **[SETUP.md](./SETUP.md)** for detailed setup
3. Review **[.env.example](./.env.example)** for environment variables
4. Check Supabase docs at **[supabase.com/docs](https://supabase.com/docs)**

---

**You're all set! Start building resumes! 🚀**
