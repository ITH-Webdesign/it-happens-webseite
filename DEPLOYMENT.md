# 📖 DEPLOYMENT GUIDE – IT Happens GbR Website

**Version:** 1.0  
**Last Updated:** April 16, 2026  
**Status:** Production Ready

---

## ⚡ Quick Start

```bash
# 1. Download/Clone Project
git clone https://github.com/your-repo/it-happens-gbr.git
cd it-happens-gbr

# 2. Upload via FTP to Server
# Upload all files to public_html/

# 3. Set File Permissions
chmod 755 .
find . -type f -exec chmod 644 {} \;
chmod 755 assets/images

# 4. Verify SSL & DNS
# Test: https://it-happens-gbr.de

# 5. Test Website
# Open browser: https://www.it-happens-gbr.de
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Critical Items (MUST HAVE)
- [ ] **SSL/TLS Certificate** installed
  ```bash
  certbot certonly --apache -d it-happens-gbr.de
  ```
- [ ] **OG Image** created (1200x630px)
  - Save as: `/assets/images/og-image.png`
- [ ] **DNS Records** pointing to server
  ```
  A Record: it-happens-gbr.de → [SERVER_IP]
  A Record: www.it-happens-gbr.de → [SERVER_IP]
  ```
- [ ] **.htaccess** configured (included)
- [ ] **Apache Modules** enabled
  ```bash
  sudo a2enmod rewrite
  sudo a2enmod headers
  sudo a2enmod deflate
  sudo systemctl restart apache2
  ```

### Recommended Items
- [ ] Security audit (SSL Labs)
- [ ] Performance test (PageSpeed Insights)
- [ ] SEO validation (Search Console)

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### STEP 1: Prepare Server
```bash
# SSH into server
ssh user@server.com

# Navigate to public_html
cd ~/public_html

# Create subdirectory (optional)
mkdir -p it-happens-gbr
cd it-happens-gbr
```

### STEP 2: Upload Files
**Option A: FTP**
```bash
# Using FileZilla, WinSCP, or similar:
# 1. Connect with FTP details
# 2. Drag & drop all files to remote server
# 3. Verify all files uploaded
```

**Option B: Git**
```bash
# Clone from repository
git clone https://github.com/your-repo/it-happens-gbr.git .

# Or pull latest updates
git pull origin main
```

**Option C: SCP/Rsync**
```bash
# Upload all files
rsync -avz --exclude='.git' ./ user@server:/home/user/public_html/

# Verify upload
ssh user@server "ls -la ~/public_html/"
```

### STEP 3: Set File Permissions
```bash
# SSH into server
ssh user@server.com
cd ~/public_html

# Set directory permissions (755 = rwxr-xr-x)
find . -type d -exec chmod 755 {} \;

# Set file permissions (644 = rw-r--r--)
find . -type f -exec chmod 644 {} \;

# Special: .htaccess (must be 644)
chmod 644 .htaccess

# Verify
ls -la | grep drwx
```

### STEP 4: Configure Server
```bash
# Enable Apache modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod expires

# Enable SSL
sudo a2enmod ssl

# Restart Apache
sudo systemctl restart apache2

# Check status
sudo systemctl status apache2
```

### STEP 5: Setup SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-apache

# Generate certificate
sudo certbot certonly --apache -d it-happens-gbr.de -d www.it-happens-gbr.de

# Auto-renewal setup
sudo certbot renew --dry-run

# Verify certificate
sudo ls -la /etc/letsencrypt/live/it-happens-gbr.de/
```

### STEP 6: Configure Virtual Host (Apache)
```bash
# Edit virtual host config
sudo nano /etc/apache2/sites-available/it-happens-gbr.conf
```

```apache
<VirtualHost *:80>
    ServerName it-happens-gbr.de
    ServerAlias www.it-happens-gbr.de
    ServerAdmin support@it-happens-gbr.de
    
    DocumentRoot /home/user/public_html
    
    # Redirect HTTP to HTTPS (handled by .htaccess)
    
    <Directory /home/user/public_html>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>
    
    # Error & Custom logs
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

<VirtualHost *:443>
    ServerName it-happens-gbr.de
    ServerAlias www.it-happens-gbr.de
    ServerAdmin support@it-happens-gbr.de
    
    DocumentRoot /home/user/public_html
    
    <Directory /home/user/public_html>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>
    
    # SSL Certificates (Let's Encrypt)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/it-happens-gbr.de/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/it-happens-gbr.de/privkey.pem
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    
    # HSTS header (optional, careful)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

```bash
# Enable site
sudo a2ensite it-happens-gbr.conf

# Test config
sudo apache2ctl configtest

# Should output: Syntax OK

# Restart
sudo systemctl restart apache2
```

---

## 🧪 TESTING & VALIDATION

### Test 1: Website Access
```bash
# Test HTTP redirect
curl -I http://it-happens-gbr.de
# Should show 301 redirect to HTTPS

# Test HTTPS
curl -I https://it-happens-gbr.de
# Should show 200 OK

# Test non-www redirect
curl -I https://www.it-happens-gbr.de
# Should show 200 OK
```

### Test 2: File Permissions
```bash
# Check .htaccess readable
curl https://it-happens-gbr.de/.htaccess
# Should show 403 Forbidden (good - hidden)

# Check robots.txt accessible
curl https://it-happens-gbr.de/robots.txt
# Should show robots.txt content
```

### Test 3: Error Pages
```bash
# Test 404 error
curl https://it-happens-gbr.de/nonexistent
# Should show custom 404.html

