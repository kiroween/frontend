#!/usr/bin/env pwsh
# Run client error handling tests
Set-Location $PSScriptRoot
npx vitest run src/lib/api/__tests__/client.test.ts
