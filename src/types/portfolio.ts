export interface PortfolioSection {
  id: string;
  type: 'hero' | 'about' | 'skills' | 'projects' | 'education' | 'contact';
  visible: boolean;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startYear: string;
  endYear: string;
  current: boolean;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'website' | 'email';
  url: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  photo: string;
  skills: string[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
  socialLinks: SocialLink[];
  sections: PortfolioSection[];
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: 'classic' | 'modern' | 'creative' | 'minimal';
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'card' | 'button';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  styles: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
  };
}

export interface EditorState {
  mode: 'template' | 'canvas';
  selectedTemplate: string | null;
  portfolioData: PortfolioData;
  canvasElements: CanvasElement[];
  customColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  customFont: string;
}
