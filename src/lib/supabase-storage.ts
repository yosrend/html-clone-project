import { supabase } from './supabase';

const BUCKET_NAME = 'signature-images';

export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    path: data.path,
    url: urlData.publicUrl,
    filename: file.name,
    contentType: file.type,
    size: file.size
  };
}

export async function deleteImage(path: string) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw error;
  return { success: true };
}

export async function listImages() {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list();

  if (error) throw error;
  return data;
}

export async function getImageUrl(path: string) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function downloadImage(path: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(path);

  if (error) throw error;
  return data;
}
