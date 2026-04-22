'use client';

import { PersonalInfo } from '@/lib/types/resume';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (updates: Partial<PersonalInfo>) => void;
}

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
          <label className="text-sm font-semibold text-foreground">Full Name *</label>
          <Input
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">Professional Title *</label>
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
            <Input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Phone *</label>
            <Input
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Location *</label>
          <Input
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Professional Summary</label>
          <Textarea
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="A brief overview of your professional background and goals..."
            className="mt-1 min-h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">Website</label>
            <Input
              value={data.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">LinkedIn</label>
            <Input
              value={data.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">GitHub</label>
            <Input
              value={data.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="github.com/johndoe"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Portfolio</label>
            <Input
              value={data.portfolio || ''}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">Twitter</label>
            <Input
              value={data.twitter || ''}
              onChange={(e) => handleChange('twitter', e.target.value)}
              placeholder="twitter.com/yourhandle"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Languages</label>
            <Input
              value={data.languages || ''}
              onChange={(e) => handleChange('languages', e.target.value)}
              placeholder="English, Spanish, French"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground">Availability</label>
            <Input
              value={data.availability || ''}
              onChange={(e) => handleChange('availability', e.target.value)}
              placeholder="Immediately available"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Salary Expectation</label>
            <Input
              value={data.salary || ''}
              onChange={(e) => handleChange('salary', e.target.value)}
              placeholder="Negotiable"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
