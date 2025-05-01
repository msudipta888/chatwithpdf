"use client";

import { useEffect, useState } from "react";
import Header from "./../components/Header";
import UploadButton from "./../components/UploadButton";
import PDFViewer from "./../components/PDFViewr";
import ChatInterface from "./../components/ChatInterface";
import { FileText, PlusCircle } from "lucide-react";
import { usePDF } from "./../context/PDFContext";
import RetroButton from "../components/RetroButton";
import {v4 as uuidv4} from 'uuid'
const Chat = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { currentEasterEgg } = usePDF();
  const [id,setId] = useState("");
  const handleFileSelected = (file: File) => {
    setPdfFile(file);
  };
 const handleNewChat = () => {
  setPdfFile(null);
  setId("");
  setId(uuidv4())
  }
  useEffect(()=>{
    const fileId = uuidv4();
    console.log('id',fileId)
    setId(fileId);
  },[])
 
  return (
    <div 
      className={`min-h-screen flex flex-col bg-background ${
        currentEasterEgg ? `easter-egg-${currentEasterEgg}` : ''
      }`}
    >
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="mb-4 flex flex-row space-x-3">
          <h1 className="text-xl md:text-2xl lg:text-3xl terminal-text flex items-center">
            <FileText className="mr-2 h-6 w-6 text-retro-purple" />
            <span>Chat with </span>
            <span className="text-retro-neon ml-1">PDF</span>
          </h1>
          <div className="flex fle-row space-x-1s">
          <RetroButton onClick={handleNewChat} variant="neon" className="ml-2">
          {<PlusCircle size={20} />} Upload New PDF
          </RetroButton>
          </div>
        </div>
        
        {!pdfFile ? (
          <div className="max-w-xl mx-auto w-full retro-container p-6 shadow-lg border border-retro-purple/40 bg-retro-terminal/10 backdrop-blur-sm">
            <div className="mb-8">
              <UploadButton onFileSelected={handleFileSelected} id={id} />
            </div>
            
            <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-retro-purple/20 shadow-inner">
              <h3 className="text-lg font-bold terminal-text mb-4 text-retro-neon">How to use PDF Whisper</h3>
              <ol className="list-decimal pl-5 space-y-2 text-foreground/80">
                <li>Upload your PDF document using the button above</li>
                <li>Wait for the document to process</li>
                <li>Ask questions about your document in the chat</li>
                <li>Get instant answers drawn directly from your PDF content</li>
                <li>Highlight text in the PDF to ask specific questions about it</li>
                <li>Add annotations to important sections for later reference</li>
                <li>Try typing secret codes for hidden Easter eggs!</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="flex w-[100vw] flex-row gap-6 h-[calc(100vh-12rem)]">
            {/* Left Section: Chat Interface */}
            <div className="h-full w-[40vw] flex flex-col rounded-lg border border-retro-purple/30 shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="p-2 bg-retro-terminal/30 border-b border-retro-purple/30">
                <h3 className="terminal-text text-sm text-center text-retro-neon font-semibold">
                  Chat Interface
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatInterface pdfFile={pdfFile} id={id}  />
              </div>
            </div>
            
            {/* Right Section: PDF Viewer */}
            <div className="h-full w-[50vw] flex flex-col rounded-lg border border-retro-purple/30 shadow-lg backdrop-blur-sm overflow-hidden">
              <div className="p-2 bg-retro-terminal/30 border-b border-retro-purple/30">
                <h3 className="terminal-text text-sm text-center text-retro-neon font-semibold">
                  PDF Viewer
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <PDFViewer file={pdfFile} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;