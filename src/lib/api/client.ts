/**
 * API Client for backend communication
 */

import { ApiConfig, ApiResponse, ApiError, ApiErrorCode } from '../types/api';

const DEFAULT_TIMEOUT = 30000; // 30 seconds

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: Partial<ApiConfig> = {}) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
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
        throw this.createError(response.status, data);
      }

      return {
        data,
        status: response.status,
        message: data.message,
      };
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

  private createError(status: number, data: unknown): ApiError {
    let code: ApiErrorCode;

    switch (status) {
      case 401:
        code = ApiErrorCode.UNAUTHORIZED;
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
        code = ApiErrorCode.SERVER_ERROR;
        break;
      default:
        code = ApiErrorCode.UNKNOWN;
    }

    return {
      code,
      message: this.getErrorMessage(code, data),
      details: data,
      statusCode: status,
    };
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          code: ApiErrorCode.TIMEOUT,
          message: '요청 시간이 초과되었습니다.',
        };
      }

      if (error.message.includes('fetch')) {
        return {
          code: ApiErrorCode.NETWORK_ERROR,
          message: '네트워크 연결을 확인해주세요.',
        };
      }
    }

    if (this.isApiError(error)) {
      return error;
    }

    return {
      code: ApiErrorCode.UNKNOWN,
      message: '알 수 없는 오류가 발생했습니다.',
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

  private getErrorMessage(code: ApiErrorCode, data: unknown): string {
    const errorMessages: Record<ApiErrorCode, string> = {
      [ApiErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
      [ApiErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
      [ApiErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
      [ApiErrorCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
      [ApiErrorCode.VALIDATION_ERROR]: '입력 정보를 확인해주세요.',
      [ApiErrorCode.SERVER_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      [ApiErrorCode.TIMEOUT]: '요청 시간이 초과되었습니다.',
      [ApiErrorCode.UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
    };

    // Try to extract message from response data
    if (data && typeof data === 'object' && 'message' in data) {
      return String(data.message);
    }

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
