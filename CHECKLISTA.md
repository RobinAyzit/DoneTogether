# ✅ Checklista - Android App Setup

Använd denna checklista för att säkerställa att allt är korrekt konfigurerat.

## 📋 Före du börjar

- [ ] Node.js är installerat (`node --version`)
- [ ] npm fungerar (`npm --version`)
- [ ] Android Studio är nedladdat och installerat
- [ ] Du har ett Firebase-projekt (donetogether-official)
- [ ] Du har tillgång till Firebase Console

## 🔧 Initial Setup

- [ ] Kört `npm install`
- [ ] Kört `npm run build` (utan fel)
- [ ] Kört `npx cap add android` eller `npx cap sync android`
- [ ] Android-mappen finns i projektet
- [ ] Öppnat projektet i Android Studio (`npx cap open android`)
- [ ] Gradle sync slutfördes utan fel

## 🔥 Firebase Konfiguration

- [ ] Hämtat SHA-1 fingerprint (`cd android && gradlew signingReport`)
- [ ] Lagt till SHA-1 i Firebase Console
- [ ] Laddat ner `google-services.json` från Firebase
- [ ] Placerat `google-services.json` i `android/app/`
- [ ] Synkat projektet i Android Studio (File → Sync Project)
- [ ] Väntat 5 minuter efter Firebase-ändringar

## 📱 Emulator/Telefon Setup

### För Emulator:
- [ ] Skapat en virtuell enhet i Device Manager
- [ ] Valt Android 11 eller senare
- [ ] Startat emulatorn
- [ ] Emulatorn visas i Android Studio

### För Riktig Telefon:
- [ ] Aktiverat Developer Options
- [ ] Aktiverat USB Debugging
- [ ] Anslutit USB-kabel
- [ ] Accepterat USB debugging popup
- [ ] Telefonen visas i `adb devices`

## 🚀 Första körningen

- [ ] Klickat på Run (gröna play-knappen) i Android Studio
- [ ] Valt enhet (emulator eller telefon)
- [ ] Appen installerades utan fel
- [ ] Appen startade och visar UI
- [ ] Ingen vit skärm eller krasch

## 🔐 Google Sign-In Test

- [ ] Klickat på "Sign in with Google"
- [ ] Google-inloggning popup visas
- [ ] Kan välja Google-konto
- [ ] Inloggning lyckas
- [ ] Användarnamn och profilbild visas
- [ ] Kan se todos och andra funktioner

## 🐛 Felsökning (om något inte fungerar)

- [ ] Kollat Logcat i Android Studio för fel
- [ ] Kollat Chrome DevTools (`chrome://inspect`)
- [ ] Dubbelkollat SHA-1 i Firebase
- [ ] Väntat 5-10 minuter efter Firebase-ändringar
- [ ] Avinstallerat och installerat appen igen
- [ ] Kört `npx cap sync android` igen
- [ ] Läst FELSÖKNING.md för specifika problem

## 🏗️ Release Build (när allt fungerar)

- [ ] Hämtat release SHA-1 (`gradlew signingReport`)
- [ ] Lagt till release SHA-1 i Firebase
- [ ] Kört `cd android && gradlew assembleRelease`
- [ ] APK skapades i `android/app/build/outputs/apk/release/`
- [ ] Testat release APK på telefon
- [ ] Google Sign-In fungerar i release version

## 📝 Viktiga filer att kontrollera

- [ ] `capacitor.config.ts` - Rätt Client IDs
- [ ] `android/app/google-services.json` - Finns och är uppdaterad
- [ ] `src/lib/firebase.ts` - Rätt Firebase config
- [ ] `package.json` - Alla dependencies installerade
- [ ] `android/app/build.gradle` - Rätt konfiguration

## 🎯 Slutlig verifiering

- [ ] Appen startar snabbt
- [ ] Google Sign-In fungerar
- [ ] Kan skapa todos
- [ ] Kan dela listor
- [ ] Notifikationer fungerar (om implementerat)
- [ ] Appen fungerar offline (basic funktionalitet)
- [ ] Ingen krasch vid normal användning

## 📚 Dokumentation

- [ ] Läst SNABBSTART.md
- [ ] Läst ANDROID_SETUP_GUIDE.md
- [ ] Läst FIREBASE_ANDROID_CONFIG.md
- [ ] Vet var FELSÖKNING.md finns
- [ ] Sparat SHA-1 fingerprints någonstans

## 🚀 Redo för distribution

- [ ] Testat på minst 2 olika enheter
- [ ] Testat både WiFi och mobil data
- [ ] Testat offline-läge
- [ ] Inga kända buggar
- [ ] Release APK fungerar perfekt
- [ ] Ikoner och splash screen ser bra ut
- [ ] App-namn är korrekt (DoneTogether)

---

## 💯 Grattis!

Om du bockat av allt ovan har du en fungerande Android-app! 🎉

### Nästa steg:
1. Dela APK med vänner för beta-testning
2. Samla feedback
3. Fixa buggar
4. (Valfritt) Publicera på Google Play Store

### Resurser:
- Google Play Console: https://play.google.com/console
- Publishing guide: https://developer.android.com/studio/publish

**Bra jobbat! 👏**
