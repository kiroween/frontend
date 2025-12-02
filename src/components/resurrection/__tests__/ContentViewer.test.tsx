/**
 * ContentViewer Component Property-Based Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { ContentViewer } from '../ContentViewer';
import { TimeCapsule, TimeCapsuleStatus } from '@/lib/types/timecapsule';

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Generate a random TimeCapsule for testing
 */
const timeCapsuleArbitrary = (status: TimeCapsuleStatus) =>
  fc.record({
    id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
    title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
    openDate: fc.date(),
    createdAt: fc.date(),
    updatedAt: fc.date(),
    createdBy: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
    status: fc.constant(status),
    contents: fc.array(
      fc.record({
        id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        type: fc.constantFrom('text', 'image', 'video', 'file'),
        name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        url: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        size: fc.integer({ min: 0 }),
        mimeType: fc.option(fc.string(), { nil: undefined }),
        createdAt: fc.date(),
      }),
      { minLength: 0, maxLength: 10 }
    ),
    collaborators: fc.array(
      fc.record({
        id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        email: fc.emailAddress(),
        role: fc.constantFrom('owner', 'editor', 'viewer'),
        joinedAt: fc.date(),
        avatar: fc.option(fc.string(), { nil: undefined }),
      })
    ),
    shareUrl: fc.option(fc.string(), { nil: undefined }),
    shareId: fc.option(fc.string(), { nil: undefined }),
    isPublic: fc.boolean(),
  }) as fc.Arbitrary<TimeCapsule>;

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('ContentViewer Property-Based Tests', () => {
  /**
   * Feature: backend-api-integration, Property 5: Locked capsule content hiding
   * Validates: Requirements 3.3
   *
   * For any time capsule with `isUnlocked: false`, the content field should not be
   * displayed in the UI and `daysRemaining` should be shown.
   */
  describe('Property 5: Locked capsule content hiding', () => {
    it('should hide content for any locked time capsule', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('locked'),
          fc.integer({ min: 0, max: 365 }),
          (capsule, daysRemaining) => {
            const { container } = render(
              <ContentViewer
                timeCapsule={capsule}
                daysRemaining={daysRemaining}
                onRebury={vi.fn()}
              />
            );

            try {
              // Content (description) should NOT be visible
              expect(screen.queryByText(capsule.description)).not.toBeInTheDocument();

              // Should show locked status
              expect(screen.getByText('Sealed Memory')).toBeInTheDocument();
              expect(screen.getByText('This time capsule is still locked')).toBeInTheDocument();

              // Should show days remaining
              expect(screen.getByText(`${daysRemaining}days`)).toBeInTheDocument();
              expect(screen.getByText('remaining')).toBeInTheDocument();

              // Should show lock icon
              expect(container.textContent).toContain('🔒');

              // Should NOT show message section
              expect(screen.queryByText('Message from the past')).not.toBeInTheDocument();

              // Should NOT show files section
              expect(screen.queryByText(/Sealed Memory들/)).not.toBeInTheDocument();

              // Should NOT show share/download buttons
              expect(screen.queryByText('🔗 Share')).not.toBeInTheDocument();
              expect(screen.queryByText('💾 Download')).not.toBeInTheDocument();

              // Should only show back button
              expect(screen.getByText('← Go Back')).toBeInTheDocument();
            } finally {
              cleanup();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always show unlock date for locked capsules', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('locked'),
          fc.integer({ min: 0, max: 365 }),
          (capsule, daysRemaining) => {
            render(
              <ContentViewer
                timeCapsule={capsule}
                daysRemaining={daysRemaining}
                onRebury={vi.fn()}
              />
            );

            // Unlock date should be displayed
            const formattedDate = capsule.openDate.toLocaleDateString('ko-KR');
            expect(screen.getByText(`Unlock date: ${formattedDate}`)).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not render files list for locked capsules even if contents exist', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('locked').filter(c => c.contents.length > 0),
          fc.integer({ min: 0, max: 365 }),
          (capsule, daysRemaining) => {
            render(
              <ContentViewer
                timeCapsule={capsule}
                daysRemaining={daysRemaining}
                onRebury={vi.fn()}
              />
            );

            // Files section should NOT be visible
            expect(screen.queryByText(/Sealed Memory들/)).not.toBeInTheDocument();

            // Individual file names should NOT be visible
            capsule.contents.forEach(file => {
              expect(screen.queryByText(file.name)).not.toBeInTheDocument();
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: backend-api-integration, Property 6: Unlocked capsule content display
   * Validates: Requirements 3.4
   *
   * For any time capsule with `isUnlocked: true`, the full content should be
   * displayed in the UI.
   */
  describe('Property 6: Unlocked capsule content display', () => {
    it('should display full content for any unlocked time capsule', () => {
      fc.assert(
        fc.property(timeCapsuleArbitrary('unlocked'), (capsule) => {
          render(
            <ContentViewer
              timeCapsule={capsule}
              onRebury={vi.fn()}
              onDownload={vi.fn()}
              onShare={vi.fn()}
            />
          );

          // Content (description) should be visible
          expect(screen.getByText(capsule.description)).toBeInTheDocument();

          // Should show message section header
          expect(screen.getByText('Message from the past')).toBeInTheDocument();

          // Should NOT show locked status
          expect(screen.queryByText('Sealed Memory')).not.toBeInTheDocument();
          expect(screen.queryByText('This time capsule is still locked')).not.toBeInTheDocument();

          // Should NOT show days remaining
          expect(screen.queryByText('remaining')).not.toBeInTheDocument();

          // Should show action buttons
          expect(screen.getByText('🔗 Share')).toBeInTheDocument();
          expect(screen.getByText('💾 Download')).toBeInTheDocument();
          expect(screen.getByText('🪦 Rebury')).toBeInTheDocument();

          // Should NOT show back button
          expect(screen.queryByText('← Go Back')).not.toBeInTheDocument();
        }),
        { numRuns: 100 }
      );
    });

    it('should display files list for unlocked capsules with contents', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('unlocked').filter(c => c.contents.length > 0),
          (capsule) => {
            render(
              <ContentViewer
                timeCapsule={capsule}
                onRebury={vi.fn()}
                onDownload={vi.fn()}
                onShare={vi.fn()}
              />
            );

            // Files section should be visible
            expect(
              screen.getByText(`Sealed Memory들 (${capsule.contents.length})`)
            ).toBeInTheDocument();

            // All file names should be visible
            capsule.contents.forEach(file => {
              expect(screen.getByText(file.name)).toBeInTheDocument();
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not show files section for unlocked capsules with no contents', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('unlocked').filter(c => c.contents.length === 0),
          (capsule) => {
            render(
              <ContentViewer
                timeCapsule={capsule}
                onRebury={vi.fn()}
                onDownload={vi.fn()}
                onShare={vi.fn()}
              />
            );

            // Files section should NOT be visible
            expect(screen.queryByText(/Sealed Memory들/)).not.toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display correct file icons based on type', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('unlocked').filter(c => c.contents.length > 0),
          (capsule) => {
            const { container } = render(
              <ContentViewer
                timeCapsule={capsule}
                onRebury={vi.fn()}
                onDownload={vi.fn()}
                onShare={vi.fn()}
              />
            );

            capsule.contents.forEach(file => {
              if (file.type === 'image') {
                expect(container.textContent).toContain('🖼️');
              } else {
                expect(container.textContent).toContain('📄');
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: backend-api-integration, Property 7: Lock status UI rendering
   * Validates: Requirements 4.4
   *
   * For any time capsule detail view, the UI should render differently based on
   * the `isUnlocked` status - showing either the countdown or the full content.
   */
  describe('Property 7: Lock status UI rendering', () => {
    it('should render different UI based on lock status', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
            openDate: fc.date(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
            createdBy: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            status: fc.constantFrom('locked', 'unlocked'),
            contents: fc.array(
              fc.record({
                id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                type: fc.constantFrom('text', 'image', 'video', 'file'),
                name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                url: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                size: fc.integer({ min: 0 }),
                createdAt: fc.date(),
              }),
              { minLength: 1, maxLength: 5 }
            ),
            collaborators: fc.constant([]),
            isPublic: fc.boolean(),
          }) as fc.Arbitrary<TimeCapsule>,
          fc.integer({ min: 0, max: 365 }),
          (capsule, daysRemaining) => {
            render(
              <ContentViewer
                timeCapsule={capsule}
                daysRemaining={capsule.status === 'locked' ? daysRemaining : undefined}
                onRebury={vi.fn()}
                onDownload={vi.fn()}
                onShare={vi.fn()}
              />
            );

            if (capsule.status === 'locked') {
              // Locked UI
              expect(screen.getByText('Sealed Memory')).toBeInTheDocument();
              expect(screen.getByText(`${daysRemaining}days`)).toBeInTheDocument();
              expect(screen.queryByText(capsule.description)).not.toBeInTheDocument();
              expect(screen.queryByText('🔗 Share')).not.toBeInTheDocument();
              expect(screen.getByText('← Go Back')).toBeInTheDocument();

              // Files should be hidden
              capsule.contents.forEach(file => {
                expect(screen.queryByText(file.name)).not.toBeInTheDocument();
              });
            } else {
              // Unlocked UI
              expect(screen.getByText(capsule.description)).toBeInTheDocument();
              expect(screen.getByText('Message from the past')).toBeInTheDocument();
              expect(screen.getByText('🔗 Share')).toBeInTheDocument();
              expect(screen.getByText('💾 Download')).toBeInTheDocument();
              expect(screen.queryByText('Sealed Memory')).not.toBeInTheDocument();

              // Files should be visible
              capsule.contents.forEach(file => {
                expect(screen.getByText(file.name)).toBeInTheDocument();
              });
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always show title and creation date regardless of status', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            description: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            openDate: fc.date(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
            createdBy: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            status: fc.constantFrom('locked', 'unlocked'),
            contents: fc.constant([]),
            collaborators: fc.constant([]),
            isPublic: fc.boolean(),
          }) as fc.Arbitrary<TimeCapsule>,
          (capsule) => {
            const { container } = render(
              <ContentViewer
                timeCapsule={capsule}
                daysRemaining={10}
                onRebury={vi.fn()}
              />
            );

            // Title should always be shown (check in container text)
            expect(container.textContent).toContain(capsule.title);

            // Creation date should always be shown
            const formattedDate = capsule.createdAt.toLocaleDateString('ko-KR');
            expect(container.textContent).toContain(formattedDate);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should show different action buttons based on status', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            description: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            openDate: fc.date(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
            createdBy: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            status: fc.constantFrom('locked', 'unlocked'),
            contents: fc.constant([]),
            collaborators: fc.constant([]),
            isPublic: fc.boolean(),
          }) as fc.Arbitrary<TimeCapsule>,
          (capsule) => {
            const { container } = render(
              <ContentViewer
                timeCapsule={capsule}
                daysRemaining={10}
                onRebury={vi.fn()}
                onDownload={vi.fn()}
                onShare={vi.fn()}
              />
            );

            if (capsule.status === 'locked') {
              // Only back button for locked
              expect(container.textContent).toContain('← Go Back');
              expect(container.textContent).not.toContain('🔗 Share');
              expect(container.textContent).not.toContain('💾 Download');
              expect(container.textContent).not.toContain('🪦 Rebury');
            } else {
              // Full action buttons for unlocked
              expect(container.textContent).toContain('🔗 Share');
              expect(container.textContent).toContain('💾 Download');
              expect(container.textContent).toContain('🪦 Rebury');
              expect(container.textContent).not.toContain('← Go Back');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
