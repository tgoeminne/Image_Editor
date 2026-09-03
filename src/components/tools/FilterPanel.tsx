import React, { useState } from 'react';
import { FilterType } from '../../types';
import { FILTER_PRESETS } from '../../utils/canvasUtils';
import { Sparkles, Sliders, Check } from 'lucide-react';

interface FilterPanelProps {
  filter: FilterType;
  filterIntensity: number;
  onSelectFilter: (filter: FilterType) => void;
  onChangeFilterIntensity: (intensity: number) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filter,
  filterIntensity,
  onSelectFilter,
  onChangeFilterIntensity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Standard', 'Color', 'Atmosphere', 'Artistic'];

  const filteredPresets =
    selectedCategory === 'All'
      ? FILTER_PRESETS
      : FILTER_PRESETS.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-5">
      {/* Filter Intensity Slider (when active filter is not 'none') */}
      {filter !== 'none' && (
        <div className="p-3.5 bg-[#141414] border border-[#E5C378]/30 rounded-2xl space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-[#E5C378] font-medium">
              <Sliders className="w-3.5 h-3.5" />
              <span>Preset Strength</span>
            </label>
            <span className="font-mono text-xs font-bold text-[#E5C378]">
              {filterIntensity}%
            </span>
          </div>
          <input
            id="filter-intensity-slider"
            type="range"
            min="0"
            max="100"
            value={filterIntensity}
            onChange={(e) => onChangeFilterIntensity(Number(e.target.value))}
            className="w-full h-2 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-[#E5C378] touch-none"
          />
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#E5C378] text-[#0A0A0A] font-bold shadow-md shadow-[#E5C378]/20'
                : 'bg-[#141414] text-[#A1A1AA] hover:text-white border border-white/5 hover:border-white/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredPresets.map((preset) => {
          const isSelected = filter === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectFilter(preset.id)}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-[#E5C378]/15 border-[#E5C378] shadow-lg shadow-[#E5C378]/10'
                  : 'bg-[#0F0F0F] border-white/10 hover:border-white/20 hover:bg-[#141414]'
              }`}
            >
              {/* Visual Swatch */}
              <div
                className={`w-full h-14 rounded-xl border border-white/10 relative flex items-center justify-center shadow-inner overflow-hidden bg-gradient-to-br ${preset.previewColor}`}
              >
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#E5C378] text-[#0A0A0A] flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                {!isSelected && preset.id === 'none' && (
                  <span className="text-[10px] text-white/70 font-mono">Original</span>
                )}
              </div>

              {/* Preset Label & Tag */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif-display font-semibold text-white truncate">
                    {preset.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#A1A1AA] truncate mt-0.5">
                  {preset.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
