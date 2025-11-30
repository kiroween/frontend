@echo off
echo Running UI Property-Based Tests...
echo.

echo Testing TombstoneCard component...
call npx vitest run src/components/graveyard/__tests__/TombstoneCard.test.tsx

echo.
echo Testing ContentViewer component...
call npx vitest run src/components/resurrection/__tests__/ContentViewer.test.tsx

echo.
echo UI Property Tests Complete!
pause
