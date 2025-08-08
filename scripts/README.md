# Background Image Optimization Scripts

This directory contains scripts for optimizing the synthwave background image for different screen sizes.

## Quick Start

For development, placeholder images have already been created. To generate properly optimized images:

1. Install dependencies:
   ```bash
   cd scripts
   npm install
   ```

2. Run the optimization script:
   ```bash
   npm run optimize-bg
   ```

## Scripts

### optimize-background.js
- Uses Sharp library to resize and optimize images
- Creates WebP and JPEG versions for each screen size
- Generates optimized versions for:
  - Mobile (768x1024) - Portrait orientation
  - Tablet (1024x768) - Landscape orientation  
  - Desktop (1920x1080) - Standard HD
  - Ultrawide (3440x1440) - Original aspect ratio

### prepare-backgrounds.js
- Creates placeholder images for development
- Copies original image to all size variants
- No dependencies required

## Image Formats

- **WebP**: Modern format with better compression (85% quality)
- **JPEG**: Fallback for older browsers (90% quality)

## CSS Implementation

The responsive backgrounds are implemented in `src/index.css` with:
- Media queries for different screen sizes
- WebP detection with JavaScript fallback
- Preload hints in index.html for performance