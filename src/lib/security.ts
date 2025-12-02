/**
 * Security Utilities
 */

/**
 * Generate a secure random ID for share links
 * Uses crypto.randomUUID() for cryptographically secure random values
 */
export function generateSecureShareId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // Use crypto.randomUUID() for secure random ID
    return crypto.randomUUID().replace(/-/g, "");
  }

  // Fallback for environments without crypto.randomUUID()
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if share link has expired
 */
export function isShareLinkExpired(expiresAt?: Date): boolean {
  if (!expiresAt) {
    return false; // No expiration set
  }

  return new Date() > new Date(expiresAt);
}

/**
 * Rate limiting helper (client-side)
 * Returns true if action should be allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  if (typeof window === "undefined") {
    return true; // Server-side, skip client rate limiting
  }

  const storageKey = `rateLimit_${key}`;
  const now = Date.now();

  try {
    const stored = localStorage.getItem(storageKey);
    const data = stored ? JSON.parse(stored) : { attempts: 0, resetAt: now + windowMs };

    // Reset if window has passed
    if (now > data.resetAt) {
      data.attempts = 1;
      data.resetAt = now + windowMs;
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    }

    // Check if limit exceeded
    if (data.attempts >= maxAttempts) {
      return false;
    }

    // Increment attempts
    data.attempts++;
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return true; // Fail open
  }
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  maxSizeMB: number = 10,
  allowedTypes?: string[]
): { valid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size cannot exceed ${maxSizeMB}MB.`,
    };
  }

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed.`,
    };
  }

  return { valid: true };
}

/**
 * Generate CSRF token (placeholder - should be implemented server-side)
 */
export function generateCSRFToken(): string {
  // This is a placeholder. In production, CSRF tokens should be
  // generated server-side and validated on each request
  return generateSecureShareId();
}
