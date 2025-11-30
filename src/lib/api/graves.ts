/**
 * Graves (Time Capsules) API Service
 * 
 * Handles time capsule operations including creation, listing, and retrieval.
 * Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 8.4
 */

import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { formatDateToISO } from '../utils/typeConverter';
import { TimeCapsule, TimeCapsuleStatus } from '../types/timecapsule';

/**
 * Create grave request payload (frontend format)
 */
export interface CreateGraveRequest {
  title: string;
  content: string;
  unlockDate: Date;
}

/**
 * Backend Tombstone response format (snake_case)
 */
export interface TombstoneResponseDto {
  id: number;
  user_id: number;
  title: string;
  content?: string;  // Only present if unlocked
  unlock_date: string;
  is_unlocked: boolean;
  days_remaining?: number;  // Only present if locked
  created_at: string;
  updated_at: string;
}

/**
 * Convert backend Tombstone to frontend TimeCapsule
 * Requirement 8.4: Tombstone to TimeCapsule mapping
 */
export function tombstoneToTimeCapsule(tombstone: TombstoneResponseDto): TimeCapsule {
  // Determine status based on is_unlocked flag
  const status: TimeCapsuleStatus = tombstone.is_unlocked ? 'unlocked' : 'locked';
  
  return {
    id: String(tombstone.id),
    title: tombstone.title,
    description: tombstone.content || '',  // Map content to description
    openDate: new Date(tombstone.unlock_date),
    createdAt: new Date(tombstone.created_at),
    updatedAt: new Date(tombstone.updated_at),
    createdBy: String(tombstone.user_id),
    status,
    contents: [],  // Not yet implemented in backend
    collaborators: [],  // Not yet implemented in backend
    isPublic: false,  // Not yet implemented in backend
  };
}

/**
 * Graves API service
 */
export const gravesApi = {
  /**
   * Create a new grave (time capsule)
   * POST /api/graves
   * 
   * @param data - Time capsule creation data
   * @returns Created time capsule information
   */
  async create(data: CreateGraveRequest): Promise<ApiResponse<TimeCapsule>> {
    // Convert to backend format
    const backendData = {
      title: data.title,
      content: data.content,
      unlock_date: formatDateToISO(data.unlockDate),
      user_id: 1,  // Will be overridden by backend with authenticated user's ID
    };
    
    const response = await apiClient.post<TombstoneResponseDto>('/api/graves', backendData);
    
    // Convert backend Tombstone to frontend TimeCapsule
    const timeCapsule = tombstoneToTimeCapsule(response.data);
    
    return {
      ...response,
      data: timeCapsule,
    };
  },

  /**
   * Get all graves for the authenticated user
   * GET /api/graves
   * 
   * @returns List of time capsules
   */
  async getAll(): Promise<ApiResponse<TimeCapsule[]>> {
    const response = await apiClient.get<TombstoneResponseDto[]>('/api/graves');
    
    // Convert each Tombstone to TimeCapsule
    const timeCapsules = response.data.map(tombstoneToTimeCapsule);
    
    return {
      ...response,
      data: timeCapsules,
    };
  },

  /**
   * Get a specific grave by ID
   * GET /api/graves/{id}
   * 
   * @param id - Grave ID
   * @returns Time capsule details
   */
  async getById(id: string | number): Promise<ApiResponse<TimeCapsule>> {
    const response = await apiClient.get<TombstoneResponseDto>(`/api/graves/${id}`);
    
    // Convert backend Tombstone to frontend TimeCapsule
    const timeCapsule = tombstoneToTimeCapsule(response.data);
    
    return {
      ...response,
      data: timeCapsule,
    };
  },
};
