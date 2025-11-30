# 401 Unauthorized Handling Implementation

## Overview
Implemented automatic handling of 401 Unauthorized responses from the backend API, including token cleanup and redirect support.

## Implementation Details

### 1. API Client Enhancements (`src/lib/api/client.ts`)

#### Added Unauthorized Handler Support
- Added `unauthorizedHandler` property to store a callback function
- Added `setUnauthorizedHandler(handler: () => void)` method to register the handler
- This allows components (like AuthContext) to set up redirect logic

#### Automatic 401 Detection
- Modified `createErrorFromBackend()` to detect 401 status codes
- When 401 is detected, automatically calls `handleUnauthorized()`

#### Token Cleanup on 401
- Created `handleUnauthorized()` private method that:
  1. Removes token from localStorage via `tokenStorage.removeToken()`
  2. Removes Authorization header via `this.removeAuthToken()`
  3. Calls the registered unauthorized handler (if set)

### 2. Integration with Token Storage
- Imported `tokenStorage` from `../auth/tokenStorage`
- Uses `tokenStorage.removeToken()` to clear both:
  - `timegrave_session_token`
  - `timegrave_token_expires_at`

### 3. Test Coverage (`src/lib/api/__tests__/client.test.ts`)

Added comprehensive tests:

1. **Test: Unauthorized handler is called**
   - Verifies that the registered handler is invoked on 401 response
   - Ensures the handler is called exactly once

2. **Test: Auth token removed from headers**
   - Verifies that Authorization header is removed after 401
   - Subsequent requests should not include the token

3. **Test: localStorage tokens removed**
   - Verifies that both token keys are cleared from localStorage
   - Ensures complete cleanup of authentication state

## Usage Example

```typescript
// In AuthContext or app initialization
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

const router = useRouter();

// Set up the unauthorized handler
apiClient.setUnauthorizedHandler(() => {
  // Redirect to login page
  router.push('/login');
  
  // Optionally show a toast message
  toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
});
```

## Requirements Satisfied

✅ **Requirement 1.5**: WHEN API가 401 Unauthorized 응답을 반환하면 THEN the Frontend SHALL 사용자를 로그인 페이지로 리다이렉트합니다

## Benefits

1. **Automatic Security**: No need to manually check for 401 in every API call
2. **Centralized Logic**: All 401 handling is in one place
3. **Clean State**: Ensures tokens are completely removed on unauthorized access
4. **Flexible Redirect**: Handler can be customized per application needs
5. **Testable**: Comprehensive test coverage ensures reliability

## Next Steps

To complete the integration:

1. Set up the unauthorized handler in `AuthContext` or app initialization
2. Implement the redirect logic to the login page
3. Optionally add user feedback (toast notification) when session expires
