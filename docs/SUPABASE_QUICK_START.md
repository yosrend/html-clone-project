# ⚡ Supabase Quick Start Checklist

## ✅ Installation Complete!

```
✅ @supabase/supabase-js installed
✅ Type definitions created
✅ Service functions created
✅ Storage helpers created
✅ Test API route created
```

---

## 🚀 Next Steps - DO THIS NOW!

### Step 1: Create Supabase Project (5 minutes)

1. Go to: https://supabase.com
2. Sign in/Sign up
3. Click "New Project"
4. Fill:
   - Name: `bistrochat-signature`
   - Password: **[SAVE THIS]**
   - Region: US West (or closest)
5. Wait ~2 minutes for setup

---

### Step 2: Get API Keys (1 minute)

Once ready:

1. Settings → API
2. Copy these:

```
Project URL: https://xxxxx.supabase.co
anon key: eyJhbGc.....
```

---

### Step 3: Add to Environment (1 minute)

Edit `.env.local`:

```env
# Add these lines:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc.....
```

**Save file!**

---

### Step 4: Create Database Tables (2 minutes)

1. In Supabase Dashboard → SQL Editor
2. Copy SQL from `SUPABASE_INTEGRATION_GUIDE.md` Step 3.2
3. Or use this short version:

```sql
-- Quick Schema
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    whatsapp_url TEXT,
    html TEXT NOT NULL,
    animation_type TEXT DEFAULT 'none',
    animation_loop BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    size INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow all (for development)
CREATE POLICY "Allow all" ON signatures FOR ALL USING (true);
CREATE POLICY "Allow all" ON images FOR ALL USING (true);
```

4. Click "Run"
5. Check for ✅ success

---

### Step 5: Create Storage Bucket (1 minute)

1. Storage → New Bucket
2. Name: `signature-images`
3. ✅ Check "Public bucket"
4. Create

---

### Step 6: Restart Server (30 seconds)

```bash
# Stop server (Ctrl+C in terminal)
# Start again:
npm run dev
```

---

### Step 7: Test Connection (30 seconds)

Open browser: `http://localhost:3000/api/test-supabase`

Expected:
```json
{
  "success": true,
  "message": "Supabase connection successful! ✅",
  "signatureCount": 0
}
```

---

## 🎉 Done! What's Available Now:

### Files Created:
- ✅ `src/types/database.types.ts` - TypeScript types
- ✅ `src/lib/supabase.ts` - Supabase client (already existed)
- ✅ `src/lib/supabase-service.ts` - CRUD functions
- ✅ `src/lib/supabase-storage.ts` - Storage functions
- ✅ `src/app/api/test-supabase/route.ts` - Test endpoint

### Functions Available:

#### Signatures:
```typescript
import { 
  getAllSignatures,
  getSignatureById, 
  createSignature,
  updateSignature,
  deleteSignature 
} from '@/lib/supabase-service';
```

#### Images:
```typescript
import { 
  getAllImages,
  getImageById,
  createImageRecord,
  deleteImageRecord 
} from '@/lib/supabase-service';
```

#### Storage:
```typescript
import { 
  uploadImage,
  deleteImage,
  listImages,
  getImageUrl 
} from '@/lib/supabase-storage';
```

---

## 🧪 Test Everything:

### Test 1: Database Connection
```bash
curl http://localhost:3000/api/test-supabase
```

### Test 2: Create Test Signature
```bash
curl -X POST http://localhost:3000/api/test-supabase
```

### Test 3: Check Supabase Dashboard
1. Go to Supabase → Table Editor
2. Click "signatures" table
3. You should see test data!

---

## 📚 Full Documentation:

- **Complete Guide**: `SUPABASE_INTEGRATION_GUIDE.md`
- **Original Setup**: `SUPABASE_SETUP.md`

---

## 🆘 Troubleshooting:

### Error: "Invalid API key"
→ Check `.env.local` has correct keys
→ Restart dev server

### Error: "relation does not exist"
→ Run SQL schema in Step 4 again

### Error: "Failed to fetch"
→ Check Supabase project is running
→ Verify URL is correct

---

## 🎯 What to Do Next:

### Option 1: Keep Current Setup (Turso)
- Keep using current implementation
- Supabase ready when needed

### Option 2: Migrate to Supabase
- Update API routes to use Supabase
- Move image uploads to Supabase Storage
- Add signature save/load features

### Option 3: Use Both
- Turso for current data
- Supabase for new features
- Migrate gradually

---

## ⏱️ Total Setup Time: ~10 minutes

✅ Installation: 1 min
✅ Supabase Project: 5 min
✅ Database Setup: 2 min
✅ Storage Setup: 1 min
✅ Testing: 1 min

**You're done!** 🎉

---

## 🚀 Ready to Use!

Your project now has:
- ✅ Supabase client configured
- ✅ Database tables ready
- ✅ Storage bucket created
- ✅ Type-safe functions
- ✅ Test endpoint working

**Start building amazing features!** 💪
