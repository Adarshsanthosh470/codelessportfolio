import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/editor/TemplateCard";
import { templates } from "@/data/templates";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Choose Your Template
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start with a professionally designed template and customize it to make it yours
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={setSelectedTemplate}
              />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="hero" size="lg" disabled={!selectedTemplate}>
              <Link to={`/editor${selectedTemplate ? `?template=${selectedTemplate}` : ''}`}>
                {selectedTemplate ? 'Use This Template' : 'Select a Template'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Or{' '}
              <Link to="/editor?mode=canvas" className="text-primary hover:underline">
                start with a blank canvas
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
