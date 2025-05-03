"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary"
        >
          <FileText className="h-7 w-7" />
          <span>PdfChat</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLinks />
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" className="font-medium">
            Log in
          </Button>
          <Button className="font-medium">Try For Free</Button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-background"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-2xl font-bold text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className="h-7 w-7" />
                  <span>PdfChat</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <nav className="flex flex-col gap-6 text-lg font-medium mt-4">
                <NavLinks isMobile onClick={() => setIsMobileMenuOpen(false)} />
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full font-medium"
                  size="lg"
                >
                  Log in
                </Button>
                <Button className="w-full font-medium" size="lg">
                  Try For Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavLinks = ({
  isMobile = false,
  onClick,
}: {
  isMobile?: boolean;
  onClick?: () => void;
}) => {
  const links = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={onClick}
          className={cn(
            "text-foreground/80 hover:text-primary transition-colors",
            isMobile ? "text-lg py-2" : ""
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default Navbar;