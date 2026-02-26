# Panduan Hosting dan Integrasi WordPress

## 📋 Daftar Isi
1. [Persiapan File](#persiapan-file)
2. [Pilihan Hosting](#pilihan-hosting)
3. [Upload ke Hosting](#upload-ke-hosting)
4. [Integrasi dengan WordPress](#integrasi-dengan-wordpress)
5. [Troubleshooting](#troubleshooting)

---

## 1. Persiapan File

### File yang Perlu Di-Upload:
```
├── index.html (halaman utama/login)
├── pidum.html
├── pra-penuntutan.html
├── penuntutan.html
├── upaya-hukum.html
├── eksekusi.html
├── tppu.html
├── wna.html
├── hukuman-mati.html
├── korban.html
├── detail-*.html (semua file detail)
├── iframe-embed.html (untuk embedding)
├── .htaccess (konfigurasi server)
├── css/ (folder)
├── js/ (folder)
└── README.md
```

### Compress File (Opsional):
Untuk upload lebih cepat, compress semua file menjadi ZIP:
```bash
# Di terminal/command prompt
zip -r dashboard-pidum.zip . -x "*.git*" "node_modules/*"
```

---

## 2. Pilihan Hosting

### A. Hosting Gratis (Untuk Testing)
1. **Netlify** (Recommended)
   - URL: https://www.netlify.com
   - Gratis, cepat, support custom domain
   - Cara: Drag & drop folder atau connect GitHub

2. **Vercel**
   - URL: https://vercel.com
   - Gratis, sangat cepat
   - Cara: Import dari GitHub atau upload folder

3. **GitHub Pages**
   - URL: https://pages.github.com
   - Gratis, reliable
   - Cara: Push ke repository GitHub

### B. Hosting Berbayar (Untuk Production)
1. **Shared Hosting** (Niagahoster, Hostinger, Rumahweb)
   - Rp 20.000 - 50.000/bulan
   - Support cPanel
   - Cocok untuk website statis

2. **VPS** (DigitalOcean, Vultr, AWS)
   - Lebih fleksibel dan powerful
   - Butuh konfigurasi server

---

## 3. Upload ke Hosting

### Metode A: Via cPanel (Shared Hosting)

1. **Login ke cPanel**
   - Buka: https://namadomain.com/cpanel
   - Masukkan username & password

2. **Buka File Manager**
   - Cari menu "File Manager"
   - Masuk ke folder `public_html` atau `www`

3. **Upload File**
   - Klik tombol "Upload"
   - Pilih file ZIP yang sudah dibuat
   - Tunggu sampai selesai upload

4. **Extract File**
   - Klik kanan pada file ZIP
   - Pilih "Extract"
   - Pilih folder tujuan (biasanya public_html)

5. **Set Permissions**
   - Pilih semua file
   - Klik "Permissions"
   - Set ke 644 untuk file, 755 untuk folder

### Metode B: Via FTP (FileZilla)

1. **Download FileZilla**
   - URL: https://filezilla-project.org

2. **Connect ke Server**
   - Host: ftp.namadomain.com
   - Username: [dari hosting]
   - Password: [dari hosting]
   - Port: 21

3. **Upload File**
   - Drag & drop semua file dari local ke remote
   - Tunggu sampai selesai

### Metode C: Via Netlify (Paling Mudah)

1. **Buat Akun Netlify**
   - Daftar di https://app.netlify.com/signup

2. **Deploy Website**
   - Klik "Add new site" > "Deploy manually"
   - Drag & drop folder project
   - Tunggu deploy selesai

3. **Custom Domain (Opsional)**
   - Klik "Domain settings"
   - Add custom domain
   - Update DNS di registrar domain

---

## 4. Integrasi dengan WordPress

### Metode 1: Iframe Sederhana (Recommended)

Tambahkan kode ini di halaman/post WordPress:

```html
<iframe 
    src="https://dashboard.kejati-kepri.com/iframe-embed.html" 
    width="100%" 
    height="800px" 
    frameborder="0" 
    style="border: none; min-height: 800px;"
    allowfullscreen>
</iframe>

<script>
// Auto-resize iframe berdasarkan konten
window.addEventListener('message', function(e) {
    if (e.data.height) {
        document.querySelector('iframe').style.height = e.data.height + 'px';
    }
});
</script>
```

### Metode 2: Iframe dengan Shortcode

Tambahkan di `functions.php` theme WordPress:

```php
// Tambahkan shortcode untuk dashboard
function dashboard_pidum_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800px',
        'url' => 'https://dashboard.kejati-kepri.com/iframe-embed.html'
    ), $atts);
    
    return '<div class="dashboard-container">
        <iframe 
            src="' . esc_url($atts['url']) . '" 
            width="100%" 
            height="' . esc_attr($atts['height']) . '" 
            frameborder="0" 
            style="border: none; min-height: ' . esc_attr($atts['height']) . ';"
            allowfullscreen>
        </iframe>
    </div>';
}
add_shortcode('dashboard_pidum', 'dashboard_pidum_shortcode');
```

Gunakan di halaman WordPress:
```
[dashboard_pidum height="900px"]
```

### Metode 3: Full Page Template

Buat file `template-dashboard.php` di theme WordPress:

```php
<?php
/*
Template Name: Dashboard Pidum
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Pidum - <?php bloginfo('name'); ?></title>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        iframe { width: 100%; height: 100vh; border: none; display: block; }
    </style>
</head>
<body>
    <iframe 
        src="https://dashboard.kejati-kepri.com/iframe-embed.html"
        allowfullscreen>
    </iframe>
</body>
</html>
```

### Metode 4: Plugin Iframe

Install plugin WordPress:
- **Iframe** by webvitaly
- **Advanced iFrame** by Michael Dempfle

Kemudian gunakan shortcode:
```
[iframe src="https://dashboard.kejati-kepri.com/iframe-embed.html" width="100%" height="800"]
```

---

## 5. Troubleshooting

### Problem: Iframe tidak muncul / blank

**Solusi:**
1. Pastikan file `.htaccess` sudah di-upload
2. Cek browser console (F12) untuk error
3. Pastikan URL dashboard bisa diakses langsung
4. Cek X-Frame-Options di response header

### Problem: Login tidak berfungsi di iframe

**Solusi:**
1. Pastikan localStorage berfungsi
2. Cek cookie settings di browser
3. Gunakan `iframe-embed.html` sebagai entry point

### Problem: Styling berantakan

**Solusi:**
1. Pastikan semua file CSS ter-upload
2. Cek path CSS di HTML (relative path)
3. Clear browser cache

### Problem: CORS Error

**Solusi:**
1. Tambahkan header CORS di `.htaccess`
2. Atau tambahkan di server config (nginx/apache)
3. Pastikan domain WordPress dan dashboard sama (atau whitelist)

### Problem: Slow loading

**Solusi:**
1. Enable compression di `.htaccess`
2. Minify CSS/JS files
3. Gunakan CDN untuk assets
4. Optimize images

---

## 📝 Checklist Deployment

- [ ] Semua file sudah di-upload
- [ ] File `.htaccess` sudah di-upload
- [ ] Website bisa diakses langsung via URL
- [ ] Login berfungsi normal
- [ ] Semua halaman bisa diakses
- [ ] Charts/grafik muncul dengan benar
- [ ] Data bisa disimpan (localStorage)
- [ ] Iframe berfungsi di WordPress
- [ ] Responsive di mobile
- [ ] Performance test (loading speed)

---

## 🔗 URL yang Perlu Dicatat

1. **URL Dashboard**: https://dashboard.kejati-kepri.com
2. **URL Iframe**: https://dashboard.kejati-kepri.com/iframe-embed.html
3. **URL WordPress**: https://kejati-kepri.com
4. **Halaman WordPress dengan Dashboard**: https://kejati-kepri.com/dashboard-pidum

---

## 📞 Support

Jika ada masalah:
1. Cek browser console (F12) untuk error
2. Cek server error logs
3. Test di browser berbeda
4. Contact hosting support jika server issue

---

## 🎯 Rekomendasi

Untuk website Kejati yang profesional:

1. **Gunakan Hosting Berbayar** (Niagahoster/Hostinger)
   - Lebih stabil dan cepat
   - Support 24/7
   - Custom domain

2. **Setup SSL Certificate** (HTTPS)
   - Gratis via Let's Encrypt
   - Penting untuk keamanan

3. **Backup Rutin**
   - Backup database (localStorage data)
   - Backup files
   - Gunakan plugin backup WordPress

4. **Monitoring**
   - Setup uptime monitoring
   - Google Analytics untuk tracking
   - Error logging

---

**Selamat mencoba! 🚀**
