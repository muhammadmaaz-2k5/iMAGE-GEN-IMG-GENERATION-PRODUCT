import { NextRequest, NextResponse } from 'next/server';
import { buildFullPrompt, callImageGenWorker } from '@/lib/imagegen';
import { uploadImageBufferToCloudinary } from '@/lib/cloudinary';
import { saveThumbnailRecord, GeneratedThumbnailRecord } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, platformId = 'youtube-thumbnail', styleId = 'cinematic', lightingId = 'studio', enhancePrompt = true } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 1. Build optimized platform prompt
    const { fullPrompt, preset } = buildFullPrompt({
      prompt: prompt.trim(),
      platformId,
      styleId,
      lightingId,
      enhancePrompt,
    });

    const generationId = `thumb_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 2. Generate image via Cloudflare Worker
    const imageBuffer = await callImageGenWorker(fullPrompt);

    // 3. Upload to Cloudinary (or fallback to base64)
    const cloudinaryResult = await uploadImageBufferToCloudinary(imageBuffer, {
      folder: 'thumbnail-studio',
      publicId: generationId,
      tags: ['ai-thumbnail', platformId, styleId],
      aspectRatio: preset.aspectRatio,
      targetWidth: preset.width,
      targetHeight: preset.height,
    });

    // 4. Save metadata to Neon Database (or memory store)
    const record: GeneratedThumbnailRecord = {
      id: generationId,
      prompt: prompt.trim(),
      enhanced_prompt: fullPrompt,
      platform: preset.id,
      aspect_ratio: preset.aspectRatio,
      width: preset.width,
      height: preset.height,
      style: styleId,
      image_url: cloudinaryResult.transformedUrl || cloudinaryResult.secureUrl,
      cloudinary_id: cloudinaryResult.publicId,
      created_at: new Date().toISOString(),
    };

    const savedRecord = await saveThumbnailRecord(record);

    return NextResponse.json({
      success: true,
      data: {
        ...savedRecord,
        rawUrl: cloudinaryResult.secureUrl,
        transformedUrl: cloudinaryResult.transformedUrl,
        isCloudinary: cloudinaryResult.isCloudinary,
        presetName: preset.name,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[API /api/generate Error]:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
