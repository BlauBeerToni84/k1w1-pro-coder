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

echo "== Install cmdline-tools to \$SDK_HOME =="
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
if npm run | grep -qE '^[[:space:]]*build[[:space:]]'; then npm run build; fi

echo "== Capacitor Android project =="
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android
chmod +x android/gradlew || true

echo "== Gradle build =="
pushd android >/dev/null
set +e
./gradlew :app:assembleRelease --no-daemon --stacktrace --info
RC=$?
set -e
if [ $RC -ne 0 ]; then
  echo "Release build failed, trying assembleDebug..."
  ./gradlew :app:assembleDebug --no-daemon --stacktrace --info
fi
popd >/dev/null

echo "== Collect artifacts =="
mkdir -p artifacts

# sammle alles, was da ist (signed/unsigned/debug)
APKS=()
SIGNED="$(ls android/app/build/outputs/apk/release/*-signed*.apk 2>/dev/null | head -n1 || true)"
[ -n "$SIGNED" ] && APKS+=("$SIGNED")
UNSIGNED="$(ls android/app/build/outputs/apk/release/*-unsigned*.apk 2>/dev/null | head -n1 || true)"
[ -n "$UNSIGNED" ] && APKS+=("$UNSIGNED")
DEBUGAPK="$(ls android/app/build/outputs/apk/debug/*.apk 2>/dev/null | head -n1 || true)"
[ -n "$DEBUGAPK" ] && APKS+=("$DEBUGAPK")

if [ ${#APKS[@]} -eq 0 ]; then
  echo "No APKs found under android/app/build/outputs. See buildlog.txt." >&2
  exit 1
fi

for A in "${APKS[@]}"; do
  cp -f "$A" artifacts/
done

echo "Artifacts:"
ls -lh artifacts
