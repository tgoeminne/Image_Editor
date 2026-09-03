import React, { useEffect, useState } from 'react';
import { Download, Copy, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatBytes } from '../utils/canvasUtils';

interface ExportModalProps {
  canvas: HTMLCanvasElement | null;
  defaultFileName: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  canvas,
  defaultFileName,
  onClose,
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(92);
  const [fileName, setFileName] = useState<string>(
    defaultFileName.replace(/\.[^/.]+$/, '') || 'edited_image'
  );
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  useEffect(() => {
    if (!canvas) return;
    const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
    const q = format === 'png' ? undefined : quality / 100;
    const dataUrl = canvas.toDataURL(mimeType, q);
    setPreviewDataUrl(dataUrl);

    // Approximate size from base64 string length
    const head = `data:${mimeType};base64,`.length;
    const sizeInBytes = Math.round(((dataUrl.length - head) * 3) / 4);
    setEstimatedSize(sizeInBytes);
  }, [canvas, format, quality]);

  const handleDownload = () => {
    if (!previewDataUrl) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const cleanName = fileName.trim() || 'edited_image';
    const link = document.createElement('a');
    link.href = previewDataUrl;
    link.download = `${cleanName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#E5C378', '#C9A050', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleCopyToClipboard = async () => {
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 'image/png');
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  if (!canvas) return null;

  return (
    <div
      id="export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
    >
      <div
        id="export-modal"
        className="bg-[#0D0D0D] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5C378]/20 to-[#B89045]/10 border border-[#E5C378]/40 flex items-center justify-center text-[#E5C378] shadow-inner">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif-display font-bold text-white">Export & Save Image</h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5 font-mono">
                {canvas.width} × {canvas.height} px • ~{formatBytes(estimatedSize)}
              </p>
            </div>
          </div>
          <button
            id="export-modal-close-btn"
            type="button"
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Preview Thumbnail */}
          <div className="w-full aspect-video bg-[#050505] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center relative">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Export Preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-xs text-[#71717A] font-mono">Generating preview...</div>
            )}
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#0A0A0A]/90 text-[#E5C378] text-[10px] font-mono border border-white/10">
              {format.toUpperCase()}
            </div>
          </div>

          {/* Filename Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">File Name</label>
            <div className="flex items-center gap-2">
              <input
                id="export-filename-input"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="edited_image"
                className="flex-1 bg-[#050505] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] transition-all font-mono"
              />
              <span className="text-xs font-mono text-[#A1A1AA] px-1">
                .{format === 'jpeg' ? 'jpg' : format}
              </span>
            </div>
          </div>

          {/* Format Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  id={`export-format-${fmt}-btn`}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    format === fmt
                      ? 'bg-[#E5C378]/15 border-[#E5C378] text-[#E5C378] shadow-sm'
                      : 'bg-[#050505] border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="font-bold uppercase tracking-wider">{fmt}</span>
                  <span className="text-[10px] opacity-75 font-sans">
                    {fmt === 'png' ? 'Lossless' : fmt === 'jpeg' ? 'Standard' : 'Modern'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPEG / WebP) */}
          {format !== 'png' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                <span className="font-semibold uppercase tracking-wider">Quality</span>
                <span className="font-mono text-[#E5C378] font-bold">{quality}%</span>
              </div>
              <input
                id="export-quality-slider"
                type="range"
                min="20"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-1.5 bg-[#1F1F1F] rounded-lg appearance-none cursor-pointer accent-[#E5C378]"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between gap-3">
          <button
            id="export-copy-clipboard-btn"
            type="button"
            onClick={handleCopyToClipboard}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#D4D4D8] hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#6EE7B7]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              id="export-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="export-download-btn"
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] hover:from-[#F0D597] hover:to-[#D8AF5F] text-[#0A0A0A] text-xs font-bold shadow-lg shadow-[#E5C378]/20 active:scale-95 transition-all cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
