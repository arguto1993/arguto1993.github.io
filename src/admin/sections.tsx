import type { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  AboutForm,
  BrandForm,
  CertificationsForm,
  ContactForm,
  DashboardsForm,
  EducationForm,
  ExperienceForm,
  HeroForm,
  ProjectsForm,
  SkillsForm,
} from './forms';
import type { PortfolioData } from './types';

export const ADMIN_SECTIONS = [
  {
    key: 'Brand',
    renderForm: (data, setData) => (
      <BrandForm
        value={data.brand}
        onChange={(brand) => setData({ ...data, brand })}
      />
    ),
  },
  {
    key: 'Hero',
    renderForm: (data, setData) => (
      <HeroForm
        value={data.hero}
        onChange={(hero) => setData({ ...data, hero })}
      />
    ),
  },
  {
    key: 'About',
    renderForm: (data, setData) => (
      <AboutForm
        value={data.about}
        onChange={(about) => setData({ ...data, about })}
      />
    ),
  },
  {
    key: 'Skills',
    renderForm: (data, setData) => (
      <SkillsForm
        value={data.skills}
        onChange={(skills) => setData({ ...data, skills })}
      />
    ),
  },
  {
    key: 'Experience',
    renderForm: (data, setData) => (
      <ExperienceForm
        value={data.experience}
        onChange={(experience) => setData({ ...data, experience })}
      />
    ),
  },
  {
    key: 'Projects',
    renderForm: (data, setData) => (
      <ProjectsForm
        value={data.projects}
        onChange={(projects) => setData({ ...data, projects })}
      />
    ),
  },
  {
    key: 'Dashboards',
    renderForm: (data, setData) => (
      <DashboardsForm
        value={data.dashboards}
        onChange={(dashboards) => setData({ ...data, dashboards })}
      />
    ),
  },
  {
    key: 'Education',
    renderForm: (data, setData) => (
      <EducationForm
        value={data.education}
        onChange={(education) => setData({ ...data, education })}
      />
    ),
  },
  {
    key: 'Certifications',
    renderForm: (data, setData) => (
      <CertificationsForm
        value={data.education.certifications}
        onChange={(certifications) =>
          setData({
            ...data,
            education: { ...data.education, certifications },
          })
        }
      />
    ),
  },
  {
    key: 'Contact',
    renderForm: (data, setData) => (
      <ContactForm
        value={data.contact}
        onChange={(contact) => setData({ ...data, contact })}
      />
    ),
  },
] as const satisfies readonly AdminSectionConfig[];

export type AdminSectionKey = (typeof ADMIN_SECTIONS)[number]['key'];

type SetPortfolioData = Dispatch<SetStateAction<PortfolioData | null>>;

interface AdminSectionConfig {
  key: string;
  renderForm: (data: PortfolioData, setData: SetPortfolioData) => ReactNode;
}

export function renderAdminSectionForm(
  section: AdminSectionKey,
  data: PortfolioData,
  setData: SetPortfolioData,
) {
  return ADMIN_SECTIONS.find((item) => item.key === section)?.renderForm(data, setData) ?? null;
}
