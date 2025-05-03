import Link from "next/link";
import { FileText, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-primary mb-4"
            >
              <FileText className="h-7 w-7" />
              <span>PdfChat</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Chat with your PDF documents using advanced AI analysis. Extract insights,
              answer questions, and analyze documents effortlessly.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Github className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
              <FooterLink href="#">Changelog</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Guides</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PdfChat. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Button variant="link" className="text-sm text-muted-foreground" asChild>
              <Link href="#">Privacy Policy</Link>
            </Button>
            <Button variant="link" className="text-sm text-muted-foreground" asChild>
              <Link href="#">Terms of Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <Link
    href={href}
    className="h-10 w-10 bg-background rounded-full flex items-center justify-center text-muted-foreground hover:text-primary border border-border hover:border-primary/50 transition-colors"
  >
    {icon}
  </Link>
);

export default Footer;