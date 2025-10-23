/**
 * Script to upload Union.svg logo to Vercel Blob
 * Converts SVG to PNG for better email client compatibility
 */

const { put } = require('@vercel/blob');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function uploadLogoToBlob() {
  try {
    console.log('🔄 Converting Union.svg to PNG...');
    
    // Read SVG file
    const svgPath = path.join(__dirname, 'public/images/Union.svg');
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG with Sharp
    // Scale up for better quality (90x15 → 270x45 @ 3x)
    const pngBuffer = await sharp(svgBuffer)
      .resize(270, 45, { // 3x size for crisp rendering
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png({
        quality: 100,
        compressionLevel: 9,
      })
      .toBuffer();
    
    console.log('✅ PNG conversion complete');
    console.log(`📏 PNG size: ${Math.round(pngBuffer.length / 1024)}KB`);
    
    // Generate pathname
    const timestamp = Date.now();
    const pathname = `logos/bistrochat-logo-${timestamp}.png`;
    
    console.log('🔄 Uploading to Vercel Blob...');
    
    // Upload to Vercel Blob
    const blob = await put(pathname, pngBuffer, {
      access: 'public',
      contentType: 'image/png',
    });
    
    console.log('✅ Upload successful!');
    console.log('\n📊 Upload Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`URL: ${blob.url}`);
    console.log(`Pathname: ${blob.pathname}`);
    console.log(`Content-Type: ${blob.contentType}`);
    console.log(`Size: ${Math.round(pngBuffer.length / 1024)}KB`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Copy the URL above');
    console.log('2. Update EmailSignatureGenerator.tsx:');
    console.log('   const logoUrl = \'' + blob.url + '\';');
    console.log('3. Test in email clients (Gmail, Outlook, etc.)');
    
    return blob;
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('BLOB_TOKEN')) {
      console.error('\n💡 Make sure BLOB_READ_WRITE_TOKEN is set in .env.local');
    }
    
    process.exit(1);
  }
}

// Run the script
uploadLogoToBlob();
