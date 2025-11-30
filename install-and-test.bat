@echo off
echo Installing fast-check...
call npm install
echo.
echo Running property-based tests...
call npm test -- typeConverter
echo.
echo Done!
pause
