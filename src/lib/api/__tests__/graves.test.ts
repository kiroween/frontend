/**
 * Graves API Tests
 * Property-Based Tests and Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import { gravesApi, tombstoneToTimeCapsule, type TombstoneResponseDto, type CreateGraveRequest } from '../graves';
import { ApiErrorCode } from '../../types/api';

// ============================================================================
// Unit Tests
// ============================================================================

describe('Graves API Unit Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a time capsule', async () => {
      // Arrange
      const createData: CreateGraveRequest = {
        title: 'My First Time Capsule',
        content: 'This is a test time capsule',
        unlockDate: new Date('2025-12-31T00:00:00Z'),
      };

      const mockBackendResponse = {
        status: 201,
        data: {
          result: {
            id: 1,
            user_id: 1,
            title: 'My First Time Capsule',
            content: 'This is a test time capsule',
            unlock_date: '2025-12-31T00:00:00.000Z',
            is_unlocked: false,
            days_remaining: 365,
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await gravesApi.create(createData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.data.id).toBe('1');
      expect(response.data.title).toBe('My First Time Capsule');
      expect(response.data.description).toBe('This is a test time capsule');
      expect(response.data.status).toBe('locked');
      expect(response.data.openDate).toBeInstanceOf(Date);

      // Verify the request was made with correct data
      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toHaveProperty('title', 'My First Time Capsule');
      expect(requestBody).toHaveProperty('content', 'This is a test time capsule');
      expect(requestBody).toHaveProperty('unlock_date');
    });

    it('should handle create failure with validation error (400)', async () => {
      // Arrange
      const createData: CreateGraveRequest = {
        title: '',
        content: 'Content',
        unlockDate: new Date('2020-01-01T00:00:00Z'), // Past date
      };

      const mockErrorResponse = {
        status: 400,
        error: {
          code: 'VALIDATION_ERROR',
          message: '입력값이 올바르지 않습니다',
          details: {
            title: '제목은 필수 항목입니다',
            unlock_date: '잠금 해제 날짜는 미래여야 합니다',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await gravesApi.create(createData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.VALIDATION_ERROR);
        expect(error.message).toBe('입력값이 올바르지 않습니다');
        expect(error.statusCode).toBe(400);
        expect(error.details).toBeDefined();
      }
    });

    it('should handle create failure with past unlock date (400)', async () => {
      // Arrange
      const createData: CreateGraveRequest = {
        title: 'Test Capsule',
        content: 'Test content',
        unlockDate: new Date('2020-01-01T00:00:00Z'),
      };

      const mockErrorResponse = {
        status: 400,
        error: {
          code: 'VALIDATION_ERROR',
          message: '잠금 해제 날짜는 미래여야 합니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await gravesApi.create(createData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.VALIDATION_ERROR);
        expect(error.statusCode).toBe(400);
      }
    });

    it('should handle unauthorized create attempt (401)', async () => {
      // Arrange
      const createData: CreateGraveRequest = {
        title: 'Test Capsule',
        content: 'Test content',
        unlockDate: new Date('2025-12-31T00:00:00Z'),
      };

      const mockErrorResponse = {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await gravesApi.create(createData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(error.statusCode).toBe(401);
      }
    });
  });

  describe('getAll', () => {
    it('should successfully retrieve all time capsules', async () => {
      // Arrange
      const mockBackendResponse = {
        status: 200,
        data: {
          result: [
            {
              id: 1,
              user_id: 1,
              title: 'First Capsule',
              content: undefined,
              unlock_date: '2025-12-31T00:00:00.000Z',
              is_unlocked: false,
              days_remaining: 365,
              created_at: '2024-01-01T00:00:00.000Z',
              updated_at: '2024-01-01T00:00:00.000Z',
            },
            {
              id: 2,
              user_id: 1,
              title: 'Second Capsule',
              content: 'This is unlocked content',
              unlock_date: '2024-01-01T00:00:00.000Z',
              is_unlocked: true,
              days_remaining: undefined,
              created_at: '2023-12-01T00:00:00.000Z',
              updated_at: '2024-01-01T00:00:00.000Z',
            },
          ],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await gravesApi.getAll();

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(2);
      
      // Check first capsule (locked)
      expect(response.data[0].id).toBe('1');
      expect(response.data[0].title).toBe('First Capsule');
      expect(response.data[0].status).toBe('locked');
      expect(response.data[0].description).toBe('');
      
      // Check second capsule (unlocked)
      expect(response.data[1].id).toBe('2');
      expect(response.data[1].title).toBe('Second Capsule');
      expect(response.data[1].status).toBe('unlocked');
      expect(response.data[1].description).toBe('This is unlocked content');

      // Verify the request was made to the correct endpoint
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/api/graves');
      expect(fetchCall[1].method).toBe('GET');
    });

    it('should return empty array when user has no time capsules', async () => {
      // Arrange
      const mockBackendResponse = {
        status: 200,
        data: {
          result: [],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await gravesApi.getAll();

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(0);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should handle unauthorized access (401)', async () => {
      // Arrange
      const mockErrorResponse = {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await gravesApi.getAll();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(error.statusCode).toBe(401);
      }
    });
  });

  describe('getById', () => {
    it('should successfully retrieve a specific time capsule', async () => {
      // Arrange
      const graveId = 1;
      const mockBackendResponse = {
        status: 200,
        data: {
          result: {
            id: 1,
            user_id: 1,
            title: 'My Time Capsule',
            content: 'This is the content',
            unlock_date: '2024-01-01T00:00:00.000Z',
            is_unlocked: true,
            days_remaining: undefined,
            created_at: '2023-12-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await gravesApi.getById(graveId);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.id).toBe('1');
      expect(response.data.title).toBe('My Time Capsule');
      expect(response.data.description).toBe('This is the content');
      expect(response.data.status).toBe('unlocked');

      // Verify the request was made to the correct endpoint
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/api/graves/1');
      expect(fetchCall[1].method).toBe('GET');
    });

    it('should handle time capsule not found (404)', async () => {
      // Arrange
      const graveId = 999;
      const mockErrorResponse = {
        status: 404,
        error: {
          code: 'NOT_FOUND',
          message: '타임캡슐을 찾을 수 없습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await gravesApi.getById(graveId);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.NOT_FOUND);
        expect(error.message).toBe('타임캡슐을 찾을 수 없습니다');
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle forbidden access (403)', async () => {
      // Arrange
      const graveId = 5;
      const mockErrorResponse = {
        status: 403,
        error: {
          code: 'FORBIDDEN',
          message: '접근 권한이 없습니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await gravesApi.getById(graveId);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.FORBIDDEN);
        expect(error.message).toBe('접근 권한이 없습니다');
        expect(error.statusCode).toBe(403);
      }
    });

    it('should handle unauthorized access (401)', async () => {
      // Arrange
      const graveId = 1;
      const mockErrorResponse = {
        status: 401,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      try {
        await gravesApi.getById(graveId);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(ApiErrorCode.UNAUTHORIZED);
        expect(error.statusCode).toBe(401);
      }
    });

    it('should accept string ID and convert to number', async () => {
      // Arrange
      const graveId = '42';
      const mockBackendResponse = {
        status: 200,
        data: {
          result: {
            id: 42,
            user_id: 1,
            title: 'String ID Test',
            content: 'Content',
            unlock_date: '2025-01-01T00:00:00.000Z',
            is_unlocked: false,
            days_remaining: 30,
            created_at: '2024-12-01T00:00:00.000Z',
            updated_at: '2024-12-01T00:00:00.000Z',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await gravesApi.getById(graveId);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.id).toBe('42');

      // Verify the request was made with the string ID
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/api/graves/42');
    });
  });

  describe('data transformation', () => {
    it('should convert frontend format to backend format on create', async () => {
      // Arrange
      const createData: CreateGraveRequest = {
        title: 'Test',
        content: 'Content',
        unlockDate: new Date('2025-12-31T00:00:00.000Z'),
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          status: 201,
          data: {
            result: {
              id: 1,
              user_id: 1,
              title: 'Test',
              content: 'Content',
              unlock_date: '2025-12-31T00:00:00.000Z',
              is_unlocked: false,
              days_remaining: 365,
              created_at: '2024-01-01T00:00:00.000Z',
              updated_at: '2024-01-01T00:00:00.000Z',
            },
          },
        }),
      });

      // Act
      await gravesApi.create(createData);

      // Assert - verify request body uses snake_case
      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toHaveProperty('unlock_date');
      expect(requestBody).toHaveProperty('user_id');
      expect(requestBody).not.toHaveProperty('unlockDate');
    });

    it('should convert backend format to frontend format on retrieve', async () => {
      // Arrange
      const mockBackendResponse = {
        status: 200,
        data: {
          result: {
            id: 1,
            user_id: 1,
            title: 'Test',
            content: 'Content',
            unlock_date: '2025-12-31T00:00:00.000Z',
            is_unlocked: false,
            days_remaining: 365,
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
          },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockBackendResponse,
      });

      // Act
      const response = await gravesApi.getById(1);

      // Assert - verify response uses camelCase
      expect(response.data).toHaveProperty('openDate');
      expect(response.data).toHaveProperty('createdAt');
      expect(response.data).toHaveProperty('updatedAt');
      expect(response.data).toHaveProperty('createdBy');
      expect(response.data).not.toHaveProperty('unlock_date');
      expect(response.data).not.toHaveProperty('created_at');
      expect(response.data).not.toHaveProperty('updated_at');
      expect(response.data).not.toHaveProperty('user_id');
    });
  });
});

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('Graves API Property-Based Tests', () => {
  /**
   * Feature: backend-api-integration, Property 13: Tombstone to TimeCapsule mapping
   * Validates: Requirements 8.4
   * 
   * For any Tombstone object received from the backend,
   * it should be correctly mapped to a TimeCapsule object with all fields properly converted.
   */
  describe('Property 13: Tombstone to TimeCapsule mapping', () => {
    // Custom arbitrary for generating valid Tombstone objects
    const tombstoneArbitrary = fc.record({
      id: fc.integer({ min: 1, max: 1000000 }),
      user_id: fc.integer({ min: 1, max: 1000000 }),
      title: fc.string({ minLength: 1, maxLength: 200 }),
      content: fc.option(fc.string({ minLength: 0, maxLength: 5000 }), { nil: undefined }),
      unlock_date: fc.date().map(d => d.toISOString()),
      is_unlocked: fc.boolean(),
      days_remaining: fc.option(fc.integer({ min: 0, max: 3650 }), { nil: undefined }),
      created_at: fc.date().map(d => d.toISOString()),
      updated_at: fc.date().map(d => d.toISOString()),
    });

    it('should convert id from number to string', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(typeof result.id).toBe('string');
            expect(result.id).toBe(String(tombstone.id));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert user_id to createdBy as string', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(typeof result.createdBy).toBe('string');
            expect(result.createdBy).toBe(String(tombstone.user_id));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve title exactly', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.title).toBe(tombstone.title);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should map content to description, defaulting to empty string', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            if (tombstone.content !== undefined) {
              expect(result.description).toBe(tombstone.content);
            } else {
              expect(result.description).toBe('');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert unlock_date to openDate as Date object', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.openDate).toBeInstanceOf(Date);
            expect(result.openDate.toISOString()).toBe(tombstone.unlock_date);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert created_at to createdAt as Date object', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.createdAt.toISOString()).toBe(tombstone.created_at);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert updated_at to updatedAt as Date object', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(result.updatedAt.toISOString()).toBe(tombstone.updated_at);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should map is_unlocked to status correctly', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            if (tombstone.is_unlocked) {
              expect(result.status).toBe('unlocked');
            } else {
              expect(result.status).toBe('locked');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should initialize contents as empty array', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(Array.isArray(result.contents)).toBe(true);
            expect(result.contents).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should initialize collaborators as empty array', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(Array.isArray(result.collaborators)).toBe(true);
            expect(result.collaborators).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should set isPublic to false', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.isPublic).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert all required fields for any valid Tombstone', () => {
      fc.assert(
        fc.property(
          tombstoneArbitrary,
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            // Verify all required fields exist
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('openDate');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('updatedAt');
            expect(result).toHaveProperty('createdBy');
            expect(result).toHaveProperty('status');
            expect(result).toHaveProperty('contents');
            expect(result).toHaveProperty('collaborators');
            expect(result).toHaveProperty('isPublic');
            
            // Verify types
            expect(typeof result.id).toBe('string');
            expect(typeof result.title).toBe('string');
            expect(typeof result.description).toBe('string');
            expect(result.openDate).toBeInstanceOf(Date);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(typeof result.createdBy).toBe('string');
            expect(['locked', 'unlocked', 'expired']).toContain(result.status);
            expect(Array.isArray(result.contents)).toBe(true);
            expect(Array.isArray(result.collaborators)).toBe(true);
            expect(typeof result.isPublic).toBe('boolean');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle locked tombstones with days_remaining', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer({ min: 1, max: 1000000 }),
            user_id: fc.integer({ min: 1, max: 1000000 }),
            title: fc.string({ minLength: 1, maxLength: 200 }),
            content: fc.constant(undefined),
            unlock_date: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).map(d => d.toISOString()),
            is_unlocked: fc.constant(false),
            days_remaining: fc.integer({ min: 1, max: 365 }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString()),
          }),
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.status).toBe('locked');
            expect(result.description).toBe('');
            // Note: days_remaining is not mapped to TimeCapsule (not in the type)
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle unlocked tombstones with content', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer({ min: 1, max: 1000000 }),
            user_id: fc.integer({ min: 1, max: 1000000 }),
            title: fc.string({ minLength: 1, maxLength: 200 }),
            content: fc.string({ minLength: 1, maxLength: 5000 }),
            unlock_date: fc.date({ min: new Date(0), max: new Date() }).map(d => d.toISOString()),
            is_unlocked: fc.constant(true),
            days_remaining: fc.constant(undefined),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString()),
          }),
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.status).toBe('unlocked');
            expect(result.description).toBe(tombstone.content);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge case: empty title (though backend should validate)', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer({ min: 1, max: 1000000 }),
            user_id: fc.integer({ min: 1, max: 1000000 }),
            title: fc.constant(''),
            content: fc.option(fc.string(), { nil: undefined }),
            unlock_date: fc.date().map(d => d.toISOString()),
            is_unlocked: fc.boolean(),
            days_remaining: fc.option(fc.integer({ min: 0, max: 3650 }), { nil: undefined }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString()),
          }),
          (tombstone) => {
            const result = tombstoneToTimeCapsule(tombstone);
            
            expect(result.title).toBe('');
            // Should still convert successfully
            expect(typeof result.id).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
