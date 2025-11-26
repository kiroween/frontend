/**
 * Download Utilities Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadFile, downloadBlob, formatFileSize, estimateDownloadSize, sanitizeFilename } from '../download';
import { TimeCapsuleContent } from '../types';

describe('Download Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });
  });

  describe('estimateDownloadSize', () => {
    it('should calculate total size correctly', () => {
      const contents: TimeCapsuleContent[] = [
        {
          id: '1',
          type: 'text',
          name: 'file1.txt',
          url: 'http://test.com/file1.txt',
          size: 1024,
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'image',
          name: 'file2.jpg',
          url: 'http://test.com/file2.jpg',
          size: 2048,
          createdAt: new Date(),
        },
      ];

      expect(estimateDownloadSize(contents)).toBe(3072);
    });

    it('should handle empty array', () => {
      expect(estimateDownloadSize([])).toBe(0);
    });

    it('should handle missing size', () => {
      const contents: TimeCapsuleContent[] = [
        {
          id: '1',
          type: 'text',
          name: 'file1.txt',
          url: 'http://test.com/file1.txt',
          size: 0,
          createdAt: new Date(),
        },
      ];

      expect(estimateDownloadSize(contents)).toBe(0);
    });
  });

  describe('downloadFile', () => {
    it('should create and click download link', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };

      createElementSpy.mockReturnValue(mockLink as any);

      downloadFile('http://test.com/file.txt', 'file.txt');

      expect(mockLink.href).toBe('http://test.com/file.txt');
      expect(mockLink.download).toBe('file.txt');
      expect(mockLink.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('downloadBlob', () => {
    it('should create object URL and download', () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const mockUrl = 'blob:http://test.com/123';

      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl);
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };

      createElementSpy.mockReturnValue(mockLink as any);

      downloadBlob(blob, 'test.txt');

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(mockLink.href).toBe(mockUrl);
      expect(mockLink.download).toBe('test.txt');

      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });
});
