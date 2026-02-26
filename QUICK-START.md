# ⚡ Quick Start Guide - Dashboard Pidum

Panduan cepat untuk hosting dan integrasi Dashboard Pidum ke WordPress dalam 15 menit!

---

## 🎯 Ringkasan

1. **Upload dashboard ke hosting** (5 menit)
2. **Integrasi ke WordPress** (5 menit)
3. **Testing** (5 menit)

---

## 📦 Step 1: Upload Dashboard (5 menit)

### Opsi A: Menggunakan GitHub + Netlify (PALING MUDAH & RECOMMENDED) ⭐

1. **Push ke GitHub**
   - Buat repository baru di GitHub
   - Upload semua file dashboard
   - Panduan lengkap: [GITHUB-DEPLOYMENT.md](GITHUB-DEPLOYMENT.md)

2. **Connect ke Netlify**
   - Login: https://app.netlify.com (pakai akun GitHub)
   - Klik "Import from GitHub"
   - Pilih repository dashboard
   - Klik "Deploy"

3. **Catat URL**
   - URL: `https://random-name.netlify.app`
   - Auto-deploy saat update GitHub!

✅ **SELESAI!** Dashboard online + auto-deploy.

---

### Opsi B: GitHub Pages (GRATIS SELAMANYA)

1. **Buat repository GitHub**
   - Buka: https://github.com/new
   - Nama: `dashboard-pidum`
   - Public repository

2. **Upload files**
   - Drag & drop semua file
   - Commit changes

3. **Enable GitHub Pages**
   - Settings > Pages
   - Source: main branch
   - Save

4. **Catat URL**
   - URL: `https://username.github.io/dashboard-pidum/`

✅ **SELESAI!** Dashboard sudah online.

---

### Opsi C: Netlify Manual Deploy (TERCEPAT)

1. **Buka Netlify**
   - https://app.netlify.com/signup

2. **Deploy website**
   - Klik "Add new site" > "Deploy manually"
   - Drag & drop folder project
   - Tunggu 1-2 menit

3. **Catat URL**
   - URL: `https://random-name.netlify.app`

✅ **SELESAI!** Dashboard sudah online.

---

### Opsi D: cPanel (Hosting Berbayar)

1. **Login cPanel**
   - Buka: `https://namadomain.com/cpanel`

2. **Upload file**
   - File Manager > public_html
   - Upload & extract ZIP

3. **Test akses**
   - Buka: `https://namadomain.com`

✅ **SELESAI!** Dashboard sudah online.

---

## 🔗 Step 2: Integrasi ke WordPress (5 menit)

### Cara Tercepat: Copy-Paste Iframe

1. **Login WordPress**
   - Buka: `https://kejati-kepri.com/wp-admin`

2. **Buat halaman baru**
   - Klik "Pages" > "Add New"
   - Judul: "Dashboard Pidum"

3. **Tambahkan kode ini:**
   - Pilih block "Custom HTML" atau "Shortcode"
   - Copy-paste kode berikut:

```html
<iframe 
    src="https://GANTI-DENGAN-URL-DASHBOARD-ANDA/iframe-embed.html" 
    width="100%" 
    height="900px" 
    frameborder="0" 
    style="border: none; display: block;"
    allowfullscreen>
</iframe>
```

4. **Ganti URL**
   - Ganti `https://GANTI-DENGAN-URL-DASHBOARD-ANDA` dengan URL dashboard Anda
   - Contoh: `https://dashboard.kejati-kepri.com/iframe-embed.html`

5. **Publish**
   - Klik "Publish"

✅ **SELESAI!** Dashboard sudah muncul di WordPress.

---

## ✅ Step 3: Testing (5 menit)

### Checklist Testing:

1. **Buka halaman dashboard di WordPress**
   - [ ] Dashboard muncul dengan benar
   - [ ] Tidak ada error

2. **Test login**
   - [ ] Bisa login dengan username/password
   - [ ] Redirect ke halaman pidum.html

3. **Test navigasi**
   - [ ] Semua menu bisa diklik
   - [ ] Halaman berpindah dengan normal

4. **Test input data**
   - [ ] Bisa input data di form
   - [ ] Data tersimpan (localStorage)
   - [ ] Grafik muncul sesuai data

5. **Test responsive**
   - [ ] Buka di mobile/tablet
   - [ ] Tampilan responsive

✅ **SELESAI!** Dashboard siap digunakan!

---

## 🎨 Customization (Optional)

### Mengubah Tinggi Iframe

Ganti `height="900px"` dengan nilai yang Anda inginkan:
- `height="800px"` - Lebih pendek
- `height="1000px"` - Lebih tinggi
- `height="100vh"` - Full screen

### Full Width (Tanpa Sidebar)

Tambahkan CSS ini di "Appearance" > "Customize" > "Additional CSS":

```css
.page-id-XXX .site-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
}

.page-id-XXX .entry-content {
    padding: 0 !important;
    margin: 0 !important;
}
```

Ganti `XXX` dengan ID halaman dashboard Anda.

---

## 🆘 Troubleshooting Cepat

### Problem: Iframe tidak muncul

**Solusi:**
1. Cek URL dashboard bisa diakses langsung
2. Clear browser cache (Ctrl+F5)
3. Coba browser lain

### Problem: Blank screen

**Solusi:**
1. Pastikan file `.htaccess` sudah di-upload
2. Cek file `iframe-embed.html` ada di hosting
3. Buka browser console (F12) untuk lihat error

### Problem: Login tidak berfungsi

**Solusi:**
1. Pastikan localStorage enabled di browser
2. Coba incognito/private mode
3. Cek cookies tidak diblokir

---

## 📞 Butuh Bantuan?

### File Panduan Lengkap:
- `HOSTING-GUIDE.md` - Panduan hosting detail
- `WORDPRESS-INTEGRATION.md` - Panduan integrasi WordPress detail
- `README.md` - Dokumentasi lengkap dashboard

### Kontak Support:
- Email: it@kejati-kepri.go.id
- Telp: (0771) xxxxx

---

## 🎉 Selamat!

Dashboard Pidum Anda sudah online dan terintegrasi dengan WordPress!

**Next Steps:**
1. ✅ Tambahkan link dashboard ke menu WordPress
2. ✅ Setup backup rutin
3. ✅ Train user untuk menggunakan dashboard
4. ✅ Monitor performance

---

**Happy coding! 🚀**
