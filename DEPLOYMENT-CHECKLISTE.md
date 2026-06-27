# 📋 DEPLOYMENT-CHECKLISTE & ORDNERSTRUKTUR-ANALYSE

**Datum:** 16. April 2026  
**Status:** Pre-Production Audit  
**Ziel:** Public Server Deployment Readiness

---

## 📁 AKTUELLE ORDNERSTRUKTUR

```
ITH_New/ (Root)
│
├── 📄 HTML-Seiten
│   ├── index.html ........................ ✅ Homepage
│   ├── ueber-uns.html ................... ✅ Team-Seite
│   ├── datenschutz.html ................ ✅ Privacy Policy (noindex)
│   ├── impressum.html .................. ✅ Legal/Imprint (noindex)
│
├── 🎨 CSS & JS
│   ├── styles.css ....................... ✅ Alle Styling (70KB)
│   ├── site.js .......................... ✅ Alle Scripts (vanilla JS)
│
├── 🔍 SEO & Server
│   ├── robots.txt ....................... ✅ Crawl-Direktiven
│   ├── sitemap.xml ...................... ✅ URL-Struktur
│
├── 📚 Dokumentation
│   ├── SEO-AUDIT-REPORT.md ............. ℹ️  (NICHT auf Server)
│
└── 📦 Assets
    └── assets/
        └── images/
            ├── icon.svg ................. ✅ Favicon (16x16, 32x32)
            ├── logo.svg ................. ✅ Brand Logo
            ├── logo-form-w.svg ......... ✅ Form Logo (white)
            ├── start-gruppenbild.jpeg .. ✅ Team Photo (Homepage)
            ├── yannick.jpg .............. ✅ Team Member 1
            └── josh.jpg ................. ✅ Team Member 2
```

---

## ⚠️ DEPLOYMENT-READINESS ANALYSE

### 🔴 **KRITISCH (MUST HAVE)**

#### 1. **OG/Social Media Image FEHLT** ❌
**Problem:** Meta-Tags verweisen auf `/assets/images/og-image.png` → Datei existiert NICHT  
**Auswirkung:** Social Media Previews werden leer angezeigt  
**Lösung:** Erstelle 1200x630px PNG/JPG Logo-Grafik  
**Priorität:** 🔴 KRITISCH (vor Deployment)

```html
<!-- Aktuell in HTML -->
<meta property="og:image" content="https://www.it-happens-gbr.de/assets/images/og-image.png">
```

#### 2. **HTTPS/SSL Zertifikat NICHT vorhanden** ❌
**Problem:** URLs referenzieren `https://` aber kein Cert installiert  
**Auswirkung:** NICHT ERREICHBAR auf Public Server  
**Lösung:** Let's Encrypt SSL (kostenlos, automatisch aktualisiert)  
**Priorität:** 🔴 KRITISCH (vor Deployment)

#### 3. **.htaccess FEHLT** ❌
**Problem:** Keine Server-Konfiguration vorhanden  
**Auswirkung:**
- Keine Sicherheits-Header
- Keine Redirects (http → https)
- Keine Caching-Strategie
- Keine Kompression
- Keine rewrite rules

**Priorität:** 🔴 KRITISCH

#### 4. **Error Pages FEHLEN** ❌
**Problem:** 404, 403, 50x error pages nicht vorhanden  
**Auswirkung:** Generische Server-Error-Seiten, schlechte UX  
**Lösung:** Custom HTML Error Pages  
**Priorität:** 🟠 HOCH

---

### 🟠 **EMPFOHLEN (SHOULD HAVE)**

#### 5. **manifest.json für PWA** ❌
**Für:** Progressive Web App Support  
**Effekt:** App-like experience, offline mode, installierbar  
**Priorität:** 🟡 MITTEL

#### 6. **robots.txt Referenz in .htaccess** ⚠️
**Status:** robots.txt existiert ✅, aber sollte via .htaccess rewrite konfiguriert werden  
**Priorität:** 🟡 MITTEL

#### 7. **sitemap.xml Referenz** ⚠️
**Status:** sitemap.xml existiert ✅, aber muss in robots.txt verlinkt sein ✅  
**Priorität:** 🟢 OK

#### 8. **Docker/Container Config** (optional)
**Falls:** Docker/Kubernetes Deployment geplant  
**Dateien:** Dockerfile, docker-compose.yml  
**Priorität:** 🟡 OPTIONAL (nur bei Container-Deployment)

#### 9. **Version Control** (.gitignore)
**Falls:** Git Repo verwendet  
**Priorität:** 🟡 OPTIONAL

