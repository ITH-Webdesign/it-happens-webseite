#!/usr/bin/env bash
set -euo pipefail

failures=0

fail() {
  echo "[FAIL] $1"
  failures=$((failures + 1))
}

pass() {
  echo "[OK] $1"
}

require_file() {
  local f="$1"
  if [[ -f "$f" ]]; then
    pass "Datei vorhanden: $f"
  else
    fail "Datei fehlt: $f"
  fi
}

echo "Running SEO/infra guard..."

# Required files
require_file ".htaccess"
require_file "robots.txt"
require_file "sitemap.xml"
require_file "403.html"
require_file "404.html"
require_file "500.html"

# .htaccess baseline checks
if grep -qi "RewriteEngine On" .htaccess; then pass ".htaccess RewriteEngine"; else fail ".htaccess: RewriteEngine fehlt"; fi
if grep -qi "ErrorDocument 404" .htaccess; then pass ".htaccess ErrorDocument 404"; else fail ".htaccess: ErrorDocument 404 fehlt"; fi
if grep -qi "ErrorDocument 500" .htaccess; then pass ".htaccess ErrorDocument 500"; else fail ".htaccess: ErrorDocument 500 fehlt"; fi
if grep -qi "ErrorDocument 403" .htaccess; then pass ".htaccess ErrorDocument 403"; else fail ".htaccess: ErrorDocument 403 fehlt"; fi
if grep -qiE "\\.md\\$" .htaccess; then pass ".htaccess blockt .md"; else fail ".htaccess: .md-Block fehlt"; fi

# robots baseline
if grep -qi "^User-agent:\s*\*" robots.txt; then pass "robots User-agent"; else fail "robots.txt: User-agent * fehlt"; fi
if grep -qi "^Sitemap:\s*https://" robots.txt; then pass "robots Sitemap URL"; else fail "robots.txt: Sitemap URL fehlt/ungueltig"; fi
if grep -qiE "^Disallow:\s*/\s*$" robots.txt; then fail "robots.txt sperrt gesamte Website (Disallow: /)"; else pass "robots sperrt nicht global"; fi

# sitemap baseline
if grep -qi "<urlset" sitemap.xml; then pass "sitemap urlset"; else fail "sitemap.xml: <urlset> fehlt"; fi
if grep -q "<loc>http://" sitemap.xml; then fail "sitemap.xml enthaelt http:// URLs"; else pass "sitemap nutzt https"; fi
if grep -qE "<loc>https?://[^<]+\\.html</loc>" sitemap.xml; then fail "sitemap.xml enthaelt .html URLs"; else pass "sitemap ohne .html URLs"; fi

# HTML canonical and local .html link checks
shopt -s nullglob
for f in *.html; do
  # Canonical is only required for indexable content pages.
  if [[ "$f" == "403.html" || "$f" == "404.html" || "$f" == "500.html" || "$f" == googledab*.html ]]; then
    pass "$f canonical check skipped (utility page)"
  else
    if [[ "$f" == "index.html" ]]; then
      if grep -qE 'rel="canonical" href="https://it\.happens-gbr\.de/"' "$f"; then
        pass "$f canonical root"
      else
        fail "$f: canonical root fehlt/abweichend"
      fi
    else
      if grep -qE 'rel="canonical" href="https://it\.happens-gbr\.de/[^"]+\.html"' "$f"; then
        fail "$f: canonical endet auf .html"
      elif grep -qE 'rel="canonical" href="https://it\.happens-gbr\.de/[^"]+"' "$f"; then
        pass "$f canonical extensionless"
      else
        fail "$f: canonical fehlt/ungueltig"
      fi
    fi
  fi

  if grep -qE 'href="(https://it\.happens-gbr\.de/[^"#?]+\.html|[a-zA-Z0-9_-]+\.html)"' "$f"; then
    fail "$f: lokale .html Links gefunden"
  else
    pass "$f ohne lokale .html Links"
  fi
done

if [[ $failures -gt 0 ]]; then
  echo "\nSEO guard failed with $failures issue(s)."
  exit 1
fi

echo "\nSEO guard passed."
