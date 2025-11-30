/**
 * Type conversion utilities for backend-frontend data transformation
 * Handles snake_case ↔ camelCase conversion and date string conversion
 */

/**
 * Convert a string from snake_case to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert a string from camelCase to snake_case
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Check if a value is a plain object (not an array, Date, or null)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/**
 * Convert object keys from snake_case to camelCase
 * Handles nested objects and arrays recursively
 */
export function toCamelCase<T = unknown>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T;
  }

  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);
      result[camelKey] = toCamelCase(value);
    }
    
    return result as T;
  }

  return obj as T;
}

/**
 * Convert object keys from camelCase to snake_case
 * Handles nested objects and arrays recursively
 */
export function toSnakeCase<T = unknown>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as T;
  }

  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = toSnakeCase(value);
    }
    
    return result as T;
  }

  return obj as T;
}

/**
 * Convert ISO 8601 date string to Date object
 * Returns null if the string is invalid
 */
export function parseISODate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * Convert Date object to ISO 8601 date string (YYYY-MM-DD format)
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Convert Date object to ISO 8601 datetime string
 */
export function formatDateTimeToISO(date: Date): string {
  return date.toISOString();
}
