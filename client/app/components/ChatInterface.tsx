import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Book } from "lucide-react";
import RetroButton from "./RetroButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MessageType = {
  id: number;
  content: string;
  location?: Pages;
  sender: "user" | "bot";
  timestamp: Date;
};

type Pages = {
  page: number;
}[];

interface ChatInterfaceProps {
  pdfFile: File | null;
  id: string ;
 
}

const ChatInterface = ({ pdfFile,id }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Add welcome message when PDF is uploaded
  useEffect(() => {
    if (pdfFile) {
      setMessages([
        {
          id: 1,
          content: `PDF "${pdfFile.name}" uploaded successfully! What would you like to know about this document?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [pdfFile]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const generateResponse = async (question: string) => {
    try {
      setIsTyping(true);
      const response = await fetch(`https://chatwithpdf-tpkr.onrender.com/search/pdf?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: data.answer,
          location: data.page,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      toast("Response Generated", {
        description: "AI has processed your question",
      });
      console.log('mes:',messages)
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Error generating response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !pdfFile) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: input,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    generateResponse(input);
    setInput("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="retro-container flex flex-col h-full">
      {pdfFile ? (
        <>
          {/* Messages container with fixed height and scroll */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 custom-scrollbar"
            style={{ 
              maxHeight: "calc(100vh - 120px)", // Adjust based on your header/footer height
              scrollBehavior: "smooth"
            }}
          >
            <div className="flex flex-col gap-4 pb-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "chat-message",
                    message.sender === "user"
                      ? "chat-message-user animate-fade-in"
                      : "chat-message-bot animate-scale-in"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender === "bot" ? (
                      <Book className="w-4 h-4 text-retro-neon" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                    <span className="text-xs text-foreground/70">
                      {message.sender === "bot" ? "PDF Whisper" : "You"} • {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "whitespace-pre-wrap",
                      message.sender === "bot" && "typing-effect"
                    )}
                  >
                    {message.content}
                  </p>
                  {message.location && (
                    <div className="mt-2">
                      <span className="text-xs text-foreground/70">Pages: </span>
                      {message.location.map((page, index) => (
                        <span key={index} className="text-xs text-retro-neon">
                          {page.page}
                          {index < (message.location?.length ?? 0) - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message chat-message-bot">
                  <div className="flex gap-2 items-center">
                    <Book className="w-4 h-4 text-retro-neon" />
                    <span className="text-xs text-foreground/70">PDF Whisper • typing</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <span className="animate-pulse text-lg">●</span>
                    <span className="animate-pulse delay-100 text-lg">●</span>
                    <span className="animate-pulse delay-200 text-lg">●</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input form - fixed at bottom */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-retro-purple/30 p-4 bg-retro-terminal/20 mt-auto"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your PDF..."
                className="retro-input flex-1 bg-background/60"
                autoFocus
              />
              <RetroButton 
                type="submit" 
                variant="primary"
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </RetroButton>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <MessageCircle className="h-12 w-12 mb-4 text-retro-purple animate-pulse" />
          <h3 className="text-xl font-bold terminal-text">No Active Chat</h3>
          <p className="text-foreground/70 mt-2 max-w-md">
            Upload a PDF document to start chatting
          </p>
          <div className="mt-6 terminal-text typing-animation">
            {"> Waiting for document input..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;