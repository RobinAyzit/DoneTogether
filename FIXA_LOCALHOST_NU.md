# 🔧 FIXA LOCALHOST NU - Steg för Steg

## Problemet du har:
Console visar: `⚠️ No redirect result found`

Detta betyder att Google inte tillåter redirect tillbaka till `http://localhost:5173/`

---

## ✅ LÖSNING: Lägg till Localhost i Google Cloud Console

### Steg 1: Öppna Google Cloud Console
Klicka här: https://console.cloud.google.com/apis/credentials?project=donetogether-v1

### Steg 2: Hitta din Web Client
Du ska se en lista med "OAuth 2.0 Client IDs".

Leta efter en som heter:
- "Web client" ELLER
- "Web application" ELLER
- Något med "web" i namnet

**VIKTIGT:** Det ska INTE vara "Android client"!

Client ID ska börja med: `677287957451-` och sluta med `.apps.googleusercontent.com`

### Steg 3: Klicka på Web Client
Klicka på namnet för att öppna redigeringsläget.

### Steg 4: Lägg till Authorized JavaScript origins
Scrolla ner till sektionen **"Authorized JavaScript origins"**.

Du ska redan se:
- `https://robinayzit.github.io`

Klicka på **"+ ADD URI"** och lägg till:
```
http://localhost:5173
```

Klicka **"+ ADD URI"** igen och lägg till:
```
http://127.0.0.1:5173
```

### Steg 5: Lägg till Authorized redirect URIs
Scrolla ner till sektionen **"Authorized redirect URIs"**.

Du ska redan se:
- `https://robinayzit.github.io/DoneTogether`

Klicka på **"+ ADD URI"** och lägg till:
```
http://localhost:5173
```

Klicka **"+ ADD URI"** igen och lägg till:
```
http://127.0.0.1:5173
```

### Steg 6: SPARA
Klicka på **"SAVE"** längst ner på sidan.

---

## ⏰ VÄNTA 30-60 MINUTER

Google behöver tid att propagera ändringarna till alla sina servrar.

**Detta är normalt och kan inte påskyndas!**

---

## ✅ TESTA EFTER 30-60 MINUTER

1. Gå tillbaka till http://localhost:5173/
2. Öppna Console (`F12`)
3. Klicka "Logga in med Google"
4. Välj ditt konto

Nu ska du se i Console:
```
✅ Redirect login success: [din-email]@gmail.com
✅ User ID: abc123xyz...
```

Och du ska vara inloggad! 🎉

---

## 📸 Skicka mig skärmdump

Efter du gjort Steg 1-6, ta en skärmdump av:

1. **Google Cloud Console** - visa "Authorized JavaScript origins" och "Authorized redirect URIs" sektionerna
2. Skicka till mig så jag kan verifiera att det är korrekt

---

## ❓ Hittar du inte Web Client?

Om du bara ser "Android client" och ingen "Web client":

### Du behöver skapa en Web OAuth Client:

1. I Google Cloud Console, klicka **"+ CREATE CREDENTIALS"**
2. Välj **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `DoneTogether Web`
5. Under **Authorized JavaScript origins**, lägg till:
   - `https://robinayzit.github.io`
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
6. Under **Authorized redirect URIs**, lägg till:
   - `https://robinayzit.github.io/DoneTogether`
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
7. Klicka **CREATE**
8. Kopiera **Client ID** som visas
9. Öppna `capacitor.config.ts` och uppdatera `serverClientId` med det nya Client ID:t
10. Spara och bygg om: `npm run build && npx cap sync`

---

## 🎯 Sammanfattning

1. ✅ Lägg till localhost i Google Cloud Console (Steg 1-6)
2. ⏰ Vänta 30-60 minuter
3. 🧪 Testa igen
4. 📸 Skicka skärmdump om det inte fungerar

**Gör detta NU, sedan vänta!** ⏰
