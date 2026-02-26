# 📊 Dashboard Pidum - Kejaksaan Tinggi Kepulauan Riau

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

Sistem manajemen data Pidana Umum berbasis web untuk Kejaksaan Tinggi Kepulauan Riau.

## 🚀 Quick Start

### Deploy ke Netlify (1 Klik)
1. Klik tombol "Deploy to Netlify" di atas
2. Login dengan GitHub
3. Deploy! (30 detik)

### Deploy ke Vercel (1 Klik)
1. Klik tombol "Deploy with Vercel" di atas
2. Login dengan GitHub
3. Deploy! (30 detik)

### Deploy Manual
```bash
# Clone repository
git clone https://github.com/username/dashboard-pidum.git
cd dashboard-pidum

# Buka di browser
# Atau jalankan local server:
python -m http.server 8000
```

## 📋 Fitur

- ✅ **8 Section Data**: Pra Penuntutan, Penuntutan, Upaya Hukum, Eksekusi, TPPU, WNA, Hukuman Mati, Korban
- ✅ **Filter Dinamis**: Wilayah, Satuan Kerja, Tahun, Bulan
- ✅ **Charts & Visualisasi**: Line charts, bar charts (Chart.js)
- ✅ **Auto-save**: Data tersimpan di localStorage
- ✅ **Responsive**: Mobile-friendly
- ✅ **WordPress Ready**: Iframe embed support

## 🌐 Demo

**Live Demo**: [https://dashboard-pidum.netlify.app](https://dashboard-pidum.netlify.app)

**Login:**
- Username: `admin`
- Password: `admin123`

## 📦 Teknologi

- HTML5, CSS3, JavaScript (Vanilla)
- Chart.js untuk visualisasi
- LocalStorage untuk data persistence
- Responsive design (mobile-first)

## 🔧 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/username/dashboard-pidum.git
cd dashboard-pidum
```

### 2. Jalankan Local Server
```bash
# Python
python -m http.server 8000

# PHP
php -S localhost:8000

# Node.js
npx serve .
```

### 3. Buka Browser
```
http://localhost:8000
```

## 📖 Dokumentasi

| File | Deskripsi |
|------|-----------|
| [GITHUB-DEPLOYMENT.md](GITHUB-DEPLOYMENT.md) | Deploy menggunakan GitHub |
| [QUICK-START.md](QUICK-START.md) | Panduan cepat 15 menit |
| [HOSTING-GUIDE.md](HOSTING-GUIDE.md) | Panduan hosting lengkap |
| [WORDPRESS-INTEGRATION.md](WORDPRESS-INTEGRATION.md) | Integrasi WordPress |

## 🔗 WordPress Integration

### Iframe Sederhana
```html
<iframe 
    src="https://your-dashboard-url.com/iframe-embed.html" 
    width="100%" 
    height="900px" 
    frameborder="0" 
    allowfullscreen>
</iframe>
```

### Shortcode WordPress
```php
// Tambahkan ke functions.php
function dashboard_pidum_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '900px',
        'url' => 'https://your-dashboard-url.com/iframe-embed.html'
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
```

Gunakan: `[dashboard_pidum]`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

© 2026 Kejaksaan Tinggi Kepulauan Riau. All rights reserved.

## 📞 Support

- **Email**: it@kejati-kepri.go.id
- **Website**: https://kejati-kepri.go.id
- **Issues**: [GitHub Issues](https://github.com/username/dashboard-pidum/issues)

## 🙏 Acknowledgments

- Chart.js untuk visualisasi data
- Font Awesome untuk icons
- Google Fonts untuk typography

---

**Dibuat dengan ❤️ untuk Kejaksaan Tinggi Kepulauan Riau**

⭐ Star repository ini jika bermanfaat!
