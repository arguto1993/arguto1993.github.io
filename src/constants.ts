import { Hero, Brand, About, Contacts, Experiences, Projects, Dashboards, Education, Skills } from './types';
import data from './data.json';

export const SECTION_VISIBILITY = {
  home: data.hero.show,
  about: data.about.show,
  skills: data.skills.show,
  experience: data.experiences.show,
  projects: data.projects.show,
  dashboards: data.dashboards.show,
  education: data.education.show,
  contact: data.contacts.show,
};

export const BRAND: Brand = data.brand;
export const HERO: Hero = data.hero as Hero;
export const ABOUT: About = data.about;
export const SKILLS: Skills = data.skills as Skills;
export const EXPERIENCES: Experiences = data.experiences as Experiences;
export const PROJECTS: Projects = data.projects as Projects;
export const DASHBOARDS: Dashboards = data.dashboards as Dashboards;
export const EDUCATION: Education = data.education as Education;
export const CONTACTS: Contacts = data.contacts;
