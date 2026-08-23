import { PLATFORM_PRESETS, STYLE_OPTIONS, LIGHTING_OPTIONS } from './presets';

const DEFAULT_WORKER_URL = 'https://yellow-scene-ce97.22pwbcs0933.workers.dev';
const DEFAULT_BEARER_TOKEN = '12345678';

export interface GenerationRequest {
  prompt: string;
  platformId: string;
  styleId?: string;
  lightingId?: string;
  enhancePrompt?: boolean;
}

export function buildFullPrompt(request: GenerationRequest): { fullPrompt: string; preset: typeof PLATFORM_PRESETS[0] } {
  const preset = PLATFORM_PRESETS.find(p => p.id === request.platformId) || PLATFORM_PRESETS[0];
  const style = STYLE_OPTIONS.find(s => s.id === request.styleId);
  const lighting = LIGHTING_OPTIONS.find(l => l.id === request.lightingId);

  const promptParts: string[] = [request.prompt.trim()];

  // Add platform-specific composition & framing instruction
  if (preset.framingPrompt) {
    promptParts.push(preset.framingPrompt);
  }

  // Add style modifiers
  if (style?.promptSuffix) {
    promptParts.push(style.promptSuffix);
  }

  // Add lighting modifiers
  if (lighting?.promptSuffix) {
    promptParts.push(lighting.promptSuffix);
  }

  // Add quality booster if enhance is requested
  if (request.enhancePrompt) {
    promptParts.push('masterpiece, ultra-sharp focus, volumetric lighting, award-winning thumbnail composition, rich vibrant color grade, highly detailed textures');
  }

  const fullPrompt = promptParts.filter(Boolean).join(', ');
  return { fullPrompt, preset };
}

export async function callImageGenWorker(prompt: string): Promise<Buffer> {
  const workerUrl = process.env.IMAGE_GEN_WORKER_URL || DEFAULT_WORKER_URL;
  const bearerToken = process.env.IMAGE_GEN_API_KEY || DEFAULT_BEARER_TOKEN;

  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown worker error');
    throw new Error(`Image Gen Worker error (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
