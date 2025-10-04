#!/usr/bin/env bash
set -euo pipefail

echo "== Env =="
node -v || true
java -version || true
pwd; ls -la

# --- Variablen ---
: "${ANDROID_SDK_ROOT:="${RUNNER_TEMP:-/tmp}/android-sdk"}"
export ANDROID_SDK_ROOT
BT_VER="35.0.0"
PLATFORM_API="35"

echo "== Install Android SDK CLI =="
mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"
cd "${RUNNER_TEMP:-/tmp}"
curl -sSLo cmdline.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q cmdline.zip
mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
mv cmdline-tools/* "$ANDROID_SDK_ROOT/cmdline-tools/latest/"

export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/build-tools/$BT_VER:$PATH"
yes | sdkmanager --licenses >/dev/null
sdkmanager "platform-tools" "platforms;android-${PLATFORM_API}" "build-tools;${BT_VER}"

echo "== npm build & Capacitor =="
# Lockfile? Falls keins da ist, normal installieren
if [ -f package-lock.json ]; then
  npm ci
else
  npm i
fi
npm run build

# Android-Projekt vorbereiten
if [ ! -d android ]; then
  npx cap add android
fi
npx cap sync android
chmod +x android/gradlew

echo "== Gradle assembleRelease =="
pushd android >/dev/null
./gradlew :app:assembleRelease --no-daemon --stacktrace --info
OUT_DIR="$PWD/app/build/outputs/apk/release"
popd >/dev/null

mkdir -p artifacts
SIGNED_OUT=""

echo "== Optional signieren, falls Secrets gesetzt =="
if [[ -n "${ANDROID_KEYSTORE_BASE64:-}" && -n "${ANDROID_KEYSTORE_PASSWORD:-}" && -n "${ANDROID_KEY_ALIAS:-}" && -n "${ANDROID_KEY_PASSWORD:-}" ]]; then
  echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > android/app/release.jks
  # Finde ein APK (unsigned bevorzugt, sonst das einzige vorhandene)
  APKU="$(ls "android/app/build/outputs/apk/release"/*-unsigned.apk 2>/dev/null | head -n1 || true)"
  if [ -z "$APKU" ]; then
    APKU="$(ls "android/app/build/outputs/apk/release"/*.apk | head -n1)"
  fi
  zipalign -p -f 4 "$APKU" artifacts/app-release-aligned.apk
  apksigner sign \
    --ks android/app/release.jks \
    --ks-key-alias "$ANDROID_KEY_ALIAS" \
    --ks-pass pass:"$ANDROID_KEYSTORE_PASSWORD" \
    --key-pass pass:"$ANDROID_KEY_PASSWORD" \
    --out artifacts/app-release-signed.apk \
    artifacts/app-release-aligned.apk
  apksigner verify --print-certs artifacts/app-release-signed.apk
  SIGNED_OUT="artifacts/app-release-signed.apk"
else
  echo "Kein Signatur-Secret gefunden – lade unsigned APK hoch."
fi

echo "== Artefakte sammeln =="
# immer auch unsigned Ausgaben kopieren (Fallback)
cp android/app/build/outputs/apk/release/*.apk artifacts/ 2>/dev/null || true

echo "== Summary =="
ls -lh artifacts || true
if [ -n "$SIGNED_OUT" ]; then
  echo "SIGNED=$SIGNED_OUT" > artifacts/summary.txt
else
  echo "SIGNED=" > artifacts/summary.txt
fi
