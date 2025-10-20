# 🚀 Cloudflare R2 Quick Start (15 Menit!)

Panduan cepat setup Cloudflare R2 untuk upload gambar signature.

---

## ✅ Checklist Setup (Copy paste saja!)

### 1️⃣ Install Dependencies (2 menit)

```bash
npm install @aws-sdk/client-s3 sharp
```

### 2️⃣ Buat Cloudflare Account (3 menit)

1. Buka: https://dash.cloudflare.com/sign-up
2. Daftar → Verifikasi email → Login
3. Di dashboard, pilih **R2** dari sidebar
4. Klik **Purchase R2 Plan** → Pilih **FREE** → Confirm

### 3️⃣ Buat R2 Bucket (1 menit)

1. Klik **Create bucket**
2. Nama: `bistrochat-signatures`
3. Location: **Automatic**
4. Klik **Create bucket**

### 4️⃣ Enable Public Access (1 menit)

1. Buka bucket `bistrochat-signatures`
2. Tab **Settings**
3. Scroll ke **Public access**
4. Klik **Allow Access**
5. **COPY** Public URL: `https://bistrochat-signatures.xxxx.r2.dev`

### 5️⃣ Generate API Token (2 menit)

1. Dashboard R2 → **Manage R2 API Tokens**
2. **Create API token**
3. Settings:
   - Name: `bistrochat-app`
   - Permissions: **Object Read & Write** ✅
   - Bucket: `bistrochat-signatures`
   - TTL: Never expire
4. **Create API Token**
5. **COPY** credentials (tidak akan muncul lagi!):
   ```
   Access Key ID: abc123...
   Secret Access Key: xyz789...
   ```

### 6️⃣ Get Account ID (30 detik)

1. Di dashboard Cloudflare
2. Cek URL browser: `https://dash.cloudflare.com/{ACCOUNT_ID}/r2`
3. **COPY** Account ID

### 7️⃣ Setup Environment Variables (2 menit)

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`, tambahkan:

```env
R2_ACCOUNT_ID=paste_account_id_disini
R2_ACCESS_KEY_ID=paste_access_key_disini  
R2_SECRET_ACCESS_KEY=paste_secret_key_disini
R2_BUCKET_NAME=bistrochat-signatures
R2_PUBLIC_URL=https://bistrochat-signatures.xxxx.r2.dev
```

### 8️⃣ Test Connection (2 menit)

Jalankan dev server:

```bash
npm run dev
```

Test API:

```bash
curl http://localhost:3000/api/test-r2
```

✅ **Expected response:**

```json
{
  "success": true,
  "message": "R2 connection successful",
  "data": {
    "bucket": "bistrochat-signatures",
    "uploaded": true,
    "retrieved": true
  }
}
```

### 9️⃣ Upload Test dari UI (1 menit)

1. Buka: http://localhost:3000
2. Upload gambar via form
3. Gambar akan auto-resize (400x400) dan upload ke R2
4. Public URL akan muncul di signature preview

---

## 🎉 DONE!

Sekarang aplikasi sudah connect ke Cloudflare R2!

**Yang otomatis terjadi:**
- ✅ Upload image ke R2
- ✅ Auto resize ke 400x400 (Sharp)
- ✅ Optimize quality 85%
- ✅ Generate unique filename
- ✅ Return public URL
- ✅ Unlimited bandwidth (gratis!)

---

## 📊 Free Tier Limits

| Resource | Gratis |
|----------|--------|
| Storage | 10 GB/bulan |
| Bandwidth | **UNLIMITED!** 🚀 |
| Upload Operations | 1 juta/bulan |
| Download Operations | 10 juta/bulan |

**Estimasi:**
- 10 GB = ~25,000 gambar signature (400KB each)
- Unlimited bandwidth = download gratis!

---

## 🔧 Troubleshooting

### Error: "Access Denied"
→ Cek API token permissions (harus Object Read & Write)

### Error: "Bucket not found"  
→ Cek `R2_BUCKET_NAME` di `.env.local`

### Error: "Invalid credentials"
→ Regenerate API token di dashboard

### Image 404
→ Enable public access di bucket settings (Step 4)

---

## 📚 Dokumentasi Lengkap

Untuk setup advanced (custom domain, lifecycle policies, etc):

→ Baca: `docs/CLOUDFLARE_R2_SETUP.md`

---

**Selesai dalam 15 menit!** 🎊
