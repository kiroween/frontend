/**
 * TombstoneCard Component Property-Based Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { TombstoneCard } from '../TombstoneCard';
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
      })
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

describe('TombstoneCard Property-Based Tests', () => {
  /**
   * Feature: backend-api-integration, Property 5: Locked capsule content hiding
   * Validates: Requirements 3.3
   *
   * For any time capsule with `isUnlocked: false`, the content field should not be
   * displayed in the UI and `daysRemaining` should be shown.
   */
  describe('Property 5: Locked capsule content hiding', () => {
    it('should not display content for any locked time capsule', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('locked'),
          fc.integer({ min: 0, max: 365 }),
          (capsule, daysRemaining) => {
            const { container } = render(
              <TombstoneCard
                timeCapsule={capsule}
                daysRemaining={daysRemaining}
              />
            );

            try {
              // Content (description) should NOT be visible
              expect(screen.queryByText(capsule.description)).not.toBeInTheDocument();

              // Should show locked status
              expect(screen.getByText('봉인된 기억')).toBeInTheDocument();

              // Should show days remaining
              expect(screen.getByText(`${daysRemaining}일`)).toBeInTheDocument();
              expect(screen.getByText('남은 시간')).toBeInTheDocument();

              // Should show lock icon
              expect(container.textContent).toContain('🔒');

              // Should NOT show "부활하기" button
              expect(screen.queryByText('부활하기')).not.toBeInTheDocument();
            } finally {
              cleanup();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always show daysRemaining for locked capsules', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('locked'),
          fc.integer({ min: 0, max: 1000 }),
          (capsule, daysRemaining) => {
            render(
              <TombstoneCard
                timeCapsule={capsule}
                daysRemaining={daysRemaining}
              />
            );

            try {
              // Days remaining should be displayed
              const daysElement = screen.getByText(`${daysRemaining}일`);
              expect(daysElement).toBeInTheDocument();
            } finally {
              cleanup();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should show locked visual indicators for any locked capsule', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('locked'),
          (capsule) => {
            const { container } = render(
              <TombstoneCard timeCapsule={capsule} daysRemaining={10} />
            );

            // Should have locked styling (border-stone-700)
            const card = container.querySelector('.tombstone-card');
            expect(card?.className).toContain('border-stone-700');

            // Should show chain and lock emojis
            expect(container.textContent).toContain('⛓️');
            expect(container.textContent).toContain('🔒');
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
    it('should display unlock status for any unlocked time capsule', () => {
      fc.assert(
        fc.property(timeCapsuleArbitrary('unlocked'), (capsule) => {
          const { container } = render(
            <TombstoneCard timeCapsule={capsule} />
          );

          try {
            // Should show unlocked status
            expect(screen.getByText('부활 가능')).toBeInTheDocument();

            // Should show skull and sparkle emojis
            expect(container.textContent).toContain('💀');
            expect(container.textContent).toContain('✨');

            // Should show "부활하기" button
            expect(screen.getByText('부활하기')).toBeInTheDocument();

            // Should NOT show "봉인된 기억"
            expect(screen.queryByText('봉인된 기억')).not.toBeInTheDocument();

            // Should NOT show days remaining
            expect(screen.queryByText('남은 시간')).not.toBeInTheDocument();
          } finally {
            cleanup();
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should not show daysRemaining for unlocked capsules', () => {
      fc.assert(
        fc.property(timeCapsuleArbitrary('unlocked'), (capsule) => {
          render(<TombstoneCard timeCapsule={capsule} />);

          // Days remaining should NOT be displayed
          expect(screen.queryByText(/\d+일/)).not.toBeInTheDocument();
          expect(screen.queryByText('남은 시간')).not.toBeInTheDocument();
        }),
        { numRuns: 100 }
      );
    });

    it('should show unlocked visual indicators for any unlocked capsule', () => {
      fc.assert(
        fc.property(timeCapsuleArbitrary('unlocked'), (capsule) => {
          const { container } = render(
            <TombstoneCard timeCapsule={capsule} />
          );

          // Should have unlocked styling (border with soul-blue)
          const card = container.querySelector('.tombstone-card');
          expect(card?.className).toContain('border-[var(--soul-blue)]');

          // Should show crack effect
          const crackEffect = container.querySelector(
            '.absolute.inset-0.pointer-events-none'
          );
          expect(crackEffect).toBeInTheDocument();
        }),
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
            contents: fc.constant([]),
            collaborators: fc.constant([]),
            isPublic: fc.boolean(),
          }) as fc.Arbitrary<TimeCapsule>,
          fc.integer({ min: 0, max: 365 }),
          (capsule, daysRemaining) => {
            const { container } = render(
              <TombstoneCard
                timeCapsule={capsule}
                daysRemaining={capsule.status === 'locked' ? daysRemaining : undefined}
              />
            );

            try {
              if (capsule.status === 'locked') {
                // Locked UI
                expect(screen.getByText('봉인된 기억')).toBeInTheDocument();
                expect(screen.getByText(`${daysRemaining}일`)).toBeInTheDocument();
                expect(screen.queryByText('부활하기')).not.toBeInTheDocument();
                expect(container.textContent).toContain('🔒');
              } else {
                // Unlocked UI
                expect(screen.getByText('부활 가능')).toBeInTheDocument();
                expect(screen.getByText('부활하기')).toBeInTheDocument();
                expect(screen.queryByText('봉인된 기억')).not.toBeInTheDocument();
                expect(container.textContent).toContain('💀');
              }
            } finally {
              cleanup();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should consistently apply styling based on status', () => {
      fc.assert(
        fc.property(
          timeCapsuleArbitrary('locked'),
          timeCapsuleArbitrary('unlocked'),
          (lockedCapsule, unlockedCapsule) => {
            // Render locked capsule
            const { container: lockedContainer } = render(
              <TombstoneCard timeCapsule={lockedCapsule} daysRemaining={10} />
            );
            const lockedCard = lockedContainer.querySelector('.tombstone-card');
            expect(lockedCard?.className).toContain('border-stone-700');

            // Render unlocked capsule
            const { container: unlockedContainer } = render(
              <TombstoneCard timeCapsule={unlockedCapsule} />
            );
            const unlockedCard = unlockedContainer.querySelector('.tombstone-card');
            expect(unlockedCard?.className).toContain('border-[var(--soul-blue)]');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should show title and date for both locked and unlocked capsules', () => {
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
            const { container } = render(<TombstoneCard timeCapsule={capsule} daysRemaining={10} />);

            // Title should always be shown (check in container text)
            expect(container.textContent).toContain(capsule.title);

            // Date should always be shown
            const formattedDate = capsule.openDate.toLocaleDateString('ko-KR');
            expect(container.textContent).toContain(formattedDate);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
