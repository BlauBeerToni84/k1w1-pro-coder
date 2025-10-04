#!/usr/bin/env bash
set -Eeuo pipefail

missing=0
created=0
fix=${1:-}

green(){ printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }
red(){ printf "\033[31m%s\033[0m\n" "$*"; }

note(){ printf "• %s\n" "$*"; }

mk_test(){
  local path="$1"; shift
  if [ -f "$path" ]; then
    note "OK  $path"
  else
    yellow "MISS $path"
    missing=$((missing+1))
    if [ "$fix" = "--fix" ]; then
      printf "%s\n" "$*" > "$path"
      green "ADD  $path"
      created=$((created+1))
    fi
  fi
}

# ---- Tests, die wir prüfen/ggf. ergänzen ----
mk_test cypress/e2e/health.cy.ts "// created by helper
describe('health', () => {
  it('GET / responds 200/304', () => {
    cy.request('/').its('status').should('be.oneOf', [200, 304])
  })
})"

mk_test cypress/e2e/console.cy.ts "// created by helper
describe('console hygiene', () => {
  it('no console.error / warn on first load', () => {
    const errors:string[] = [], warns:string[] = []
    cy.on('window:before:load', (win:any) => {
      const e = win.console.error.bind(win.console)
      const w = win.console.warn.bind(win.console)
      win.console.error = (...a:any[]) => { errors.push(a.join(' ')); e(...a) }
      win.console.warn  = (...a:any[]) => { warns.push(a.join(' '));  w(...a) }
    })
    cy.visit('/')
    cy.then(() => {
      expect(errors, 'console.error').to.have.length(0)
      expect(warns,  'console.warn').to.have.length(0)
    })
  })
})"

mk_test cypress/e2e/viewport.cy.ts "// created by helper
const mounted = () =>
  cy.get('#root, main, [data-testid=\"app\"],[data-cy=\"app\"]',{timeout:10_000}).should('exist')

describe('viewport mounts', () => {
  it('mobile 375x812', () => { cy.viewport(375,812); cy.visit('/'); mounted() })
  it('desktop 1280x800', () => { cy.viewport(1280,800); cy.visit('/'); mounted() })
})"

mk_test cypress/e2e/routing.cy.ts "// created by helper
describe('routing unknown path', () => {
  it('renders app & not 500', () => {
    cy.request({url:'/__cypress_unknown__', failOnStatusCode:false})
      .its('status').should('be.oneOf',[200,301,302,404])
    cy.visit('/__cypress_unknown__', { failOnStatusCode:false })
    cy.get('#root, main, [data-testid=\"app\"],[data-cy=\"app\"]',{timeout:10_000}).should('exist')
  })
})"

# ---- Cypress-Konfig nur prüfen (nicht überschreiben) ----
if [ -f cypress.config.ts ]; then
  echo "— Cypress config check —"
  for k in "experimentalMemoryManagement" "numTestsKeptInMemory" "video" "retries" "defaultCommandTimeout"; do
    if grep -q "$k" cypress.config.ts; then
      note "OK  $k in cypress.config.ts"
    else
      yellow "MISS $k in cypress.config.ts"
      missing=$((missing+1))
      if [ "$fix" = "--fix" ]; then
        # sanft ergänzen (oberhalb e2e-Block)
        node - <<'NODE'
const fs=require('fs'),p='cypress.config.ts';
let s=fs.readFileSync(p,'utf8');
function ensure(line){
  const esc=line.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if(!new RegExp('^\\s*'+esc,'m').test(s)){
    s=s.replace(/defineConfig\\(\\{\\s*/m,(m)=>m+'  '+line+'\\n');
    console.log('  +',line);
  }
}
ensure('experimentalMemoryManagement: true,');
ensure('numTestsKeptInMemory: 0,');
ensure('video: false,');
ensure('retries: { runMode: 2, openMode: 0 },');
ensure('defaultCommandTimeout: 8000,');
fs.writeFileSync(p,s);
NODE
        green "FIX cypress.config.ts ergänzt"
      fi
    fi
  done
else
  yellow "MISS cypress.config.ts (Konfig nicht gefunden)"
  missing=$((missing+1))
fi

# ---- package.json Scripts nur prüfen ----
echo "— package.json scripts check —"
node - <<'NODE' || { echo "⚠️  package.json konnte nicht gelesen werden"; exit 0; }
const fs=require('fs');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const want=['cy:run','test:e2e','test:fast'];
for(const k of want){
  if(pkg.scripts && pkg.scripts[k]) console.log('OK  script',k);
  else console.log('MISS script',k);
}
NODE

# Zusammenfassung
echo
if [ "$fix" = "--fix" ]; then
  echo "✅ Check+Fix fertig — $created Dateien neu angelegt."
else
  if [ "$missing" -gt 0 ]; then
    red  "❗ Es fehlen $missing Punkte. (mit '--fix' automatisch ergänzen)"
    exit 2
  else
    green "✅ Alles vorhanden."
  fi
fi
