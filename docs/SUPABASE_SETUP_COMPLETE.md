# Supabase Complete Setup Guide

## Langkah 1: Membuat Project Supabase

### 1.1 Daftar Supabase
1. Buka https://supabase.com
2. Klik "Start your project" atau "Sign Up"
3. Login dengan GitHub, Google, atau email

### 1.2 Buat Project Baru
1. Setelah login, klik "New Project"
2. Pilih organisasi (buat baru jika perlu)
3. Isi detail project:
   - **Project Name**: `bistrochat-signature`
   - **Database Password**: Buat password yang kuat (simpan baik-baik)
   - **Region**: Pilih region terdekat (Singapore atau Jakarta)
4. Klik "Create new project"

### 1.3 Tunggu Setup Selesai
- Proses setup memakan waktu 1-3 menit
- Anda akan mendapatkan:
  - Project URL
  - Anon Key
  - Service Role Key

## Langkah 2: Konfigurasi Environment Variabel

### 2.1 Copy Kredensial
Buka project Supabase Anda:
1. Klik "Settings" → "API"
2. Copy nilai-nilai berikut:
   - **Project URL**: `https://[project-id].supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2.2 Update .env.local
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Langkah 3: Setup Database Schema

### 3.1 Buka SQL Editor
1. Di dashboard Supabase, klik "SQL Editor"
2. Klik "New query"

### 3.2 Jalankan SQL Schema
```sql
-- Create signatures table
CREATE TABLE IF NOT EXISTS signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  linkedin_url TEXT,
  instagram_url TEXT,
  whatsapp_url TEXT,
  user_image_url TEXT,
  animation_type VARCHAR(50) DEFAULT 'none',
  animation_loop BOOLEAN DEFAULT false,
  animation_interval DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create images table for storage metadata
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signature_id UUID REFERENCES signatures(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  public_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies for signatures
CREATE POLICY "Public read access for signatures" ON signatures
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert signatures" ON signatures
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own signatures" ON signatures
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for images
CREATE POLICY "Public read access for images" ON images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert images" ON images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_signatures_name ON signatures(name);
CREATE INDEX idx_signatures_created_at ON signatures(created_at);
CREATE INDEX idx_images_signature_id ON images(signature_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_signatures_updated_at
  BEFORE UPDATE ON signatures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3.3 Eksekusi SQL
1. Paste SQL di atas ke editor
2. Klik "Run" atau tekan Ctrl+Enter
3. Tunggu hingga semua tabel berhasil dibuat

## Langkah 4: Setup Storage Bucket

### 4.1 Buat Storage Bucket
1. Klik "Storage" di sidebar
2. Klik "Create bucket"
3. Isi detail:
   - **Name**: `signature-images`
   - **Public bucket**: ✅ Centang (untuk akses publik)
4. Klik "Save"

### 4.2 Setup Storage Policies
1. Klik bucket "signature-images"
2. Klik tab "Policies"
3. Klik "New policy"
4. Pilih "Get started quickly"
5. Pilih template "Allow public uploads"
6. Policy name: `Public Upload Access`
7. Gunakan JSON berikut:

```json
{
  "bucketId": "signature-images",
  "allowedMimeTypes": ["image/*"],
  "maxFileSize": "10485760"
}
```

8. Klik "Create policy"

## Langkah 5: Test Koneksi

### 5.1 Restart Development Server
```bash
npm run dev
```

### 5.2 Test API Endpoint
Buka browser atau curl:
```bash
curl http://localhost:3000/api/test-supabase
```

Expected response:
```json
{
  "success": true,
  "message": "Supabase connection successful!",
  "signatureCount": 0,
  "testSignature": {
    "id": "...",
    "name": "Test User",
    "title": "Test Title",
    "animation_type": "fade",
    "animation_loop": true,
    "animation_interval": 2.0,
    "created_at": "2024-10-20T..."
  }
}
```

### 5.3 Test Upload Manual
1. Coba upload gambar di aplikasi
2. Cek di dashboard Supabase:
   - **Storage** → **signature-images** → Pastikan file muncul
   - **Table Editor** → **images** → Check metadata

## Langkah 6: Integrasi dengan Project

### 6.1 Update Parameter Function
Pastikan function `generateEmailSignatureHtml` menggunakan parameter yang benar:
```typescript
function generateEmailSignatureHtml(
  formData: FormData, 
  displayImage: string, 
  linkedinToggle: boolean, 
  instagramToggle: boolean, 
  whatsappToggle: boolean,
  animationType: string = 'none',
  animationLoop: boolean = false,
  animationInterval: number = 0
): string
```

### 6.2 Test Save Function
1. Isi form signature
2. Upload gambar
3. Pilih animasi
4. Enable loop dengan interval tertentu
5. Cek di database Supabase apakah data tersimpan

## Troubleshooting

### Common Issues

#### 1. Connection Failed
- **Error**: `Invalid API key`
- **Solution**: Periksa kredensial di .env.local, restart server

#### 2. RLS Policy Error
- **Error**: `new row violates row-level security policy`
- **Solution**: Pastikan RLS policies sudah benar di Langkah 3.3

#### 3. Storage Permission Error
- **Error**: `Permission denied for bucket`
- **Solution**: Setup storage policies di Langkah 4.2

#### 4. CORS Error
- **Error**: `CORS policy: No 'Access-Control-Allow-Origin'`
- **Solution**: Tambahkan CORS configuration di Supabase Settings

### Debug Tips
1. Cek browser console untuk error detail
2. Monitor network tab untuk request/response
3. Gunakan Supabase Logs: **Project Settings** → **Logs**
4. Test di Postman/Insomnia untuk API testing

## Next Steps Setup MCP FFmpeg

Setelah Supabase terkoneksi, lanjut ke setup MCP FFmpeg untuk image resize:
1. Install MCP FFmpeg server
2. Konfigurasi image processing workflow
3. Integrasikan dengan upload logic

---

## 🎉 Checklist Selesai

- [ ] Supabase project dibuat
- [ ] Environment variables diisi
- [ ] Database schema dibuat
- [ ] Storage bucket dibuat
- [ ] RLS policies dibuat
- [ ] Koneksi berhasil ditest
- [ ] Upload image berhasil
- [ ] Save signature berhasil

Jika semua checklist tercentang 🟢, project Anda sudah terintegrasi dengan Supabase!
