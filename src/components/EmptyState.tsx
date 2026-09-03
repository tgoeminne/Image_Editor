import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Scissors,
  Sliders,
  Crop,
  Sparkles,
  ArrowRight,
  FileImage,
} from 'lucide-react';
import { SAMPLE_IMAGES, SampleImage } from '../utils/sampleImages';

interface EmptyStateProps {
  onImageSelected: (dataUrl: string, fileName: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: SampleImage) => {
    onImageSelected(sample.url, `${sample.id}.jpg`);
  };

  return (
    <div
      id="empty-state-view"
      className="flex-1 overflow-y-auto bg-[#0A0A0A] flex flex-col items-center justify-center p-6 sm:p-12 select-none"
    >
      <div className="max-w-3xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C378]/10 border border-[#E5C378]/30 text-[#E5C378] text-xs font-semibold tracking-wider font-serif">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Atelier & Darkroom Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-display font-bold text-white tracking-tight leading-tight">
            Image Studio <span className="italic text-[#E5C378]">& Precision Splitter</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-lg mx-auto font-light leading-relaxed">
            Crop, rotate, filter, tweak lighting parameters, and interactively divide images with surgical split guidelines.
          </p>
        </div>

        {/* Upload Drop Zone */}
        <div
          id="dropzone-box"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-[#E5C378] bg-[#E5C378]/10 scale-[1.01] shadow-[0_0_30px_rgba(229,195,120,0.2)]'
              : 'border-white/15 hover:border-[#E5C378]/60 bg-[#0F0F0F] hover:bg-[#141414] shadow-2xl'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5C378]/20 to-[#B89045]/10 border border-[#E5C378]/40 flex items-center justify-center text-[#E5C378] shadow-inner group-hover:scale-105 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <p className="text-base font-medium text-white">
                Drag & drop your photograph here, or{' '}
                <span className="text-[#E5C378] underline underline-offset-4 decoration-[#E5C378]/60">browse files</span>
              </p>
              <p className="text-xs text-[#71717A] tracking-wide font-light">
                Supports JPG, PNG, WebP, SVG, GIF • High-resolution ready • Clipboard paste (Ctrl+V) anywhere
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center text-center gap-1.5 hover:border-white/20 transition-colors">
            <div className="p-2 rounded-xl bg-[#1A1A1A] text-[#E5C378] border border-white/5">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Precision Split</span>
            <span className="text-[11px] text-[#71717A]">Interactive division line</span>
          </div>

          <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center text-center gap-1.5 hover:border-white/20 transition-colors">
            <div className="p-2 rounded-xl bg-[#1A1A1A] text-[#8CB4FF] border border-white/5">
              <Crop className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Crop Framing</span>
            <span className="text-[11px] text-[#71717A]">1:1, 16:9, 4:3 presets</span>
          </div>

          <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center text-center gap-1.5 hover:border-white/20 transition-colors">
            <div className="p-2 rounded-xl bg-[#1A1A1A] text-[#FF85A0] border border-white/5">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Darkroom Tuning</span>
            <span className="text-[11px] text-[#71717A]">Exposure, contrast & blur</span>
          </div>

          <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center text-center gap-1.5 hover:border-white/20 transition-colors">
            <div className="p-2 rounded-xl bg-[#1A1A1A] text-[#C4B5FD] border border-white/5">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Curated Filters</span>
            <span className="text-[11px] text-[#71717A]">Vintage, Noir, Emerald</span>
          </div>
        </div>

        {/* Sample Images Gallery */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <h2 className="text-xs font-serif-display text-sm font-semibold tracking-wider text-white uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
              <span>Explore Sample Gallery</span>
            </h2>
            <span className="text-xs text-[#71717A] italic font-serif">Click any photograph to test</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                id={`sample-image-btn-${sample.id}`}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="group relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 hover:border-[#E5C378] bg-[#121212] transition-all text-left shadow-lg cursor-pointer"
              >
                <img
                  src={sample.url}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-xs font-serif-display font-bold text-white truncate">
                    {sample.title}
                  </span>
                  <span className="text-[10px] text-[#D4D4D8] truncate font-sans">
                    {sample.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
