#!/usr/bin/env bash
set -euxo pipefail

echo "== Env =="
node -v || true
java -version || true
pwd; ls -la

# --- Variablen ---
: "${ANDROID_SDK_ROOT:=${ANDROID_HOME:-/usr/local/lib/android/sdk}}"
export ANDROID_SDK_ROOT
BT_VER="35.0.0"
PLATFORM_API="35"

echo "== Ensure cmdline-tools/sdkmanager =="
if ! command -v sdkmanager >/dev/null 2>&1; then
  echo "Installing Android cmdline-tools into: $ANDROID_SDK_ROOT"
  mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"
  cd "${RUNNER_TEMP:-/tmp}"
  curl -sSLo cmdline.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  rm -rf "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  unzip -q cmdline.zip
  mv cmdline-tools/* "$ANDROID_SDK_ROOT/cmdline-tools/latest/"
else
  echo "sdkmanager found at: $(command -v sdkmanager)"
fi

export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/build-tools/$BT_VER:$PATH"
yes | sdkmanager --licenses >/dev/null
sdkmanager "platform-tools" "platforms;android-${PLATFORM_API}" "build-tools;${BT_VER}"

echo "== npm build =="
if [ -f package-lock.json ]; then npm ci; else npm i; fi
if npm run | grep -qE '(^|[[:space:]])build([[:space:]]|:)'; then npm run build; fi

echo "== Capacitor Android-Projekt =="
rm -rf android
npx cap add android
npx cap sync android

echo "== Gradle/AGP Tweaks =="
sed -i 's#^distributionUrl=.*#distributionUrl=https\://services.gradle.org/distributions/gradle-8.9-bin.zip#' android/gradle/wrapper/gradle-wrapper.properties || true
{
  echo "org.gradle.jvmargs=-Xmx3g -Dfile.encoding=UTF-8"
  echo "android.useAndroidX=true"
  echo "android.enableJetifier=true"
} >> android/gradle.properties

echo "== Assemble release =="
pushd android >/dev/null
./gradlew :app:assembleRelease --no-daemon --stacktrace --info
popd >/dev/null

echo "== Collect artifacts =="
mkdir -p artifacts
UNSIGNED_APK=$(ls android/app/build/outputs/apk/release/*-unsigned.apk 2>/dev/null | head -n1 || true)
FALLBACK_APK=$(ls android/app/build/outputs/apk/release/app-release*.apk 2>/dev/null | head -n1 || true)

if [[ -n "${ANDROID_KEYSTORE_BASE64:-}" && -n "${ANDROID_KEYSTORE_PASSWORD:-}" && -n "${ANDROID_KEY_ALIAS:-}" && -n "${ANDROID_KEY_PASSWORD:-}" && -n "$UNSIGNED_APK" ]]; then
  echo "Signing APK with build-tools $BT_VER..."
  echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > android/app/release.jks
  BT="$ANDROID_SDK_ROOT/build-tools/$BT_VER"
  "$BT/zipalign" -p -f 4 "$UNSIGNED_APK" artifacts/app-release-aligned.apk
  "$BT/apksigner" sign \
    --ks android/app/release.jks \
    --ks-key-alias "$ANDROID_KEY_ALIAS" \
    --ks-pass pass:"$ANDROID_KEYSTORE_PASSWORD" \
    --key-pass pass:"$ANDROID_KEY_PASSWORD" \
    --out artifacts/app-release-signed.apk \
    artifacts/app-release-aligned.apk
  "$BT/apksigner" verify --print-certs artifacts/app-release-signed.apk
else
  if [[ -n "$UNSIGNED_APK" ]]; then
    cp "$UNSIGNED_APK" artifacts/
  elif [[ -n "$FALLBACK_APK" ]]; then
    cp "$FALLBACK_APK" artifacts/
  else
    echo "ERROR: Gradle hat keine APK erzeugt." >&2
    exit 1
  fi
fi

echo "== Done =="
ls -lh artifacts || true
