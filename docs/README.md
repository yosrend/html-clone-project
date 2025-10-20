# Bistrochat Email Generator

A modern Next.js application for creating professional email signatures with advanced animation features and Supabase integration.

## 🚀 Features

- **Email Signature Generator** - Create professional email signatures
- **26 Animation Types** - Entrance, attention seekers, continuous, and special effects
- **Loop Control** - Infinite loops with customizable interval timing (0-10s)
- **Image Upload** - Profile image with circular crop functionality
- **Social Media Integration** - LinkedIn, Instagram, WhatsApp links
- **Supabase Backend** - Cloud database and storage integration
- **Responsive Design** - Mobile-friendly interface
- **Real-time Preview** - Live signature preview with animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.5, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Animations**: Framer Motion, CSS Keyframes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Image Processing**: React Easy Crop
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd bistrochat-email-generator
npm install
```

### 2. Install Storage Dependencies

```bash
npm install @vercel/blob sharp
```

### 3. Setup Storage (Choose One)

#### Option A: Vercel Blob (Recommended - 5 Minutes!)

```bash
# Install Vercel CLI
npm i -g vercel

# Login & deploy
vercel login
vercel

# Enable Blob Storage in Vercel Dashboard:
# Project → Storage → Create Blob Store

# Download environment variables
vercel env pull .env.local
```

#### Option B: Cloudflare R2 (For High Traffic)

See complete guide: [CLOUDFLARE_R2_QUICK_START.md](./CLOUDFLARE_R2_QUICK_START.md)

#### Option C: Supabase (All-in-One)

See complete guide: [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Documentation

Complete documentation available in the `/docs` folder:

### Storage Setup Guides

- **[STORAGE_FINAL_COMPARISON.md](./STORAGE_FINAL_COMPARISON.md)** - ⭐ Which storage to choose?
- **[VERCEL_BLOB_QUICK_START.md](./VERCEL_BLOB_QUICK_START.md)** - Vercel Blob setup (5 minutes!)
- **[VERCEL_BLOB_SETUP.md](./VERCEL_BLOB_SETUP.md)** - Complete Vercel Blob guide
- **[CLOUDFLARE_R2_QUICK_START.md](./CLOUDFLARE_R2_QUICK_START.md)** - Cloudflare R2 quick setup
- **[CLOUDFLARE_R2_SETUP.md](./CLOUDFLARE_R2_SETUP.md)** - Complete Cloudflare R2 guide
- **[SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md)** - Supabase quick setup
- **[SUPABASE_SETUP_COMPLETE.md](./SUPABASE_SETUP_COMPLETE.md)** - Complete Supabase guide

### Animation & Features

- **[ANIMATION_IMPLEMENTATION.md](./ANIMATION_IMPLEMENTATION.md)** - Animation system documentation
- **[EXPANDED_ANIMATIONS_GUIDE.md](./EXPANDED_ANIMATIONS_GUIDE.md)** - 26 animation types guide
- **[LOOP_ANIMATION_FEATURE.md](./LOOP_ANIMATION_FEATURE.md)** - Loop control and interval features

### Development

- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Development setup and structure
- **[PROJECT_INFO.md](./PROJECT_INFO.md)** - Project information

## 🎨 Animation Features

### Animation Categories

1. **Entrance Animations** - Fade, Zoom, Slide, Rotate, Flip, Roll
2. **Attention Seekers** - Bounce, Shake, Swing, Wobble, Jello, Heartbeat
3. **Continuous Animations** - Float, Pulse, Spin, Ping
4. **Special Effects** - Pop, Glow, Blur In

### Loop Control System

- **Interval Duration**: 0-10 seconds with 0.5s precision
- **Smart Looping**: Different logic for continuous vs entrance animations
- **Email Compatible**: Pure CSS animations for maximum email client support

## 🗄️ Storage Setup

### Pilih Storage Provider

Project ini mendukung 3 storage options:

### 1. Vercel Blob (Recommended) ⭐

**Best for:** Quick start, MVP, small-medium projects

- ✅ Setup tercepat (5 menit)
- ✅ Zero config hassle
- ✅ Perfect Next.js integration
- ✅ 500MB storage + 100GB bandwidth gratis

**Setup Guide:** [VERCEL_BLOB_QUICK_START.md](./VERCEL_BLOB_QUICK_START.md)

### 2. Cloudflare R2

**Best for:** High traffic, cost optimization

- ✅ 10GB storage gratis
- ✅ Unlimited bandwidth (no egress fees!)
- ✅ Paling murah untuk scale
- ✅ S3-compatible API

**Setup Guide:** [CLOUDFLARE_R2_QUICK_START.md](./CLOUDFLARE_R2_QUICK_START.md)

### 3. Supabase

**Best for:** All-in-one solution (storage + database + auth)

- ✅ Complete backend platform
- ✅ Excellent dashboard
- ✅ Built-in auth & database
- ✅ 1GB storage + 2GB bandwidth gratis

**Setup Guide:** [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md)

---

**Bingung pilih mana?** → Baca [STORAGE_FINAL_COMPARISON.md](./STORAGE_FINAL_COMPARISON.md)

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── EmailSignatureGenerator.tsx  # Main component
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── supabase-service.ts # Database operations
│   └── supabase-storage.ts # File operations
└── types/                 # TypeScript definitions
    └── database.types.ts  # Database schemas
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🌟 Key Components

### EmailSignatureGenerator Component

Main component handling:
- Form input validation
- Image upload and cropping
- Animation selection and configuration
- Real-time signature generation
- Supabase integration

### Animation System

- **CSS Keyframes**: Email-compatible animations
- **Dynamic Duration**: Customizable interval timing
- **Type Safety**: Full TypeScript support
- **Responsive Preview**: Live animation preview

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the [documentation](./docs/)
2. Review the [troubleshooting guide](./SUPABASE_SETUP_COMPLETE.md#troubleshooting)
3. Open an issue in the repository

---

## 🎉 Getting Help

Need help setting up? Check out:
- [Supabase Complete Setup Guide](./SUPABASE_SETUP_COMPLETE.md)
- [Animation Features Guide](./EXPANDED_ANIMATIONS_GUIDE.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)

Built with ❤️ for the Bistrochat team.
