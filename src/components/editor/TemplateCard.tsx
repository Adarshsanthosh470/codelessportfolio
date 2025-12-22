import { TemplateConfig } from "@/types/portfolio";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: TemplateConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
  const layoutStyles: Record<string, string> = {
    minimal: "bg-gradient-to-br from-gray-50 to-gray-100",
    modern: "bg-gradient-to-br from-indigo-500 to-purple-600",
    creative: "bg-gradient-to-br from-pink-400 to-rose-500",
    classic: "bg-gradient-to-br from-sky-500 to-blue-600",
  };

  return (
    <div
      onClick={() => onSelect(template.id)}
      className={cn(
        "relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300",
        "border-2 hover:shadow-elevated",
        isSelected ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
      )}
    >
      {/* Template Preview */}
      <div className={cn(
        "aspect-[4/3] relative",
        layoutStyles[template.layout]
      )}>
        {/* Mock layout preview */}
        <div className="absolute inset-4 flex flex-col gap-2">
          {template.layout === 'minimal' && (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-300" />
              <div className="w-3/4 h-4 rounded bg-gray-300" />
              <div className="w-1/2 h-3 rounded bg-gray-200" />
              <div className="mt-auto grid grid-cols-2 gap-2">
                <div className="h-16 rounded-lg bg-gray-200" />
                <div className="h-16 rounded-lg bg-gray-200" />
              </div>
            </>
          )}
          {template.layout === 'modern' && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30" />
                <div className="flex-1 space-y-1">
                  <div className="w-1/2 h-3 rounded bg-white/40" />
                  <div className="w-1/3 h-2 rounded bg-white/30" />
                </div>
              </div>
              <div className="mt-auto space-y-2">
                <div className="w-full h-4 rounded bg-white/40" />
                <div className="w-3/4 h-3 rounded bg-white/30" />
              </div>
            </>
          )}
          {template.layout === 'creative' && (
            <>
              <div className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-white/30 rotate-12" />
              <div className="mt-auto space-y-2">
                <div className="w-3/4 h-5 rounded bg-white/50" />
                <div className="w-1/2 h-3 rounded bg-white/40" />
                <div className="flex gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-white/40" />
                  <div className="w-8 h-8 rounded-full bg-white/40" />
                </div>
              </div>
            </>
          )}
          {template.layout === 'classic' && (
            <>
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-white/30" />
              </div>
              <div className="text-center space-y-1">
                <div className="w-1/2 h-4 rounded bg-white/40 mx-auto" />
                <div className="w-1/3 h-2 rounded bg-white/30 mx-auto" />
              </div>
              <div className="mt-auto grid grid-cols-3 gap-1">
                <div className="h-8 rounded bg-white/30" />
                <div className="h-8 rounded bg-white/30" />
                <div className="h-8 rounded bg-white/30" />
              </div>
            </>
          )}
        </div>

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center animate-scale-in">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4 bg-card">
        <h3 className="font-display font-semibold text-foreground">{template.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
      </div>
    </div>
  );
};

export default TemplateCard;
