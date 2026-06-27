# AI Implementation Playbook

Nutze diese Regeln fuer konsistente Kundenprojekte.

## Arbeitsreihenfolge

1. Kontext lesen: `.htaccess`, `robots.txt`, `sitemap.xml`, betroffene HTML-Seiten.
2. Ziel-URL-Strategie festhalten (host, schema, extensionless ja/nein).
3. Aenderungen immer signal-konsistent umsetzen:
   - interne Links
   - Canonical
   - `og:url`
   - Sitemap
   - Redirect-Regeln
4. Nach Aenderungen pruefen:
   - keine widerspruechlichen URL-Signale
   - keine ungewollt oeffentlichen Dokumente
   - Fehlerseiten weiterhin vorhanden
5. Abschluss immer mit Testliste + Risiken.

## Verbotene Muster

- Mixed canonical forms (mit/ohne `.html` gemischt)
- Sitemap zeigt nicht-kanonische URLs
- Globale Sperre in `robots.txt` auf Live
- Redirect von vielen Seiten stumpf auf `/`, wenn passenderes Ziel existiert

## Pflichtausgabe im PR

- geaenderte Dateien
- erwartetes URL-Verhalten (301/200)
- SEO-Auswirkung
- Testnachweise
