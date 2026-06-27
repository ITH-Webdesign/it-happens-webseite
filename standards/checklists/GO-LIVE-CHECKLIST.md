# Go-Live Checklist

## A. URL und Redirects

- [ ] Kanonische Domain ist festgelegt.
- [ ] `http://` leitet auf `https://` (301).
- [ ] `index.html` leitet auf `/` (301).
- [ ] `.html` leitet auf extensionless URL (301), falls Konzept genutzt wird.
- [ ] Extensionless URL liefert `200`.
- [ ] Keine Redirect-Ketten > 1 Hop.

## B. SEO-Signale

- [ ] Jede Seite hat einen korrekten Canonical-Link.
- [ ] `og:url` ist konsistent zur kanonischen URL.
- [ ] `sitemap.xml` enthaelt nur kanonische URLs.
- [ ] `robots.txt` verweist auf die korrekte Sitemap.

## C. Sicherheit und Files

- [ ] `.htaccess` mit Basis-Schutz aktiv.
- [ ] Fehlerseiten 403/404/500 vorhanden und erreichbar.
- [ ] Interne Doku-Dateien sind nicht oeffentlich erreichbar.
- [ ] Keine Secrets im Repository.

## D. Qualitaet

- [ ] CI-Workflow ist gruen.
- [ ] PR wurde reviewed und freigegeben.
- [ ] Deployment-Schritte dokumentiert.
- [ ] Rollback-Plan ist bekannt.

## E. Search Console

- [ ] `sitemap.xml` neu eingereicht.
- [ ] Kern-URLs per URL-Pruefung getestet.
- [ ] Bei wichtigen Seiten: "Indexierung beantragen" ausgefuehrt.
