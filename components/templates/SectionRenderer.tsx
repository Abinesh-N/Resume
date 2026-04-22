'use client';

import {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  Section,
  SkillItem,
} from '@/lib/types/resume';
import { MarkdownRenderer } from './MarkdownRenderer';

type SectionVariant = 'standard' | 'timeline' | 'cards' | 'compact' | 'minimal' | 'premium' | 'premium-creative';

interface SectionRendererProps {
  section: Section;
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  headingClassName: string;
  bodyClassName?: string;
  variant?: SectionVariant;
  chipClassName?: string;
  surfaceClassName?: string;
  headingAlign?: 'left' | 'center';
}

function rgba(input: string, alpha: number) {
  const hex = input.trim().replace('#', '');
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : hex;

  if (!/^[\da-fA-F]{6}$/.test(normalized)) {
    return `rgba(15, 23, 42, ${alpha})`;
  }

  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function formatRange(start: string, end?: string, current?: boolean) {
  if (!start && !end) {
    return '';
  }

  if (current) {
    return `${start} - Present`;
  }

  return end ? `${start} - ${end}` : start;
}

function normalizeLink(link: string) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link;
  }

  return `https://${link}`;
}

export function SectionRenderer({
  section,
  accentColor,
  primaryColor,
  secondaryColor,
  headingClassName,
  bodyClassName = '',
  variant = 'standard',
  chipClassName = '',
  surfaceClassName = '',
  headingAlign = 'left',
}: SectionRendererProps) {
  if (!section.visible || section.items.length === 0) {
    return null;
  }

  const headingAlignmentClass = headingAlign === 'center' ? 'text-center' : '';
  const wrapperClass =
    variant === 'cards'
      ? 'grid gap-4 sm:grid-cols-2'
      : variant === 'compact'
        ? 'space-y-3'
        : variant === 'premium'
          ? 'space-y-6'
          : variant === 'premium-creative'
            ? 'space-y-8'
            : 'space-y-4';

  const itemSurfaceStyle =
    variant === 'cards'
      ? {
          borderColor: rgba(accentColor, 0.2),
          backgroundColor: rgba(accentColor, 0.06),
        }
      : undefined;

  return (
    <section className="break-inside-avoid">
      <h2
        className={`${headingClassName} ${headingAlignmentClass}`.trim()}
        style={{ color: accentColor }}
      >
        {section.title}
      </h2>

      <div className={`${wrapperClass} ${bodyClassName}`.trim()}>
        {section.type === 'experience' &&
          (section.items as ExperienceItem[]).map((item) => (
            <article
              key={item.id}
              className={
                variant === 'timeline'
                  ? 'relative border-l pl-5'
                  : variant === 'cards'
                    ? `rounded-2xl border p-4 ${surfaceClassName}`.trim()
                    : variant === 'compact'
                      ? 'border-b pb-3 last:border-b-0 last:pb-0'
                      : variant === 'minimal'
                        ? ''
                        : variant === 'premium'
                          ? 'rounded-2xl border-l-4 p-6 shadow-sm'
                          : variant === 'premium-creative'
                            ? 'rounded-3xl border-2 p-6 shadow-lg transform hover:scale-[1.02] transition-transform'
                            : 'rounded-xl border p-4'
              }
              style={
                variant === 'timeline'
                  ? { borderColor: rgba(accentColor, 0.35) }
                  : variant === 'cards'
                    ? itemSurfaceStyle
                    : variant === 'compact' || variant === 'minimal'
                      ? { borderColor: rgba(accentColor, 0.18) }
                      : {
                          borderColor: rgba(accentColor, 0.16),
                          backgroundColor: rgba(accentColor, 0.03),
                        }
              }
            >
              {variant === 'timeline' && (
                <span
                  className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 bg-white dark:bg-slate-950"
                  style={{ borderColor: accentColor }}
                />
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold" style={{ color: primaryColor }}>
                    {item.position}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: secondaryColor }}>
                    {item.company}
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: secondaryColor }}>
                  {formatRange(item.startDate, item.endDate, item.currentlyWorking)}
                </p>
              </div>

              <MarkdownRenderer
                content={item.description}
                className="mt-3 text-sm leading-6"
              />
            </article>
          ))}

        {section.type === 'education' &&
          (section.items as EducationItem[]).map((item) => (
            <article
              key={item.id}
              className={
                variant === 'cards'
                  ? `rounded-2xl border p-4 ${surfaceClassName}`.trim()
                  : variant === 'compact'
                    ? 'border-b pb-3 last:border-b-0 last:pb-0'
                    : 'space-y-1'
              }
              style={
                variant === 'cards'
                  ? itemSurfaceStyle
                  : variant === 'compact'
                    ? { borderColor: rgba(accentColor, 0.18) }
                    : undefined
              }
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold" style={{ color: primaryColor }}>
                    {item.degree}
                    {item.field ? ` in ${item.field}` : ''}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: secondaryColor }}>
                    {item.school}
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: secondaryColor }}>
                  {item.graduationDate}
                </p>
              </div>
              {item.gpa && (
                <p className="text-sm" style={{ color: secondaryColor }}>
                  GPA: {item.gpa}
                </p>
              )}
            </article>
          ))}

        {section.type === 'skills' && (
          <div className="flex flex-wrap gap-2.5">
            {(section.items as SkillItem[]).map((item) => (
              <span
                key={item.id}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${chipClassName}`.trim()}
                style={{
                  color: primaryColor,
                  backgroundColor: rgba(accentColor, variant === 'minimal' ? 0.08 : 0.14),
                  borderColor: rgba(accentColor, 0.2),
                }}
              >
                {item.name}
              </span>
            ))}
          </div>
        )}

        {section.type === 'projects' &&
          (section.items as ProjectItem[]).map((item) => (
            <article
              key={item.id}
              className={
                variant === 'cards'
                  ? `rounded-2xl border p-4 ${surfaceClassName}`.trim()
                  : variant === 'compact'
                    ? 'border-b pb-3 last:border-b-0 last:pb-0'
                    : 'space-y-2'
              }
              style={
                variant === 'cards'
                  ? itemSurfaceStyle
                  : variant === 'compact'
                    ? { borderColor: rgba(accentColor, 0.18) }
                    : undefined
              }
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold" style={{ color: primaryColor }}>
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: secondaryColor }}>
                    {item.technologies}
                  </p>
                </div>
                {item.link && (
                  <a
                    href={normalizeLink(item.link)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold uppercase tracking-[0.18em] hover:underline"
                    style={{ color: accentColor }}
                  >
                    View project
                  </a>
                )}
              </div>

              <MarkdownRenderer
                content={item.description}
                className="text-sm leading-6"
              />
            </article>
          ))}

        {section.type === 'certifications' &&
          (section.items as CertificationItem[]).map((item) => (
            <article
              key={item.id}
              className={
                variant === 'cards'
                  ? `rounded-2xl border p-4 ${surfaceClassName}`.trim()
                  : variant === 'compact'
                    ? 'border-b pb-3 last:border-b-0 last:pb-0'
                    : 'space-y-1'
              }
              style={
                variant === 'cards'
                  ? itemSurfaceStyle
                  : variant === 'compact'
                    ? { borderColor: rgba(accentColor, 0.18) }
                    : undefined
              }
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold" style={{ color: primaryColor }}>
                    {item.name}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: secondaryColor }}>
                    {item.issuer}
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: secondaryColor }}>
                  {formatRange(item.issueDate, item.expirationDate)}
                </p>
              </div>

              {item.credentialId && (
                <p className="text-sm" style={{ color: secondaryColor }}>
                  Credential ID: {item.credentialId}
                </p>
              )}

              {item.credentialUrl && (
                <a
                  href={normalizeLink(item.credentialUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.18em] hover:underline"
                  style={{ color: accentColor }}
                >
                  Verify credential
                </a>
              )}
            </article>
          ))}
      </div>
    </section>
  );
}
