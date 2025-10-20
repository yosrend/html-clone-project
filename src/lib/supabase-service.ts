import { supabase } from './supabase';
import type { Signature, InsertSignature, UpdateSignature, Image } from '@/types/database.types';

// Signatures CRUD Operations

export async function getAllSignatures() {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Signature[];
}

export async function getSignatureById(id: string) {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Signature;
}

export async function createSignature(signature: InsertSignature) {
  const { data, error } = await supabase
    .from('signatures')
    .insert(signature)
    .select()
    .single();

  if (error) throw error;
  return data as Signature;
}

export async function updateSignature(id: string, updates: UpdateSignature) {
  const { data, error } = await supabase
    .from('signatures')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Signature;
}

export async function deleteSignature(id: string) {
  const { error } = await supabase
    .from('signatures')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

// Images CRUD Operations

export async function getAllImages() {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Image[];
}

export async function getImageById(id: string) {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Image;
}

export async function createImageRecord(image: Omit<Image, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('images')
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data as Image;
}

export async function deleteImageRecord(id: string) {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}
