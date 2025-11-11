@echo off
echo Cleaning and compiling Recrutement Service...
echo.

REM Use Maven wrapper
call mvnw.cmd clean compile

echo.
echo Compilation complete!
pause
