@echo off
REM Agresywne sprzatanie git locks + commit + push
REM Uzycie: dwuklik
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   HILINE - DEPLOY (NAPRAWA LOCKOW)
echo ========================================
echo.

echo [1/6] Zabijam wszelkie procesy git (jesli sa w tle)
taskkill /F /IM git.exe /T 2>nul
taskkill /F /IM git-credential-manager.exe /T 2>nul
timeout /t 1 /nobreak >nul
echo     OK
echo.

echo [2/6] Usuwam WSZYSTKIE lock files w .git\
for /r ".git" %%F in (*.lock) do (
    echo     Usuwam: %%F
    del /f /q "%%F" 2>nul
)
if exist ".git\index.lock" del /f /q ".git\index.lock"
if exist ".git\HEAD.lock" del /f /q ".git\HEAD.lock"
if exist ".git\config.lock" del /f /q ".git\config.lock"
if exist ".git\packed-refs.lock" del /f /q ".git\packed-refs.lock"
echo     OK
echo.

echo [3/6] Czyszcze tmp_obj files (smieci po przerwanych operacjach)
for /r ".git\objects" %%F in (tmp_obj_*) do del /f /q "%%F" 2>nul
echo     OK
echo.

echo [4/6] Status repo:
git status --short
echo.

echo [5/6] Commituje pozostale pliki
git add -A
git commit -m "feat: CRM v3 - historia wizyt, lista przypomnien, import CSV, backup JSON, PWA offline, szablony WhatsApp, QR Google Reviews"
echo.

echo [6/6] Push do origin/master (Netlify auto-deploy startuje po push)
git push origin master
echo.

if errorlevel 1 (
    echo ========================================
    echo   PUSH BLAD - sprawdz polaczenie / credentials
    echo ========================================
) else (
    echo ========================================
    echo   GOTOWE - Netlify deployuje:
    echo   https://app.netlify.com/sites/hiline-detailing/deploys
    echo   ~30 sekund i bedzie na:
    echo   https://hiline-detailing.netlify.app
    echo ========================================
)

echo.
pause
