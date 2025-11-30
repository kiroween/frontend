@echo off
echo ========================================
echo TimeGrave Integration Test Runner
echo ========================================
echo.

echo Step 1: Checking environment...
if not exist ".env.local" (
    echo ERROR: .env.local file not found!
    echo Please create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
    exit /b 1
)
echo ✓ Environment file found
echo.

echo Step 2: Running integration tests...
echo NOTE: Make sure the backend Docker container is running!
echo       Run: cd backend ^&^& docker-compose up -d
echo.

npm test src/lib/api/__tests__/integration.test.ts

echo.
echo ========================================
echo Integration test complete!
echo ========================================
