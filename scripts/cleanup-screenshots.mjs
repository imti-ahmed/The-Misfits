import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET_NAME;
const DELETED_FILES = process.env.DELETED_FILES ?? '';

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY || !R2_BUCKET) {
  console.error('Missing R2 env vars. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME as GitHub Actions secrets.');
  process.exit(1);
}

const slugs = DELETED_FILES
  .split(/\s+/)
  .filter(f => f.startsWith('members/') && f.endsWith('.md'))
  .map(f => f.replace('members/', '').replace('.md', ''));

if (slugs.length === 0) {
  console.log('No member files deleted — nothing to clean up.');
  process.exit(0);
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
});

for (const slug of slugs) {
  const key = `screenshots/${slug}.jpg`;
  try {
    await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    console.log(`Deleted: ${key}`);
  } catch (err) {
    console.error(`Failed to delete ${key}: ${err.message}`);
  }
}
