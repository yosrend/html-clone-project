// Quick script to verify R2 environment variables
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Checking Cloudflare R2 Environment Variables...\n');

const required = {
  'R2_ACCOUNT_ID': process.env.R2_ACCOUNT_ID,
  'R2_ACCESS_KEY_ID': process.env.R2_ACCESS_KEY_ID,
  'R2_SECRET_ACCESS_KEY': process.env.R2_SECRET_ACCESS_KEY,
  'R2_BUCKET_NAME': process.env.R2_BUCKET_NAME,
  'R2_PUBLIC_URL': process.env.R2_PUBLIC_URL,
};

let allGood = true;

Object.entries(required).forEach(([key, value]) => {
  if (!value || value.includes('your_') || value.includes('xxxx')) {
    console.log(`❌ ${key}: Not set or using example value`);
    allGood = false;
  } else {
    console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ All environment variables are set!');
  console.log('\nNext step: npm run dev');
  console.log('Then test: curl http://localhost:3000/api/test-r2');
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('\nFollow the setup guide:');
  console.log('1. Create Cloudflare account');
  console.log('2. Create R2 bucket: bistrochat-signatures');
  console.log('3. Generate API token');
  console.log('4. Enable public access');
  console.log('5. Update .env.local with real values');
}

console.log('='.repeat(50) + '\n');