# Test SSL certificate
openssl s_client -connect it-happens-gbr.de:443
# Should show valid certificate
```

### Test 4: Performance
```bash
# Check GZIP compression
curl -I -H "Accept-Encoding: gzip" https://it-happens-gbr.de/styles.css
# Should show: Content-Encoding: gzip

# Check caching headers
curl -I https://it-happens-gbr.de/site.js
# Should show: Cache-Control: max-age=31536000
```

### Test 5: Security
```bash
# Check security headers
curl -I https://it-happens-gbr.de/ | grep -i "X-Frame\|X-Content\|CSP"

# Should show:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
```

### Online Testing Tools
1. **SSL Certificate Check**
   - https://www.ssllabs.com/ssltest/
   - Target: it-happens-gbr.de
   - Expected: Grade A or A+

2. **Performance Test**
   - https://pagespeed.web.dev/
   - Target: https://it-happens-gbr.de
   - Expected: >90 score (mobile & desktop)

3. **SEO Validation**
   - https://search.google.com/test/mobile-friendly
   - Target: https://it-happens-gbr.de
   - Expected: Mobile Friendly ✅

4. **Schema.org Validation**
   - https://validator.schema.org/
   - Paste source code
   - Expected: No errors

---

## 🔧 TROUBLESHOOTING

### Issue: HTTPS Not Working
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Check Apache SSL config
sudo apache2ctl -D DUMP_VHOSTS

# Check error logs
sudo tail -f /var/log/apache2/error.log
```

### Issue: .htaccess Not Working
```bash
# Check rewrite module
sudo a2enmod rewrite

# Test syntax
sudo apache2ctl configtest

# Check DirectoryIndex
sudo grep -r "DirectoryIndex" /etc/apache2/

# Restart Apache
sudo systemctl restart apache2
```

### Issue: Slow Performance
```bash
# Check GZIP compression
sudo a2enmod deflate

# Check caching
sudo a2enmod expires

# Monitor CPU/Memory
top
free -h

# Check Apache processes
ps aux | grep apache
```

### Issue: High Bandwidth Usage
```bash
# Check log file size
du -sh /var/log/apache2/

# Compress old logs
gzip /var/log/apache2/*.log

# Setup log rotation
sudo nano /etc/logrotate.d/apache2

# Monitor traffic
tail -f /var/log/apache2/access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn
```

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks
```bash
# Check uptime
uptime

# Check disk space
df -h

# Check error logs
sudo tail -n 20 /var/log/apache2/error.log

# Monitor connections
netstat -an | grep ESTABLISHED | wc -l
```

### Weekly Tasks
- [ ] Backup website files
- [ ] Review error logs
- [ ] Check SSL certificate expiry
- [ ] Monitor bandwidth usage

### Monthly Tasks
- [ ] Update Apache modules
- [ ] Review access patterns
- [ ] Check Google Search Console
- [ ] Update content if needed

### Semi-Annual Tasks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Database cleanup (if using DB)
- [ ] SSL certificate check

---

## 📦 BACKUP & RESTORE

### Create Backup
```bash
# Backup website
cd /home/user
tar -czf backup-it-happens-gbr-$(date +%Y%m%d).tar.gz public_html/

# Backup databases (if any)
mysqldump -u root -p database_name > backup-db-$(date +%Y%m%d).sql

# Move to safe location
cp backup-*.tar.gz /backup/
```

### Restore from Backup
```bash
# Stop Apache
sudo systemctl stop apache2

# Restore files
cd /home/user
tar -xzf backup-it-happens-gbr-20260416.tar.gz

# Restore database (if applicable)
mysql -u root -p database_name < backup-db-20260416.sql

# Start Apache
sudo systemctl start apache2

# Verify
curl -I https://it-happens-gbr.de
```

---

## 🔐 SECURITY HARDENING

### Essential Security Steps
```bash
# 1. Setup UFW Firewall
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 2. Fail2Ban for SSH Protection
sudo apt-get install fail2ban
sudo systemctl enable fail2ban

# 3. Disable unnecessary services
sudo systemctl disable telnet
sudo systemctl disable ftp

# 4. Update system
sudo apt-get update
sudo apt-get upgrade

# 5. Configure automatic updates
sudo apt-get install unattended-upgrades
```

---

## 📞 SUPPORT & CONTACT

**Questions about deployment?**
- Email: support@it.happens-gbr.de
- Phone: +49 162 4521571
- WhatsApp: https://wa.me/491624521571

---

## 📝 DEPLOYMENT CHECKLIST (Copy & Paste)

```
Pre-Deployment:
- [ ] SSL certificate installed
- [ ] OG image created (1200x630px)
- [ ] DNS records configured
- [ ] .htaccess reviewed
- [ ] All files ready for upload

Deployment:
- [ ] Files uploaded via FTP/Git
- [ ] File permissions set (755/644)
- [ ] Apache modules enabled
- [ ] Virtual host configured
- [ ] SSL enabled

Post-Deployment:
- [ ] HTTPS working (test with curl)
- [ ] 404/403/500 pages showing
- [ ] Caching headers correct (check with curl -I)
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Security headers present
- [ ] Performance >90 (PageSpeed)
- [ ] SSL Grade A+ (SSL Labs)
- [ ] Mobile-friendly (Google Test)
- [ ] Schema.org valid

Monitoring:
- [ ] Error logs checked
- [ ] Backup created
- [ ] Monitoring setup (UptimeRobot, etc)
- [ ] Google Search Console access
- [ ] Google Analytics working
```

---

**Status:** ✅ **Ready for Production Deployment**
