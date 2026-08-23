import { neon, neonConfig } from '@neondatabase/serverless';



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

// In-memory fallback if Neon DATABASE_URL is not configured yet
const inMemoryThumbnails: GeneratedThumbnailRecord[] = [];

let tableInitialized = false;

function getNeonClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

export async function isDatabaseConnected(): Promise<boolean> {
  const sql = getNeonClient();
  if (!sql) return false;
  try {
    const result = await sql`SELECT 1 as connected`;
    return Boolean(result && result.length > 0);
  } catch (error) {
    console.warn('[Neon DB] Connection check failed:', error);
    return false;
  }
}

export async function ensureDatabaseSchema() {
  if (tableInitialized) return;
  const sql = getNeonClient();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS generated_thumbnails (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        enhanced_prompt TEXT NOT NULL,
        platform VARCHAR(50) NOT NULL,
        aspect_ratio VARCHAR(20) NOT NULL,
        width INT NOT NULL,
        height INT NOT NULL,
        style VARCHAR(50) DEFAULT 'cinematic',
        image_url TEXT NOT NULL,
        cloudinary_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_thumbnails_created_at ON generated_thumbnails (created_at DESC);
    `;
    tableInitialized = true;
  } catch (error) {
    console.warn('[Neon DB] Table initialization error (falling back):', error);
  }
}

export async function saveThumbnailRecord(record: GeneratedThumbnailRecord): Promise<GeneratedThumbnailRecord> {
  const sql = getNeonClient();
  if (sql) {
    try {
      await ensureDatabaseSchema();
      await sql`
        INSERT INTO generated_thumbnails (
          id, prompt, enhanced_prompt, platform, aspect_ratio, width, height, style, image_url, cloudinary_id, created_at
        ) VALUES (
          ${record.id}, ${record.prompt}, ${record.enhanced_prompt}, ${record.platform}, ${record.aspect_ratio},
          ${record.width}, ${record.height}, ${record.style}, ${record.image_url}, ${record.cloudinary_id || null},
          ${record.created_at}
        )
        ON CONFLICT (id) DO UPDATE SET
          image_url = EXCLUDED.image_url,
          cloudinary_id = EXCLUDED.cloudinary_id;
      `;
      return record;
    } catch (error) {
      console.warn('[Neon DB] Save failed, saving to in-memory store:', error);
    }
  }

  // Fallback to in-memory store
  const existingIdx = inMemoryThumbnails.findIndex(t => t.id === record.id);
  if (existingIdx >= 0) {
    inMemoryThumbnails[existingIdx] = record;
  } else {
    inMemoryThumbnails.unshift(record);
  }
  return record;
}

export async function getThumbnailRecords(platform?: string, limit = 50): Promise<GeneratedThumbnailRecord[]> {
  const sql = getNeonClient();
  if (sql) {
    try {
      await ensureDatabaseSchema();
      let rows;
      if (platform && platform !== 'all') {
        rows = await sql`
          SELECT id, prompt, enhanced_prompt, platform, aspect_ratio, width, height, style, image_url, cloudinary_id, created_at
          FROM generated_thumbnails
          WHERE platform = ${platform}
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
      } else {
        rows = await sql`
          SELECT id, prompt, enhanced_prompt, platform, aspect_ratio, width, height, style, image_url, cloudinary_id, created_at
          FROM generated_thumbnails
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
      }
      return rows.map(r => ({
        id: String(r.id),
        prompt: String(r.prompt),
        enhanced_prompt: String(r.enhanced_prompt),
        platform: String(r.platform),
        aspect_ratio: String(r.aspect_ratio),
        width: Number(r.width),
        height: Number(r.height),
        style: String(r.style || 'cinematic'),
        image_url: String(r.image_url),
        cloudinary_id: r.cloudinary_id ? String(r.cloudinary_id) : null,
        created_at: new Date(r.created_at).toISOString()
      }));
    } catch (error) {
      console.warn('[Neon DB] Fetch failed, returning in-memory store:', error);
    }
  }

  if (platform && platform !== 'all') {
    return inMemoryThumbnails.filter(t => t.platform === platform).slice(0, limit);
  }
  return inMemoryThumbnails.slice(0, limit);
}

export async function deleteThumbnailRecord(id: string): Promise<boolean> {
  const sql = getNeonClient();
  if (sql) {
    try {
      await ensureDatabaseSchema();
      await sql`DELETE FROM generated_thumbnails WHERE id = ${id}`;
    } catch (error) {
      console.warn('[Neon DB] Delete failed:', error);
    }
  }

  const idx = inMemoryThumbnails.findIndex(t => t.id === id);
  if (idx >= 0) {
    inMemoryThumbnails.splice(idx, 1);
  }
  return true;
}
