# 👀 Se Den Snabba Redirect-Adressen

## Problemet:
När du väljer Google-konto ser du en adress som snabbt byts till `http://localhost:5173/` - du hinner inte se vad det är.

---

## 🎯 Lösning: Använd Browser Console

Jag har nu lagt till **debug-loggar** i koden som visar exakt vad som händer!

### Steg 1: Starta om dev server
```cmd
npm run dev
```

### Steg 2: Öppna Browser Console
1. Öppna http://localhost:5173/ i webbläsaren
2. Tryck `F12` på tangentbordet
3. Klicka på **"Console"** fliken

### Steg 3: Testa logga in
1. Klicka "Logga in med Google"
2. Välj ditt Google-konto

### Steg 4: Läs loggarna i Console

Du kommer nu se detaljerade meddelanden som:

#### När du klickar "Logga in med Google":
```
🌐 Starting Firebase redirect sign in...
🌐 Current URL: http://localhost:5173/
🌐 Redirect will go to Google, then back to: http://localhost:5173
🌐 Redirect initiated (you will be redirected to Google now)
```

#### När du kommer tillbaka från Google:
```
🔍 Checking for redirect result...
```

**Om det fungerar:**
```
✅ Redirect login success: [din-email]@gmail.com
✅ User ID: abc123xyz...
```

**Om det INTE fungerar (vanligaste fel):**

##### Fel 1: redirect_uri_mismatch
```
❌ Redirect result error: Error: redirect_uri_mismatch
❌ Error code: auth/invalid-oauth-client-id
❌ Error message: The redirect URI in the request does not match...
```
**Betyder:** Du har inte lagt till `http://localhost:5173` i Google Cloud Console.
**Lösning:** Följ `GOOGLE_CLOUD_CONSOLE_GUIDE.md`

##### Fel 2: unauthorized-domain
```
❌ Redirect result error: Error: auth/unauthorized-domain
❌ Error code: auth/unauthorized-domain
❌ Error message: This domain (localhost) is not authorized...
🔧 FIX: Add localhost to Firebase Authorized Domains
```
**Betyder:** `localhost` är inte godkänd i Firebase Console.
**Lösning:** Se nedan 👇

##### Fel 3: Inget fel, men ingen användare
```
⚠️ No redirect result found (this is normal on first page load)
```
**Betyder:** Firebase fick inget svar från Google.
**Möjliga orsaker:**
- Google Cloud Console har inte propagerat ändringarna än (vänta 30-60 min)
- Fel konfiguration i Google Cloud Console

---

## 🔧 Fixa "unauthorized-domain" fel

Om du ser `auth/unauthorized-domain`:

### Steg 1: Gå till Firebase Console
https://console.firebase.google.com/

### Steg 2: Välj donetogether-v1

### Steg 3: Gå till Authentication
Klicka på **"Authentication"** i vänster menyn

### Steg 4: Gå till Settings
Klicka på **"Settings"** fliken (bredvid "Users")

### Steg 5: Scrolla till "Authorized domains"
Du ska se en lista med domäner som är godkända.

### Steg 6: Lägg till localhost
1. Klicka **"Add domain"**
2. Skriv: `localhost`
3. Klicka **"Add"**

### Steg 7: Testa igen
Gå tillbaka till http://localhost:5173/ och testa logga in igen.

---

## 📸 Skicka mig Console Output

Efter du testat logga in:

1. **Högerklicka i Console** (där alla meddelanden visas)
2. Välj **"Save as..."** eller kopiera all text
3. Skicka till mig

Eller ta en skärmdump av Console-fönstret!

Då kan jag se exakt vad som händer och hjälpa dig direkt. 🚀

---

## 💡 Tips: Rensa Console

Om det är mycket text i Console:

1. Klicka på 🚫 ikonen (Clear console) längst upp i Console
2. Testa logga in igen
3. Nu ser du bara relevanta meddelanden

---

## 🎯 Vad händer efter redirect?

När du väljer Google-konto:

1. Google skickar dig till: `donetogether-v1.firebaseapp.com/__/auth/handler`
2. Firebase verifierar din inloggning
3. Firebase redirectar dig tillbaka till: `http://localhost:5173/`
4. Firebase försöker hämta redirect-resultatet
5. Om allt är korrekt konfigurerat: Du är inloggad! ✅
6. Om något är fel: Du ser felmeddelande i Console ❌

Den "snabba adressen" du inte hinner se är troligen steg 2-3, men Console kommer visa dig exakt vad som händer!

---

## ✅ Nästa Steg

1. Starta om dev server: `npm run dev`
2. Öppna Console (`F12`)
3. Testa logga in
4. Läs meddelanden i Console
5. Skicka mig output om det inte fungerar

Lycka till! 🍀
