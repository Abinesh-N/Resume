export type SectionType = 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  languages?: string;
  availability?: string;
  salary?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  items: ExperienceItem[] | EducationItem[] | SkillItem[] | ProjectItem[] | CertificationItem[];
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface Resume {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  sections: Section[];
  templateId: string;
  theme: Theme;
  editingMode: 'simple' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_THEME: Theme = {
  primaryColor: '#1a1a1a',
  secondaryColor: '#444444',
  accentColor: '#0066cc',
};

export const DEFAULT_RESUME: Resume = {
  id: '',
  title: 'My Resume',
  personalInfo: {
    fullName: 'Alexandra Chen',
    jobTitle: 'Senior Product Manager',
    email: 'alexandra.chen@email.com',
    phone: '(415) 555-0123',
    location: 'San Francisco, CA',
    summary: 'Results-driven Senior Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of increasing user engagement by 40% and revenue by 25% through data-driven product strategies.',
    website: 'alexandrachen.com',
    linkedin: 'linkedin.com/in/alexandrachen',
    github: 'github.com/alexandrachen',
    portfolio: 'portfolio.alexandrachen.com',
    languages: 'English, Mandarin, Spanish',
    availability: 'Open to opportunities',
    salary: '$150K - $180K',
  },
  sections: [
    {
      id: 'experience',
      type: 'experience',
      title: 'Professional Experience',
      visible: true,
      order: 0,
      items: [
        {
          id: 'exp-1',
          company: 'TechCorp Solutions',
          position: 'Senior Product Manager',
          startDate: '2021',
          endDate: '2024',
          currentlyWorking: true,
          description: 'Led product strategy for B2B SaaS platform serving 10K+ enterprise customers\nIncreased user engagement by 40% through data-driven feature optimization\nManaged $2M product budget and cross-functional team of 12 engineers\nReduced customer churn by 30% through improved onboarding experience',
        },
        {
          id: 'exp-2',
          company: 'Digital Innovations Inc',
          position: 'Product Manager',
          startDate: '2019',
          endDate: '2021',
          currentlyWorking: false,
          description: 'Launched mobile app that achieved 500K+ downloads in first year\nImproved user retention by 25% through personalized content features\nCollaborated with engineering team to implement agile development processes\nConducted market research that identified new revenue opportunities',
        },
      ],
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      visible: true,
      order: 1,
      items: [
        {
          id: 'edu-1',
          school: 'Stanford University',
          degree: 'Master of Business Administration',
          field: 'Product Management & Strategy',
          graduationDate: '2019',
          gpa: '3.9',
        },
        {
          id: 'edu-2',
          school: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          graduationDate: '2017',
          gpa: '3.8',
        },
      ],
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      visible: true,
      order: 2,
      items: [
        {
          id: 'skill-1',
          name: 'Product Strategy',
          category: 'Technical',
        },
        {
          id: 'skill-2',
          name: 'Data Analysis',
          category: 'Technical',
        },
        {
          id: 'skill-3',
          name: 'User Research',
          category: 'Technical',
        },
        {
          id: 'skill-4',
          name: 'Agile/Scrum',
          category: 'Technical',
        },
        {
          id: 'skill-5',
          name: 'Leadership',
          category: 'Soft Skills',
        },
        {
          id: 'skill-6',
          name: 'Communication',
          category: 'Soft Skills',
        },
        {
          id: 'skill-7',
          name: 'Stakeholder Management',
          category: 'Professional',
        },
        {
          id: 'skill-8',
          name: 'Market Research',
          category: 'Professional',
        },
      ],
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Projects',
      visible: true,
      order: 3,
      items: [
        {
          id: 'proj-1',
          name: 'Enterprise SaaS Platform Redesign',
          description: 'Led complete redesign of B2B SaaS platform resulting in 40% increase in user engagement and 25% reduction in support tickets. Implemented modern UI/UX principles and data-driven personalization.',
          technologies: 'React, TypeScript, Node.js, AWS, PostgreSQL',
          link: 'https://github.com/alexandrachen/saas-platform',
        },
        {
          id: 'proj-2',
          name: 'Mobile Analytics Dashboard',
          description: 'Developed real-time analytics dashboard for mobile app users, providing actionable insights that increased user retention by 30%. Integrated machine learning for predictive analytics.',
          technologies: 'React Native, Python, TensorFlow, MongoDB',
          link: 'https://github.com/alexandrachen/analytics-dashboard',
        },
      ],
    },
  ],
  templateId: 'classic',
  theme: DEFAULT_THEME,
  editingMode: 'simple',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
