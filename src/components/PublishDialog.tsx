const handlePublish = async () => {
    // Basic validation
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

    try {
      // 1. Authenticate / Check Session
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session ?? null;

      if (!session) {
        const email = window.prompt("Enter your email to receive a login link (one-time):");
        if (!email) {
          toast({ title: "Email required", description: "Email is needed to save your work.", variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        
        toast({ title: "Check your email", description: "Login link sent! Sign in and click Publish again." });
        return;
      }

      const userId = (session.user as any)?.id;
      if (!userId) throw new Error("Unable to determine user identity.");

      // 2. Check Deployment Limits
      const allowed = await canDeploy(userId);
      if (!allowed) {
        toast({ 
          title: "Limit reached", 
          description: "Daily limit of 2 deployments reached.", 
          variant: "destructive" 
        });
        return;
      }

      // 3. Increment Deployment Counter
      // We wrap this and savePortfolio together because both require database writes
      const incOk = await incrementDeploy(userId);
      if (!incOk) throw new Error("Failed to record deployment count.");

      // 4. Save Portfolio Data
      // This is where the 'portfolios' collection is updated
      await savePortfolio(userId, username, state);

      setPublishSuccess(true);
      toast({
        title: "Portfolio Published!",
        description: `Your portfolio is live at https://${portfolioUrl}`,
      });

    } catch (err: any) {
      // LOG THE ERROR: This is critical for debugging
      console.error("Critical Publishing Error:", err);
      
      toast({
        title: "Publish failed",
        description: err.message || "An unexpected error occurred during deployment.",
        variant: "destructive",
      });
    }
  };
  // ... (existing code)

export default PublishDialog;