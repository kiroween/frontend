/**
 * Time Capsule related types
 */

export type TimeCapsuleStatus = "locked" | "unlocked" | "expired";

export type CollaboratorRole = "owner" | "editor" | "viewer";

export type ContentType = "text" | "image" | "video" | "file";

export interface TimeCapsuleContent {
  id: string;
  type: ContentType;
  name: string;
  url: string;
  size: number;
  mimeType?: string;
  createdAt: Date;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  joinedAt: Date;
  avatar?: string;
}

export interface TimeCapsule {
  id: string;
  title: string;
  description: string;
  openDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: TimeCapsuleStatus;
  contents: TimeCapsuleContent[];
  collaborators: Collaborator[];
  shareUrl?: string;
  shareId?: string;
  isPublic: boolean;
  audioUrl?: string; // TTS audio URL from backend
}

export interface CreateTimeCapsuleRequest {
  title: string;
  description: string;
  openDate: Date;
  contents: File[];
  inviteEmails?: string[];
  isPublic?: boolean;
}

export interface UpdateTimeCapsuleRequest {
  title?: string;
  description?: string;
  openDate?: Date;
  isPublic?: boolean;
}

export interface ShareTimeCapsuleRequest {
  timeCapsuleId: string;
  permissions: "view" | "edit";
  expiresAt?: Date;
}

export interface ShareTimeCapsuleResponse {
  shareUrl: string;
  shareId: string;
  expiresAt?: Date;
}

export interface InviteCollaboratorRequest {
  timeCapsuleId: string;
  email: string;
  role: CollaboratorRole;
}

export interface RemoveCollaboratorRequest {
  timeCapsuleId: string;
  collaboratorId: string;
}
