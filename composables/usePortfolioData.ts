import type { NavItem, Project, Skill, Experience, SocialLink } from '~/types/portfolio'

export const usePortfolioData = () => {
  const navItems: NavItem[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ]

  const skills: Skill[] = [
    { name: 'Vue.js', icon: 'logos:vue', category: 'frontend' },
    { name: 'Nuxt', icon: 'logos:nuxt-icon', category: 'frontend' },
    { name: 'TypeScript', icon: 'logos:typescript-icon', category: 'frontend' },
    { name: 'TailwindCSS', icon: 'logos:tailwindcss-icon', category: 'frontend' },
    { name: 'Go', icon: 'logos:go', category: 'backend' },
    { name: 'Node.js', icon: 'logos:nodejs-icon-alt', category: 'backend' },
    { name: 'MongoDB', icon: 'logos:mongodb-icon', category: 'backend' },
    { name: 'Redis', icon: 'logos:redis', category: 'backend' },
    { name: 'Docker', icon: 'logos:docker-icon', category: 'devops' },
    { name: 'Kubernetes', icon: 'logos:kubernetes', category: 'devops' },
    { name: 'GitHub Actions', icon: 'logos:github-actions', category: 'devops' },
    { name: 'Git', icon: 'logos:git-icon', category: 'tools' },
    { name: 'Figma', icon: 'logos:figma', category: 'tools' },
    { name: 'VS Code', icon: 'logos:visual-studio-code', category: 'tools' },
  ]

  const projects: Project[] = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with real-time inventory management, payment processing, and an admin dashboard.',
      tags: ['Nuxt 3', 'Go', 'MongoDB', 'Stripe', 'TailwindCSS'],
      liveUrl: '#',
      sourceUrl: '#',
    },
    {
      title: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates, kanban boards, and team analytics.',
      tags: ['Vue 3', 'TypeScript', 'Go', 'WebSocket', 'Redis'],
      liveUrl: '#',
      sourceUrl: '#',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard with interactive charts, custom reports, and data export capabilities.',
      tags: ['Nuxt 3', 'D3.js', 'ClickHouse', 'Go', 'Docker'],
      liveUrl: '#',
      sourceUrl: '#',
    },
    {
      title: 'Chat Application',
      description: 'End-to-end encrypted messaging app with group chats, file sharing, and video calls.',
      tags: ['Vue 3', 'WebRTC', 'Go', 'RabbitMQ', 'Redis'],
      liveUrl: '#',
      sourceUrl: '#',
    },
  ]

  const experiences: Experience[] = [
    {
      role: 'Senior Full-Stack Developer',
      company: 'Tech Company',
      period: '2024 - Present',
      description: 'Leading development of microservices architecture and frontend applications.',
      highlights: [
        'Architected and implemented scalable microservices using Go',
        'Built responsive web applications with Nuxt 3 and Vue 3',
        'Reduced API response times by 40% through caching and optimization',
      ],
    },
    {
      role: 'Full-Stack Developer',
      company: 'Startup Inc.',
      period: '2022 - 2024',
      description: 'Developed and maintained multiple client-facing applications.',
      highlights: [
        'Built RESTful APIs serving 100k+ daily requests',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored junior developers on best practices',
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Created pixel-perfect, responsive web interfaces for enterprise clients.',
      highlights: [
        'Delivered 15+ client projects on time and within budget',
        'Introduced Vue 3 Composition API patterns to the team',
        'Improved Lighthouse scores to 95+ across all projects',
      ],
    },
  ]

  const socialLinks: SocialLink[] = [
    { name: 'GitHub', url: 'https://github.com', icon: 'mdi:github' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'mdi:linkedin' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'mdi:twitter' },
    { name: 'Email', url: 'mailto:hello@example.com', icon: 'mdi:email-outline' },
  ]

  return {
    navItems,
    skills,
    projects,
    experiences,
    socialLinks,
  }
}
