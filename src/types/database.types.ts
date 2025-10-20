export interface Signature {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  html: string;
  animation_type: string;
  animation_loop: boolean;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  filename: string;
  content_type: string;
  storage_path: string;
  url: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface InsertSignature {
  name: string;
  title: string;
  image_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  html: string;
  animation_type?: string;
  animation_loop?: boolean;
}

export interface UpdateSignature {
  name?: string;
  title?: string;
  image_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  html?: string;
  animation_type?: string;
  animation_loop?: boolean;
}
