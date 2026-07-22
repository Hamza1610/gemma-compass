"use client";

import React, { useState } from "react";
import { UploadCloud, File, Image as ImageIcon, X, Loader2, CheckCircle2, Scan } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete">("idle");
  const [uploadMode, setUploadMode] = useState<"document" | "pq">("document");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!file) return;
    setStatus("uploading");
    
    // Simulate network upload
    setTimeout(() => {
      setStatus("processing");
      
      // Simulate AKN Concept Extraction
      setTimeout(() => {
        setStatus("complete");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Ingest Knowledge
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload messy lecture notes, PDFs, or scan Past Questions.
          </p>
        </div>
        
        {status === "idle" && !file && (
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setUploadMode("document")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                uploadMode === "document" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <File className="w-4 h-4 mr-2" /> Document
            </button>
            <button 
              onClick={() => setUploadMode("pq")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                uploadMode === "pq" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Scan className="w-4 h-4 mr-2" /> PQ Scanner
            </button>
          </div>
        )}
      </div>

      <div 
        className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 sm:p-12 transition-all ${
          isDragging ? "border-blue-500 bg-blue-50" : uploadMode === "pq" ? "border-purple-300 bg-purple-50/30" : "border-gray-300 bg-white"
        } ${status !== "idle" && status !== "complete" ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {status === "idle" && !file && (
          <>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              uploadMode === "pq" ? "bg-purple-100 text-purple-600" : "bg-blue-50 text-blue-600"
            }`}>
              {uploadMode === "pq" ? <Scan className="w-10 h-10" /> : <UploadCloud className="w-10 h-10" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              {uploadMode === "pq" ? "Scan a Past Question Paper" : "Drag and drop your notes here"}
            </h3>
            <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
              {uploadMode === "pq" 
                ? "Snap a photo of your crumbled PQ paper. Gemma will solve it and explain the steps in Hausa/English."
                : "Supports .pdf, .png, .jpg up to 50MB. Perfect for whiteboard photos or dense textbooks."
              }
            </p>
            <label className={`${uploadMode === "pq" ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"} text-white px-8 py-3 rounded-full font-semibold cursor-pointer transition-colors shadow-sm`}>
              {uploadMode === "pq" ? "Take Photo / Browse" : "Browse Files"}
              <input type="file" className="hidden" accept={uploadMode === "pq" ? "image/*" : undefined} onChange={(e) => e.target.files && setFile(e.target.files[0])} />
            </label>
          </>
        )}

        {status === "idle" && file && (
          <div className="w-full max-w-md bg-gray-50 rounded-2xl p-6 border border-gray-200 relative">
            <button onClick={() => setFile(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                {file.type.includes("image") ? <ImageIcon className="w-6 h-6" /> : <File className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={simulateUpload}
              className={`w-full text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-gray-900/10 ${
                uploadMode === "pq" ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {uploadMode === "pq" ? "Start Gemma Solver Mode" : "Start Gemma Processing"}
            </button>
          </div>
        )}

        {(status === "uploading" || status === "processing") && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {status === "uploading" ? "Uploading locally..." : "Gemma 4 is extracting concepts..."}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              {status === "uploading" ? "Transferring to the Edge Node." : "Building your Adaptive Knowledge Roadmap using Hausa & English embeddings."}
            </p>
          </div>
        )}

        {status === "complete" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {uploadMode === "pq" ? "Past Question Solved!" : "Knowledge Ingested Successfully!"}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm mb-8">
              {uploadMode === "pq" 
                ? "Gemma has successfully parsed the image and formulated a step-by-step solution."
                : `Gemma has successfully parsed "${file?.name}" and generated 14 core concept nodes for your roadmap.`
              }
            </p>
            <Link 
              href="/dashboard/study"
              className={`text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-xl ${
                uploadMode === "pq" ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
              }`}
            >
              {uploadMode === "pq" ? "View Solution in Tutor" : "Start Studying Module"}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
