"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type Highlight = {
  id: string;
  pageNumber: number;
  position: { x: number; y: number; width: number; height: number };
  text: string;
  color: string;
};

type Annotation = {
  id: string;
  pageNumber: number;
  position: { x: number; y: number };
  text: string;
  timestamp: Date;
};

type ChatHistory = {
  id: string;
  messages: Array<{
    id: number;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
    associatedHighlight?: string;
  }>;
  pdfName: string;
  savedAt: Date;
};

interface PDFContextType {
  highlights: Highlight[];
  annotations: Annotation[];
  chatHistory: ChatHistory[];
  addHighlight: (highlight: Omit<Highlight, 'id'>) => void;
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  saveChat: (messages: ChatHistory['messages'], pdfName: string) => void;
  currentEasterEgg: string | null;
  triggerEasterEgg: (code: string) => void;
}

const PDFContext = createContext<PDFContextType | null>(null);

export const PDFProvider = ({ children }: { children: ReactNode }) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentEasterEgg, setCurrentEasterEgg] = useState<string | null>(null);

  const addHighlight = (highlight: Omit<Highlight, 'id'>) => {
    setHighlights(prev => [...prev, { ...highlight, id: crypto.randomUUID() }]);
  };

  const addAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    setAnnotations(prev => [...prev, { ...annotation, id: crypto.randomUUID() }]);
  };

  const saveChat = (messages: ChatHistory['messages'], pdfName: string) => {
    setChatHistory(prev => [...prev, {
      id: crypto.randomUUID(),
      messages,
      pdfName,
      savedAt: new Date()
    }]);
  };

  const triggerEasterEgg = (code: string) => {
    const easterEggs: Record<string, string> = {
      'konami': 'retro-game',
      'rad': 'neon-flash',
      '1337': 'hacker-mode',
      'wopr': 'war-games'
    };
    
    if (code in easterEggs) {
      setCurrentEasterEgg(easterEggs[code]);
      setTimeout(() => setCurrentEasterEgg(null), 5000);
    }
  };

  return (
    <PDFContext.Provider value={{
      highlights,
      annotations,
      chatHistory,
      addHighlight,
      addAnnotation,
      saveChat,
      currentEasterEgg,
      triggerEasterEgg
    }}>
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) throw new Error('usePDF must be used within a PDFProvider');
  return context;
};
