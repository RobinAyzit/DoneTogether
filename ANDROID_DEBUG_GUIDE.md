# 🐛 Debug Android App Crash

## Om appen fortfarande crashar när du klickar "Logga in med Google"

---

## 🔍 Metod 1: Samla Logcat (Rekommenderas!)

Detta visar oss exakt varför appen crashar.

### Förbered:
1. Anslut din Android-telefon till datorn med USB-kabel
2. Aktivera **Developer Options** och **USB Debugging** på telefonen
3. Öppna Command Prompt (cmd) på datorn

### Samla loggar:
```cmd
adb logcat -c
adb logcat | findstr "GoogleAuth"
```

### Testa appen:
1. Öppna DoneTogether-appen på telefonen
2. Klicka "Logga in med Google"
3. Appen crashar
4. Titta på Command Prompt - du ska se felmeddelanden

### Skicka mig loggarna:
Kopiera allt som står i Command Prompt och skicka till mig. Då kan jag se exakt vad som är fel!

---

## 🔍 Metod 2: Kolla Google Play Services

Android-appen behöver Google Play Services för att Google Sign-In ska fungera.

### Uppdatera Google Play Services:
1. Öppna **Google Play Store** på telefonen
2. Sök efter "Google Play Services"
3. Om det finns en **"Uppdatera"** knapp, klicka på den
4. Vänta tills uppdateringen är klar
5. Starta om telefonen
6. Testa appen igen

---

## 🔍 Metod 3: Testa med Android Studio Emulator

Ibland fungerar emulatorn bättre än riktiga telefoner för testning.

### Skapa Emulator:
1. Öppna Android Studio
2. Klicka på **Device Manager** (telefon-ikon på höger sida)
3. Klicka **"Create Device"**
4. Välj **Pixel 5** eller liknande
5. Välj **System Image**: API 33 eller 34 med **Google Play**
6. Klicka **Finish**

### Starta Emulator och Testa:
```cmd
cd android
gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

Öppna appen i emulatorn och testa logga in.

---

## 🔍 Metod 4: Verifiera SHA-1 i APK

Kontrollera att APK:en verkligen har rätt SHA-1.

```cmd
keytool -list -printcert -jarfile android/app/build/outputs/apk/debug/app-debug.apk
```

Du ska se:
```
SHA1: D2:E3:C2:DB:89:E9:92:3B:30:CB:97:F8:7B:55:81:D5:82:22:21:52
```

Om SHA-1 är annorlunda, behöver vi bygga om APK:en korrekt.

---

## 🔍 Metod 5: Kolla Google Cloud Console

Verifiera att Android OAuth Client är korrekt konfigurerad.

### Gå till:
https://console.cloud.google.com/apis/credentials?project=donetogether-v1

### Hitta Android OAuth Client:
Leta efter en OAuth 2.0 Client ID med:
- **Application type:** Android
- **Package name:** `nrn.DoneTogether.com`
- **SHA-1:** `D2:E3:C2:DB:89:E9:92:3B:30:CB:97:F8:7B:55:81:D5:82:22:21:52`

Om något är fel, redigera och spara.

---

## 🚨 Vanliga Fel och Lösningar

### Fel: "NullPointerException in GoogleAuth"
**Orsak:** GoogleAuth plugin inte korrekt registrerad eller Google Play Services saknas.

**Lösning:**
1. Kontrollera att `MainActivity.java` har `registerPlugin(GoogleAuth.class);`
2. Uppdatera Google Play Services på telefonen
3. Bygg om projektet: `npx cap sync android`

### Fel: "DEVELOPER_ERROR"
**Orsak:** SHA-1 eller package name matchar inte i Google Cloud Console.

**Lösning:**
1. Verifiera SHA-1 i APK (se Metod 4)
2. Uppdatera Google Cloud Console med rätt SHA-1
3. Vänta 30-60 minuter
4. Testa igen

### Fel: "API not enabled"
**Orsak:** Google Sign-In API inte aktiverad för projektet.

**Lösning:**
1. Gå till: https://console.cloud.google.com/apis/library/plus.googleapis.com?project=donetogether-v1
2. Klicka **"ENABLE"**
3. Vänta några minuter
4. Testa igen

---

## 📋 Checklista innan du frågar om hjälp

Innan du kontaktar mig, kolla att du har gjort:

- [ ] Väntat minst 30-60 minuter efter ändringar i Google Cloud Console
- [ ] Uppdaterat Google Play Services på telefonen
- [ ] Byggt om projektet: `npm run build && npx cap sync android`
- [ ] Verifierat SHA-1 i APK matchar Google Cloud Console
- [ ] Testat på en annan telefon eller emulator
- [ ] Samlat logcat-loggar (Metod 1)

---

## 💡 Tips

**Testa localhost först!**
Om localhost fungerar men Android inte gör det, vet vi att problemet är specifikt för Android (SHA-1, Google Play Services, etc).

Om localhost INTE fungerar, är problemet i Firebase/Google Cloud Console konfigurationen.

---

## 🎯 Nästa Steg

1. Testa localhost först (efter 30-60 minuter)
2. Om localhost fungerar, fokusera på Android
3. Samla logcat-loggar från Android
4. Skicka loggarna till mig så fixar vi det! 🚀
