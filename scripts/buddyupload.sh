#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

REPORT_GLOBS=("$@")
if [ ${#REPORT_GLOBS[@]} -eq 0 ]; then
  REPORT_GLOBS=(reports/*.xml reports/**/*.xml)
fi

if [[ -z "${BUDDY_UT_TOKEN:-}" ]]; then
  echo "BUDDY_UT_TOKEN nicht gesetzt – Buddy-Upload wird übersprungen."
  exit 0
fi

ensure_bdy() {
  if command -v bdy >/dev/null 2>&1; then return 0; fi
  echo "bdy nicht gefunden – versuche Installation (non-fatal)..."
  (curl -fsSL https://es.buddy.works/bdy/install.sh | bash && echo "$HOME/.buddy/bin" >> "$GITHUB_PATH" 2>/dev/null) || true
  export PATH="$HOME/.buddy/bin:$PATH"
  command -v bdy >/dev/null 2>&1 && return 0
  (curl -fsSL https://get.buddy.works/bdy/install.sh | bash) || true
  export PATH="$HOME/.buddy/bin:$PATH"
  command -v bdy >/dev/null 2>&1
}

if ! ensure_bdy; then
  echo "bdy weiterhin nicht gefunden – Buddy-Upload wird übersprungen."
  exit 0
fi

uploaded=0
for glob in "${REPORT_GLOBS[@]}"; do
  for f in $glob; do
    echo "Buddy-Upload: $f"
    if bdy tests upload --format junit-xml "$f"; then
      uploaded=$((uploaded+1))
    else
      echo "WARN: Upload fehlgeschlagen für $f" >&2
    fi
  done
done

echo "Buddy-Upload abgeschlossen – $uploaded Datei(en) hochgeladen."
