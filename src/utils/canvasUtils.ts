import JSZip from 'jszip';
import {
  FilterPreset,
  FilterType,
  ImageAdjustments,
  SplitDirection,
  SplitResult,
  TransformState,
} from '../types';

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  warmth: 0,
  tint: 0,
  blur: 0,
  vignette: 0,
  sharpness: 0,
  highlights: 0,
  shadows: 0,
};

export const DEFAULT_TRANSFORM: TransformState = {
  rotate: 0,
  fineRotate: 0,
  flipH: false,
  flipV: false,
};

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'none',
    name: 'Original',
    category: 'Standard',
    previewColor: 'from-slate-700 to-slate-800',
  },
  {
    id: 'vivid',
    name: 'Vivid Pop',
    category: 'Color',
    previewColor: 'from-amber-500 to-rose-500',
  },
  {
    id: 'warm',
    name: 'Warm Sunset',
    category: 'Atmosphere',
    previewColor: 'from-amber-600 to-orange-400',
  },
  {
    id: 'cool',
    name: 'Nordic Frost',
    category: 'Atmosphere',
    previewColor: 'from-cyan-600 to-sky-400',
  },
  {
    id: 'grayscale',
    name: 'Mono Clean',
    category: 'Standard',
    previewColor: 'from-zinc-600 to-zinc-400',
  },
  {
    id: 'noir',
    name: 'High Noir',
    category: 'Artistic',
    previewColor: 'from-black to-zinc-700',
  },
  {
    id: 'vintage',
    name: 'Vintage 70s',
    category: 'Artistic',
    previewColor: 'from-amber-800 to-yellow-600',
  },
  {
    id: 'sepia',
    name: 'Classic Sepia',
    category: 'Standard',
    previewColor: 'from-yellow-900 to-amber-700',
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    category: 'Artistic',
    previewColor: 'from-teal-600 to-orange-500',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'Artistic',
    previewColor: 'from-fuchsia-600 to-cyan-500',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    category: 'Atmosphere',
    previewColor: 'from-indigo-950 to-slate-700',
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    category: 'Color',
    previewColor: 'from-pink-400 to-violet-300',
  },
  {
    id: 'invert',
    name: 'Negative',
    category: 'Artistic',
    previewColor: 'from-white to-slate-900',
  },
  {
    id: 'fade',
    name: 'Matte Fade',
    category: 'Atmosphere',
    previewColor: 'from-stone-500 to-stone-400',
  },
];

/**
 * Generates an optimized CSS filter string for live canvas/CSS rendering
 */
export function getCSSFilterString(
  adjustments: ImageAdjustments,
  filter: FilterType,
  filterIntensity: number = 100
): string {
  const parts: string[] = [];

  // Brightness: -100 to 100 -> 0% to 200%
  const brightnessVal = 100 + adjustments.brightness + adjustments.exposure * 0.8;
  parts.push(`brightness(${Math.max(0, brightnessVal)}%)`);

  // Contrast: -100 to 100 -> 0% to 200%
  const contrastVal = 100 + adjustments.contrast;
  parts.push(`contrast(${Math.max(0, contrastVal)}%)`);

  // Saturation: -100 to 100 -> 0% to 200%
  const saturateVal = 100 + adjustments.saturation;
  parts.push(`saturate(${Math.max(0, saturateVal)}%)`);

  // Blur: 0 to 20px
  if (adjustments.blur > 0) {
    parts.push(`blur(${adjustments.blur}px)`);
  }

  // Filter Presets
  const intensity = filterIntensity / 100;
  if (intensity > 0) {
    switch (filter) {
      case 'grayscale':
        parts.push(`grayscale(${100 * intensity}%)`);
        break;
      case 'sepia':
        parts.push(`sepia(${90 * intensity}%)`);
        break;
      case 'noir':
        parts.push(`grayscale(${100 * intensity}%) contrast(${100 + 40 * intensity}%) brightness(${100 - 10 * intensity}%)`);
        break;
      case 'vintage':
        parts.push(`sepia(${40 * intensity}%) contrast(${100 + 15 * intensity}%) saturate(${100 + 20 * intensity}%)`);
        break;
      case 'warm':
        parts.push(`sepia(${25 * intensity}%) saturate(${100 + 20 * intensity}%) hue-rotate(${-15 * intensity}deg)`);
        break;
      case 'cool':
        parts.push(`hue-rotate(${35 * intensity}deg) saturate(${100 + 10 * intensity}%)`);
        break;
      case 'vivid':
        parts.push(`saturate(${100 + 50 * intensity}%) contrast(${100 + 20 * intensity}%)`);
        break;
      case 'teal-orange':
        parts.push(`contrast(${100 + 25 * intensity}%) saturate(${100 + 30 * intensity}%) hue-rotate(${-20 * intensity}deg)`);
        break;
      case 'cyberpunk':
        parts.push(`contrast(${100 + 35 * intensity}%) saturate(${100 + 60 * intensity}%) hue-rotate(${90 * intensity}deg)`);
        break;
      case 'dramatic':
        parts.push(`contrast(${100 + 40 * intensity}%) brightness(${100 - 15 * intensity}%) saturate(${100 + 10 * intensity}%)`);
        break;
      case 'pastel':
        parts.push(`brightness(${100 + 15 * intensity}%) saturate(${100 - 20 * intensity}%) contrast(${100 - 10 * intensity}%)`);
        break;
      case 'invert':
        parts.push(`invert(${100 * intensity}%)`);
        break;
      case 'fade':
        parts.push(`contrast(${100 - 20 * intensity}%) brightness(${100 + 10 * intensity}%) saturate(${100 - 15 * intensity}%)`);
        break;
      default:
        break;
    }
  }

  return parts.join(' ');
}

