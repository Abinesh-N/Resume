# Resume Builder - Comprehensive Code Review Report
**Date**: April 22, 2026  
**Framework**: Next.js 16 + React 19 + TypeScript  
**Total Issues Found**: 15 (4 Critical, 3 Medium, 8 Accessibility)

---

## 🔴 CRITICAL ISSUES (Must Fix Immediately - Data Loss / Runtime Errors)

### 1. **API Returns Success on Database Failure**
**Location**: [app/api/resumes/save/route.ts](app/api/resumes/save/route.ts#L19)  
**Severity**: 🔴 CRITICAL - Data Loss Risk  
**Lines**: 19, 21

**Problem**:
```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: true, message: 'Resume saved locally' }); // ❌ LINE 10
    }
    const resume = await request.json();
    const saved = await saveResume(user.id, resume);
    return NextResponse.json({ success: true, data: saved }); // ✓ OK
  } catch (error) {
    console.error('Save resume error:', error);
    return NextResponse.json({ success: true, message: 'Resume saved locally' }); // ❌ LINE 19 - CRITICAL BUG!
  }
}
```

**Why It's a Problem**:
- The API returns `success: true` even when the database save **fails** (line 19)
- The frontend receives success signal and clears localStorage-only data
- User thinks data is safely saved to the database, but it's only in localStorage
- If localStorage is cleared or browser data is reset, the resume is **permanently lost**
- This is a classic "silent failure" bug that can frustrate users

**Fix**:
```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    // If not authenticated, return error (don't save)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated. Resume saved locally only.' },
        { status: 401 }
      );
    }

    const resume = await request.json();
    const saved = await saveResume(user.id, resume);

    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'Failed to save resume to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('Save resume error:', error);
    // ✅ Return proper error instead of success
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to save resume'
      },
      { status: 500 }
    );
  }
}
```

**Frontend Handler** (update error handling in useResume.ts):
```typescript
const saveToDB = async (resume: Resume) => {
  const response = await fetch('/api/resumes/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resume),
  });

  const data = await response.json();

  // ✅ Check success flag AND response status
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to save resume');
  }

  return data;
};
```

---

### 2. **React List Rendering: Using Array Index as Key**
**Location**: [components/dashboard/LoadingSkeleton.tsx](components/dashboard/LoadingSkeleton.tsx#L65), [components/dashboard/ResumesList.tsx](components/dashboard/ResumesList.tsx#L65)  
**Severity**: 🔴 CRITICAL - Rendering Bugs  
**Lines**: LoadingSkeleton 65, ResumesList 65

**Problem - LoadingSkeleton.tsx**:
```typescript
export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <StatsCardSkeleton key={i} />  {/* ❌ CRITICAL: key={i} - React anti-pattern */}
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <TemplateCardSkeleton key={i} />  {/* ❌ key={i} */}
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Problem - ResumesList.tsx**:
```typescript
if (isLoading) {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}  {/* ❌ CRITICAL: key={i} */}
            className="h-16 rounded bg-slate-200 animate-pulse dark:bg-slate-700"
          />
        ))}
      </div>
    </Card>
  );
}
```

**Why It's a Problem**:
- React uses the `key` prop to identify which items have changed, been added, or been removed
- Using the array index as a key is an anti-pattern because:
  - If list is reordered, the keys don't match the data anymore
  - If list items are deleted and new ones added, old DOM nodes are reused with new data
  - Causes state to be lost, animations to break, and wrong data to display
- In LoadingSkeleton, this causes skeleton cards to flash incorrectly
- In ResumesList, if a resume is deleted, another resume might show the deleted one's data temporarily

**Fix - LoadingSkeleton.tsx**:
```typescript
export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <StatsCardSkeleton key={`stat-skeleton-${i}`} />  {/* ✅ Unique stable key */}
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <TemplateCardSkeleton key={`template-skeleton-${i}`} />  {/* ✅ Unique stable key */}
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Fix - ResumesList.tsx**:
```typescript
if (isLoading) {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={`resume-loading-${i}`}  {/* ✅ Unique stable key */}
            className="h-16 rounded bg-slate-200 animate-pulse dark:bg-slate-700"
          />
        ))}
      </div>
    </Card>
  );
}
```

---

