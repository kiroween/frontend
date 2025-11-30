# Script to verify backend Docker container is running

Write-Host "Checking if backend Docker container is running..." -ForegroundColor Cyan

# Check if Docker is running
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not installed or not running" -ForegroundColor Red
    exit 1
}

# Check if backend container is running
$backendContainer = docker ps --filter "name=backend" --format "{{.Names}}"

if ($backendContainer) {
    Write-Host "✓ Backend container is running: $backendContainer" -ForegroundColor Green
    
    # Check container health
    $containerStatus = docker ps --filter "name=backend" --format "{{.Status}}"
    Write-Host "  Status: $containerStatus" -ForegroundColor Gray
} else {
    Write-Host "✗ Backend container is not running" -ForegroundColor Red
    Write-Host "  To start the backend, run:" -ForegroundColor Yellow
    Write-Host "  cd backend && docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

# Test API endpoint
Write-Host "`nTesting API endpoint..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ API is responding: $($response.StatusCode)" -ForegroundColor Green
    
    # Parse and display API info
    $content = $response.Content | ConvertFrom-Json
    if ($content.data.result.message) {
        Write-Host "  Message: $($content.data.result.message)" -ForegroundColor Gray
        Write-Host "  Version: $($content.data.result.version)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ API is not responding at http://localhost:8000" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Backend is ready for integration testing!" -ForegroundColor Green