/**
 * Creates an image element from a source url/dataUrl
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Renders an image to an offscreen canvas applying all transforms, filters, and pixel effects
 */
export async function renderToCanvas(
  source: HTMLImageElement | string,
  adjustments: ImageAdjustments,
  filter: FilterType,
  filterIntensity: number,
  transform: TransformState
): Promise<HTMLCanvasElement> {
  const img = typeof source === 'string' ? await loadImage(source) : source;

  // Calculate canvas dimensions considering 90/270 degree rotation
  const totalAngle = (transform.rotate + transform.fineRotate) % 360;
  const rad = (totalAngle * Math.PI) / 180;
  const absCos = Math.abs(Math.cos(rad));
  const absSin = Math.abs(Math.sin(rad));

  const targetWidth = Math.round(img.naturalWidth * absCos + img.naturalHeight * absSin);
  const targetHeight = Math.round(img.naturalWidth * absSin + img.naturalHeight * absCos);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.save();
  ctx.translate(targetWidth / 2, targetHeight / 2);
  ctx.rotate(rad);
  ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);

  // Apply CSS filter
  const filterString = getCSSFilterString(adjustments, filter, filterIntensity);
  ctx.filter = filterString;

  ctx.drawImage(
    img,
    -img.naturalWidth / 2,
    -img.naturalHeight / 2,
    img.naturalWidth,
    img.naturalHeight
  );

  ctx.restore();

  // Apply pixel adjustments: Warmth, Tint, Vignette if set
  if (adjustments.warmth !== 0 || adjustments.tint !== 0 || adjustments.vignette > 0) {
    applyAdvancedPixelEffects(ctx, targetWidth, targetHeight, adjustments);
  }

  return canvas;
}

/**
 * High-performance pixel manipulation for color temperature (warmth/tint) & optical vignette
 */
function applyAdvancedPixelEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adjustments: ImageAdjustments
) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const len = data.length;

    const warmth = adjustments.warmth; // -100 to 100
    const tint = adjustments.tint; // -100 to 100
    const vignette = adjustments.vignette / 100; // 0 to 1

    const cx = width / 2;
    const cy = height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    for (let i = 0; i < len; i += 4) {
      // Warmth: Warm boosts Red & reduces Blue. Cool boosts Blue & reduces Red.
      if (warmth !== 0) {
        data[i] = Math.min(255, Math.max(0, data[i] + warmth * 0.35)); // R
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - warmth * 0.35)); // B
      }

      // Tint: Green (-100) to Magenta (+100)
      if (tint !== 0) {
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] - tint * 0.3)); // G
        data[i] = Math.min(255, Math.max(0, data[i] + tint * 0.2)); // R
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + tint * 0.2)); // B
      }

      // Vignette
      if (vignette > 0) {
        const pixelIdx = i / 4;
        const px = pixelIdx % width;
        const py = Math.floor(pixelIdx / width);
        const dist = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
        const normalizedDist = dist / maxDist;
        const falloff = Math.max(0, 1 - Math.pow(normalizedDist, 2) * vignette * 1.5);

        data[i] = data[i] * falloff;
        data[i + 1] = data[i + 1] * falloff;
        data[i + 2] = data[i + 2] * falloff;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.warn('Advanced pixel manipulation skipped (possible cross-origin restriction):', e);
  }
}

/**
 * Splits an image into two distinct images at a specified ratio (vertical or horizontal)
 */
