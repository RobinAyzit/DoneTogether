# 🔧 Felsökningsguide - Android App

## Vanliga problem och lösningar

### 1. "Gradle sync failed" i Android Studio

**Symptom:** Röd text i Android Studio, projektet kan inte byggas.

**Lösningar:**

```cmd
# Lösning A: Rensa Gradle cache
cd android
rmdir /s /q .gradle
cd ..
npx cap sync android
```

```cmd
# Lösning B: Uppdatera Gradle wrapper
cd android
gradlew wrapper --gradle-version=8.0
```

**Lösning C:** Stäng Android Studio, ta bort `android/.gradle` manuellt, öppna igen.

---

### 2. "Google Sign-In failed" eller "Error 10"

**Symptom:** Appen öppnas men Google-inloggning fungerar inte.

**Lösningar:**

**Steg 1:** Kontrollera SHA-1
```cmd
cd android
gradlew signingReport
```
Kopiera SHA-1 och lägg till i Firebase Console.

**Steg 2:** Vänta 5-10 minuter
Firebase behöver tid att uppdatera.

**Steg 3:** Avinstallera och installera igen
```cmd
adb uninstall com.donetogether.app
```
Kör appen från Android Studio igen.

**Steg 4:** Kontrollera Client IDs i `capacitor.config.ts`:
```typescript
serverClientId: '226200528766-heoank75dadud3p4ro5b1eduorcmev22.apps.googleusercontent.com',
androidClientId: '226200528766-v61jvembgedcjot0va1bhue5dim0dfsj.apps.googleusercontent.com',
```

---

### 3. "App won't install" på telefon/emulator

**Symptom:** "App not installed" eller liknande meddelande.

**Lösningar:**

```cmd
# Avinstallera gamla versioner
adb uninstall com.donetogether.app

# Kontrollera anslutna enheter
adb devices

# Installera manuellt
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 4. "No devices found" i Android Studio

**Symptom:** Ingen emulator eller telefon visas när du trycker Run.

**Lösningar:**

**För emulator:**
1. Klicka "Device Manager" (telefon-ikon längst upp till höger)
2. Klicka "Create Device"
3. Välj "Pixel 5" eller liknande
4. Välj system image (t.ex. "S" eller "Tiramisu")
5. Klicka "Finish"
6. Starta emulatorn

**För riktig telefon:**
1. Aktivera Developer Options (tryck 7 gånger på Build Number)
2. Aktivera USB Debugging
3. Anslut USB-kabel
4. Acceptera popup på telefonen
5. Kör `adb devices` för att verifiera

---

### 5. "Build failed" med fel om dependencies

**Symptom:** Röda felmeddelanden om saknade paket eller versioner.

**Lösningar:**

```cmd
# Rensa och återinstallera
rmdir /s /q node_modules
del package-lock.json
npm install

# Synka Capacitor
npx cap sync android

# Öppna projektet igen
npx cap open android
```

---

### 6. "White screen" när appen startar

**Symptom:** Appen öppnas men visar bara vit skärm.

**Lösningar:**

**Steg 1:** Kontrollera att webbappen är byggd
```cmd
npm run build
npx cap copy android
```

**Steg 2:** Kontrollera `capacitor.config.ts`:
```typescript
webDir: 'dist',  // Ska matcha din build-mapp
```

**Steg 3:** Öppna Chrome DevTools för Android:
1. Öppna Chrome på datorn
2. Gå till: `chrome://inspect`
3. Hitta din app
4. Klicka "inspect"
5. Kolla Console för felmeddelanden

---

### 7. "Permission denied" fel

**Symptom:** Kan inte köra gradlew eller andra kommandon.

**Lösningar:**

```cmd
# Ge execute-rättigheter (om du använder Git Bash eller WSL)
cd android
chmod +x gradlew

# Eller kör med gradlew.bat på Windows
gradlew.bat assembleDebug
```

---

### 8. "Firebase not initialized" eller liknande

**Symptom:** Fel om Firebase när appen körs.

**Lösningar:**

**Steg 1:** Kontrollera att `google-services.json` finns:
```
android/app/google-services.json
```

**Steg 2:** Kontrollera att Firebase config är korrekt i `src/lib/firebase.ts`

**Steg 3:** Synka projektet:
```cmd
npx cap sync android
```

**Steg 4:** I Android Studio: File → Sync Project with Gradle Files

---

### 9. "Out of memory" eller "Java heap space"

**Symptom:** Build kraschar med minnesfel.

**Lösningar:**

Redigera `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

---

### 10. Appen är långsam eller laggar

**Symptom:** Appen fungerar men är seg.

**Lösningar:**

**För emulator:**
- Använd en nyare system image (Android 11+)
- Öka RAM i Device Manager (minst 2GB)
- Aktivera "Hardware acceleration" i BIOS

**För riktig telefon:**
- Stäng andra appar
- Rensa cache: Settings → Apps → DoneTogether → Clear Cache
- Bygg release version istället för debug

---

## 🔍 Allmänna felsökningssteg

### 1. Kolla loggar i Android Studio
- Öppna "Logcat" (längst ner)
- Filtrera på "com.donetogether.app"
- Leta efter röda felmeddelanden

### 2. Kolla Chrome DevTools
```
chrome://inspect
```
Hitta din app och inspektera Console.

### 3. Rensa allt och börja om
```cmd
# Rensa node_modules
rmdir /s /q node_modules
npm install

# Rensa build
rmdir /s /q dist
npm run build

# Rensa Android
cd android
gradlew clean
cd ..

# Synka allt
npx cap sync android
npx cap open android
```

### 4. Kontrollera versioner
```cmd
node --version    # Bör vara v16 eller senare
npm --version     # Bör vara v8 eller senare
npx cap --version # Bör vara v6 eller senare
```

---

## 🆘 Fortfarande problem?

### Kolla dessa filer:
1. `capacitor.config.ts` - Capacitor konfiguration
2. `android/app/google-services.json` - Firebase config
3. `android/app/build.gradle` - Android build config
4. `src/lib/firebase.ts` - Firebase initialisering

### Användbara kommandon:
```cmd
# Lista anslutna enheter
adb devices

# Visa app-loggar
adb logcat | findstr "DoneTogether"

# Avinstallera app
adb uninstall com.donetogether.app

# Rensa app-data
adb shell pm clear com.donetogether.app

# Starta om adb
adb kill-server
adb start-server
```

### Resurser:
- Capacitor docs: https://capacitorjs.com/docs/android
- Android Studio guide: https://developer.android.com/studio/intro
- Firebase Android: https://firebase.google.com/docs/android/setup
- Stack Overflow: https://stackoverflow.com/questions/tagged/capacitor

---

## 💡 Tips för att undvika problem

1. **Bygg alltid webbappen först:** `npm run build`
2. **Synka efter ändringar:** `npx cap sync android`
3. **Stäng och öppna Android Studio** efter stora ändringar
4. **Använd senaste versionen** av Android Studio
5. **Håll dependencies uppdaterade:** `npm update`
6. **Testa på riktig telefon** innan release
7. **Spara SHA-1** någonstans säkert
8. **Backup google-services.json** innan du ändrar

**Lycka till! 🚀**
