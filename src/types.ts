export interface Brand {
  logoWhite: string;
  logoBlack: string;
  shortname: string;
  nickname: string;
  homepage: string;
  _homepageComment: string;
  googleVerification: string;
  repository: string;
  lastUpdated: string;
}

export interface Hero {
  show: boolean;
  name: string;
  title: string;
  subtitle: string;
  resume: string;
}

export interface About {
  show: boolean;
  title: string;
  subtitle: string;
  content: string;
  portrait: string;
  greetingMessages: string[];
  tooltips: Record<string, string>;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Skills {
  show: boolean;
  title: string;
  subtitle: string;
  items: SkillGroup[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string[];
}

export interface Experience {
  show: boolean;
  title: string;
  subtitle: string;
  items: ExperienceItem[];
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

export interface Projects {
  show: boolean;
  title: string;
  subtitle: string;
  items: Project[];
}

export interface Dashboard {
  title: string;
  platform: string;
  description: string;
  image: string;
  link?: string;
}

export interface Dashboards {
  show: boolean;
  title: string;
  subtitle: string;
  items: Dashboard[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details?: string[];
}

export interface Education {
  show: boolean;
  title: string;
  subtitle: string;
  items: EducationItem[];
  certifications: CertificationsGroup;
}

export interface Certification {
  name: string;
  type: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface CertificationsGroup {
  title: string;
  items: Certification[];
}

export interface Contact {
  show: boolean;
  title: string;
  subtitle: string;
  items: ContactItem[];
}

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

export interface PortfolioData {
  brand: Brand;
  hero: Hero;
  about: About;
  skills: Skills;
  experience: Experience;
  projects: Projects;
  dashboards: Dashboards;
  education: Education;
  contact: Contact;
}
