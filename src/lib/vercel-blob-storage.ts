import { put, del, list } from '@vercel/blob';
import sharp from 'sharp';

export interface UploadImageResult {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

export interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality?: number;
}

/**
 * Resize image menggunakan Sharp
 */
export async function resizeImage(
  buffer: Buffer,
  options: ResizeOptions = {},
  contentType: string = 'image/jpeg'
): Promise<Buffer> {
  const {
    width = 400,
    height = 400,
    fit = 'cover',
    quality = 85,
  } = options;

  try {
    const sharpInstance = sharp(buffer).resize(width, height, { fit });

    // Preserve PNG transparency by using PNG format for PNG files
    if (contentType === 'image/png') {
      const resized = await sharpInstance
        .png({
          quality: Math.round(quality * 0.9), // Convert 1-100 to PNG compression
          compressionLevel: 9,
          adaptiveFiltering: true,
          force: true // Ensure PNG output
        })
        .toBuffer();
      return resized;
    }
    // Convert to JPEG for other formats (JPG, WebP, etc.)
    else {
      const resized = await sharpInstance
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
      return resized;
    }
  } catch (error) {
    console.error('Error resizing image:', error);
    throw new Error('Failed to resize image');
  }
}

/**
 * Upload image ke Vercel Blob
 */
export async function uploadImage(
  file: File | Buffer,
  options: ResizeOptions = {}
): Promise<UploadImageResult> {
  try {
    let buffer: Buffer;
    let contentType: string;
    let filename: string;

    // Convert File to Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      contentType = file.type;
      filename = file.name;
    } else {
      buffer = file;
      contentType = 'image/jpeg';
      filename = 'image.jpg';
    }

    // Resize image jika ada options
    if (options.width || options.height) {
      buffer = await resizeImage(buffer, options, contentType);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = contentType.split('/')[1] || 'jpg';
    const pathname = `signatures/signature-${timestamp}-${random}.${ext}`;

    // Upload ke Vercel Blob
    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || contentType,
      size: buffer.length,
    };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload image to Vercel Blob');
  }
}

/**
 * Delete image dari Vercel Blob
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    throw new Error('Failed to delete image from Vercel Blob');
  }
}

/**
 * List images di Vercel Blob
 */
export async function listImages(prefix: string = 'signatures/'): Promise<string[]> {
  try {
    const { blobs } = await list({
      prefix,
    });
    
    return blobs.map(blob => blob.url);
  } catch (error) {
    console.error('Error listing Vercel Blob images:', error);
    throw new Error('Failed to list images from Vercel Blob');
  }
}
