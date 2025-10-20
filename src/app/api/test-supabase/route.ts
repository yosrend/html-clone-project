import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test connection by counting signatures
    const { count, error } = await supabase
      .from('signatures')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful! ✅',
      signatureCount: count
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Supabase connection failed ❌',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { data, error } = await supabase
      .from('signatures')
      .insert({
        name: 'Test User',
        title: 'Test Title',
        html: '<p>Test HTML Signature</p>',
        animation_type: 'fade',
        animation_loop: false
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Test signature created! ✅',
      data
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create test signature ❌',
      error: error.message
    }, { status: 500 });
  }
}
