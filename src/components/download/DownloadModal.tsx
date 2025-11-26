"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Download, FileText, Archive, File, Check } from "lucide-react";
import { TimeCapsuleContent, DownloadOptions, DownloadMetadata, DownloadProgress, DownloadFormat } from "@/lib/types";
import { downloadTimeCapsule, estimateDownloadSize, formatFileSize } from "@/lib/download";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  contents: TimeCapsuleContent[];
  metadata: DownloadMetadata;
  onDownloadComplete?: () => void;
}

export function DownloadModal({
  isOpen,
  onClose,
  contents,
  metadata,
  onDownloadComplete,
}: DownloadModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("zip");
  const [selectedItems, setSelectedItems] = useState<string[]>(contents.map((c) => c.id));
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgress({ current: 0, total: selectedItems.length, percentage: 0 });

    const options: DownloadOptions = {
      format: selectedFormat,
      selectedItems,
      includeMetadata,
    };

    try {
      await downloadTimeCapsule(contents, options, metadata, setProgress);
      onDownloadComplete?.();
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Download failed:", error);
      alert("다운로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloading(false);
      setProgress(null);
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedItems((prev) =>
      prev.length === contents.length ? [] : contents.map((c) => c.id)
    );
  };

  const selectedContents = contents.filter((c) => selectedItems.includes(c.id));
  const estimatedSize = estimateDownloadSize(selectedContents);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-stone-700 rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDownloading}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors disabled:opacity-50"
          aria-label="닫기"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-stone-700">
          <h2 className="font-cinzel text-2xl text-stone-200 mb-2">
            콘텐츠 다운로드
          </h2>
          <p className="text-stone-400 text-sm">
            {metadata.title}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Download Format */}
          <div>
            <label className="block text-stone-300 text-sm mb-3">
              다운로드 형식
            </label>
            <div className="grid grid-cols-3 gap-3">
              <FormatOption
                icon={<Archive size={20} />}
                label="ZIP 파일"
                description="모든 파일을 압축"
                selected={selectedFormat === "zip"}
                onClick={() => setSelectedFormat("zip")}
                disabled={isDownloading}
              />
              <FormatOption
                icon={<File size={20} />}
                label="개별 파일"
                description="파일별로 다운로드"
                selected={selectedFormat === "individual"}
                onClick={() => setSelectedFormat("individual")}
                disabled={isDownloading}
              />
              <FormatOption
                icon={<FileText size={20} />}
                label="PDF"
                description="텍스트를 PDF로"
                selected={selectedFormat === "pdf"}
                onClick={() => setSelectedFormat("pdf")}
                disabled={isDownloading || !contents.some((c) => c.type === "text")}
              />
            </div>
          </div>

          {/* File Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-stone-300 text-sm">
                파일 선택 ({selectedItems.length}/{contents.length})
              </label>
              <button
                onClick={toggleAll}
                disabled={isDownloading}
                className="text-soul-blue text-sm hover:underline disabled:opacity-50"
              >
                {selectedItems.length === contents.length ? "전체 해제" : "전체 선택"}
              </button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {contents.map((content) => (
                <label
                  key={content.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedItems.includes(content.id)
                      ? "bg-stone-800/50 border-soul-blue"
                      : "bg-stone-800/30 border-stone-700 hover:border-stone-600"
                  } ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(content.id)}
                    onChange={() => toggleItem(content.id)}
                    disabled={isDownloading}
                    className="w-4 h-4 text-soul-blue bg-stone-700 border-stone-600 rounded focus:ring-soul-blue"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-200 text-sm truncate">{content.name}</p>
                    <p className="text-stone-500 text-xs">
                      {content.type} • {formatFileSize(content.size)}
                    </p>
                  </div>
                  {selectedItems.includes(content.id) && (
                    <Check size={16} className="text-soul-blue flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center gap-3 p-3 bg-stone-800/30 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                disabled={isDownloading}
                className="w-4 h-4 text-soul-blue bg-stone-700 border-stone-600 rounded focus:ring-soul-blue"
              />
              <div>
                <p className="text-stone-200 text-sm">메타데이터 포함</p>
                <p className="text-stone-500 text-xs">
                  타임캡슐 정보를 JSON 파일로 포함합니다
                </p>
              </div>
            </label>
          </div>

          {/* Download Info */}
          <div className="p-4 bg-stone-800/50 rounded-lg border border-stone-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">예상 크기:</span>
              <span className="text-stone-200 font-medium">
                {formatFileSize(estimatedSize)}
              </span>
            </div>
          </div>

          {/* Progress */}
          {isDownloading && progress && (
            <div className="p-4 bg-stone-800/50 rounded-lg border border-stone-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-stone-300 text-sm">다운로드 중...</span>
                <span className="text-soul-blue text-sm font-medium">
                  {progress.percentage}%
                </span>
              </div>
              <div className="w-full bg-stone-700 rounded-full h-2 mb-2">
                <div
                  className="bg-soul-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              {progress.fileName && (
                <p className="text-stone-500 text-xs truncate">
                  {progress.fileName}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-700 flex gap-3">
          <Button
            onClick={onClose}
            disabled={isDownloading}
            variant="ghost"
            size="md"
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || selectedItems.length === 0}
            variant="seal"
            size="md"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Download size={16} />
            {isDownloading ? "다운로드 중..." : "다운로드"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FormatOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function FormatOption({ icon, label, description, selected, onClick, disabled }: FormatOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? "border-soul-blue bg-soul-blue/10"
          : "border-stone-700 bg-stone-800/30 hover:border-stone-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className={selected ? "text-soul-blue" : "text-stone-400"}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${selected ? "text-soul-blue" : "text-stone-200"}`}>
            {label}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
