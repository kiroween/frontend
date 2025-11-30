#!/usr/bin/env pwsh
# Run client property test
Set-Location $PSScriptRoot
npx vitest run src/lib/api/__tests__/client.test.ts
