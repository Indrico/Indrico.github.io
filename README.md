# Landing page — Indrico Jowensen

Portfolio statis (HTML + CSS + JavaScript murni, tanpa framework dan tanpa build step).

- Live: https://indrico.github.io/landing-page-indrico/
- Tema: biru, dark/light (otomatis mengikuti setting perangkat, bisa diganti lewat tombol di header)

## Struktur

```
index.html              Semua konten halaman
assets/css/styles.css   Warna (design tokens), layout, animasi
assets/js/main.js       Tema, menu mobile, animasi, simulasi pipeline, form kontak
assets/img/             favicon.svg, apple-touch-icon.png, og-image.png (gambar saat link dibagikan)
.nojekyll               Supaya GitHub Pages menyajikan file apa adanya
```

## Preview di komputer sendiri

```bash
cd ~/landing-page-indrico
python3 -m http.server 8000
# buka http://localhost:8000
```

## Deploy gratis ke GitHub Pages

Repo: `https://github.com/Indrico/landing-page-indrico`

1. **Login GitHub dari terminal** (sekali saja):
   ```bash
   gh auth login        # pilih GitHub.com → HTTPS → Login with a web browser
   ```
2. **Push:**
   ```bash
   cd ~/landing-page-indrico
   git push -u origin main
   ```
3. **Aktifkan Pages:** buka repo di GitHub → **Settings → Pages** → *Build and deployment* →
   Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → **Save**.
4. Tunggu 1–2 menit, lalu buka **https://indrico.github.io/landing-page-indrico/**.

Setiap kali ada perubahan, cukup `git add -A && git commit -m "..." && git push`. Situs akan ter-update otomatis.

> GitHub Pages gratis mensyaratkan repo **public**. Karena itu jangan pernah commit dokumen pribadi (lihat "Keamanan" di bawah).

### Opsional: URL lebih pendek (`https://indrico.github.io/`)
Ubah nama repo di **Settings → General → Repository name** menjadi `Indrico.github.io`, lalu ganti semua
`https://indrico.github.io/landing-page-indrico/` di `index.html` menjadi `https://indrico.github.io/`.

### Alternatif gratis lain
Cloudflare Pages, Netlify, atau Vercel: pilih **Import from GitHub** → repo ini → *Build command* kosong →
*Output directory* `/`. **Jangan** pakai upload drag-and-drop folder (mis. Netlify Drop), karena file pribadi
di folder ini (CV / dokumen lain) bisa ikut ter-upload. Import dari GitHub hanya mengambil file yang di-commit.

## Form kontak (Web3Forms)

Form mengirim pesan ke email Anda lewat [Web3Forms](https://web3forms.com) (gratis, 250 pesan/bulan).
Access key ada di `index.html` (cari `name="access_key"`). Key ini memang dirancang untuk dipasang di HTML publik,
karena hanya bisa dipakai untuk mengirim pesan ke email Anda. Email Anda sendiri tidak pernah muncul di halaman.
Kalau key perlu diganti, cukup ubah nilai `value` di input tersebut.

## Mengubah konten

- **Teks**: edit langsung di `index.html` (setiap section diberi komentar `<!-- ===== ... ===== -->`).
- **Warna**: ubah variabel di bagian atas `assets/css/styles.css` (`:root` untuk dark, `[data-theme="light"]` untuk light).
- **LinkedIn**: di section Contact ada link LinkedIn yang dikomentari. Hapus tanda komentar dan isi URL-nya.
- **Foto profil** (opsional): simpan foto di `assets/img/`, lalu ganti monogram "IJ" di header dengan `<img>`.
- **og-image.png** adalah gambar yang muncul saat link dibagikan (WhatsApp, LinkedIn, dll). Ukurannya 1200×630.

## Keamanan & kerahasiaan

- `.gitignore` memblokir `*.pdf`, `*.docx`, `*.doc`, dan sejenisnya supaya dokumen pribadi tidak ikut ter-commit.
- Repo ini memakai email commit **noreply GitHub**, bukan email kantor:
  `git config user.email` → `16460460+Indrico@users.noreply.github.com`.
- Di GitHub → **Settings → Emails**, aktifkan **Keep my email addresses private** dan
  **Block command line pushes that expose my email**.
- Sebelum push, cek cepat:
  ```bash
  git ls-files                        # tidak boleh ada .pdf / .docx
  git log --format='%an <%ae>'        # harus memakai email noreply
  ```
- Nama perusahaan dan klien sengaja tidak dicantumkan. Tetap jaga seperti ini saat mengedit konten.
