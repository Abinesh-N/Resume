'use client';

import type { CSSProperties, ReactElement } from 'react';
import { Resume, Section } from '@/lib/types/resume';
import { SectionRenderer } from './SectionRenderer';

type LayoutKind =
  | 'classic'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'centered'
  | 'timeline'
  | 'executive'
  | 'editorial'
  | 'cards'
  | 'minimal'
  | 'spotlight'
  | 'premium-executive'
  | 'premium-creative';

type SectionVariant = 'standard' | 'timeline' | 'cards' | 'compact' | 'minimal' | 'premium' | 'premium-creative';

interface TemplatePalette {
  page: string;
  shell: string;
  header: string;
  sidebar: string;
  main: string;
  heading: string;
  muted: string;
  divider: string;
  badge: string;
}

interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  layout: LayoutKind;
  fontClassName: string;
  palette: TemplatePalette;
  sectionVariant: SectionVariant;
  skillVariant: SectionVariant;
  headerAlign: 'left' | 'center' | 'split';
}

type TemplateComponent = ({ resume }: { resume: Resume }) => ReactElement;

const palettes = {
  slate: {
    page: 'bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100',
    shell: 'border border-slate-200 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)] dark:border-slate-800',
    header: 'bg-slate-50/90 dark:bg-slate-900/80',
    sidebar: 'bg-slate-50 dark:bg-slate-900',
    main: 'bg-white dark:bg-slate-950',
    heading: 'text-slate-900 dark:text-slate-50',
    muted: 'text-slate-600 dark:text-slate-300',
    divider: 'border-slate-200 dark:border-slate-800',
    badge: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950',
  },
  ocean: {
    page: 'bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100',
    shell: 'border border-cyan-100 shadow-[0_24px_80px_-48px_rgba(8,145,178,0.38)] dark:border-cyan-950/60',
    header: 'bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-950/40 dark:to-sky-950/30',
    sidebar: 'bg-cyan-50/80 dark:bg-cyan-950/20',
    main: 'bg-white dark:bg-slate-950',
    heading: 'text-cyan-950 dark:text-cyan-100',
    muted: 'text-slate-600 dark:text-slate-300',
    divider: 'border-cyan-100 dark:border-cyan-950/50',
    badge: 'bg-cyan-700 text-white dark:bg-cyan-300 dark:text-cyan-950',
  },
  emerald: {
    page: 'bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100',
    shell: 'border border-emerald-100 shadow-[0_24px_80px_-48px_rgba(5,150,105,0.36)] dark:border-emerald-950/60',
    header: 'bg-gradient-to-r from-emerald-50 to-lime-50 dark:from-emerald-950/40 dark:to-lime-950/25',
    sidebar: 'bg-emerald-50/80 dark:bg-emerald-950/20',
    main: 'bg-white dark:bg-slate-950',
    heading: 'text-emerald-950 dark:text-emerald-100',
    muted: 'text-slate-600 dark:text-slate-300',
    divider: 'border-emerald-100 dark:border-emerald-950/50',
    badge: 'bg-emerald-700 text-white dark:bg-emerald-300 dark:text-emerald-950',
  },
  amber: {
    page: 'bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100',
    shell: 'border border-amber-100 shadow-[0_24px_80px_-48px_rgba(217,119,6,0.36)] dark:border-amber-950/60',
    header: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30',
    sidebar: 'bg-amber-50/80 dark:bg-amber-950/20',
    main: 'bg-white dark:bg-zinc-950',
    heading: 'text-amber-950 dark:text-amber-100',
    muted: 'text-zinc-600 dark:text-zinc-300',
    divider: 'border-amber-100 dark:border-amber-950/50',
    badge: 'bg-amber-700 text-white dark:bg-amber-300 dark:text-amber-950',
  },
  rose: {
    page: 'bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100',
    shell: 'border border-rose-100 shadow-[0_24px_80px_-48px_rgba(225,29,72,0.35)] dark:border-rose-950/60',
    header: 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30',
    sidebar: 'bg-rose-50/80 dark:bg-rose-950/20',
    main: 'bg-white dark:bg-zinc-950',
    heading: 'text-rose-950 dark:text-rose-100',
    muted: 'text-zinc-600 dark:text-zinc-300',
    divider: 'border-rose-100 dark:border-rose-950/50',
    badge: 'bg-rose-700 text-white dark:bg-rose-300 dark:text-rose-950',
  },
  premium: {
    page: 'bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100',
    shell: 'border border-amber-100 shadow-[0_32px_96px_-48px_rgba(217,119,6,0.25)] dark:border-amber-950/60',
    header: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-amber-950/40',
    sidebar: 'bg-amber-50/90 dark:bg-amber-950/30',
    main: 'bg-white dark:bg-zinc-950',
    heading: 'text-amber-950 dark:text-amber-100',
    muted: 'text-zinc-600 dark:text-zinc-300',
    divider: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white dark:from-amber-400 dark:to-amber-500 dark:text-amber-950',
  },
  'premium-creative': {
    page: 'bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100',
    shell: 'border border-purple-200 shadow-[0_32px_96px_-48px_rgba(147,51,234,0.25)] dark:border-purple-800',
    header: 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-indigo-950/40',
    sidebar: 'bg-purple-50/90 dark:bg-purple-950/30',
    main: 'bg-white dark:bg-zinc-950',
    heading: 'text-purple-950 dark:text-purple-100',
    muted: 'text-zinc-600 dark:text-zinc-300',
    divider: 'border-purple-200 dark:border-purple-800',
    badge: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white dark:from-purple-400 dark:to-pink-400 dark:text-purple-950',
  },
} as const;

