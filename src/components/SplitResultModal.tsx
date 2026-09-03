import React, { useState } from 'react';
import {
  Download,
  Archive,
  Check,
  X,
  Layers,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SplitResult } from '../types';
import { downloadDataUrl, downloadSplitAsZip } from '../utils/canvasUtils';

interface SplitResultModalProps {
  splitResult: SplitResult;
  onClose: () => void;
  onLoadPieceToEditor: (dataUrl: string, pieceName: string) => void;
}

export const SplitResultModal: React.FC<SplitResultModalProps> = ({
  splitResult,
  onClose,
  onLoadPieceToEditor,
}) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadedPart1, setDownloadedPart1] = useState(false);
  const [downloadedPart2, setDownloadedPart2] = useState(false);

  const baseName = splitResult.originalFileName.replace(/\.[^/.]+$/, '') || 'image';
  const label1 = splitResult.direction === 'vertical' ? 'Left' : 'Top';
  const label2 = splitResult.direction === 'vertical' ? 'Right' : 'Bottom';

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E5C378', '#C9A050', '#8CB4FF', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadPart1 = () => {
    downloadDataUrl(splitResult.part1DataUrl, `${baseName}_part_1_${label1.toLowerCase()}.png`);
    setDownloadedPart1(true);
    setTimeout(() => setDownloadedPart1(false), 2500);
  };

  const handleDownloadPart2 = () => {
    downloadDataUrl(splitResult.part2DataUrl, `${baseName}_part_2_${label2.toLowerCase()}.png`);
    setDownloadedPart2(true);
    setTimeout(() => setDownloadedPart2(false), 2500);
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      await downloadSplitAsZip(splitResult);
      triggerConfetti();
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadBothFiles = () => {
    handleDownloadPart1();
    setTimeout(() => {
      handleDownloadPart2();
      triggerConfetti();
    }, 300);
  };

  return (
    <div
      id="split-result-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
    >
      <div
        id="split-result-modal"
        className="bg-[#0D0D0D] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5C378]/20 to-[#B89045]/10 border border-[#E5C378]/40 flex items-center justify-center text-[#E5C378] shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif-display font-bold text-white flex items-center gap-2">
                <span>Split Completed</span>
                <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-[#E5C378]/15 text-[#E5C378] border border-[#E5C378]/30 font-semibold">
                  2 Images Ready
                </span>
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Divided along {splitResult.direction} axis at{' '}
                {(splitResult.splitRatio * 100).toFixed(1)}% ratio
              </p>
            </div>
          </div>
          <button
            id="split-modal-close-btn"
            type="button"
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Previews */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Part 1 Card */}
            <div
              id="split-result-part-1"
              className="bg-[#050505] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 group hover:border-[#8CB4FF]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8CB4FF]" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E0E0E0]">
                    Part 1 ({label1} Half)
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#A1A1AA] bg-[#141414] border border-white/5 px-2 py-0.5 rounded-md">
                  {splitResult.part1Dimensions.width} × {splitResult.part1Dimensions.height} px
                </span>
              </div>

              {/* Image Preview Box */}
              <div className="relative aspect-video max-h-60 bg-[#0F0F0F] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src={splitResult.part1DataUrl}
                  alt={`Split Part 1 (${label1})`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Action Buttons for Part 1 */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id="save-part-1-btn"
                  type="button"
                  onClick={handleDownloadPart1}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#181818] hover:bg-[#222222] text-white text-xs font-medium border border-white/10 hover:border-[#8CB4FF]/50 transition-all cursor-pointer"
                >
                  {downloadedPart1 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#6EE7B7]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#8CB4FF]" />
                      <span>Save Part 1</span>
                    </>
                  )}
                </button>
                <button
                  id="edit-part-1-btn"
                  type="button"
                  onClick={() => onLoadPieceToEditor(splitResult.part1DataUrl, `${baseName}_part_1`)}
                  title="Load this part directly into editor"
                  className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#D4D4D8] hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Part 2 Card */}
            <div
              id="split-result-part-2"
              className="bg-[#050505] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 group hover:border-[#E5C378]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5C378]" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E0E0E0]">
                    Part 2 ({label2} Half)
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#A1A1AA] bg-[#141414] border border-white/5 px-2 py-0.5 rounded-md">
                  {splitResult.part2Dimensions.width} × {splitResult.part2Dimensions.height} px
                </span>
              </div>

              {/* Image Preview Box */}
              <div className="relative aspect-video max-h-60 bg-[#0F0F0F] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src={splitResult.part2DataUrl}
                  alt={`Split Part 2 (${label2})`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Action Buttons for Part 2 */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id="save-part-2-btn"
                  type="button"
                  onClick={handleDownloadPart2}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#181818] hover:bg-[#222222] text-white text-xs font-medium border border-white/10 hover:border-[#E5C378]/50 transition-all cursor-pointer"
                >
                  {downloadedPart2 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#6EE7B7]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#E5C378]" />
                      <span>Save Part 2</span>
                    </>
                  )}
                </button>
                <button
                  id="edit-part-2-btn"
                  type="button"
                  onClick={() => onLoadPieceToEditor(splitResult.part2DataUrl, `${baseName}_part_2`)}
                  title="Load this part directly into editor"
                  className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#D4D4D8] hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Primary Save Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="split-modal-back-btn"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          >
            Back to Editor
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="save-both-files-btn"
              type="button"
              onClick={handleDownloadBothFiles}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-white text-xs font-medium border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Save Both (2 Files)</span>
            </button>

            <button
              id="save-both-zip-btn"
              type="button"
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] hover:from-[#F0D597] hover:to-[#D8AF5F] text-[#0A0A0A] text-xs font-bold shadow-lg shadow-[#E5C378]/20 active:scale-95 transition-all cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              <span>{downloadingZip ? 'Packing Archive...' : 'Save Both as ZIP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
