/**
 * ShareButton Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButton } from '../ShareButton';
import * as api from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  timeCapsuleApi: {
    share: vi.fn(),
  },
}));

describe('ShareButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render share button', () => {
    render(
      <ShareButton
        timeCapsuleId="test-123"
        title="Test Capsule"
      />
    );

    expect(screen.getByText('공유')).toBeInTheDocument();
  });

  it('should show loading state when clicked', async () => {
    const mockShare = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    (api.timeCapsuleApi.share as any) = mockShare;

    render(
      <ShareButton
        timeCapsuleId="test-123"
        title="Test Capsule"
      />
    );

    const button = screen.getByText('공유');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('생성 중...')).toBeInTheDocument();
    });
  });

  it('should call share API with correct parameters', async () => {
    const mockShare = vi.fn().mockResolvedValue({
      data: {
        shareUrl: 'https://test.com/shared/abc123',
        shareId: 'abc123',
      },
      status: 200,
    });
    (api.timeCapsuleApi.share as any) = mockShare;

    render(
      <ShareButton
        timeCapsuleId="test-123"
        title="Test Capsule"
      />
    );

    const button = screen.getByText('공유');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        timeCapsuleId: 'test-123',
        permissions: 'view',
      });
    });
  });

  it('should show error message on API failure', async () => {
    const mockShare = vi.fn().mockRejectedValue(new Error('API Error'));
    (api.timeCapsuleApi.share as any) = mockShare;

    render(
      <ShareButton
        timeCapsuleId="test-123"
        title="Test Capsule"
      />
    );

    const button = screen.getByText('공유');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/공유 링크 생성에 실패했습니다/)).toBeInTheDocument();
    });
  });

  it('should call onShare callback when provided', async () => {
    const mockShare = vi.fn().mockResolvedValue({
      data: {
        shareUrl: 'https://test.com/shared/abc123',
        shareId: 'abc123',
      },
      status: 200,
    });
    (api.timeCapsuleApi.share as any) = mockShare;

    const onShareMock = vi.fn();

    render(
      <ShareButton
        timeCapsuleId="test-123"
        title="Test Capsule"
        onShare={onShareMock}
      />
    );

    const button = screen.getByText('공유');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });
  });
});
