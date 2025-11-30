# Run environment configuration tests
Set-Location $PSScriptRoot
npm test -- src/lib/api/__tests__/env-config.test.ts