function createDefinition(
  id: string,
  name: string,
  description: string,
  layout: LayoutKind,
  paletteKey: keyof typeof palettes,
  fontClassName: string,
  sectionVariant: SectionVariant,
  skillVariant: SectionVariant,
  headerAlign: 'left' | 'center' | 'split',
): TemplateDefinition {
  return {
    id,
    name,
    description,
    layout,
    palette: palettes[paletteKey],
    fontClassName,
    sectionVariant,
    skillVariant,
    headerAlign,
  };
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  createDefinition('classic', 'Classic', 'Professional serif layout with refined spacing.', 'classic', 'slate', 'font-serif', 'standard', 'standard', 'left'),
  createDefinition('modern', 'Modern', 'Contemporary sidebar composition with polished contrast.', 'sidebar-left', 'ocean', 'font-sans', 'standard', 'cards', 'split'),
  createDefinition('minimal', 'Minimal', 'Clean editorial resume with restrained hierarchy.', 'minimal', 'slate', 'font-sans', 'minimal', 'minimal', 'left'),
  createDefinition('executive', 'Executive', 'Corporate presentation with elevated header treatment.', 'executive', 'amber', 'font-sans', 'cards', 'cards', 'split'),
  createDefinition('creative', 'Creative', 'Bold asymmetrical design with standout accents.', 'spotlight', 'rose', 'font-sans', 'cards', 'standard', 'left'),
  createDefinition('premium-executive', 'Premium Executive', 'Executive resume with gold accents and professional layout.', 'premium-executive', 'amber', 'font-serif', 'premium', 'premium', 'center'),
  createDefinition('premium-creative', 'Premium Creative', 'Modern creative resume with vibrant colors and unique layout.', 'premium-creative', 'rose', 'font-sans', 'premium-creative', 'premium-creative', 'left'),
  createDefinition('template-06', 'Nordic Column', 'Left sidebar resume with crisp Scandinavian spacing.', 'sidebar-left', 'slate', 'font-sans', 'compact', 'cards', 'split'),
  createDefinition('template-07', 'Harbor Line', 'Timeline-driven resume with calm ocean tones.', 'timeline', 'ocean', 'font-sans', 'timeline', 'standard', 'split'),
  createDefinition('template-08', 'Verde Ledger', 'Balanced corporate profile with green highlights.', 'classic', 'emerald', 'font-sans', 'standard', 'standard', 'split'),
  createDefinition('template-09', 'Golden Brief', 'Executive-first layout with warm premium accents.', 'executive', 'amber', 'font-serif', 'cards', 'cards', 'split'),
  createDefinition('template-10', 'Rose Studio', 'Creative grid resume for modern portfolios.', 'cards', 'rose', 'font-sans', 'cards', 'cards', 'center'),
  createDefinition('template-11', 'Atlas Sidebar', 'Right-rail layout built for dense professional profiles.', 'sidebar-right', 'slate', 'font-sans', 'compact', 'compact', 'split'),
  createDefinition('template-12', 'Tide Modern', 'Center-led resume with airy blue spacing.', 'centered', 'ocean', 'font-sans', 'standard', 'cards', 'center'),
  createDefinition('template-13', 'Elm Profile', 'Minimal green profile for product and operations roles.', 'minimal', 'emerald', 'font-sans', 'minimal', 'minimal', 'left'),
  createDefinition('template-14', 'Bronze Boardroom', 'Boardroom-style card layout with golden structure.', 'executive', 'amber', 'font-sans', 'cards', 'cards', 'left'),
  createDefinition('template-15', 'Blush Editorial', 'Magazine-inspired profile with pink editorial cues.', 'editorial', 'rose', 'font-serif', 'compact', 'standard', 'center'),
  createDefinition('template-16', 'Monograph', 'Single-column serif resume with timeless hierarchy.', 'classic', 'slate', 'font-serif', 'standard', 'compact', 'left'),
  createDefinition('template-17', 'Current', 'Blue split resume tuned for product and tech roles.', 'sidebar-left', 'ocean', 'font-sans', 'standard', 'cards', 'split'),
  createDefinition('template-18', 'Canopy', 'Nature-toned two-column resume with measured rhythm.', 'sidebar-right', 'emerald', 'font-sans', 'standard', 'standard', 'split'),
  createDefinition('template-19', 'Saffron Arc', 'Warm spotlight resume with premium visual framing.', 'spotlight', 'amber', 'font-sans', 'cards', 'compact', 'left'),
  createDefinition('template-20', 'Muse Panel', 'Creative card-based layout with expressive color bands.', 'cards', 'rose', 'font-sans', 'cards', 'cards', 'center'),
  createDefinition('template-21', 'Ledger Grid', 'Structured professional grid for consultants and analysts.', 'editorial', 'slate', 'font-sans', 'compact', 'compact', 'split'),
  createDefinition('template-22', 'Bayview', 'Centered ocean resume with strong summary treatment.', 'centered', 'ocean', 'font-serif', 'standard', 'cards', 'center'),
  createDefinition('template-23', 'Fieldstone', 'Minimal green resume built for readability in print.', 'minimal', 'emerald', 'font-serif', 'minimal', 'compact', 'left'),
  createDefinition('template-24', 'Amber Rail', 'Timeline resume with warm executive polish.', 'timeline', 'amber', 'font-sans', 'timeline', 'standard', 'split'),
  createDefinition('template-25', 'Petal Frame', 'Soft creative composition with centered masthead.', 'centered', 'rose', 'font-sans', 'cards', 'cards', 'center'),
  createDefinition('template-26', 'Civic Serif', 'Formal resume style with elegant traditional pacing.', 'classic', 'slate', 'font-serif', 'compact', 'compact', 'left'),
  createDefinition('template-27', 'Blue Harbor', 'Professional sidebar layout with bright callouts.', 'sidebar-left', 'ocean', 'font-sans', 'cards', 'cards', 'split'),
  createDefinition('template-28', 'Evergreen Brief', 'Green editorial layout with smart section cadence.', 'editorial', 'emerald', 'font-sans', 'compact', 'standard', 'left'),
  createDefinition('template-29', 'Marigold Executive', 'Senior-leadership format with bold accents and cards.', 'executive', 'amber', 'font-sans', 'cards', 'cards', 'split'),
  createDefinition('template-30', 'Studio Bloom', 'Color-led creative resume with layered content panels.', 'spotlight', 'rose', 'font-sans', 'cards', 'standard', 'left'),
  createDefinition('template-31', 'Slate Center', 'Centered profile for clean personal branding.', 'centered', 'slate', 'font-sans', 'standard', 'cards', 'center'),
  createDefinition('template-32', 'Signal Line', 'Timeline-forward modern layout in cool blue.', 'timeline', 'ocean', 'font-sans', 'timeline', 'standard', 'split'),
  createDefinition('template-33', 'Juniper Grid', 'Card-based green resume with strong project emphasis.', 'cards', 'emerald', 'font-sans', 'cards', 'cards', 'left'),
  createDefinition('template-34', 'Caramel Column', 'Warm single-column resume with premium whitespace.', 'classic', 'amber', 'font-serif', 'standard', 'standard', 'left'),
  createDefinition('template-35', 'Rose Column', 'Creative right-sidebar profile with elegant headings.', 'sidebar-right', 'rose', 'font-serif', 'compact', 'cards', 'split'),
  createDefinition('template-36', 'Graphite Sidebar', 'Sharp monochrome sidebar design for senior resumes.', 'sidebar-left', 'slate', 'font-sans', 'compact', 'compact', 'split'),
  createDefinition('template-37', 'Aqua Executive', 'Fresh corporate resume with clean blue paneling.', 'executive', 'ocean', 'font-sans', 'cards', 'cards', 'split'),
  createDefinition('template-38', 'Botanic Center', 'Centered green layout with polished contact framing.', 'centered', 'emerald', 'font-serif', 'standard', 'standard', 'center'),
  createDefinition('template-39', 'Citrine Ledger', 'Editorial amber resume with restrained modernism.', 'editorial', 'amber', 'font-sans', 'compact', 'compact', 'left'),
  createDefinition('template-40', 'Blush Timeline', 'Rose timeline layout for creative career stories.', 'timeline', 'rose', 'font-sans', 'timeline', 'standard', 'split'),
  createDefinition('template-41', 'Heritage', 'Classic formal resume with balanced serif hierarchy.', 'classic', 'slate', 'font-serif', 'standard', 'compact', 'left'),
  createDefinition('template-42', 'Current Two', 'Blue card-grid layout with strong section separation.', 'cards', 'ocean', 'font-sans', 'cards', 'cards', 'center'),
  createDefinition('template-43', 'Fern Outline', 'Compact green minimal design for modern ATS-safe output.', 'minimal', 'emerald', 'font-sans', 'minimal', 'minimal', 'left'),
  createDefinition('template-44', 'Ochre Board', 'Warm spotlight template with executive presence.', 'spotlight', 'amber', 'font-serif', 'cards', 'cards', 'split'),
  createDefinition('template-45', 'Rosette Modern', 'Refined rose sidebar layout for brand-forward resumes.', 'sidebar-right', 'rose', 'font-sans', 'standard', 'cards', 'split'),
  createDefinition('template-46', 'Meridian', 'Structured editorial template with premium contrast.', 'editorial', 'slate', 'font-sans', 'compact', 'compact', 'center'),
  createDefinition('template-47', 'Blue Crest', 'Centerpiece ocean resume for polished generalist roles.', 'centered', 'ocean', 'font-sans', 'standard', 'cards', 'center'),
  createDefinition('template-48', 'Spruce Timeline', 'Green timeline resume built for experience-heavy careers.', 'timeline', 'emerald', 'font-sans', 'timeline', 'compact', 'split'),
  createDefinition('template-49', 'Auric Profile', 'Elegant amber resume with layered main-content cards.', 'cards', 'amber', 'font-serif', 'cards', 'cards', 'left'),
  createDefinition('template-50', 'Velvet Studio', 'Polished rose creative template with striking asymmetry.', 'spotlight', 'rose', 'font-sans', 'cards', 'standard', 'left'),
];

