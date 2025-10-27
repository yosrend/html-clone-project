const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function createSvgToPng() {
  const svgContent = fs.readFileSync('public/images/linkedin.svg', 'utf8');

  // Target size from original LinkedIn icon
  const width = 19;
  const height = 19;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  try {
    // Convert SVG to data URL
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

    // Load image from SVG data URL
    const img = await loadImage(svgDataUrl);
    ctx.drawImage(img, 0, 0, width, height);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('public/images/linkedin_from_svg.png', buffer);
    console.log('✅ SVG converted to PNG: public/images/linkedin_from_svg.png');
  } catch (err) {
    console.error('❌ Error converting SVG:', err);
    process.exit(1);
  }
}

createSvgToPng();