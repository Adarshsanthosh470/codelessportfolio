import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditorProvider, useEditor } from "@/contexts/EditorContext";
import EditorSidebar from "@/components/editor/EditorSidebar";
import PortfolioPreview from "@/components/editor/PortfolioPreview";
import CanvasBuilder from "@/components/editor/CanvasBuilder";
import TemplateCard from "@/components/editor/TemplateCard";
// FIXED: Default import to match PublishDialog.tsx export
import PublishDialog from "@/components/PublishDialog";
import Footer from "@/components/Footer";
import { templates } from "@/data/templates";
import { 
  Sparkles, 
  Layout, 
  PenTool, 
  Rocket, 
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";

const EditorContent = () => {
  const [searchParams] = useSearchParams();
  const { state, setMode, selectTemplate } = useEditor();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [deploymentsRemaining, setDeploymentsRemaining] = useState(2);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showTemplateSelector, setShowTemplateSelector] = useState(!state.selectedTemplate);

  useEffect(() => {
    const templateParam = searchParams.get('template');
    const modeParam = searchParams.get('mode');

    if (modeParam === 'canvas') {
      setMode('canvas');
      setShowTemplateSelector(false);
    } else if (templateParam) {
      selectTemplate(templateParam);
      setMode('template');
      setShowTemplateSelector(false);
    }
  }, [searchParams, setMode, selectTemplate]);

  const previewWidth = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  if (showTemplateSelector) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Codeless Portfolio</span>
          </Link>
        </header>

        <main className="flex-1 p-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-display text-3xl font-bold mb-3">How would you like to start?</h1>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <button onClick={() => setShowTemplateSelector(true)} className="p-6 rounded-2xl border-2 border-primary bg-card text-left">
                <Layout className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-display font-semibold text-xl mb-2">Use a Template</h3>
              </button>
              <button onClick={() => setMode('canvas')} className="p-6 rounded-2xl border-2 border-border hover:border-primary bg-card text-left">
                <PenTool className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-display font-semibold text-xl mb-2">Blank Canvas</h3>
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} onSelect={(id) => { selectTemplate(id); setShowTemplateSelector(false); }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setShowTemplateSelector(true)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Templates
          </Button>
          <div className="flex items-center gap-2">
            <Button variant={state.mode === 'template' ? 'default' : 'ghost'} size="sm" onClick={() => setMode('template')}>
              <Layout className="w-4 h-4 mr-2" /> Template
            </Button>
            <Button variant={state.mode === 'canvas' ? 'default' : 'ghost'} size="sm" onClick={() => setMode('canvas')}>
              <PenTool className="w-4 h-4 mr-2" /> Canvas
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="hero" size="sm" onClick={() => setShowPublishDialog(true)}>
            <Rocket className="w-4 h-4 mr-2" /> Publish
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {state.mode === 'template' ? (
          <>
            <EditorSidebar />
            <div className="flex-1 bg-muted/50 flex items-start justify-center p-6 overflow-auto">
              <div className={`${previewWidth[viewMode]} bg-card rounded-lg shadow-elevated overflow-hidden`}>
                <PortfolioPreview />
              </div>
            </div>
          </>
        ) : (
          <CanvasBuilder />
        )}
      </div>

      {/* FIXED: Removed isLoggedIn and onLogin props to match PublishDialog interface */}
      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        deploymentsRemaining={deploymentsRemaining}
      />
    </div>
  );
};

const Editor = () => (
  <EditorProvider>
    <EditorContent />
  </EditorProvider>
);

export default Editor;