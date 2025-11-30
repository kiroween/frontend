# Integration Test Checklist

This checklist helps you verify that all backend API integration features are working correctly.

## Pre-Test Setup

### ✅ Backend Verification

- [ ] Backend Docker container is running
  ```bash
  docker ps | findstr backend
  ```
  
- [ ] Backend API is responding
  ```bash
  curl http://localhost:8000/
  ```
  Expected: `{"status": 200, "data": {"result": {"message": "TimeGrave API is running", "version": "1.0.0"}}}`

- [ ] Backend database is initialized
  ```bash
  docker logs backend | findstr "Database initialized"
  ```

### ✅ Frontend Configuration

- [ ] `.env.local` file exists with `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Dependencies are installed (`npm install`)
- [ ] Frontend dev server can start (`npm run dev`)

## Automated Test Execution

### Run Integration Tests

```bash
cd frontend
npm test src/lib/api/__tests__/integration.test.ts
```

**Expected Results:**
- ✅ All 8 tests pass
- ✅ No network errors
- ✅ No authentication errors
- ✅ No validation errors

### Test Coverage Verification

The integration tests should cover:

1. **Happy Path Flow** (1 test)
   - ✅ Sign up → Sign in → Create capsule → List capsules → View detail

2. **Error Cases** (5 tests)
   - ✅ Invalid sign up data (400)
   - ✅ Invalid login credentials (401)
   - ✅ Past unlock date (400)
   - ✅ Non-existent capsule (404)
   - ✅ Unauthorized access (401)

3. **Token Management** (2 tests)
   - ✅ Token cleared on sign out
   - ✅ Token cleared on 401 response

## Manual Testing Flow

If automated tests fail or you want to verify manually, follow this checklist:

### 1. Sign Up Flow

- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Fill in the form:
  - Email: `test@example.com`
  - Username: `TestUser`
  - Password: `TestPassword123!`
- [ ] Click "Sign Up"
- [ ] **Expected**: Redirected to login page with success message
- [ ] **Verify**: Check browser DevTools Network tab for `POST /api/users` with status 201

### 2. Sign In Flow

- [ ] Navigate to `http://localhost:3000/login`
- [ ] Fill in the form:
  - Email: `test@example.com`
  - Password: `TestPassword123!`
- [ ] Click "Sign In"
- [ ] **Expected**: Redirected to home page, user is authenticated
- [ ] **Verify**: 
  - Check localStorage for `session_token`
  - Check browser DevTools Network tab for `POST /api/users/sign-in` with status 200
  - Response should include `session_token`, `user`, and `expires_at`

### 3. Create Time Capsule Flow

- [ ] Navigate to `http://localhost:3000/create`
- [ ] Fill in the form:
  - Title: `My First Time Capsule`
  - Content: `This is a test message for the future`
  - Unlock Date: Tomorrow's date
- [ ] Click "Create"
- [ ] **Expected**: Redirected to graveyard page with success message
- [ ] **Verify**:
  - Check browser DevTools Network tab for `POST /api/graves` with status 201
  - Request body should have `title`, `content`, `unlock_date` in snake_case
  - Response should have `id`, `is_unlocked: false`, `days_remaining`

### 4. List Time Capsules Flow

- [ ] Navigate to `http://localhost:3000/graveyard`
- [ ] **Expected**: See list of time capsules including the one just created
- [ ] **Verify**:
  - Check browser DevTools Network tab for `GET /api/graves` with status 200
  - Response should be an array of tombstones
  - Each tombstone should have snake_case fields converted to camelCase in UI
  - Locked capsules should show "Days Remaining" instead of content

### 5. View Time Capsule Detail Flow

- [ ] Click on a time capsule card from the graveyard
- [ ] **Expected**: Navigate to detail page showing capsule information
- [ ] **Verify**:
  - Check browser DevTools Network tab for `GET /api/graves/{id}` with status 200
  - If locked: Content is hidden, days remaining is shown
  - If unlocked: Full content is displayed
  - All dates are properly formatted

### 6. Error Handling Tests

#### Test 6.1: Invalid Sign Up Data (400)

- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Fill in invalid data:
  - Email: `invalid-email` (no @ symbol)
  - Username: `` (empty)
  - Password: `123` (too short)
- [ ] Click "Sign Up"
- [ ] **Expected**: Error message displayed in Korean
- [ ] **Verify**: Network tab shows 400 status with error details

#### Test 6.2: Invalid Login Credentials (401)

- [ ] Navigate to `http://localhost:3000/login`
- [ ] Fill in wrong credentials:
  - Email: `wrong@example.com`
  - Password: `WrongPassword123!`
- [ ] Click "Sign In"
- [ ] **Expected**: Error message "로그인 정보가 올바르지 않습니다" or similar
- [ ] **Verify**: Network tab shows 401 status

#### Test 6.3: Past Unlock Date (400)

- [ ] Navigate to `http://localhost:3000/create`
- [ ] Fill in form with past date:
  - Title: `Invalid Capsule`
  - Content: `This should fail`
  - Unlock Date: Yesterday's date
