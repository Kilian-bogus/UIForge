export interface Project {
  id: string
  name: string
  description?: string
  pages: string[]
  createdAt: string
  updatedAt: string
  settings: ProjectSettings
}

export interface ProjectSettings {
  framework: 'react' | 'html'
  styling: 'tailwind' | 'css' | 'inline'
  typescript: boolean
  theme: {
    primaryColor: string
    fontFamily: string
    borderRadius: string
  }
}

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  createdAt: string
}
