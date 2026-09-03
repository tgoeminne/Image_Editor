import React from 'react';
import { AspectRatioOption } from '../../types';
import { Crop, Check, X } from 'lucide-react';

interface CropPanelProps {
  aspectRatio: AspectRatioOption;
  onChangeAspectRatio: (ratio: AspectRatioOption) => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
}

const ASPECT_RATIOS: { id: AspectRatioOption; label: string; description: string }[] = [
  { id: 'free', label: 'Freeform', description: 'Custom Dimensions' },
  { id: '1:1', label: '1:1 Square', description: 'Instagram / Avatar' },
  { id: '4:3', label: '4:3 Standard', description: 'Photo / Tablet' },
  { id: '16:9', label: '16:9 Cinema', description: 'Widescreen / Video' },
  { id: '3:2', label: '3:2 Classic', description: '35mm Photography' },
  { id: '9:16', label: '9:16 Story', description: 'Reels / TikTok' },
  { id: '2:3', label: '2:3 Portrait', description: 'Vertical Print' },
];

export const CropPanel: React.FC<CropPanelProps> = ({
  aspectRatio,
  onChangeAspectRatio,
  onApplyCrop,
  onCancelCrop,
}) => {
  return (
    <div className="space-y-6">
      {/* Help Banner */}
      <div className="p-3 bg-[#141414] border border-white/10 rounded-2xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#8CB4FF]/15 text-[#8CB4FF] flex items-center justify-center shrink-0 border border-[#8CB4FF]/30">
          <Crop className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#D4D4D8]">
          Drag handles on the image to position and size your framing box.
        </div>
      </div>

      {/* Aspect Ratio Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
          <span className="font-semibold text-white">Aspect Ratio Presets</span>
          <span className="text-[11px] font-mono">
            {ASPECT_RATIOS.find((a) => a.id === aspectRatio)?.description || 'Freeform'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIOS.map((item) => {
            const isSelected = aspectRatio === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeAspectRatio(item.id)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378] shadow-md shadow-[#E5C378]/10'
                    : 'bg-[#0F0F0F] border-white/10 text-[#D4D4D8] hover:text-white hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                <span className="text-xs font-bold">{item.label}</span>
                <span className="text-[10px] text-[#A1A1AA] truncate">{item.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          id="cancel-crop-btn"
          type="button"
          onClick={onCancelCrop}
          className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-[#181818] hover:bg-[#222222] text-[#D4D4D8] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Cancel Crop</span>
        </button>

        <button
          id="apply-crop-btn"
          type="button"
          onClick={onApplyCrop}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] text-[#0A0A0A] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#E5C378]/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Apply Crop</span>
        </button>
      </div>
    </div>
  );
};
