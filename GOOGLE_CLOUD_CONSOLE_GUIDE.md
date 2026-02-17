# 🔑 Google Cloud Console - Steg för Steg

## Problem: Localhost loggar inte in dig efter att du valt Google-konto

### Orsak:
Google tillåter inte `http://localhost:5173` att ta emot inloggningar eftersom den inte är registrerad som en "Authorized origin".

---

## 📍 Lösning: Lägg till Localhost som Authorized Origin

### Steg 1: Öppna Google Cloud Console
Gå till: https://console.cloud.google.com/apis/credentials?project=donetogether-v1

### Steg 2: Hitta din Web Client
Du ska se en lista med "OAuth 2.0 Client IDs". Hitta den som heter något liknande:
- "Web client" eller
- "Web application" eller  
- ID som slutar med `.apps.googleusercontent.com`

**VIKTIGT:** Det ska INTE vara "Android client"!

### Steg 3: Klicka på Web Client för att redigera
Klicka på namnet eller på pennikonen för att öppna redigeringsläget.

### Steg 4: Lägg till Authorized JavaScript origins
Scrolla ner till sektionen **"Authorized JavaScript origins"**.

Klicka på **"+ ADD URI"** och lägg till dessa BÅDA:
```
http://localhost:5173
http://127.0.0.1:5173
```

### Steg 5: Lägg till Authorized redirect URIs
Scrolla ner till sektionen **"Authorized redirect URIs"**.

Klicka på **"+ ADD URI"** och lägg till dessa BÅDA:
```
http://localhost:5173
http://127.0.0.1:5173
```

### Steg 6: Spara
Klicka på **"SAVE"** längst ner på sidan.

---

## ⏰ Vänta 30-60 minuter

Google behöver tid att propagera ändringarna till alla sina servrar. Detta är normalt!

---

## ✅ Testa efter 30-60 minuter

1. Starta din dev server:
   ```cmd
   npm run dev
   ```

2. Öppna http://localhost:5173 i din webbläsare

3. Klicka "Logga in med Google"

4. Välj ditt Google-konto

5. Nu ska du bli inloggad och se din profil! 🎉

---

## 🔍 Vad du ska se i Google Cloud Console

Efter att du lagt till URIs ska det se ut ungefär så här:

**Authorized JavaScript origins:**
- `https://robinayzit.github.io` (redan finns)
- `http://localhost:5173` (ny)
- `http://127.0.0.1:5173` (ny)

**Authorized redirect URIs:**
- `https://robinayzit.github.io/DoneTogether` (redan finns)
- `http://localhost:5173` (ny)
- `http://127.0.0.1:5173` (ny)

---

## ❓ Vanliga Frågor

**Q: Varför behöver jag både localhost och 127.0.0.1?**
A: Vissa webbläsare använder `localhost` och andra använder `127.0.0.1`. Genom att lägga till båda är vi säkra.

**Q: Är det säkert att lägga till localhost?**
A: Ja! Localhost är bara tillgängligt på din egen dator, ingen annan kan använda det.

**Q: Måste jag vänta 30-60 minuter?**
A: Ja, tyvärr. Google's servrar behöver tid att synkronisera ändringarna.

**Q: Vad händer om det fortfarande inte fungerar efter 60 minuter?**
A: Dubbelkolla att du redigerade rätt OAuth Client (Web client, inte Android client). Skicka en skärmdump till mig så hjälper jag dig!

---

## 🎯 Nästa Steg

Efter att localhost fungerar, kan vi fokusera på att fixa Android-appen! 🚀