### 3. **Missing Error Boundary for Template Rendering**
**Location**: [components/editor/PreviewPanel.tsx](components/editor/PreviewPanel.tsx#L190)  
**Severity**: 🔴 CRITICAL - Page Crash Risk  
**Lines**: 190, and overall component

**Problem**:
```typescript
export function PreviewPanel({ resume, className = "" }: PreviewPanelProps) {
  // ... state management ...

  return (
    <div className={`w-full h-full bg-slate-50 dark:bg-slate-950 flex flex-col ${className}`}>
      {/* Header and controls... */}
      
      {/* Preview Container */}
      <div className={`w-full h-full ${viewMode === 'mobile' ? 'max-w-md mx-auto' : ''}`}>
        <ResumePreview 
          resume={resume} 
          scale={scale} 
          showBackground={false}
          className="w-full h-full"
        />  {/* ❌ NO ERROR BOUNDARY - Template error crashes entire page */}
      </div>
    </div>
  );
}
```

**Why It's a Problem**:
- If any template component throws an error (e.g., rendering issue, missing data), React unmounts the entire component tree
- The entire editor page crashes, and the user loses all unsaved work
- No graceful fallback to show what went wrong
- Users will see a blank page with no context about the error

**Fix** - Create an Error Boundary component:
```typescript
// components/editor/TemplateErrorBoundary.tsx
'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  templateId: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TemplateErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error rendering template ${this.props.templateId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-950 p-6">
          <div className="text-center max-w-md">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Template Error
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Failed to render template. Please try selecting a different template.
            </p>
            <details className="text-left text-xs text-red-600 dark:text-red-400 bg-white dark:bg-red-900/20 p-3 rounded">
              <summary className="cursor-pointer font-semibold">Error details</summary>
              <pre className="mt-2 overflow-auto text-red-600 dark:text-red-300">
                {this.state.error?.message}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Update PreviewPanel to use it**:
```typescript
import { TemplateErrorBoundary } from './TemplateErrorBoundary';

export function PreviewPanel({ resume, className = "" }: PreviewPanelProps) {
  return (
    <div className={`w-full h-full bg-slate-50 dark:bg-slate-950 flex flex-col ${className}`}>
      {/* Header and controls... */}
      
      {/* Preview Container with Error Boundary */}
      <div className={`w-full h-full ${viewMode === 'mobile' ? 'max-w-md mx-auto' : ''}`}>
        <TemplateErrorBoundary templateId={resume.templateId}>
          <ResumePreview 
            resume={resume} 
            scale={scale} 
            showBackground={false}
            className="w-full h-full"
          />
        </TemplateErrorBoundary>
      </div>
    </div>
  );
}
```

---

### 4. **Template Component Returns Null**
**Location**: [components/templates/templateSystem.tsx](components/templates/templateSystem.tsx#L713)  
**Severity**: 🔴 CRITICAL - Potential Runtime Error  
**Lines**: 713

**Problem**:
```typescript
export function createTemplateComponent(templateId: string): TemplateComponent | null {
  const definition = TEMPLATE_DEFINITIONS.find((template) => template.id === templateId);

  if (!definition) {
    console.error(`Template definition not found for id: ${templateId}`);
    return null;  // ❌ Returns null - causes issues when rendered
  }

  const TemplateComponent = ({ resume }: { resume: Resume }) => {
    // ... component logic ...
  };

  return TemplateComponent;
}
```

**Why It's a Problem**:
- When `createTemplateComponent()` returns `null`, it's stored in the TEMPLATES array
- Later, in ResumePreview, trying to render `null` as a component causes errors
- This can happen if templateId doesn't exist (e.g., invalid URL parameter)

**Fix**:
```typescript
export function createTemplateComponent(templateId: string): TemplateComponent {
  const definition = TEMPLATE_DEFINITIONS.find((template) => template.id === templateId);

  // ✅ Always return a valid component, even if template not found
  const TemplateComponent = ({ resume }: { resume: Resume }) => {
    if (!definition) {
      return (
        <div className="w-full p-12 text-center">
          <div className="text-red-600 font-semibold mb-2">Template Not Found</div>
          <p className="text-sm text-slate-600">
            Template ID: {templateId}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Please select a different template from the dropdown.
          </p>
        </div>
      );
    }

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

  TemplateComponent.displayName = `Template${templateId.replace(/-/g, '_')}`;

  return TemplateComponent;  // ✅ Always returns a valid component
}
```

**Update ResumePreview.tsx**:
```typescript
export function ResumePreview({ resume, scale = 0.8, showBackground = true, className = "" }: ResumePreviewProps) {
  const renderTemplate = () => {
    const template = TEMPLATES.find((t) => t.id === resume.templateId);
    
    if (!template) {
      // ✅ Use first template as fallback, but don't render null
      const fallbackTemplate = TEMPLATES[0];
      const FallbackComponent = fallbackTemplate.component;
      return FallbackComponent ? <FallbackComponent resume={resume} /> : null;
    }
    
    const TemplateComponent = template.component;
    if (!TemplateComponent) {
      // ✅ Proper fallback - never render null
      return <div className="p-8 text-center text-slate-500">Template component not available</div>;
    }
    
    return <TemplateComponent resume={resume} />;
  };

  // ... rest of component ...
}
```

---

## ⚠️ MEDIUM PRIORITY ISSUES (Should Fix Soon)

### 5. **Auto-Save Logic Mismatch: Simulated Save vs Actual DB Save**
**Location**: [app/editor/page.tsx](app/editor/page.tsx#L48-L57), [lib/hooks/useResume.ts](lib/hooks/useResume.ts#L48)  
**Severity**: ⚠️ MEDIUM - UX Issue  
**Lines**: EditorPage 48-57, useResume 48

**Problem**:
```typescript
// EditorPage.tsx - Simulates save at 1 second
useEffect(() => {
  if (resume) {
    setIsSaving(true);
    const timer = setTimeout(() => {
      setLastSaved(new Date());  // ✅ This updates UI at 1 second
      setIsSaving(false);
    }, 1000);  // ❌ 1 SECOND
    return () => clearTimeout(timer);
  }
}, [resume]);

// useResume.ts - Actually saves to DB at 3 seconds
useEffect(() => {
  if (resume && !isLoading) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToDB(resume).catch((error) => {  // ❌ 3 SECONDS DELAY
        console.error('Failed to save resume to database:', error);
      });
    }, SAVE_DELAY);  // SAVE_DELAY = 3000
  }
  // ...
}, [resume, isLoading]);
```

**Why It's a Problem**:
- The UI shows "Saving..." immediately and then "Saved" at 1 second
- But the actual database save doesn't happen until 3 seconds
- If user closes the browser between 1-3 seconds, the UI says "Saved" but DB hasn't saved yet
- User perceives data is safe, but it's still pending
- If network is slow, DB save might fail after UI already shows success

**Fix**:
```typescript
// EditorPage.tsx - Remove simulated save, use actual save status
const [isSaving, setIsSaving] = useState(false);
const [lastSaved, setLastSaved] = useState<Date | undefined>();
const [saveError, setSaveError] = useState<string | null>(null);

