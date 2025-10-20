import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { signatures } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const results = await db.select()
      .from(signatures)
      .orderBy(desc(signatures.updatedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      title, 
      imageUrl, 
      linkedinUrl, 
      instagramUrl, 
      whatsappUrl, 
      html 
    } = body;

    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ 
        error: "Name is required and must be a string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name cannot be empty",
        code: "EMPTY_NAME" 
      }, { status: 400 });
    }

    if (name.length > 100) {
      return NextResponse.json({ 
        error: "Name must be 100 characters or less",
        code: "NAME_TOO_LONG" 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ 
        error: "Title is required and must be a string",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (title.trim().length === 0) {
      return NextResponse.json({ 
        error: "Title cannot be empty",
        code: "EMPTY_TITLE" 
      }, { status: 400 });
    }

    if (title.length > 120) {
      return NextResponse.json({ 
        error: "Title must be 120 characters or less",
        code: "TITLE_TOO_LONG" 
      }, { status: 400 });
    }

    if (!html || typeof html !== 'string') {
      return NextResponse.json({ 
        error: "HTML is required and must be a string",
        code: "MISSING_HTML" 
      }, { status: 400 });
    }

    if (html.trim().length === 0) {
      return NextResponse.json({ 
        error: "HTML cannot be empty",
        code: "EMPTY_HTML" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedTitle = title.trim();
    const sanitizedHtml = html.trim();

    // Convert empty strings to null for optional fields
    const sanitizedImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() 
      ? imageUrl.trim() 
      : null;
    const sanitizedLinkedinUrl = linkedinUrl && typeof linkedinUrl === 'string' && linkedinUrl.trim() 
      ? linkedinUrl.trim() 
      : null;
    const sanitizedInstagramUrl = instagramUrl && typeof instagramUrl === 'string' && instagramUrl.trim() 
      ? instagramUrl.trim() 
      : null;
    const sanitizedWhatsappUrl = whatsappUrl && typeof whatsappUrl === 'string' && whatsappUrl.trim() 
      ? whatsappUrl.trim() 
      : null;

    const now = Date.now();

    const newSignature = await db.insert(signatures)
      .values({
        name: sanitizedName,
        title: sanitizedTitle,
        imageUrl: sanitizedImageUrl,
        linkedinUrl: sanitizedLinkedinUrl,
        instagramUrl: sanitizedInstagramUrl,
        whatsappUrl: sanitizedWhatsappUrl,
        html: sanitizedHtml,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newSignature[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}