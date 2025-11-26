/**
 * Permission and Authorization Utilities
 */

import { TimeCapsule, Collaborator, CollaboratorRole } from "./types";

/**
 * Check if user has permission to access a time capsule
 */
export function canAccessTimeCapsule(
  timeCapsule: TimeCapsule,
  userId: string
): boolean {
  // Owner can always access
  if (timeCapsule.createdBy === userId) {
    return true;
  }

  // Check if user is a collaborator
  return timeCapsule.collaborators.some((c) => c.id === userId);
}

/**
 * Check if user can edit a time capsule
 */
export function canEditTimeCapsule(
  timeCapsule: TimeCapsule,
  userId: string
): boolean {
  // Owner can always edit
  if (timeCapsule.createdBy === userId) {
    return true;
  }

  // Check if user is an editor
  const collaborator = timeCapsule.collaborators.find((c) => c.id === userId);
  return collaborator?.role === "editor" || collaborator?.role === "owner";
}

/**
 * Check if user can delete a time capsule
 */
export function canDeleteTimeCapsule(
  timeCapsule: TimeCapsule,
  userId: string
): boolean {
  // Only owner can delete
  return timeCapsule.createdBy === userId;
}

/**
 * Check if user can manage collaborators
 */
export function canManageCollaborators(
  timeCapsule: TimeCapsule,
  userId: string
): boolean {
  // Only owner can manage collaborators
  return timeCapsule.createdBy === userId;
}

/**
 * Check if user can share a time capsule
 */
export function canShareTimeCapsule(
  timeCapsule: TimeCapsule,
  userId: string
): boolean {
  // Owner and editors can share
  return canEditTimeCapsule(timeCapsule, userId);
}

/**
 * Check if user can download a time capsule
 */
export function canDownloadTimeCapsule(
  timeCapsule: TimeCapsule,
  userId: string
): boolean {
  // Anyone with access can download
  return canAccessTimeCapsule(timeCapsule, userId);
}

/**
 * Get user's role in a time capsule
 */
export function getUserRole(
  timeCapsule: TimeCapsule,
  userId: string
): CollaboratorRole | null {
  if (timeCapsule.createdBy === userId) {
    return "owner";
  }

  const collaborator = timeCapsule.collaborators.find((c) => c.id === userId);
  return collaborator?.role || null;
}

/**
 * Check if time capsule is accessible (not locked or expired)
 */
export function isTimeCapsuleAccessible(timeCapsule: TimeCapsule): boolean {
  const now = new Date();
  const openDate = new Date(timeCapsule.openDate);

  // Check if it's time to open
  if (now < openDate) {
    return false;
  }

  // Check status
  return timeCapsule.status === "unlocked";
}

/**
 * Validate share link
 */
export function isValidShareLink(shareId: string): boolean {
  // Basic validation - should be a non-empty string
  if (!shareId || typeof shareId !== "string") {
    return false;
  }

  // Check format (alphanumeric, reasonable length)
  const shareIdRegex = /^[a-zA-Z0-9_-]{8,64}$/;
  return shareIdRegex.test(shareId);
}
