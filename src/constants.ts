import { Experience, Project, Dashboard, Education, Certification, SkillGroup } from './types';
import data from './data.json';
import sections from './sections.json';

export const SECTION_VISIBILITY = Object.fromEntries(
  Object.entries(sections).map(([key, value]) => [key, value.show])
);

export const PERSONAL_INFO = {
  ...data.hero,
  ...data.brand,
  about: data.about.content,
  ...data.contact,
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
