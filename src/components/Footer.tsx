import { Github, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://adarshsanthosh.netlify.app"
            target="_blank"
            rel="noreferrer"
            aria-label="Portfolio"
            className="text-muted-foreground hover:text-foreground"
          >
            <Globe className="w-5 h-5" />
          </a>

          <p className="text-center text-sm text-muted-foreground">
            © 2025 Adarsh Santhosh. All Rights Reserved.
          </p>

          <a
            href="https://github.com/Adarshsanthosh470"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
