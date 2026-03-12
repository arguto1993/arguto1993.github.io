import { Experience, Project, Dashboard, Education, Certification, SkillGroup } from './types';
import data from './data.json';
import sections from './sections.json';

export const SECTION_VISIBILITY = sections;

export const PERSONAL_INFO = {
  ...data.personal,
  linkedin: data.links.linkedin,
  github: data.links.github,
  medium: data.links.medium,
  hackerrank: data.links.hackerrank,
  portfolio: data.links.portfolio,
  resume: data.links.resume,
  logoWhite: "/images/logo/white.png",
  logoBlack: "/images/logo/black.png",
  portrait: "/images/portrait/arguto_portrait_600.webp"
};

export const EXPERIENCES: Experience[] = data.experiences;
export const PROJECTS: Project[] = data.projects;
export const DASHBOARDS: Dashboard[] = data.dashboards;
export const EDUCATION: Education[] = data.education;
export const SKILLS: SkillGroup[] = data.skills;
export const CERTIFICATIONS: Certification[] = data.certifications;
