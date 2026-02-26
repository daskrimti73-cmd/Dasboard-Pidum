# Cara Embed Dashboard Display ke WordPress

Dashboard publik Anda sudah online di:
**https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html**

Berikut cara menampilkannya di website WordPress Kejati:

---

## CARA 1: Iframe Langsung (Paling Mudah)

### A. Embed di Halaman WordPress

1. Login ke WordPress Admin
2. Buka **Pages** > **Add New** (atau edit halaman yang sudah ada)
3. Klik tombol **+** untuk add block
4. Pilih **Custom HTML** block
5. Paste kode ini:

```html
<div style="width: 100%; height: 100vh; min-height: 800px;">
    <iframe 
        src="https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html"
        style="width: 100%; height: 100%; border: none;"
        title="Dashboard Pidana Umum Kejaksaan Tinggi Kepulauan Riau"
        loading="lazy">
    </iframe>
</div>
```

6. Publish halaman

### B. Embed di Post WordPress

Sama seperti cara A, tapi di **Posts** > **Add New**

---

## CARA 2: Shortcode (Lebih Fleksibel)

### Langkah 1: Tambahkan Kode ke functions.php

1. Login WordPress Admin
2. Buka **Appearance** > **Theme File Editor**
3. Pilih **functions.php** di sidebar kanan
4. Scroll ke paling bawah
5. Paste kode ini:

```php
// Shortcode untuk Dashboard Pidum Display
function kejati_dashboard_display_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800px',
        'width' => '100%'
    ), $atts);
    
    $output = '<div style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . '; min-height: 600px; position: relative;">';
    $output .= '<iframe ';
    $output .= 'src="https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html" ';
    $output .= 'style="width: 100%; height: 100%; border: none;" ';
    $output .= 'title="Dashboard Pidana Umum" ';
    $output .= 'loading="lazy">';
    $output .= '</iframe>';
    $output .= '</div>';
    
    return $output;
}
add_shortcode('dashboard_pidum', 'kejati_dashboard_display_shortcode');
```

6. Klik **Update File**

### Langkah 2: Gunakan Shortcode

Di halaman atau post WordPress, ketik:

```
[dashboard_pidum]
```

Atau dengan custom height:

```
[dashboard_pidum height="1000px"]
```

---

## CARA 3: Full Width Template (Tampilan Penuh)

Jika ingin dashboard tampil full screen tanpa sidebar/header WordPress:

### Langkah 1: Buat Template File

1. Akses cPanel atau FTP
2. Masuk ke folder theme aktif: `/wp-content/themes/NAMA-THEME-ANDA/`
3. Upload file `template-dashboard-display.php` (saya buatkan di bawah)

### Langkah 2: Buat Halaman Baru

1. WordPress Admin > **Pages** > **Add New**
2. Judul: "Dashboard Pidana Umum"
3. Di sidebar kanan, **Page Attributes** > **Template**
4. Pilih: **Dashboard Display Template**
5. Publish

---

## CARA 4: Menu Link Langsung

Jika ingin dashboard dibuka di tab baru:

1. WordPress Admin > **Appearance** > **Menus**
2. Klik **Custom Links**
3. URL: `https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html`
4. Link Text: "Dashboard Pidana Umum"
5. Centang **Open link in a new tab**
6. Add to Menu
7. Save Menu

---

## REKOMENDASI

Untuk website Kejati, saya rekomendasikan **CARA 2 (Shortcode)** karena:
- Mudah digunakan
- Bisa diatur tinggi/lebar
- Bisa digunakan di banyak halaman
- Tidak perlu edit theme files

Atau **CARA 3 (Full Width)** jika ingin tampilan maksimal tanpa distraksi header/sidebar WordPress.

---

## TROUBLESHOOTING

### Jika iframe tidak muncul:

1. **Cek plugin security** - Beberapa plugin WordPress block iframe
2. **Disable Content Security Policy** - Bisa block external iframe
3. **Cek theme** - Beberapa theme restrict iframe

### Jika ada masalah CORS:

Dashboard sudah include `.htaccess` dengan CORS headers, jadi seharusnya tidak ada masalah.

---

## URL PENTING

- **Dashboard Admin**: https://daskrimti73-cmd.github.io/Dasboard-Pidum/
- **Dashboard Publik**: https://daskrimti73-cmd.github.io/Dasboard-Pidum/display.html
- **GitHub Repository**: https://github.com/daskrimti73-cmd/Dasboard-Pidum

---

Pilih cara mana yang paling sesuai dengan kebutuhan Kejati Anda!
