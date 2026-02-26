# 🚀 Cara Push Dashboard ke GitHub

Panduan singkat untuk upload Dashboard Pidum ke GitHub.

---

## 📋 Persiapan

### Yang Anda Butuhkan:
- ✅ Akun GitHub (daftar gratis di https://github.com/signup)
- ✅ Git terinstall di komputer (download di https://git-scm.com)
- ✅ Folder dashboard sudah siap

---

## 🎯 Metode 1: Via GitHub Web (PALING MUDAH)

### Langkah-langkah:

1. **Login GitHub**
   - Buka: https://github.com
   - Login dengan akun Anda

2. **Buat Repository Baru**
   - Klik tombol "+" di kanan atas
   - Pilih "New repository"
   - Repository name: `dashboard-pidum`
   - Description: "Dashboard Pidum - Kejati Kepulauan Riau"
   - Pilih: **Public**
   - ✅ Centang "Add a README file"
   - Klik "Create repository"

3. **Upload Files**
   - Di halaman repository, klik "Add file"
   - Pilih "Upload files"
   - Drag & drop semua file dashboard Anda
   - Atau klik "choose your files" untuk browse

4. **Commit Changes**
   - Scroll ke bawah
   - Commit message: "Initial commit - Dashboard Pidum"
   - Klik "Commit changes"

5. **Selesai!**
   - Repository Anda sekarang berisi semua file dashboard
   - URL: `https://github.com/username/dashboard-pidum`

---

## 🎯 Metode 2: Via Git Command Line

### Langkah-langkah:

1. **Buat Repository di GitHub**
   - Login ke GitHub
   - Klik "+" > "New repository"
   - Nama: `dashboard-pidum`
   - Pilih: **Public**
   - **JANGAN** centang "Add a README file"
   - Klik "Create repository"

2. **Buka Terminal/Command Prompt**
   - Windows: Tekan `Win + R`, ketik `cmd`, Enter
   - Mac/Linux: Buka Terminal

3. **Navigate ke Folder Dashboard**
   ```bash
   cd path/to/dashboard-pidum
   ```

4. **Initialize Git**
   ```bash
   git init
   ```

5. **Add Remote Repository**
   ```bash
   git remote add origin https://github.com/username/dashboard-pidum.git
   ```
   
   Ganti `username` dengan username GitHub Anda

6. **Add All Files**
   ```bash
   git add .
   ```

7. **Commit**
   ```bash
   git commit -m "Initial commit - Dashboard Pidum"
   ```

8. **Push ke GitHub**
   ```bash
   git branch -M main
   git push -u origin main
   ```

9. **Login GitHub (jika diminta)**
   - Masukkan username GitHub
   - Masukkan password atau Personal Access Token

10. **Selesai!**
    - Buka: `https://github.com/username/dashboard-pidum`
    - Semua file sudah ter-upload

---

## 🔄 Update Dashboard (Setelah Push Pertama)

### Via GitHub Web:
1. Buka repository di GitHub
2. Navigate ke file yang mau diubah
3. Klik icon pensil (Edit)
4. Edit file
5. Commit changes

### Via Git Command Line:
```bash
# 1. Edit file di local

# 2. Add changes
git add .

# 3. Commit
git commit -m "Update: deskripsi perubahan"

# 4. Push
git push origin main
```

---

## 🌐 Deploy ke Netlify (Setelah Push ke GitHub)

1. **Login Netlify**
   - Buka: https://app.netlify.com
   - Login dengan GitHub account

2. **Import Project**
   - Klik "Add new site" > "Import an existing project"
   - Pilih "Deploy with GitHub"
   - Pilih repository `dashboard-pidum`

3. **Configure & Deploy**
   - Branch: `main`
   - Build command: (kosongkan)
   - Publish directory: (kosongkan)
   - Klik "Deploy site"

4. **Selesai!**
   - URL: `https://random-name.netlify.app`
   - Auto-deploy setiap push ke GitHub!

---

## 🌐 Deploy ke GitHub Pages

1. **Buka Repository Settings**
   - Di repository, klik tab "Settings"

2. **Enable GitHub Pages**
   - Sidebar kiri, klik "Pages"
   - Source: Pilih "Deploy from a branch"
   - Branch: Pilih "main"
   - Folder: Pilih "/ (root)"
   - Klik "Save"

3. **Tunggu Deploy**
   - Refresh halaman setelah 1-2 menit
   - URL akan muncul: `https://username.github.io/dashboard-pidum/`

4. **Selesai!**
   - Dashboard online di GitHub Pages

---

## 🆘 Troubleshooting

### Problem: Git not found

**Solusi:**
1. Install Git: https://git-scm.com/downloads
2. Restart terminal/command prompt
3. Test: `git --version`

### Problem: Permission denied (publickey)

**Solusi:**
1. Gunakan HTTPS URL (bukan SSH)
2. URL: `https://github.com/username/dashboard-pidum.git`
3. Atau setup SSH key: https://docs.github.com/en/authentication

### Problem: Authentication failed

**Solusi:**
1. Buat Personal Access Token:
   - GitHub > Settings > Developer settings > Personal access tokens
   - Generate new token (classic)
   - Select scopes: `repo`
   - Copy token
2. Gunakan token sebagai password saat push

### Problem: Large files error

**Solusi:**
1. GitHub limit: 100MB per file
2. Compress images/files
3. Atau gunakan Git LFS: https://git-lfs.github.com

---

## 📝 File yang Perlu Di-Push

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
✅ .gitignore
✅ css/ (folder)
✅ js/ (folder)
✅ README.md (atau README-GITHUB.md)
```

### Optional:
```
📄 HOSTING-GUIDE.md
📄 WORDPRESS-INTEGRATION.md
📄 GITHUB-DEPLOYMENT.md
📄 QUICK-START.md
```

### Jangan Push:
```
❌ node_modules/
❌ .env
❌ *.log
❌ .DS_Store
❌ Thumbs.db
❌ *.zip (backup files)
```

---

## ✅ Checklist

Sebelum push, pastikan:
- [ ] Git sudah terinstall
- [ ] Akun GitHub sudah dibuat
- [ ] Repository sudah dibuat di GitHub
- [ ] File `.gitignore` sudah ada
- [ ] Semua file dashboard sudah lengkap
- [ ] Tidak ada file sensitive (password, API keys)

Setelah push:
- [ ] Semua file ter-upload di GitHub
- [ ] Repository bisa diakses
- [ ] File bisa dibuka di GitHub
- [ ] README.md muncul di halaman repository

---

## 🎉 Selesai!

Dashboard Anda sekarang di GitHub!

**Next Steps:**
1. ✅ Deploy ke Netlify/Vercel (auto-deploy)
2. ✅ Atau enable GitHub Pages
3. ✅ Integrasi ke WordPress
4. ✅ Setup custom domain (optional)

**Dokumentasi Lengkap:**
- [GITHUB-DEPLOYMENT.md](GITHUB-DEPLOYMENT.md) - Panduan deploy lengkap
- [QUICK-START.md](QUICK-START.md) - Panduan cepat
- [WORDPRESS-INTEGRATION.md](WORDPRESS-INTEGRATION.md) - Integrasi WordPress

---

**Happy coding! 🚀**
