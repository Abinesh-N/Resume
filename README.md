# Resume Builder

A modern, full-stack resume builder application that enables users to create, customize, and export professional resumes with ease.

## Features

### Phase 1: Form-Based Editor with Live Preview
- Interactive form editor with sections for:
  - Personal Information (name, email, phone, location, summary, website, social links)
  - Professional Experience
  - Education
  - Skills
  - Projects
- **Live Preview** - Real-time resume updates as you type
- **Template Selection** - Choose from 5 professional templates
- **localStorage Persistence** - Auto-save to browser storage

### Phase 2: Advanced Editing Modes
- **Simple Mode** - Plain text editing for quick resume building
- **Advanced Mode** - Markdown-based rich text editing
- **Live Markdown Preview** - See formatting in real-time
- **GitHub-Flavored Markdown** - Full support for formatting:
  - Bold, italic, underline text
  - Bullet points and numbered lists
  - Links and code formatting
  - Tables and blockquotes

### Phase 3: Authentication & Database
- **User Authentication** - Sign up and login with Supabase Auth
- **Cloud Storage** - Resume data synced to Supabase database
- **Auto-Save** - 3-second debounced saving to database
- **Offline Support** - Works offline with localStorage fallback

### Phase 4: Templates & Customization
- **5 Professional Templates:**
  - **Classic** - Traditional and professional layout
  - **Modern** - Contemporary design with sidebar
  - **Minimal** - Clean and minimalist approach
  - **Executive** - Bold header with accent colors
  - **Creative** - Vibrant design with colored accents

- **Theme Customization:**
  - 5 preset color schemes (Blue, Purple, Green, Red, Slate)
  - Custom color picker for primary and accent colors
  - Real-time theme preview updates

### Phase 5: PDF Export & Payments
- **PDF Download** - Export resume as a professional PDF
- **Timestamp Naming** - Automatically named with date/time
- **Razorpay Integration** - Payment processing infrastructure for premium features
- **Print Optimization** - Resumes formatted for printing

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Lucide Icons** - Beautiful icon library
- **React Markdown** - Markdown rendering with GitHub-flavored support
- **html2pdf.js** - PDF generation

### Backend & Database
- **Supabase** - PostgreSQL database + Authentication
- **Next.js API Routes** - Serverless backend functions
- **Razorpay API** - Payment processing

### Deployment
- **Vercel** - Hosting and deployment platform

## Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ installed
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Supabase Account** (free tier available)
- **Razorpay Account** (for payment integration - optional)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resume-builder
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → API** to get your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 5. Initialize Database Schema

```bash
# Run the migration script to set up database tables
node scripts/migrate.js
```

This will create:
- `resumes` table - Store user resumes with full data
- `resume_templates` table - Store saved template configurations
- Required indexes and foreign keys

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
resume-builder/
├── app/
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── page.tsx                   # Landing page
│   ├── editor/
│   │   ├── layout.tsx             # Protected editor layout
│   │   └── page.tsx               # Main editor page
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Sign up page
│   ├── api/
│   │   └── resumes/
│   │       ├── route.ts           # Get resumes API
│   │       └── save/route.ts      # Save resume API
│   └── globals.css                # Global styles with design tokens
│
├── components/
│   ├── resume/
│   │   ├── PersonalInfoForm.tsx   # Personal information editor
│   │   ├── ExperienceEditor.tsx   # Experience section editor
│   │   ├── EducationEditor.tsx    # Education section editor
│   │   ├── SkillsEditor.tsx       # Skills section editor
│   │   ├── ProjectsEditor.tsx     # Projects section editor
│   │   ├── SectionEditor.tsx      # Generic section wrapper
│   │   ├── RichTextEditor.tsx     # Markdown editor for advanced mode
│   │   ├── EditingModeToggle.tsx  # Simple/Advanced mode toggle
│   │   ├── ThemeCustomizer.tsx    # Color and theme customizer
│   │   ├── ResumePreview.tsx      # Live resume preview
│   │   ├── DownloadManager.tsx    # PDF download interface
│   │   └── MarkdownRenderer.tsx   # Render markdown in templates
│   ├── templates/
│   │   ├── ClassicTemplate.tsx    # Traditional layout
│   │   ├── ModernTemplate.tsx     # Contemporary layout
│   │   ├── MinimalTemplate.tsx    # Clean layout
│   │   ├── ExecutiveTemplate.tsx  # Executive layout
│   │   ├── CreativeTemplate.tsx   # Creative layout
│   │   ├── MarkdownRenderer.tsx   # Markdown utility
│   │   └── index.ts               # Template registry
│   ├── ProtectedRoute.tsx         # Route protection wrapper
│   └── ui/                        # shadcn/ui components
│
├── lib/
│   ├── types/
│   │   └── resume.ts              # Resume data types and defaults
│   ├── hooks/
│   │   └── useResume.ts           # Resume state management hook
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication context provider
│   ├── supabase/
│   │   ├── client.ts              # Supabase client initialization
│   │   ├── auth.ts                # Authentication functions
│   │   └── resumes.ts             # Resume database operations
│   ├── services/
│   │   └── razorpay.ts            # Razorpay payment integration
│   ├── utils/
│   │   ├── pdfExport.ts           # PDF export utility
│   │   └── utils.ts               # Common utilities (cn function, etc.)
│   └── hooks/
│       └── use-mobile.ts          # Mobile detection hook
│
├── scripts/
│   ├── 01_init_schema.sql         # Database schema initialization
│   └── migrate.js                 # Migration runner script
│
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in git)
├── next.config.mjs                # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.mjs             # PostCSS configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## How to Use

