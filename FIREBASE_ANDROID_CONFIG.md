# 🔥 Firebase Konfiguration för Android

## Varför behöver jag göra detta?

Google Sign-In kräver att Firebase känner till din app's "fingerprint" (SHA-1). Det är som ett säkerhetscertifikat som bevisar att det är din app som försöker logga in användare.

## 📋 Steg-för-steg med bilder

### Steg 1: Hitta din SHA-1 Fingerprint

1. Öppna Android Studio
2. Öppna Terminal (längst ner i fönstret)
3. Kör detta kommando:

```bash
cd android
gradlew signingReport
```

4. Du kommer se något liknande detta:

```
Variant: debug
Config: debug
Store: C:\Users\[ditt-namn]\.android\debug.keystore
Alias: AndroidDebugKey
MD5: 12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
SHA-256: 11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC
```

5. **KOPIERA SHA1-raden** (den med AA:BB:CC:DD...)

### Steg 2: Öppna Firebase Console

1. Gå till: https://console.firebase.google.com
2. Logga in med ditt Google-konto
3. Klicka på projektet: **"donetogether-official"**

### Steg 3: Gå till Project Settings

1. Klicka på **kugghjulet ⚙️** längst upp till vänster
2. Välj **"Project Settings"**

### Steg 4: Hitta din Android-app

1. Scrolla ner till sektionen **"Your apps"**
2. Du bör se din app: **com.donetogether.app**
3. Om du INTE ser den, klicka **"Add app"** → **Android** och följ instruktionerna

### Steg 5: Lägg till SHA-1 Fingerprint

1. Under din Android-app, hitta sektionen **"SHA certificate fingerprints"**
2. Klicka på **"Add fingerprint"**
3. Klistra in SHA-1 som du kopierade (AA:BB:CC:DD...)
4. Klicka **"Save"**

### Steg 6: Ladda ner google-services.json

1. I samma sida, hitta **"google-services.json"**
2. Klicka på nedladdningsikonen 📥
3. Spara filen

### Steg 7: Ersätt config-filen

1. Hitta den nedladdade filen (troligen i Downloads)
2. Kopiera den till ditt projekt: **`android/app/google-services.json`**
3. Ersätt den gamla filen

### Steg 8: Synka projektet

1. Gå tillbaka till Android Studio
2. Klicka: **File → Sync Project with Gradle Files**
3. Vänta tills synkningen är klar

### Steg 9: Testa!

1. Kör appen igen (gröna play-knappen ▶️)
2. Testa Google-inloggning
3. Det bör fungera nu! 🎉

## 🔄 Om du fortfarande har problem

### Vänta 5 minuter
Firebase behöver ibland lite tid att uppdatera sina servrar.

### Kontrollera att du har rätt SHA-1
Kör `gradlew signingReport` igen och dubbelkolla.

### Avinstallera och installera appen igen
```cmd
adb uninstall com.donetogether.app
```
Kör sedan appen från Android Studio igen.

### Kontrollera att du har rätt Client IDs

I `capacitor.config.ts` ska du ha:
- **serverClientId**: Web Client ID från Firebase (slutar på .apps.googleusercontent.com)
- **androidClientId**: Android Client ID från Firebase

Du hittar dessa i Firebase Console:
1. Project Settings → General
2. Scrolla ner till "Your apps"
3. Klicka på din Android-app
4. Kopiera "Web client ID" och "Android client ID"

## 📝 Viktiga saker att komma ihåg

- **Debug SHA-1**: Används när du utvecklar (Android Studio)
- **Release SHA-1**: Används när du bygger APK för distribution
- Du behöver lägga till BÅDA i Firebase om du vill att båda ska fungera
- SHA-1 ändras INTE om du inte ändrar keystore

## 🎯 Nästa steg

När Google Sign-In fungerar:
1. Testa alla funktioner i appen
2. Bygg en release APK
3. Testa på olika telefoner
4. (Valfritt) Publicera på Google Play Store

## 🆘 Fortfarande problem?

Kontrollera dessa filer:
- `android/app/google-services.json` - Ska finnas och vara uppdaterad
- `capacitor.config.ts` - Ska ha rätt Client IDs
- `src/lib/firebase.ts` - Ska ha rätt Firebase config

Kör också:
```cmd
npx cap sync android
```

Och öppna projektet på nytt i Android Studio.
