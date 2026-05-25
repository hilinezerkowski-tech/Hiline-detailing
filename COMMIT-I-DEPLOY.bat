@echo off
REM Skrypt: sprzata lock files w .git, commituje pozostale pliki i pushuje na Netlify
REM Uzycie: dwuklik w Eksploratorze
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo   HILINE CRM - COMMIT + DEPLOY
echo ==========================================
echo.

echo [1/5] Sprzatam lock files w .git\
if exist ".git\index.lock" del /f /q ".git\index.lock" 2>nul
if exist ".git\packed-refs.lock" del /f /q ".git\packed-refs.lock" 2>nul
if exist ".git\refs\heads\master.lock" del /f /q ".git\refs\heads\master.lock" 2>nul
if exist ".git\refs\remotes\origin\master.lock" del /f /q ".git\refs\remotes\origin\master.lock" 2>nul
if exist ".git\test_write" del /f /q ".git\test_write" 2>nul
echo     OK
echo.

echo [2/5] Status repo:
git status --short
echo.

echo [3/5] Commituje nowe pliki (jesli sa)
git add STATUS_WDROZENIA.md qr-google-reviews.html sw.js COMMIT-I-DEPLOY.bat 2>nul
git add -A
git commit -m "feat: CRM v3 - historia wizyt, lista przypomnien, import CSV, backup JSON, PWA offline, szablony WhatsApp" 2>nul
if errorlevel 1 (
    echo     Brak nowych zmian lub blad commitu - kontynuuje
) else (
    echo     Commit OK
)
echo.

echo [4/5] Ostatnie commity:
git log --oneline -5
echo.

echo [5/5] Push do origin/master (Netlify auto-deploy startuje po push)
git push origin master
if errorlevel 1 (
    echo.
    echo     PUSH NIE PRZESZEDL - sprawdz polaczenie z internetem albo credentials
) else (
    echo.
    echo ==========================================
    echo   GOTOWE! Netlify deployuje teraz:
    echo   https://app.netlify.com/sites/hiline-detailing/deploys
    echo   Live: https://hiline-detailing.netlify.app
    echo ==========================================
)

echo.
pause
