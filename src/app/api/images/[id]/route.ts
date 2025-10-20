import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { images } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Query the database for the image
    const image = await db.select()
      .from(images)
      .where(eq(images.id, parseInt(id)))
      .limit(1);

    // Return 404 if image not found
    if (image.length === 0) {
      return NextResponse.json({ 
        error: 'Image not found' 
      }, { status: 404 });
    }

    const imageRecord = image[0];

    // Return the BLOB data with proper Content-Type header
    return new Response(imageRecord.data, {
      headers: {
        'Content-Type': imageRecord.contentType,
      },
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}