# 🚨 VIKTIGT: Fel google-services.json fil!

## Problemet:
Du har `google-services.json` från fel Firebase-projekt!

- **Din kod använder:** `donetogether-official` (project: 226200528766)
- **Din google-services.json är från:** `donetogether-v1` (project: 677287957451)

Detta är varför appen kraschar!

---

## Lösning: Ladda ner rätt google-services.json

### Steg 1: Gå till rätt Firebase-projekt
1. Öppna: https://console.firebase.google.com
2. Välj projektet: **"donetogether-official"** (INTE "donetogether-v1")

### Steg 2: Kontrollera att SHA-1 är tillagd
1. Klicka på kugghjulet ⚙️ → Project Settings
2. Scrolla ner till "Your apps"
3. Hitta din Android-app: **com.donetogether.app**
4. Kontrollera att SHA-1 finns: `89:D2:F6:C2:7E:D1:21:48:F0:8C:0B:48:AE:3E:48:56:8A:C7:78:07`
5. Om den INTE finns, lägg till den och klicka "Save"

### Steg 3: Ladda ner google-services.json
1. På samma sida, hitta **"google-services.json"**
2. Klicka på nedladdningsikonen 📥
3. Spara filen

### Steg 4: Ersätt filen
1. Hitta den nedladdade filen (troligen i Downloads)
2. Kopiera den till: `D:\APPS By RobinAyzit\DoneTogether\android\app\google-services.json`
3. **ERSÄTT** den gamla filen

### Steg 5: Verifiera innehållet
Öppna den nya filen och kontrollera att den innehåller:
- `"project_id": "donetogether-official"` (INTE "donetogether-v1")
- `"project_number": "226200528766"` (INTE "677287957451")

---

## Efter du ersatt filen:

### 1. Synka projektet:
I Android Studio:
- File → Sync Project with Gradle Files

### 2. Bygg om:
- Build → Rebuild Project

### 3. Kör appen:
- Klicka gröna play-knappen ▶️
- Testa Google Sign-In

---

## ✅ Så här ska rätt google-services.json se ut:

```json
{
  "project_info": {
    "project_number": "226200528766",
    "project_id": "donetogether-official",
    ...
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:226200528766:android:...",
        "android_client_info": {
          "package_name": "com.donetogether.app"
        }
      },
      "oauth_client": [
        {
          "client_id": "226200528766-...apps.googleusercontent.com",
          "client_type": 1
        },
        {
          "client_id": "226200528766-...apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      ...
    }
  ]
}
```

Notera:
- project_number ska vara **226200528766**
- project_id ska vara **donetogether-official**
- Det ska finnas minst 2 oauth_client entries (client_type 1 och 3)

---

## 🆘 Om du inte hittar "donetogether-official" projektet:

Det kan betyda att:
1. Du är inloggad med fel Google-konto
2. Projektet har bytt namn
3. Du behöver skapa ett nytt projekt

**Alternativ:** Uppdatera din kod att använda "donetogether-v1" istället, men då måste du:
1. Uppdatera `src/lib/firebase.ts` med nya credentials
2. Uppdatera `capacitor.config.ts` med nya Client IDs
3. Lägga till SHA-1 i "donetogether-v1" projektet

**Rekommendation:** Använd "donetogether-official" eftersom det är vad din kod redan är konfigurerad för.
