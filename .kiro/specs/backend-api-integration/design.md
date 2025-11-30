# Design Document: Backend API Integration

## Overview

TimeGrave 프론트엔드를 FastAPI 기반 백엔드와 연동하여 실제 데이터 저장 및 사용자 인증 기능을 구현합니다. 현재 프론트엔드는 Mock API를 사용하고 있으며, 이를 실제 백엔드 API로 전환합니다.

**핵심 목표:**
- 백엔드 API 엔드포인트와 완전한 통합
- 사용자 인증 및 세션 관리
- 백엔드와 프론트엔드 간 데이터 타입 변환
- 에러 처리 및 사용자 피드백
- 개발/프로덕션 환경 분리

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │   UI Layer   │─────▶│  API Service │                     │
│  │  (Components)│      │    Layer     │                     │
│  └──────────────┘      └──────┬───────┘                     │
│                                │                              │
│                        ┌───────▼────────┐                    │
│                        │  API Client    │                    │
│                        │  (HTTP Client) │                    │
│                        └───────┬────────┘                    │
│                                │                              │
│                        ┌───────▼────────┐                    │
│                        │ Type Converter │                    │
│                        │ (snake↔camel)  │                    │
│                        └───────┬────────┘                    │
└────────────────────────────────┼──────────────────────────────┘
                                 │ HTTP/JSON
                                 │
┌────────────────────────────────▼──────────────────────────────┐
│                     Backend (FastAPI)                         │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌────────────┐ │
│  │   Routers    │─────▶│   Services   │─────▶│ Repository │ │
│  │ (Endpoints)  │      │ (Business    │      │  (Data     │ │
│  │              │      │   Logic)     │      │  Access)   │ │
│  └──────────────┘      └──────────────┘      └─────┬──────┘ │
│                                                     │         │
│                                              ┌──────▼──────┐  │
│                                              │   SQLite    │  │
│                                              │  Database   │  │
│                                              └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────┐                ┌──────────┐              ┌──────────┐
│ Browser │                │ Frontend │              │ Backend  │
└────┬────┘                └────┬─────┘              └────┬─────┘
     │                          │                         │
     │  1. Submit Login Form    │                         │
     ├─────────────────────────▶│                         │
     │                          │  2. POST /api/users/    │
     │                          │     sign-in             │
     │                          ├────────────────────────▶│
     │                          │                         │
     │                          │  3. {session_token,     │
     │                          │     user, expires_at}   │
     │                          │◀────────────────────────┤
     │                          │                         │
     │  4. Store token in       │                         │
     │     localStorage         │                         │
     │◀─────────────────────────┤                         │
     │                          │                         │
     │  5. Subsequent requests  │                         │
     │     with Authorization   │                         │
     │     header               │                         │
     ├─────────────────────────▶├────────────────────────▶│
     │                          │  Bearer {token}         │
```

## Components and Interfaces

### 1. API Client Enhancement

**Location:** `src/lib/api/client.ts`

현재 API Client를 확장하여 백엔드 응답 형식을 처리합니다.

```typescript
interface BackendSuccessResponse<T> {
  status: number;
  data: {
    result: T;
    response?: string;  // Optional message from backend
    message?: string;   // Alternative message field
  };
}

interface BackendErrorResponse {
  status: number;
  error: {
    code?: string;
    message: string;
    details?: unknown;
  };
}

class ApiClient {
  // Enhanced request method to handle backend response format
  async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      // Extract error from backend format
      throw this.createErrorFromBackend(data);
    }
    
    // Extract actual data from backend format
    return {
      data: data.data.result,
      status: data.status,
      message: data.data.response || data.data.message
    };
  }
}
```

### 2. Authentication Service

**Location:** `src/lib/api/auth.ts` (new file)

사용자 인증을 처리하는 새로운 서비스입니다.

```typescript
interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: number;
    email: string;
    username: string;
  };
  sessionToken: string;
  expiresAt: string;
}

export const authApi = {
  signUp: (data: SignUpRequest) => Promise<ApiResponse<User>>;
  signIn: (data: SignInRequest) => Promise<ApiResponse<AuthResponse>>;
  signOut: () => Promise<ApiResponse<void>>;
  deleteAccount: () => Promise<ApiResponse<{ deletedGravesCount: number }>>;
};
```

### 3. Graves API Service

**Location:** `src/lib/api/graves.ts` (new file)

타임캡슐(Graves) API를 처리하는 서비스입니다.

```typescript
interface CreateGraveRequest {
  title: string;
  content: string;
  unlockDate: Date;  // Will be converted to date string
}

