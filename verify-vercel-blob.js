// Quick script to verify Vercel Blob environment variables
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Checking Vercel Blob Environment Variables...\n');

const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.log('❌ BLOB_READ_WRITE_TOKEN: Not set');
  console.log('\n' + '='.repeat(50));
  console.log('❌ Environment variable missing!');
  console.log('\nSetup steps:');
  console.log('1. Install Vercel CLI: npm i -g vercel');
  console.log('2. Login: vercel login');
  console.log('3. Link project: vercel link');
  console.log('4. Pull env vars: vercel env pull .env.local');
  console.log('\nOr manually:');
  console.log('1. Go to Vercel dashboard');
  console.log('2. Project Settings → Storage → Create Blob store');
  console.log('3. Copy BLOB_READ_WRITE_TOKEN');
  console.log('4. Add to .env.local');
  console.log('='.repeat(50) + '\n');
} else if (token.includes('your_') || token.includes('xxxx')) {
  console.log('❌ BLOB_READ_WRITE_TOKEN: Using example value');
  console.log('\n' + '='.repeat(50));
  console.log('❌ Replace with real token from Vercel!');
  console.log('='.repeat(50) + '\n');
} else {
  console.log(`✅ BLOB_READ_WRITE_TOKEN: ${token.substring(0, 30)}...`);
  console.log('\n' + '='.repeat(50));
  console.log('✅ Environment variable is set!');
  console.log('\nNext steps:');
  console.log('1. npm run dev');
  console.log('2. Test: curl http://localhost:3000/api/test-vercel-blob');
  console.log('3. Open: http://localhost:3000');
  console.log('4. Upload image via UI');
  console.log('='.repeat(50) + '\n');
}
