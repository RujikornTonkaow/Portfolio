export interface Project {
  title: string
  description: string
  tags: string[]
  image?: string
  liveUrl?: string
  sourceUrl?: string
}

export interface Skill {
  name: string
  icon: string
  category: SkillCategory
}

export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools'

export interface Experience {
  role: string
  company: string
  period: string
  description: string
  highlights: string[]
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface NavItem {
  label: string
  href: string
}
