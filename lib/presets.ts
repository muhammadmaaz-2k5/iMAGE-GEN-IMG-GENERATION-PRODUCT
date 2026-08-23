export interface PlatformPreset {
  id: string;
  name: string;
  category: 'social' | 'video' | 'web' | 'branding';
  aspectRatio: string; // e.g. "16:9", "1:1", "9:16", "4:5", "1.91:1", "2:3"
  ratioValue: number; // width / height
  width: number;
  height: number;
  iconName: string;
  badge: string;
  description: string;
  framingPrompt: string;
  compositionHint: string;
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    category: 'video',
    aspectRatio: '16:9',
    ratioValue: 16 / 9,
    width: 1280,
    height: 720,
    iconName: 'Youtube',
    badge: '16:9',
    description: 'High-CTR YouTube video thumbnail, vibrant focal point, expressive lighting',
    framingPrompt: '16:9 wide landscape cinematic composition, rule of thirds, high contrast, dramatic eye-catching focal subject, vivid colorful studio lighting, YouTube thumbnail aesthetic, sharp 8k render',
    compositionHint: 'Keep the main subject slightly off-center with space for bold typography.'
  },
  {
    id: 'instagram-square',
    name: 'Instagram Square',
    category: 'social',
    aspectRatio: '1:1',
    ratioValue: 1 / 1,
    width: 1080,
    height: 1080,
    iconName: 'Instagram',
    badge: '1:1',
    description: 'Perfect square post for Instagram feed and carousel covers',
    framingPrompt: '1:1 square centered composition, balanced symmetry, clean modern aesthetic, pristine studio lighting, Instagram explore feed style, ultra high resolution',
    compositionHint: 'Ideal for centered portraits, single objects, and balanced symmetrical visuals.'
  },
  {
    id: 'instagram-portrait',
    name: 'Instagram Portrait',
    category: 'social',
    aspectRatio: '4:5',
    ratioValue: 4 / 5,
    width: 1080,
    height: 1350,
    iconName: 'Instagram',
    badge: '4:5',
    description: 'Maximum feed real estate on Instagram, vertical portrait composition',
    framingPrompt: '4:5 vertical portrait composition, immersive depth, top-to-bottom visual hierarchy, dynamic soft lighting, editorial magazine look, highly detailed',
    compositionHint: 'Fills the maximum screen area in the Instagram feed for higher engagement.'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story / Reel',
    category: 'social',
    aspectRatio: '9:16',
    ratioValue: 9 / 16,
    width: 1080,
    height: 1920,
    iconName: 'Sparkles',
    badge: '9:16',
    description: 'Full-screen 9:16 vertical cover for Reels and Stories',
    framingPrompt: '9:16 ultra vertical full-screen mobile composition, subject centered vertically, leaving top and bottom safe zones, cinematic mobile wallpaper grade, vibrant atmosphere',
    compositionHint: 'Keep key subjects in the center 60% to avoid being covered by UI controls.'
  },
  {
    id: 'tiktok',
    name: 'TikTok Video Cover',
    category: 'video',
    aspectRatio: '9:16',
    ratioValue: 9 / 16,
    width: 1080,
    height: 1920,
    iconName: 'Video',
    badge: '9:16',
    description: 'Viral vertical cover image for TikTok videos',
    framingPrompt: '9:16 vertical framing, ultra high-energy viral aesthetic, pop colors, sharp focus, dynamic volumetric lighting, TikTok cover thumbnail style',
    compositionHint: 'Use vibrant contrast that grabs viewer attention in fast scrolling feeds.'
  },
  {
    id: 'whatsapp-status',
    name: 'WhatsApp Status',
    category: 'social',
    aspectRatio: '9:16',
    ratioValue: 9 / 16,
    width: 1080,
    height: 1920,
    iconName: 'MessageCircle',
    badge: '9:16',
    description: 'Full-screen vertical status update image',
    framingPrompt: '9:16 tall vertical mobile composition, crisp details, soft ambient lighting, clean aesthetic, mobile screen friendly',
    compositionHint: 'Clear, crisp visuals tailored for instant messaging status views.'
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    category: 'social',
    aspectRatio: '1.91:1',
    ratioValue: 1200 / 628,
    width: 1200,
    height: 628,
    iconName: 'Facebook',
    badge: '1.91:1',
    description: 'Optimized landscape image for Facebook feed & link previews',
    framingPrompt: '1.91:1 wide landscape composition, crisp focal subject, warm natural lighting, professional social post quality, engaging newsfeed aesthetic',
    compositionHint: 'Wide composition suited for desktop and mobile Facebook timeline.'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    category: 'social',
    aspectRatio: '1.91:1',
    ratioValue: 1200 / 628,
    width: 1200,
    height: 628,
    iconName: 'Linkedin',
    badge: '1.91:1',
    description: 'Clean, professional landscape graphic for LinkedIn articles and posts',
    framingPrompt: '1.91:1 horizontal corporate executive aesthetic, sleek minimalist composition, modern architectural lighting, high-end editorial quality',
    compositionHint: 'Polished, thought-leadership style suitable for tech, business, and careers.'
  },
  {
    id: 'x-twitter-post',
    name: 'X / Twitter Post',
    category: 'social',
    aspectRatio: '16:9',
    ratioValue: 16 / 9,
    width: 1200,
    height: 675,
    iconName: 'Twitter',
    badge: '16:9',
    description: 'Standard horizontal image for X timeline posts and thread covers',
    framingPrompt: '16:9 wide aspect ratio, bold contrast, minimal clutter, strong visual hook, crystal clear details, optimized for quick scrolling timelines',
    compositionHint: 'High-contrast imagery that stands out on dark and light mode feeds.'
  },
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    category: 'social',
    aspectRatio: '2:3',
    ratioValue: 2 / 3,
    width: 1000,
    height: 1500,
    iconName: 'Pin',
    badge: '2:3',
    description: 'Tall vertical pin optimized for Pinterest visual search discovery',
    framingPrompt: '2:3 vertical Pinterest pin composition, aesthetically pleasing tones, cozy warm atmospheric lighting, creative visual storytelling, highly shareable',
    compositionHint: 'Vertical framing that commands screen height in Pinterest multi-column grid.'
  },
  {
    id: 'og-image',
    name: 'OpenGraph (OG) Image',
    category: 'web',
    aspectRatio: '1.91:1',
    ratioValue: 1200 / 630,
    width: 1200,
    height: 630,
    iconName: 'Globe',
    badge: '1.91:1',
    description: 'Social preview meta card (og:image) for web links & SEO',
    framingPrompt: '1.91:1 social card banner, elegant brand hero backdrop, subtle lighting gradients, modern tech aesthetic, premium web design asset',
    compositionHint: 'Crisp background suited for link embeds across Discord, Slack, and iMessage.'
  },
  {
    id: 'website-hero',
    name: 'Website Hero Banner',
    category: 'web',
    aspectRatio: '16:9',
    ratioValue: 16 / 9,
    width: 1920,
    height: 1080,
    iconName: 'Layout',
    badge: '16:9',
    description: 'Full HD hero banner for landing pages, blogs, and marketing sites',
    framingPrompt: '16:9 panoramic web hero header, wide perspective, atmospheric depth, soft gradient falloff, clean negative space on one side for web typography',
    compositionHint: 'Features generous negative space on one side for headline text placement.'
  },
  {
    id: 'profile-picture',
    name: 'Profile Picture / Avatar',
    category: 'branding',
    aspectRatio: '1:1',
    ratioValue: 1 / 1,
    width: 800,
    height: 800,
    iconName: 'User',
    badge: '1:1',
    description: 'Circular crop-ready avatar for social media profiles and channels',
    framingPrompt: '1:1 centered circular avatar composition, striking headshot/character portrait, clear silhouette, soft bokeh backdrop, studio rim lighting, expressive face',
    compositionHint: 'Centered subject with ample padding around corners for circular crop.'
  },
  {
    id: 'app-icon',
    name: 'App Icon / Logo',
    category: 'branding',
    aspectRatio: '1:1',
    ratioValue: 1 / 1,
    width: 1024,
    height: 1024,
    iconName: 'Square',
    badge: '1:1',
    description: 'Distinctive app icon and brand emblem for App Store & Google Play',
    framingPrompt: '1:1 app icon design, single bold iconic emblem, 3D isometric bevel, subtle frosted glass texture, vibrant gradient background, iOS squircle ready, ultra clean vector aesthetic',
    compositionHint: 'Bold, recognizable single symbol that stays distinct at 32px or 1024px.'
  }
];

