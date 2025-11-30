/**
 * Type Converter Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  toCamelCase,
  toSnakeCase,
  parseISODate,
  formatDateToISO,
  formatDateTimeToISO,
} from '../typeConverter';

describe('Type Converter Utilities', () => {
  describe('toCamelCase', () => {
    it('should convert simple snake_case object to camelCase', () => {
      const input = {
        user_id: 1,
        user_name: 'test',
        is_active: true,
      };

      const expected = {
        userId: 1,
        userName: 'test',
        isActive: true,
      };

      expect(toCamelCase(input)).toEqual(expected);
    });

    it('should handle nested objects', () => {
      const input = {
        user_data: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const expected = {
        userData: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      expect(toCamelCase(input)).toEqual(expected);
    });

    it('should handle arrays of objects', () => {
      const input = [
        { user_id: 1, user_name: 'Alice' },
        { user_id: 2, user_name: 'Bob' },
      ];

      const expected = [
        { userId: 1, userName: 'Alice' },
        { userId: 2, userName: 'Bob' },
      ];

      expect(toCamelCase(input)).toEqual(expected);
    });

    it('should handle arrays within objects', () => {
      const input = {
        user_list: [
          { user_id: 1 },
          { user_id: 2 },
        ],
      };

      const expected = {
        userList: [
          { userId: 1 },
          { userId: 2 },
        ],
      };

      expect(toCamelCase(input)).toEqual(expected);
    });

    it('should preserve Date objects', () => {
      const date = new Date('2024-01-01');
      const input = {
        created_at: date,
      };

      const result = toCamelCase<{ createdAt: Date }>(input);
      expect(result).toEqual({ createdAt: date });
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should handle null and undefined values', () => {
      const input = {
        user_id: null,
        user_name: undefined,
      };

      const expected = {
        userId: null,
        userName: undefined,
      };

      expect(toCamelCase(input)).toEqual(expected);
    });

    it('should handle primitive values', () => {
      expect(toCamelCase('string')).toBe('string');
      expect(toCamelCase(123)).toBe(123);
      expect(toCamelCase(true)).toBe(true);
      expect(toCamelCase(null)).toBe(null);
    });
  });

  describe('toSnakeCase', () => {
    it('should convert simple camelCase object to snake_case', () => {
      const input = {
        userId: 1,
        userName: 'test',
        isActive: true,
      };

      const expected = {
        user_id: 1,
        user_name: 'test',
        is_active: true,
      };

      expect(toSnakeCase(input)).toEqual(expected);
    });

    it('should handle nested objects', () => {
      const input = {
        userData: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const expected = {
        user_data: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      expect(toSnakeCase(input)).toEqual(expected);
    });

    it('should handle arrays of objects', () => {
      const input = [
        { userId: 1, userName: 'Alice' },
        { userId: 2, userName: 'Bob' },
      ];

      const expected = [
        { user_id: 1, user_name: 'Alice' },
        { user_id: 2, user_name: 'Bob' },
      ];

      expect(toSnakeCase(input)).toEqual(expected);
    });

    it('should handle arrays within objects', () => {
      const input = {
        userList: [
          { userId: 1 },
          { userId: 2 },
        ],
      };

      const expected = {
        user_list: [
          { user_id: 1 },
          { user_id: 2 },
        ],
      };

      expect(toSnakeCase(input)).toEqual(expected);
    });

    it('should preserve Date objects', () => {
      const date = new Date('2024-01-01');
      const input = {
        createdAt: date,
      };

      const result = toSnakeCase<{ created_at: Date }>(input);
      expect(result).toEqual({ created_at: date });
      expect(result.created_at).toBeInstanceOf(Date);
    });

    it('should handle null and undefined values', () => {
      const input = {
        userId: null,
        userName: undefined,
      };

      const expected = {
        user_id: null,
        user_name: undefined,
      };

      expect(toSnakeCase(input)).toEqual(expected);
    });

    it('should handle primitive values', () => {
      expect(toSnakeCase('string')).toBe('string');
      expect(toSnakeCase(123)).toBe(123);
      expect(toSnakeCase(true)).toBe(true);
      expect(toSnakeCase(null)).toBe(null);
    });
  });

  describe('parseISODate', () => {
    it('should parse valid ISO date string', () => {
      const dateString = '2024-01-15T10:30:00.000Z';
      const result = parseISODate(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe(dateString);
    });

    it('should parse date-only ISO string', () => {
      const dateString = '2024-01-15';
      const result = parseISODate(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January is 0
      expect(result?.getDate()).toBe(15);
    });

    it('should return null for invalid date string', () => {
      expect(parseISODate('invalid-date')).toBeNull();
      expect(parseISODate('2024-13-45')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseISODate('')).toBeNull();
    });

    it('should return null for non-string input', () => {
      expect(parseISODate(123 as any)).toBeNull();
      expect(parseISODate(null as any)).toBeNull();
      expect(parseISODate(undefined as any)).toBeNull();
    });
  });

  describe('formatDateToISO', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = formatDateToISO(date);

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toContain('2024');
      expect(result).toContain('01');
    });

    it('should pad single digit months and days', () => {
      const date = new Date('2024-03-05T00:00:00.000Z');
      const result = formatDateToISO(date);

      expect(result).toContain('03');
      expect(result).toContain('05');
    });
  });

  describe('formatDateTimeToISO', () => {
    it('should format date to ISO 8601 string', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = formatDateTimeToISO(date);

      expect(result).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should include milliseconds', () => {
      const date = new Date('2024-01-15T10:30:00.123Z');
      const result = formatDateTimeToISO(date);

      expect(result).toContain('.123Z');
    });
  });

  describe('round-trip conversion', () => {
    it('should preserve data through camelCase -> snake_case -> camelCase', () => {
      const original = {
        userId: 1,
        userName: 'test',
        userProfile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const snakeCase = toSnakeCase(original);
      const backToCamel = toCamelCase(snakeCase);

      expect(backToCamel).toEqual(original);
    });

    it('should preserve data through snake_case -> camelCase -> snake_case', () => {
      const original = {
        user_id: 1,
        user_name: 'test',
        user_profile: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const camelCase = toCamelCase(original);
      const backToSnake = toSnakeCase(camelCase);

      expect(backToSnake).toEqual(original);
    });
  });
});

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('Property-Based Tests', () => {
  /**
   * Feature: backend-api-integration, Property 3: Request data transformation (camelCase to snake_case)
   * Validates: Requirements 8.2
   * 
   * For any object with camelCase field names being sent to the backend,
   * all field names should be converted to snake_case format.
   */
  describe('Property 3: Request data transformation (camelCase to snake_case)', () => {
    it('should convert all camelCase keys to snake_case for any object', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-zA-Z0-9]*$/.test(s)),
            fc.oneof(
              fc.string(),
              fc.integer(),
              fc.boolean(),
              fc.constant(null)
            )
          ),
          (obj) => {
            const result = toSnakeCase(obj) as Record<string, unknown>;
            
            // All keys should be in snake_case format
            Object.keys(result).forEach(key => {
              expect(key).toMatch(/^[a-z][a-z0-9_]*$/);
              expect(key).not.toMatch(/[A-Z]/);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle nested objects recursively', () => {
      fc.assert(
        fc.property(
          fc.object({ maxDepth: 3 }),
          (obj) => {
            const result = toSnakeCase(obj);
            
            // Helper to check all keys recursively
            const checkAllKeys = (value: any): void => {
              if (Array.isArray(value)) {
                value.forEach(checkAllKeys);
              } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
                Object.keys(value).forEach(key => {
                  expect(key).toMatch(/^[a-z][a-z0-9_]*$/);
                  expect(key).not.toMatch(/[A-Z]/);
                  checkAllKeys(value[key]);
                });
              }
            };
            
            checkAllKeys(result);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve values while converting keys', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-zA-Z0-9]*$/.test(s)),
            fc.oneof(fc.string(), fc.integer(), fc.boolean())
          ),
          (obj) => {
            const result = toSnakeCase(obj) as Record<string, unknown>;
            
            // All original values should be present
            const originalValues = Object.values(obj).sort();
            const resultValues = Object.values(result).sort();
            expect(resultValues).toEqual(originalValues);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: backend-api-integration, Property 4: Response data transformation (snake_case to camelCase)
   * Validates: Requirements 8.1
   * 
   * For any backend response with snake_case field names,
   * all field names should be converted to camelCase format in the frontend.
   */
  describe('Property 4: Response data transformation (snake_case to camelCase)', () => {
    it('should convert all snake_case keys to camelCase for any object', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-z0-9_]*$/.test(s)),
            fc.oneof(
              fc.string(),
              fc.integer(),
              fc.boolean(),
              fc.constant(null)
            )
          ),
          (obj) => {
            const result = toCamelCase(obj) as Record<string, unknown>;
            
            // All keys should be in camelCase format (no underscores)
            Object.keys(result).forEach(key => {
              expect(key).not.toContain('_');
              expect(key).toMatch(/^[a-z][a-zA-Z0-9]*$/);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle nested objects recursively', () => {
      fc.assert(
        fc.property(
          fc.object({ maxDepth: 3 }),
          (obj) => {
            // Convert to snake_case first to ensure we have snake_case input
            const snakeCaseObj = toSnakeCase(obj);
            const result = toCamelCase(snakeCaseObj);
            
            // Helper to check all keys recursively
            const checkAllKeys = (value: any): void => {
              if (Array.isArray(value)) {
                value.forEach(checkAllKeys);
              } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
                Object.keys(value).forEach(key => {
                  expect(key).not.toContain('_');
                  expect(key).toMatch(/^[a-z][a-zA-Z0-9]*$/);
                  checkAllKeys(value[key]);
                });
              }
            };
            
            checkAllKeys(result);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve values while converting keys', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-z0-9_]*$/.test(s)),
            fc.oneof(fc.string(), fc.integer(), fc.boolean())
          ),
          (obj) => {
            const result = toCamelCase(obj) as Record<string, unknown>;
            
            // All original values should be present
            const originalValues = Object.values(obj).sort();
            const resultValues = Object.values(result).sort();
            expect(resultValues).toEqual(originalValues);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should be inverse of toSnakeCase (round-trip property)', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-z0-9_]*$/.test(s)),
            fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null))
          ),
          (obj) => {
            const camelCase = toCamelCase(obj) as Record<string, unknown>;
            const backToSnake = toSnakeCase(camelCase) as Record<string, unknown>;
            
            expect(backToSnake).toEqual(obj);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: backend-api-integration, Property 12: ISO date string conversion
   * Validates: Requirements 8.3
   * 
   * For any ISO 8601 date string received from the backend,
   * it should be correctly converted to a JavaScript Date object.
   */
  describe('Property 12: ISO date string conversion', () => {
    it('should parse any valid ISO date string to a Date object', () => {
      fc.assert(
        fc.property(
          fc.date(),
          (date) => {
            const isoString = date.toISOString();
            const parsed = parseISODate(isoString);
            
            expect(parsed).toBeInstanceOf(Date);
            expect(parsed?.getTime()).toBe(date.getTime());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle date-only ISO strings (YYYY-MM-DD)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1970, max: 2100 }),
          fc.integer({ min: 1, max: 12 }),
          fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
          (year, month, day) => {
            const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const parsed = parseISODate(dateString);
            
            expect(parsed).toBeInstanceOf(Date);
            expect(parsed?.getFullYear()).toBe(year);
            expect(parsed?.getMonth()).toBe(month - 1); // JavaScript months are 0-indexed
            expect(parsed?.getDate()).toBe(day);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null for invalid date strings', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => {
            // Filter out valid ISO date strings
            const parsed = new Date(s);
            return isNaN(parsed.getTime());
          }),
          (invalidString) => {
            const result = parseISODate(invalidString);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should round-trip: Date -> ISO string -> Date preserves value', () => {
      fc.assert(
        fc.property(
          fc.date(),
          (originalDate) => {
            const isoString = formatDateTimeToISO(originalDate);
            const parsedDate = parseISODate(isoString);
            
            expect(parsedDate).toBeInstanceOf(Date);
            expect(parsedDate?.getTime()).toBe(originalDate.getTime());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle dates across different timezones consistently', () => {
      fc.assert(
        fc.property(
          fc.date(),
          (date) => {
            // ISO strings are always in UTC
            const isoString = date.toISOString();
            const parsed = parseISODate(isoString);
            
            // The parsed date should represent the same moment in time
            expect(parsed?.toISOString()).toBe(isoString);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should format any Date to valid ISO date string (YYYY-MM-DD)', () => {
      fc.assert(
        fc.property(
          fc.date(),
          (date) => {
            const formatted = formatDateToISO(date);
            
            // Should match YYYY-MM-DD format
            expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            
            // Should be parseable back to a date
            const parsed = new Date(formatted);
            expect(parsed).toBeInstanceOf(Date);
            expect(isNaN(parsed.getTime())).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
