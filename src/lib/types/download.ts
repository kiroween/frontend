/**
 * Download related types
 */

import { TimeCapsuleContent } from './timecapsule';

export type DownloadFormat = 'individual' | 'zip' | 'pdf';

export interface DownloadOptions {
  format: DownloadFormat;
  selectedItems?: string[];
  includeMetadata: boolean;
  includeTimestamp?: boolean;
}

export interface DownloadProgress {
  current: number;
  total: number;
  percentage: number;
  fileName?: string;
}

export interface DownloadMetadata {
  timeCapsuleId: string;
  title: string;
  description: string;
  openDate: Date;
  downloadedAt: Date;
  contents: TimeCapsuleContent[];
}