#### 10. **Environment Config** (.env)
**Status:** Nicht nötig (keine DB/API Secrets)  
**Priorität:** 🟢 OK (keine Umgebungsvars erforderlich)

---

## 📊 DEPLOYMENT-READINESS SCORE

| Kategorie | Status | Score |
|-----------|--------|-------|
| HTML-Struktur | ✅ OK | 10/10 |
| CSS/JS Assets | ✅ OK | 10/10 |
| SEO-Setup | ✅ OK | 9/10 |
| Image Assets | ✅ OK | 8/10 (OG-Image fehlt) |
| Security | ❌ FEHLT | 3/10 |
| Server-Config | ❌ FEHLT | 2/10 |
| Error Handling | ❌ FEHLT | 0/10 |
| CDN/Caching | ❌ FEHLT | 0/10 |
| **GESAMT** | **⚠️ BEDINGT OK** | **5.25/10** |

---

## ✅ DEPLOYMENT-CHECKLISTE

### Vor dem Deployment:

#### Phase 1: Assets & Dateien (Do Now)
- [ ] **KRITISCH:** OG-Image erstellen (`/assets/images/og-image.png`)
  - Größe: 1200x630px
  - Format: PNG oder JPG
  - Inhalt: IT Happens Logo + Brand

- [ ] **KRITISCH:** `.htaccess` erstellen
  - HTTP → HTTPS Redirect
  - Security Headers
  - Caching Policy
  - GZIP Kompression
  - Rewrite Rules

- [ ] **HOCH:** Custom Error Pages (404, 403, 500)
  - `/404.html` – 404 Not Found
  - `/403.html` – Forbidden
  - `/500.html` – Server Error

- [ ] **MITTEL:** `manifest.json` für PWA
  - Icons, Name, Beschreibung
  - Theme Color

- [ ] **.gitignore** erstellen (optional)
  ```
  node_modules/
  .env
  .env.local
  *.log
  .DS_Store
  ```

#### Phase 2: Server-Setup (By Hoster)
- [ ] **SSL/TLS Zertifikat** installieren
  - Let's Encrypt kostenfrei
  - Auto-renewal konfigurieren

- [ ] **DocumentRoot** auf `/` setzen
  - Struktur:
    ```
    /home/user/public_html/
    ├── index.html
    ├── .htaccess
    ├── robots.txt
    ├── sitemap.xml
    ├── assets/
    └── ...
    ```

- [ ] **PHP Version** überprüfen
  - Minimum: PHP 7.4+
  - Empfohlen: PHP 8.2+

- [ ] **FTP/SFTP Zugriff** testen
  - Upload aller Dateien

- [ ] **Dateirechte** setzen
  ```
  Directories:  755 (drwxr-xr-x)
  Files:        644 (-rw-r--r--)
  .htaccess:    644
  ```

- [ ] **Nameserver/DNS** aktualisieren
  ```
  A Record: *.it-happens-gbr.de → Server-IP
  CNAME: www → @
  MX Records: (falls Email)
  TXT: SPF, DKIM (falls Email)
  ```

#### Phase 3: Testing (After Upload)
- [ ] URL-Zugriff testen
  ```
  https://www.it-happens-gbr.de/ → ✅ 
  https://it-happens-gbr.de/ → http → https redirect ✅
  http://www.it-happens-gbr.de → https redirect ✅
  ```

- [ ] Seiten-Funktionalität
  - [ ] Homepage lädt → Links funktionieren
  - [ ] Über uns → Bilder laden, Team angezeigt
  - [ ] Datenschutz → Text vollständig
  - [ ] Impressum → Kontakt sichtbar
  - [ ] Header sticky → Mobile responsive ✅

- [ ] Mobile-Test
  - [ ] Responsive Design ✅
  - [ ] Touch-Menü funktioniert ✅
  - [ ] Bilder laden schnell ✅

- [ ] Performance Test
  - [ ] PageSpeed Insights > 90 (mobil)
  - [ ] Core Web Vitals grün
  - [ ] GZIP Kompression aktiv

- [ ] SEO-Validierung
  - [ ] Meta-Tags sichtbar (View Source)
  - [ ] robots.txt erreichbar: `/robots.txt`
  - [ ] sitemap.xml erreichbar: `/sitemap.xml`
  - [ ] Canonical Tags vorhanden
  - [ ] Schema.org Markup valid

