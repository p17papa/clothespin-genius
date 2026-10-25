import { AutoModel, AutoProcessor, RawImage, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;
const MODEL_ID = 'briaai/RMBG-1.4';

let modelPromise: Promise<{ model: any; processor: any }> | null = null;

const loadModel = () => {
  if (!modelPromise) {
    modelPromise = (async () => {
      const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
      let model;
      try {
        model = await AutoModel.from_pretrained(MODEL_ID, {
          config: { model_type: 'custom' } as any,
          device: hasWebGPU ? 'webgpu' : 'wasm',
          dtype: 'fp32',
        } as any);
      } catch (e) {
        console.warn('WebGPU unavailable, falling back to wasm', e);
        model = await AutoModel.from_pretrained(MODEL_ID, {
          config: { model_type: 'custom' } as any,
          device: 'wasm',
          dtype: 'fp32',
        } as any);
      }
      const processor = await AutoProcessor.from_pretrained(MODEL_ID, {
        config: {
          do_normalize: true,
          do_pad: false,
          do_rescale: true,
          do_resize: true,
          image_mean: [0.5, 0.5, 0.5],
          feature_extractor_type: 'ImageFeatureExtractor',
          image_std: [1, 1, 1],
          resample: 2,
          rescale_factor: 0.00392156862745098,
          size: { width: 1024, height: 1024 },
        },
      } as any);
      return { model, processor };
    })().catch((e) => {
      modelPromise = null;
      throw e;
    });
  }
  return modelPromise;
};

/**
 * Removes the background from a photo.
 * - background 'white': solid white behind the subject (used for the body photo), JPEG output.
 * - background 'transparent': see-through background (used for clothes so they overlay the body), WebP/PNG output.
 */
export const removeBackground = async (
  imageElement: HTMLImageElement,
  background: 'white' | 'transparent' = 'white'
): Promise<Blob> => {
  let width = imageElement.naturalWidth;
  let height = imageElement.naturalHeight;
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const scale = MAX_IMAGE_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.drawImage(imageElement, 0, 0, width, height);

  const { model, processor } = await loadModel();
  const image = await RawImage.fromURL(canvas.toDataURL('image/png'));
  const { pixel_values } = await processor(image);
  const { output } = await model({ input: pixel_values });

  const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < mask.data.length; i++) {
    imageData.data[i * 4 + 3] = mask.data[i];
  }
  ctx.putImageData(imageData, 0, 0);

  // Crop tightly to the subject so clothes scale correctly onto the body
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mask.data[y * width + x] > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error('No subject found in photo');

  const pad = 8;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;

  const out = document.createElement('canvas');
  out.width = cw;
  out.height = ch;
  const outCtx = out.getContext('2d');
  if (!outCtx) throw new Error('Could not get output canvas context');
  if (background === 'white') {
    outCtx.fillStyle = '#FFFFFF';
    outCtx.fillRect(0, 0, cw, ch);
  }
  outCtx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);

  const type = background === 'white' ? 'image/jpeg' : 'image/webp';
  return new Promise((resolve, reject) => {
    out.toBlob((blob) => {
      if (blob) resolve(blob);
      else out.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to create image'))), 'image/png');
    }, type, 0.85);
  });
};

export const loadImage = (file: Blob | string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = typeof file === 'string' ? file : URL.createObjectURL(file);
  });

export const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
