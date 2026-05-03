export interface Brand {
  logoWhite: string;
  logoBlack: string;
  shortname: string;
  nickname: string;
  googleVerification: string;
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

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string[];
}

export interface Experiences {
  show: boolean;
  title: string;
  subtitle: string;
  items: Experience[];
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
  issuer: string;
  date: string;
  link?: string;
}

export interface CertificationsGroup {
  title: string;
  items: Certification[];
}

export interface Contacts {
  show: boolean;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  medium: string;
  hackerrank: string;
}
