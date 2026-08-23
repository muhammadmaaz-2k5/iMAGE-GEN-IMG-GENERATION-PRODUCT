import { prisma } from './prisma';

export interface GeneratedThumbnailRecord {
  id: string;
  prompt: string;
  enhanced_prompt: string;
  platform: string;
  aspect_ratio: string;
  width: number;
  height: number;
  style: string;
  image_url: string;
  cloudinary_id?: string | null;
  created_at: string;
}

// In-memory fallback if database connection is not configured or temporarily unreachable
const inMemoryThumbnails: GeneratedThumbnailRecord[] = [];

export async function isDatabaseConnected(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await prisma.generatedThumbnail.count();
    return true;
  } catch (error) {
    console.warn('[Prisma DB] Connection check failed:', error);
    return false;
  }
}

export async function saveThumbnailRecord(record: GeneratedThumbnailRecord): Promise<GeneratedThumbnailRecord> {
  if (process.env.DATABASE_URL) {
    try {
      const created = await prisma.generatedThumbnail.upsert({
        where: { id: record.id },
        update: {
          imageUrl: record.image_url,
          cloudinaryId: record.cloudinary_id || null,
        },
        create: {
          id: record.id,
          prompt: record.prompt,
          enhancedPrompt: record.enhanced_prompt,
          platform: record.platform,
          aspectRatio: record.aspect_ratio,
          width: record.width,
          height: record.height,
          style: record.style,
          imageUrl: record.image_url,
          cloudinaryId: record.cloudinary_id || null,
          createdAt: new Date(record.created_at),
        },
      });

      return {
        id: created.id,
        prompt: created.prompt,
        enhanced_prompt: created.enhancedPrompt,
        platform: created.platform,
        aspect_ratio: created.aspectRatio,
        width: created.width,
        height: created.height,
        style: created.style,
        image_url: created.imageUrl,
        cloudinary_id: created.cloudinaryId,
        created_at: created.createdAt.toISOString(),
      };
    } catch (error) {
      console.warn('[Prisma DB] Save failed, fallback to in-memory store:', error);
    }
  }

  // Fallback to in-memory store
  const existingIdx = inMemoryThumbnails.findIndex((t: GeneratedThumbnailRecord) => t.id === record.id);
  if (existingIdx >= 0) {
    inMemoryThumbnails[existingIdx] = record;
  } else {
    inMemoryThumbnails.unshift(record);
  }
  return record;
}

export async function getThumbnailRecords(platform?: string, limit = 50): Promise<GeneratedThumbnailRecord[]> {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.generatedThumbnail.findMany({
        where: platform && platform !== 'all' ? { platform } : undefined,
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return rows.map((r: {
        id: string;
        prompt: string;
        enhancedPrompt: string;
        platform: string;
        aspectRatio: string;
        width: number;
        height: number;
        style: string;
        imageUrl: string;
        cloudinaryId: string | null;
        createdAt: Date;
      }) => ({
        id: r.id,
        prompt: r.prompt,
        enhanced_prompt: r.enhancedPrompt,
        platform: r.platform,
        aspect_ratio: r.aspectRatio,
        width: r.width,
        height: r.height,
        style: r.style,
        image_url: r.imageUrl,
        cloudinary_id: r.cloudinaryId,
        created_at: r.createdAt.toISOString(),
      }));
    } catch (error) {
      console.warn('[Prisma DB] Fetch failed, returning in-memory fallback:', error);
    }
  }

  if (platform && platform !== 'all') {
    return inMemoryThumbnails.filter((t: GeneratedThumbnailRecord) => t.platform === platform).slice(0, limit);
  }
  return inMemoryThumbnails.slice(0, limit);
}

export async function deleteThumbnailRecord(id: string): Promise<boolean> {
  if (process.env.DATABASE_URL) {
    try {
      await prisma.generatedThumbnail.delete({
        where: { id },
      });
    } catch (error) {
      console.warn('[Prisma DB] Delete failed:', error);
    }
  }

  const idx = inMemoryThumbnails.findIndex((t: GeneratedThumbnailRecord) => t.id === id);
  if (idx >= 0) {
    inMemoryThumbnails.splice(idx, 1);
  }
  return true;
}
