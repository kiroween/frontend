# Environment Variable Tests - Verification Guide

## Quick Verification

To verify that the environment variable tests are working correctly, run:

```bash
cd frontend
npm test -- src/lib/api/__tests__/env-config.test.ts
```

Or use the provided test runner:

```bash
cd frontend
./run-env-test.bat  # Windows Command Prompt
```

```powershell
cd frontend
./run-env-test.ps1  # PowerShell
```

## Expected Output

You should see 7 tests passing:

```
✓ Environment Configuration
  ✓ should use NEXT_PUBLIC_API_URL from environment when set
  ✓ should use empty baseUrl when NEXT_PUBLIC_API_URL is not set
  ✓ should allow explicit baseUrl to override environment variable
  ✓ should use http://localhost:8000 when environment variable is set correctly
  ✓ Real API vs Mock API behavior
    ✓ should use real API when NEXT_PUBLIC_API_URL is set
    ✓ should use relative URLs when NEXT_PUBLIC_API_URL is not set
    ✓ should allow switching between real and mock API by changing environment variable

Test Files  1 passed (1)
     Tests  7 passed (7)
```

## What These Tests Verify

### Requirement 6.1: Real API Usage
- ✅ When `NEXT_PUBLIC_API_URL=http://localhost:8000` is set
- ✅ API client makes requests to `http://localhost:8000/api/...`
- ✅ Full URLs are constructed correctly

### Requirement 6.2: Relative URL Usage
- ✅ When `NEXT_PUBLIC_API_URL` is not set
- ✅ API client uses relative URLs like `/api/...`
- ✅ Can work with Next.js API routes or fail gracefully

## Manual Testing

### Test 1: With Environment Variable
1. Create/edit `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
2. Start the frontend: `npm run dev`
3. Open browser console
4. Try to sign in - should see requests to `http://localhost:8000/api/users/sign-in`

### Test 2: Without Environment Variable
1. Remove or comment out `NEXT_PUBLIC_API_URL` from `.env.local`
2. Restart the frontend: `npm run dev`
3. Open browser console
4. Try to sign in - should see requests to `/api/users/sign-in` (relative URL)

## Troubleshooting

### Tests Not Running
If you get errors running the tests, try:

```bash
cd frontend
npm install  # Reinstall dependencies
npm test     # Run all tests
```

### Environment Variable Not Working
Make sure:
1. `.env.local` file exists in the `frontend` directory
2. Variable name is exactly `NEXT_PUBLIC_API_URL` (case-sensitive)
3. You restart the dev server after changing `.env.local`
4. The variable starts with `NEXT_PUBLIC_` (required by Next.js)

### Network Errors
If you see network errors in the browser:
1. Check if backend is running: `docker ps` (should see backend container)
2. Check backend URL: `http://localhost:8000/docs` (should show API docs)
3. Check CORS settings in backend (should allow `http://localhost:3000`)

## Additional Resources
- See `TASK_10.1_ENV_TESTS_SUMMARY.md` for detailed implementation notes
- See `ENV_SETUP_VERIFICATION.md` for environment setup guide
- See `API_CLIENT_IMPLEMENTATION.md` for API client architecture
