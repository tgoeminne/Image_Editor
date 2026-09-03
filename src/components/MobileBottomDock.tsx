import React from 'react';
import { ActiveTool, ImageAdjustments, FilterType, TransformState } from '../types';
import { Sliders, Sparkles, Crop, RotateCw, Scissors } from 'lucide-react';
import { DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM } from '../utils/canvasUtils';

interface MobileBottomDockProps {
  activeTool: ActiveTool;
  isDrawerOpen: boolean;
  onSelectTool: (tool: ActiveTool) => void;
  onToggleDrawer: () => void;
  adjustments: ImageAdjustments;
  filter: FilterType;
  transform: TransformState;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  activeTool,
  isDrawerOpen,
  onSelectTool,
  onToggleDrawer,
  adjustments,
  filter,
  transform,
}) => {
  const hasAdjustments =
    adjustments.brightness !== DEFAULT_ADJUSTMENTS.brightness ||
    adjustments.contrast !== DEFAULT_ADJUSTMENTS.contrast ||
    adjustments.saturation !== DEFAULT_ADJUSTMENTS.saturation ||
    adjustments.exposure !== DEFAULT_ADJUSTMENTS.exposure ||
    adjustments.warmth !== DEFAULT_ADJUSTMENTS.warmth ||
    adjustments.highlights !== DEFAULT_ADJUSTMENTS.highlights ||
    adjustments.shadows !== DEFAULT_ADJUSTMENTS.shadows ||
    adjustments.vignette !== DEFAULT_ADJUSTMENTS.vignette ||
    adjustments.blur !== DEFAULT_ADJUSTMENTS.blur;

  const hasFilter = filter !== 'none';
  const hasTransform =
    transform.rotate !== DEFAULT_TRANSFORM.rotate ||
    transform.fineRotate !== DEFAULT_TRANSFORM.fineRotate ||
    transform.flipH ||
    transform.flipV;

  const tools: {
    id: ActiveTool;
    label: string;
    icon: React.ReactNode;
    color: string;
    hasBadge?: boolean;
  }[] = [
    {
      id: 'adjust',
      label: 'Adjust',
      icon: <Sliders className="w-4 h-4" />,
      color: '#FF85A0',
      hasBadge: hasAdjustments,
    },
    {
      id: 'filter',
      label: 'Filters',
      icon: <Sparkles className="w-4 h-4" />,
      color: '#C4B5FD',
      hasBadge: hasFilter,
    },
    {
      id: 'crop',
      label: 'Crop',
      icon: <Crop className="w-4 h-4" />,
      color: '#8CB4FF',
    },
    {
      id: 'rotate',
      label: 'Rotate',
      icon: <RotateCw className="w-4 h-4" />,
      color: '#6EE7B7',
      hasBadge: hasTransform,
    },
    {
      id: 'split',
      label: 'Split',
      icon: <Scissors className="w-4 h-4" />,
      color: '#E5C378',
    },
  ];

  return (
    <nav
      id="mobile-bottom-dock"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0D0D0D]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      {tools.map((t) => {
        const isActive = activeTool === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              if (isActive) {
                onToggleDrawer();
              } else {
                onSelectTool(t.id);
              }
            }}
            className={`relative flex-1 py-1 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-white'
                : 'text-[#A1A1AA] hover:text-[#D4D4D8] hover:bg-white/5 active:scale-95'
            }`}
          >
            {/* Active Pill Accent Indicator */}
            {isActive && (
              <span
                className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#E5C378] shadow-[0_0_8px_rgba(229,195,120,0.8)]"
                aria-hidden="true"
              />
            )}

            <div
              className={`p-1 rounded-lg transition-transform ${
                isActive ? 'scale-110' : ''
              }`}
              style={{ color: isActive ? t.color : undefined }}
            >
              {t.icon}
            </div>

            <span
              className={`text-[10px] tracking-wide font-medium leading-none ${
                isActive ? 'text-[#E5C378] font-bold' : ''
              }`}
            >
              {t.label}
            </span>

            {/* Changed state badge dot */}
            {t.hasBadge && (
              <span className="absolute top-1.5 right-3 w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
