import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { signatures } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const signature = await db.select()
      .from(signatures)
      .where(eq(signatures.id, parseInt(id)))
      .limit(1);

    if (signature.length === 0) {
      return NextResponse.json({ 
        error: 'Signature not found',
        code: "SIGNATURE_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(signature[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const { name, title, imageUrl, linkedinUrl, instagramUrl, whatsappUrl, html } = requestBody;

    // Validation rules
    if (name !== undefined && name !== null && name.trim().length > 100) {
      return NextResponse.json({ 
        error: "Name cannot exceed 100 characters",
        code: "NAME_TOO_LONG" 
      }, { status: 400 });
    }

    if (title !== undefined && title !== null && title.trim().length > 120) {
      return NextResponse.json({ 
        error: "Title cannot exceed 120 characters",
        code: "TITLE_TOO_LONG" 
      }, { status: 400 });
    }

    // Check if signature exists
    const existingSignature = await db.select()
      .from(signatures)
      .where(eq(signatures.id, parseInt(id)))
      .limit(1);

    if (existingSignature.length === 0) {
      return NextResponse.json({ 
        error: 'Signature not found',
        code: "SIGNATURE_NOT_FOUND" 
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: Date.now()
    };

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (html !== undefined) {
      updateData.html = html;
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl === '' ? null : imageUrl;
    }

    if (linkedinUrl !== undefined) {
      updateData.linkedinUrl = linkedinUrl === '' ? null : linkedinUrl;
    }

    if (instagramUrl !== undefined) {
      updateData.instagramUrl = instagramUrl === '' ? null : instagramUrl;
    }

    if (whatsappUrl !== undefined) {
      updateData.whatsappUrl = whatsappUrl === '' ? null : whatsappUrl;
    }

    const updated = await db.update(signatures)
      .set(updateData)
      .where(eq(signatures.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Signature not found',
        code: "SIGNATURE_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if signature exists
    const existingSignature = await db.select()
      .from(signatures)
      .where(eq(signatures.id, parseInt(id)))
      .limit(1);

    if (existingSignature.length === 0) {
      return NextResponse.json({ 
        error: 'Signature not found',
        code: "SIGNATURE_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(signatures)
      .where(eq(signatures.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Signature not found',
        code: "SIGNATURE_NOT_FOUND" 
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Signature deleted successfully',
      signature: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}