function templateVars(resume: Resume) {
  return {
    ['--resume-accent' as string]: resume.theme.accentColor,
    ['--resume-primary' as string]: resume.theme.primaryColor,
    ['--resume-secondary' as string]: resume.theme.secondaryColor,
  } as CSSProperties;
}

function visibleSections(sections: Section[]) {
  return [...sections]
    .filter((section) => section.visible && section.items.length > 0)
    .sort((left, right) => left.order - right.order);
}

function pickSections(sections: Section[], types: Section['type'][]) {
  return sections.filter((section) => types.includes(section.type));
}

function renderContacts(resume: Resume, centered = false) {
  const { personalInfo } = resume;
  const contacts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean) as string[];

  if (contacts.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${
        centered ? 'justify-center' : 'justify-start'
      } text-[color:var(--resume-secondary)]`}
    >
      {contacts.map((entry) => (
        <span key={entry}>{entry}</span>
      ))}
    </div>
  );
}

function renderSummary(summary: string | undefined, palette: TemplatePalette, centered = false) {
  if (!summary) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-5 py-4 text-sm leading-7 ${palette.divider} ${palette.header} ${
        centered ? 'text-center' : ''
      }`}
    >
      {summary}
    </div>
  );
}

function renderSectionGroup(
  sections: Section[],
  palette: TemplatePalette,
  resume: Resume,
  variant: SectionVariant,
  headingAlign: 'left' | 'center' = 'left',
) {
  return sections.map((section) => (
    <SectionRenderer
      key={section.id}
      section={section}
      accentColor={resume.theme.accentColor}
      primaryColor={resume.theme.primaryColor}
      secondaryColor={resume.theme.secondaryColor}
      headingClassName={`mb-4 text-xs font-bold uppercase tracking-[0.35em] ${palette.heading}`}
      bodyClassName={palette.muted}
      variant={variant}
      chipClassName={palette.badge}
      surfaceClassName={palette.header}
      headingAlign={headingAlign}
    />
  ));
}

