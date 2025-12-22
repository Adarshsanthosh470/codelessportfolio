import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Palette, 
  Layout, 
  Smartphone, 
  Zap, 
  Lock, 
  Globe,
  ArrowRight,
  Layers,
  Type,
  Image,
  MousePointer2
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Professional Templates",
      description: "Choose from 4+ beautifully crafted templates designed to showcase your work professionally. Each template is fully customizable to match your personal brand.",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Free Canvas Builder",
      description: "Start from scratch with our blank canvas mode. Add text, images, cards, and buttons. Drag, resize, and position elements exactly where you want them.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Complete Customization",
      description: "Personalize every aspect of your portfolio. Change colors, fonts, section order, and content. Make it uniquely yours without touching any code.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Responsive",
      description: "Your portfolio looks great on every device. Our responsive layouts automatically adapt to phones, tablets, and desktops.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const additionalFeatures = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Preview",
      description: "See changes in real-time as you edit",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "One-Click Publish",
      description: "Go live with a single click",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "No Login to Start",
      description: "Design freely, login only to publish",
    },
    {
      icon: <Type className="w-5 h-5" />,
      title: "Custom Fonts",
      description: "Choose from professional font options",
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: "Image Upload",
      description: "Add your photos and project images",
    },
    {
      icon: <MousePointer2 className="w-5 h-5" />,
      title: "Drag & Drop",
      description: "Intuitive visual editing interface",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for{' '}
              <span className="text-gradient">Everyone</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to create a stunning portfolio that gets you noticed
            </p>
          </div>

          {/* Main Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {mainFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-2xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mb-20">
            <h2 className="font-display text-2xl font-bold text-center mb-10">
              And so much more...
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/editor">
                Start Creating Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No account required to start
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
