import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/vercel-blob-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum 5MB allowed' },
        { status: 400 }
      );
    }

    // Upload ke Vercel Blob dengan resize otomatis
    const result = await uploadImage(file, {
      width: 400,
      height: 400,
      fit: 'cover',
      quality: 85,
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.url,
      pathname: result.pathname,
      size: result.size,
      contentType: result.contentType,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
