# Dashboard Pidum - Kejaksaan Tinggi Kepulauan Riau

Sistem manajemen data Pidana Umum berbasis web untuk Kejaksaan Tinggi Kepulauan Riau.

## 📋 Daftar Isi

- [Struktur File](#struktur-file)
- [Fitur](#fitur)
- [Cara Menjalankan Lokal](#cara-menjalankan-lokal)
- [Hosting & WordPress Integration](#hosting--wordpress-integration)
- [Dokumentasi](#dokumentasi)

## 📁 Struktur File

```
dashboard-pidum/
├── index.html                      # Halaman login
├── pidum.html                      # Dashboard utama
├── pra-penuntutan.html            # Halaman Pra Penuntutan
├── penuntutan.html                # Halaman Penuntutan
├── upaya-hukum.html               # Halaman Upaya Hukum
├── eksekusi.html                  # Halaman Eksekusi
├── tppu.html                      # Halaman TPPU
├── wna.html                       # Halaman WNA
├── hukuman-mati.html              # Halaman Hukuman Mati
├── korban.html                    # Halaman Korban
├── detail-*.html                  # Halaman detail untuk setiap section
├── iframe-embed.html              # Entry point untuk WordPress iframe
├── .htaccess                      # Konfigurasi server Apache
├── css/                           # Folder stylesheet
│   ├── style.css
│   ├── login.css
│   ├── display.css
│   └── ...
├── js/                            # Folder JavaScript
│   ├── app.js
│   ├── auth.js
│   ├── pra-penuntutan.js
│   └── ...
├── HOSTING-GUIDE.md               # 📖 Panduan hosting lengkap
├── WORDPRESS-INTEGRATION.md       # 📖 Panduan integrasi WordPress
├── QUICK-START.md                 # ⚡ Panduan cepat (15 menit)
├── wordpress-integration.php      # 🔧 Kode PHP untuk WordPress
├── template-dashboard-pidum.php   # 🎨 Template WordPress full width
├── wordpress-shortcode-example.txt # 📝 Contoh kode siap pakai
└── README.md                      # Dokumentasi ini
```

## 🚀 Cara Menjalankan Lokal

### Metode 1: Langsung di Browser
Buka file `index.html` langsung di browser (double-click)

### Metode 2: Local Server (Recommended)

```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan PHP
php -S localhost:8000

# Atau menggunakan Node.js
npx serve .
```

Kemudian akses: `http://localhost:8000`

**Login Default:**
- Username: `admin`
- Password: `admin123`

---

## 🌐 Hosting & WordPress Integration

### Quick Start (15 Menit)

Lihat panduan lengkap di **[QUICK-START.md](QUICK-START.md)**

### Pilihan Hosting:

#### 1. GitHub + Netlify (RECOMMENDED) ⭐⭐⭐
- Auto-deploy saat update code
- Gratis, unlimited bandwidth
- Custom domain support
- Panduan: [GITHUB-DEPLOYMENT.md](GITHUB-DEPLOYMENT.md)

#### 2. GitHub Pages (Gratis Selamanya) ⭐⭐
- Hosting gratis dari GitHub
- HTTPS otomatis
- Custom domain support
- Panduan: [GITHUB-DEPLOYMENT.md](GITHUB-DEPLOYMENT.md)

#### 3. Netlify Manual Deploy ⭐
- Drag & drop folder
- Deploy dalam 1 menit
- Panduan: [HOSTING-GUIDE.md](HOSTING-GUIDE.md)

#### 4. cPanel (Hosting Berbayar)
- Upload via File Manager/FTP
- Full control
- Panduan: [HOSTING-GUIDE.md](HOSTING-GUIDE.md)

### Iframe Sederhana

```html
<iframe 
    src="https://dashboard.kejati-kepri.com/iframe-embed.html" 
    width="100%" 
    height="900px" 
    frameborder="0" 
    allowfullscreen>
</iframe>
```

### WordPress Shortcode

Tambahkan ke `functions.php`:

```php
<?php
function dashboard_pidum_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '900px',
        'url' => 'https://dashboard.kejati-kepri.com/iframe-embed.html'
    ), $atts);
    
    return '<iframe 
        src="' . esc_url($atts['url']) . '" 
        width="100%" 
        height="' . esc_attr($atts['height']) . '" 
        frameborder="0" 
        allowfullscreen>
    </iframe>';
}
add_shortcode('dashboard_pidum', 'dashboard_pidum_shortcode');
?>
```

Gunakan di halaman: `[dashboard_pidum]`

---

## ✨ Fitur

### Dashboard & Navigasi
- ✅ Sistem login dengan autentikasi
- ✅ Dashboard utama dengan 8 menu section
- ✅ Sidebar collapsible & responsive
- ✅ Greeting dinamis berdasarkan waktu

### Filter & Data Management
- ✅ 6 Filter: Wilayah Hukum, Satuan Kerja 1 & 2, Tahun, Bulan Awal & Akhir
- ✅ Kelola Tahun & Satuan Kerja dinamis
- ✅ Auto-save data (localStorage)
- ✅ Keyboard shortcut: Ctrl+S untuk simpan

### 8 Section Data
1. **Pra Penuntutan** - SPDP, P-16, P-17, Pengembalian, SP3, Tahap I
2. **Penuntutan** - Tahap II, Pelimpahan, Tuntutan
3. **Upaya Hukum** - Banding, Kasasi, PK
4. **Eksekusi** - Eksekusi putusan
5. **TPPU** - Tindak Pidana Pencucian Uang
6. **WNA** - Warga Negara Asing
7. **Hukuman Mati** - Data hukuman mati
8. **Korban** - Data korban (Perempuan & Anak)

### Charts & Visualisasi
- ✅ Line charts untuk trend bulanan
- ✅ Bar charts untuk data per direktorat
- ✅ Auto-update charts berdasarkan input
- ✅ Responsive charts (Chart.js)

### Detail Pages
- ✅ Halaman detail untuk setiap section
- ✅ Filter data berdasarkan kriteria
- ✅ Cards untuk quick stats
- ✅ Charts untuk visualisasi

### WordPress Integration
- ✅ Iframe-ready dengan loading indicator
- ✅ CORS headers configured
- ✅ Responsive untuk embed
- ✅ Template & shortcode siap pakai

## 📖 Dokumentasi

| File | Deskripsi |
|------|-----------|
| [GITHUB-DEPLOYMENT.md](GITHUB-DEPLOYMENT.md) | 🚀 Deploy menggunakan GitHub (RECOMMENDED!) |
| [QUICK-START.md](QUICK-START.md) | ⚡ Panduan cepat 15 menit |
| [HOSTING-GUIDE.md](HOSTING-GUIDE.md) | 📦 Panduan hosting lengkap |
| [WORDPRESS-INTEGRATION.md](WORDPRESS-INTEGRATION.md) | 🔗 Panduan integrasi WordPress |
| [wordpress-shortcode-example.txt](wordpress-shortcode-example.txt) | 📝 Contoh kode siap pakai |
| [wordpress-integration.php](wordpress-integration.php) | 🔧 Kode PHP untuk functions.php |
| [template-dashboard-pidum.php](template-dashboard-pidum.php) | 🎨 Template WordPress full width |
| [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) | ✅ Checklist deployment lengkap |
| [SUMMARY-HOSTING-WORDPRESS.md](SUMMARY-HOSTING-WORDPRESS.md) | 📋 Ringkasan semua file |

## 📝 Catatan Penting

### Data Storage
- Data disimpan di **localStorage** browser (per perangkat/browser)
- Setiap kombinasi filter memiliki data tersendiri
- Data bersifat lokal, tidak tersinkronisasi antar perangkat
- Untuk penyimpanan terpusat, perlu integrasi dengan database backend

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (Limited support)

### Security
- Login credentials disimpan di localStorage
- Untuk production, gunakan backend authentication
- Enable HTTPS untuk keamanan

## 🆘 Troubleshooting

### Dashboard tidak muncul di WordPress
- Pastikan URL dashboard bisa diakses langsung
- Cek file `.htaccess` sudah di-upload
- Clear browser cache (Ctrl+F5)

### Login tidak berfungsi
- Pastikan localStorage enabled di browser
- Coba incognito/private mode
- Cek browser console (F12) untuk error

### Charts tidak muncul
- Pastikan Chart.js ter-load dengan benar
- Cek browser console untuk error
- Refresh halaman (F5)

### Data hilang
- Data tersimpan di localStorage browser
- Clear cache/cookies akan menghapus data
- Backup data secara manual jika perlu

## 📞 Support

**Dokumentasi:**
- Baca file HOSTING-GUIDE.md untuk panduan hosting
- Baca file WORDPRESS-INTEGRATION.md untuk integrasi WordPress
- Baca file QUICK-START.md untuk panduan cepat

**Kontak:**
- Email: it@kejati-kepri.go.id
- Website: https://kejati-kepri.go.id

## 📄 License

© 2026 Kejaksaan Tinggi Kepulauan Riau. All rights reserved.

---

**Dibuat dengan ❤️ untuk Kejaksaan Tinggi Kepulauan Riau**
