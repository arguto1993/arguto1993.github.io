
import data from './data.json';
import { createContext, useContext } from 'react';
import type { Hero, Brand, About, Contact, Experience, Projects, Dashboards, Education, Skills } from './types';

export type SiteDataContextValue = {
  brand: Brand;
  hero: Hero;
  about: About;
  skills: Skills;
  experience: Experience;
  projects: Projects;
  dashboards: Dashboards;
  education: Education;
  contact: Contact;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

// Dynamically generate defaultValue from data.json, preserving type safety
const defaultValue: SiteDataContextValue = {
  brand: data.brand,
  hero: data.hero,
  about: data.about,
  skills: data.skills,
  experience: data.experience,
  projects: data.projects,
  dashboards: data.dashboards,
  education: data.education,
  contact: data.contact,
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
