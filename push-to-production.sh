#!/bin/bash

# Script untuk push ke production
# Jalankan: bash push-to-production.sh

cd "/Users/yoseprendi/Vibe Coding/html-clone-project"

echo "🚀 Pushing to production..."
echo ""

# Commit dengan bypass pre-commit hooks
git commit -m "feat: Add Vercel Blob storage, code protection & fix Next.js 15 build

- Vercel Blob storage integration with auto resize (Sharp)
- Code protection: disable right-click, F12, devtools detection  
- Fixed Next.js 15 async params in route handlers
- Fixed Sonner toast API changes
- Fixed TypeScript errors in UI components
- Production optimizations (no source maps, remove console)
- Complete documentation (6+ storage guides)
- Build passing for production

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>"

# Push ke GitHub
git push origin main

echo ""
echo "✅ Pushed to GitHub!"
echo "🔄 Vercel auto-deploying..."
echo ""
echo "Check deployment at: https://vercel.com/dashboard"
