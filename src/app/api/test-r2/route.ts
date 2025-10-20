import { NextResponse } from 'next/server';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2-client';

export async function GET() {
  try {
    // Test 1: Upload test file
    const testContent = `Test file uploaded at ${new Date().toISOString()}`;
    const testKey = 'test/connection-test.txt';
    
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    });

    await r2Client.send(uploadCommand);

    // Test 2: Read file back
    const getCommand = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey,
    });

    const response = await r2Client.send(getCommand);
    const bodyContents = await response.Body?.transformToString();

    return NextResponse.json({
      success: true,
      message: 'R2 connection successful',
      data: {
        bucket: R2_BUCKET_NAME,
        uploaded: true,
        retrieved: bodyContents === testContent,
        testContent: bodyContents,
      },
    });
  } catch (error) {
    console.error('R2 connection error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'R2 connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
