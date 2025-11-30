/**
 * API Client for backend communication
 */

import { ApiConfig, ApiResponse, ApiError, ApiErrorCode } from '../types/api';
import { tokenStorage } from '../auth/tokenStorage';

const DEFAULT_TIMEOUT = 30000; // 30 seconds

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private unauthorizedHandler?: () => void;

  constructor(config: Partial<ApiConfig> = {}) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Set a handler to be called when a 401 Unauthorized response is received
   * This handler should typically redirect to the login page
   */
  setUnauthorizedHandler(handler: () => void): void {
    this.unauthorizedHandler = handler;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw this.createErrorFromBackend(response.status, data);
      }

      // Extract data from backend format: {status, data: {result}}
      return this.unwrapBackendResponse<T>(data, response.status);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Unwrap backend success response format: {status, data: {result}}
   */
  private unwrapBackendResponse<T>(data: unknown, status: number): ApiResponse<T> {
    // Check if data follows backend format
    if (data && typeof data === 'object' && 'data' in data) {
      const backendData = data as { data?: { result?: T; response?: string; message?: string } };
      
      if (backendData.data && 'result' in backendData.data) {
        return {
          data: backendData.data.result as T,
          status,
          message: backendData.data.response || backendData.data.message,
        };
      }
    }

    // Fallback: treat data as-is (for backward compatibility)
    return {
      data: data as T,
      status,
      message: undefined,
    };
  }

  /**
   * Create error from backend error format: {status, error: {code, message}}
   */
  private createErrorFromBackend(status: number, data: unknown): ApiError {
    let code: ApiErrorCode;

    switch (status) {
      case 401:
        code = ApiErrorCode.UNAUTHORIZED;
        // Handle 401 Unauthorized: remove token and trigger redirect
        this.handleUnauthorized();
        break;
      case 403:
        code = ApiErrorCode.FORBIDDEN;
        break;
      case 404:
        code = ApiErrorCode.NOT_FOUND;
        break;
      case 400:
      case 422:
        code = ApiErrorCode.VALIDATION_ERROR;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        code = ApiErrorCode.SERVER_ERROR;
        break;
      default:
        code = ApiErrorCode.UNKNOWN;
    }

    // Extract error message from backend format
    let message = this.getDefaultErrorMessage(code);
    let errorDetails = data;

    if (data && typeof data === 'object' && 'error' in data) {
      const backendError = data as { error?: { code?: string; message?: string; details?: unknown } };
      
      if (backendError.error) {
        // Prefer backend's Korean error message if provided
        // This allows the backend to send localized error messages
        if (backendError.error.message) {
          message = backendError.error.message;
        }
        errorDetails = backendError.error.details || backendError.error;
      }
    }

    return {
      code,
      message,
      details: errorDetails,
      statusCode: status,
    };
  }

  /**
   * Handle 401 Unauthorized response
   * Removes stored token and calls the unauthorized handler (typically redirects to login)
   */
  private handleUnauthorized(): void {
    // Remove the stored token
    tokenStorage.removeToken();
    
    // Remove auth token from API client headers
    this.removeAuthToken();
    
    // Call the unauthorized handler if set (e.g., redirect to login)
    if (this.unauthorizedHandler) {
      this.unauthorizedHandler();
    }
  }

  private handleError(error: unknown): ApiError {
    // If it's already an ApiError, return it
    if (this.isApiError(error)) {
      return error;
    }

    if (error instanceof Error) {
      // Handle timeout errors
      if (error.name === 'AbortError') {
        return {
          code: ApiErrorCode.TIMEOUT,
          message: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
        };
      }

      // Handle network errors - check for various network-related error messages
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes('fetch') ||
        errorMessage.includes('network') ||
        errorMessage.includes('failed to fetch') ||
        errorMessage.includes('networkerror') ||
        errorMessage.includes('connection') ||
        error.name === 'TypeError' && errorMessage.includes('fetch')
      ) {
        return {
          code: ApiErrorCode.NETWORK_ERROR,
          message: '네트워크 연결을 확인해주세요. 인터넷 연결 상태를 확인하거나 잠시 후 다시 시도해주세요.',
        };
      }
    }

    // Unknown error
    return {
      code: ApiErrorCode.UNKNOWN,
      message: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      details: error,
    };
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }

  /**
   * Get default Korean error message for error code
   * These messages are used as fallbacks when the backend doesn't provide a specific message
   */
  private getDefaultErrorMessage(code: ApiErrorCode): string {
    const errorMessages: Record<ApiErrorCode, string> = {
      [ApiErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요. 인터넷 연결 상태를 확인하거나 잠시 후 다시 시도해주세요.',
      [ApiErrorCode.UNAUTHORIZED]: '로그인이 필요합니다. 다시 로그인해주세요.',
      [ApiErrorCode.FORBIDDEN]: '접근 권한이 없습니다. 이 작업을 수행할 권한이 없습니다.',
      [ApiErrorCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
      [ApiErrorCode.VALIDATION_ERROR]: '입력 정보를 확인해주세요. 올바른 형식으로 입력했는지 확인해주세요.',
      [ApiErrorCode.SERVER_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      [ApiErrorCode.TIMEOUT]: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
      [ApiErrorCode.UNKNOWN]: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };

    return errorMessages[code];
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
