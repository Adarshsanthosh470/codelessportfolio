import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  MousePointer2,
  Trash2,
  Move,
  Loader2 // Added for upload feedback
} from "lucide-react";
import { useState, useRef } from "react";
import { CanvasElement } from "@/types/portfolio";

// --- NEW SERVICE IMPORTS ---
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/services/portfolioService";
import { auth } from "@/services/firebase";

const CanvasBuilder = () => {
  const { state, addCanvasElement, updateCanvasElement, removeCanvasElement, updateCustomColors } = useEditor();
  const { canvasElements, customColors } = state;
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState<string | null>(null); // Track specific element uploads
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addText = () => {
    addCanvasElement({
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      content: 'Click to edit',
      styles: {
        fontSize: 24,
        fontWeight: 'normal',
        color: customColors.text,
      },
    });
  };

  const addImage = () => {
    addCanvasElement({
      type: 'image',
      x: 100,
      y: 200,
      width: 200,
      height: 200,
      content: '',
      styles: {
        borderRadius: 8,
      },
    });
  };

  const addCard = () => {
    addCanvasElement({
      type: 'card',
      x: 100,
      y: 300,
      width: 300,
      height: 200,
      content: 'Card Title',
      styles: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
      },
    });
  };

  const addButton = () => {
    addCanvasElement({
      type: 'button',
      x: 100,
      y: 400,
      width: 150,
      height: 48,
      content: 'Click Me',
      styles: {
        backgroundColor: customColors.primary,
        color: '#ffffff',
        borderRadius: 8,
      },
    });
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    const element = canvasElements.find(el => el.id === elementId);
    if (element && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - element.x,
        y: e.clientY - rect.top - element.y,
      });
      setDragging(elementId);
      setSelectedElement(elementId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 50));
      const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 50));
      updateCanvasElement(dragging, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  // --- UPDATED IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (elementId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Verify User Authentication
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images to your portfolio.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(elementId);
      toast({ title: "Uploading...", description: "Saving image to cloud storage." });

      // 2. Upload to Firebase Storage instead of Base64
      const imageUrl = await uploadImage(file, user.uid, 'canvas-uploads');

      // 3. Update element with the permanent URL
      updateCanvasElement(elementId, { content: imageUrl });
      
      toast({ title: "Success", description: "Image uploaded successfully." });
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "There was an error saving your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(null);
    }
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement === element.id;
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      cursor: dragging === element.id ? 'grabbing' : 'grab',
      outline: isSelected ? '2px solid hsl(var(--primary))' : 'none',
      outlineOffset: '2px',
      zIndex: isSelected ? 10 : 1,
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyles,
              fontSize: element.styles.fontSize,
              fontWeight: element.styles.fontWeight,
              color: element.styles.color,
            }}
            className="flex items-center"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => setSelectedElement(element.id)}
          >
            {isSelected ? (
              <input
                type="text"
                value={element.content}
                onChange={(e) => updateCanvasElement(element.id, { content: e.target.value })}
                className="bg-transparent border-none outline-none w-full"
                style={{ fontSize: element.styles.fontSize, color: element.styles.color }}
              />
            ) : (
              element.content
            )}
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyles,
              borderRadius: element.styles.borderRadius,
              overflow: 'hidden',
            }}
            className="bg-muted flex items-center justify-center border border-dashed border-muted-foreground/20"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => setSelectedElement(element.id)}
          >
            {isUploading === element.id ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Saving</span>
              </div>
            ) : element.content ? (
              <img src={element.content} alt="" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(element.id, e)}
                />
              </label>
            )}
          </div>
        );

      case 'card':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyles,
              backgroundColor: element.styles.backgroundColor,
              borderRadius: element.styles.borderRadius,
              boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
            }}
            className="p-4"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => setSelectedElement(element.id)}
          >
            {isSelected ? (
              <input
                type="text"
                value={element.content}
                onChange={(e) => updateCanvasElement(element.id, { content: e.target.value })}
                className="bg-transparent border-none outline-none w-full font-semibold text-lg"
              />
            ) : (
              <h3 className="font-semibold text-lg">{element.content}</h3>
            )}
          </div>
        );

      case 'button':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyles,
              backgroundColor: element.styles.backgroundColor,
              color: element.styles.color,
              borderRadius: element.styles.borderRadius,
            }}
            className="flex items-center justify-center font-medium shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => setSelectedElement(element.id)}
          >
            {isSelected ? (
              <input
                type="text"
                value={element.content}
                onChange={(e) => updateCanvasElement(element.id, { content: e.target.value })}
                className="bg-transparent border-none outline-none w-full text-center"
                style={{ color: element.styles.color }}
              />
            ) : (
              element.content
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-3">Add Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={addText} className="flex flex-col h-16 gap-1">
              <Type className="w-5 h-5" />
              <span className="text-xs">Text</span>
            </Button>
            <Button variant="outline" size="sm" onClick={addImage} className="flex flex-col h-16 gap-1">
              <ImageIcon className="w-5 h-5" />
              <span className="text-xs">Image</span>
            </Button>
            <Button variant="outline" size="sm" onClick={addCard} className="flex flex-col h-16 gap-1">
              <Square className="w-5 h-5" />
              <span className="text-xs">Card</span>
            </Button>
            <Button variant="outline" size="sm" onClick={addButton} className="flex flex-col h-16 gap-1">
              <MousePointer2 className="w-5 h-5" />
              <span className="text-xs">Button</span>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Canvas Colors</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.background}
                  onChange={(e) => updateCustomColors({ background: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
                />
                <Input
                  value={customColors.background}
                  onChange={(e) => updateCustomColors({ background: e.target.value })}
                  className="flex-1 h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Primary</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => updateCustomColors({ primary: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
                />
                <Input
                  value={customColors.primary}
                  onChange={(e) => updateCustomColors({ primary: e.target.value })}
                  className="flex-1 h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {selectedElement && (
          <div>
            <h3 className="font-medium mb-3">Selected Element</h3>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => {
                removeCanvasElement(selectedElement);
                setSelectedElement(null);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground flex items-center gap-2 pt-4 border-t border-border">
          <Move className="w-4 h-4" />
          Drag elements to position
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-auto scrollbar-hide"
        style={{ backgroundColor: customColors.background }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setSelectedElement(null)}
      >
        <div className="min-h-full min-w-full relative p-8">
          {canvasElements.map(renderElement)}
          
          {canvasElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 pointer-events-none">
              <div className="text-center">
                <MousePointer2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Start building your portfolio</p>
                <p className="text-sm">Add elements from the sidebar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasBuilder;