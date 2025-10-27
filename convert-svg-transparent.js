const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToTransparentPng() {
  const svgContent = fs.readFileSync('public/images/linkedin.svg', 'utf8');

  // Target size from original LinkedIn icon
  const width = 19;
  const height = 19;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  try {
    // Convert SVG to data URL
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

    // Load image from SVG data URL
    const img = await loadImage(svgDataUrl);

    // Important: Do NOT fill background - preserve transparency
    // Remove this line to keep transparency: ctx.fillStyle = 'white'; ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, 0, 0, width, height);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('public/images/linkedin_transparent.png', buffer);
    console.log('✅ SVG converted to transparent PNG: public/images/linkedin_transparent.png');
  } catch (err) {
    console.error('❌ Error converting SVG:', err);
    process.exit(1);
  }
}

convertSvgToTransparentPng();