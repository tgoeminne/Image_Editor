export interface ImageAdjustments {
  brightness: number; // -100 to 100 (0 default)
  contrast: number; // -100 to 100 (0 default)
  saturation: number; // -100 to 100 (0 default)
  exposure: number; // -100 to 100 (0 default)
  warmth: number; // -100 to 100 (0 default)
  tint: number; // -100 to 100 (0 default)
  blur: number; // 0 to 20 px (0 default)
  vignette: number; // 0 to 100 % (0 default)
  sharpness: number; // 0 to 100 (0 default)
  highlights: number; // -100 to 100 (0 default)
  shadows: number; // -100 to 100 (0 default)
}

export type FilterType =
  | 'none'
  | 'vivid'
  | 'warm'
  | 'cool'
  | 'grayscale'
  | 'noir'
  | 'vintage'
  | 'sepia'
  | 'teal-orange'
  | 'cyberpunk'
  | 'dramatic'
  | 'pastel'
  | 'invert'
  | 'fade';

export interface FilterPreset {
  id: FilterType;
  name: string;
  category: 'Standard' | 'Color' | 'Atmosphere' | 'Artistic';
  cssFilter?: string;
  previewColor: string;
}

export interface TransformState {
  rotate: number; // 0, 90, 180, 270 degrees
  fineRotate: number; // -45 to 45 degrees
  flipH: boolean;
  flipV: boolean;
}

export interface CropRect {
  x: number; // normalized (0 - 1) or relative to natural dimensions
  y: number;
  width: number;
  height: number;
}

export type AspectRatioOption = 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16' | '2:3';

export type SplitDirection = 'vertical' | 'horizontal';

export interface SplitState {
  active: boolean;
  direction: SplitDirection;
  positionRatio: number; // 0.0 to 1.0 (defaults to 0.5 for half)
}

export interface SplitResult {
  part1DataUrl: string;
  part2DataUrl: string;
  part1Dimensions: { width: number; height: number };
  part2Dimensions: { width: number; height: number };
  direction: SplitDirection;
  splitRatio: number;
  originalFileName: string;
}

export type ActiveTool = 'adjust' | 'crop' | 'rotate' | 'filter' | 'split';

export interface EditorHistoryState {
  adjustments: ImageAdjustments;
  filter: FilterType;
  filterIntensity: number;
  transform: TransformState;
  croppedCanvasUrl: string | null;
}
