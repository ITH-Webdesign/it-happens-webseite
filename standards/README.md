# Standards Hub

Dieser Ordner ist die zentrale Quelle fuer wiederholbare Kundenprojekte.
Ziel: gleiche Qualitaet, nachvollziehbare Entscheidungen, pruefbare Ergebnisse.

## Inhalt

- `MASTER-GUIDELINE.md`: verbindliche Regeln fuer Aufbau, SEO, Sicherheit, Deployment.
- `checklists/GO-LIVE-CHECKLIST.md`: Freigabe-Checkliste vor Livegang.
- `templates/PULL_REQUEST_TEMPLATE.md`: inhaltlicher PR-Standard fuer Teamarbeit.
- `ai/AI-IMPLEMENTATION-PLAYBOOK.md`: feste Arbeitsanweisung fuer KI-Assistenten.
- `ci/seo-guard.sh`: technische Checks fuer PRs und main.

## Arbeitsweise

1. Projekt startet mit den Regeln aus `MASTER-GUIDELINE.md`.
2. Jede Aenderung laeuft ueber Pull Request.
3. Vor Merge: CI muss gruen sein.
4. Vor Deployment: `GO-LIVE-CHECKLIST.md` vollstaendig abhaken.

## Definition of Done (kurz)

- URL-Strategie ist konsistent (Canonical, Sitemap, interne Links, Redirects).
- Basisdateien sind korrekt (`.htaccess`, `robots.txt`, `sitemap.xml`, Fehlerseiten).
- Technische Checks sind gruen.
- PR ist sauber dokumentiert und reviewed.
