"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
    onFilesChange([...files, ...fileArray]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="font-cinzel text-2xl text-stone-300 mb-2">
          Preserve Your Memories
        </h3>
        <p className="text-stone-500 text-sm">
          Photos, videos, documents, and precious memories
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-4 border-dashed rounded-lg p-12
          transition-all duration-300 cursor-pointer
          ${
            isDragging
              ? "border-[var(--soul-blue)] bg-[var(--soul-blue)]/10"
              : "border-stone-700 hover:border-stone-600"
          }
        `}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-stone-400 mb-2">
            Drag files here or click to select
          </p>
          <p className="text-stone-600 text-sm">
            Images, videos, documents, and all file types
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-cinzel text-lg text-stone-400">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-stone-900/60 border border-stone-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-2xl">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-300 truncate">{file.name}</p>
                    <p className="text-stone-600 text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 hover:text-red-400 transition-colors px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
