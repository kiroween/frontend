@echo off
cd /d "%~dp0"
call npm test -- src/lib/api/__tests__/env-config.test.ts
