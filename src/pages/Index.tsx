import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  Palette, 
  Layout, 
  Rocket, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Professional Templates",
      description: "Choose from beautifully designed templates that make you stand out",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Full Customization",
      description: "Customize colors, fonts, and layouts to match your personal brand",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "No Code Required",
      description: "Build your entire portfolio with drag-and-drop simplicity",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "One-Click Publish",
      description: "Go live instantly with a shareable link to your portfolio",
    },
  ];

  const benefits = [
    "No login required to start",
    "Free canvas builder mode",
    "Mobile-responsive designs",
    "Instant live preview",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-subtle">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4" />
              Build portfolios without writing code
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Create stunning portfolios{' '}
              <span className="text-gradient">in minutes</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              The easiest way to build and publish your professional portfolio. 
              No coding skills needed. No login required to start designing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/editor">
                  Create Your Portfolio
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/templates">
                  Browse Templates
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-border">
            <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
              <div className="grid md:grid-cols-2 gap-4 p-8 w-full max-w-4xl">
                {/* Mock editor sidebar */}
                <div className="bg-card rounded-xl p-4 shadow-soft space-y-3">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded-lg" />
                  <div className="h-10 w-full bg-muted rounded-lg" />
                  <div className="h-20 w-full bg-muted rounded-lg" />
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-primary/20 rounded-full" />
                    <div className="h-8 w-16 bg-primary/20 rounded-full" />
                    <div className="h-8 w-16 bg-primary/20 rounded-full" />
                  </div>
                </div>
                {/* Mock preview */}
                <div className="bg-card rounded-xl p-4 shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="h-16 bg-muted rounded-lg" />
                    <div className="h-16 bg-muted rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Button asChild variant="hero" size="lg">
                <Link to="/editor">
                  Start Building
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything you need to shine
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our portfolio builder gives you all the tools to create a professional presence online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center text-primary-foreground mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden gradient-hero p-12 md:p-16 text-center">
            <div className="relative z-10">
              <Rocket className="w-12 h-12 text-primary-foreground mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to build your portfolio?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Start designing right now. No account needed until you're ready to publish.
              </p>
              <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90">
                <Link to="/editor">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
