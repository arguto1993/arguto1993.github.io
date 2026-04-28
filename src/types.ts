export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string[];
}

export interface Project {
  title: string;
  organization: string;
  date: string;
  role: string;
  description: string[];
  tags: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Dashboard {
  title: string;
  platform: string;
  description: string;
  image: string;
  link?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}