// Modify useResume to return save status
export function useResume() {
  // ... existing state ...
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update save to DB to track status
  const saveToDB = async (resume: Resume) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/resumes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save');
      }

      setLastSaved(new Date());  // ✅ Only update after actual success
      return data;
    } catch (error) {
      console.error('Failed to save resume:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // ... existing returns ...
    isSaving,
    lastSaved,
  };
}

// EditorPage.tsx - Use actual save status
export default function EditorPage() {
  const {
    resume,
    isLoading,
    updateResume,
    isSaving,      // ✅ Use from hook
    lastSaved,     // ✅ Use from hook
    // ... other methods ...
  } = useResume();

  // ✅ No need for simulated save anymore
  // The hook handles all save timing

  // ... rest of component ...
}
```

---

### 6. **Missing Suspense Boundary for useSearchParams()**
**Location**: [app/editor/page.tsx](app/editor/page.tsx#L14)  
**Severity**: ⚠️ MEDIUM - Next.js Best Practice  
**Lines**: 14

**Problem**:
```typescript
'use client';

import { useSearchParams } from 'next/navigation';

export default function EditorPage() {
  const searchParams = useSearchParams();  // ❌ Should be in Suspense boundary
  const templateId = searchParams.get('templateId');
  
  // ... component code ...
}
```

**Why It's a Problem**:
- `useSearchParams()` should be wrapped in `<Suspense>` boundary per Next.js best practices
- Without Suspense, it can cause hydration mismatch errors in some cases
- The component might re-render unexpectedly on the client side

**Fix** - Create a wrapper component:
```typescript
// components/editor/EditorPageContent.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useResume } from '@/lib/hooks/useResume';
import { TEMPLATES } from '@/components/templates';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { ResponsiveLayout } from '@/components/editor/ResponsiveLayout';

export function EditorPageContent() {
  const searchParams = useSearchParams();  // ✅ Now inside Suspense
  const templateId = searchParams.get('templateId');
  
  // ... rest of existing EditorPage code ...
}

