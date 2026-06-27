# Master Guideline fuer Kundenwebseiten

## 1. Zielbild

Jedes Projekt folgt derselben Architektur, denselben SEO-Signalen und denselben Freigabe-Regeln.

## 2. Verbindliche URL-Strategie

1. Eine kanonische Host-Variante festlegen (z. B. `https://it.happens-gbr.de`).
2. HTTP -> HTTPS per 301.
3. WWW-Variante sauber auf die kanonische Host-Variante leiten (falls technisch vorhanden).
4. `index.html` -> `/` per 301.
5. Falls ohne Dateiendung gearbeitet wird:
   - `.html` -> extensionless URL per 301.
   - extensionless URL intern auf `.html` umschreiben.
6. Keine widerspruechlichen Signale in Canonical, Sitemap und internen Links.

## 3. Pflichtdateien im Webroot

- `.htaccess`
- `robots.txt`
- `sitemap.xml`
- `403.html`, `404.html`, `500.html`
- Hauptseiten (`index.html`, Leistungsseiten, Rechtstexte)
- `assets/`, CSS, JS

## 4. Nicht in Produktion veroeffentlichen

- interne Markdown-Dokumente (`README.md`, Deploy-Notizen, Audit-Reports)
- Build-/Tooling-Reste
- lokale Konfigurationsdateien mit internem Kontext

Hinweis: Falls Dokumente deployt werden, in `.htaccess` zusaetzlich blocken.

## 5. Canonical-, OG- und Sitemap-Regeln

1. Jede indexierbare Seite hat genau einen Canonical-Link.
2. Canonical zeigt immer auf die kanonische URL-Form.
3. `og:url` entspricht der kanonischen URL.
4. `sitemap.xml` listet nur kanonische, indexierbare URLs.
5. `lastmod` nur bei echten Inhaltsaenderungen aktualisieren.

## 6. .htaccess Mindestanforderungen

- RewriteEngine aktiv
- HTTPS Redirect
- optional Host-Kanonisierung (www/non-www)
- index Redirect
- optionale extensionless-Logik
- ErrorDocument Mapping fuer 403/404/500
- Block fuer sensible Dateien (mind. Dotfiles, `.env`, `.md`)

## 7. robots.txt Mindestanforderungen

- `User-agent: *`
- klare `Disallow`-Regeln
- `Sitemap:` mit kanonischer URL
- keine unbeabsichtigte globale Sperre (`Disallow: /`) auf Live

## 8. Ordnerstruktur (Standard)

- Webroot: Seiten, SEO-Dateien, Fehlerseiten
- `assets/images`: Bilder
- `assets/icons` oder bestehender Icon-Bereich
- `standards/`: Regeln, Checklisten, KI-Playbook, CI-Skripte
- `.github/workflows`: CI-Regeln

## 9. Teamprozess

1. Kein Direkt-Push auf `main`.
2. Jede Arbeit ueber Feature-Branch + Pull Request.
3. Mindestens 1 Review vor Merge.
4. PR muss die Checkliste/Ergebnisse enthalten.

## 10. Definition of Done (voll)

- Architektur und URLs konsistent
- Redirect-Matrix geprueft
- CI gruen
- manuelle Livechecks durchgefuehrt
- Go-live-Checkliste vollstaendig
- Rollback-Weg dokumentiert
