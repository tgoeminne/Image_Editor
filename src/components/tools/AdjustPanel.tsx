import React from 'react';
import {
  Sun,
  Contrast,
  Droplets,
  Thermometer,
  Eye,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ImageAdjustments } from '../../types';
import { DEFAULT_ADJUSTMENTS } from '../../utils/canvasUtils';

interface AdjustPanelProps {
  adjustments: ImageAdjustments;
  onChange: (key: keyof ImageAdjustments, value: number) => void;
  onResetAll: () => void;
}

interface SliderConfig {
  key: keyof ImageAdjustments;
  label: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export const AdjustPanel: React.FC<AdjustPanelProps> = ({
  adjustments,
  onChange,
  onResetAll,
}) => {
  const lightSliders: SliderConfig[] = [
    { key: 'exposure', label: 'Exposure', icon: <Sun className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
    { key: 'brightness', label: 'Brightness', icon: <Sun className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
    { key: 'contrast', label: 'Contrast', icon: <Contrast className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
    { key: 'highlights', label: 'Highlights', icon: <Zap className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
    { key: 'shadows', label: 'Shadows', icon: <Eye className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
  ];

  const colorSliders: SliderConfig[] = [
    { key: 'saturation', label: 'Saturation', icon: <Droplets className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
    { key: 'warmth', label: 'Temperature / Warmth', icon: <Thermometer className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
    { key: 'tint', label: 'Tint Balance', icon: <Sparkles className="w-3.5 h-3.5" />, min: -100, max: 100, step: 1, unit: '' },
  ];

  const detailSliders: SliderConfig[] = [
    { key: 'vignette', label: 'Vignette Depth', icon: <Sun className="w-3.5 h-3.5" />, min: 0, max: 100, step: 1, unit: '%' },
    { key: 'sharpness', label: 'Sharpness', icon: <Sparkles className="w-3.5 h-3.5" />, min: 0, max: 100, step: 1, unit: '%' },
    { key: 'blur', label: 'Atmospheric Blur', icon: <Droplets className="w-3.5 h-3.5" />, min: 0, max: 20, step: 0.5, unit: 'px' },
  ];

  const hasModifications = Object.keys(adjustments).some(
    (k) => adjustments[k as keyof ImageAdjustments] !== DEFAULT_ADJUSTMENTS[k as keyof ImageAdjustments]
  );

  const renderSliderGroup = (title: string, sliders: SliderConfig[]) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
          {title}
        </h4>
      </div>
      <div className="space-y-3.5">
        {sliders.map((s) => {
          const val = adjustments[s.key];
          const isModified = val !== DEFAULT_ADJUSTMENTS[s.key];
          return (
            <div key={s.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-[#D4D4D8] font-medium">
                  <span className={isModified ? 'text-[#E5C378]' : 'text-[#71717A]'}>
                    {s.icon}
                  </span>
                  <span>{s.label}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                      isModified
                        ? 'bg-[#E5C378]/15 text-[#E5C378] font-bold border border-[#E5C378]/30'
                        : 'text-[#71717A]'
                    }`}
                  >
                    {val > 0 && s.min < 0 ? `+${val}` : val}
                    {s.unit}
                  </span>
                  {isModified && (
                    <button
                      type="button"
                      onClick={() => onChange(s.key, DEFAULT_ADJUSTMENTS[s.key])}
                      className="text-[#71717A] hover:text-[#E5C378] p-0.5 rounded cursor-pointer"
                      title="Reset slider"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <input
                id={`slider-${s.key}`}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) => onChange(s.key, Number(e.target.value))}
                className="w-full h-2 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-[#E5C378] touch-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Reset All Header */}
      {hasModifications && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/25 text-xs">
          <span className="text-[#E5C378] font-medium">Adjustments Applied</span>
          <button
            id="reset-all-adjustments-btn"
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E5C378] text-[#0A0A0A] font-semibold text-[11px] hover:bg-[#F0D597] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {renderSliderGroup('Lighting & Exposure', lightSliders)}
      {renderSliderGroup('Color & Tonality', colorSliders)}
      {renderSliderGroup('Atmosphere & Detail', detailSliders)}
    </div>
  );
};