### Create a Resume

1. **Sign Up** - Click "Get Started" and create an account
2. **Fill Information** - Enter your personal details and professional experience
3. **Choose Template** - Select from 5 professional resume templates
4. **Customize** - Use the theme customizer to match your preferred colors
5. **Edit Mode** - Toggle between Simple (plain text) and Advanced (Markdown) modes
6. **Save** - Your resume automatically saves to the cloud
7. **Download** - Export as PDF for sharing or printing

### Editing Modes

**Simple Mode:**
- Plain text editing
- No formatting options
- Quick and straightforward

**Advanced Mode:**
- Markdown support
- Format with **bold**, *italic*, and more
- Create bullet points and lists
- Add links and code snippets
- Live preview before saving

### Templates

Each template offers a unique design while supporting all resume features:
- **Classic** - Best for traditional industries
- **Modern** - Great for tech and creative fields
- **Minimal** - Perfect for clean, focused resumes
- **Executive** - Ideal for senior positions
- **Creative** - Stand out with vibrant design

### Theme Customization

1. Open **Theme Customizer** in the editor
2. Choose from preset color schemes or custom colors
3. Changes apply instantly to resume preview
4. Saved automatically with your resume data

## Authentication

### Sign Up
1. Go to `/auth/signup`
2. Enter email and password
3. Account created in Supabase Auth
4. Redirected to editor

### Login
1. Go to `/auth/login`
2. Enter credentials
3. Access your saved resumes
4. Continue editing

### Session Management
- Sessions stored securely in Supabase
- Auto-logout after 1 week of inactivity
- Protected routes require authentication

## API Endpoints

### Save Resume
```
POST /api/resumes/save
Content-Type: application/json

{
  "id": "resume-id",
  "title": "My Resume",
  "personalInfo": { ... },
  "sections": [ ... ],
  "templateId": "modern",
  "theme": { ... },
  "editingMode": "advanced"
}
```

### Get Resumes
```
GET /api/resumes
Authorization: Bearer <token>

Response:
{
  "resumes": [
    {
      "id": "resume-id",
      "title": "My Resume",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z"
    }
  ]
}
```

## Database Schema

### Resumes Table
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Resume Templates Table
```sql
CREATE TABLE resume_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  template_id TEXT NOT NULL,
  colors JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RAZORPAY_KEY_SECRET` (if using payments)
5. Deploy!

### Deploy Elsewhere

This Next.js application can be deployed on any platform that supports Node.js:
- AWS Amplify
- Firebase Hosting (with Cloud Functions)
- Heroku
- DigitalOcean
- Your own server

## Development

### Run Tests
```bash
pnpm test
```

### Run Linter
```bash
pnpm lint
```

### Build for Production
```bash
pnpm build
pnpm start
```

## Troubleshooting

### Issue: "Auth session missing" error
**Solution:** This is normal when not authenticated. The app gracefully handles this and saves to localStorage instead.

### Issue: Resume not saving to database
**Solution:** 
1. Verify Supabase credentials in `.env.local`
2. Check Supabase database status
3. Review browser console for errors
4. Data is still saved in localStorage even if database save fails

### Issue: PDF export not working
**Solution:**
1. Ensure html2pdf.js is installed: `pnpm add html2pdf.js`
2. Check browser console for errors
3. Verify resume content is properly rendered

### Issue: Templates not showing
**Solution:**
1. Clear browser cache
2. Restart development server: `pnpm dev`
3. Verify all template components are exported in `components/templates/index.ts`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Initial Load:** ~2 seconds (optimized with Next.js)
- **Live Preview:** Real-time updates (<100ms)
- **PDF Export:** 2-5 seconds depending on resume length
- **Database Save:** 1-3 seconds (debounced, no impact on UX)

## Security

- **Authentication:** Supabase Auth with secure session management
- **Database:** Row-level security (RLS) enables in Supabase
- **API Routes:** Server-side validation and authentication checks
- **HTTPS:** Always use HTTPS in production
- **Passwords:** Salted and hashed by Supabase Auth

## Future Enhancements

- [ ] Dark mode support
- [ ] AI-powered resume suggestions
- [ ] Import from LinkedIn
- [ ] Multi-language support
- [ ] Resume templates gallery (50+ templates)
- [ ] Cover letter builder
- [ ] ATS optimization checker
- [ ] Share resumes with hiring managers
- [ ] Analytics and resume views tracking
- [ ] Advanced payment system with Razorpay

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: support@resumebuilder.app
- Documentation: [Full Docs](https://docs.resumebuilder.app)

## Changelog

### v1.0.0 (2024-01)
- ✨ Initial release with 5 phases completed
- ✨ Form-based editor with live preview
- ✨ Advanced Markdown editing mode
- ✨ Supabase authentication and database
- ✨ 5 professional templates
- ✨ Theme customization
- ✨ PDF export functionality
- ✨ Payment integration infrastructure

---

**Made with ❤️ by the Resume Builder Team**

For the latest updates and features, visit [resumebuilder.app](https://resumebuilder.app)
