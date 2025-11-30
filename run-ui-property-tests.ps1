#!/usr/bin/env pwsh

Write-Host "Running UI Property-Based Tests..." -ForegroundColor Cyan
Write-Host ""

# Run TombstoneCard tests
Write-Host "Testing TombstoneCard component..." -ForegroundColor Yellow
npx vitest run src/components/graveyard/__tests__/TombstoneCard.test.tsx

Write-Host ""
Write-Host "Testing ContentViewer component..." -ForegroundColor Yellow
npx vitest run src/components/resurrection/__tests__/ContentViewer.test.tsx

Write-Host ""
Write-Host "UI Property Tests Complete!" -ForegroundColor Green
