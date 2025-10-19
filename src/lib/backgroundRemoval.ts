import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b2-clothes', {
      device: 'webgpu',
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Invalid segmentation result');
    }
    
    console.log('Segmentation complete, found', result.length, 'segments');
    
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    outputCtx.drawImage(canvas, 0, 0);
    
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Create a combined mask from all detected segments (clothes, person, etc.)
    const combinedMask = new Float32Array(outputCanvas.width * outputCanvas.height);
    
    // Combine all relevant masks (excluding background)
    for (const segment of result) {
      const label = segment.label.toLowerCase();
      // Include person, clothing items, but exclude background
      if (label !== 'background' && label !== 'wall' && label !== 'floor' && segment.mask) {
        console.log('Including segment:', label, 'with score:', segment.score);
        for (let i = 0; i < segment.mask.data.length; i++) {
          combinedMask[i] = Math.max(combinedMask[i], segment.mask.data[i]);
        }
      }
    }
    
    // Apply aggressive threshold and edge refinement
    const threshold = 0.3; // Lower threshold to capture more of the subject
    for (let i = 0; i < combinedMask.length; i++) {
      let maskValue = combinedMask[i];
      
      // Apply threshold
      if (maskValue < threshold) {
        maskValue = 0;
      } else {
        // Smooth the edges with a slight curve
        maskValue = Math.pow((maskValue - threshold) / (1 - threshold), 0.7);
      }
      
      const alpha = Math.round(maskValue * 255);
      data[i * 4 + 3] = alpha;
    }
    
    // Apply edge smoothing
    const smoothedData = new Uint8ClampedArray(data);
    const width = outputCanvas.width;
    const height = outputCanvas.height;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const centerAlpha = data[idx + 3];
        
        if (centerAlpha > 0 && centerAlpha < 255) {
          // Average with neighbors for smoother edges
          const neighbors = [
            data[((y - 1) * width + x) * 4 + 3],
            data[((y + 1) * width + x) * 4 + 3],
            data[(y * width + (x - 1)) * 4 + 3],
            data[(y * width + (x + 1)) * 4 + 3],
          ];
          const avgAlpha = (centerAlpha + neighbors.reduce((a, b) => a + b, 0)) / 5;
          smoothedData[idx + 3] = Math.round(avgAlpha);
        }
      }
    }
    
    outputCtx.putImageData(new ImageData(smoothedData, width, height), 0, 0);
    console.log('Mask applied and refined successfully');
    
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const loadImage = (file: Blob | string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    if (typeof file === 'string') {
      img.src = file;
    } else {
      img.src = URL.createObjectURL(file);
    }
  });
};

export const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
