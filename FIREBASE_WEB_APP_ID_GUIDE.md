# 🔥 Hitta Firebase Web App ID

## Varför behöver du detta?
Din `firebase.ts` fil behöver rätt Web App ID för att fungera korrekt. Just nu har den fel ID (Android ID istället för Web ID).

---

## 📍 Steg för Steg

### Steg 1: Öppna Firebase Console
Gå till: https://console.firebase.google.com/

### Steg 2: Välj ditt projekt
Klicka på **donetogether-v1**

### Steg 3: Gå till Project Settings
1. Klicka på kugghjulet ⚙️ längst upp till vänster (bredvid "Project Overview")
2. Välj **"Project settings"**

### Steg 4: Hitta din Web App
Scrolla ner till sektionen **"Your apps"** eller **"Dina appar"**

Du ska se flera appar:
- 🌐 En **Web app** (webb-ikon)
- 🤖 En **Android app** (Android-ikon)

**VIKTIGT:** Välj den med webb-ikonen (🌐), INTE Android-ikonen!

### Steg 5: Kopiera App ID
Under din Web app, hitta **"App ID"** eller **"SDK setup and configuration"**.

App ID ser ut ungefär så här:
```
1:677287957451:web:XXXXXXXXXX
```

**Kopiera hela ID:t!**

### Steg 6: Uppdatera firebase.ts
1. Öppna filen `src/lib/firebase.ts`
2. Hitta raden med `appId: "1:677287957451:web:YOUR_WEB_APP_ID"`
3. Ersätt `YOUR_WEB_APP_ID` med det ID du kopierade
4. Spara filen

---

## ✅ Exempel

**Före:**
```typescript
const firebaseConfig = {
    apiKey: "AIzaSyDsGmC9FOrwuJQMqFKhmCuxiJIP0vxoTBU",
    authDomain: "donetogether-v1.firebaseapp.com",
    projectId: "donetogether-v1",
    storageBucket: "donetogether-v1.firebasestorage.app",
    messagingSenderId: "677287957451",
    appId: "1:677287957451:web:YOUR_WEB_APP_ID",  // ← Ändra denna!
    measurementId: "G-XXXXXXXXXX"
};
```

**Efter (exempel):**
```typescript
const firebaseConfig = {
    apiKey: "AIzaSyDsGmC9FOrwuJQMqFKhmCuxiJIP0vxoTBU",
    authDomain: "donetogether-v1.firebaseapp.com",
    projectId: "donetogether-v1",
    storageBucket: "donetogether-v1.firebasestorage.app",
    messagingSenderId: "677287957451",
    appId: "1:677287957451:web:abc123def456",  // ← Ditt riktiga Web App ID
    measurementId: "G-XXXXXXXXXX"
};
```

---

## 🔍 Hur vet jag att jag har rätt ID?

Rätt Web App ID:
- ✅ Börjar med `1:677287957451:web:`
- ✅ Kommer från Web app (🌐 ikon) i Firebase Console

Fel ID (Android):
- ❌ Börjar med `1:677287957451:android:`
- ❌ Kommer från Android app (🤖 ikon)

---

## ❓ Vad händer om jag inte hittar Web App?

Om du bara ser Android app i Firebase Console, behöver du skapa en Web app:

1. I Firebase Console, gå till Project Settings
2. Scrolla ner till "Your apps"
3. Klicka på **"Add app"** eller **"Lägg till app"**
4. Välj **Web** (</> ikon)
5. Ge den ett namn (t.ex. "DoneTogether Web")
6. Klicka **"Register app"**
7. Kopiera App ID som visas

---

## 🎯 Efter du uppdaterat firebase.ts

Kör dessa kommandon för att bygga om projektet:

```cmd
npm run build
npx cap sync
```

Nu är din Firebase-konfiguration korrekt! 🎉