export interface StyleOption {
  id: string;
  name: string;
  promptSuffix: string;
  icon: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'cinematic', name: 'Cinematic Movie', promptSuffix: 'cinematic lighting, anamorphic lens flare, filmic color grading, depth of field, 35mm photograph, hyper-detailed', icon: '🎬' },
  { id: '3d-render', name: '3D Pixar / Octane', promptSuffix: '3D CGI render, Unreal Engine 5, Octane render, ray tracing, cute stylized vibrant textures, claymation aesthetic', icon: '✨' },
  { id: 'hyperreal', name: 'Photorealistic', promptSuffix: 'photorealistic RAW photo, shot on Sony A7R V, 85mm f/1.4 lens, natural skin textures, studio lighting, hyper-realistic', icon: '📸' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', promptSuffix: 'cyberpunk neon futuristic city atmosphere, glowing holographic accents, dark moody contrast, rain reflections', icon: '🌆' },
  { id: 'anime', name: 'Anime / Makoto Shinkai', promptSuffix: 'anime aesthetic, Makoto Shinkai art style, vibrant sky with fluffy clouds, gorgeous soft lighting, crisp lineart', icon: '🎨' },
  { id: 'minimalist', name: 'Minimalist Modern', promptSuffix: 'minimalist clean design, pastel gradient tones, elegant negative space, Bauhaus inspired, studio backdrop', icon: '⚪' },
  { id: 'fantasy', name: 'Epic Fantasy Art', promptSuffix: 'epic digital concept art, magical glowing particles, atmospheric fog, intricate details, fantasy illustration', icon: '🧙' },
  { id: 'vector', name: 'Flat Vector Art', promptSuffix: 'flat vector illustration, bold clean geometry, modern UI illustration style, crisp outlines, solid colors', icon: '📐' }
];

