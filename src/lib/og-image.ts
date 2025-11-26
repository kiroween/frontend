/**
 * Open Graph Image Generation Utilities
 * 
 * TODO: Implement dynamic OG image generation
 * Options:
 * 1. Use @vercel/og for edge runtime image generation
 * 2. Use canvas-based generation
 * 3. Use external service like Cloudinary
 */

export interface OGImageOptions {
  title: string;
  description?: string;
  date?: Date;
  status?: "locked" | "unlocked";
}

/**
 * Generate OG image URL for a time capsule
 * Currently returns placeholder, should be implemented with actual generation
 */
export function generateOGImageUrl(options: OGImageOptions): string {
  // TODO: Implement actual OG image generation
  // For now, return placeholder
  return "/og-image-timegrave.png";
}

/**
 * Generate dynamic OG image using Vercel OG
 * This would be implemented as an API route
 */
export function getOGImageApiUrl(shareId: string): string {
  return `/api/og?shareId=${shareId}`;
}
