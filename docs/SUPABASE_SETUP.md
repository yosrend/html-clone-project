# Setup Supabase untuk Project

## 1. Install Supabase Client

Jalankan command berikut untuk install Supabase:

```bash
npm install @supabase/supabase-js
```

## 2. Dapatkan Credentials dari Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Login atau buat akun baru
3. Buat project baru atau pilih existing project
4. Di dashboard project, klik **Settings** (gear icon)
5. Pilih **API** di sidebar
6. Copy credentials berikut:
   - **Project URL** (contoh: https://xxxxx.supabase.co)
   - **anon/public key** (Anon Key)

## 3. Update Environment Variables

Buka file `.env.local` dan update dengan credentials Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Cara Menggunakan Supabase Client

File konfigurasi sudah dibuat di `src/lib/supabase.ts`. Contoh penggunaan:

### Query Data
```typescript
import { supabase } from '@/lib/supabase';

// Select data
const { data, error } = await supabase
  .from('your_table')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert({ column: 'value' });

// Update data
const { data, error } = await supabase
  .from('your_table')
  .update({ column: 'new_value' })
  .eq('id', 1);

// Delete data
const { data, error } = await supabase
  .from('your_table')
  .delete()
  .eq('id', 1);
```

### Upload File ke Storage
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/filename.jpg', file);
```

### Authentication
```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
const { error } = await supabase.auth.signOut();
```

## 5. Database Schema

Untuk membuat tabel di Supabase:

1. Buka **Table Editor** di Supabase Dashboard
2. Klik **New Table**
3. Atau gunakan **SQL Editor** untuk menjalankan SQL commands

Contoh SQL untuk membuat tabel:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

## Note Penting

- Project ini saat ini menggunakan **Turso (LibSQL)** sebagai database utama
- Supabase dapat digunakan bersamaan untuk fitur seperti:
  - Authentication
  - Storage (upload file/gambar)
  - Realtime subscriptions
  - Database tambahan
