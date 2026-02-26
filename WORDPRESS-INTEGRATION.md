# 🔗 Integrasi Dashboard Pidum dengan WordPress

Panduan lengkap untuk mengintegrasikan Dashboard Pidum ke website WordPress Kejati Kepulauan Riau.

---

## 📋 Persiapan

### Yang Anda Butuhkan:
1. ✅ Website WordPress yang sudah aktif
2. ✅ Akses admin WordPress
3. ✅ Dashboard Pidum sudah di-hosting (lihat HOSTING-GUIDE.md)
4. ✅ URL dashboard (contoh: https://dashboard.kejati-kepri.com)

---

## 🚀 Metode Integrasi (Pilih Salah Satu)

### Metode 1: Shortcode Sederhana (PALING MUDAH) ⭐

**Langkah-langkah:**

1. **Login ke WordPress Admin**
   - Buka: https://kejati-kepri.com/wp-admin
   - Masukkan username & password

2. **Buat Halaman Baru**
   - Klik "Pages" > "Add New"
   - Judul: "Dashboard Pidum"

3. **Tambahkan Shortcode**
   - Pilih block "Shortcode" atau "Custom HTML"
   - Copy-paste kode berikut:

```html
<iframe 
    src="https://dashboard.kejati-kepri.com/iframe-embed.html" 
    width="100%" 
    height="900px" 
    frameborder="0" 
    style="border: none; min-height: 900px; display: block;"
    allowfullscreen>
</iframe>

<style>
    /* Hide WordPress elements untuk tampilan full */
    .site-header, .site-footer { display: none !important; }
    .entry-content { padding: 0 !important; margin: 0 !important; }
    body { margin: 0 !important; }
</style>
```

4. **Publish Halaman**
   - Klik "Publish"
   - Buka halaman untuk melihat hasilnya

---

### Metode 2: Custom Functions (LEBIH FLEKSIBEL) ⭐⭐

**Langkah-langkah:**

1. **Edit functions.php**
   - Buka "Appearance" > "Theme Editor"
   - Pilih "functions.php"
   - Scroll ke paling bawah

2. **Tambahkan Kode Berikut:**

```php
// Dashboard Pidum Shortcode
function dashboard_pidum_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '900px',
        'url' => 'https://dashboard.kejati-kepri.com/iframe-embed.html'
    ), $atts);
    
    return '<div class="dashboard-pidum-container">
        <iframe 
            src="' . esc_url($atts['url']) . '" 
            width="100%" 
            height="' . esc_attr($atts['height']) . '" 
            frameborder="0" 
            style="border: none; min-height: ' . esc_attr($atts['height']) . '; display: block;"
            allowfullscreen>
        </iframe>
    </div>';
}
add_shortcode('dashboard_pidum', 'dashboard_pidum_shortcode');
```

3. **Update File**
   - Klik "Update File"

4. **Gunakan Shortcode di Halaman**
   - Buat halaman baru
   - Tambahkan shortcode: `[dashboard_pidum]`
   - Atau dengan custom height: `[dashboard_pidum height="1000px"]`

---

### Metode 3: Full Page Template (PALING PROFESIONAL) ⭐⭐⭐

**Langkah-langkah:**

1. **Upload Template File**
   - Download file `template-dashboard-pidum.php`
   - Upload ke folder theme WordPress Anda via FTP/cPanel
   - Path: `/wp-content/themes/[nama-theme]/template-dashboard-pidum.php`

2. **Buat Halaman Baru**
   - Login WordPress Admin
   - Klik "Pages" > "Add New"
   - Judul: "Dashboard Pidum"

3. **Pilih Template**
   - Di sidebar kanan, cari "Page Attributes"
   - Pada dropdown "Template", pilih "Dashboard Pidum (Full Width)"
   - Publish halaman

4. **Edit URL Dashboard**
   - Buka file `template-dashboard-pidum.php`
   - Cari baris: `src="https://dashboard.kejati-kepri.com/iframe-embed.html"`
   - Ganti dengan URL dashboard Anda
   - Save file

---

### Metode 4: Plugin Iframe (PALING CEPAT)

**Langkah-langkah:**

1. **Install Plugin**
   - Buka "Plugins" > "Add New"
   - Search: "Advanced iFrame"
   - Install & Activate

2. **Buat Halaman Baru**
   - Klik "Pages" > "Add New"
   - Judul: "Dashboard Pidum"

3. **Tambahkan Shortcode**
```
[advanced_iframe src="https://dashboard.kejati-kepri.com/iframe-embed.html" width="100%" height="900"]
```

4. **Publish**

---

## 🎨 Customization

### Mengubah Tinggi Iframe

**Metode 1 (HTML):**
```html
<iframe height="1000px" ...>
```

**Metode 2 (Shortcode):**
```
[dashboard_pidum height="1000px"]
```

### Full Width (Tanpa Sidebar)

Tambahkan CSS berikut di "Appearance" > "Customize" > "Additional CSS":

```css
/* Full width untuk halaman dashboard */
.page-template-template-dashboard-pidum .site-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
}

.page-template-template-dashboard-pidum .content-area {
    width: 100% !important;
    margin: 0 !important;
}

.page-template-template-dashboard-pidum .entry-content {
    padding: 0 !important;
    margin: 0 !important;
}

/* Hide header & footer (optional) */
.page-template-template-dashboard-pidum .site-header,
.page-template-template-dashboard-pidum .site-footer {
    display: none !important;
}
```

### Responsive Mobile

```css
/* Responsive untuk mobile */
@media (max-width: 768px) {
    .dashboard-pidum-container iframe {
        height: 600px !important;
        min-height: 600px !important;
    }
}
```

---

## 🔧 Troubleshooting

### Problem 1: Iframe Tidak Muncul

**Penyebab:**
- Plugin security memblokir iframe
- Theme tidak support iframe

**Solusi:**
1. Disable plugin security sementara
2. Tambahkan kode ini di functions.php:
```php
add_filter('wp_kses_allowed_html', function($tags) {
    $tags['iframe'] = array(
        'src' => true,
        'width' => true,
        'height' => true,
        'frameborder' => true,
        'allowfullscreen' => true,
        'style' => true
    );
    return $tags;
}, 10, 2);
```

### Problem 2: Blank/White Screen

**Solusi:**
1. Cek URL dashboard bisa diakses langsung
2. Pastikan file `.htaccess` sudah di-upload di hosting dashboard
3. Clear browser cache (Ctrl+F5)
4. Cek browser console (F12) untuk error

### Problem 3: Scrollbar Ganda

**Solusi:**
Tambahkan CSS:
```css
body.page-template-template-dashboard-pidum {
    overflow: hidden !important;
}
```

### Problem 4: Slow Loading

**Solusi:**
1. Gunakan lazy loading:
```html
<iframe loading="lazy" ...>
```

2. Atau tambahkan loading indicator (sudah ada di `iframe-embed.html`)

---

## 📱 Menu Navigation

### Tambah Link Dashboard ke Menu WordPress

1. **Buka Menu Editor**
   - "Appearance" > "Menus"

2. **Tambah Custom Link**
   - URL: `/dashboard-pidum` (atau URL halaman dashboard)
   - Link Text: "Dashboard Pidum"
   - Klik "Add to Menu"

3. **Save Menu**

---

## 🔐 Proteksi Halaman (Optional)

### Membuat Halaman Dashboard Private

**Metode 1: WordPress Built-in**
1. Edit halaman dashboard
2. Di "Publish" box, klik "Edit" di samping "Visibility"
3. Pilih "Private" atau "Password Protected"
4. Update halaman

**Metode 2: Plugin**
Install plugin "Password Protected" atau "Members"

---

## 🎯 Best Practices

### 1. Performance
- ✅ Gunakan CDN untuk hosting dashboard
- ✅ Enable caching di WordPress
- ✅ Compress images di dashboard
- ✅ Minify CSS/JS files

### 2. Security
- ✅ Gunakan HTTPS untuk dashboard
- ✅ Set proper CORS headers
- ✅ Backup data secara rutin
- ✅ Update WordPress & plugins

### 3. User Experience
- ✅ Tambahkan loading indicator
- ✅ Responsive design untuk mobile
- ✅ Clear navigation
- ✅ Error handling

---

## 📊 Testing Checklist

Sebelum go-live, pastikan:

- [ ] Dashboard bisa diakses langsung via URL
- [ ] Iframe muncul di WordPress
- [ ] Login berfungsi normal
- [ ] Semua halaman bisa diakses
- [ ] Charts/grafik muncul
- [ ] Data bisa disimpan
- [ ] Responsive di mobile
- [ ] Loading speed < 3 detik
- [ ] No console errors
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)

