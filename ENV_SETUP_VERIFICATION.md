# Environment Variable Setup Verification

## Task 10: 환경 변수 설정

This document verifies that Task 10 has been completed successfully.

## ✅ Completed Steps

### 1. Created `.env.local` file

**Location:** `frontend/.env.local`

**Content:**
```env
# Backend API URL
# This URL points to the local Docker container running the FastAPI backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: API timeout in milliseconds (default: 30000)
# NEXT_PUBLIC_API_TIMEOUT=30000
```

**Status:** ✅ Created and configured correctly

### 2. Verified `.gitignore` includes `.env.local`

**Location:** `frontend/.gitignore`

**Relevant line:** `.env*.local`

**Status:** ✅ Already included in `.gitignore` (confirmed)

### 3. Verified API Client uses environment variable

**Location:** `frontend/src/lib/api/client.ts`

**Relevant code:**
```typescript
constructor(config: Partial<ApiConfig> = {}) {
  this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
  this.timeout = config.timeout || DEFAULT_TIMEOUT;
  // ...
}
```

**Logic:**
1. If `config.baseUrl` is provided explicitly → use it (highest priority)
2. Else if `NEXT_PUBLIC_API_URL` environment variable is set → use it
3. Else use empty string (relative URLs)

**Status:** ✅ Correctly implemented

### 4. Created environment configuration tests

**Location:** `frontend/src/lib/api/__tests__/env-config.test.ts`

**Test cases:**
- ✅ Uses `NEXT_PUBLIC_API_URL` from environment when set
- ✅ Uses empty baseUrl when `NEXT_PUBLIC_API_URL` is not set
- ✅ Allows explicit baseUrl to override environment variable
- ✅ Uses `http://localhost:8000` when environment variable is set correctly

**Status:** ✅ Tests created

## 📋 Requirements Validation

### Requirement 6.1
> WHEN 환경 변수 `NEXT_PUBLIC_API_URL`이 설정되어 있으면 THEN the Frontend SHALL 해당 URL을 백엔드 API 베이스 URL로 사용합니다

**Status:** ✅ Satisfied
- API Client constructor checks `process.env.NEXT_PUBLIC_API_URL`
- Uses it as baseUrl when set
- `.env.local` file sets it to `http://localhost:8000`

### Requirement 6.4
> WHEN Docker로 백엔드를 실행 중이면 THEN the Frontend SHALL `http://localhost:8000`을 기본 API URL로 사용합니다

**Status:** ✅ Satisfied
- `.env.local` file sets `NEXT_PUBLIC_API_URL=http://localhost:8000`
- This matches the Docker backend port configuration

## 🔍 How It Works

### Development Workflow

1. **Backend Running in Docker:**
   ```bash
   # Backend runs on http://localhost:8000
   docker-compose up
   ```

2. **Frontend Reads Environment Variable:**
   ```typescript
   // API Client automatically uses NEXT_PUBLIC_API_URL
   const client = new ApiClient();
   // baseUrl = "http://localhost:8000"
   ```

3. **API Requests:**
   ```typescript
   // Request to /api/graves becomes:
   // http://localhost:8000/api/graves
   await apiClient.get('/api/graves');
   ```

### Environment Variable Priority

```
Explicit config.baseUrl (highest)
    ↓
NEXT_PUBLIC_API_URL environment variable
    ↓
Empty string (relative URLs) (lowest)
```

### Example Usage

```typescript
// Uses environment variable (http://localhost:8000)
const client1 = new ApiClient();

// Overrides environment variable
const client2 = new ApiClient({ 
  baseUrl: 'https://api.production.com' 
});

// Uses environment variable if set, otherwise empty
const client3 = new ApiClient({});
```

## 🧪 Testing

### Manual Testing

1. **Start Backend:**
   ```bash
   cd backend
   docker-compose up
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Verify API Calls:**
   - Open browser DevTools → Network tab
   - Navigate to the app
   - Check that API requests go to `http://localhost:8000`

### Automated Testing

Run the environment configuration tests:
```bash
cd frontend
npm test -- src/lib/api/__tests__/env-config.test.ts
```

## 📝 Notes

### Next.js Environment Variables

- **`NEXT_PUBLIC_*` prefix:** Required for environment variables that need to be accessible in the browser
- **Build time:** Environment variables are embedded at build time
- **`.env.local`:** Loaded automatically by Next.js, not committed to git

### Production Deployment

For production, set the environment variable to the production API URL:

```env
NEXT_PUBLIC_API_URL=https://api.timegrave.com
```

### Mock API Fallback

If `NEXT_PUBLIC_API_URL` is not set, the app can fall back to mock API:

```typescript
// In api service files
const useMockApi = !process.env.NEXT_PUBLIC_API_URL;

if (useMockApi) {
  return mockApiResponse();
} else {
  return apiClient.get('/endpoint');
}
```

## ✅ Task Completion Checklist

- [x] `.env.local` file created with `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [x] Verified `.env.local` is in `.gitignore`
- [x] Verified API Client uses `process.env.NEXT_PUBLIC_API_URL`
- [x] Created environment configuration tests
- [x] Documented the setup and verification process

## 🎯 Result

**Task 10 is COMPLETE.** The environment variable setup is correctly configured and the API Client will use `http://localhost:8000` as the base URL when making requests to the backend.