- [ ] Click "Create"
- [ ] **Expected**: Error message about invalid date
- [ ] **Verify**: Network tab shows 400 status

#### Test 6.4: Non-existent Capsule (404)

- [ ] Navigate to `http://localhost:3000/view/999999`
- [ ] **Expected**: Error message "타임캡슐을 찾을 수 없습니다"
- [ ] **Verify**: Network tab shows 404 status

#### Test 6.5: Unauthorized Access (401)

- [ ] Open browser DevTools → Application → Local Storage
- [ ] Delete the `session_token` key
- [ ] Try to navigate to `http://localhost:3000/graveyard`
- [ ] **Expected**: Redirected to login page
- [ ] **Verify**: Network tab shows 401 status, token is cleared

### 7. Sign Out Flow

- [ ] Click "Sign Out" button in the header
- [ ] **Expected**: Redirected to home page, user is logged out
- [ ] **Verify**:
  - Check localStorage - `session_token` should be removed
  - Check browser DevTools Network tab for `POST /api/users/sign-out`
  - Try accessing protected pages - should redirect to login

### 8. Token Management Tests

#### Test 8.1: Token Persistence

- [ ] Sign in successfully
- [ ] Check localStorage for `session_token`
- [ ] Refresh the page
- [ ] **Expected**: Still authenticated, no need to sign in again
- [ ] **Verify**: Token is still in localStorage

#### Test 8.2: Token Inclusion in Requests

- [ ] Sign in successfully
- [ ] Make any API request (e.g., view graveyard)
- [ ] Check browser DevTools Network tab
- [ ] **Expected**: Request headers include `Authorization: Bearer {token}`
- [ ] **Verify**: Token matches the one in localStorage

#### Test 8.3: Expired Token Handling

- [ ] Sign in successfully
- [ ] Manually edit localStorage `session_token` to an invalid value
- [ ] Try to access graveyard page
- [ ] **Expected**: Redirected to login page, token is cleared
- [ ] **Verify**: 401 response triggers token removal and redirect

## Data Type Conversion Verification

### Snake Case ↔ Camel Case

Check that field names are properly converted:

**Backend (snake_case) → Frontend (camelCase):**
- `user_id` → `userId`
- `unlock_date` → `unlockDate`
- `is_unlocked` → `isUnlocked`
- `days_remaining` → `daysRemaining`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`
- `session_token` → `sessionToken`
- `expires_at` → `expiresAt`

**Frontend (camelCase) → Backend (snake_case):**
- `unlockDate` → `unlock_date`
- `userId` → `user_id`

### Date Conversion

- [ ] Backend sends ISO 8601 date strings
- [ ] Frontend converts to JavaScript Date objects
- [ ] Dates display correctly in UI
- [ ] Date pickers work correctly

### Response Format Handling

**Backend Success Response:**
```json
{
  "status": 200,
  "data": {
    "result": { /* actual data */ }
  }
}
```

**Backend Error Response:**
```json
{
  "status": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "에러 메시지"
  }
}
```

- [ ] API client correctly unwraps success responses
- [ ] API client correctly extracts error information
- [ ] Korean error messages are displayed to users

## Performance Checks

- [ ] API requests complete within reasonable time (< 2 seconds)
- [ ] No memory leaks in browser DevTools
- [ ] No console errors or warnings
- [ ] Network tab shows efficient request patterns (no duplicate requests)

## Security Checks

- [ ] Tokens are stored in localStorage (acceptable for MVP)
- [ ] Tokens are included in Authorization header
- [ ] Tokens are cleared on logout
- [ ] Tokens are cleared on 401 responses
- [ ] No sensitive data in console logs
- [ ] CORS is properly configured

## Browser Compatibility

Test in multiple browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Final Verification

- [ ] All automated tests pass
- [ ] All manual test flows work correctly
- [ ] All error cases are handled properly
- [ ] Token management works as expected
- [ ] Data type conversions are correct
- [ ] No console errors
- [ ] No network errors
- [ ] User experience is smooth

## Troubleshooting

If tests fail, check:

1. **Backend not running**: Start with `cd backend && docker-compose up -d`
2. **Port conflicts**: Ensure ports 8000 (backend) and 3000 (frontend) are available
3. **Database issues**: Reset with `docker-compose down -v && docker-compose up -d`
4. **CORS errors**: Verify backend CORS configuration
5. **Token issues**: Clear localStorage and try again
6. **Network errors**: Check firewall and network settings

## Sign-Off

Once all checks pass:

- [ ] Automated tests: ✅ PASS
- [ ] Manual tests: ✅ PASS
- [ ] Error handling: ✅ PASS
- [ ] Token management: ✅ PASS
- [ ] Data conversion: ✅ PASS
- [ ] Performance: ✅ PASS
- [ ] Security: ✅ PASS

**Integration testing complete! ✅**

The backend API integration is fully functional and ready for production deployment.
