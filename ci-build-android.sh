#!/usr/bin/env bash
set -euo pipefail

echo "== Env =="
node -v || true
java -version || true
pwd; ls -la

# --- Variablen / Defaults ---
: "${ANDROID_SDK_ROOT:="${RUNNER_TEMP:-/tmp}/android-sdk"}"
export ANDROID_SDK_ROOT
DEFAULT_BT_VER="35.0.0"

echo "== Install Android SDK CLI =="
mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"
cd "${RUNNER_TEMP:-/tmp}"
curl -sSLo cmdline.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q cmdline.zip
mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
mv cmdline-tools/* "$ANDROID_SDK_ROOT/cmdline-tools/latest/"

export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/build-tools/$DEFAULT_BT_VER:$PATH"
yes | sdkmanager --licenses >/dev/null
sdkmanager "platform-tools" "build-tools;${DEFAULT_BT_VER}"

echo "== npm build =="
if [ -f package-lock.json ]; then
  npm ci
else
  npm i
fi
if npm run | grep -qE '^\s*build\s'; then
  npm run build
fi

echo "== Capacitor Android-Projekt =="
if [ ! -d android ]; then
  npx cap add android
fi
npx cap sync android

echo "== Ziel-CompileSdk & Build-Tools aus Gradle ermitteln =="
PLATFORM_API="$(grep -Eho 'compileSdk(?:Version)?\s*=?\s*[0-9]+' android/app/build.gradle android/variables.gradle 2>/dev/null | grep -Eo '[0-9]+' | head -n1 || echo 35)"
REQ_BT="$(grep -Eho 'buildToolsVersion\s*"[0-9.]+"' android/app/build.gradle 2>/dev/null | grep -Eo '[0-9.]+' | head -n1 || echo ${DEFAULT_BT_VER})"
echo "compileSdk=${PLATFORM_API}, buildTools=${REQ_BT}"
sdkmanager "platforms;android-${PLATFORM_API}" >/dev/null
sdkmanager "build-tools;${REQ_BT}" >/dev/null || true
export PATH="$ANDROID_SDK_ROOT/build-tools/${REQ_BT}:$PATH"

echo "== Gradle-Flags setzen (AndroidX/Jetifier, Memory) =="
{
  echo "org.gradle.jvmargs=-Xmx3g -Dfile.encoding=UTF-8"
  echo "android.useAndroidX=true"
  echo "android.enableJetifier=true"
} >> android/gradle.properties

# Wrapper nur hochziehen, wenn noch Gradle 7.x
WRP=android/gradle/wrapper/gradle-wrapper.properties
if [ -f "$WRP" ]; then
  CUR="$(grep -o 'gradle-[0-9][0-9.]*-bin.zip' "$WRP" | sed -E 's/gradle-([0-9.]+)-bin.zip/\1/')"
  MAJOR="${CUR%%.*}"
  if [ -n "${MAJOR:-}" ] && [ "$MAJOR" -lt 8 ]; then
    sed -i 's#^distributionUrl=.*#distributionUrl=https://services.gradle.org/distributions/gradle-8.7-bin.zip#' "$WRP" || true
  fi
fi
chmod +x android/gradlew

echo "== Build :app:assembleRelease =="
pushd android >/dev/null
./gradlew --version || true
./gradlew :app:assembleRelease --no-daemon --stacktrace --info
popd >/dev/null

echo "== Artefakte sammeln =="
mkdir -p artifacts
cp android/app/build/outputs/apk/release/*.apk artifacts/ 2>/dev/null || true

echo "== Optional signieren (wenn Secrets gesetzt) =="
SIGNED_OUT=""
if [[ -n "${ANDROID_KEYSTORE_BASE64:-}" && -n "${ANDROID_KEYSTORE_PASSWORD:-}" && -n "${ANDROID_KEY_ALIAS:-}" && -n "${ANDROID_KEY_PASSWORD:-}" ]]; then
  echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > android/app/release.jks
  APKU="$(ls android/app/build/outputs/apk/release/*-unsigned.apk 2>/dev/null | head -n1 || true)"
  if [ -z "$APKU" ]; then
    APKU="$(ls artifacts/*.apk 2>/dev/null | head -n1 || true)"
  fi
  if [ -n "$APKU" ]; then
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
else
  echo "Keine Signatur-Secrets gefunden – unsigned APK bleibt erhalten."
fi

echo "== Summary =="
ls -lh artifacts || true
if [ -n "$SIGNED_OUT" ]; then
  echo "SIGNED=$SIGNED_OUT" > artifacts/summary.txt
else
  echo "SIGNED=" > artifacts/summary.txt
fi
