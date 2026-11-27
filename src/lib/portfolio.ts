import type { PortfolioProjectConfig } from '@/config/me';
import { getLocalizedMeConfig } from '@/i18n/me';
import type { Locale } from '@/i18n/config';

export type PortfolioItemData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  role: string;
  techStack: string;
  category: string;
  period: string;
  href: string;
  details?: PortfolioProjectConfig['details'];
  company?: string;
};

export type CompanyTimelineData = {
  companyId: string;
  company: string;
  period: string;
  role?: string;
  summary?: string;
  projects: PortfolioItemData[];
  order?: number;
};

export type PortfolioCategoryData = {
  category: string;
  summary: string;
  order: number;
};

export type PortfolioData = {
  companyTimelineItems: CompanyTimelineData[];
  soloItems: PortfolioItemData[];
  soloCategories: PortfolioCategoryData[];
};

const PRESENT_VALUE = Number.POSITIVE_INFINITY;

const normalizePeriodValue = (value?: string) => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'present' || normalized === '현재') return PRESENT_VALUE;
  const [yearPart, monthPart] = normalized.split('-');
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return Number.NEGATIVE_INFINITY;
  return year * 12 + month;
};

const formatDateLabel = (value?: string) => value?.replace(/^(\d{4})-(\d{2})$/, '$1.$2');

const formatPeriodText = (value: string) => value.replace(/(\d{4})-(\d{2})/g, '$1.$2');

const formatPeriod = (start?: string, end?: string, locale: Locale = 'ko') => {
  if (!start && !end) return '';
  const normalizedEnd = end?.trim();
  const presentLabel = locale === 'en' ? 'Present' : '현재';
  const endLabel = normalizedEnd && normalizePeriodValue(normalizedEnd) === PRESENT_VALUE ? presentLabel : formatDateLabel(normalizedEnd);
  const startLabel = formatDateLabel(start);
  if (startLabel && endLabel) return `${startLabel} ~ ${endLabel}`;
  if (startLabel) return startLabel;
  return endLabel ?? '';
};

const toDomId = (value: string) => `id-${encodeURIComponent(value).replace(/%/g, '-')}`;

const compareProjects = (a: PortfolioProjectConfig, b: PortfolioProjectConfig) => {
  const aEnd = normalizePeriodValue(a.end);
  const bEnd = normalizePeriodValue(b.end);
  if (aEnd !== bEnd) return bEnd - aEnd;

  const aStart = normalizePeriodValue(a.start);
  const bStart = normalizePeriodValue(b.start);
  if (aStart !== bStart) return bStart - aStart;

  return a.title.localeCompare(b.title, 'ko');
};

const getProjectBasePath = (locale: Locale) => locale === 'en' ? '/en/about' : '/about';

const getSoloCompanyName = (locale: Locale) => locale === 'en' ? 'Independent' : '개인 프로젝트';

const koCategoryLabels: Record<string, string> = {
  'AI / MLOps': 'AI/MLOps',
  'AI / Healthcare': 'AI/헬스케어',
  'Backend / Infra': '백엔드/인프라',
  'Product / Service': '제품/서비스',
  'Product / Frontend': '제품/프론트엔드',
  'Operations / Process': '운영/프로세스',
  'Infrastructure / Operations': '인프라/운영',
  'Security / Operations': '보안/운영',
  'Data / Service': '데이터/서비스',
  'Automation / Internal Tool': '자동화/내부 도구',
  'Business / Product': '개인 사업',
  'Freelance / Client Work': '외주 개발',
  'Side Project': '사이드 프로젝트',
  'Writing / Publishing': '집필·출판',
};

const koRoleLabels: Record<string, string> = {
  'Backend 설계 및 개발': '백엔드 설계 및 개발',
  'Backend 개발': '백엔드 개발',
  'Backend/AI 설계 및 개발': '백엔드/AI 설계 및 개발',
  'Backend 설계 및 개발 · Web Frontend 개발': '백엔드 설계 및 개발 · 웹 프론트엔드 개발',
  'Web Frontend 개발': '웹 프론트엔드 개발',
  'Web Frontend 설계 및 개발': '웹 프론트엔드 설계 및 개발',
  'Network Engineer': '네트워크 엔지니어',
  'Side Project': '사이드 프로젝트',
};

const localizeCategory = (category: string, locale: Locale) => {
  if (locale !== 'ko') return category;
  return koCategoryLabels[category] ?? category;
};

const localizeRole = (role: string, locale: Locale) => {
  if (locale !== 'ko') return role;
  return koRoleLabels[role] ?? role;
};

const mapProject = (project: PortfolioProjectConfig, locale: Locale = 'ko', company?: string): PortfolioItemData => ({
  id: toDomId(project.slug),
  slug: project.slug,
  title: project.title,
  summary: project.summary,
  role: localizeRole(project.role, locale),
  techStack: project.techStack,
  category: localizeCategory(project.category ?? (company ? 'Backend / Infra' : 'Side Project'), locale),
  period: formatPeriod(project.start, project.end, locale),
  href: project.href ?? `${getProjectBasePath(locale)}/${project.slug}/`,
  ...(project.details ? { details: project.details } : {}),
  ...(company ? { company } : {}),
});

export function getAllPortfolioProjects(locale: Locale = 'ko'): PortfolioItemData[] {
  const config = getLocalizedMeConfig(locale);
  const companyProjects = config.portfolio.companies.flatMap(company =>
    company.projects.map(project => mapProject(project, locale, company.company))
  );
  const soloProjects = config.portfolio.solo.map(project => mapProject(project, locale, getSoloCompanyName(locale)));
  return [...companyProjects, ...soloProjects];
}

export function getPortfolioProjectBySlug(slug: string, locale: Locale = 'ko'): PortfolioItemData | undefined {
  return getAllPortfolioProjects(locale).find(project => project.slug === slug);
}

export function getPortfolioData(locale: Locale = 'ko'): PortfolioData {
  const config = getLocalizedMeConfig(locale);
  const companyTimelineItems = config.portfolio.companies
    .map(company => ({
      companyId: toDomId(`company-${company.id}`),
      company: company.company,
      period: formatPeriodText(company.period),
      ...(company.role ? { role: company.role } : {}),
      ...(company.summary ? { summary: company.summary } : {}),
      projects: [...company.projects].sort(compareProjects).map(project => mapProject(project, locale, company.company)),
      order: company.order,
    }))
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  const soloItems = [...config.portfolio.solo]
    .sort(compareProjects)
    .map(project => ({ ...mapProject(project, locale, getSoloCompanyName(locale)), id: toDomId(`solo-${project.slug}`) }));

  const soloCategories = [...(config.portfolio.independentCategories ?? [])]
    .sort((a, b) => a.order - b.order)
    .map(category => ({
      category: localizeCategory(category.category, locale),
      summary: category.summary,
      order: category.order,
    }));

  return { companyTimelineItems, soloItems, soloCategories };
}
