import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, AlertCircle, Rocket, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEditor } from "@/contexts/EditorContext";
import PortfolioPreview from "@/components/editor/PortfolioPreview";
import { canDeploy, incrementDeploy } from "@/services/deployService";
import { savePortfolio } from "@/services/portfolioService";

// --- UPDATED IMPORTS ---
import { auth } from "@/services/firebase"; 
import { onAuthStateChanged, sendSignInLinkToEmail } from "firebase/auth";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deploymentsRemaining: number;
}

const PublishDialog = ({ open, onOpenChange, deploymentsRemaining }: PublishDialogProps) => {
  const [username, setUsername] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const { state } = useEditor();

  const portfolioUrl = `codelessportfolio.netlify.app/${username}`;

  const handlePublish = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username for your portfolio URL.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      // 1. Direct Firebase Auth Check
      const user = auth.currentUser;

      if (!user) {
        // Not authenticated: trigger Firebase Email Link flow
        const email = window.prompt("Enter your email to receive a login link (one-time):");
        if (!email) {
          setIsPublishing(false);
          return;
        }

        const actionCodeSettings = {
          // URL you want to redirect back to. The domain must be whitelisted in Firebase.
          url: window.location.href,
          handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(auth, email, actionCodeSettings);

        // Save email to local storage for confirmation on return
        window.localStorage.setItem('emailForSignIn', email);
        
        toast({ 
          title: "Check your email", 
          description: "A login link was sent. After signing in, return here to publish." 
        });
        setIsPublishing(false);
        return;
      }

      // 2. Get the Firebase User ID
      const userId = user.uid;

      // Check daily limits
      const allowed = await canDeploy(userId);
      if (!allowed) {
        toast({ 
          title: "Limit reached", 
          description: "Daily limit of 2 deployments reached.", 
          variant: "destructive" 
        });
        setIsPublishing(false);
        return;
      }

      // 3. Record deployment and Save Portfolio
      const incOk = await incrementDeploy(userId);
      if (!incOk) throw new Error("Failed to record deployment count.");

      await savePortfolio(userId, username, state.portfolioData);

      // 4. Update UI State on success
      setPublishSuccess(true);
      toast({
        title: "Portfolio Published!",
        description: `Your portfolio is now live at https://${portfolioUrl}`,
      });

    } catch (err: any) {
      console.error("Publishing sequence failed:", err);
      toast({
        title: "Publish failed",
        description: err.message || "An unexpected error occurred. Please check the console.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${portfolioUrl}`);
    toast({ title: "URL Copied!" });
  };

  const resetDialog = () => {
    setPublishSuccess(false);
    setUsername("");
    onOpenChange(false);
  };

  // --- UPDATED AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        console.log("Firebase User Authenticated:", user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // ... (Rest of the JSX remains the same as your original)
  
  if (deploymentsRemaining <= 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Daily Limit Reached</DialogTitle>
            <DialogDescription className="text-center">
              You've used all 2 portfolio deployments for today.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (publishSuccess) {
    return (
      <Dialog open={open} onOpenChange={resetDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <DialogTitle className="text-center">Portfolio Published!</DialogTitle>
          </DialogHeader>

          <div className="p-4 bg-muted rounded-lg flex-shrink-0">
            <Label className="text-xs text-muted-foreground">Your portfolio URL</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input readOnly value={`https://${portfolioUrl}`} />
              <Button size="icon" variant="outline" onClick={handleCopyUrl}><Copy className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => window.open(`https://${portfolioUrl}`, '_blank')}><ExternalLink className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-lg border border-border mt-4">
            <div className="h-full overflow-auto bg-muted/30">
              <PortfolioPreview />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button className="w-full" onClick={resetDialog}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-6 h-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center">Publish Your Portfolio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-3">
             <div className="flex items-start gap-3">
               <Globe className="w-5 h-5 text-primary mt-0.5" />
               <div>
                 <p className="font-medium text-sm">Public Access</p>
                 <p className="text-xs text-muted-foreground">Anyone with the link can view your portfolio</p>
               </div>
             </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Choose your URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">netlify.app/</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="yourname"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 mt-4">
          <Button
            className="w-full"
            onClick={handlePublish}
            disabled={!username.trim() || isPublishing}
          >
            <Rocket className="w-4 h-4 mr-2" />
            {isPublishing ? "Publishing..." : "Publish Portfolio"}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;