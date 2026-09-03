import React from 'react';
import {
  Sliders,
  Crop,
  RotateCw,
  Sparkles,
  Scissors,
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

interface ToolSidebarProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  adjustments: ImageAdjustments;
  onChangeAdjustments: (adjustments: ImageAdjustments) => void;
  filter: FilterType;
  filterIntensity: number;
  onSelectFilter: (filter: FilterType) => void;
  onChangeFilterIntensity: (intensity: number) => void;
  transform: TransformState;
  onChangeTransform: (transform: TransformState) => void;
  aspectRatio: AspectRatioOption;
  onChangeAspectRatio: (aspect: AspectRatioOption) => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  splitDirection: SplitDirection;
  splitRatio: number;
  onChangeSplitDirection: (dir: SplitDirection) => void;
  onChangeSplitRatio: (ratio: number) => void;
  onPerformSplit: () => void;
  imageDimensions: { width: number; height: number } | null;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  activeTool,
  onSelectTool,
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
  const toolNavItems: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
    { id: 'adjust', label: 'Adjust', icon: <Sliders className="w-4 h-4" /> },
    { id: 'filter', label: 'Filters', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'crop', label: 'Crop', icon: <Crop className="w-4 h-4" /> },
    { id: 'rotate', label: 'Rotate', icon: <RotateCw className="w-4 h-4" /> },
    { id: 'split', label: 'Split', icon: <Scissors className="w-4 h-4" /> },
  ];

  const toolTitles: Record<ActiveTool, { title: string; subtitle: string }> = {
    adjust: {
      title: 'Lighting & Color Adjustments',
      subtitle: 'Precise darkroom exposure and balance sliders',
    },
    filter: {
      title: 'Artistic Presets & Filters',
      subtitle: 'Curated tonalities with intensity scaling',
    },
    crop: {
      title: 'Crop & Framing Geometry',
      subtitle: 'Ratio constraint presets with rule of thirds overlay',
    },
    rotate: {
      title: 'Orientation & Straighten',
      subtitle: '90-degree orthogonal rotation and fine degree alignment',
    },
    split: {
      title: 'Precision Image Splitter',
      subtitle: 'Bisect image into two clean download pieces',
    },
  };

  return (
    <aside
      id="tool-sidebar"
      className="hidden md:flex w-80 lg:w-88 bg-[#0D0D0D] border-r border-white/10 flex-col shrink-0 select-none overflow-hidden"
    >
      {/* Tool Selection Tabs */}
      <div className="grid grid-cols-5 p-1.5 bg-[#050505] border-b border-white/10 text-xs">
        {toolNavItems.map((item) => {
          const isActive = activeTool === item.id;
          return (
            <button
              key={item.id}
              id={`tool-tab-${item.id}`}
              type="button"
              onClick={() => onSelectTool(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg gap-1 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#E5C378] to-[#C9A050] text-[#0A0A0A] font-semibold shadow-md shadow-[#E5C378]/20'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tool Sub-Header */}
      <div className="px-5 py-3 border-b border-white/5 bg-[#0A0A0A]/50">
        <h3 className="text-xs font-serif-display font-bold text-white tracking-wide">
          {toolTitles[activeTool].title}
        </h3>
        <p className="text-[11px] text-[#A1A1AA] font-light">
          {toolTitles[activeTool].subtitle}
        </p>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
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
            onApplyCrop={onApplyCrop}
            onCancelCrop={onCancelCrop}
          />
        )}

        {activeTool === 'rotate' && (
          <RotatePanel
            transform={transform}
            onChangeTransform={onChangeTransform}
          />
        )}

        {activeTool === 'split' && (
          <SplitPanel
            splitDirection={splitDirection}
            splitRatio={splitRatio}
            onChangeSplitDirection={onChangeSplitDirection}
            onChangeSplitRatio={onChangeSplitRatio}
            onPerformSplit={onPerformSplit}
            imageDimensions={imageDimensions}
          />
        )}
      </div>
    </aside>
  );
};
