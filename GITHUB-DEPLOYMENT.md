# 🚀 GitHub Deployment Guide - Dashboard Pidum

Panduan lengkap deploy Dashboard Pidum menggunakan GitHub Pages atau GitHub + Netlify/Vercel.

---

## 📋 Daftar Isi

1. [Metode 1: GitHub Pages (Gratis)](#metode-1-github-pages)
2. [Metode 2: GitHub + Netlify (Recommended)](#metode-2-github--netlify)
3. [Metode 3: GitHub + Vercel](#metode-3-github--vercel)
4. [Update & Maintenance](#update--maintenance)

---

## Metode 1: GitHub Pages (Gratis) ⭐⭐

### Kelebihan:
- ✅ Gratis selamanya
- ✅ Unlimited bandwidth
- ✅ Custom domain support
- ✅ HTTPS otomatis
- ✅ Terintegrasi dengan GitHub

### Kekurangan:
- ⚠️ Public repository (kecuali GitHub Pro)
- ⚠️ Limit 1GB storage
- ⚠️ Limit 100GB bandwidth/bulan

---

### Langkah-langkah:

#### Step 1: Buat Repository GitHub

1. **Login ke GitHub**
   - Buka: https://github.com
   - Login dengan akun Anda

2. **Buat Repository Baru**
   - Klik tombol "+" di kanan atas
   - Pilih "New repository"
   - Repository name: `dashboard-pidum` (atau nama lain)
   - Description: "Dashboard Pidum - Kejaksaan Tinggi Kepulauan Riau"
   - Pilih: **Public** (untuk GitHub Pages gratis)
   - ✅ Centang "Add a README file"
   - Klik "Create repository"

#### Step 2: Upload File Dashboard

**Opsi A: Via Web Interface (Paling Mudah)**

1. **Buka Repository**
   - Klik repository yang baru dibuat

2. **Upload Files**
   - Klik "Add file" > "Upload files"
   - Drag & drop semua file dashboard Anda
   - Atau klik "choose your files" untuk browse

3. **Commit Changes**
   - Scroll ke bawah
   - Commit message: "Initial commit - Dashboard Pidum"
   - Klik "Commit changes"

**Opsi B: Via Git Command Line**

```bash
# 1. Clone repository
git clone https://github.com/username/dashboard-pidum.git
cd dashboard-pidum

# 2. Copy semua file dashboard ke folder ini
# (copy manual atau gunakan command)

# 3. Add, commit, dan push
git add .
git commit -m "Initial commit - Dashboard Pidum"
git push origin main
```

#### Step 3: Enable GitHub Pages

1. **Buka Settings**
   - Di repository, klik tab "Settings"

2. **Scroll ke Pages**
   - Di sidebar kiri, klik "Pages"

3. **Configure Source**
   - Source: Pilih "Deploy from a branch"
   - Branch: Pilih "main" (atau "master")
   - Folder: Pilih "/ (root)"
   - Klik "Save"

4. **Tunggu Deploy**
   - GitHub akan build & deploy (1-2 menit)
   - Refresh halaman untuk melihat URL

5. **Catat URL**
   - URL akan muncul: `https://username.github.io/dashboard-pidum/`
   - Ini adalah URL dashboard Anda!

#### Step 4: Test Dashboard

1. **Buka URL**
   - Klik link yang diberikan GitHub
   - Atau buka: `https://username.github.io/dashboard-pidum/`

2. **Test Functionality**
   - Login harus berfungsi
   - Navigasi harus berfungsi
   - Data harus bisa disimpan

✅ **SELESAI!** Dashboard sudah online di GitHub Pages.

---

### Custom Domain (Optional)

Jika Anda punya domain sendiri (contoh: dashboard.kejati-kepri.com):

1. **Di GitHub Settings > Pages**
   - Custom domain: Masukkan `dashboard.kejati-kepri.com`
   - Klik "Save"

2. **Di DNS Provider (Registrar Domain)**
   - Tambahkan CNAME record:
     - Name: `dashboard` (atau `@` untuk root domain)
     - Value: `username.github.io`
     - TTL: 3600

3. **Tunggu DNS Propagation**
   - Biasanya 5-30 menit
   - Bisa sampai 24 jam

4. **Enable HTTPS**
   - Di GitHub Pages settings
   - ✅ Centang "Enforce HTTPS"

---

## Metode 2: GitHub + Netlify (Recommended) ⭐⭐⭐

### Kelebihan:
- ✅ Auto-deploy saat push ke GitHub
- ✅ Preview deploy untuk setiap commit
- ✅ Custom domain gratis
- ✅ HTTPS otomatis (Let's Encrypt)
- ✅ CDN global
- ✅ Unlimited bandwidth
- ✅ Build logs & analytics

### Kekurangan:
- ⚠️ Limit 300 build minutes/bulan (free tier)
- ⚠️ Limit 100GB bandwidth/bulan (free tier)

---

### Langkah-langkah:

#### Step 1: Push ke GitHub

1. **Buat Repository** (sama seperti Metode 1, Step 1-2)
2. **Upload Files** (sama seperti Metode 1, Step 2)

#### Step 2: Connect ke Netlify

1. **Login Netlify**
   - Buka: https://app.netlify.com
   - Login dengan GitHub account (recommended)

2. **Import Project**
   - Klik "Add new site" > "Import an existing project"
   - Pilih "Deploy with GitHub"

3. **Authorize Netlify**
   - Klik "Authorize Netlify"
   - Pilih repository `dashboard-pidum`

4. **Configure Build Settings**
   - Branch to deploy: `main`
   - Build command: (kosongkan, tidak perlu build)
   - Publish directory: (kosongkan atau `/`)
   - Klik "Deploy site"

5. **Tunggu Deploy**
   - Netlify akan deploy (30-60 detik)
   - Status akan berubah jadi "Published"

6. **Catat URL**
   - URL: `https://random-name-123.netlify.app`
   - Ini adalah URL dashboard Anda!

#### Step 3: Custom Domain (Optional)

1. **Di Netlify Dashboard**
   - Klik "Domain settings"
   - Klik "Add custom domain"
   - Masukkan: `dashboard.kejati-kepri.com`
   - Klik "Verify"

2. **Update DNS**
   - Netlify akan memberikan instruksi DNS
   - Tambahkan CNAME record di DNS provider
   - Tunggu propagation (5-30 menit)

3. **Enable HTTPS**
   - Netlify otomatis enable HTTPS
   - Certificate dari Let's Encrypt

✅ **SELESAI!** Dashboard auto-deploy dari GitHub ke Netlify.

---

### Auto-Deploy Workflow

Setiap kali Anda update code:

```bash
# 1. Edit file di local
# 2. Commit changes
git add .
git commit -m "Update dashboard"

# 3. Push ke GitHub
git push origin main

# 4. Netlify otomatis deploy (30-60 detik)
# 5. Dashboard updated!
```

---

## Metode 3: GitHub + Vercel ⭐⭐⭐

### Kelebihan:
- ✅ Auto-deploy dari GitHub
- ✅ Preview deploy
- ✅ Custom domain gratis
- ✅ HTTPS otomatis
- ✅ CDN global (sangat cepat)
- ✅ Unlimited bandwidth

### Kekurangan:
- ⚠️ Limit 100GB bandwidth/bulan (hobby tier)

---

### Langkah-langkah:

#### Step 1: Push ke GitHub
(Sama seperti Metode 1, Step 1-2)

#### Step 2: Connect ke Vercel

1. **Login Vercel**
   - Buka: https://vercel.com
   - Login dengan GitHub account

2. **Import Project**
   - Klik "Add New..." > "Project"
   - Pilih repository `dashboard-pidum`
   - Klik "Import"

3. **Configure Project**
   - Project Name: `dashboard-pidum`
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (kosongkan)
   - Output Directory: (kosongkan)
   - Klik "Deploy"

4. **Tunggu Deploy**
   - Vercel akan deploy (30-60 detik)
   - Status: "Ready"

5. **Catat URL**
   - URL: `https://dashboard-pidum.vercel.app`
   - Atau custom: `https://dashboard-pidum-username.vercel.app`

#### Step 3: Custom Domain (Optional)

1. **Di Vercel Dashboard**
   - Klik "Settings" > "Domains"
   - Masukkan: `dashboard.kejati-kepri.com`
   - Klik "Add"

2. **Update DNS**
   - Vercel akan memberikan instruksi
   - Tambahkan CNAME record
   - Tunggu propagation

3. **HTTPS**
   - Vercel otomatis enable HTTPS

✅ **SELESAI!** Dashboard auto-deploy dari GitHub ke Vercel.

---

## 📊 Perbandingan Metode

| Fitur | GitHub Pages | Netlify | Vercel |
|-------|--------------|---------|--------|
| **Harga** | Gratis | Gratis | Gratis |
| **Bandwidth** | 100GB/bulan | 100GB/bulan | 100GB/bulan |
| **Custom Domain** | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ |
| **Auto-Deploy** | ✅ | ✅ | ✅ |
| **Preview Deploy** | ❌ | ✅ | ✅ |
| **Build Time** | 2-5 menit | 30-60 detik | 30-60 detik |
| **CDN** | ✅ | ✅ | ✅ (Fastest) |
| **Analytics** | ❌ | ✅ | ✅ |
| **Redirects** | Limited | ✅ | ✅ |
| **Forms** | ❌ | ✅ | ❌ |

### Rekomendasi:

- **Pemula**: GitHub Pages (paling sederhana)
- **Production**: Netlify (fitur lengkap, mudah)
- **Performance**: Vercel (paling cepat)

---

## 🔄 Update & Maintenance

### Update Dashboard

**Via GitHub Web:**
1. Buka repository di GitHub
2. Navigate ke file yang mau diubah
3. Klik icon pensil (Edit)
4. Edit file
5. Commit changes
6. Auto-deploy (jika pakai Netlify/Vercel)

**Via Git Command Line:**
```bash
# 1. Edit file di local
# 2. Commit & push
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main

# 3. Auto-deploy (30-60 detik)
```

### Rollback ke Versi Sebelumnya

**GitHub Pages:**
```bash
git revert HEAD
git push origin main
```

**Netlify/Vercel:**
- Buka dashboard
- Klik "Deploys"
- Pilih deploy sebelumnya
- Klik "Publish deploy"

---

## 🔐 Security & Best Practices

### 1. Protect Sensitive Data
```bash
# Buat file .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore

# Commit .gitignore
git add .gitignore
git commit -m "Add .gitignore"
git push
```

### 2. Branch Strategy
```bash
# Buat branch development
git checkout -b development

# Edit & test di development
git add .
git commit -m "New feature"
git push origin development

# Merge ke main setelah testing
git checkout main
git merge development
git push origin main
```

### 3. Environment Variables (Netlify/Vercel)

**Netlify:**
- Settings > Environment variables
- Add variable: `API_KEY=your-key`

**Vercel:**
- Settings > Environment Variables
- Add variable: `API_KEY=your-key`

---

## 📝 File yang Perlu Di-Push ke GitHub

### Wajib:
```
✅ index.html
✅ pidum.html
✅ pra-penuntutan.html
✅ penuntutan.html
✅ upaya-hukum.html
✅ eksekusi.html
✅ tppu.html
✅ wna.html
✅ hukuman-mati.html
✅ korban.html
✅ detail-*.html
✅ iframe-embed.html
✅ .htaccess
✅ css/ (folder)
✅ js/ (folder)
✅ README.md
```

### Optional:
```
📄 HOSTING-GUIDE.md
📄 WORDPRESS-INTEGRATION.md
📄 QUICK-START.md
📄 DEPLOYMENT-CHECKLIST.md
```

### Jangan Push:
```
❌ node_modules/
❌ .env
❌ *.log
❌ .DS_Store
❌ Thumbs.db
```

---

## 🆘 Troubleshooting

### Problem: GitHub Pages 404 Error

**Solusi:**
1. Pastikan file `index.html` ada di root folder
2. Cek branch yang dipilih di Settings > Pages
3. Tunggu 5-10 menit untuk propagation
4. Clear browser cache

### Problem: Netlify Build Failed

**Solusi:**
1. Cek build logs di Netlify dashboard
2. Pastikan tidak ada build command (kosongkan)
3. Pastikan publish directory kosong atau `/`
4. Retry deploy

### Problem: Custom Domain Tidak Berfungsi

**Solusi:**
1. Cek DNS settings di registrar
2. Tunggu DNS propagation (24 jam max)
3. Test dengan: `nslookup dashboard.kejati-kepri.com`
4. Clear browser cache

### Problem: HTTPS Error

**Solusi:**
1. Tunggu certificate provisioning (5-10 menit)
2. Force HTTPS di settings
3. Clear browser cache
4. Try incognito mode

---

## 📞 Resources

### GitHub:
- Docs: https://docs.github.com/pages
- Community: https://github.community

### Netlify:
- Docs: https://docs.netlify.com
- Support: https://answers.netlify.com

### Vercel:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

---

## ✅ Quick Checklist

### GitHub Pages:
- [ ] Repository created
- [ ] Files uploaded
- [ ] GitHub Pages enabled
- [ ] URL working
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled

### Netlify/Vercel:
- [ ] Repository created
- [ ] Files uploaded
- [ ] Connected to Netlify/Vercel
- [ ] First deploy successful
- [ ] URL working
- [ ] Custom domain configured (optional)
- [ ] Auto-deploy tested

---

## 🎉 Selesai!

Dashboard Anda sekarang:
- ✅ Hosted di GitHub
- ✅ Auto-deploy saat update
- ✅ HTTPS enabled
- ✅ Custom domain ready
- ✅ CDN global

**Next Steps:**
1. Test dashboard di URL yang diberikan
2. Integrasi ke WordPress (lihat WORDPRESS-INTEGRATION.md)
3. Setup custom domain (optional)
4. Train users

---

**Happy coding! 🚀**
