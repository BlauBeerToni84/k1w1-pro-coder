#!/usr/bin/env bash
set -euxo pipefail

echo "== Env =="
node -v || true
java -version || true
pwd; ls -la

# --- Android SDK ---
: "${ANDROID_SDK_ROOT:=${ANDROID_HOME:-/usr/local/lib/android/sdk}}"
export ANDROID_SDK_ROOT
BT_VER="35.0.0"
PLATFORM_API="35"

# PATH früh setzen
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/cmdline-tools/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/build-tools/$BT_VER:$PATH"

echo "== Ensure cmdline-tools/sdkmanager =="
if [ ! -x "$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]; then
  echo "Installing Android cmdline-tools into: $ANDROID_SDK_ROOT"
  mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"
  cd "${RUNNER_TEMP:-/tmp}"
  curl -sSLo cmdline.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  unzip -q -o cmdline.zip
  rm -rf "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  mv cmdline-tools/* "$ANDROID_SDK_ROOT/cmdline-tools/latest/"
else
  echo "sdkmanager present at: $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager"
fi

yes | sdkmanager --licenses >/dev/null
sdkmanager "platform-tools" "platforms;android-${PLATFORM_API}" "build-tools;${BT_VER}"

echo "== npm install/build =="
if [ -f package-lock.json ]; then npm ci; else npm i; fi
# falls es ein build-script gibt
if npm run | grep -qE '^\s*build\b'; then npm run build; fi

echo "== Capacitor Android project =="
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android
chmod +x android/gradlew || true

echo "== Gradle assembleRelease =="
pushd android >/dev/null
./gradlew :app:assembleRelease --no-daemon --stacktrace --info
popd >/dev/null

echo "== Collect & optional sign =="
mkdir -p artifacts

UNSIGNED_APK="$(ls android/app/build/outputs/apk/release/*-unsigned.apk 2>/dev/null | head -n1 || true)"
SIGNED_APK_BUILT="$(ls android/app/build/outputs/apk/release/app-release.apk 2>/dev/null | head -n1 || true)"
DEBUG_APK="$(ls android/app/build/outputs/apk/debug/*.apk 2>/dev/null | head -n1 || true)"

SIGN_OUT=""
if [[ -n "${ANDROID_KEYSTORE_BASE64:-}" && -n "${ANDROID_KEYSTORE_PASSWORD:-}" && -n "${ANDROID_KEY_ALIAS:-}" && -n "${ANDROID_KEY_PASSWORD:-}" && -n "${UNSIGNED_APK:-}" ]]; then
  echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > android/app/release.jks
  BT="$ANDROID_SDK_ROOT/build-tools/$BT_VER"
  "$BT/zipalign" -p -f 4 "$UNSIGNED_APK" artifacts/app-release-aligned.apk
  "$BT/apksigner" sign \
    --ks android/app/release.jks \
    --ks-pass "pass:${ANDROID_KEYSTORE_PASSWORD}" \
    --ks-key-alias "${ANDROID_KEY_ALIAS}" \
    --key-pass "pass:${ANDROID_KEY_PASSWORD}" \
    --out artifacts/app-release-signed.apk \
    artifacts/app-release-aligned.apk
  "$BT/apksigner" verify --print-certs artifacts/app-release-signed.apk
  rm -f artifacts/app-release-aligned.apk
  SIGN_OUT="artifacts/app-release-signed.apk"
fi

# Alles einsammeln, damit immer ein Artefakt existiert
if [ -n "$SIGN_OUT" ]; then
  echo "Signed APK: $SIGN_OUT"
elif [ -n "$SIGNED_APK_BUILT" ]; then
  cp -f "$SIGNED_APK_BUILT" artifacts/
elif [ -n "$UNSIGNED_APK" ]; then
  cp -f "$UNSIGNED_APK" artifacts/
else
  echo "No release APK found, building debug as fallback..."
  pushd android >/dev/null
  ./gradlew :app:assembleDebug --no-daemon --stacktrace --info
  popd >/dev/null
  DEBUG_APK="$(ls android/app/build/outputs/apk/debug/*.apk 2>/dev/null | head -n1 || true)"
  if [ -n "$DEBUG_APK" ]; then
    cp -f "$DEBUG_APK" artifacts/
  else
    echo "No APK produced at all." >&2
    exit 1
  fi
fi

echo "== Done =="
ls -lah artifacts || true
