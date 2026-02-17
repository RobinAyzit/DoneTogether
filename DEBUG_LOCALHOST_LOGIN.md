# 🔍 Debug Localhost Login Problem

## Vad som händer nu:

1. Du klickar "Logga in med Google"
2. Du kommer till `donetogether-v1.firebaseapp.com/__/auth/handler`
3. Du väljer ditt Google-konto
4. En snabb redirect händer (som du inte hinner se)
5. Du hamnar tillbaka på `http://localhost:5173/` men är INTE inloggad

---

## 🎯 Så här ser du vad som är fel:

### Metod 1: Öppna Browser Console (Rekommenderas!)

1. **Öppna din webbläsare** (Chrome, Edge, Firefox)
2. **Gå till** http://localhost:5173/
3. **Öppna Developer Tools:**
   - Tryck `F12` på tangentbordet, ELLER
   - Högerklicka på sidan → "Inspect" / "Granska", ELLER
   - Tryck `Ctrl + Shift + I`

4. **Klicka på "Console" fliken** (längst upp i Developer Tools)

5. **Klicka "Logga in med Google"** och välj ditt konto

6. **Titta i Console** - du kommer se felmeddelanden i rött!

### Vanliga felmeddelanden och vad de betyder:

#### Fel 1: "redirect_uri_mismatch"
```
Error: redirect_uri_mismatch
The redirect URI in the request: http://localhost:5173/ does not match...
```

**Betyder:** Du har inte lagt till `http://localhost:5173` i Google Cloud Console än.

**Lösning:** Följ `GOOGLE_CLOUD_CONSOLE_GUIDE.md` och lägg till localhost.

---

#### Fel 2: "auth/popup-blocked" eller "auth/cancelled-popup-request"
```
Error: auth/popup-blocked
```

**Betyder:** Webbläsaren blockerar popup-fönster.

**Lösning:** Vi använder redan redirect istället för popup, så detta ska inte hända.

---

#### Fel 3: "auth/unauthorized-domain"
```
Error: auth/unauthorized-domain
This domain (localhost) is not authorized...
```

**Betyder:** `localhost` är inte godkänd i Firebase Console.

**Lösning:**
1. Gå till https://console.firebase.google.com/
2. Välj `donetogether-v1`
3. Gå till **Authentication** → **Settings** → **Authorized domains**
4. Lägg till `localhost` om den inte finns där
5. Spara

---

#### Fel 4: Inget fel, men "Redirect result error" i console
```
Redirect result error: No redirect result available
```

**Betyder:** Firebase fick inget svar från Google efter redirect.

**Möjliga orsaker:**
- Google Cloud Console har inte propagerat ändringarna än (vänta 30-60 min)
- Fel Web Client ID i `capacitor.config.ts`
- Cookies blockerade i webbläsaren

---

### Metod 2: Kolla Network Tab

1. Öppna Developer Tools (`F12`)
2. Klicka på **"Network"** fliken
3. Klicka "Logga in med Google"
4. Välj ditt konto
5. Titta på alla requests som görs
6. Leta efter requests som är **röda** (failed)
7. Klicka på dem för att se felmeddelandet

---

### Metod 3: Slow Down Redirect (Se den snabba adressen)

Lägg till detta i `src/hooks/useAuth.ts` temporärt för att se vad som händer:

```typescript
// I useEffect, efter checkRedirect funktionen, lägg till:
const checkRedirect = async () => {
    try {
        console.log('🔍 Checking for redirect result...');
        const result = await getRedirectResult(auth);
        if (result?.user) {
            console.log('✅ Redirect login success:', result.user.email);
        } else {
            console.log('⚠️ No redirect result found');
        }
    } catch (err: any) {
        console.error('❌ Redirect result error:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
    }
};
```

Detta kommer skriva ut detaljerad information i console!

---

## 🎯 Vad du ska göra NU:

1. **Öppna Browser Console** (`F12`)
2. **Gå till Console fliken**
3. **Klicka "Logga in med Google"**
4. **Välj ditt konto**
5. **Kopiera ALLA felmeddelanden** du ser (särskilt röda)
6. **Skicka dem till mig**

Då kan jag se exakt vad som är fel! 🔍

---

## 💡 Vanliga Orsaker:

### A) Du har inte lagt till localhost i Google Cloud Console än
**Lösning:** Följ `GOOGLE_CLOUD_CONSOLE_GUIDE.md`

### B) Du har lagt till localhost men Google har inte propagerat än
**Lösning:** Vänta 30-60 minuter

### C) Fel Web Client ID i capacitor.config.ts
**Lösning:** Kontrollera att `serverClientId` i `capacitor.config.ts` är:
```
677287957451-6vja60qu97qvobgr61li4b3dlrj1pslq.apps.googleusercontent.com
```

### D) Fel Web App ID i firebase.ts
**Lösning:** Följ `FIREBASE_WEB_APP_ID_GUIDE.md`

---

## 🔧 Quick Fix: Testa med GitHub Pages

Om du vill bekräfta att allt annat fungerar:

1. Bygg projektet:
   ```cmd
   npm run build
   git add .
   git commit -m "test"
   git push
   ```

2. Vänta 1-2 minuter

3. Testa https://robinayzit.github.io/DoneTogether/

Om GitHub Pages fungerar men localhost inte gör det, vet vi att problemet är specifikt för localhost-konfigurationen i Google Cloud Console.

---

## 📸 Skicka mig:

1. **Skärmdump av Browser Console** efter du försökt logga in
2. **Alla felmeddelanden** (kopiera texten)
3. **Skärmdump av Google Cloud Console** → Credentials → Din Web Client (visa Authorized origins och redirect URIs)

Då fixar jag det direkt! 🚀
