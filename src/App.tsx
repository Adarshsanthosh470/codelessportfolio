import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/services/firebase"; //
import { useToast } from "@/hooks/use-toast"; //

// Page Imports
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Features from "./pages/Features";
import Editor from "./pages/Editor";
import Portfolio from "./pages/portfolio"; // lowercase 'p' matches your file
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { toast } = useToast();

  useEffect(() => {
    // 1. Check if the URL is a Firebase sign-in link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      
      // 2. Retrieve the email from local storage (saved during Publish)
      let email = window.localStorage.getItem('emailForSignIn');
      
      // 3. Prompt for email if missing (e.g., link opened in a different browser)
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            // Success: Clean up and inform the user
            window.localStorage.removeItem('emailForSignIn');
            
            // Remove the auth parameters from the URL for a clean UI
            window.history.replaceState({}, document.title, window.location.pathname);
            
            toast({
              title: "Successfully Signed In!",
              description: "You can now go back to the editor and click Publish to save your portfolio.",
            });
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error);
            toast({
              title: "Login failed",
              description: "The link may have expired or is invalid. Please try publishing again.",
              variant: "destructive",
            });
          });
      }
    }
  }, [toast]); //

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast components to display feedback */}
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/features" element={<Features />} />
            <Route path="/editor" element={<Editor />} />

            {/* Public Portfolio Route: accessible via /username */}
            <Route path="/:username" element={<Portfolio />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;