export async function splitImage(
  sourceCanvas: HTMLCanvasElement,
  direction: SplitDirection,
  splitRatio: number = 0.5,
  originalFileName: string = 'image'
): Promise<SplitResult> {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  // Clamp split ratio between 0.05 and 0.95 to avoid 0px slices
  const ratio = Math.max(0.02, Math.min(0.98, splitRatio));

  let part1Width = 0;
  let part1Height = 0;
  let part2Width = 0;
  let part2Height = 0;

  let part1Canvas = document.createElement('canvas');
  let part2Canvas = document.createElement('canvas');

  if (direction === 'vertical') {
    // Slicing vertically into Left (Part 1) and Right (Part 2)
    part1Width = Math.round(w * ratio);
    part1Height = h;
    part2Width = w - part1Width;
    part2Height = h;

    part1Canvas.width = part1Width;
    part1Canvas.height = part1Height;
    const ctx1 = part1Canvas.getContext('2d')!;
    ctx1.drawImage(sourceCanvas, 0, 0, part1Width, h, 0, 0, part1Width, h);

    part2Canvas.width = part2Width;
    part2Canvas.height = part2Height;
    const ctx2 = part2Canvas.getContext('2d')!;
    ctx2.drawImage(sourceCanvas, part1Width, 0, part2Width, h, 0, 0, part2Width, h);
  } else {
    // Slicing horizontally into Top (Part 1) and Bottom (Part 2)
    part1Width = w;
    part1Height = Math.round(h * ratio);
    part2Width = w;
    part2Height = h - part1Height;

    part1Canvas.width = part1Width;
    part1Canvas.height = part1Height;
    const ctx1 = part1Canvas.getContext('2d')!;
    ctx1.drawImage(sourceCanvas, 0, 0, w, part1Height, 0, 0, w, part1Height);

    part2Canvas.width = part2Width;
    part2Canvas.height = part2Height;
    const ctx2 = part2Canvas.getContext('2d')!;
    ctx2.drawImage(sourceCanvas, 0, part1Height, w, part2Height, 0, 0, w, part2Height);
  }

  const part1DataUrl = part1Canvas.toDataURL('image/png');
  const part2DataUrl = part2Canvas.toDataURL('image/png');

  return {
    part1DataUrl,
    part2DataUrl,
    part1Dimensions: { width: part1Width, height: part1Height },
    part2Dimensions: { width: part2Width, height: part2Height },
    direction,
    splitRatio: ratio,
    originalFileName,
  };
}

/**
 * Crops a canvas to the specified bounding box
 */
export function cropCanvas(
  sourceCanvas: HTMLCanvasElement,
  cropArea: { x: number; y: number; width: number; height: number }
): HTMLCanvasElement {
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = Math.max(1, Math.round(cropArea.width));
  croppedCanvas.height = Math.max(1, Math.round(cropArea.height));

  const ctx = croppedCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get crop canvas context');

  ctx.drawImage(
    sourceCanvas,
    Math.round(cropArea.x),
    Math.round(cropArea.y),
    Math.round(cropArea.width),
    Math.round(cropArea.height),
    0,
    0,
    Math.round(cropArea.width),
    Math.round(cropArea.height)
  );

  return croppedCanvas;
}

/**
 * Downloads a data URL as a file
 */
export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Creates and triggers a download of a ZIP file containing both split parts
 */
export async function downloadSplitAsZip(splitResult: SplitResult) {
  const zip = new JSZip();
  const baseName = splitResult.originalFileName.replace(/\.[^/.]+$/, '') || 'split_image';
  const label1 = splitResult.direction === 'vertical' ? 'part_1_left' : 'part_1_top';
  const label2 = splitResult.direction === 'vertical' ? 'part_2_right' : 'part_2_bottom';

  // Extract base64 data
  const data1 = splitResult.part1DataUrl.split(',')[1];
  const data2 = splitResult.part2DataUrl.split(',')[1];

  zip.file(`${baseName}_${label1}.png`, data1, { base64: true });
  zip.file(`${baseName}_${label2}.png`, data2, { base64: true });

  // Add info readme text file
  const infoText = `Image Split Summary\nOriginal: ${splitResult.originalFileName}\nSplit Axis: ${splitResult.direction.toUpperCase()}\nPosition: ${(splitResult.splitRatio * 100).toFixed(1)}%\nPart 1 (${label1}): ${splitResult.part1Dimensions.width}x${splitResult.part1Dimensions.height}px\nPart 2 (${label2}): ${splitResult.part2Dimensions.width}x${splitResult.part2Dimensions.height}px\nGenerated by Image Editor & Splitter`;
  zip.file('split_info.txt', infoText);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${baseName}_split_package.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats byte size to human readable string (e.g., 2.4 MB)
 */
export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
