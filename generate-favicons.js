/**
 * Generate PNG favicons from SVG using sharp
 * Run: node generate-favicons.js
 * 
 * Requires: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // iOS
  { size: 192, name: 'android-chrome-192x192.png' }, // Android
  { size: 512, name: 'android-chrome-512x512.png' }, // Android splash
];

const svgPath = path.join(__dirname, 'web', 'assets', 'proof-favicon.svg');
const outputDir = path.join(__dirname, 'web', 'assets');

async function generateFavicons() {
  console.log('🎨 Generating favicon PNG files...\n');
  
  if (!fs.existsSync(svgPath)) {
    console.error('❌ SVG file not found:', svgPath);
    process.exit(1);
  }

  for (const { size, name } of sizes) {
    try {
      const outputPath = path.join(outputDir, name);
      
      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}:`, error.message);
    }
  }
  
  console.log('\n✨ Favicon generation complete!');
  console.log('\nGenerated files:');
  sizes.forEach(({ name }) => console.log(`  - web/assets/${name}`));
}

generateFavicons().catch(console.error);