interface GraveResponse {
  id: number;
  userId: number;
  title: string;
  content?: string;  // Only present if unlocked
  unlockDate: string;
  isUnlocked: boolean;
  daysRemaining?: number;  // Only present if locked
  createdAt: string;
  updatedAt: string;
}

export const gravesApi = {
  create: (data: CreateGraveRequest) => Promise<ApiResponse<GraveResponse>>;
  getAll: () => Promise<ApiResponse<GraveResponse[]>>;
  getById: (id: number) => Promise<ApiResponse<GraveResponse>>;
};
```

### 4. Type Converter Utility

**Location:** `src/lib/utils/typeConverter.ts` (new file)

백엔드와 프론트엔드 간 데이터 타입을 변환합니다.

```typescript
// Convert snake_case to camelCase
function toCamelCase(obj: Record<string, any>): Record<string, any>;

// Convert camelCase to snake_case
function toSnakeCase(obj: Record<string, any>): Record<string, any>;

// Convert backend Grave to frontend TimeCapsule
function graveToTimeCapsule(grave: GraveResponse): TimeCapsule;

// Convert frontend TimeCapsule to backend Grave format
function timeCapsuleToGrave(capsule: Partial<TimeCapsule>): CreateGraveRequest;
```

### 5. Auth Context Enhancement

**Location:** `src/contexts/AuthContext.tsx` (new file)

사용자 인증 상태를 관리하는 Context입니다.

```typescript
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }>;
export const useAuth: () => AuthContextValue;
```

### 6. Token Storage Utility

**Location:** `src/lib/utils/tokenStorage.ts` (new file)

세션 토큰을 안전하게 저장하고 관리합니다.

```typescript
export const tokenStorage = {
  getToken: () => string | null;
  setToken: (token: string, expiresAt: string) => void;
  removeToken: () => void;
  isTokenExpired: () => boolean;
};
```

## Data Models

### Backend to Frontend Type Mapping

| Backend (Python)      | Frontend (TypeScript) | Notes                          |
|-----------------------|-----------------------|--------------------------------|
| `user_id`             | `userId`              | snake_case → camelCase         |
| `unlock_date`         | `unlockDate`          | ISO date string → Date object  |
| `is_unlocked`         | `isUnlocked`          | boolean                        |
| `days_remaining`      | `daysRemaining`       | Optional, only if locked       |
| `created_at`          | `createdAt`           | ISO datetime string            |
| `updated_at`          | `updatedAt`           | ISO datetime string            |
| `session_token`       | `sessionToken`        | JWT token string               |
| `expires_at`          | `expiresAt`           | ISO datetime string            |

### TimeCapsule Type (Frontend)

```typescript
interface TimeCapsule {
  id: string;  // Convert from number to string for consistency
  userId: string;
  title: string;
  description?: string;  // Maps to 'content' in backend
  openDate: Date;  // Maps to 'unlock_date' in backend
  status: 'locked' | 'unlocked';  // Derived from 'is_unlocked'
  daysRemaining?: number;
  contents: Content[];  // Not yet implemented in backend
  collaborators: Collaborator[];  // Not yet implemented in backend
  createdAt: Date;
  updatedAt: Date;
}
```

### API Response Wrapper

```typescript
// Frontend ApiResponse (existing)
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Backend response format (to be unwrapped)
interface BackendResponse<T> {
  status: number;
  data: {
    result: T;
    response?: string;
    message?: string;
  };
}
```

## Correc
tness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Token persistence and inclusion

*For any* successful login response containing a session token, storing the token should result in all subsequent API requests including that token in the Authorization header.
**Validates: Requirements 1.3**

### Property 2: Unauthorized redirect

*For any* API request that returns a 401 Unauthorized status, the application should redirect the user to the login page.
**Validates: Requirements 1.5**

### Property 3: Request data transformation (camelCase to snake_case)

*For any* object with camelCase field names being sent to the backend, all field names should be converted to snake_case format.
**Validates: Requirements 2.2, 8.2**

### Property 4: Response data transformation (snake_case to camelCase)

*For any* backend response with snake_case field names, all field names should be converted to camelCase format in the frontend.
**Validates: Requirements 3.2, 8.1**

### Property 5: Locked capsule content hiding

*For any* time capsule with `isUnlocked: false`, the content field should not be displayed in the UI and `daysRemaining` should be shown.
**Validates: Requirements 3.3**

### Property 6: Unlocked capsule content display

*For any* time capsule with `isUnlocked: true`, the full content should be displayed in the UI.
**Validates: Requirements 3.4**

### Property 7: Lock status UI rendering

*For any* time capsule detail view, the UI should render differently based on the `isUnlocked` status - showing either the countdown or the full content.
**Validates: Requirements 4.4**

### Property 8: Success response unwrapping

*For any* successful backend response in the format `{status, data: {result}}`, the API client should extract and return only the `result` data.
**Validates: Requirements 5.1, 5.3**

### Property 9: Error response extraction

*For any* error response in the format `{status, error: {code, message}}`, the API client should extract the error information and create an appropriate ApiError object.
**Validates: Requirements 5.2**

### Property 10: Error message localization

*For any* API error type, the frontend should display an appropriate Korean error message to the user.
**Validates: Requirements 7.1**

### Property 11: Backend error message passthrough

*For any* Korean error message returned by the backend, the frontend should display it to the user without modification.
**Validates: Requirements 7.2**

### Property 12: ISO date string conversion

*For any* ISO 8601 date string received from the backend, it should be correctly converted to a JavaScript Date object.
**Validates: Requirements 8.3**

### Property 13: Tombstone to TimeCapsule mapping

*For any* Tombstone object received from the backend, it should be correctly mapped to a TimeCapsule object with all fields properly converted.
**Validates: Requirements 8.4**

## Error Handling

### Error Categories

1. **Network Errors**
   - Connection failures
   - Timeout errors
   - DNS resolution failures
   - User message: "네트워크 연결을 확인해주세요"

2. **Authentication Errors (401)**
   - Invalid or expired token
   - Missing authentication
   - Action: Redirect to login page
   - Clear stored token

3. **Authorization Errors (403)**
   - Insufficient permissions
   - User message: "접근 권한이 없습니다"

4. **Not Found Errors (404)**
   - Resource doesn't exist
   - User message: "타임캡슐을 찾을 수 없습니다"

5. **Validation Errors (400)**
   - Invalid input data
   - Display backend error message or field-specific errors

6. **Server Errors (500)**
   - Internal server error
   - User message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요"

### Error Handling Strategy

```typescript
// Centralized error handler
function handleApiError(error: ApiError): void {
  // Log error for debugging
  console.error('API Error:', error);
  
  // Handle authentication errors
  if (error.code === ApiErrorCode.UNAUTHORIZED) {
    tokenStorage.removeToken();
    router.push('/login');
    return;
  }
  
  // Display user-friendly message
  const message = error.message || getDefaultErrorMessage(error.code);
  toast.error(message);
  
  // Track error for monitoring (future enhancement)
  // trackError(error);
}
```

### Retry Strategy

- **Network errors**: Retry up to 3 times with exponential backoff
- **Server errors (500, 502, 503)**: Retry once after 1 second
- **Client errors (4xx)**: No retry, display error immediately
- **Timeout**: No retry, display timeout message

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **API Client Tests**
   - Test successful request/response cycle
   - Test error response handling
   - Test timeout behavior
   - Test authentication header injection

2. **Type Converter Tests**
   - Test snake_case to camelCase conversion with specific examples
   - Test camelCase to snake_case conversion with specific examples
   - Test nested object conversion
   - Test array of objects conversion
   - Test date string to Date object conversion

3. **Auth Service Tests**
   - Test sign up with valid data
   - Test sign in with valid credentials
   - Test sign in with invalid credentials (401)
   - Test token storage after successful login
   - Test token removal after logout

4. **Graves API Tests**
   - Test create grave with valid data
   - Test create grave with past unlock date (400)
   - Test get all graves
   - Test get grave by ID
   - Test get non-existent grave (404)
   - Test get grave without permission (403)

### Property-Based Tests

Property-based tests will verify universal properties across many inputs using **fast-check** library:

1. **Property Test: Token persistence (Property 1)**
   - Generate random session tokens
   - Verify token is stored in localStorage
   - Verify token appears in Authorization header of subsequent requests
   - **Feature: backend-api-integration, Property 1: Token persistence and inclusion**

2. **Property Test: Request transformation (Property 3)**
   - Generate random objects with camelCase fields
   - Verify all fields are converted to snake_case
   - Verify nested objects are also converted
   - **Feature: backend-api-integration, Property 3: Request data transformation**

3. **Property Test: Response transformation (Property 4)**
   - Generate random backend responses with snake_case fields
   - Verify all fields are converted to camelCase
   - Verify nested objects are also converted
   - **Feature: backend-api-integration, Property 4: Response data transformation**

4. **Property Test: Locked capsule rendering (Property 5)**
   - Generate random locked time capsules (isUnlocked: false)
   - Verify content is not displayed
   - Verify daysRemaining is displayed
   - **Feature: backend-api-integration, Property 5: Locked capsule content hiding**

5. **Property Test: Unlocked capsule rendering (Property 6)**
   - Generate random unlocked time capsules (isUnlocked: true)
   - Verify content is displayed
   - Verify daysRemaining is not displayed
   - **Feature: backend-api-integration, Property 6: Unlocked capsule content display**

6. **Property Test: Success response unwrapping (Property 8)**
   - Generate random backend success responses
   - Verify data is correctly extracted from {status, data: {result}} format
   - **Feature: backend-api-integration, Property 8: Success response unwrapping**

7. **Property Test: Error response extraction (Property 9)**
   - Generate random backend error responses
   - Verify error info is correctly extracted from {status, error: {code, message}} format
   - **Feature: backend-api-integration, Property 9: Error response extraction**

8. **Property Test: Date conversion (Property 12)**
   - Generate random ISO 8601 date strings
   - Verify conversion to Date objects
   - Verify round-trip conversion preserves date value
   - **Feature: backend-api-integration, Property 12: ISO date string conversion**

9. **Property Test: Tombstone mapping (Property 13)**
   - Generate random Tombstone objects
   - Verify correct mapping to TimeCapsule objects
   - Verify all fields are properly converted
   - **Feature: backend-api-integration, Property 13: Tombstone to TimeCapsule mapping**

### Integration Tests

Integration tests will verify end-to-end flows:

1. **Authentication Flow**
   - Sign up → Sign in → Make authenticated request → Sign out
   - Verify token lifecycle

2. **Time Capsule Creation Flow**
   - Sign in → Create capsule → Verify in list → View detail
   - Verify data persistence

3. **Error Recovery Flow**
   - Make request → Receive 401 → Redirect to login → Sign in → Retry request
   - Verify error handling and recovery

### Testing Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/api/**', 'src/lib/utils/typeConverter.ts'],
    },
  },
});
```

