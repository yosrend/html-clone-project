import { PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './r2-client';
import sharp from 'sharp';

export interface UploadImageResult {
  path: string;
  url: string;
  filename: string;
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
  options: ResizeOptions = {}
): Promise<Buffer> {
  const {
    width = 400,
    height = 400,
    fit = 'cover',
    quality = 85,
  } = options;

  try {
    const resized = await sharp(buffer)
      .resize(width, height, { fit })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    return resized;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw new Error('Failed to resize image');
  }
}

/**
 * Upload image ke Cloudflare R2
 */
export async function uploadImage(
  file: File | Buffer,
  options: ResizeOptions = {}
): Promise<UploadImageResult> {
  try {
    let buffer: Buffer;
    let contentType: string;
    let originalSize: number;

    // Convert File to Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      contentType = file.type;
      originalSize = file.size;
    } else {
      buffer = file;
      contentType = 'image/jpeg';
      originalSize = buffer.length;
    }

    // Resize image jika ada options
    if (options.width || options.height) {
      buffer = await resizeImage(buffer, options);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = contentType.split('/')[1] || 'jpg';
    const filename = `signature-${timestamp}-${random}.${ext}`;
    const path = `signatures/${filename}`;

    // Upload ke R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: path,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Generate public URL
    const url = R2_PUBLIC_URL 
      ? `${R2_PUBLIC_URL}/${path}`
      : `https://${R2_BUCKET_NAME}.r2.dev/${path}`;

    return {
      path,
      url,
      filename,
      contentType,
      size: buffer.length,
    };
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw new Error('Failed to upload image to R2');
  }
}

/**
 * Delete image dari R2
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: path,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw new Error('Failed to delete image from R2');
  }
}

/**
 * List images di R2
 */
export async function listImages(prefix: string = 'signatures/'): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await r2Client.send(command);
    
    return response.Contents?.map(item => item.Key || '') || [];
  } catch (error) {
    console.error('Error listing R2 images:', error);
    throw new Error('Failed to list images from R2');
  }
}

/**
 * Get public URL untuk image
 */
export function getPublicUrl(path: string): string {
  return R2_PUBLIC_URL 
    ? `${R2_PUBLIC_URL}/${path}`
    : `https://${R2_BUCKET_NAME}.r2.dev/${path}`;
}
