import React from 'react';
import {
  X,
  ChevronDown,
  RotateCcw,
  Sliders,
  Sparkles,
  Crop,
  RotateCw,
  Scissors,
  Check,
  Eye,
} from 'lucide-react';
import {
  ActiveTool,
  AspectRatioOption,
  FilterType,
  ImageAdjustments,
  SplitDirection,
  TransformState,
} from '../types';
import { AdjustPanel } from './tools/AdjustPanel';
import { FilterPanel } from './tools/FilterPanel';
import { CropPanel } from './tools/CropPanel';
import { RotatePanel } from './tools/RotatePanel';
import { SplitPanel } from './tools/SplitPanel';
import { DEFAULT_ADJUSTMENTS } from '../utils/canvasUtils';

interface MobileToolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTool: ActiveTool;
  // Adjustments
  adjustments: ImageAdjustments;
  onChangeAdjustments: (adjustments: ImageAdjustments) => void;
  // Filter
  filter: FilterType;
  filterIntensity: number;
  onSelectFilter: (filter: FilterType) => void;
  onChangeFilterIntensity: (intensity: number) => void;
  // Transform
  transform: TransformState;
  onChangeTransform: (transform: TransformState) => void;
  // Crop
  aspectRatio: AspectRatioOption;
  onChangeAspectRatio: (aspect: AspectRatioOption) => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  // Split
  splitDirection: SplitDirection;
  splitRatio: number;
  onChangeSplitDirection: (dir: SplitDirection) => void;
  onChangeSplitRatio: (ratio: number) => void;
  onPerformSplit: () => void;
  imageDimensions: { width: number; height: number } | null;
}

export const MobileToolDrawer: React.FC<MobileToolDrawerProps> = ({
  isOpen,
  onClose,
  activeTool,
  adjustments,
  onChangeAdjustments,
  filter,
  filterIntensity,
  onSelectFilter,
  onChangeFilterIntensity,
  transform,
  onChangeTransform,
  aspectRatio,
  onChangeAspectRatio,
  onApplyCrop,
  onCancelCrop,
  splitDirection,
  splitRatio,
  onChangeSplitDirection,
  onChangeSplitRatio,
  onPerformSplit,
  imageDimensions,
}) => {
  const [isPeeking, setIsPeeking] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const toolMeta: Record<ActiveTool, { title: string; subtitle: string; icon: React.ReactNode }> = {
    adjust: {
      title: 'Darkroom Adjustments',
      subtitle: 'Tune exposure, contrast, temperature & blur',
      icon: <Sliders className="w-4 h-4 text-[#FF85A0]" />,
    },
    filter: {
      title: 'Artistic Filters',
      subtitle: 'Apply vintage, noir & atmospheric tone presets',
      icon: <Sparkles className="w-4 h-4 text-[#C4B5FD]" />,
    },
    crop: {
      title: 'Framing & Crop',
      subtitle: 'Constrain proportions or freeform slice',
      icon: <Crop className="w-4 h-4 text-[#8CB4FF]" />,
    },
    rotate: {
      title: 'Orientation & Straighten',
      subtitle: 'Rotate 90°, flip axes, or fine level tilt',
      icon: <RotateCw className="w-4 h-4 text-[#6EE7B7]" />,
    },
    split: {
      title: 'Precision Splitter',
      subtitle: 'Bisect image into 2 standalone downloads',
      icon: <Scissors className="w-4 h-4 text-[#E5C378]" />,
    },
  };

  const currentTool = toolMeta[activeTool];

  return (
    <div
      id="mobile-tool-drawer-backdrop"
      className={`md:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-150 select-none transition-opacity ${
        isPeeking ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={onClose}
    >
      {/* Bottom Sheet Container */}
      <div
        id="mobile-tool-drawer-sheet"
        className={`w-full bg-[#0D0D0D] border-t border-white/15 rounded-t-3xl max-h-[75vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 transition-opacity ${
          isPeeking ? 'opacity-15' : 'opacity-100'
        }`}
        style={{ paddingBottom: 'max(4.5rem, calc(4rem + env(safe-area-inset-bottom)))' }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Drawer Drag Handle & Header */}
        <div className="pt-2.5 px-4 pb-3 border-b border-white/10 bg-[#0A0A0A] flex flex-col gap-2">
          {/* Top Pill Handle */}
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

          <div className="flex items-center justify-between gap-2">
            {/* Left Corner: Hide Button */}
            <button
              id="mobile-drawer-hide-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 px-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#D4D4D8] hover:text-white border border-white/10 text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              title="Hide panel to view full canvas"
            >
              <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
              <span className="text-[11px] font-medium">Hide</span>
            </button>

            {/* Center: Tool Identity */}
            <div className="flex items-center gap-2 min-w-0 mx-auto">
              <div className="w-6 h-6 rounded-lg bg-[#181818] border border-white/10 flex items-center justify-center shrink-0">
                {currentTool.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-serif-display font-bold text-white leading-none truncate">
                  {currentTool.title}
                </h3>
              </div>
            </div>

            {/* Right Corner: Peek Button */}
            <button
              id="mobile-drawer-peek-btn"
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsPeeking(true);
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                setIsPeeking(false);
              }}
              onMouseLeave={() => setIsPeeking(false)}
              onTouchStart={(e) => {
                e.preventDefault();
                setIsPeeking(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setIsPeeking(false);
              }}
              onTouchCancel={() => setIsPeeking(false)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              draggable={false}
              style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'none',
              }}
              className={`p-1.5 px-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all select-none cursor-pointer shrink-0 ${
                isPeeking
                  ? 'bg-[#E5C378] text-[#0A0A0A] border-[#E5C378] font-bold shadow-lg shadow-[#E5C378]/30 scale-105 opacity-100'
                  : 'bg-[#181818] hover:bg-[#222222] text-[#E5C378] border-[#E5C378]/30 hover:border-[#E5C378]/60'
              }`}
              title="Hold to see unobstructed image"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Peek</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tool Panel Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTool === 'adjust' && (
            <AdjustPanel
              adjustments={adjustments}
              onChange={(key, val) =>
                onChangeAdjustments({
                  ...adjustments,
                  [key]: val,
                })
              }
              onResetAll={() => onChangeAdjustments(DEFAULT_ADJUSTMENTS)}
            />
          )}

          {activeTool === 'filter' && (
            <FilterPanel
              filter={filter}
              filterIntensity={filterIntensity}
              onSelectFilter={onSelectFilter}
              onChangeFilterIntensity={onChangeFilterIntensity}
            />
          )}

          {activeTool === 'crop' && (
            <CropPanel
              aspectRatio={aspectRatio}
              onChangeAspectRatio={onChangeAspectRatio}
              onApplyCrop={() => {
                onApplyCrop();
                onClose();
              }}
              onCancelCrop={() => {
                onCancelCrop();
                onClose();
              }}
            />
          )}

          {activeTool === 'rotate' && (
            <RotatePanel transform={transform} onChangeTransform={onChangeTransform} />
          )}

          {activeTool === 'split' && (
            <SplitPanel
              splitDirection={splitDirection}
              splitRatio={splitRatio}
              onChangeSplitDirection={onChangeSplitDirection}
              onChangeSplitRatio={onChangeSplitRatio}
              onPerformSplit={() => {
                onPerformSplit();
                onClose();
              }}
              imageDimensions={imageDimensions}
            />
          )}
        </div>
      </div>
    </div>
  );
};
