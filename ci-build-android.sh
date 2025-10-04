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
if [ -f package-lock.json ]; then npm ci; else npm i; fi
if npm run | grep -qE '^\s*build\s'; then npm run build; fi

echo "== Capacitor Android-Projekt =="
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android

echo "== Gradle Wrapper & Flags =="
WRP=android/gradle/wrapper/gradle-wrapper.properties
if [ -f "$WRP" ]; then
  sed -i 's#^distributionUrl=.*#distributionUrl=https://services.gradle.org/distributions/gradle-8.9-bin.zip#' "$WRP" || true
fi
{
  echo "org.gradle.jvmargs=-Xmx3g -Dfile.encoding=UTF-8"
  echo "android.useAndroidX=true"
  echo "android.enableJetifier=true"
} >> android/gradle.properties || true

# Optional: Shrink aus (robuster bei Erstbuilds)
sed -i 's/minifyEnabled true/minifyEnabled false/g' android/app/build.gradle || true
sed -i 's/shrinkResources true/shrinkResources false/g' android/app/build.gradle || true

chmod +x android/gradlew

echo "== Gradle assembleRelease =="
pushd android >/dev/null
./gradlew --version || true
./gradlew :app:assembleRelease --no-daemon --stacktrace --info
popd >/dev/null

mkdir -p artifacts

# Unsigned APK aufsammeln (Fallback wenn Signing fehlt)
cp android/app/build/outputs/apk/release/*.apk artifacts/ 2>/dev/null || true

echo "== Optional signieren (wenn Secrets gesetzt) =="
APKU="$(ls android/app/build/outputs/apk/release/*-unsigned.apk 2>/dev/null | head -n1 || true)"
SIGNED_OUT=""
if [[ -n "${ANDROID_KEYSTORE_BASE64:-}" && -n "${ANDROID_KEYSTORE_PASSWORD:-}" && -n "${ANDROID_KEY_ALIAS:-}" && -n "${ANDROID_KEY_PASSWORD:-}" && -n "$APKU" ]]; then
  echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > android/app/release.jks
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
fi

echo "SIGNED=${SIGNED_OUT}" > artifacts/summary.txt
echo "== Fertig =="
ls -lh artifacts || true
