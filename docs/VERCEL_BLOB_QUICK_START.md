# ⚡ Vercel Blob - Quick Start (5 Menit!)

Setup tercepat untuk storage Bistrochat Email Generator.

---

## 🚀 Langkah Cepat (Copy-Paste!)

### 1️⃣ Install Dependencies

```bash
npm install @vercel/blob sharp
```

### 2️⃣ Install Vercel CLI

```bash
npm i -g vercel
```

### 3️⃣ Login & Link Project

```bash
# Login
vercel login

# Link ke project Vercel (jika sudah ada)
vercel link

# Atau deploy baru
vercel
```

### 4️⃣ Enable Blob Storage

**Di Vercel Dashboard:**
```
1. Buka project di vercel.com
2. Tab "Storage" → "Create Database"
3. Pilih "Blob"
4. Klik "Create" & "Connect Project"
5. Select environment: Production, Preview, Development
```

### 5️⃣ Download Environment Variables

```bash
# Auto-download dari Vercel
vercel env pull .env.local

# .env.local akan berisi:
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxx
```

### 6️⃣ Test Connection

```bash
# Start dev server
npm run dev

# Test API (terminal baru)
curl http://localhost:3000/api/test-vercel-blob
```

**Expected:**
```json
{
  "success": true,
  "message": "Vercel Blob connection successful"
}
```

### 7️⃣ Test Upload

```
1. Buka http://localhost:3000
2. Upload gambar
3. ✅ Done!
```

---

## 🎉 SELESAI!

**Yang otomatis terjadi:**
- ✅ Upload image ke Vercel Blob
- ✅ Auto resize 400x400 (Sharp)
- ✅ Global CDN otomatis
- ✅ Public URL instant
- ✅ Gratis 500MB + 100GB bandwidth/bulan

---

## 📊 Free Tier

| Resource | Gratis |
|----------|--------|
| Storage | 500 MB |
| Bandwidth | 100 GB/bulan |
| Requests | Unlimited |

**Estimasi:** 500MB = ~1,250 gambar signature (400KB each)

---

## 🔧 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN not found"

**Solusi:**
```bash
vercel env pull .env.local
```

### Error: "Not linked to project"

**Solusi:**
```bash
vercel link
# Pilih project yang sudah ada di Vercel
```

### Error: "No blob store found"

**Solusi:**
1. Buka Vercel dashboard
2. Project → Storage → Create Blob store
3. Connect ke project

---

## 📚 Dokumentasi Lengkap

→ `docs/VERCEL_BLOB_SETUP.md`

**Setup selesai dalam 5 menit!** 🎊
