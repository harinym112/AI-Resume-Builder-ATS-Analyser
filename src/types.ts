export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string; // Bullet points separated by newlines
  highlights?: string[]; // Auto-suggested improvements
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  grade?: string;
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  technologies: string; // comma separated
  description: string;
  url?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g., "Native", "Fluent", "Conversational"
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    summary: string;
  };
  experiences: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export interface KeywordGap {
  keyword: string;
  importance: "high" | "medium" | "low";
  present: boolean;
}

export interface ImprovedBullet {
  original: string;
  suggested: string;
  reason: string;
}

export interface ATSAnalysisResult {
  score: number; // 0 to 100
  overallFeedback: string;
  keywordAnalysis: KeywordGap[];
  sectionFeedback: {
    summary: string;
    experience: string;
    skills: string;
    format: string;
  };
  improvedBullets: ImprovedBullet[];
}

export type TemplateId = "modern" | "editorial" | "slate" | "minimalist";
