"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import RetroButton from "./../components/RetroButton";
import FeatureCard from "./../components/FeatureCard";
import { Book, MessageCircle, Upload, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    // Wait for a short delay before showing the title animation
    const timer = setTimeout(() => {
      setShowTitle(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 flex flex-col items-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-retro-purple/20 to-transparent"></div>
        
        <div className="container max-w-5xl mx-auto text-center z-10">
          {showTitle && (
            <>
              <h1 className="text-2xl md:text-4xl lg:text-5xl mb-6 leading-tight animate-fade-in">
                <span className="text-white">Chat with Your </span>
                <span className=" glow-text">PDFs</span>
                <span className="text-white"> Like</span>
                <br />
                <span className="text-white">It&apos;s </span>
                <span className="text-pink-500">1985</span>
                <span className="text-white"> from the Future</span>
              </h1>
              
              <p className="text-foreground/80 max-w-2xl mx-auto mb-8 md:text-lg animate-fade-in">
                Upload your documents and start conversations with your PDFs. Get instant answers, 
                insights, and summaries with our retro-futuristic AI interface.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 animate-fade-in">
                <RetroButton 
                  onClick={() => navigate("/chat")} 
                  size="lg" 
                  variant="neon"
                >
                  Start Chatting
                </RetroButton>
              </div>
            </>
          )}
          
          <div className="relative mx-auto w-full max-w-3xl h-64 md:h-80 retro-container crt-screen animate-fade-in">
            <div className="scan-lines"></div>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="terminal-text text-xl md:text-2xl typing-animation w-[16ch] md:w-[24ch] mx-auto">
                PDF_Whisper v1.0
              </div>
              <div className="mt-4 text-sm md:text-base typing-animation w-[22ch] md:w-[32ch] mx-auto" style={{ animationDelay: "1s" }}>
                {"> System ready for analysis"}
              </div>
              <div className="mt-2 text-sm md:text-base typing-animation w-[18ch] md:w-[26ch] mx-auto" style={{ animationDelay: "2.5s" }}>
                {"> Upload PDF to begin"}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl text-center mb-12 terminal-text">
            How <span >PDF Whisper</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Upload PDFs"
              description="Simply drag and drop your PDF documents or select them from your device."
              icon={Upload}
            />
            <FeatureCard 
              title="Chat Instantly"
              description="Ask questions in plain language and get answers directly from your document."
              icon={MessageCircle}
              className="md:translate-y-8"
            />
            <FeatureCard 
              title="Get Insights"
              description="Instantly extract the information you need without reading the entire document."
              icon={Book}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0  bg-gradient-to-tr
         from-[#704B9D]
         via-[#D946EE]
         to-[#E95C82] opacity-10"></div>
        <div className="container max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xl md:text-2xl mb-6 terminal-text">
            Ready to <span className="text-retro-neon">Revolutionize</span> How You Work with PDFs?
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto mb-8">
            Join the retro-future of document interaction. Save time, extract information efficiently,
            and make your documents work for you.
          </p>
          <RetroButton 
            onClick={() => navigate("/chat")} 
            size="lg" 
            variant="primary"
            className="mx-auto"
          >
            <FileText className="w-4 h-4 mr-2" />
            Try PDF Whisper Now
          </RetroButton>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-retro-purple/30">
        <div className="container mx-auto text-center text-foreground/60 text-sm">
          <p>© 2025 PDF Whisper | Retro-Future PDF Chat</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
