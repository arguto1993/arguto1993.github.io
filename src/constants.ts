import { Hero, Brand, About, Contacts, Experience, Project, Dashboard, Education, Certification, SkillGroup } from './types';
import data from './data.json';
import sections from './sections.json';

export const SECTION_VISIBILITY = Object.fromEntries(
  Object.entries(sections).map(([key, value]) => [key, value.show])
);

export const HERO: Hero = data.hero;
export const ABOUT: About = data.about;
export const EXPERIENCES: Experience[] = data.experiences;
export const PROJECTS: Project[] = data.projects;
export const DASHBOARDS: Dashboard[] = data.dashboards;
export const EDUCATION: Education[] = data.education;
export const SKILLS: SkillGroup[] = data.skills;
export const CERTIFICATIONS: Certification[] = data.certifications;
export const CONTACTS: Contacts = data.contacts;
export const BRAND: Brand = data.brand;
