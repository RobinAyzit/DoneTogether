# 🔥 Firebase Setup - Gör detta NU!

## Din SHA-1 Fingerprint:
```
89:D2:F6:C2:7E:D1:21:48:F0:8C:0B:48:AE:3E:48:56:8A:C7:78:07
```

---

## Steg 1: Lägg till SHA-1 i Firebase Console

Du är redan på rätt sida! (Bild 1)

1. I Firebase Console, under "Your apps" → "DoneTogether Android"
2. Scrolla ner till **"SHA certificate fingerprints"**
3. Klicka på **"Add fingerprint"**
4. Klistra in: `89:D2:F6:C2:7E:D1:21:48:F0:8C:0B:48:AE:3E:48:56:8A:C7:78:07`
5. Klicka **"Save"** (längst ner på sidan)

---

## Steg 2: Ladda ner ny google-services.json

1. På samma sida i Firebase Console
2. Hitta **"google-services.json"** (nedladdningsikon 📥)
3. Klicka för att ladda ner
4. Spara filen

---

## Steg 3: Ersätt google-services.json i projektet

1. Hitta den nedladdade filen (troligen i Downloads)
2. Kopiera den till: `D:\APPS By RobinAyzit\DoneTogether\android\app\google-services.json`
3. Ersätt den gamla filen

---

## Steg 4: Konfigurera Authorized Redirect URIs (Google Cloud Console)

Du är redan på rätt sida! (Bild 2)

### För Web Client:
1. I Google Cloud Console, under "Authorized redirect URIs"
2. Klicka **"+ Add URI"**
3. Lägg till dessa URIs (en i taget):

```
https://donetogether-official.firebaseapp.com/__/auth/handler
http://localhost
http://localhost:5173
http://localhost:5173/__/auth/handler
```

4. Klicka **"Save"** längst ner

---

## Steg 5: Synka Android Studio

1. Gå tillbaka till Android Studio
2. Klicka: **File → Sync Project with Gradle Files**
3. Vänta tills synkningen är klar

---

## Steg 6: Testa Google Sign-In

1. Kör appen igen (gröna play-knappen ▶️)
2. Klicka på "Sign in with Google"
3. Välj ditt Google-konto
4. Det bör fungera nu! 🎉

---

## ⚠️ Viktigt att veta:

- Firebase behöver 5-10 minuter att uppdatera sina servrar
- Om det inte fungerar direkt, vänta 5 minuter och försök igen
- Avinstallera och installera appen igen om det fortfarande inte fungerar

---

## 🆘 Om det fortfarande inte fungerar:

### Kontrollera att SHA-1 är korrekt tillagd:
1. Gå till Firebase Console
2. Project Settings → General
3. Scrolla ner till "Your apps" → "DoneTogether Android"
4. Kontrollera att SHA-1 finns under "SHA certificate fingerprints"

### Avinstallera och installera appen igen:
```cmd
adb uninstall com.donetogether.app
```
Kör sedan appen från Android Studio igen.

---

## ✅ Checklista:

- [ ] SHA-1 tillagd i Firebase Console
- [ ] Klickat "Save" i Firebase
- [ ] Laddat ner ny google-services.json
- [ ] Ersatt google-services.json i android/app/
- [ ] Lagt till redirect URIs i Google Cloud Console
- [ ] Klickat "Save" i Google Cloud Console
- [ ] Synkat projektet i Android Studio
- [ ] Väntat 5 minuter
- [ ] Testat Google Sign-In

**Lycka till! 🚀**
