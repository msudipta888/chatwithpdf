import {  useRef, useState } from "react";
import { Upload } from "lucide-react";
import RetroButton from "./RetroButton";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import * as Bytescale from "@bytescale/sdk";
import dotenv from "dotenv";

dotenv.config();
interface UploadButtonProps {
  onFileSelected: (file: File) => void;
  id: string;
}

export default function UploadButton({
  onFileSelected,
  id,
}: UploadButtonProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadManager = new Bytescale.UploadManager({
    apiKey:`${process.env.NEXT_PUBLIC_API_KEY}`
  });
   interface fileInfo{
    filePath: string;
    fileUrl: string;
    originalFileName: string;
    size: number;
   }
  // Upload to backend
  const uploadPdfToServer = async ({ filePath,
    fileUrl,
    originalFileName,
    size}:fileInfo, file:File) => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      const res = await fetch(`http://localhost:8000/upload/pdf?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({filePath,fileUrl,originalFileName,size}),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      toast.success("File uploaded successfully");
      onFileSelected(file);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          toast.error("Upload timed out. Please try again.");
        } else {
          toast.error("File upload failed");
        }
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file input or drop
  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    setIsLoading(true);
    try {
      const { filePath, fileUrl, originalFileName, size } =
        await uploadManager.upload({ data: file });
      if (!filePath || !fileUrl || !originalFileName) {
        throw new Error("Incomplete upload info");
      }
      await uploadPdfToServer(
        { filePath, fileUrl, originalFileName, size },file
      );
    } catch (error) {
      toast.error("Error uploading file");
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`retro-container p-8 border-2 border-dashed transition-all duration-200 ${
        dragActive
          ? "border-retro-neon bg-retro-neon/10"
          : "border-retro-purple/50"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-retro-purple" />
            <p className="text-sm text-foreground/70 mt-2">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#704B9D] via-[#D946EE] to-[#E95C82] flex items-center justify-center">
              <Upload className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-xl font-bold terminal-text">Upload PDF</h3>
            <p className="text-foreground/70 max-w-md">
              Drag & drop your PDF file here, or click to browse
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <RetroButton
              variant="neon"
              type="button"
              disabled={isLoading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Browse Files
            </RetroButton>
          </>
        )}
      </div>
    </div>
  );
}
