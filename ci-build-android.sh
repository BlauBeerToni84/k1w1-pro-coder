#!/usr/bin/env bash
set -euxo pipefail

echo "== Env =="
node -v || true
java -version || true
pwd; ls -la

# --- Android SDK (lokal im Runner) ---
SDK_HOME="${RUNNER_TEMP:-/tmp}/android-sdk-local"
export ANDROID_SDK_ROOT="$SDK_HOME"
BT_VER="35.0.0"
PLATFORM_API="35"

echo "== Install cmdline-tools to $SDK_HOME =="
rm -rf "$SDK_HOME/cmdline-tools/latest"
mkdir -p "$SDK_HOME/cmdline-tools"
cd "${RUNNER_TEMP:-/tmp}"
curl -sSLo cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q -o cmdline-tools.zip
mkdir -p "$SDK_HOME/cmdline-tools/latest"
mv cmdline-tools/* "$SDK_HOME/cmdline-tools/latest/"

# PATH nur auf unser lokales SDK zeigen
export PATH="$SDK_HOME/cmdline-tools/latest/bin:$SDK_HOME/platform-tools:$SDK_HOME/build-tools/$BT_VER:$PATH"

yes | sdkmanager --sdk_root="$SDK_HOME" --licenses >/dev/null
sdkmanager --sdk_root="$SDK_HOME" "platform-tools" "platforms;android-${PLATFORM_API}" "build-tools;${BT_VER}" >/dev/null

echo "== npm install/build =="
if [ -f package-lock.json ]; then npm ci; else npm i; fi
if npm run | grep -qE '^[[:space:]]*build([[:space:]]|$)'; then npm run build; fi

echo "== Capacitor Android project =="
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android
chmod +x android/gradlew || true

echo "== Gradle assembleRelease =="
pushd android >/dev/null
set +e
./gradlew --version || true
./gradlew :app:assembleRelease --no-daemon --stacktrace --info
RC=$?
set -e
popd >/dev/null
if [ $RC -ne 0 ]; then
  echo "Release build failed (RC=$RC), trying assembleDebug..."
  pushd android >/dev/null
  ./gradlew :app:assembleDebug --no-daemon --stacktrace --info
  popd >/dev/null
fi

echo "== Collect artifacts =="
mkdir -p artifacts

# Prefer signed release, dann unsigned, dann debug
SIGNED_APK="$(ls android/app/build/outputs/apk/release/*-signed*.apk 2>/dev/null | head -n1 || true)"
UNSIGNED_APK="$(ls android/app/build/outputs/apk/release/*-unsigned*.apk 2>/dev/null | head -n1 || true)"
RELEASE_APK="$(ls android/app/build/outputs/apk/release/*.apk 2>/dev/null | grep -v unsigned | head -n1 || true)"
DEBUG_APK="$(ls android/app/build/outputs/apk/debug/*.apk 2>/dev/null | head -n1 || true)"

for A in "$SIGNED_APK" "$RELEASE_APK" "$UNSIGNED_APK" "$DEBUG_APK"; do
  [ -n "${A:-}" ] && [ -f "$A" ] && cp -f "$A" artifacts/
done

if ! ls -1 artifacts/*.apk >/dev/null 2>&1; then
  echo "No APKs found under android/app/build/outputs. See buildlog.txt." >&2
  exit 1
fi

echo "Artifacts ready:"
ls -lh artifacts
