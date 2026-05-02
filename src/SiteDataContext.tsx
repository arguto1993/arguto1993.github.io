import { createContext, useContext } from 'react';
import {
  PERSONAL_INFO,
  EXPERIENCES,
  PROJECTS,
  DASHBOARDS,
  EDUCATION,
  SKILLS,
  CERTIFICATIONS,
} from './constants';
import type { Experience, Project, Dashboard, Education, SkillGroup, Certification } from './types';

type PersonalInfo = typeof PERSONAL_INFO;

export type SiteDataContextValue = {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  projects: Project[];
  dashboards: Dashboard[];
  education: Education[];
  skills: SkillGroup[];
  certifications: Certification[];
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

const defaultValue: SiteDataContextValue = {
  personalInfo: PERSONAL_INFO,
  experiences: EXPERIENCES,
  projects: PROJECTS,
  dashboards: DASHBOARDS,
  education: EDUCATION,
  skills: SKILLS,
  certifications: CERTIFICATIONS,
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
