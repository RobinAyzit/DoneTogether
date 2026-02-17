# 🔧 Lösning för Google Login Problem

## Problem du har nu:
1. ✅ Android app byggs korrekt med rätt SHA-1
2. ❌ Android app crashar när du klickar "Logga in med Google"
3. ❌ Localhost kan öppna Google login men loggar inte in dig

---

## 🎯 STEG 1: Fixa Firebase Web App ID

Jag har precis ändrat `firebase.ts` men du behöver rätt Web App ID från Firebase.

### Gör så här:
1. Gå till Firebase Console: https://console.firebase.google.com/
2. Välj projektet **donetogether-v1**
3. Klicka på kugghjulet ⚙️ (Settings) → **Project settings**
4. Scrolla ner till "Your apps" sektionen
5. Hitta din **Web app** (inte Android app!)
6. Kopiera **App ID** (börjar med `1:677287957451:web:...`)
7. Öppna `src/lib/firebase.ts` och ersätt `YOUR_WEB_APP_ID` med det du kopierade

---

## 🎯 STEG 2: Lägg till Localhost i Google Cloud Console

Detta fixar problemet att localhost inte loggar in dig.

### Gör så här:
1. Gå till: https://console.cloud.google.com/apis/credentials?project=donetogether-v1
2. Hitta din **Web client** (OAuth 2.0 Client ID för webb)
3. Klicka på den för att redigera
4. Under **Authorized JavaScript origins**, lägg till:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
5. Under **Authorized redirect URIs**, lägg till:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
6. Klicka **SAVE**

---

## 🎯 STEG 3: Vänta och Testa

Google behöver tid att propagera ändringarna.

### Vänta 30-60 minuter, sedan:

1. **Testa localhost först:**
   ```cmd
   npm run dev
   ```
   - Öppna http://localhost:5173
   - Klicka "Logga in med Google"
   - Välj ditt konto
   - Nu ska det fungera!

2. **Bygg ny Android APK:**
   ```cmd
   npm run build
   npx cap sync android
   npx cap build android
   ```

3. **Testa Android app:**
   - Installera den nya APK:en på din telefon
   - Öppna appen
   - Klicka "Logga in med Google"
   - Om den fortfarande crashar, se nedan 👇

---

## 🚨 Om Android App Fortfarande Crashar

Det kan bero på:

### A) Google Play Services är inte uppdaterade
- Öppna **Google Play Store** på din telefon
- Sök efter "Google Play Services"
- Uppdatera om det finns en uppdatering

### B) Behöver logcat för att se felet
Kör detta kommando medan appen crashar:
```cmd
adb logcat | findstr "GoogleAuth"
```

Skicka mig output så kan jag se exakt vad som är fel.

### C) Testa med Android Studio Emulator istället
1. Öppna Android Studio
2. Skapa en ny emulator med **Google Play Services**
3. Starta emulatorn
4. Installera APK:en på emulatorn
5. Testa logga in

---

## 📋 Sammanfattning av vad som är konfigurerat:

✅ Package name: `nrn.DoneTogether.com`
✅ Firebase project: `donetogether-v1`
✅ SHA-1: `D2:E3:C2:DB:89:E9:92:3B:30:CB:97:F8:7B:55:81:D5:82:22:21:52`
✅ Keystore: `donetogether-release.keystore` (lösenord: android123)
✅ Android OAuth Client: `677287957451-bioldnmggdnnhirnpi7v8optqhotup32.apps.googleusercontent.com`
✅ Web OAuth Client: `677287957451-6vja60qu97qvobgr61li4b3dlrj1pslq.apps.googleusercontent.com`
✅ GitHub Pages: https://robinayzit.github.io/DoneTogether/ (fungerar perfekt!)

---

## 🎬 Nästa Steg:

1. Fixa Web App ID i `firebase.ts` (se STEG 1)
2. Lägg till localhost i Google Cloud Console (se STEG 2)
3. Vänta 30-60 minuter
4. Testa localhost
5. Bygg ny APK och testa Android

**Fråga mig om något är oklart!** 🚀
