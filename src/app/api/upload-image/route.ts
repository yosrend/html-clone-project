import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { images } from '@/db/schema';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Resize image to 50% using sharp
    const sharpImage = sharp(buffer);
    const metadata = await sharpImage.metadata();
    const newWidth = Math.floor(metadata.width! * 0.5);
    const newHeight = Math.floor(metadata.height! * 0.5);
    const resizedBuffer = await sharpImage.resize(newWidth, newHeight).toBuffer();

    const now = Date.now();

    // Insert resized image data into database
    const newImage = await db.insert(images).values({
      filename: file.name,
      contentType: file.type,
      data: resizedBuffer,
      createdAt: now,
      updatedAt: now,
    }).returning();

    const imageUrl = `/api/images/${newImage[0].id}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error }, { status: 500 });
  }
}