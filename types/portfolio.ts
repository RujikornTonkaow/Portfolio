export interface SiteSettings {
  id: string
  site_title: string
  page_title: string
  meta_description: string
  footer_tagline: string
  default_theme: 'midnight' | 'sunshine'
  profile_image: string
  updated_at: string
}

export interface HeroData {
  greeting: string
  full_name: string
  subtitle: string
  cta_primary_text: string
  cta_primary_link: string
  cta_secondary_text: string
  cta_secondary_link: string
}

export interface Stat {
  value: string
  label: string
}

export interface AboutData {
  title: string
  bio_paragraphs: string[]
  personality_tags: string[]
  stats: Stat[]
}

export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools'

export interface Skill {
  id: string
  name: string
  icon: string
  category: SkillCategory
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  live_url?: string
  source_url?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  description: string
  highlights: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface NavItem {
  label: string
  href: string
}

export interface PortfolioData {
  site_settings: SiteSettings
  hero: HeroData
  about: AboutData
  skills: Skill[]
  projects: Project[]
  experiences: Experience[]
  social_links: SocialLink[]
  nav_items: NavItem[]
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}
