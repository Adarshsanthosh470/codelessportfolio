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
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

    if (deploymentsRemaining <= 0) {
      toast({
        title: "Deployment limit reached",
        description: "You have reached your daily limit of 2 portfolio deployments.",
        variant: "destructive",
      });
      return;
    }
    // Check session state using Supabase
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session ?? null;

    if (!session) {
      // Not authenticated: trigger email OTP flow. Authentication is initiated only from Publish.
      const email = window.prompt("Enter your email to receive a login link (one-time):");
      if (!email) {
        toast({ title: "Email required", description: "Please provide an email to sign in.", variant: "destructive" });
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Check your email", description: "A login link was sent to your email. After signing in, click Publish again to continue." });
      return;
    }

    // At this point we have a session; get the user id and check deploy limits
    const userId = (session.user as any)?.id ?? null;
    if (!userId) {
      toast({ title: "Login error", description: "Unable to determine user identity.", variant: "destructive" });
      return;
    }

    const allowed = await canDeploy(userId);
    if (!allowed) {
      toast({ title: "Deployment limit reached", description: "You have reached your daily limit of 2 portfolio deployments.", variant: "destructive" });
      return;
    }

    const incOk = await incrementDeploy(userId);
    if (!incOk) {
      toast({ title: "Error", description: "Failed to record deployment. Please try again.", variant: "destructive" });
      return;
    }

    // Persist portfolio for this user; block publishing if save fails
    try {
      await savePortfolio(userId, username, state);
    } catch (err: any) {
      const msg = err?.message ?? "Failed to save portfolio.";
      toast({ title: "Save failed", description: msg, variant: "destructive" });
      return;
    }

    setIsPublishing(true);

    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPublishing(false);
    setPublishSuccess(true);

    toast({
      title: "Portfolio Published!",
      description: `Your portfolio is now live at ${portfolioUrl}`,
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${portfolioUrl}`);
    toast({
      title: "URL Copied!",
      description: "Portfolio URL copied to clipboard.",
    });
  };

  const resetDialog = () => {
    setPublishSuccess(false);
    setUsername("");
    onOpenChange(false);
  };
  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthenticated(!!data.session);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === "SIGNED_IN") {
        toast({ title: "Logged in", description: "You are now logged in. You can continue publishing." });
      }
    });

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe();
      } catch (e) {}
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
              You've used all 2 portfolio deployments for today. Come back tomorrow to publish more portfolios!
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
            <DialogDescription className="text-center">
              Your portfolio is now live and accessible to everyone.
            </DialogDescription>
          </DialogHeader>

          {/* Share URL Section */}
          <div className="p-4 bg-muted rounded-lg flex-shrink-0">
            <Label className="text-xs text-muted-foreground">Your portfolio URL</Label>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 p-2 bg-background rounded-md border border-border">
                <p className="font-mono text-sm text-primary truncate">
                  https://{portfolioUrl}
                </p>
              </div>
              <Button size="icon" variant="outline" onClick={handleCopyUrl} title="Copy URL">
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.open(`https://${portfolioUrl}`, '_blank')}
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex-1 overflow-hidden rounded-lg border border-border mt-4 min-h-[300px]">
            <div className="h-full overflow-auto bg-muted/30">
              <PortfolioPreview />
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4">
            <Button variant="hero" className="w-full" onClick={resetDialog}>
              Done
            </Button>
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
          <DialogDescription className="text-center">
            Make your portfolio publicly accessible to everyone on the web.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Public Access</p>
                <p className="text-xs text-muted-foreground">
                  Anyone with the link can view your portfolio
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Deployments Remaining: {deploymentsRemaining}/2</p>
                <p className="text-xs text-muted-foreground">
                  You can deploy up to 2 portfolios per day
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Choose your URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                codelessportfolio.netlify.app/
              </span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="yourname"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button 
            variant="hero" 
            className="w-full" 
            onClick={handlePublish}
            disabled={isPublishing || !username.trim()}
          >
            {isPublishing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Publish Portfolio
              </>
            )}
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
