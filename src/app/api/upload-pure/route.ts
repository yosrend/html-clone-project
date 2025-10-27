import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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

    // Upload to Vercel Blob WITHOUT any compression or conversion
    // Preserve original file quality and transparency
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop() || 'png';
    const pathname = `signatures/pure-${timestamp}-${random}.${fileExt}`;

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type, // Preserve original content type
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name,
      size: file.size,
      contentType: file.type,
      message: 'File uploaded without compression - original quality preserved'
    });
  } catch (error) {
    console.error('Pure upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}