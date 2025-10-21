# Test Production Upload

## 1. Check API Endpoint

Buka di browser (ganti dengan production URL):

```
https://your-production-url.vercel.app/api/test-vercel-blob
```

**Expected response:**
```json
{
  "success": true,
  "message": "Vercel Blob connection successful",
  "data": {
    "uploaded": true,
    "url": "https://xxx.public.blob.vercel-storage.com/...",
    "deleted": true
  }
}
```

**If error:**
```json
{
  "success": false,
  "message": "Vercel Blob connection failed",
  "error": "BLOB_READ_WRITE_TOKEN is not defined",
  "hint": "Make sure BLOB_READ_WRITE_TOKEN is set in .env.local"
}
```

---

## 2. Check Upload Endpoint

Test upload dengan curl (from terminal):

```bash
# Ganti YOUR_PRODUCTION_URL dengan URL production Anda
curl -X POST https://YOUR_PRODUCTION_URL.vercel.app/api/upload-image-vercel \
  -F "file=@/path/to/test-image.jpg"
```

**Expected:**
```json
{
  "success": true,
  "imageUrl": "https://xxx.public.blob.vercel-storage.com/signatures/signature-xxx.jpg",
  "size": 123456
}
```

---

## 3. Common Errors & Fixes

### Error: "BLOB_READ_WRITE_TOKEN is not defined"

**Fix:**
1. Vercel Dashboard → Project → Storage
2. Create Blob store (if not exists)
3. Connect to project
4. Redeploy (Deployments → Redeploy)

### Error: "Failed to upload image to Vercel Blob"

**Possible causes:**
- Token expired → Regenerate in Vercel
- Network timeout → Try smaller image
- Sharp installation failed → Check build logs

### Error: "File too large"

**Fix:**
- Max 5MB per file
- Compress image before upload

---

## 4. Quick Fix Steps

**Step 1: Verify Blob Store Connected**
```
Vercel Dashboard → Project → Storage → Blob
Should show: "Connected to: your-project"
```

**Step 2: Check Environment Variables**
```
Vercel Dashboard → Project → Settings → Environment Variables
Should have: BLOB_READ_WRITE_TOKEN
```

**Step 3: Redeploy**
```
Vercel Dashboard → Deployments → Latest → Redeploy
```

**Step 4: Test Again**
