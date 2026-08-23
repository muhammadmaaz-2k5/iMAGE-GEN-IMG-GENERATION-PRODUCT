import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }
  return false;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ||
    process.env.CLOUDINARY_URL
  );
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  transformedUrl?: string;
  isCloudinary: boolean;
}

export async function uploadImageBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
    aspectRatio?: string;
    targetWidth?: number;
    targetHeight?: number;
    uploadPreset?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  const {
    folder = 'thumbnail-studio',
    publicId,
    tags = ['ai-generated', 'thumbnail-gen'],
    aspectRatio,
    targetWidth,
    targetHeight,
    uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET,
  } = options;

  if (configureCloudinary()) {
    try {
      const uploadParams: Record<string, any> = {
        folder,
        public_id: publicId,
        tags,
        resource_type: 'image',
        format: 'jpg',
      };

      if (uploadPreset) {
        uploadParams.upload_preset = uploadPreset;
      }

      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadParams,
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Cloudinary upload failed with empty result'));
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      });

      // Generate customized aspect ratio transformation URL
      let transformedUrl = uploadResult.secure_url;
      if (aspectRatio && uploadResult.public_id) {
        const arFormat = aspectRatio.replace(':', '_');
        transformedUrl = cloudinary.url(uploadResult.public_id, {
          transformation: [
            { crop: 'fill', gravity: 'auto', aspect_ratio: arFormat },
            ...(targetWidth && targetHeight ? [{ width: targetWidth, height: targetHeight }] : []),
            { quality: 'auto', fetch_format: 'auto' },
          ],
        });
      }

      return {
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        transformedUrl,
        isCloudinary: true,
      };
    } catch (error) {
      console.warn('[Cloudinary] Upload failed with preset/signed config, retrying default signed stream:', error);
      // Fallback without preset if preset had restrictions
      try {
        const fallbackResult = await new Promise<UploadApiResponse>((resolve, reject) => {
          const fallbackStream = cloudinary.uploader.upload_stream(
            {
              folder,
              public_id: publicId,
              tags,
              resource_type: 'image',
            },
            (err, res) => (err || !res ? reject(err) : resolve(res))
          );
          fallbackStream.end(buffer);
        });

        return {
          url: fallbackResult.url,
          secureUrl: fallbackResult.secure_url,
          publicId: fallbackResult.public_id,
          width: fallbackResult.width,
          height: fallbackResult.height,
          format: fallbackResult.format,
          transformedUrl: fallbackResult.secure_url,
          isCloudinary: true,
        };
      } catch (innerError) {
        console.warn('[Cloudinary] Secondary upload failed, using base64 fallback:', innerError);
      }
    }
  }

  // Base64 Data URL Fallback
  const base64 = buffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  return {
    url: dataUrl,
    secureUrl: dataUrl,
    publicId: publicId || `local-${Date.now()}`,
    width: targetWidth || 1024,
    height: targetHeight || 1024,
    format: 'jpg',
    transformedUrl: dataUrl,
    isCloudinary: false,
  };
}
