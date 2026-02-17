# 🚀 Snabbstart - Bygg din första Android-app

Hej nybörjare! Här är den enklaste vägen till din Android-app.

## ✅ Vad du behöver

1. **Node.js** (du har redan detta eftersom projektet fungerar)
2. **Android Studio** - Ladda ner här: https://developer.android.com/studio
3. **En kopp kaffe** ☕ (första bygget tar ~10 minuter)

## 🎯 Snabbsteg (5 minuter)

### 1. Kör setup-scriptet
Dubbelklicka på `setup-android.cmd` eller kör i terminalen:
```cmd
setup-android.cmd
```

### 2. Öppna Android Studio
```cmd
npx cap open android
```

Vänta tills "Gradle sync" är klar (se längst ner i Android Studio).

### 3. Kör appen
- Klicka på den gröna play-knappen ▶️ längst upp
- Välj en emulator eller din telefon
- Vänta ~2 minuter första gången

**Grattis! Din app körs nu! 🎉**

## ⚠️ Google-inloggning fungerar inte än?

Du behöver konfigurera Firebase:

### Steg A: Hämta SHA-1
I Android Studio, öppna Terminal (längst ner) och kör:
```cmd
gradlew signingReport
```

Kopiera texten som ser ut så här:
```
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
```

### Steg B: Lägg till i Firebase
1. Gå till: https://console.firebase.google.com
2. Välj projekt: "donetogether-official"
3. Klicka på kugghjulet ⚙️ → Project Settings
4. Scrolla ner till "Your apps"
5. Hitta din Android-app (com.donetogether.app)
6. Klicka "Add fingerprint"
7. Klistra in SHA-1
8. Klicka "Save"

### Steg C: Ladda ner ny config
1. I samma sida, klicka "google-services.json" (nedladdningsikon)
2. Ersätt filen i: `android/app/google-services.json`
3. I Android Studio: File → Sync Project with Gradle Files

### Steg D: Testa igen
Kör appen igen och testa Google-inloggning!

## 📱 Testa på din riktiga telefon

1. På telefonen: Settings → About Phone
2. Tryck 7 gånger på "Build Number"
3. Gå tillbaka → Developer Options
4. Aktivera "USB Debugging"
5. Anslut USB-kabel till datorn
6. Klicka "Run" i Android Studio
7. Välj din telefon från listan

## 🏗️ Bygg en APK att dela

```cmd
cd android
gradlew assembleRelease
```

APK finns i: `android/app/build/outputs/apk/release/`

## 🆘 Hjälp, något gick fel!

### "Gradle sync failed"
- Stäng Android Studio
- Ta bort mappen: `android/.gradle`
- Öppna Android Studio igen

### "App won't install"
```cmd
adb uninstall com.donetogether.app
```
Försök installera igen.

### "Google Sign-In failed"
- Dubbelkolla att SHA-1 är korrekt i Firebase
- Vänta 5 minuter (Firebase behöver uppdatera)
- Avinstallera och installera appen igen

## 📚 Vill du lära dig mer?

- Läs `ANDROID_SETUP_GUIDE.md` för detaljerad info
- Capacitor docs: https://capacitorjs.com/docs
- Android basics: https://developer.android.com/courses

## 💡 Tips

- Första bygget tar längst tid (10-15 min)
- Nästa gånger går mycket snabbare (1-2 min)
- Använd emulator för snabb testning
- Använd riktig telefon för slutlig testning
- Spara SHA-1 någonstans, du behöver den igen

**Lycka till! Du klarar det här! 💪**
