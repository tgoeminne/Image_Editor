import React from 'react';
import { TransformState } from '../../types';
import {
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { DEFAULT_TRANSFORM } from '../../utils/canvasUtils';

interface RotatePanelProps {
  transform: TransformState;
  onChangeTransform: (transform: TransformState) => void;
}

export const RotatePanel: React.FC<RotatePanelProps> = ({ transform, onChangeTransform }) => {
  const handleRotate90 = (direction: 1 | -1) => {
    const nextRotate = (transform.rotate + direction * 90) % 360;
    // Normalize to [0, 90, 180, 270]
    const normalized = nextRotate < 0 ? nextRotate + 360 : nextRotate;
    onChangeTransform({
      ...transform,
      rotate: normalized,
    });
  };

  const handleToggleFlip = (axis: 'h' | 'v') => {
    if (axis === 'h') {
      onChangeTransform({
        ...transform,
        flipH: !transform.flipH,
      });
    } else {
      onChangeTransform({
        ...transform,
        flipV: !transform.flipV,
      });
    }
  };

  const handleFineRotate = (deg: number) => {
    onChangeTransform({
      ...transform,
      fineRotate: deg,
    });
  };

  const handleResetOrientation = () => {
    onChangeTransform(DEFAULT_TRANSFORM);
  };

  const isChanged =
    transform.rotate !== 0 ||
    transform.fineRotate !== 0 ||
    transform.flipH ||
    transform.flipV;

  return (
    <div className="space-y-6">
      {/* Quick 90 deg and Flip controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id="rotate-ccw-90-btn"
          type="button"
          onClick={() => handleRotate90(-1)}
          className="p-3 rounded-xl bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 hover:border-[#E5C378]/40 text-white flex flex-col items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#E5C378]" />
          <span className="text-xs font-medium">90° Left</span>
        </button>

        <button
          id="rotate-cw-90-btn"
          type="button"
          onClick={() => handleRotate90(1)}
          className="p-3 rounded-xl bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 hover:border-[#E5C378]/40 text-white flex flex-col items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCw className="w-4 h-4 text-[#E5C378]" />
          <span className="text-xs font-medium">90° Right</span>
        </button>

        <button
          id="flip-horizontal-btn"
          type="button"
          onClick={() => handleToggleFlip('h')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            transform.flipH
              ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378]'
              : 'bg-[#0F0F0F] border-white/10 text-white hover:bg-[#181818] hover:border-white/20'
          }`}
        >
          <FlipHorizontal className="w-4 h-4" />
          <span className="text-xs font-medium">Flip Horizontal</span>
        </button>

        <button
          id="flip-vertical-btn"
          type="button"
          onClick={() => handleToggleFlip('v')}
          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            transform.flipV
              ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378]'
              : 'bg-[#0F0F0F] border-white/10 text-white hover:bg-[#181818] hover:border-white/20'
          }`}
        >
          <FlipVertical className="w-4 h-4" />
          <span className="text-xs font-medium">Flip Vertical</span>
        </button>
      </div>

      {/* Fine Straighten Slider */}
      <div className="space-y-2.5 p-4 bg-[#141414] border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#D4D4D8] font-medium flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Fine Horizon Straighten</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#E5C378] bg-[#0A0A0A] px-2 py-0.5 rounded border border-white/10">
              {transform.fineRotate > 0 ? `+${transform.fineRotate}` : transform.fineRotate}°
            </span>
            {transform.fineRotate !== 0 && (
              <button
                type="button"
                onClick={() => handleFineRotate(0)}
                className="text-[10px] text-[#A1A1AA] hover:text-white underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <input
          id="fine-straighten-slider"
          type="range"
          min="-45"
          max="45"
          step="0.5"
          value={transform.fineRotate}
          onChange={(e) => handleFineRotate(Number(e.target.value))}
          className="w-full h-2 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-[#E5C378] touch-none"
        />

        <div className="flex justify-between text-[10px] text-[#71717A] font-mono px-0.5">
          <span>-45°</span>
          <span>0°</span>
          <span>+45°</span>
        </div>
      </div>

      {/* Summary Status & Reset */}
      {isChanged && (
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <div className="text-[#A1A1AA]">
            Total Angle:{' '}
            <span className="text-white font-mono font-bold">
              {transform.rotate + transform.fineRotate}°
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetOrientation}
            className="flex items-center gap-1.5 text-xs text-[#E5C378] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Orientation</span>
          </button>
        </div>
      )}
    </div>
  );
};
