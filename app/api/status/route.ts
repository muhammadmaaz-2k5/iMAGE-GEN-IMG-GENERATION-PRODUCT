import { NextResponse } from 'next/server';
import { isDatabaseConnected } from '@/lib/db';
import { isCloudinaryConfigured } from '@/lib/cloudinary';

export async function GET() {
  const dbConnected = await isDatabaseConnected();
  const cloudinaryConfigured = isCloudinaryConfigured();
  const workerConfigured = Boolean(process.env.IMAGE_GEN_WORKER_URL || 'https://yellow-scene-ce97.22pwbcs0933.workers.dev');

  return NextResponse.json({
    status: 'ok',
    services: {
      worker: {
        status: workerConfigured ? 'active' : 'default',
        name: 'Cloudflare Worker AI',
      },
      cloudinary: {
        status: cloudinaryConfigured ? 'connected' : 'unconfigured',
        name: 'Cloudinary CDN & Media',
        info: cloudinaryConfigured ? `Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}` : 'Base64 fallback active',
      },
      neon: {
        status: dbConnected ? 'connected' : 'unconfigured',
        name: 'Neon Serverless Postgres',
        info: dbConnected ? 'Postgres database live' : 'In-memory fallback active',
      },
    },
  });
}