// app/editor/page.tsx
import { Suspense } from 'react';
import { EditorPageContent } from '@/components/editor/EditorPageContent';

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoadingFallback />}>
      <EditorPageContent />
    </Suspense>
  );
}

function EditorLoadingFallback() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading editor...</p>
      </div>
    </div>
  );
}
```

---

### 7. **Missing Form Label Association (htmlFor attribute)**
**Location**: [components/resume/PersonalInfoForm.tsx](components/resume/PersonalInfoForm.tsx#L25-L80)  
**Severity**: ⚠️ MEDIUM - Accessibility  
**Lines**: 25, 33, 41, 47, 53, 62

**Problem**:
```typescript
export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  return (
    <Card className="p-6 space-y-5 border shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground">Full Name *</label>
          {/* ❌ NO htmlFor attribute - screen readers can't link label to input */}
          <Input
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">Professional Title *</label>
          {/* ❌ NO htmlFor */}
          <Input
            value={data.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="Senior Software Engineer"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email *</label>
            {/* ❌ NO htmlFor */}
            <Input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
```

**Why It's a Problem**:
- Screen readers can't associate labels with inputs
- Users relying on assistive technology won't know what each field is for
- Clicking on the label doesn't focus the input field
- Violates WCAG 2.1 accessibility guidelines

**Fix**:
```typescript
export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <Card className="p-6 space-y-5 border shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Your contact details and professional overview</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="text-sm font-semibold text-foreground">
            Full Name *
          </label>
          <Input
            id="fullName"  {/* ✅ Add id */}
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="mt-2"
          />
        </div>

        <div>
          <label htmlFor="jobTitle" className="text-sm font-semibold text-foreground">
            Professional Title *
          </label>
          <Input
            id="jobTitle"  {/* ✅ Add id */}
            value={data.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="Senior Software Engineer"
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email *
            </label>
            <Input
              id="email"  {/* ✅ Add id */}
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone *
            </label>
            <Input
              id="phone"  {/* ✅ Add id */}
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="text-sm font-medium text-foreground">
            Location *
          </label>
          <Input
            id="location"  {/* ✅ Add id */}
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="summary" className="text-sm font-medium text-foreground">
            Professional Summary
          </label>
          <Textarea
            id="summary"  {/* ✅ Add id */}
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Brief professional overview..."
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
}
```

---

## ♿ ACCESSIBILITY ISSUES (Must Fix for WCAG Compliance)

### 8-15. **Missing aria-labels on Icon Buttons**
**Location**: [components/editor/PreviewPanel.tsx](components/editor/PreviewPanel.tsx#L85-L135)  
**Severity**: ♿ Accessibility - WCAG 2.1 Level A  
**Lines**: 85, 100, 115, 122, 132, 60, 70, 80

**Problem**:
```typescript
{/* All these buttons have no aria-labels */}
<Button
  variant="ghost"
  size="sm"
  onClick={handleZoomOut}
  className="h-8 w-8 p-0"
>
  <ZoomOut className="w-4 h-4" />  {/* ❌ Icon only, no screen reader label */}
</Button>

<Button
  variant="ghost"
  size="sm"
  onClick={handleResetZoom}
  className="gap-2"
>
  <RotateCw className="w-4 h-4" />  {/* ❌ No aria-label */}
  Reset
</Button>

<Button
  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
  size="sm"
  onClick={() => setViewMode('desktop')}
  className="gap-2"
>
  <Monitor className="w-4 h-4" />  {/* ❌ Could use better aria-label */}
  Desktop
</Button>
```

**Why It's a Problem**:
- Icon-only buttons are inaccessible to screen reader users
- Screen readers can't determine button purpose without a label
- Violates WCAG 2.1 Level A accessibility guidelines
- Users with visual impairments can't understand button functions

**Fix - Add aria-labels to all icon buttons**:
```typescript
<Button
  variant="ghost"
  size="sm"
  onClick={handleZoomOut}
  aria-label="Zoom out preview"  {/* ✅ Add aria-label */}
  disabled={currentZoomIndex === 0}
  className="h-8 w-8 p-0"
>
  <ZoomOut className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  onClick={handleZoomIn}
  aria-label="Zoom in preview"  {/* ✅ Add aria-label */}
  disabled={currentZoomIndex === zoomLevels.length - 1}
  className="h-8 w-8 p-0"
>
  <ZoomIn className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  onClick={handleResetZoom}
  aria-label="Reset zoom to default"  {/* ✅ Add aria-label */}
  className="gap-2"
>
  <RotateCw className="w-4 h-4" />
  Reset
</Button>

<Button
  variant="ghost"
  size="sm"
  onClick={handleFitToScreen}
  aria-label="Fit preview to screen"  {/* ✅ Add aria-label */}
  className="gap-2"
>
  <Maximize2 className="w-4 h-4" />
  Fit
</Button>

<Button
  variant="outline"
  size="sm"
  onClick={() => setShowGrid(!showGrid)}
  aria-label={showGrid ? "Hide grid overlay" : "Show grid overlay"}  {/* ✅ Add dynamic aria-label */}
  aria-pressed={showGrid}  {/* ✅ Toggle button semantic */}
  className={showGrid ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''}
>
  Grid
</Button>

{/* View Mode Toggle */}
<Button
  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
  size="sm"
  onClick={() => setViewMode('desktop')}
  aria-label="View desktop preview"  {/* ✅ Add aria-label */}
  aria-pressed={viewMode === 'desktop'}  {/* ✅ Semantic toggle */}
  className="gap-2"
>
  <Monitor className="w-4 h-4" />
  Desktop
</Button>

<Button
  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
  size="sm"
  onClick={() => setViewMode('mobile')}
  aria-label="View mobile preview"  {/* ✅ Add aria-label */}
  aria-pressed={viewMode === 'mobile'}  {/* ✅ Semantic toggle */}
  className="gap-2"
>
  <Smartphone className="w-4 h-4" />
  Mobile
</Button>
```

---

## 📊 Issue Summary Table

| # | Issue | Severity | Category | File(s) | Line(s) | Fix Difficulty |
|---|-------|----------|----------|---------|---------|-----------------|
| 1 | API returns success on DB failure | 🔴 CRITICAL | Data Loss | api/resumes/save/route.ts | 19, 21 | Medium |
| 2 | Array index keys in lists | 🔴 CRITICAL | React | LoadingSkeleton, ResumesList | 65 | Easy |
| 3 | No error boundary for templates | 🔴 CRITICAL | Error Handling | PreviewPanel.tsx | 190 | Hard |
| 4 | Template returns null | 🔴 CRITICAL | Runtime Error | templateSystem.tsx | 713 | Medium |
| 5 | Auto-save timing mismatch | ⚠️ MEDIUM | UX Logic | EditorPage, useResume | 48-57 | Medium |
| 6 | Missing Suspense boundary | ⚠️ MEDIUM | Next.js Best Practice | EditorPage.tsx | 14 | Easy |
| 7 | Missing form label associations | ⚠️ MEDIUM | Accessibility | PersonalInfoForm.tsx | 25-80 | Easy |
| 8-15 | Missing aria-labels | ♿ A11Y | Accessibility | PreviewPanel.tsx | 85-135 | Easy |

---

## ✅ Implementation Priority

1. **Immediate (Today)**:
   - Fix #1: API success/error handling (prevents data loss)
   - Fix #2: List key props (prevents rendering bugs)
   - Fix #4: Template null check (prevents crashes)

2. **This Week**:
   - Fix #3: Error boundary (prevents page crashes)
   - Fix #5: Auto-save timing (UX improvement)
   - Fix #6: Suspense boundary (Next.js best practice)

3. **This Sprint**:
   - Fix #7: Form label associations (accessibility)
   - Fix #8-15: aria-labels (accessibility)

---

## 🧪 Testing Checklist

After implementing fixes, test:

- [ ] **Data Persistence**: Create resume, refresh page, verify data is still there
- [ ] **Error Handling**: Invalid template ID in URL doesn't crash page
- [ ] **List Management**: Add/delete resumes, verify correct items display
- [ ] **Auto-save**: Make changes, verify "Saved" status updates accurately
- [ ] **Accessibility**: Test with screen reader (NVDA/JAWS), all buttons and inputs should be labeled
- [ ] **Mobile Preview**: Toggle desktop/mobile, preview should render correctly
- [ ] **Keyboard Navigation**: Tab through form, buttons should be accessible

---

## 📚 References

- React Keys: https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
- Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- WCAG 2.1 Accessibility: https://www.w3.org/WAI/WCAG21/quickref/
- Next.js useSearchParams: https://nextjs.org/docs/app/api-reference/functions/use-search-params
- Form Accessibility: https://www.w3.org/WAI/tutorials/forms/