export interface LightingOption {
  id: string;
  name: string;
  promptSuffix: string;
}

export const LIGHTING_OPTIONS: LightingOption[] = [
  { id: 'studio', name: 'Studio Softbox', promptSuffix: 'professional multi-point studio softbox lighting' },
  { id: 'golden-hour', name: 'Golden Hour Sunset', promptSuffix: 'warm golden hour sunlight with gentle lens flare' },
  { id: 'neon-glow', name: 'Vibrant Neon Glow', promptSuffix: 'vivid dual-tone cyan and magenta neon rim lighting' },
  { id: 'dramatic-moody', name: 'Dramatic & Moody', promptSuffix: 'dramatic chiaroscuro lighting, deep shadows, high contrast' },
  { id: 'volumetric', name: 'Volumetric God Rays', promptSuffix: 'volumetric god rays shining through dust particles, dreamy haze' }
];

export const SAMPLE_PROMPTS = [
  "A futuristic electric hypercar speeding through a neon Tokyo rainy street at night",
  "A cute fluffy cybernetic kitten wearing high-tech glowing VR goggles",
  "A cozy glowing glass coffee shop nestled in a snowy alpine pine forest",
  "A floating crystalline island in the sky with cascading waterfalls and cherry blossoms",
  "An intrepid astronaut discovering ancient glowing alien glyphs inside a crystal cave",
  "A gourmet stack of fluffy blueberry pancakes dripping with golden maple syrup and fresh mint",
  "A mechanical steampunk pocket watch with intricate glowing brass gears and clockwork mechanisms",
  "A mythical majestic phoenix rising from swirling stardust and cosmic nebulae"
];
