# Signup Page Integration Summary

## Task 11: 회원가입 페이지 연동

### Implementation Complete ✓

This task has been successfully implemented. The signup page now integrates with the real backend API.

## Changes Made

### 1. Created Signup Page (`/signup`)
**File:** `frontend/src/app/signup/page.tsx`

- Created a new signup page with a form that collects:
  - Email
  - Username
  - Password
- Integrated with `useAuth()` hook to call the real `signUp` API
- On successful signup, redirects to `/login` page
- On failure, displays error message to the user
- Styled consistently with the TimeGrave theme (stone gate, ancient runes, etc.)

### 2. Created Login Page (`/login`)
**File:** `frontend/src/app/login/page.tsx`

- Created a new login page with a form that collects:
  - Email
  - Password
- Integrated with `useAuth()` hook to call the real `signIn` API
- On successful login, redirects to `/graveyard` page
- On failure, displays error message to the user
- Styled consistently with the TimeGrave theme

### 3. Updated Landing Page
**File:** `frontend/src/app/page.tsx`

- Added "회원가입" and "로그인" buttons
- Added "또는 둘러보기 →" link to graveyard for unauthenticated browsing
- Improved user flow from landing page to authentication

### 4. Enhanced Header Component
**File:** `frontend/src/components/layout/Header.tsx`

- Added authentication state awareness using `useAuth()` hook
- Shows different navigation based on authentication status:
  - **Authenticated:** Shows "내 묘지", "새로 묻기", "설정", notification bell, username, and "로그아웃" button
  - **Unauthenticated:** Shows "로그인" and "회원가입" buttons
- Implemented logout functionality that calls `signOut()` and redirects to home page

## Requirements Validation

### Requirement 1.1 ✓
**WHEN 사용자가 회원가입 폼을 제출하면 THEN the Frontend SHALL POST 요청을 `/api/users` 엔드포인트로 전송하고 성공 시 사용자 정보를 받습니다**

- ✓ Signup form submits to `authApi.signUp()`
- ✓ `authApi.signUp()` sends POST request to `/api/users`
- ✓ Success response contains user information
- ✓ On success, user is redirected to login page
- ✓ On failure, error message is displayed

## User Flow

### Signup Flow
1. User visits landing page (`/`)
2. User clicks "회원가입" button
3. User is taken to `/signup` page
4. User fills in email, username, and password
5. User submits form
6. Frontend calls `authApi.signUp()` with form data
7. API client converts camelCase to snake_case
8. POST request sent to backend `/api/users`
9. **Success:** User redirected to `/login` page
10. **Failure:** Error message displayed on signup page

### Login Flow (for reference)
1. User visits `/login` page (or redirected from signup)
2. User fills in email and password
3. User submits form
4. Frontend calls `authApi.signIn()` with credentials
5. API client converts camelCase to snake_case
6. POST request sent to backend `/api/users/sign-in`
7. **Success:** 
   - Session token stored in localStorage
   - Token set in API client for subsequent requests
   - User redirected to `/graveyard` page
8. **Failure:** Error message displayed on login page

## Error Handling

The signup page properly handles errors:

1. **Network Errors:** Displays "회원가입에 실패했습니다. 다시 시도해주세요."
2. **Backend Errors:** Displays the error message from the backend (Korean messages are passed through)
3. **Validation Errors:** HTML5 form validation ensures required fields are filled

## Testing

To test the signup integration:

1. **Start the backend:**
   ```bash
   cd backend
   docker-compose up
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test signup flow:**
   - Navigate to `http://localhost:3000`
   - Click "회원가입"
   - Fill in the form with valid data
   - Submit and verify redirect to login page
   - Check browser console for any errors

4. **Test error handling:**
   - Try signing up with an existing email
   - Verify error message is displayed
   - Try signing up with invalid data
   - Verify appropriate error messages

## Integration with Existing Code

The signup page integrates seamlessly with:

- **AuthContext:** Uses `signUp()` function from `useAuth()` hook
- **Auth API:** Calls `authApi.signUp()` which handles backend communication
- **Type Converter:** Automatically converts camelCase to snake_case for backend
- **API Client:** Handles request/response formatting and error handling
- **Token Storage:** (Used after login, not during signup)

## Next Steps

The following tasks should be implemented next:

- **Task 12:** 로그인 페이지 연동 (Already implemented as part of this task)
- **Task 13:** 타임캡슐 생성 페이지 연동
- **Task 14:** 묘지 목록 페이지 연동
- **Task 15:** 타임캡슐 상세 페이지 연동

## Notes

- The signup page does NOT automatically log the user in after registration
- Users must explicitly log in after signing up (this matches the backend API design)
- The backend returns user information on signup, but not a session token
- Session tokens are only provided on login via `/api/users/sign-in`
