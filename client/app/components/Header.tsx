"use client";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle } from "lucide-react";
import RetroButton from './RetroButton';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-4 px-4 md:px-8 bg-background backdrop-blur-md z-50 sticky top-0 border-b border">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 bg-gradient-to-tr
         from-[#704B9D]
         via-[#D946EE]
         to-[#E95C82] rounded-full flex items-center justify-center">
            <FileText className="h-5 w-5 text-black" />
            <div className="absolute inset-0 animate-neon-pulse rounded-full opacity-40"></div>
          </div>
          <span className="font-['Press_Start_2P'] text-lg md:text-xl text-white">
            PDF<span className="glow-text">Whisper</span>
          </span>
        </Link>
        
        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="px-4 py-2 transition-colors hover:text-green-400"
          >
            Home
          </Link>
          <Link 
            to="/chat" 
            className="px-4 py-2 transition-colors hover:text-green-400"
          >
            Chat with PDF
          </Link>
          <RetroButton size="sm" variant="neon">
            Get Started
          </RetroButton>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={cn(
            "w-6 h-0.5 bg-foreground transition-transform",
            isMenuOpen && "rotate-45 translate-y-2"
          )}></div>
          <div className={cn(
            "w-6 h-0.5 bg-foreground transition-opacity",
            isMenuOpen && "opacity-0"
          )}></div>
          <div className={cn(
            "w-6 h-0.5 bg-foreground transition-transform",
            isMenuOpen && "-rotate-45 -translate-y-2"
          )}></div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "absolute top-full left-0 w-full bg-background border-b border md:hidden transition-all duration-300 overflow-hidden",
        isMenuOpen ? "max-h-64" : "max-h-0"
      )}>
        <div className="container mx-auto py-4 px-4 flex flex-col gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 transition-colors hover:text-green-400"
            onClick={() => setIsMenuOpen(false)}
          >
            <FileText className="h-5 w-5" />
            Home
          </Link>
          <Link 
            to="/chat" 
            className="flex items-center gap-2 px-4 py-2 transition-colors hover:text-green-400"
            onClick={() => setIsMenuOpen(false)}
          >
            <MessageCircle className="h-5 w-5" />
            Chat with PDF
          </Link>
          <RetroButton 
            size="sm" 
            variant="neon" 
            className="w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </RetroButton>
        </div>
      </div>
    </header>
  );
};

export default Header;