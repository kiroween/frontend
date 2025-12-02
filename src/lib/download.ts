/**
 * Download Utilities for Time Capsule Content
 */

import JSZip from "jszip";
import { TimeCapsuleContent, DownloadOptions, DownloadMetadata, DownloadProgress } from "./types";

/**
 * Download a single file
 */
export function downloadFile(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  // Clean up the URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Fetch a file as a blob
 */
export async function fetchAsBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.blob();
}

/**
 * Download time capsule contents based on options
 */
export async function downloadTimeCapsule(
  contents: TimeCapsuleContent[],
  options: DownloadOptions,
  metadata?: DownloadMetadata,
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  const { format, selectedItems, includeMetadata } = options;

  // Filter contents if specific items are selected
  const itemsToDownload = selectedItems
    ? contents.filter((c) => selectedItems.includes(c.id))
    : contents;

  if (itemsToDownload.length === 0) {
    throw new Error("No items to download");
  }

  switch (format) {
    case "individual":
      await downloadIndividual(itemsToDownload, onProgress);
      break;
    case "zip":
      await downloadAsZip(itemsToDownload, metadata, includeMetadata, onProgress);
      break;
    case "pdf":
      await downloadAsPDF(itemsToDownload, metadata, onProgress);
      break;
    default:
      throw new Error(`Unsupported download format: ${format}`);
  }
}

/**
 * Download files individually
 */
async function downloadIndividual(
  contents: TimeCapsuleContent[],
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    
    onProgress?.({
      current: i + 1,
      total: contents.length,
      percentage: Math.round(((i + 1) / contents.length) * 100),
      fileName: content.name,
    });

    downloadFile(content.url, content.name);
    
    // Add a small delay between downloads to avoid browser blocking
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

/**
 * Download contents as a ZIP file
 */
async function downloadAsZip(
  contents: TimeCapsuleContent[],
  metadata?: DownloadMetadata,
  includeMetadata: boolean = false,
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  const zip = new JSZip();

  // Add files to ZIP
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    
    onProgress?.({
      current: i + 1,
      total: contents.length + (includeMetadata ? 1 : 0),
      percentage: Math.round(((i + 1) / (contents.length + (includeMetadata ? 1 : 0))) * 100),
      fileName: content.name,
    });

    try {
      const blob = await fetchAsBlob(content.url);
      zip.file(content.name, blob);
    } catch (error) {
      console.error(`Failed to add ${content.name} to ZIP:`, error);
      // Continue with other files
    }
  }

  // Add metadata if requested
  if (includeMetadata && metadata) {
    const metadataJson = JSON.stringify(
      {
        ...metadata,
        downloadedAt: new Date().toISOString(),
      },
      null,
      2
    );
    zip.file("metadata.json", metadataJson);
  }

  // Generate ZIP file
  onProgress?.({
    current: contents.length,
    total: contents.length,
    percentage: 100,
    fileName: "Generating ZIP...",
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  
  // Download ZIP
  const filename = metadata?.title
    ? `${sanitizeFilename(metadata.title)}.zip`
    : "timecapsule.zip";
  
  downloadBlob(zipBlob, filename);
}

/**
 * Download text contents as PDF
 * TODO: Implement PDF generation with jsPDF or similar
 */
async function downloadAsPDF(
  contents: TimeCapsuleContent[],
  metadata?: DownloadMetadata,
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  // Filter text contents
  const textContents = contents.filter((c) => c.type === "text");

  if (textContents.length === 0) {
    throw new Error("No text content to convert to PDF");
  }

  onProgress?.({
    current: 0,
    total: 1,
    percentage: 0,
    fileName: "Generating PDF...",
  });

  // TODO: Implement actual PDF generation
  // For now, create a simple HTML file as a placeholder
  const html = generateHTMLFromContents(textContents, metadata);
  const blob = new Blob([html], { type: "text/html" });
  
  const filename = metadata?.title
    ? `${sanitizeFilename(metadata.title)}.html`
    : "timecapsule.html";
  
  downloadBlob(blob, filename);

  onProgress?.({
    current: 1,
    total: 1,
    percentage: 100,
    fileName: filename,
  });
}

/**
 * Generate HTML from text contents
 */
function generateHTMLFromContents(
  contents: TimeCapsuleContent[],
  metadata?: DownloadMetadata
): string {
  const title = metadata?.title || "Time Capsule";
  const description = metadata?.description || "";
  const openDate = metadata?.openDate
    ? new Date(metadata.openDate).toLocaleDateString("ko-KR")
    : "";

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: 'Malgun Gothic', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f5f5f5;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #ddd;
    }
    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      color: #2c3e50;
    }
    .meta {
      color: #666;
      font-size: 0.9em;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .content h2 {
      color: #34495e;
      margin-top: 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      color: #999;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(title)}</h1>
    ${description ? `<p class="meta">${escapeHtml(description)}</p>` : ""}
    ${openDate ? `<p class="meta">Open Date: ${openDate}</p>` : ""}
  </div>
  
  ${contents
    .map(
      (content, index) => `
    <div class="content">
      <h2>${escapeHtml(content.name)}</h2>
      <p>${escapeHtml(content.url)}</p>
    </div>
  `
    )
    .join("")}
  
  <div class="footer">
    <p>TimeGrave - Bury the past, Resurrect the future</p>
    <p>Downloaded: ${new Date().toLocaleString("ko-KR")}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sanitize filename for safe file system usage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9가-힣\s\-_]/gi, "")
    .replace(/\s+/g, "_")
    .substring(0, 100);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Estimate download size
 */
export function estimateDownloadSize(contents: TimeCapsuleContent[]): number {
  return contents.reduce((total, content) => total + (content.size || 0), 0);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
