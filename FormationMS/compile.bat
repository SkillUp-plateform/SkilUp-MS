@echo off
echo Cleaning and compiling FormationMS...
echo.

REM Use Maven wrapper
call mvnw.cmd clean compile

echo.
echo Compilation complete!
pause
