import { createContext, useContext } from 'react';
import {
  HERO,
  ABOUT,
  EXPERIENCES,
  PROJECTS,
  DASHBOARDS,
  EDUCATION,
  SKILLS,
  CERTIFICATIONS,
  CONTACTS,
  BRAND,
} from './constants';
import type { Hero, Brand, About, Contacts, Experience, Project, Dashboard, Education, SkillGroup, Certification } from './types';

export type SiteDataContextValue = {
  hero: Hero;
  brand: Brand;
  about: About;
  contacts: Contacts;
  experiences: Experience[];
  projects: Project[];
  dashboards: Dashboard[];
  education: Education[];
  skills: SkillGroup[];
  certifications: Certification[];
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

const defaultValue: SiteDataContextValue = {
  hero: HERO,
  about: ABOUT,
  experiences: EXPERIENCES,
  projects: PROJECTS,
  dashboards: DASHBOARDS,
  education: EDUCATION,
  skills: SKILLS,
  certifications: CERTIFICATIONS,
  contacts: CONTACTS,
  brand: BRAND,
};

export function SiteDataProvider({
  value,
  children,
}: {
  value: SiteDataContextValue;
  children: React.ReactNode;
}) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataContextValue {
  return useContext(SiteDataContext) ?? defaultValue;
}
