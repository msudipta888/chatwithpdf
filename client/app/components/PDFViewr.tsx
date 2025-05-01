import { useState, useEffect, useRef } from 'react';
import { FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
import RetroButton from './RetroButton';

interface PDFViewerProps {
  file: File | null;
}

const PDFViewer = ({ file }: PDFViewerProps) => {
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
 

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      const url = URL.createObjectURL(file);
      setFileURL(url);
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    if (fileURL) {
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = file?.name || 'document.pdf';
      link.click();
    }
  };


 
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center retro-container">
        <div className="crt-screen w-full h-full bg-muted/50 flex items-center justify-center">
          <div className="scan-lines"></div>
          <div className="flex flex-col items-center">
            <FileText className="h-16 w-16 text-retro-purple/50 mb-4" />
            <p className="terminal-text text-xl">No PDF Selected</p>
            <p className="text-foreground/60 mt-2">Upload a PDF to begin chatting</p>
            <div className="mt-6 terminal-text typing-animation">
              {"> Waiting for PDF..."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative retro-container overflow-hidden">
      {/* PDF Info Bar */}
      <div className="absolute top-2 left-4 right-4 flex justify-between items-center z-10 bg-card/80 backdrop-blur-md px-3 py-2 rounded-md">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-retro-neon" />
          <span className="terminal-text truncate max-w-[60%]">{file.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/60">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          
          <div className="flex items-center gap-1 ml-2">
            <RetroButton 
              onClick={handleZoomOut} 
              variant="secondary"
              size="sm"
              className="h-7 w-7 p-1"
            >
              <ZoomOut className="h-4 w-4" />
            </RetroButton>
            <span className="text-xs w-12 text-center">{zoomLevel}%</span>
            <RetroButton 
              onClick={handleZoomIn} 
              variant="secondary"
              size="sm"
              className="h-7 w-7 p-1"
            >
              <ZoomIn className="h-4 w-4" />
            </RetroButton>
          </div>
          
          <RetroButton 
            onClick={handleDownload} 
            variant="neon"
            size="sm"
            className="h-7 p-1"
          >
            <Download className="h-4 w-4" />
          </RetroButton>
        </div>
      </div>
      
      <div className="crt-screen w-full h-full mt-12">
        <div className="scan-lines animate-scan-lines"></div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full bg-background/50">
            <div className="terminal-text text-lg mb-2">Loading PDF...</div>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-retro-neon animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        ) : (
          <iframe
            src={`${fileURL}#zoom=${zoomLevel}`}
            className="w-full h-full border-0 animate-fade-in"
            style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'center top'}}
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;