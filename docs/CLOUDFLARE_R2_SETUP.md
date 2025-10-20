# Cloudflare R2 Setup Guide

Panduan lengkap setup Cloudflare R2 Storage untuk Bistrochat Email Generator.

## 📋 Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Membuat Cloudflare Account](#membuat-cloudflare-account)
3. [Setup R2 Storage](#setup-r2-storage)
4. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
5. [Testing Connection](#testing-connection)
6. [Integrasi dengan Aplikasi](#integrasi-dengan-aplikasi)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Cloudflare account (gratis)
- Node.js 18+ terinstall
- Project Bistrochat Email Generator sudah ter-clone

---

## 1. Membuat Cloudflare Account

### Step 1.1: Sign Up

1. Buka https://dash.cloudflare.com/sign-up
2. Daftar dengan email
3. Verifikasi email
4. Login ke dashboard

### Step 1.2: Dapatkan Account ID

1. Login ke Cloudflare Dashboard
2. Klik kanan sidebar → pilih **R2**
3. Di URL browser, copy Account ID: `https://dash.cloudflare.com/{ACCOUNT_ID}/r2`
4. Atau cek di sidebar kanan: **Account ID**

Simpan Account ID ini untuk `.env.local`

---

## 2. Setup R2 Storage

### Step 2.1: Enable R2

1. Di dashboard, pilih **R2** dari sidebar
2. Klik **Purchase R2 Plan** (pilih yang **FREE**)
3. Confirm setup

**Free Tier:**
- 10 GB storage/bulan
- Unlimited egress (no bandwidth charges!)
- 1 juta Class A operations/bulan
- 10 juta Class B operations/bulan

### Step 2.2: Buat R2 Bucket

1. Klik **Create bucket**
2. Isi nama bucket: `bistrochat-signatures`
3. Location: **Automatic** (recommended)
4. Klik **Create bucket**

### Step 2.3: Setup Public Access (Optional)

Jika ingin image bisa diakses public:

1. Buka bucket `bistrochat-signatures`
2. Tab **Settings**
3. Scroll ke **Public access**
4. Klik **Allow Access**
5. Copy **Public bucket URL**: `https://bistrochat-signatures.YOUR_ACCOUNT.r2.dev`

> **Note:** Untuk production, sebaiknya pakai Custom Domain dengan Cloudflare CDN

---

## 3. Generate R2 API Token

### Step 3.1: Buat API Token

1. Di R2 dashboard, klik **Manage R2 API Tokens**
2. Klik **Create API token**
3. Isi konfigurasi:
   - **Token name:** `bistrochat-app`
   - **Permissions:** 
     - ✅ Object Read & Write
     - ✅ Admin Read & Write (optional, untuk list buckets)
   - **TTL:** Never expire (atau sesuai kebutuhan)
   - **Specific Bucket:** `bistrochat-signatures` (recommended)
4. Klik **Create API Token**

### Step 3.2: Copy Credentials

Setelah token dibuat, **COPY IMMEDIATELY** (tidak akan ditampilkan lagi!):

```
Access Key ID: abc123...
Secret Access Key: xyz789...
```

Simpan di tempat aman (password manager recommended)

---

## 4. Konfigurasi Environment Variables

### Step 4.1: Copy .env.example

```bash
cp .env.example .env.local
```

### Step 4.2: Isi Credentials

Edit `.env.local`:

```env
# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_cloudflare_account_id        # Dari Step 1.2
R2_ACCESS_KEY_ID=your_r2_access_key_id          # Dari Step 3.2
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key  # Dari Step 3.2
R2_BUCKET_NAME=bistrochat-signatures            # Nama bucket Step 2.2
R2_PUBLIC_URL=https://bistrochat-signatures.ACCOUNT.r2.dev  # Dari Step 2.3
```

**Contoh nyata:**

```env
R2_ACCOUNT_ID=a1b2c3d4e5f6g7h8i9j0
R2_ACCESS_KEY_ID=abc123def456
R2_SECRET_ACCESS_KEY=xyz789uvw012pqr345
R2_BUCKET_NAME=bistrochat-signatures
R2_PUBLIC_URL=https://bistrochat-signatures.a1b2c3d4e5f6g7h8i9j0.r2.dev
```

---

## 5. Install Dependencies

```bash
npm install @aws-sdk/client-s3 sharp
```

**Packages:**
- `@aws-sdk/client-s3`: S3-compatible client untuk R2
- `sharp`: Image processing (resize, optimize)

---

## 6. Testing Connection

### Step 6.1: Buat Test API Route

Sudah ada file test di: `src/app/api/test-r2/route.ts`

### Step 6.2: Jalankan Development Server

```bash
npm run dev
```

### Step 6.3: Test Upload

```bash
curl http://localhost:3000/api/test-r2
```

**Expected response:**

```json
{
  "success": true,
  "message": "R2 connection successful",
  "data": {
    "bucket": "bistrochat-signatures",
    "uploaded": true,
    "url": "https://bistrochat-signatures.ACCOUNT.r2.dev/test.txt"
  }
}
```

---

## 7. Integrasi dengan Aplikasi

### 7.1 Upload Image Function

Sudah ada di `src/lib/r2-storage.ts`:

```typescript
import { uploadImage } from '@/lib/r2-storage';

// Upload dengan resize otomatis
const result = await uploadImage(file, {
  width: 400,
  height: 400,
  fit: 'cover',
  quality: 85
});

console.log(result.url); // Public URL
```

### 7.2 Delete Image Function

```typescript
import { deleteImage } from '@/lib/r2-storage';

await deleteImage('signatures/signature-123.jpg');
```

### 7.3 List Images Function

```typescript
import { listImages } from '@/lib/r2-storage';

const images = await listImages('signatures/');
console.log(images); // Array of image paths
```

---

## 8. Custom Domain (Optional - Production)

### Setup Custom Domain untuk R2 Bucket

1. Di bucket settings, klik **Connect domain**
2. Pilih domain Cloudflare kamu: `cdn.bistrochat.com`
3. Cloudflare akan auto-configure DNS
4. Update `.env.local`:

```env
R2_PUBLIC_URL=https://cdn.bistrochat.com
```

**Keuntungan:**
- Custom branding
- Cloudflare CDN cache
- DDoS protection
- Analytics

---

## 9. Troubleshooting

### Error: "Access Denied"

**Solusi:**
- Cek API Token permissions (harus Object Read & Write)
- Pastikan token di-scope ke bucket yang benar
- Regenerate API token jika perlu

### Error: "Bucket not found"

**Solusi:**
- Cek `R2_BUCKET_NAME` di `.env.local`
- Pastikan bucket sudah dibuat di dashboard
- Pastikan Account ID benar

### Error: "Invalid credentials"

**Solusi:**
- Cek `R2_ACCESS_KEY_ID` dan `R2_SECRET_ACCESS_KEY`
- Pastikan tidak ada spasi/newline di env vars
- Regenerate API token di dashboard

### Image tidak muncul (404)

**Solusi:**
- Cek public access sudah di-enable (Step 2.3)
- Atau pakai custom domain dengan Cloudflare CDN
- Cek `R2_PUBLIC_URL` di `.env.local` benar

### Sharp error saat build

**Solusi:**
```bash
npm rebuild sharp
```

Atau install ulang:
```bash
npm uninstall sharp
npm install sharp
```

---

## 10. Monitoring & Limits

### Check Usage

1. Dashboard R2 → **Overview**
2. Lihat metrics:
   - Storage used
   - Requests (Class A/B operations)
   - Data transfer

### Free Tier Limits

| Resource | Limit |
|----------|-------|
| Storage | 10 GB/bulan |
| Class A Operations (Write, List) | 1 juta/bulan |
| Class B Operations (Read) | 10 juta/bulan |
| Egress | **UNLIMITED** (gratis!) |

**Estimasi untuk project:**
- 10 GB storage = ~25,000 images @ 400KB each
- 1M writes = upload ~30,000 images/bulan
- Unlimited egress = bandwidth gratis!

---

## 11. Migration dari Supabase

Jika sebelumnya pakai Supabase:

1. Ganti import di `EmailSignatureGenerator.tsx`:

```typescript
// OLD
import { uploadImage } from '@/lib/supabase-storage';

// NEW  
import { uploadImage } from '@/lib/r2-storage';
```

2. API signature sama, langsung work!

3. Migrasi data existing (optional):

```bash
# Export dari Supabase
# Import ke R2 via AWS CLI atau script
```

---

## 12. Best Practices

### Security

- ✅ Jangan commit `.env.local` ke git
- ✅ Pakai API token dengan minimal permissions
- ✅ Set token expiry untuk production
- ✅ Enable CORS di bucket settings jika perlu

### Performance

- ✅ Resize image sebelum upload (sudah built-in)
- ✅ Pakai custom domain dengan CDN
- ✅ Set proper cache headers
- ✅ Compress dengan Sharp (quality 85 recommended)

### Cost Optimization

- ✅ Delete unused images berkala
- ✅ Monitor Class A operations (lebih mahal)
- ✅ Batch operations jika bisa
- ✅ Pakai lifecycle policies untuk auto-delete

---

## 13. Next Steps

- [ ] Setup Cloudflare account
- [ ] Buat R2 bucket
- [ ] Generate API token
- [ ] Configure environment variables
- [ ] Install dependencies: `npm install @aws-sdk/client-s3 sharp`
- [ ] Test connection
- [ ] Integrate dengan EmailSignatureGenerator
- [ ] Deploy ke production

---

## Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

---

**Maintainer:** Bistrochat Email Generator Team  
**Last Updated:** 2024
