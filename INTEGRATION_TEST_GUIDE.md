# Integration Test Guide

This guide explains how to run the complete integration tests for the TimeGrave backend API integration.

## Prerequisites

### 1. Backend Docker Container

The backend must be running before executing integration tests.

**To start the backend:**

```bash
cd backend
docker-compose up -d
```

**To verify the backend is running:**

```bash
# Check if container is running
docker ps | findstr backend

# Test the API endpoint
curl http://localhost:8000/
```

Expected response:
```json
{
  "status": 200,
  "data": {
    "result": {
      "message": "TimeGrave API is running",
      "version": "1.0.0"
    }
  }
}
```

### 2. Environment Configuration

Ensure `.env.local` exists in the frontend directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Dependencies

Install all frontend dependencies:

```bash
cd frontend
npm install
```

## Running Integration Tests

### Option 1: Using the Test Script (Recommended)

```bash
cd frontend
run-integration-test.bat
```

### Option 2: Using npm directly

```bash
cd frontend
npm run test -- src/lib/api/__tests__/integration.test.ts --run
```

### Option 3: Run all tests

```bash
cd frontend
npm run test -- --run
```

## Test Coverage

The integration tests cover the following scenarios:

### Happy Path Flow

1. **Sign Up** - Create a new user account
2. **Sign In** - Authenticate and receive session token
3. **Create Time Capsule** - Create a new time capsule with future unlock date
4. **List Time Capsules** - Retrieve all time capsules for the user
5. **View Time Capsule Detail** - Get detailed information about a specific capsule

### Error Cases

1. **Invalid Sign Up Data (400)** - Test validation errors
2. **Invalid Login Credentials (401)** - Test authentication failure
3. **Past Unlock Date (400)** - Test business logic validation
4. **Non-existent Capsule (404)** - Test resource not found
5. **Unauthorized Access (401)** - Test authentication requirement

### Token Management

1. **Token Storage** - Verify token is stored after login
2. **Token Inclusion** - Verify token is included in authenticated requests
3. **Token Clearing** - Verify token is removed on logout
4. **401 Handling** - Verify token is cleared on unauthorized response

## Test Data

The integration tests create temporary test data:

- **Test Users**: Email format `test-{timestamp}@example.com`
- **Test Capsules**: Created with future unlock dates
- **Cleanup**: Tests use unique timestamps to avoid conflicts

## Troubleshooting

### Backend Not Running

**Error**: `ECONNREFUSED` or `fetch failed`

**Solution**: Start the backend Docker container:
```bash
cd backend
docker-compose up -d
```

### Port Already in Use

**Error**: Backend fails to start due to port 8000 being in use

**Solution**: Stop the process using port 8000 or change the port in docker-compose.yml

### Database Issues

**Error**: Database errors or constraint violations

**Solution**: Reset the database:
```bash
cd backend
docker-compose down -v
docker-compose up -d
```

### CORS Errors

**Error**: CORS policy blocking requests

**Solution**: Verify backend CORS configuration allows `http://localhost:3000`

### Token Expiration

**Error**: Tests fail due to expired tokens

**Solution**: Tests should handle this automatically, but you can clear localStorage:
```javascript
localStorage.clear()
```

## Manual Testing

You can also test the integration manually using the frontend UI:

### 1. Start Both Services

```bash
# Terminal 1: Start backend
cd backend
docker-compose up

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### 2. Test the Flow

1. Navigate to `http://localhost:3000/signup`
2. Create a new account
3. Sign in with your credentials
4. Create a time capsule at `/create`
5. View your capsules at `/graveyard`
6. Click on a capsule to view details

### 3. Test Error Cases

- Try signing in with wrong password
- Try creating a capsule with a past date
- Try accessing a non-existent capsule URL
- Sign out and try to access protected pages

## Expected Test Results

When all tests pass, you should see output similar to:

```
✓ Integration Tests: Complete User Flow
  ✓ should complete the full user journey successfully
✓ Error Cases
  ✓ should handle invalid sign up data (400)
  ✓ should handle invalid login credentials (401)
  ✓ should handle creating time capsule with past date (400)
  ✓ should handle accessing non-existent time capsule (404)
  ✓ should handle accessing time capsule without authentication (401)
✓ Sign out and Token Management
  ✓ should clear token on sign out
  ✓ should handle 401 by clearing token

Test Files  1 passed (1)
Tests  8 passed (8)
```

## CI/CD Integration

To integrate these tests into a CI/CD pipeline:

1. **Start backend in CI environment**:
   ```yaml
   - name: Start Backend
     run: |
       cd backend
       docker-compose up -d
       sleep 10  # Wait for backend to be ready
   ```

2. **Run integration tests**:
   ```yaml
   - name: Run Integration Tests
     run: |
       cd frontend
       npm run test -- src/lib/api/__tests__/integration.test.ts --run
   ```

3. **Cleanup**:
   ```yaml
   - name: Stop Backend
     run: |
       cd backend
       docker-compose down -v
   ```

## Next Steps

After successful integration testing:

1. ✅ Verify all API endpoints are working
2. ✅ Confirm error handling is correct
3. ✅ Validate token management
4. ✅ Test complete user flows
5. 🚀 Deploy to production

## Support

If you encounter issues not covered in this guide:

1. Check the backend logs: `docker logs backend`
2. Check the frontend console for errors
3. Verify environment variables are set correctly
4. Ensure all dependencies are installed
5. Try resetting both backend and frontend

## Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Frontend Setup Guide](./README.md)
- [API Client Implementation](./API_CLIENT_IMPLEMENTATION.md)
- [Environment Setup](./ENV_SETUP_VERIFICATION.md)