function renderTemplateLayout(definition: TemplateDefinition, resume: Resume) {
  const sections = visibleSections(resume.sections);
  const mainSections = pickSections(sections, ['experience', 'education', 'projects']);
  const sideSections = pickSections(sections, ['skills', 'certifications']);
  const palette = definition.palette;

  if (definition.layout === 'classic' || definition.layout === 'minimal' || definition.layout === 'editorial') {
    return (
      <div className={`mx-auto w-full max-w-5xl ${palette.shell} ${palette.page}`}>
        <div className={`border-b px-6 py-8 sm:px-10 ${palette.header} ${palette.divider}`}>
          <div className={definition.headerAlign === 'split' ? 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between' : ''}>
            <div className={definition.headerAlign === 'center' ? 'mx-auto text-center' : ''}>
              <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${palette.heading}`}>
                {resume.personalInfo.fullName || 'Your Name'}
              </h1>
              <p className={`mt-2 text-sm uppercase tracking-[0.32em] ${palette.muted}`}>
                {resume.personalInfo.jobTitle || 'Your Professional Title'}
              </p>
            </div>
            {definition.headerAlign === 'split' && renderContacts(resume)}
          </div>
          {definition.headerAlign !== 'split' && <div className="mt-4">{renderContacts(resume, definition.headerAlign === 'center')}</div>}
          <div className="mt-5">
            {renderSummary(resume.personalInfo.summary, palette, definition.headerAlign === 'center')}
          </div>
        </div>

        <div
          className={`px-6 py-8 sm:px-10 ${
            definition.layout === 'editorial'
              ? 'grid gap-8 lg:grid-cols-[1.3fr_0.7fr]'
              : definition.layout === 'minimal'
                ? 'space-y-8'
                : 'space-y-8'
          }`}
        >
          {definition.layout === 'editorial' ? (
            <>
              <div className="space-y-8">
                {renderSectionGroup(mainSections, palette, resume, definition.sectionVariant)}
              </div>
              <div className="space-y-8">
                {renderSectionGroup(sideSections, palette, resume, definition.skillVariant)}
              </div>
            </>
          ) : (
            renderSectionGroup(sections, palette, resume, definition.sectionVariant, definition.headerAlign === 'center' ? 'center' : 'left')
          )}
        </div>
      </div>
    );
  }

  if (definition.layout === 'sidebar-left' || definition.layout === 'sidebar-right') {
    const leftContent =
      definition.layout === 'sidebar-left'
        ? renderSectionGroup(sideSections, palette, resume, definition.skillVariant)
        : renderSectionGroup(mainSections, palette, resume, definition.sectionVariant);
    const rightContent =
      definition.layout === 'sidebar-left'
        ? renderSectionGroup(mainSections, palette, resume, definition.sectionVariant)
        : renderSectionGroup(sideSections, palette, resume, definition.skillVariant);

    return (
      <div className={`mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] ${palette.shell} ${palette.page}`}>
        <div className={`border-b px-6 py-8 sm:px-10 ${palette.header} ${palette.divider}`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.35em] ${palette.muted}`}>Resume</p>
              <h1 className={`mt-3 text-4xl font-bold tracking-tight sm:text-5xl ${palette.heading}`}>
                {resume.personalInfo.fullName || 'Your Name'}
              </h1>
              <p className={`mt-2 text-lg font-medium ${palette.heading}`}>
                {resume.personalInfo.jobTitle || 'Your Professional Title'}
              </p>
              <p className={`mt-3 max-w-2xl text-sm leading-7 ${palette.muted}`}>
                {resume.personalInfo.summary || 'Add a professional summary to introduce your background and strengths.'}
              </p>
            </div>
            {renderContacts(resume)}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.38fr_0.62fr]">
          <aside className={`space-y-8 px-6 py-8 sm:px-8 ${definition.layout === 'sidebar-left' ? palette.sidebar : palette.main}`}>
            {leftContent}
          </aside>
          <main className={`space-y-8 px-6 py-8 sm:px-10 ${definition.layout === 'sidebar-left' ? palette.main : palette.sidebar}`}>
            {rightContent}
          </main>
        </div>
      </div>
    );
  }

  if (definition.layout === 'centered') {
    return (
      <div className={`mx-auto w-full max-w-5xl rounded-[28px] ${palette.shell} ${palette.page}`}>
        <div className={`border-b px-6 py-10 sm:px-12 ${palette.header} ${palette.divider}`}>
          <div className="mx-auto max-w-3xl text-center">
            <p className={`text-xs font-semibold uppercase tracking-[0.38em] ${palette.muted}`}>{resume.title}</p>
            <h1 className={`mt-4 text-4xl font-bold tracking-tight sm:text-5xl ${palette.heading}`}>
              {resume.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className={`mt-2 text-lg font-medium ${palette.heading}`}>
              {resume.personalInfo.jobTitle || 'Your Professional Title'}
            </p>
            <div className="mt-4">{renderContacts(resume, true)}</div>
            <div className="mt-6">{renderSummary(resume.personalInfo.summary, palette, true)}</div>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">{renderSectionGroup(mainSections, palette, resume, definition.sectionVariant)}</div>
          <div className="space-y-8">{renderSectionGroup(sideSections, palette, resume, definition.skillVariant, 'center')}</div>
        </div>
      </div>
    );
  }

  if (definition.layout === 'timeline') {
    return (
      <div className={`mx-auto w-full max-w-5xl rounded-[28px] ${palette.shell} ${palette.page}`}>
        <div className={`border-b px-6 py-8 sm:px-10 ${palette.header} ${palette.divider}`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.34em] ${palette.muted}`}>Career Timeline</p>
              <h1 className={`mt-3 text-4xl font-bold tracking-tight sm:text-5xl ${palette.heading}`}>
                {resume.personalInfo.fullName || 'Your Name'}
              </h1>
              <p className={`mt-2 text-lg font-medium ${palette.heading}`}>
                {resume.personalInfo.jobTitle || 'Your Professional Title'}
              </p>
            </div>
            {renderContacts(resume)}
          </div>
          <div className="mt-6">{renderSummary(resume.personalInfo.summary, palette)}</div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="space-y-8">
            {renderSectionGroup(
              pickSections(sections, ['experience', 'projects', 'education']),
              palette,
              resume,
              'timeline',
            )}
          </div>
          <div className="space-y-8">
            {renderSectionGroup(sideSections, palette, resume, definition.skillVariant)}
          </div>
        </div>
      </div>
    );
  }

  if (definition.layout === 'executive') {
    return (
      <div className={`mx-auto w-full max-w-6xl overflow-hidden rounded-[30px] ${palette.shell} ${palette.page}`}>
        <div className={`px-6 py-10 text-white sm:px-10 ${palette.badge}`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70 dark:text-slate-700">
                Executive Resume
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                {resume.personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="mt-2 text-lg font-medium text-white/90 dark:text-slate-300">
                {resume.personalInfo.jobTitle || 'Your Professional Title'}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 dark:text-slate-800">
                {resume.personalInfo.summary || 'Use this space to summarize leadership impact, domain expertise, and measurable outcomes.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/80 dark:text-slate-800">
              {[
                resume.personalInfo.email,
                resume.personalInfo.phone,
                resume.personalInfo.location,
                resume.personalInfo.website,
              ]
                .filter(Boolean)
                .map((entry) => (
                  <span key={entry}>{entry}</span>
                ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">{renderSectionGroup(mainSections, palette, resume, 'cards')}</div>
          <div className="space-y-8">{renderSectionGroup(sideSections, palette, resume, 'cards')}</div>
        </div>
      </div>
    );
  }

  if (definition.layout === 'cards') {
    return (
      <div className={`mx-auto w-full max-w-6xl rounded-[30px] ${palette.shell} ${palette.page}`}>
        <div className={`border-b px-6 py-8 sm:px-10 ${palette.header} ${palette.divider}`}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.38em] ${palette.muted}`}>Portfolio Resume</p>
              <h1 className={`mt-3 text-4xl font-bold tracking-tight sm:text-5xl ${palette.heading}`}>
                {resume.personalInfo.fullName || 'Your Name'}
              </h1>
              <p className={`mt-2 text-lg font-medium ${palette.heading}`}>
                {resume.personalInfo.jobTitle || 'Your Professional Title'}
              </p>
            </div>
            {renderContacts(resume)}
          </div>
        </div>

        <div className="space-y-8 px-6 py-8 sm:px-10">
          {renderSummary(resume.personalInfo.summary, palette)}
          <div className="grid gap-8 xl:grid-cols-2">
            {renderSectionGroup(sections, palette, resume, 'cards')}
          </div>
        </div>
      </div>
    );
  }

  if (definition.layout === 'spotlight') {
    return (
      <div className={`mx-auto w-full max-w-6xl overflow-hidden rounded-[30px] ${palette.shell} ${palette.page}`}>
        <div className="grid lg:grid-cols-[120px_1fr]">
          <div className="hidden bg-[color:var(--resume-accent)] lg:block" />
          <div>
            <div className={`border-b px-6 py-8 sm:px-10 ${palette.header} ${palette.divider}`}>
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.4em] ${palette.muted}`}>Creative Profile</p>
                  <h1 className={`mt-3 text-4xl font-bold tracking-tight sm:text-5xl ${palette.heading}`}>
                    {resume.personalInfo.fullName || 'Your Name'}
                  </h1>
                  <p className={`mt-2 text-lg font-medium ${palette.heading}`}>
                    {resume.personalInfo.jobTitle || 'Your Professional Title'}
                  </p>
                  <p className={`mt-4 max-w-2xl text-sm leading-7 ${palette.muted}`}>
                    {resume.personalInfo.summary || 'Add a punchy summary that captures your point of view, craft, and measurable impact.'}
                  </p>
                </div>
                <div className="lg:min-w-[240px]">{renderContacts(resume)}</div>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-8">
                {renderSectionGroup(mainSections, palette, resume, definition.sectionVariant)}
              </div>
              <div className="space-y-8">
                {renderSectionGroup(sideSections, palette, resume, definition.skillVariant)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (definition.layout === 'premium-executive') {
    return (
      <div className={`mx-auto w-full max-w-4xl ${palette.shell} ${palette.page}`}>
        {/* Premium Executive Header */}
        <div className={`relative overflow-hidden ${palette.header} ${palette.divider}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-amber-50/10 dark:from-amber-900/20 dark:to-amber-950/10"></div>
          <div className="relative px-8 py-10 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold">
                Executive Resume
              </div>
            </div>
            <h1 className={`text-5xl font-bold tracking-tight ${palette.heading} mb-3`}>
              {resume.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className={`text-2xl font-medium ${palette.heading} mb-4`}>
              {resume.personalInfo.jobTitle || 'Your Professional Title'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              {[
                resume.personalInfo.email,
                resume.personalInfo.phone,
                resume.personalInfo.location,
                resume.personalInfo.linkedin,
                resume.personalInfo.website,
              ].filter(Boolean).map((contact, index) => (
                <span key={index} className={palette.muted}>
                  {contact}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Executive Content */}
        <div className="px-8 py-10">
          <div className="mb-8">
            {renderSummary(resume.personalInfo.summary, palette, true)}
          </div>
          
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              {renderSectionGroup(mainSections, palette, resume, 'premium')}
            </div>
            <div className="space-y-10">
              {renderSectionGroup(sideSections, palette, resume, 'premium')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (definition.layout === 'premium-creative') {
    return (
      <div className={`mx-auto w-full max-w-4xl ${palette.shell} ${palette.page}`}>
        {/* Premium Creative Header */}
        <div className={`relative overflow-hidden ${palette.header} ${palette.divider}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/10 to-indigo-100/20 dark:from-purple-900/20 dark:via-pink-950/10 dark:to-indigo-900/20"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="flex-1">
                <div className="mb-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold">
                    Creative Professional
                  </div>
                </div>
                <h1 className={`text-5xl font-bold tracking-tight ${palette.heading} mb-3`}>
                  {resume.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className={`text-2xl font-medium ${palette.heading} mb-4`}>
                  {resume.personalInfo.jobTitle || 'Your Professional Title'}
                </p>
                <div className="prose prose-lg max-w-none">
                  {renderSummary(resume.personalInfo.summary, palette, false)}
                </div>
              </div>
              <div className="lg:min-w-[300px]">
                <div className={`rounded-2xl p-6 ${palette.sidebar} ${palette.divider} border`}>
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${palette.heading}`}>
                    Contact
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      resume.personalInfo.email,
                      resume.personalInfo.phone,
                      resume.personalInfo.location,
                      resume.personalInfo.linkedin,
                      resume.personalInfo.website,
                      resume.personalInfo.github,
                    ].filter(Boolean).map((contact, index) => (
                      <div key={index} className={palette.muted}>
                        {contact}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Creative Content */}
        <div className="px-8 py-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-12">
              {renderSectionGroup(
                pickSections(sections, ['experience', 'education']),
                palette,
                resume,
                'premium-creative'
              )}
            </div>
            <div className="space-y-12">
              {renderSectionGroup(
                pickSections(sections, ['skills', 'projects', 'certifications']),
                palette,
                resume,
                'premium-creative'
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Final fallback for any unhandled layout types
  return (
    <div className={`mx-auto w-full max-w-5xl ${palette.shell} ${palette.page}`}>
       <div className="p-10 text-center">
         <h1 className={`text-4xl font-bold ${palette.heading}`}>{resume.personalInfo.fullName}</h1>
         <p className={palette.muted}>Layout not implemented for this template.</p>
       </div>
    </div>
  );
}

export function createTemplateComponent(templateId: string): TemplateComponent | null {
  const definition = TEMPLATE_DEFINITIONS.find((template) => template.id === templateId);

  if (!definition) {
    console.error(`Template definition not found for id: ${templateId}`);
    return null;
  }

  const TemplateComponent = ({ resume }: { resume: Resume }) => {
    try {
      return (
        <div
          className={`w-full print:bg-white ${definition.fontClassName}`}
          style={templateVars(resume)}
        >
          {renderTemplateLayout(definition, resume)}
        </div>
      );
    } catch (error) {
      console.error(`Error rendering template ${templateId}:`, error);
      return (
        <div className="w-full p-8 text-center text-red-500">
          <p>Error loading template</p>
          <p className="text-sm">Template ID: {templateId}</p>
        </div>
      );
    }
  };

  TemplateComponent.displayName = `${definition.name.replace(/\s+/g, '')}Template`;

  return TemplateComponent;
}