### Property-Based Testing Setup

```typescript
// Install fast-check
// npm install --save-dev fast-check

// Example property test
import fc from 'fast-check';

describe('Type Converter Properties', () => {
  it('Property: snake_case to camelCase conversion', () => {
    fc.assert(
      fc.property(
        fc.object(), // Generate random objects
        (obj) => {
          const snakeCase = toSnakeCase(obj);
          const camelCase = toCamelCase(snakeCase);
          // Verify round-trip conversion
          expect(camelCase).toEqual(obj);
        }
      ),
      { numRuns: 100 } // Run 100 iterations
    );
  });
});
```

## Implementation Notes

### Environment Variables

Create `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: API timeout in milliseconds
NEXT_PUBLIC_API_TIMEOUT=30000
```

### CORS Configuration

Backend is already configured to allow all origins in development:

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token Expiration Handling

```typescript
// Check token expiration before each request
apiClient.interceptRequest((config) => {
  if (tokenStorage.isTokenExpired()) {
    tokenStorage.removeToken();
    router.push('/login');
    throw new Error('Token expired');
  }
  return config;
});
```

### Migration from Mock to Real API

The transition is seamless:

1. **Without `NEXT_PUBLIC_API_URL`**: Uses mock API (current behavior)
2. **With `NEXT_PUBLIC_API_URL`**: Uses real backend API

