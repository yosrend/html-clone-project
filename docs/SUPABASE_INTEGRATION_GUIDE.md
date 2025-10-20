# 🚀 Supabase Integration - Step by Step Guide

## Overview
Panduan lengkap untuk mengintegrasikan project Email Signature Generator dengan Supabase untuk database dan storage.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Database Schema](#database-schema)
4. [Environment Variables](#environment-variables)
5. [Code Implementation](#code-implementation)
6. [Storage Setup](#storage-setup)
7. [Testing](#testing)
8. [Migration dari Turso](#migration-dari-turso)

---

## 1. Prerequisites ✅

### Already Installed:
- ✅ `@supabase/supabase-js` (just installed)
- ✅ Next.js 15.3.5
- ✅ React 19.0.0
- ✅ TypeScript

### You Need:
- [ ] Supabase Account (free tier available)
- [ ] Internet connection
- [ ] Browser to access Supabase Dashboard

---

## 2. Supabase Setup 🔧

### Step 2.1: Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign in/Sign up** with GitHub or Email
3. **Click "New Project"**
4. **Fill in details**:
   - Name: `bistrochat-signature` (or your choice)
   - Database Password: **Save this password!** ⚠️
   - Region: Choose closest to you (e.g., `us-west-1`)
   - Pricing Plan: Start with **Free**

5. **Wait for setup** (takes ~2 minutes)

### Step 2.2: Get API Credentials

Once project is ready:

1. Go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGc....(long string)
service_role key: eyJhbGc....(even longer string - KEEP SECRET!)
```

---

## 3. Database Schema 📊

### Step 3.1: Open SQL Editor

1. In Supabase Dashboard, click **SQL Editor** (sidebar)
2. Click **New Query**

### Step 3.2: Create Tables

Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create signatures table
CREATE TABLE public.signatures (
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

-- Create images table (for uploaded images)
CREATE TABLE public.images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    size INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_signatures_created_at ON public.signatures(created_at DESC);
CREATE INDEX idx_images_created_at ON public.images(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_signatures_updated_at BEFORE UPDATE ON public.signatures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON public.images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations on signatures" ON public.signatures
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on images" ON public.images
    FOR ALL USING (true) WITH CHECK (true);
```

3. **Click "Run"** (or press Cmd/Ctrl + Enter)
4. **Verify**: Check for success message ✅

### Step 3.3: Verify Tables

In SQL Editor, run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- ✅ signatures
- ✅ images

---

## 4. Environment Variables 🔐

### Step 4.1: Update `.env.local`

Add Supabase credentials (keep existing Turso config for now):

```env
# Local Development Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration ⭐ NEW
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc.....your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc.....your-service-role-key-here

# Database (Turso) - Keep for now
TURSO_CONNECTION_URL=libsql://db-7746b987-1bd1-424e-b66b-6a10050c1757-orchids.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9....
```

### Step 4.2: Update `.env.example`

```env
# Local Development Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Turso)
TURSO_CONNECTION_URL=your_turso_connection_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### Step 4.3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 5. Code Implementation 💻

### Already Created:
✅ `src/lib/supabase.ts` (basic client)

### Step 5.1: Update Supabase Client

The file already exists. Let's verify:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
```

### Step 5.2: Create Database Types

Create `src/types/database.types.ts`:

```typescript
export interface Signature {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  html: string;
  animation_type: string;
  animation_loop: boolean;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  filename: string;
  content_type: string;
  storage_path: string;
  url: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface InsertSignature {
  name: string;
  title: string;
  image_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  html: string;
  animation_type?: string;
  animation_loop?: boolean;
}

export interface UpdateSignature {
  name?: string;
  title?: string;
  image_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  html?: string;
  animation_type?: string;
  animation_loop?: boolean;
}
```

### Step 5.3: Create Supabase Service

Create `src/lib/supabase-service.ts`:

```typescript
import { supabase } from './supabase';
import type { Signature, InsertSignature, UpdateSignature, Image } from '@/types/database.types';

// Signatures CRUD
export async function getAllSignatures() {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Signature[];
}

export async function getSignatureById(id: string) {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Signature;
}

export async function createSignature(signature: InsertSignature) {
  const { data, error } = await supabase
    .from('signatures')
    .insert(signature)
    .select()
    .single();

  if (error) throw error;
  return data as Signature;
}

export async function updateSignature(id: string, updates: UpdateSignature) {
  const { data, error } = await supabase
    .from('signatures')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Signature;
}

export async function deleteSignature(id: string) {
  const { error } = await supabase
    .from('signatures')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

// Images CRUD
export async function getAllImages() {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Image[];
}

export async function createImageRecord(image: Omit<Image, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('images')
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data as Image;
}
```

---

## 6. Storage Setup 📦

### Step 6.1: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. **Name**: `signature-images`
4. **Public**: ✅ Check this (images need to be publicly accessible)
5. **Click** "Create Bucket"

### Step 6.2: Set Storage Policies

In Storage → `signature-images` → Policies:

Click **New Policy** for each:

#### Policy 1: Public Read Access
```sql
-- Anyone can view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'signature-images' );
```

#### Policy 2: Authenticated Upload
```sql
-- Anyone can upload (you can restrict this later)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'signature-images' );
```

### Step 6.3: Create Storage Service

Create `src/lib/supabase-storage.ts`:

```typescript
import { supabase } from './supabase';

export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('signature-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('signature-images')
    .getPublicUrl(filePath);

  return {
    path: data.path,
    url: urlData.publicUrl,
    filename: file.name,
    contentType: file.type,
    size: file.size
  };
}

export async function deleteImage(path: string) {
  const { error } = await supabase.storage
    .from('signature-images')
    .remove([path]);

  if (error) throw error;
  return { success: true };
}

export async function listImages() {
  const { data, error } = await supabase.storage
    .from('signature-images')
    .list();

  if (error) throw error;
  return data;
}
```

---

## 7. Testing 🧪

### Step 7.1: Test Database Connection

Create a test API route: `src/app/api/test-supabase/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test connection
    const { data, error } = await supabase
      .from('signatures')
      .select('count');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      data
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Supabase connection failed',
      error: error.message
    }, { status: 500 });
  }
}
```

### Step 7.2: Test in Browser

Visit: `http://localhost:3000/api/test-supabase`

Expected response:
```json
{
  "success": true,
  "message": "Supabase connection successful!",
  "data": []
}
```

### Step 7.3: Test Insert

Add POST method to test route:

```typescript
export async function POST() {
  try {
    const { data, error } = await supabase
      .from('signatures')
      .insert({
        name: 'Test User',
        title: 'Test Title',
        html: '<p>Test HTML</p>',
        animation_type: 'fade',
        animation_loop: false
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Test signature created!',
      data
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

Test with: `POST http://localhost:3000/api/test-supabase`

---

## 8. Migration dari Turso (Optional) 📦

### If You Have Existing Data in Turso:

#### Step 8.1: Export from Turso

```bash
# Connect to Turso database
turso db shell db-7746b987...

# Export signatures
.output signatures.sql
SELECT * FROM signatures;

# Export images
.output images.sql
SELECT * FROM images;
```

#### Step 8.2: Import to Supabase

1. Convert SQLite format to PostgreSQL
2. Use Supabase SQL Editor to insert data
3. Or use a migration script

---

## 9. Next Steps 🚀

After completing setup:

### Update API Routes:
- [ ] Replace Turso calls with Supabase in `/api/signatures/route.ts`
- [ ] Update `/api/images/[id]/route.ts`
- [ ] Update `/api/upload-image/route.ts`

### Update Components:
- [ ] Modify `EmailSignatureGenerator.tsx` to use Supabase
- [ ] Add save/load signature features
- [ ] Implement image gallery from Supabase Storage

### Features to Add:
- [ ] User authentication (Supabase Auth)
- [ ] Save signatures to database
- [ ] Load previous signatures
- [ ] Share signatures with unique URLs
- [ ] Analytics tracking

---

## 10. Troubleshooting 🔧

### Common Issues:

#### Issue: "Invalid API key"
**Solution**: Check `.env.local` has correct keys, restart server

#### Issue: "relation does not exist"
**Solution**: Re-run SQL schema creation in Step 3

#### Issue: "RLS policy violation"
**Solution**: Check RLS policies allow operations you're trying

#### Issue: Storage upload fails
**Solution**: Verify bucket is public, check policies

---

## 11. Security Best Practices 🔒

### Production Checklist:

- [ ] Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- [ ] Use RLS policies to restrict access
- [ ] Add authentication before launch
- [ ] Limit file upload sizes
- [ ] Validate all inputs
- [ ] Use HTTPS only
- [ ] Enable CORS properly
- [ ] Monitor usage in Supabase Dashboard

---

## 12. Resources 📚

### Official Documentation:
- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Storage Guide**: https://supabase.com/docs/guides/storage
- **Auth Guide**: https://supabase.com/docs/guides/auth

### Community:
- **Discord**: https://discord.supabase.com
- **GitHub**: https://github.com/supabase/supabase

---

## Summary ✅

After completing all steps, you'll have:

✅ Supabase project created
✅ Database tables (signatures, images)
✅ Storage bucket for images
✅ Environment variables configured
✅ Supabase client setup
✅ Type definitions
✅ Service functions for CRUD
✅ Storage helper functions
✅ Test endpoints

**You're ready to integrate Supabase into your app!** 🎉

---

## Quick Command Reference

```bash
# Install Supabase
npm install @supabase/supabase-js

# Start dev server
npm run dev

# Test API
curl http://localhost:3000/api/test-supabase

# View logs
# Check Supabase Dashboard → Logs
```

---

**Need help? Check `SUPABASE_SETUP.md` for more examples!**
