import { S3Client } from '@aws-sdk/client-s3';

// Optional R2 configuration - only error if actually used
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || 'placeholder';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || 'placeholder';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'placeholder';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'bistrochat-signatures';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Helper to check if R2 is configured
export const isR2Configured = () => {
  return R2_ACCOUNT_ID !== 'placeholder' && 
         R2_ACCESS_KEY_ID !== 'placeholder' && 
         R2_SECRET_ACCESS_KEY !== 'placeholder';
};
