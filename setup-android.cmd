@echo off
echo ========================================
echo DoneTogether - Android Setup
echo ========================================
echo.

echo Steg 1: Installerar dependencies...
call npm install
if %errorlevel% neq 0 (
    echo FEL: npm install misslyckades
    pause
    exit /b 1
)

echo.
echo Steg 2: Bygger webbappen...
call npm run build
if %errorlevel% neq 0 (
    echo FEL: Build misslyckades
    pause
    exit /b 1
)

echo.
echo Steg 3: Initierar Capacitor...
call npx cap add android
if %errorlevel% neq 0 (
    echo Android-projektet finns redan, synkar istället...
    call npx cap sync android
)

echo.
echo Steg 4: Kopierar assets...
call npx cap copy android

echo.
echo ========================================
echo Setup klart!
echo ========================================
echo.
echo Nästa steg:
echo 1. Öppna Android Studio: npx cap open android
echo 2. Vänta tills Gradle sync är klar
echo 3. Hämta SHA-1: cd android ^&^& gradlew signingReport
echo 4. Lägg till SHA-1 i Firebase Console
echo 5. Ladda ner ny google-services.json
echo 6. Kör appen från Android Studio
echo.
pause
