import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export async function GET() {
  try {
    // Test upload
    const testContent = `Test file uploaded at ${new Date().toISOString()}`;
    const testFilename = 'test/connection-test.txt';
    
    const blob = await put(testFilename, testContent, {
      access: 'public',
      contentType: 'text/plain',
    });

    // Test delete
    await del(blob.url);

    return NextResponse.json({
      success: true,
      message: 'Vercel Blob connection successful',
      data: {
        uploaded: true,
        url: blob.url,
        deleted: true,
      },
    });
  } catch (error) {
    console.error('Vercel Blob connection error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Vercel Blob connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure BLOB_READ_WRITE_TOKEN is set in .env.local',
      },
      { status: 500 }
    );
  }
}
