/**
 * Image processing utilities with Instagram-style filters
 * Combines filter functions with canvas-based image manipulation
 */

import { filterPresets, getFilterById, type FilterPreset, type FilterFunction } from './instaFilters';
import * as basicFilters from './filters';

// Re-export filter presets for convenience
export { filterPresets, getFilterById, type FilterPreset, type FilterFunction };
export { filterCategories } from './instaFilters';

export interface ImageStyle {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  category: FilterPreset['category'];
  apply: FilterFunction;
}

// Convert FilterPreset to ImageStyle for backward compatibility
export const imageStyles: ImageStyle[] = filterPresets.map(preset => ({
  id: preset.id,
  name: preset.name,
  nameKo: preset.nameKo,
  description: preset.description,
  category: preset.category,
  apply: preset.apply,
}));

/**
 * Apply a filter to an image and return the result as a data URL
 * @param imageUrl - Source image URL (can be blob URL or data URL)
 * @param filterId - Filter preset ID to apply
 * @param strength - Filter strength (0-1, default 1)
 * @returns Promise resolving to the processed image as blob URL
 */
export async function applyFilterToImage(
  imageUrl: string,
  filterId: string,
  strength: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Apply filter if not 'normal'
        if (filterId !== 'normal') {
          const filter = getFilterById(filterId);
          if (filter) {
            // If strength is less than 1, blend with original
            if (strength < 1) {
              // Store original pixel data
              const originalData = new Uint8ClampedArray(imageData.data);

              // Apply filter
              filter.apply(imageData);

              // Blend with original based on strength
              for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = originalData[i] * (1 - strength) + imageData.data[i] * strength;
                imageData.data[i + 1] = originalData[i + 1] * (1 - strength) + imageData.data[i + 1] * strength;
                imageData.data[i + 2] = originalData[i + 2] * (1 - strength) + imageData.data[i + 2] * strength;
              }
            } else {
              filter.apply(imageData);
            }
          }
        }

        // Put processed image data back
        ctx.putImageData(imageData, 0, 0);

        // Convert to blob URL
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.95
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use applyFilterToImage instead
 */
export async function applyStyleToImage(
  imageUrl: string,
  style: ImageStyle
): Promise<string> {
  return applyFilterToImage(imageUrl, style.id);
}

/**
 * Generate a thumbnail preview of a filter effect
 * @param imageUrl - Source image URL
 * @param filterId - Filter preset ID
 * @param size - Thumbnail size (default 100)
 * @returns Promise resolving to thumbnail as data URL
 */
export async function generateFilterThumbnail(
  imageUrl: string,
  filterId: string,
  size: number = 100
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Calculate thumbnail dimensions maintaining aspect ratio
        const aspectRatio = img.width / img.height;
        let width = size;
        let height = size;

        if (aspectRatio > 1) {
          height = size / aspectRatio;
        } else {
          width = size * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw scaled image
        ctx.drawImage(img, 0, 0, width, height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);

        // Apply filter if not 'normal'
        if (filterId !== 'normal') {
          const filter = getFilterById(filterId);
          if (filter) {
            filter.apply(imageData);
          }
        }

        // Put processed image data back
        ctx.putImageData(imageData, 0, 0);

        // Return as data URL for fast inline display
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Apply additional effects like vignette, noise, or sharpen
 * @param imageUrl - Source image URL
 * @param effects - Effects to apply
 * @returns Promise resolving to processed image as blob URL
 */
export async function applyEffects(
  imageUrl: string,
  effects: {
    vignette?: number;   // 0-1
    noise?: number;      // 0-100
    sharpen?: number;    // 0-2
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Apply effects in order
        if (effects.sharpen && effects.sharpen > 0) {
          imageData = basicFilters.sharpen(imageData, effects.sharpen);
        }

        if (effects.noise && effects.noise > 0) {
          imageData = basicFilters.noise(imageData, effects.noise);
        }

        if (effects.vignette && effects.vignette > 0) {
          imageData = basicFilters.vignette(imageData, effects.vignette);
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.95
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Download an image from a URL
 * @param url - Image URL to download
 * @param filename - Filename for the download
 */
export function downloadImage(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Revoke a blob URL to free memory
 * @param url - Blob URL to revoke
 */
export function revokeImageUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
