# 📱 Mobile App Build Anleitung für K1W1 Pro+

## Android APK erstellen

### Voraussetzungen
- Android Studio installiert
- Java JDK 11 oder höher
- Node.js und npm installiert

### Schritt-für-Schritt Anleitung

1. **Projekt zu GitHub exportieren**
   - Klicke auf den GitHub-Button in K1W1 Pro+
   - Exportiere dein Projekt zu deinem GitHub Account
   - Clone das Repository lokal: `git clone <dein-repo-url>`

2. **Dependencies installieren**
   ```bash
   cd <dein-projekt>
   npm install
   ```

3. **Android Platform hinzufügen**
   ```bash
   npx cap add android
   ```

4. **Build erstellen**
   ```bash
   npm run build
   npx cap sync
   ```

5. **Android Studio öffnen**
   ```bash
   npx cap open android
   ```

6. **APK in Android Studio bauen**
   - Warte bis Gradle fertig ist
   - Gehe zu: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Die APK findest du unter: `android/app/build/outputs/apk/debug/app-debug.apk`

7. **APK auf Gerät installieren**
   - Aktiviere "Unbekannte Quellen" auf deinem Android-Gerät
   - Übertrage die APK per USB oder Cloud
   - Installiere die APK

## iOS App erstellen

### Voraussetzungen
- macOS mit Xcode installiert
- Apple Developer Account
- CocoaPods installiert

### Schritt-für-Schritt Anleitung

1. **iOS Platform hinzufügen**
   ```bash
   npx cap add ios
   ```

2. **Build erstellen**
   ```bash
   npm run build
   npx cap sync ios
   ```

3. **Xcode öffnen**
   ```bash
   npx cap open ios
   ```

4. **In Xcode konfigurieren**
   - Wähle dein Entwicklungsteam
   - Setze Bundle Identifier
   - Wähle Zielgerät oder Simulator

5. **App starten**
   - Drücke den Play-Button in Xcode
   - Oder: Product → Run

## Hot Reload während Entwicklung

Die `capacitor.config.ts` ist bereits für Hot Reload konfiguriert:
- Deine App lädt direkt von der K1W1 Pro+ Preview-URL
- Änderungen werden sofort auf dem Gerät sichtbar
- Kein erneuter Build nötig!

## Troubleshooting

### Android Build Fehler
- **Gradle Build Failed**: Überprüfe Java Version (`java -version`)
- **SDK nicht gefunden**: Installiere Android SDK über Android Studio
- **Dependencies Fehler**: Führe `npx cap sync` erneut aus

### iOS Build Fehler
- **Signing Error**: Überprüfe Apple Developer Account
- **Provisioning Profile**: Erstelle ein neues Profil in Xcode
- **CocoaPods Error**: Führe `pod install` im `ios/App` Ordner aus

## Nützliche Befehle

```bash
# Projekt synchronisieren
npx cap sync

# Android Studio öffnen
npx cap open android

# Xcode öffnen
npx cap open ios

# Live reload auf Gerät
npx cap run android --livereload
npx cap run ios --livereload

# Build Version aktualisieren
npm run build && npx cap sync
```

## Production Build

Für einen finalen Production Build:

1. **Environment auf Production setzen**
2. **Build optimieren**: `npm run build`
3. **Android Signed APK**:
   - In Android Studio: Build → Generate Signed Bundle / APK
   - Folge dem Wizard für Keystore-Erstellung
4. **iOS für App Store**:
   - In Xcode: Product → Archive
   - Upload zu App Store Connect

## Weitere Ressourcen

- [Capacitor Dokumentation](https://capacitorjs.com/docs)
- [Android Studio Download](https://developer.android.com/studio)
- [Xcode Download](https://developer.apple.com/xcode/)

## Support

Bei Fragen oder Problemen:
- K1W1 Pro+ Community
- Capacitor Discord Server
- Stack Overflow

---

Viel Erfolg beim Erstellen deiner mobilen App! 🚀
