import { createContext, useContext } from 'react';
import {
  BRAND,
  HERO,
  ABOUT,
  SKILLS,
  EXPERIENCES,
  PROJECTS,
  DASHBOARDS,
  EDUCATION,
  CONTACTS,
} from './constants';
import type { Hero, Brand, About, Contacts, Experiences, Projects, Dashboards, Education, Skills } from './types';

export type SiteDataContextValue = {
  brand: Brand;
  hero: Hero;
  about: About;
  skills: Skills;
  experiences: Experiences;
  projects: Projects;
  dashboards: Dashboards;
  education: Education;
  contacts: Contacts;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

const defaultValue: SiteDataContextValue = {
  brand: BRAND,
  hero: HERO,
  about: ABOUT,
  experiences: EXPERIENCES,
  projects: PROJECTS,
  dashboards: DASHBOARDS,
  education: EDUCATION,
  skills: SKILLS,
  contacts: CONTACTS,
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
