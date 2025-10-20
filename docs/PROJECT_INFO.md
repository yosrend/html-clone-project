# Bistrochat Email Generator

## Overview
Project Next.js untuk membuat dan mengelola email signature dengan fitur upload gambar, preview real-time, dan integrasi social media.

## Tech Stack

### Framework & Library
- **Next.js 15.3.5** - React framework dengan App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion 12** - Animasi

### Database & ORM
- **Turso (LibSQL)** - Serverless SQLite database
- **Drizzle ORM 0.44.5** - Type-safe ORM
- **Drizzle Kit 0.31.4** - Database migrations

### UI Components
- **Shadcn UI** - Component library (Radix UI based)
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Sharp** - Image optimization

## Project Structure

```
bistrochat-email-generator/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── images/           # Image upload/retrieval
│   │   │   ├── signatures/       # Signature CRUD
│   │   │   └── upload-image/     # Image upload handler
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React Components
│   │   ├── EmailSignatureGenerator.tsx  # Main component
│   │   ├── ThemeProvider.tsx     # Theme management
│   │   ├── ThemeToggle.tsx       # Dark/Light mode toggle
│   │   └── ErrorReporter.tsx     # Error handling
│   │
│   ├── db/                       # Database
│   │   ├── index.ts              # DB client config
│   │   ├── schema.ts             # Database schema
│   │   └── seeds/                # Seed data
│   │
│   ├── lib/                      # Utilities
│   │   ├── supabase.ts           # Supabase client (optional)
│   │   └── utils.ts              # Helper functions
│   │
│   └── visual-edits/             # Visual editing tools
│
├── drizzle/                      # Database migrations
├── public/                       # Static assets
├── components.json               # Shadcn UI config
├── drizzle.config.ts             # Drizzle ORM config
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

## Database Schema

### Table: signatures
```typescript
{
  id: integer (Primary Key, Auto Increment)
  name: text (Not Null)
  title: text (Not Null)
  imageUrl: text (Nullable)
  linkedinUrl: text (Nullable)
  instagramUrl: text (Nullable)
  whatsappUrl: text (Nullable)
  html: text (Not Null)
  createdAt: integer (Timestamp)
  updatedAt: integer (Timestamp)
}
```

### Table: images
```typescript
{
  id: integer (Primary Key, Auto Increment)
  filename: text (Not Null)
  contentType: text (Not Null)
  data: blob (Not Null)
  createdAt: integer (Timestamp)
  updatedAt: integer (Timestamp)
}
```

## API Endpoints

### Signatures API

#### GET /api/signatures
Mengambil semua signatures
```typescript
Response: {
  signatures: Signature[]
}
```

#### POST /api/signatures
Membuat signature baru
```typescript
Body: {
  name: string
  title: string
  imageUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  whatsappUrl?: string
  html: string
}
Response: {
  signature: Signature
}
```

#### GET /api/signatures/[id]
Mengambil signature berdasarkan ID
```typescript
Response: {
  signature: Signature
}
```

#### PUT /api/signatures/[id]
Update signature
```typescript
Body: Partial<Signature>
Response: {
  signature: Signature
}
```

#### DELETE /api/signatures/[id]
Hapus signature
```typescript
Response: {
  success: boolean
}
```

### Images API

#### POST /api/upload-image
Upload gambar
```typescript
Body: FormData {
  image: File
}
Response: {
  url: string
  id: number
}
```

#### GET /api/images/[id]
Mengambil gambar berdasarkan ID
```typescript
Response: Image Blob
```

## Environment Variables

### Required
```env
TURSO_CONNECTION_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
```

### Optional
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Features

### Email Signature Generator
- ✅ Form input untuk nama dan title
- ✅ Upload gambar profil dengan crop tool
- ✅ Social media links (LinkedIn, Instagram, WhatsApp)
- ✅ Live preview signature
- ✅ Copy HTML signature
- ✅ Save/Load signatures dari database
- ✅ Dark/Light mode support

### UI/UX
- ✅ Responsive design
- ✅ Smooth animations dengan Framer Motion
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Theme persistence

## Scripts

```json
{
  "dev": "next dev --turbopack",      // Development dengan Turbopack
  "build": "next build",               // Production build
  "start": "next start",               // Production server
  "lint": "next lint"                  // Code linting
}
```

## Development

### Install Dependencies
```bash
npm install
```

### Setup Environment
1. Copy `.env.example` ke `.env.local`
2. Update dengan credentials Anda

### Run Database Migrations
```bash
npx drizzle-kit push
```

### Start Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy Options
- **Vercel** - Recommended (zero-config)
- **Netlify**
- **Docker**
- **VPS/Cloud Server**

## Additional Documentation

- `SUPABASE_SETUP.md` - Panduan setup Supabase
- `MCP_SERVERS_CONFIG.md` - Konfigurasi MCP servers
- `README.md` - Next.js starter documentation

## License

Private project - All rights reserved
