# App-Signatur

`formwerk-debug.keystore` ist ein **öffentlicher Entwicklungs-Schlüssel** (Passwort `android`, Alias `formwerk`).
Damit lassen sich Updates der APK direkt über die installierte App installieren.

Für eine Veröffentlichung im Play Store oder einen privaten Schlüssel im Repository unter
**Settings → Secrets and variables → Actions** drei Secrets anlegen. Der Workflow nutzt sie dann automatisch:

| Secret | Inhalt |
|---|---|
| `ANDROID_KEYSTORE_B64` | Keystore-Datei als Base64 (`base64 -w0 mein.keystore`) |
| `ANDROID_KEYSTORE_PASSWORD` | Passwort |
| `ANDROID_KEY_ALIAS` | Alias des Schlüssels |

Achtung: Bei einem Schlüsselwechsel muss die App einmal deinstalliert und neu installiert werden.