---

## 🆘 Support

Jika mengalami masalah:

1. **Cek Browser Console**
   - Tekan F12
   - Lihat tab "Console" untuk error

2. **Cek WordPress Debug**
   - Edit `wp-config.php`
   - Set: `define('WP_DEBUG', true);`

3. **Contact Support**
   - Hosting support untuk server issues
   - WordPress support untuk theme/plugin issues

---

## 📝 Contoh Implementasi

### Contoh 1: Halaman Dashboard Sederhana

```html
<!-- Di WordPress Page Editor -->
<div style="width: 100%; margin: 0; padding: 0;">
    <iframe 
        src="https://dashboard.kejati-kepri.com/iframe-embed.html"
        width="100%"
        height="900px"
        frameborder="0"
        allowfullscreen>
    </iframe>
</div>
```

### Contoh 2: Dashboard dengan Header

```html
<div class="dashboard-wrapper">
    <div class="dashboard-header" style="background: #0f3460; color: white; padding: 20px; text-align: center;">
        <h1>Dashboard Pidum</h1>
        <p>Kejaksaan Tinggi Kepulauan Riau</p>
    </div>
    
    <iframe 
        src="https://dashboard.kejati-kepri.com/iframe-embed.html"
        width="100%"
        height="850px"
        frameborder="0"
        allowfullscreen>
    </iframe>
</div>
```

### Contoh 3: Multiple Dashboards

```html
<!-- Tab Navigation -->
<div class="dashboard-tabs">
    <button onclick="showDashboard('pidum')">Dashboard Pidum</button>
    <button onclick="showDashboard('other')">Dashboard Lain</button>
</div>

<!-- Dashboard Pidum -->
<div id="dashboard-pidum" class="dashboard-content">
    <iframe src="https://dashboard.kejati-kepri.com/iframe-embed.html" width="100%" height="900px"></iframe>
</div>

<!-- Dashboard Lain -->
<div id="dashboard-other" class="dashboard-content" style="display: none;">
    <iframe src="https://other-dashboard.com" width="100%" height="900px"></iframe>
</div>

<script>
function showDashboard(id) {
    document.querySelectorAll('.dashboard-content').forEach(el => el.style.display = 'none');
    document.getElementById('dashboard-' + id).style.display = 'block';
}
</script>
```

---

## 🎉 Selesai!

Dashboard Pidum Anda sekarang sudah terintegrasi dengan WordPress!

**Next Steps:**
1. Test semua fitur
2. Train user untuk menggunakan dashboard
3. Setup backup rutin
4. Monitor performance

**Butuh bantuan?** Hubungi tim IT Kejati Kepulauan Riau.

---

**Good luck! 🚀**
