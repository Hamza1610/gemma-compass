"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface UploadDropzoneProps {
  onUploadSuccess: (docId: string, concepts: any[], summaryEn: string, summaryHa: string) => void;
  sessionId: string;
}

export default function UploadDropzone({ onUploadSuccess, sessionId }: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    // Basic verification: PDF, image or text
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["pdf", "png", "jpg", "jpeg", "txt", "md"];
    
    if (!ext || !validExtensions.includes(ext)) {
      setStatus("error");
      setErrorMsg("Unsupported file format. Please upload PDF, PNG, JPG, or TXT notes.");
      return;
    }

    setFileName(file.name);
    setStatus("uploading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);

    try {
      // Step 1: Upload and trigger RAG / Concept Extraction
      setStatus("processing");
      const res = await fetch("http://localhost:8000/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      setStatus("success");
      onUploadSuccess(data.document_id, data.concepts, data.summary_en, data.summary_ha);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to process document. Please make sure the backend is running.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={status === "idle" || status === "error" ? triggerInputClick : undefined}
        className={`glass-card p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[260px] ${
          isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border"
        } ${status !== "idle" && status !== "error" ? "pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
        />

        {status === "idle" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 transition-transform duration-300 hover:scale-105">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upload Lecture Notes</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-4">
              Drag and drop your PDF, image notes, or text file here, or click to browse.
            </p>
            <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              PDF, JPG, PNG, TXT up to 20MB
            </span>
          </>
        )}

        {status === "uploading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <h4 className="font-medium text-white mb-1">Uploading file...</h4>
            <p className="text-xs text-gray-400 font-mono">{fileName}</p>
          </div>
        )}

        {status === "processing" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
            <h4 className="font-medium text-white mb-1">Processing RAG Embeddings & Hausa Explanations...</h4>
            <p className="text-xs text-gray-400 font-mono mb-2">{fileName}</p>
            <p className="text-xs text-primary/70 animate-pulse">This can take a minute as Gemma analyzes key concepts</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-semibold text-white mb-1">Notes Uploaded & Analyzed!</h4>
            <p className="text-xs text-gray-400 font-mono mb-3">{fileName}</p>
            <span className="text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
              Concepts Generated
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="font-semibold text-white mb-1">Failed to Upload</h4>
            <p className="text-sm text-red-400 max-w-md mb-4">{errorMsg}</p>
            <button className="text-xs font-semibold text-primary hover:text-white transition-colors underline">
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
