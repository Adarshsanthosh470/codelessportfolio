import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditorProvider, useEditor } from "@/contexts/EditorContext";
import EditorSidebar from "@/components/editor/EditorSidebar";
import PortfolioPreview from "@/components/editor/PortfolioPreview";
import CanvasBuilder from "@/components/editor/CanvasBuilder";
import TemplateCard from "@/components/editor/TemplateCard";
import { PublishDialog } from "@/components/PublishDialog";
import Footer from "@/components/Footer";
import { templates } from "@/data/templates";
import { 
  Sparkles, 
  Layout, 
  PenTool, 
  Rocket, 
  ArrowLeft,
  Eye,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { Link } from "react-router-dom";

const EditorContent = () => {
  const [searchParams] = useSearchParams();
  const { state, setMode, selectTemplate } = useEditor();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleTemplateSelect = (templateId: string) => {
    selectTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleStartCanvas = () => {
    setMode('canvas');
    setShowTemplateSelector(false);
  };

  const handleLogin = () => {
    // Simulate login
    setIsLoggedIn(true);
    // In a real app, this would open an auth flow
  };

  const previewWidth = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  if (showTemplateSelector) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Codeless Portfolio</span>
          </Link>
        </header>

        {/* Template Selection */}
        <main className="flex-1 p-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-display text-3xl font-bold mb-3">
                How would you like to start?
              </h1>
              <p className="text-muted-foreground">
                Choose a template or start with a blank canvas
              </p>
            </div>

            {/* Mode Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="p-6 rounded-2xl border-2 border-primary bg-card shadow-soft text-left"
              >
                <Layout className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-display font-semibold text-xl mb-2">Use a Template</h3>
                <p className="text-muted-foreground">Start with a pre-designed layout and customize it</p>
              </button>

              <button
                onClick={handleStartCanvas}
                className="p-6 rounded-2xl border-2 border-border hover:border-primary bg-card shadow-soft text-left transition-colors"
              >
                <PenTool className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-display font-semibold text-xl mb-2">Blank Canvas</h3>
                <p className="text-muted-foreground">Build from scratch with complete freedom</p>
              </button>
            </div>

            {/* Templates Grid */}
            <h2 className="font-display font-semibold text-xl mb-6">Available Templates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={state.selectedTemplate === template.id}
                  onSelect={handleTemplateSelect}
                />
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
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowTemplateSelector(true)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button
              variant={state.mode === 'template' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('template')}
              disabled={!state.selectedTemplate}
            >
              <Layout className="w-4 h-4 mr-2" />
              Template
            </Button>
            <Button
              variant={state.mode === 'canvas' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('canvas')}
            >
              <PenTool className="w-4 h-4 mr-2" />
              Canvas
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Preview Mode Toggle */}
          {state.mode === 'template' && (
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Button variant="hero" size="sm" onClick={() => setShowPublishDialog(true)}>
            <Rocket className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {state.mode === 'template' ? (
          <>
            <EditorSidebar />
            <div className="flex-1 bg-muted/50 flex items-start justify-center p-6 overflow-auto">
              <div 
                className={`${previewWidth[viewMode]} bg-card rounded-lg shadow-elevated overflow-hidden transition-all duration-300`}
                style={{ minHeight: viewMode === 'mobile' ? '667px' : viewMode === 'tablet' ? '1024px' : 'auto' }}
              >
                <PortfolioPreview />
              </div>
            </div>
          </>
        ) : (
          <CanvasBuilder />
        )}
      </div>

      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        deploymentsRemaining={deploymentsRemaining}
      />
    </div>
  );
};

const Editor = () => {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
};

export default Editor;
