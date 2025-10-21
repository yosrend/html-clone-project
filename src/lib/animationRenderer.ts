// Animation Renderer - Convert CSS animations to animated GIF
// @ts-ignore - gif.js doesn't have proper TypeScript definitions
import GIF from 'gif.js';

export type AnimationType = 
  | 'none'
  | 'bounce' | 'flash' | 'pulse' | 'rubberBand' | 'rubberband' | 'shake' | 'swing'
  | 'tada' | 'wobble' | 'jello' | 'heartBeat' | 'heartbeat'
  | 'fade' | 'fadeIn' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'fadeInUp'
  | 'zoom' | 'bounceIn' | 'bounceInDown' | 'bounceInLeft' | 'bounceInRight' | 'bounceInUp'
  | 'zoomIn' | 'zoomInDown' | 'zoomInLeft' | 'zoomInRight' | 'zoomInUp'
  | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'
  | 'rotate' | 'flip' | 'roll'
  | 'float' | 'spin' | 'ping' | 'pop' | 'glow' | 'blur-in';

interface GifOptions {
  width: number;
  height: number;
  duration: number; // milliseconds
  fps: number;
  quality: number; // 1-30 (lower = better quality, slower)
  repeat?: number; // 0 = infinite, n = repeat n times
}

const DEFAULT_OPTIONS: GifOptions = {
  width: 200, // Increased from 150 for better quality
  height: 200, // Increased from 150 for better quality
  duration: 2000,
  fps: 20,
  quality: 10, // Lower number = better quality (1-30 scale)
  repeat: 0, // infinite loop
};

/**
 * Create animated GIF from image with specified animation
 */
export async function createAnimatedGif(
  imageUrl: string,
  animation: AnimationType,
  options: Partial<GifOptions> = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (animation === 'none') {
    throw new Error('No animation selected');
  }

  // Load image
  const img = await loadImage(imageUrl);
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext('2d', { 
    willReadFrequently: true,
    alpha: true 
  });
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set high quality rendering for crisp, clean edges
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Initialize GIF encoder with transparency
  const gif = new GIF({
    workers: 2,
    quality: opts.quality,
    width: opts.width,
    height: opts.height,
    repeat: opts.repeat,
    transparent: 0x000000, // Enable transparency (black = transparent)
    workerScript: '/gif.worker.js',
  });

  const frameCount = Math.ceil((opts.duration / 1000) * opts.fps);
  const frameDelay = 1000 / opts.fps;

  // Generate frames
  for (let i = 0; i < frameCount; i++) {
    const progress = i / frameCount;
    
    // Clear canvas - transparent background
    ctx.clearRect(0, 0, opts.width, opts.height);
    
    // Render animation frame (only circular image, no background fill)
    renderAnimationFrame(ctx, img, animation, progress, opts.width, opts.height);
    
    // Add frame to GIF with transparency
    gif.addFrame(ctx, { delay: frameDelay, copy: true, transparent: true });
  }

  // Render GIF and return blob
  return new Promise((resolve, reject) => {
    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });
    
    gif.on('error', (error: Error) => {
      reject(error);
    });
    
    gif.render();
  });
}

/**
 * Load image from URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    
    img.src = url;
  });
}

/**
 * Render single animation frame on canvas
 */
function renderAnimationFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  animation: AnimationType,
  progress: number,
  width: number,
  height: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Special handling for float animation - move circle position, not content
  if (animation === 'float') {
    const floatHeight = 15;
    const offsetY = Math.sin(progress * Math.PI * 2) * floatHeight;
    
    // Use smaller radius to ensure circle stays within canvas bounds during float
    const radius = Math.min(width, height) / 2 - floatHeight;
    
    ctx.save();
    
    ctx.beginPath();
    // Circle moves up and down within canvas bounds
    ctx.arc(centerX, centerY + offsetY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Scale and position image to fit the smaller circle
    const scale = radius * 2 / Math.min(width, height);
    const scaledSize = Math.min(width, height) * scale;
    const imgX = (width - scaledSize) / 2;
    const imgY = (height - scaledSize) / 2 + offsetY;
    
    ctx.drawImage(img, imgX, imgY, scaledSize, scaledSize);
    
    ctx.restore();
    return;
  }
  
  // For other animations, apply circular clip first
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, Math.min(width, height) / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.save();

  switch (animation) {
    case 'bounce': {
      const bounceHeight = 15;
      const offsetY = Math.abs(Math.sin(progress * Math.PI * 2)) * bounceHeight;
      ctx.translate(0, -offsetY);
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'pulse': {
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'shake': {
      const shakeAmount = 5;
      const offsetX = Math.sin(progress * Math.PI * 8) * shakeAmount;
      ctx.translate(offsetX, 0);
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'swing': {
      const angle = Math.sin(progress * Math.PI * 2) * 0.3;
      ctx.translate(centerX, 0);
      ctx.rotate(angle);
      ctx.drawImage(img, -centerX, 0, width, height);
      break;
    }

    case 'tada': {
      const angle = Math.sin(progress * Math.PI * 4) * 0.1;
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'wobble': {
      const angle = Math.sin(progress * Math.PI * 4) * 0.15;
      const offsetX = Math.sin(progress * Math.PI * 4) * 10;
      ctx.translate(centerX + offsetX, centerY);
      ctx.rotate(angle);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'jello': {
      const t = (progress * 2) % 1;
      const skewX = Math.sin(t * Math.PI * 4) * 0.2;
      const skewY = Math.sin(t * Math.PI * 4) * 0.1;
      ctx.translate(centerX, centerY);
      ctx.transform(1, skewY, skewX, 1, 0, 0);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'heartBeat':
    case 'heartbeat': {
      const beat = progress * 4 % 1;
      const scale = beat < 0.2 ? 1 + beat * 0.5 : 
                    beat < 0.4 ? 1.1 - (beat - 0.2) * 0.5 :
                    beat < 0.6 ? 1 + (beat - 0.4) * 0.75 : 1.15 - (beat - 0.6) * 0.375;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }
    
    case 'rubberBand':
    case 'rubberband': {
      const t = progress * 2;
      let scaleX = 1, scaleY = 1;
      if (t < 0.3) {
        scaleX = 1 + Math.sin(t / 0.3 * Math.PI) * 0.3;
        scaleY = 1 - Math.sin(t / 0.3 * Math.PI) * 0.1;
      } else if (t < 0.6) {
        scaleX = 1.3 - ((t - 0.3) / 0.3) * 0.5;
        scaleY = 0.9 + ((t - 0.3) / 0.3) * 0.25;
      } else {
        scaleX = 0.8 + ((t - 0.6) / 0.4) * 0.2;
        scaleY = 1.15 - ((t - 0.6) / 0.4) * 0.15;
      }
      ctx.translate(centerX, centerY);
      ctx.scale(scaleX, scaleY);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'rotate': {
      const angle = progress * Math.PI * 2;
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'flip': {
      const angle = progress * Math.PI;
      const scaleX = Math.cos(angle);
      ctx.translate(centerX, centerY);
      ctx.scale(scaleX, 1);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'flash': {
      const opacity = progress % 0.5 < 0.25 ? 0.2 : 1;
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'fadeIn':
    case 'fadeInDown':
    case 'fadeInUp':
    case 'fadeInLeft':
    case 'fadeInRight': {
      const opacity = Math.min(1, progress * 2);
      let offsetX = 0, offsetY = 0;
      if (animation.includes('Down')) offsetY = -(1 - opacity) * 30;
      if (animation.includes('Up')) offsetY = (1 - opacity) * 30;
      if (animation.includes('Left')) offsetX = (1 - opacity) * 30;
      if (animation.includes('Right')) offsetX = -(1 - opacity) * 30;
      ctx.globalAlpha = opacity;
      ctx.translate(offsetX, offsetY);
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'bounceIn':
    case 'bounceInDown':
    case 'bounceInUp':
    case 'bounceInLeft':
    case 'bounceInRight': {
      const t = Math.min(1, progress * 1.5);
      const scale = t < 0.6 ? t * 1.2 : 
                    t < 0.8 ? 0.72 + (t - 0.6) * 1.4 : 1;
      let offsetX = 0, offsetY = 0;
      if (animation.includes('Down')) offsetY = -(1 - t) * 50;
      if (animation.includes('Up')) offsetY = (1 - t) * 50;
      if (animation.includes('Left')) offsetX = (1 - t) * 50;
      if (animation.includes('Right')) offsetX = -(1 - t) * 50;
      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'zoomIn':
    case 'zoomInDown':
    case 'zoomInUp':
    case 'zoomInLeft':
    case 'zoomInRight': {
      const t = Math.min(1, progress * 1.5);
      const scale = 0.3 + t * 0.7;
      const opacity = t;
      let offsetX = 0, offsetY = 0;
      if (animation.includes('Down')) offsetY = -(1 - t) * 30;
      if (animation.includes('Up')) offsetY = (1 - t) * 30;
      if (animation.includes('Left')) offsetX = (1 - t) * 30;
      if (animation.includes('Right')) offsetX = -(1 - t) * 30;
      ctx.globalAlpha = opacity;
      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'fade': {
      const opacity = Math.min(1, progress * 2);
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'zoom': {
      const t = Math.min(1, progress * 1.5);
      const scale = 0.3 + t * 0.7;
      const opacity = t;
      ctx.globalAlpha = opacity;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'slide-left': {
      const t = Math.min(1, progress * 1.5);
      const offsetX = (1 - t) * width;
      const opacity = t;
      ctx.globalAlpha = opacity;
      ctx.translate(offsetX, 0);
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'slide-right': {
      const t = Math.min(1, progress * 1.5);
      const offsetX = -(1 - t) * width;
      const opacity = t;
      ctx.globalAlpha = opacity;
      ctx.translate(offsetX, 0);
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'slide-up': {
      const t = Math.min(1, progress * 1.5);
      const offsetY = (1 - t) * height;
      const opacity = t;
      ctx.globalAlpha = opacity;
      ctx.translate(0, offsetY);
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'slide-down': {
      const t = Math.min(1, progress * 1.5);
      const offsetY = -(1 - t) * height;
      const opacity = t;
      ctx.globalAlpha = opacity;
      ctx.translate(0, offsetY);
      ctx.drawImage(img, 0, 0, width, height);
      break;
    }

    case 'roll': {
      const t = Math.min(1, progress * 1.5);
      const angle = (1 - t) * Math.PI * 2;
      const offsetX = (1 - t) * width;
      const opacity = t;
      ctx.globalAlpha = opacity;
      ctx.translate(centerX + offsetX, centerY);
      ctx.rotate(angle);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'spin': {
      const angle = progress * Math.PI * 2;
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'ping': {
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.2;
      const opacity = 1 - Math.abs(Math.sin(progress * Math.PI * 2)) * 0.5;
      ctx.globalAlpha = opacity;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'pop': {
      const t = Math.min(1, progress * 2);
      const scale = t < 0.5 ? t * 2.4 : 1.2 - (t - 0.5) * 0.4;
      const opacity = Math.min(1, t * 2);
      ctx.globalAlpha = opacity;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -centerX, -centerY, width, height);
      break;
    }

    case 'glow': {
      const glowIntensity = (Math.sin(progress * Math.PI * 2) + 1) / 2;
      ctx.shadowColor = 'rgba(255, 255, 255, ' + glowIntensity + ')';
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.drawImage(img, 0, 0, width, height);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      break;
    }

    case 'blur-in': {
      const t = Math.min(1, progress * 1.5);
      const blurAmount = (1 - t) * 10;
      if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
      }
      ctx.globalAlpha = t;
      ctx.drawImage(img, 0, 0, width, height);
      ctx.filter = 'none';
      break;
    }

    default:
      ctx.drawImage(img, 0, 0, width, height);
  }

  ctx.restore();
  ctx.restore(); // Restore clip
}

/**
 * Get estimated GIF file size (rough estimate)
 */
export function estimateGifSize(
  width: number,
  height: number,
  duration: number,
  fps: number
): number {
  const frameCount = Math.ceil((duration / 1000) * fps);
  const pixelsPerFrame = width * height;
  const bytesPerPixel = 0.8; // Rough estimate with compression
  return Math.ceil(frameCount * pixelsPerFrame * bytesPerPixel);
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