This allows gradual migration and easy testing.

## Security Considerations

1. **Token Storage**: Store session token in localStorage (acceptable for MVP)
   - Future: Consider httpOnly cookies for better security

2. **HTTPS**: Use HTTPS in production to protect token transmission

3. **Token Expiration**: Implement token refresh mechanism (future enhancement)

4. **Input Validation**: Validate all user inputs before sending to backend

5. **XSS Protection**: Sanitize any user-generated content before display

6. **CSRF Protection**: Backend should implement CSRF tokens (future enhancement)

## Performance Considerations

1. **Request Caching**: Cache GET requests for time capsule lists
   - Cache duration: 5 minutes
   - Invalidate on create/update/delete

2. **Optimistic Updates**: Update UI immediately, rollback on error
   - Improves perceived performance

3. **Request Debouncing**: Debounce search and filter operations
   - Delay: 300ms

4. **Lazy Loading**: Load time capsule details only when needed
   - Don't fetch all details on list page

5. **Connection Pooling**: Reuse HTTP connections (handled by browser)

## Future Enhancements

1. **WebSocket Support**: Real-time notifications when capsules unlock
2. **Offline Support**: Queue requests when offline, sync when online
3. **Request Cancellation**: Cancel in-flight requests on navigation
4. **Request Retry UI**: Show retry button for failed requests
5. **Token Refresh**: Automatic token refresh before expiration
6. **Request Logging**: Log all API requests for debugging
7. **Performance Monitoring**: Track API response times
8. **Error Tracking**: Integrate with error tracking service (e.g., Sentry)
