import { useEditor } from "@/contexts/EditorContext";
import { templates } from "@/data/templates";
import { Github, Linkedin, Twitter, Instagram, Globe, Mail } from "lucide-react";

interface PortfolioPreviewProps {
  readOnly?: boolean;
}

const PortfolioPreview = ({ readOnly }: PortfolioPreviewProps) => {
  const { state } = useEditor();
  const { portfolioData, selectedTemplate, customColors, customFont } = state;

  const template = templates.find(t => t.id === selectedTemplate) || templates[0];

  const socialIcons: Record<string, React.ReactNode> = {
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    website: <Globe className="w-5 h-5" />,
    email: <Mail className="w-5 h-5" />,
  };

  const styles = {
    '--preview-primary': customColors.primary,
    '--preview-secondary': customColors.secondary,
    '--preview-bg': customColors.background,
    '--preview-text': customColors.text,
    fontFamily: customFont,
  } as React.CSSProperties;

  const renderMinimalTemplate = () => (
    <div className="min-h-full p-8 md:p-16" style={{ background: customColors.background, color: customColors.text }}>
      {/* Hero */}
      <section className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center gap-6 mb-8">
          {portfolioData.photo ? (
            <img 
              src={portfolioData.photo} 
              alt={portfolioData.name}
              className="w-20 h-20 rounded-full object-cover"
              style={{ boxShadow: `0 0 0 4px ${customColors.primary}20` }}
            />
          ) : (
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: customColors.primary, color: '#fff' }}
            >
              {portfolioData.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: customFont }}>{portfolioData.name}</h1>
            <p className="text-lg opacity-70">{portfolioData.title}</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed opacity-80">{portfolioData.bio}</p>
      </section>

      {/* Education */}
      {portfolioData.education.length > 0 && (
        <section className="max-w-2xl mx-auto mb-16">
          <h2 className="text-xl font-semibold mb-4" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.education || "Education"}</h2>
          <div className="space-y-4">
            {portfolioData.education.map((edu) => (
              <div key={edu.id} className="p-4 rounded-xl border" style={{ borderColor: customColors.text + '15' }}>
                <h3 className="font-semibold text-lg mb-2">{edu.institution}</h3>
                <p className="opacity-70">{edu.degree} in {edu.field}</p>
                <p className="text-sm opacity-60">{edu.startYear} - {edu.endYear}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-6" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.projects || "Projects"}</h2>
        <div className="space-y-6">
          {portfolioData.projects.map((project) => (
            <div key={project.id} className="p-6 rounded-xl border" style={{ borderColor: customColors.text + '15' }}>
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              <p className="opacity-70 mb-4">{project.description}</p>
              <div className="flex gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded" style={{ background: customColors.secondary, color: customColors.text }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      {(portfolioData.experience && portfolioData.experience.length > 0) && (
        <section className="max-w-2xl mx-auto mb-16">
          <h2 className="text-xl font-semibold mb-4" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.experience || "Experience"}</h2>
          <div className="space-y-4">
            {portfolioData.experience.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl border" style={{ borderColor: customColors.text + '15' }}>
                <h3 className="font-semibold text-lg mb-2">{exp.position} at {exp.company}</h3>
                <p className="opacity-70 mb-2">{exp.description}</p>
                <p className="text-sm opacity-60">{exp.startYear} - {exp.current ? "Present" : exp.endYear}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      <section className="max-w-2xl mx-auto">
        <div className="flex gap-4">
          {portfolioData.socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full transition-all hover:scale-110"
              style={{ background: customColors.primary + '15', color: customColors.primary }}
            >
              {socialIcons[link.platform]}
            </a>
          ))}
        </div>
      </section>

      {/* Branding */}
      <footer className="mt-16 py-8 text-center">
        <a
          href="https://codelessportfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: customColors.text }}
        >
          <Globe className="w-4 h-4" />
          Powered by CodeLess Portfolio
        </a>
      </footer>
    </div>
  );

  const renderModernTemplate = () => (
    <div className="min-h-full" style={{ background: customColors.secondary, color: '#fff' }}>
      {/* Hero with gradient */}
      <section 
        className="p-8 md:p-16"
        style={{ background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.primary}dd)` }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            {portfolioData.photo ? (
              <img 
                src={portfolioData.photo} 
                alt={portfolioData.name}
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white/20"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-bold">
                {portfolioData.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: customFont }}>
                {portfolioData.name}
              </h1>
              <p className="text-xl opacity-90">{portfolioData.title}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed opacity-90 max-w-2xl">{portfolioData.bio}</p>
          
          <div className="flex gap-4 mt-8">
            {portfolioData.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              >
                {socialIcons[link.platform]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.education || "Education"}</h2>
          <div className="space-y-4 mb-16">
            {portfolioData.education.map((edu) => (
              <div key={edu.id} className="p-6 rounded-2xl" style={{ background: customColors.primary + '10', borderLeft: `4px solid ${customColors.primary}` }}>
                <h3 className="font-semibold text-xl mb-3" style={{ color: '#fff' }}>{edu.institution}</h3>
                <p className="opacity-70">{edu.degree} in {edu.field}</p>
                <p className="text-sm opacity-60">{edu.startYear} - {edu.endYear}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.projects || "Featured Projects"}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {portfolioData.projects.map((project) => (
              <div 
                key={project.id} 
                className="p-6 rounded-2xl"
                style={{ background: customColors.primary + '10', borderLeft: `4px solid ${customColors.primary}` }}
              >
                <h3 className="font-semibold text-xl mb-3" style={{ color: '#fff' }}>{project.title}</h3>
                <p className="opacity-70 mb-4">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        {(portfolioData.experience && portfolioData.experience.length > 0) && (
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.experience || "Experience"}</h2>
            <div className="space-y-4">
              {portfolioData.experience.map((exp) => (
                <div key={exp.id} className="p-6 rounded-2xl" style={{ background: customColors.primary + '10', borderLeft: `4px solid ${customColors.primary}` }}>
                  <h3 className="font-semibold text-xl mb-3" style={{ color: '#fff' }}>{exp.position} at {exp.company}</h3>
                  <p className="opacity-70 mb-2">{exp.description}</p>
                  <p className="text-sm opacity-60">{exp.startYear} - {exp.current ? "Present" : exp.endYear}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* Branding */}
      <footer className="py-8 text-center" style={{ background: customColors.secondary }}>
        <a
          href="https://codelessportfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity text-white"
        >
          <Globe className="w-4 h-4" />
          Powered by CodeLess Portfolio
        </a>
      </footer>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="min-h-full" style={{ background: customColors.background, color: customColors.text }}>
      {/* Asymmetric hero */}
      <section className="relative p-8 md:p-16 overflow-hidden">
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30"
          style={{ background: customColors.primary }}
        />
        <div 
          className="absolute bottom-0 left-20 w-40 h-40 rounded-3xl rotate-12 opacity-20"
          style={{ background: customColors.primary }}
        />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col items-start gap-6">
            {portfolioData.photo ? (
              <img 
                src={portfolioData.photo} 
                alt={portfolioData.name}
                className="w-28 h-28 rounded-3xl object-cover rotate-3 hover:rotate-0 transition-transform"
                style={{ boxShadow: `0 20px 40px ${customColors.primary}40` }}
              />
            ) : (
              <div 
                className="w-28 h-28 rounded-3xl flex items-center justify-center text-3xl font-bold rotate-3"
                style={{ background: customColors.primary, color: '#fff' }}
              >
                {portfolioData.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 
                className="text-5xl md:text-6xl font-bold mb-3"
                style={{ fontFamily: customFont, color: customColors.primary }}
              >
                {portfolioData.name}
              </h1>
              <p className="text-2xl opacity-70">{portfolioData.title}</p>
            </div>
          </div>
          
          <p className="text-lg leading-relaxed mt-8 max-w-xl opacity-80">{portfolioData.bio}</p>

          <div className="flex gap-3 mt-8">
            {portfolioData.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl transition-all hover:scale-110 hover:-rotate-3"
                style={{ background: customColors.primary, color: '#fff' }}
              >
                {socialIcons[link.platform]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      {portfolioData.education.length > 0 && (
        <section className="px-8 md:px-16 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: customFont }}>{portfolioData.sectionTitles?.education || "Education"}</h2>
            <div className="space-y-8">
              {portfolioData.education.map((edu, i) => (
                <div key={edu.id} className="p-8 rounded-3xl transform hover:-translate-y-1 transition-all" style={{ background: customColors.primary + '08', border: `2px solid ${customColors.primary}30` }}>
                  <h3 className="font-bold text-2xl mb-3" style={{ color: customColors.primary }}>{edu.institution}</h3>
                  <p className="opacity-70 text-lg mb-4">{edu.degree} in {edu.field}</p>
                  <p className="text-sm opacity-60">{edu.startYear} - {edu.endYear}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="px-8 md:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: customFont }}>{portfolioData.sectionTitles?.projects || "My Work"}</h2>
          <div className="space-y-8">
            {portfolioData.projects.map((project, i) => (
              <div 
                key={project.id} 
                className="p-8 rounded-3xl transform hover:-translate-y-1 transition-all"
                style={{ 
                  background: customColors.primary + '08',
                  border: `2px solid ${customColors.primary}30`
                }}
              >
                <h3 className="font-bold text-2xl mb-3" style={{ color: customColors.primary }}>{project.title}</h3>
                <p className="opacity-70 text-lg mb-4">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-sm px-4 py-1 rounded-full"
                      style={{ background: customColors.primary + '20' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      {(portfolioData.experience && portfolioData.experience.length > 0) && (
        <section className="px-8 md:px-16 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: customFont }}>{portfolioData.sectionTitles?.experience || "Experience"}</h2>
            <div className="space-y-8">
              {portfolioData.experience.map((exp, i) => (
                <div key={exp.id} className="p-8 rounded-3xl transform hover:-translate-y-1 transition-all" style={{ background: customColors.primary + '08', border: `2px solid ${customColors.primary}30` }}>
                  <h3 className="font-bold text-2xl mb-3" style={{ color: customColors.primary }}>{exp.position} at {exp.company}</h3>
                  <p className="opacity-70 text-lg mb-4">{exp.description}</p>
                  <p className="text-sm opacity-60">{exp.startYear} - {exp.current ? "Present" : exp.endYear}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Branding */}
      <footer className="py-8 text-center" style={{ background: customColors.background, color: customColors.text }}>
        <a
          href="https://codelessportfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <Globe className="w-4 h-4" />
          Powered by CodeLess Portfolio
        </a>
      </footer>
    </div>
  );
  const renderProfessionalTemplate = () => (
    <div className="min-h-full" style={{ background: customColors.background, color: customColors.text }}>
      {/* Centered hero */}
      <section 
        className="p-8 md:p-16 text-center"
        style={{ background: customColors.primary }}
      >
        <div className="max-w-3xl mx-auto">
          {portfolioData.photo ? (
            <img 
              src={portfolioData.photo} 
              alt={portfolioData.name}
              className="w-28 h-28 rounded-full object-cover mx-auto mb-6 ring-4 ring-white/30"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mx-auto mb-6 text-white">
              {portfolioData.name.charAt(0)}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-2 text-white" style={{ fontFamily: customFont }}>
            {portfolioData.name}
          </h1>
          <p className="text-xl opacity-90 text-white/80 mb-4">{portfolioData.title}</p>
          <p className="text-lg leading-relaxed opacity-90 text-white/80 max-w-2xl">{portfolioData.bio}</p>
        </div>
      </section>

      {/* Education */}
      {portfolioData.education.length > 0 && (
        <section className="p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.education || "Education"}</h2>
            <div className="space-y-4">
              {portfolioData.education.map((edu) => (
                <div key={edu.id} className="p-6 rounded-lg bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: customColors.background }}>
                  <div>
                    <h3 className="font-semibold text-lg">{edu.institution}</h3>
                    <p className="opacity-70">{edu.degree} in {edu.field}</p>
                  </div>
                  <div className="text-sm opacity-60">{edu.startYear} - {edu.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects table-like */}
      <section className="p-8 md:p-16" style={{ background: customColors.secondary + '20' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: customColors.primary }}>
            {portfolioData.sectionTitles?.projects || "Portfolio"}
          </h2>
          <div className="space-y-4">
            {portfolioData.projects.map((project) => (
              <div 
                key={project.id} 
                className="p-6 rounded-lg bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ background: customColors.background }}
              >
                <div>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="opacity-70">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: customColors.primary, color: '#fff' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      {(portfolioData.experience && portfolioData.experience.length > 0) && (
        <section className="p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: customColors.primary }}>{portfolioData.sectionTitles?.experience || "Experience"}</h2>
            <div className="space-y-4">
              {portfolioData.experience.map((exp) => (
                <div key={exp.id} className="p-6 rounded-lg bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: customColors.background }}>
                  <div>
                    <h3 className="font-semibold text-lg">{exp.position} at {exp.company}</h3>
                    <p className="opacity-70">{exp.description}</p>
                  </div>
                  <div className="text-sm opacity-60">{exp.startYear} - {exp.current ? "Present" : exp.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="p-8 md:p-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6" style={{ color: customColors.primary }}>Connect</h2>
          <div className="flex justify-center gap-4">
            {portfolioData.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg transition-all hover:scale-105"
                style={{ background: customColors.primary, color: '#fff' }}
              >
                {socialIcons[link.platform]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Branding */}
      <footer className="py-8 text-center" style={{ background: customColors.background, color: customColors.text }}>
        <a
          href="https://codelessportfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <Globe className="w-4 h-4" />
          Powered by CodeLess Portfolio
        </a>
      </footer>
    </div>
  );

  const renderTemplate = () => {
    switch (template.layout) {
      case 'minimal':
        return renderMinimalTemplate();
      case 'modern':
        return renderModernTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'classic':
        return renderProfessionalTemplate();
      default:
        return renderMinimalTemplate();
    }
  };

  return (
    <div className="flex-1 bg-muted/50 overflow-auto relative">
      <div className="min-h-full" style={styles}>
        {renderTemplate()}
      </div>

      {/* Branding link to codelessportfolio site (opens in new tab) */}
      <a
        href="https://codelessportfolio.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 p-2 rounded-full bg-white/90 shadow-md z-50"
        aria-label="CodelessPortfolio"
      >
        <Globe className="w-5 h-5 text-primary" />
      </a>
    </div>
  );
};

export default PortfolioPreview;
