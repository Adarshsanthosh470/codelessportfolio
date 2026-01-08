import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, AlertCircle, Rocket, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEditor } from "@/contexts/EditorContext";
import PortfolioPreview from "@/components/editor/PortfolioPreview";
import { supabase } from "@/services/supabase";
import { canDeploy, incrementDeploy } from "@/services/deployService";
import { savePortfolio } from "@/services/portfolioService";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deploymentsRemaining: number;
}

const PublishDialog = ({ open, onOpenChange, deploymentsRemaining }: PublishDialogProps) => {
  const [username, setUsername] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const { toast } = useToast();
  const { state } = useEditor();

  const portfolioUrl = `codelessportfolio.netlify.app/${username}`;

  const handlePublish = async () => {
    if (!username.trim()) {
      toast({ title: "Username required", variant: "destructive" });
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session ?? null;

      if (!session) {
        const email = window.prompt("Enter your email to receive a login link:");
        if (email) await supabase.auth.signInWithOtp({ email });
        toast({ title: "Login link sent", description: "Check your email to sign in." });
        return;
      }

      const userId = (session.user as any)?.id;

      // 1. Check Limits (deployService.ts)
      const allowed = await canDeploy(userId);
      if (!allowed) throw new Error("Daily deployment limit reached (2).");

      // 2. Increment Deploy Count (deployService.ts)
      await incrementDeploy(userId);

      // 3. Save Portfolio (portfolioService.ts)
      await savePortfolio(userId, username, state);

      setPublishSuccess(true);
      toast({ title: "Portfolio Published!", description: `Your site is live at ${portfolioUrl}` });

    } catch (err: any) {
      console.error("Publishing error:", err);
      toast({ 
        title: "Publish failed", 
        description: err.message || "An unexpected error occurred.", 
        variant: "destructive" 
      });
    }
  };

  const resetDialog = () => { setPublishSuccess(false); setUsername(""); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {publishSuccess ? (
          <>
            <DialogHeader><DialogTitle>Published Successfully!</DialogTitle></DialogHeader>
            <div className="p-4 bg-muted rounded-lg border">
              <Label className="text-xs text-muted-foreground">URL</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input readOnly value={`https://${portfolioUrl}`} className="bg-background" />
                <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(`https://${portfolioUrl}`)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={resetDialog}>Done</Button>
          </>
        ) : (
          <>
            <DialogHeader><DialogTitle>Publish Portfolio</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <Label htmlFor="username">Choose a username for your URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">...netlify.app/</span>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                  placeholder="yourname"
                />
              </div>
              <Button variant="hero" className="w-full mt-2" onClick={handlePublish} disabled={!username.trim()}>
                <Rocket className="w-4 h-4 mr-2" /> Publish Now
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;