- [ ] Security-Checks
  - [ ] SSL-Zertifikat valid (padlock icon)
  - [ ] Security Headers vorhanden (DevTools)
  - [ ] HTTPS enforced (keine Mixed Content)
  - [ ] .htaccess Rules funktionieren

- [ ] Error Handling
  - [ ] `/nonexistent` → 404 Page angezeigt
  - [ ] `/admin` (forbidden) → 403 Page
  - [ ] Server errors → 500 Page

#### Phase 4: Monitoring Setup
- [ ] **Google Search Console**
  - Sitemap einreichen
  - Canonical URLs überprüfen
  - Mobile Usability
  - Index Coverage

- [ ] **Google Analytics 4** (optional)
  - Tracking einrichten
  - Goal/Conversion Tracking
  - E-Mail Alerts

- [ ] **Google My Business** (optional)
  - Lokales Profil
  - Öffnungszeiten
  - Services

- [ ] **Uptime Monitoring** (optional)
  - UptimeRobot oder ähnlich
  - Alert bei Downtime

---

## 🚀 DEPLOYMENT-BEFEHLE (SSH)

### Remote Server Setup
```bash
# 1. Mit Server verbinden
ssh user@server.com

# 2. In Public HTML Folder navigieren
cd ~/public_html/

# 3. Dateien hochladen (via FTP oder Git)
# Option A: FTP
ftp user@server.com
put *.html
put *.js
put *.css
put .htaccess
put robots.txt
put sitemap.xml
mkdir assets/images
cd assets/images
put *.svg
put *.jpg
put *.jpeg

# Option B: Git
git clone https://github.com/user/it-happens-gbr.git .

# 4. Dateirechte setzen
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 644 .htaccess

# 5. .htaccess testen
a2enmod rewrite
a2enmod headers
a2enmod deflate
systemctl restart apache2

# 6. SSL Certificate (Let's Encrypt)
certbot certonly --apache -d it-happens-gbr.de -d www.it-happens-gbr.de
certbot install --apache
```

---

## 🛡️ SICHERHEITS-BEST-PRACTICES

### .htaccess Sicherheits-Header:
```apache
# Disable Directory Listing
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

# X-Frame-Options (Clickjacking Protection)
<IfModule mod_headers.c>
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# HTTP to HTTPS Redirect
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# GZIP Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Caching Policy
<FilesMatch "\.(?:jpg|jpeg|png|gif|ico|svg|js|css)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

---

## 📊 EMPFOHLENE HOSTING-PROVIDER

| Provider | Preis | Features | Rating |
|----------|-------|----------|--------|
| **All-Inkl.com** | 4-10€/mo | ✅ Unlimited, ✅ SSL, ✅ 1-Click CMS | ⭐⭐⭐⭐⭐ |
| **Strato** | 5-12€/mo | ✅ Deutsch, ✅ SSL, ⚠️ Limited | ⭐⭐⭐⭐ |
| **Hetzner** | 4-8€/mo | ✅ Günstig, ✅ Zuverlässig, ⚠️ Minimal Support | ⭐⭐⭐⭐ |
| **HostEurope** | 6-15€/mo | ✅ Professionell, ✅ Support, ⚠️ Teuer | ⭐⭐⭐⭐⭐ |
| **Ionos** | 3-8€/mo | ✅ Billig, ⚠️ Support, ⚠️ Limited | ⭐⭐⭐ |

**Empfehlung für Ihr Setup:** All-Inkl.com oder Hetzner (beste Value)

---

## 📝 NÄCHSTE SCHRITTE

### SOFORT (Vor Deployment):
1. ⚠️ **OG-Image erstellen** (1200x630px PNG)
2. ⚠️ **.htaccess erstellen** (Security + Redirects)
3. ⚠️ **SSL-Zertifikat planen** (Let's Encrypt)

### VORBEREITUNG:
4. Custom Error Pages (404, 403, 500)
5. manifest.json für PWA
6. .gitignore für Git

### DEPLOYMENT:
7. Hosting-Provider auswählen
8. Domain registrieren / auf Server zeigen
9. Dateien hochladen
10. SSL aktivieren
11. Testing durchführen

### POST-DEPLOYMENT:
12. Google Search Console verifyieren
13. Sitemap einreichen
14. Google My Business erstellen
15. Monitoring einrichten

---

## 📞 TECHNISCHER SUPPORT

**Bei Fragen zum Deployment:**
- Email: support@it.happens-gbr.de
- Phone: +49 162 4521571
- WhatsApp: https://wa.me/491624521571

---

**Status:** ⚠️ **PRE-PRODUCTION** – Bereit nach Completion aller Checklisten-Items
