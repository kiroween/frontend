# Property 2: Unauthorized Redirect Test Implementation

## Overview
Implemented property-based test for validating that 401 Unauthorized responses trigger proper redirect behavior.

## Test Location
`frontend/src/lib/api/__tests__/client.test.ts`

## Property Being Tested
**Property 2: Unauthorized redirect**

*For any API request that returns a 401 Unauthorized status, the application should redirect the user to the login page.*

**Validates: Requirements 1.5**

## Test Implementation

### Test Strategy
The test uses property-based testing with `fast-check` to generate random test scenarios:

1. **Random API endpoints**: `/api/graves`, `/api/graves/123`, `/api/users`, `/api/users/sign-out`
2. **Random HTTP methods**: GET, POST, PUT, DELETE
3. **Random error messages**: Any string 1-100 characters
4. **Random request bodies**: Optional objects with random fields

### What the Test Validates

For each randomly generated scenario, the test verifies:

1. **Error Code**: The error thrown has code `UNAUTHORIZED`
2. **Handler Invocation**: The unauthorized handler is called exactly once (this handler redirects to login)
3. **Token Removal**: Both localStorage tokens are removed:
   - `timegrave_session_token`
   - `timegrave_token_expires_at`
4. **Auth Header Removal**: Subsequent requests do not include the Authorization header

### Test Configuration
- **Iterations**: 100 random test cases
- **Test Framework**: Vitest with fast-check
- **Mocking**: Uses vi.fn() to mock fetch and unauthorized handler

## How to Run the Test

### Option 1: Run all client tests
```bash
npm test src/lib/api/__tests__/client.test.ts
```

### Option 2: Run with the batch file
```bash
.\run-client-test.bat
```

### Option 3: Run with PowerShell script
```powershell
.\run-client-property-test.ps1
```

### Option 4: Run all tests
```bash
npm test
```

## Expected Behavior

When a 401 Unauthorized response is received:
1. The API client throws an error with code `UNAUTHORIZED`
2. The unauthorized handler is invoked (typically redirects to `/login`)
3. The session token is removed from localStorage
4. The Authorization header is removed from the API client
5. Future requests do not include authentication

## Integration with AuthContext

This property test complements the AuthContext implementation where:
- The `apiClient.setUnauthorizedHandler()` is called with a redirect function
- The redirect function navigates to `/login` page
- The user's authentication state is cleared

## Code Quality
- ✅ No syntax errors
- ✅ Follows existing test patterns
- ✅ Uses property-based testing with 100 iterations
- ✅ Tests multiple HTTP methods
- ✅ Validates all aspects of unauthorized handling
- ✅ Properly tagged with feature and property reference

## Next Steps
1. Run the test to verify it passes
2. If any failures occur, review the counterexamples
3. Ensure the test is included in CI/CD pipeline
