import { TemplateConfig } from "@/types/portfolio";

export const templates: TemplateConfig[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple with generous whitespace",
    thumbnail: "/templates/minimal.png",
    primaryColor: "#1a1a1a",
    secondaryColor: "#f5f5f5",
    fontFamily: "Inter",
    layout: "minimal",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold gradients and contemporary design",
    thumbnail: "/templates/modern.png",
    primaryColor: "#6366f1",
    secondaryColor: "#0f172a",
    fontFamily: "Outfit",
    layout: "modern",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Vibrant colors and playful layouts",
    thumbnail: "/templates/creative.png",
    primaryColor: "#ec4899",
    secondaryColor: "#fdf2f8",
    fontFamily: "Outfit",
    layout: "creative",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate and structured presentation",
    thumbnail: "/templates/professional.png",
    primaryColor: "#0369a1",
    secondaryColor: "#f0f9ff",
    fontFamily: "Inter",
    layout: "classic",
  },
];

export const defaultPortfolioData = {
  name: "Your Name",
  title: "Your Professional Title",
  bio: "Write a brief introduction about yourself, your experience, and what you're passionate about.",
  photo: "",
  skills: ["JavaScript", "React", "Node.js", "UI/UX Design"],
  projects: [
    {
      id: "1",
      title: "Project One",
      description: "A brief description of your amazing project.",
      image: "",
      link: "https://example.com",
      tags: ["React", "TypeScript"],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University Name",
      degree: "Bachelor's Degree",
      field: "Computer Science",
      startYear: "2018",
      endYear: "2022",
    },
  ],
  experience: [
    {
      id: "1",
      company: "Company Name",
      position: "Software Developer",
      description: "Brief description of your role and achievements.",
      startYear: "2022",
      endYear: "Present",
      current: true,
    },
  ],
  socialLinks: [
    { id: "1", platform: "github" as const, url: "https://github.com" },
    { id: "2", platform: "linkedin" as const, url: "https://linkedin.com" },
  ],
  sections: [
    { id: "hero", type: "hero" as const, visible: true, order: 0 },
    { id: "about", type: "about" as const, visible: true, order: 1 },
    { id: "skills", type: "skills" as const, visible: true, order: 2 },
    { id: "projects", type: "projects" as const, visible: true, order: 3 },
    { id: "education", type: "education" as const, visible: true, order: 4 },
    { id: "contact", type: "contact" as const, visible: true, order: 5 },
  ],
};
