# Android App Setup Guide - DoneTogether

## 📱 Steg 1: Installera Android Studio
1. Ladda ner från: https://developer.android.com/studio
2. Installera med alla standardkomponenter (Android SDK, Android Virtual Device)

## 🔧 Steg 2: Bygg och öppna projektet

Kör dessa kommandon i terminalen:
```cmd
npm install
npm run build
npx cap sync android
npx cap open android
```

## 🔑 Steg 3: Hämta SHA-1 Fingerprint

I Android Studio terminal, kör:
```cmd
cd android
gradlew signingReport
```

Kopiera SHA-1 fingerprints (både debug och release).

## 🔥 Steg 4: Konfigurera Firebase

1. Gå till Firebase Console: https://console.firebase.google.com
2. Välj ditt projekt: "donetogether-official"
3. Gå till Project Settings → General
4. Under "Your apps", hitta din Android-app
5. Lägg till SHA-1 fingerprints:
   - Klicka "Add fingerprint"
   - Klistra in SHA-1 från debug
   - Klicka "Add fingerprint" igen
   - Klistra in SHA-1 från release
6. Ladda ner ny `google-services.json`
7. Ersätt filen i: `android/app/google-services.json`

## 📲 Steg 5: Bygg och testa appen

### Testa på emulator:
1. I Android Studio, klicka "Device Manager"
2. Skapa en ny virtuell enhet (t.ex. Pixel 5)
3. Klicka "Run" (grön play-knapp)

### Testa på riktig telefon:
1. Aktivera "Developer Options" på telefonen:
   - Gå till Settings → About Phone
   - Tryck 7 gånger på "Build Number"
2. Aktivera "USB Debugging" i Developer Options
3. Anslut telefonen med USB-kabel
4. Klicka "Run" i Android Studio

## 🏗️ Steg 6: Bygg Release APK

```cmd
cd android
gradlew assembleRelease
```

APK-filen finns i: `android/app/build/outputs/apk/release/app-release.apk`

## ⚠️ Vanliga problem och lösningar

### Problem: "Google Sign-In failed"
**Lösning:** Kontrollera att SHA-1 fingerprints är korrekt tillagda i Firebase Console.

### Problem: "App won't install"
**Lösning:** Avinstallera gamla versioner först: `adb uninstall com.donetogether.app`

### Problem: "Build failed"
**Lösning:** Kör `npx cap sync android` igen och öppna projektet på nytt.

## 📝 Viktiga filer

- `capacitor.config.ts` - Capacitor konfiguration
- `android/app/google-services.json` - Firebase konfiguration
- `android/app/build.gradle` - Android build konfiguration
- `src/hooks/useAuth.ts` - Autentisering logik

## 🎯 Nästa steg

1. Testa Google-inloggning på emulator
2. Testa på riktig telefon
3. Bygg release APK när allt fungerar
4. (Valfritt) Publicera på Google Play Store

## 📚 Användbara länkar

- Capacitor Docs: https://capacitorjs.com/docs
- Firebase Android Setup: https://firebase.google.com/docs/android/setup
- Android Studio Guide: https://developer.android.com/studio/intro
