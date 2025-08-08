#!/usr/bin/env node

import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';

const SOURCE_IMAGE = '../public/synthwave-horizon-bg-ultrawide.png';
const OUTPUT_DIR = '../public/backgrounds';

async function prepareBackgrounds() {
  try {
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    console.log('🎨 Preparing background images...\n');
    
    // For now, copy the original image to all sizes
    // In production, you would use the optimize-background.js script with sharp
    const variants = ['mobile', 'tablet', 'desktop', 'ultrawide'];
    
    for (const variant of variants) {
      console.log(`📸 Creating placeholder for ${variant}...`);
      
      // Copy original image as placeholder
      const outputPath = path.join(OUTPUT_DIR, `bg-${variant}.jpg`);
      await fs.copyFile(SOURCE_IMAGE, outputPath);
      
      console.log(`✅ ${variant} placeholder created\n`);
    }
    
    console.log('🎉 Placeholder images created!');
    console.log('\n⚠️  Note: Run "npm install sharp" and "node optimize-background.js" in the scripts directory');
    console.log('   to generate properly optimized images for each screen size.\n');
    
  } catch (error) {
    console.error('❌ Error preparing backgrounds:', error);
    process.exit(1);
  }
}

prepareBackgrounds();