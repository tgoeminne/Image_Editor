import React, { useEffect, useRef, useState } from 'react';
import { AspectRatioOption, CropRect } from '../types';

interface CropOverlayProps {
  imageWidth: number;
  imageHeight: number;
  containerWidth: number;
  containerHeight: number;
  aspectRatio: AspectRatioOption;
  onCropChange: (crop: CropRect) => void;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight,
  aspectRatio,
  onCropChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Crop rect in pixels relative to container
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: containerWidth * 0.1,
    y: containerHeight * 0.1,
    width: containerWidth * 0.8,
    height: containerHeight * 0.8,
  });

  const isDraggingRef = useRef<{
    type: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';
    startX: number;
    startY: number;
    startCrop: { x: number; y: number; width: number; height: number };
  } | null>(null);

  // Initialize crop rect based on aspect ratio
  useEffect(() => {
    let w = containerWidth * 0.85;
    let h = containerHeight * 0.85;

    let targetRatio: number | null = null;
    if (aspectRatio === '1:1') targetRatio = 1;
    else if (aspectRatio === '4:3') targetRatio = 4 / 3;
    else if (aspectRatio === '16:9') targetRatio = 16 / 9;
    else if (aspectRatio === '3:2') targetRatio = 3 / 2;
    else if (aspectRatio === '9:16') targetRatio = 9 / 16;
    else if (aspectRatio === '2:3') targetRatio = 2 / 3;

    if (targetRatio !== null) {
      if (w / h > targetRatio) {
        w = h * targetRatio;
      } else {
        h = w / targetRatio;
      }
    }

    const initial = {
      x: (containerWidth - w) / 2,
      y: (containerHeight - h) / 2,
      width: w,
      height: h,
    };
    setCrop(initial);
    emitCrop(initial);
  }, [aspectRatio, containerWidth, containerHeight]);

  const emitCrop = (c: { x: number; y: number; width: number; height: number }) => {
    // Normalize to 0..1 scale relative to image render area
    const scaleX = imageWidth / containerWidth;
    const scaleY = imageHeight / containerHeight;

    onCropChange({
      x: Math.max(0, c.x * scaleX),
      y: Math.max(0, c.y * scaleY),
      width: Math.min(imageWidth, c.width * scaleX),
      height: Math.min(imageHeight, c.height * scaleY),
    });
  };

  const handlePointerDown = (
    e: React.PointerEvent,
    type: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    isDraggingRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const { type, startX, startY, startCrop } = isDraggingRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let { x, y, width, height } = startCrop;
    const minSize = 40;

    let targetRatio: number | null = null;
    if (aspectRatio === '1:1') targetRatio = 1;
    else if (aspectRatio === '4:3') targetRatio = 4 / 3;
    else if (aspectRatio === '16:9') targetRatio = 16 / 9;
    else if (aspectRatio === '3:2') targetRatio = 3 / 2;
    else if (aspectRatio === '9:16') targetRatio = 9 / 16;
    else if (aspectRatio === '2:3') targetRatio = 2 / 3;

    if (type === 'move') {
      x = Math.max(0, Math.min(containerWidth - width, startCrop.x + dx));
      y = Math.max(0, Math.min(containerHeight - height, startCrop.y + dy));
    } else {
      if (type.includes('e')) {
        width = Math.max(minSize, Math.min(containerWidth - startCrop.x, startCrop.width + dx));
      }
      if (type.includes('s')) {
        height = Math.max(minSize, Math.min(containerHeight - startCrop.y, startCrop.height + dy));
      }
      if (type.includes('w')) {
        const proposedW = startCrop.width - dx;
        if (proposedW >= minSize && startCrop.x + dx >= 0) {
          x = startCrop.x + dx;
          width = proposedW;
        }
      }
      if (type.includes('n')) {
        const proposedH = startCrop.height - dy;
        if (proposedH >= minSize && startCrop.y + dy >= 0) {
          y = startCrop.y + dy;
          height = proposedH;
        }
      }

      // Constrain aspect ratio if locked
      if (targetRatio !== null) {
        if (width / height > targetRatio) {
          width = height * targetRatio;
        } else {
          height = width / targetRatio;
        }
      }
    }

    const nextCrop = { x, y, width, height };
    setCrop(nextCrop);
    emitCrop(nextCrop);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      isDraggingRef.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      id="crop-overlay-container"
      className="absolute inset-0 pointer-events-auto select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Darkened backdrop around crop */}
      <div
        className="absolute top-0 left-0 right-0 bg-black/75 backdrop-blur-[1px]"
        style={{ height: Math.max(0, crop.y) }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-[1px]"
        style={{ height: Math.max(0, containerHeight - (crop.y + crop.height)) }}
      />
      <div
        className="absolute bg-black/75 backdrop-blur-[1px]"
        style={{
          top: crop.y,
          left: 0,
          width: Math.max(0, crop.x),
          height: crop.height,
        }}
      />
      <div
        className="absolute bg-black/75 backdrop-blur-[1px]"
        style={{
          top: crop.y,
          left: crop.x + crop.width,
          right: 0,
          height: crop.height,
        }}
      />

      {/* Interactive Crop Frame */}
      <div
        id="crop-selection-box"
        className="absolute cursor-move border-2 border-[#E5C378] shadow-2xl"
        style={{
          left: crop.x,
          top: crop.y,
          width: crop.width,
          height: crop.height,
        }}
        onPointerDown={(e) => handlePointerDown(e, 'move')}
      >
        {/* Rule of thirds grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div />
        </div>

        {/* Dimension indicator badge */}
        <div className="absolute -top-7 left-0 px-2.5 py-0.5 rounded bg-[#0A0A0A] text-[#E5C378] text-xs font-mono font-medium tracking-tight shadow-md border border-white/15 pointer-events-none">
          {Math.round(crop.width * (imageWidth / containerWidth))} ×{' '}
          {Math.round(crop.height * (imageHeight / containerHeight))} px
        </div>

        {/* 4 Corner Handles */}
        <div
          id="crop-handle-nw"
          className="absolute -top-2 -left-2 w-4 h-4 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-nwse-resize shadow-md"
          onPointerDown={(e) => handlePointerDown(e, 'nw')}
        />
        <div
          id="crop-handle-ne"
          className="absolute -top-2 -right-2 w-4 h-4 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-nesw-resize shadow-md"
          onPointerDown={(e) => handlePointerDown(e, 'ne')}
        />
        <div
          id="crop-handle-sw"
          className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-nesw-resize shadow-md"
          onPointerDown={(e) => handlePointerDown(e, 'sw')}
        />
        <div
          id="crop-handle-se"
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-nwse-resize shadow-md"
          onPointerDown={(e) => handlePointerDown(e, 'se')}
        />

        {/* 4 Edge Handles */}
        <div
          id="crop-handle-n"
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-ns-resize shadow"
          onPointerDown={(e) => handlePointerDown(e, 'n')}
        />
        <div
          id="crop-handle-s"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-ns-resize shadow"
          onPointerDown={(e) => handlePointerDown(e, 's')}
        />
        <div
          id="crop-handle-w"
          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-ew-resize shadow"
          onPointerDown={(e) => handlePointerDown(e, 'w')}
        />
        <div
          id="crop-handle-e"
          className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#E5C378] border-2 border-[#0A0A0A] rounded-sm cursor-ew-resize shadow"
          onPointerDown={(e) => handlePointerDown(e, 'e')}
        />
      </div>
    </div>
  );
};
